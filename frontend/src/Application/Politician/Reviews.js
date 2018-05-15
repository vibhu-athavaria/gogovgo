/**
 * Created by vathavaria on 6/23/17.
 */

import React from "react";
import { Component } from "react/lib/ReactBaseClasses";
import Review from "./Review";
import { withCookies, Cookies } from "react-cookie";
import { Col, Row } from "react-bootstrap";
import PropTypes from "prop-types";
import { gql, graphql } from "react-apollo";

import PollModal from "../Poll/Modal";
import ReviewsPagination from "./ReviewsPagination";
import Map from "./Map";

import LocationFilter from "./LocationFilter";

const Legend = props => (
    <div className="row-flex map-legend">
        <span className="color_approve">Approve</span>
        <span className="legend-bar" />
        <span className="color_disapprove">Disapprove</span>
    </div>
);

class Reviews extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            showPoll: false,
            rated: false,
            reviewTab: "Approve",
            country: "US",
            filters: {}
        };
    }

    componentWillMount() {
        const { cookies, politicianId } = this.props;
        const rated = cookies.get("rated") || {};
        if (politicianId in rated) {
            this.setState({ rated: true });
        }
    }

    reviewTabChange(event, item) {
        event.preventDefault();
        this.setState({ reviewTab: item });
    }

    /**
     * Logic to load more results in paginated Query
     */
    onFetchPage = page => {
        const {
            data: { fetchMore }
        } = this.props;
        fetchMore({
            variables: {
                id: parseInt(this.props.politicianId, 10),
                page: page,
                ...this.state.filters
            },
            updateQuery: (previousResult, { fetchMoreResult, queryVariables }) => {
                return fetchMoreResult;
            }
        });
    };

    onFilter = filters => {
        this.setState({ filters: filters });
        const {
            data: { fetchMore }
        } = this.props;
        fetchMore({
            variables: { id: parseInt(this.props.politicianId, 10), page: 1, ...filters },
            updateQuery: (previousResult, { fetchMoreResult, queryVariables }) => {
                return fetchMoreResult;
            }
        });
    };

    render() {
        const { data } = this.props;

        // Event handlers
        const pollModelClose = () => this.setState({ showPoll: false });

        //  Reviews & top tags
        let approvedReviews = [];
        let disapprovedReviews = [];
        let topNegativeTags = [];
        let topPostiveTags = [];
        if (data.reviews) {
            approvedReviews = data.reviews.positive.map((review, index) => (
                <Review key={"approve:" + review.id} data={review} approve={true} />
            ));
            disapprovedReviews = data.reviews.negative.map((review, index) => (
                <Review key={"disapprove:" + review.id} data={review} approve={false} />
            ));
            topNegativeTags = data.reviews.negativeTags.map((tag, index) => (
                <div className="btn btn-tags" key={index}>
                    <span className="tag-name">#{tag[0]}</span>
                    <span className="tag-weight">{tag[1]}</span>
                </div>
            ));
            topPostiveTags = data.reviews.positiveTags.map((tag, index) => (
                <div className="btn btn-tags" key={index}>
                    <span className="tag-name">#{tag[0]}</span>
                    <span className="tag-weight">{tag[1]}</span>
                </div>
            ));
        }

        const getItemClass = item => {
            let className = "r-item " + item.toLowerCase();
            if (item === this.state.reviewTab) className += " active";
            return className;
        };
        const mobileReviewTabs = ["Approve", "Disapprove"].map((item, i) => (
            <button
                key={i}
                onClick={e => this.reviewTabChange(e, item)}
                className={getItemClass(item)}
            >
                {item}
            </button>
        ));
        const reviewNav = <div className="r-tabs">{mobileReviewTabs}</div>;

        const getMobileClass = classNames => {
            return classNames + " tab-" + this.state.reviewTab.toLowerCase();
        };

        return (
            <Col>
                <Row>
                    <Col xs={12} lg={12} md={18}>
                        <div className="titulo_content text-center marg_top_large">
                            Ratings &amp; Reviews
                        </div>
                    </Col>
                </Row>

                <Row style={{ marginBottom: "40px" }}>
                    <Col sm={8} className="col-map">
                        <Map country={this.state.country} politicianId={this.props.politicianId} />
                        <Legend />
                    </Col>
                    <Col sm={4}>
                        <LocationFilter
                            onCountryChange={country => this.setState({ country: country })}
                            filter={this.onFilter}
                        />
                    </Col>
                </Row>

                {/* selector for approved or disapproved reviews on mobile devices */}
                {reviewNav}

                <Row
                    className={getMobileClass(
                        "margin_abajo_medium text-center title-approve-disapprove"
                    )}
                >
                    <Col sm={6} className="heading heading-approve">
                        <div className="content_title color_approve margin_abajo_small">
                            Approve
                        </div>

                        <div className="content_text margin_abajo_small">
                            Top #hashtags why people <span className="color_approve">approve </span>
                            of the way {this.props.politicianName} is handling his job as{" "}
                            {this.props.politicianTitle}:
                        </div>
                        <div className="content_tag">
                            <div className="row">
                                <div className="col col-md-12 text-center">{topPostiveTags}</div>
                            </div>
                        </div>
                    </Col>

                    <Col sm={6} className="heading heading-disapprove">
                        <div className="content_title color_disapprove margin_abajo_small">
                            Disapprove
                        </div>
                        <div className="content_text margin_abajo_small ">
                            Top #hashtags why people
                            <span className="color_disapprove"> disapprove </span> of the way{" "}
                            {this.props.politicianName} is handling his job as{" "}
                            {this.props.politicianTitle}:
                        </div>
                        <div className="content_tag">
                            <div className="row ">
                                <div className="col col-md-12 text-center">{topNegativeTags}</div>
                            </div>
                        </div>
                    </Col>
                </Row>

                <div className={getMobileClass("contenedor_articulos text-left")}>
                    <div className="row-flex">
                        <div className="col-flex review-approve">{approvedReviews}</div>
                        <div className="col-flex review-disapprove">{disapprovedReviews}</div>
                    </div>
                </div>

                <div>
                    <ReviewsPagination reviews={data.reviews} setPage={this.onFetchPage} />
                </div>
                <div>
                    <button
                        className="btn btn-primary btn-see-more-primary"
                        type="submit"
                        onClick={() => {
                            this.setState({ showPoll: !this.state.rated });
                        }}
                    >
                        {this.state.rated ? "You Already Rated!" : "Submit Review"}
                    </button>
                </div>
                {this.state.showPoll && (
                    <PollModal {...this.props} show={true} onHide={pollModelClose} />
                )}
            </Col>
        );
    }
}

Reviews.propTypes = {
    cookies: PropTypes.instanceOf(Cookies).isRequired
};

const ReviewWithCookies = withCookies(Reviews);

// Initialize GraphQL queries or mutations with the `gql` tag
const getReviews = gql`
    query getReviews(
        $id: Int!
        $page: Int!
        $country: String!
        $state: String!
        $timelimit: String!
    ) {
        reviews(id: $id, page: $page, country: $country, state: $state, timelimit: $timelimit) {
            page
            pages
            hasMore
            positiveTags
            negativeTags
            positive {
                id
                user {
                    firstName
                    lastName
                }
                sentiment
                tags
                status
                location
                body
                upVote
                downVote
                created
            }
            negative {
                id
                user {
                    firstName
                    lastName
                }
                sentiment
                tags
                status
                location
                body
                upVote
                downVote
                created
            }
        }
    }
`;

const ReviewsWithData = graphql(getReviews, {
    options: props => ({
        variables: {
            id: parseInt(props.politicianId, 10),
            page: 1,
            country: "US",
            state: "all",
            timelimit: "all"
        }
    })
})(ReviewWithCookies);

export default ReviewsWithData;
