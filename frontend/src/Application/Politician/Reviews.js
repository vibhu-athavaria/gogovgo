/**
 * Created by vathavaria on 6/23/17.
 */

import React from "react";
import { Component } from "react/lib/ReactBaseClasses";
import Review from "./Review";
import { withCookies, Cookies } from "react-cookie";
import { Col, Row } from "react-bootstrap";
import PropTypes from "prop-types";

import PollModal from "../Poll/Modal";

class Reviews extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            showPoll: false,
            rated: false,
            reviewTab: "Approve"
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

    render() {
        // Event handlers
        const pollModelClose = () => this.setState({ showPoll: false });

        let leftReviews = 0;
        let rightReviews = 0;
        let approvedReviews = [];
        let disapprovedReviews = [];
        this.props.reviews.forEach(function(review, index) {
            if (review.status === "APPROVED") {
                if (review.sentiment === "POSITIVE") {
                    approvedReviews.push(
                        <Review key={"approve:" + index} data={review} approve={true} />
                    );
                    leftReviews += 1;
                } else {
                    disapprovedReviews.push(
                        <Review key={"disapprove:" + index} data={review} approve={false} />
                    );
                    rightReviews += 1;
                }
            }
        });

        const topNegativeTags = this.props.negativeTags.slice(0, 5).map((tag, index) => (
            <button type="button" className="btn btn-tags" key={index}>
                #{tag}
            </button>
        ));

        const topPostiveTags = this.props.positiveTags.slice(0, 5).map((tag, index) => (
            <button type="button" className="btn btn-tags" key={index}>
                #{tag}
            </button>
        ));

        const getStyle = () => {
            if (leftReviews >= rightReviews) {
                return { borderRight: "1px solid #efefef" };
            } else {
                return { borderLeft: "1px solid #efefef" };
            }
        };

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
                        <div className="titulo_content text-center marg_top_large">Reviews</div>
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
                    <Row>
                        <Col lg={6} sm={6} className="review-approve" style={getStyle()}>
                            {approvedReviews}
                        </Col>
                        <Col lg={6} sm={6} className="review-disapprove" style={getStyle()}>
                            {disapprovedReviews}
                        </Col>
                    </Row>
                </div>

                <Row>
                    <Col sm={6}>
                        <button className="btn btn-default btn-see-more pull-right" type="submit">
                            See more
                        </button>
                    </Col>
                    <Col sm={6}>
                        <button
                            className="btn btn-primary btn-see-more-primary pull-left"
                            type="submit"
                            onClick={() => {
                                this.setState({ showPoll: !this.state.rated });
                            }}
                        >
                            {this.state.rated ? "You Already Rated!" : "Submit Review"}
                        </button>
                    </Col>
                </Row>

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

export default withCookies(Reviews);
