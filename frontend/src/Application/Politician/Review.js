/**
 * Created by vathavaria on 6/23/17.
 */

import React from "react";
import { Component } from "react/lib/ReactBaseClasses";
import { withCookies, Cookies } from "react-cookie";
import moment from "moment";
import { ControlLabel, FormControl, FormGroup, InputGroup } from "react-bootstrap";
import { CopyToClipboard } from "react-copy-to-clipboard";
// import { encrypt } from "../../utils/security";
import { graphql, gql, compose } from "react-apollo";
import PropTypes from "prop-types";

const PoliticianInfo = props => {
    const { politician } = props;
    if (!politician || !politician.firstName) return null;
    return (
        <div className="review-politician-info">
            <img src={politician.avatarUrl} alt="politicianImage" />
            <div className="politician-info">
                <div className="politician-info-field">
                    {politician.publicOfficeTitle.displayName}
                </div>
                <div className="politician-name">
                    {politician.firstName} {politician.lastName}
                </div>
                <div className="politician-info-field">{politician.politicalParty}</div>
            </div>
        </div>
    );
};

class Review extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            open: false,
            value: "",
            copied: false,
            showShareURL: false,
            reactedUp: false,
            reactedDown: false,
            upVoteCount: 0,
            downVoteCount: 0,
            reported: false
        };
    }

    componentDidMount() {
        this.setState({
            value: window.location.href,
            showShareURL: this.props.showShareURL,
            upVoteCount: this.props.data.upVote,
            downVoteCount: this.props.data.downVote
        });
    }

    componentWillMount() {
        const { cookies, data } = this.props;
        const emotionalReaction = cookies.get("emotionalReaction") || {};
        if (data.id in emotionalReaction) {
            if (emotionalReaction[data.id]) {
                this.setState({ reactedUp: true });
            } else {
                this.setState({ reactedDown: true });
            }
        }
    }

    render() {
        const { data, cookies } = this.props;
        const review = data;
        const { reactedUp, reactedDown, upVoteCount, downVoteCount, reported } = this.state;

        let sentimentClass = this.props.approve ? "color_approve" : "color_disapprove";
        let sentimentText = this.props.approve ? "Approve" : "Disapprove";
        if (review.status === "PENDING") sentimentText += " (Pending)";
        sentimentClass += " content_title_2";

        const reasons = review.tags.map((tag, index) => (
            <div key={index} className="btn btn-tags">
                #{tag}
            </div>
        ));

        const actionIconHandler = thumbUp => {
            this.props
                .updateReview({ variables: { reviewId: review.id, upVote: thumbUp } })
                .then(({ data }) => {
                    let emotionalReaction = cookies.get("emotionalReaction") || {};
                    emotionalReaction[review.id] = thumbUp;
                    cookies.set("emotionalReaction", emotionalReaction, { path: "/" });
                    if (thumbUp) {
                        this.setState({ upVoteCount: upVoteCount + 1, reactedUp: true });
                    } else {
                        this.setState({ downVoteCount: downVoteCount + 1, reactedDown: true });
                    }
                });
        };

        const ellipsify = (str, length) => {
            if (str.length > length && !this.state.open) {
                return (
                    <div>
                        <div className="content_title_2_text">
                            {str.substring(0, length) + "..."}
                        </div>
                        <button
                            className="read-more"
                            onClick={e => {
                                e.stopPropagation();
                                this.setState({ open: !this.state.open });
                            }}
                        >
                            Read More <i className="fa fa-angle-down" aria-hidden="true" />
                        </button>
                    </div>
                );
            } else {
                return <div className="content_title_2_text">{str}</div>;
            }
        };

        const report = () => {
            this.setState({ reported: true });
            this.props.reportReview({ variables: { reviewId: review.id } });
        };

        const created_moment = moment(review.created);

        return (
            <div className="divisor">
                <PoliticianInfo politician={review.politician} />
                <div className="article_section_1">
                    <div className={sentimentClass}>{sentimentText}</div>
                    <div className="content_title_2_sub">Anonymous</div>
                    <div className="content_title_2_ciudad margin_abajo_small">
                        {review.location}
                    </div>
                    <div className="content_title_2_ciudad">
                        {created_moment.format("MMMM Do, YYYY")}
                    </div>
                </div>
                <div className="article_section_3">{reasons}</div>
                <div className="article_section_4 margin_abajo_mini ">
                    {ellipsify(review.body, 120)}
                </div>
                <div className="action-icons">
                    <button
                        className={"voter " + (reactedUp ? "upvoted" : "")}
                        onClick={() => {
                            if (!(reactedUp || reactedDown)) {
                                actionIconHandler(true);
                            }
                        }}
                    >
                        <span className="vote-text">{reactedUp ? "Upvoted" : "Upvote"}</span>
                        <span className="vote-count">{upVoteCount}</span>
                    </button>
                    <a className="report-link" onClick={report}>
                        {reported ? "Reported" : "Report abuse"}
                    </a>
                </div>

                {this.state.showShareURL && (
                    <div className="margin_abajo_big">
                        <ControlLabel>Copy this private URL to share:</ControlLabel>
                        <FormGroup>
                            <InputGroup>
                                <FormControl
                                    id="fullnametxt"
                                    type="text"
                                    value={this.state.value}
                                    onChange={({ target: { value } }) =>
                                        this.setState({ value, copied: false })
                                    }
                                />
                                <InputGroup.Button>
                                    <CopyToClipboard
                                        text={this.state.value}
                                        onCopy={() => this.setState({ copied: true })}
                                    >
                                        <button>{this.state.copied ? "Copied" : "Copy"}</button>
                                    </CopyToClipboard>
                                </InputGroup.Button>
                            </InputGroup>
                        </FormGroup>
                    </div>
                )}
            </div>
        );
    }
}

Review.propTypes = {
    cookies: PropTypes.instanceOf(Cookies).isRequired
};

const updateReview = gql`
    mutation updateReview($reviewId: ID!, $upVote: Boolean!) {
        updateReview(reviewId: $reviewId, upVote: $upVote) {
            review {
                id
            }
        }
    }
`;

const reportReview = gql`
    mutation reportReview($reviewId: ID!) {
        reportReview(reviewId: $reviewId) {
            review {
                id
            }
        }
    }
`;

Review = compose(
    graphql(updateReview, { name: "updateReview" }),
    graphql(reportReview, { name: "reportReview" })
)(Review);
export default withCookies(Review);
