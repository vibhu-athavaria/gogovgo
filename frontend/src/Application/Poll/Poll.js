/**
 * Created by vathavaria on 6/23/17.
 */

import React from "react";
import { Component } from "react/lib/ReactBaseClasses";
import { withCookies, Cookies } from "react-cookie";
import { Col, Row } from "react-bootstrap";
import PropTypes from "prop-types";
import ReactGA from "react-ga";

import BaseModal from "./Modal";

class Poll extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            showPoll: false,
            approved: false,
            rated: false,
            ratedSentiment: ""
        };
    }

    componentWillMount() {
        const { cookies, politicianId } = this.props;
        const rated = cookies.get("rated") || {};
        if (politicianId in rated) {
            this.setState({
                rated: true,
                ratedSentiment: rated[politicianId]
            });
        }
    }

    render() {
        const { rated, ratedSentiment } = this.state;

        const pollModelClose = () => {
            this.setState({ showPoll: false });
        };

        const showPollModel = isApproved => {
            ReactGA.event({
                category: "User",
                action: "Clicks_RateYourPolitician"
            });
            this.setState({
                showPoll: true,
                approved: isApproved
            });
        };

        const modalProps = {
            onHide: pollModelClose,
            politicianId: this.props.politicianId,
            politicianName: this.props.politicianName,
            politicianTitle: this.props.politicianTitle,
            approvalCount: this.props.approvalCount,
            disapprovalCount: this.props.disapprovalCount,
            positiveTags: this.props.positiveTags,
            negativeTags: this.props.negativeTags
        };

        return (
            <div className="approval-wrapper">
                <div className="emotion-icons">
                    <Row>
                        <div className="titulo_content text-center marg_top_large visible-xs">
                            Approval Rating
                        </div>
                        <Col xs={6} sm={3} md={4} lg={5}>
                            <Row>
                                <Col xs={4} sm={4} md={3} lg={3}>
                                    <i className="fa fa-thumbs-up fa-stack-2x" aria-hidden="true" />
                                </Col>
                                <Col>
                                    <div className="box">
                                        <span className="votes">{this.props.approvalCount}</span>
                                        <span>Approve</span>
                                    </div>
                                </Col>
                            </Row>
                        </Col>
                        <Col xs={6} sm={9} md={8} lg={7}>
                            <Row>
                                <Col xs={4} sm={4} md={3} lg={3}>
                                    <i
                                        className="fa fa-thumbs-down fa-flip-horizontal fa-stack-2x"
                                        aria-hidden="true"
                                    />
                                </Col>
                                <Col>
                                    <div className="box">
                                        <span className="votes">{this.props.disapprovalCount}</span>
                                        <span>Disapprove</span>
                                    </div>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </div>
                <Row>
                    <div>
                        <button
                            className={
                                "btn btn-secondary poll_btn_circle " +
                                (rated ? "rated-" + ratedSentiment : "")
                            }
                            onClick={() => (!rated ? showPollModel(false) : "")}
                        >
                            {rated ? "You Already Rated!" : "Submit Review"}
                        </button>
                        <div className="share-your-opinion-b">Safe. Secure. Anonymous.</div>
                    </div>
                </Row>

                {this.state.showPoll && <BaseModal {...modalProps} />}
            </div>
        );
    }
}

Poll.propTypes = {
    cookies: PropTypes.instanceOf(Cookies).isRequired
};

export default withCookies(Poll);
