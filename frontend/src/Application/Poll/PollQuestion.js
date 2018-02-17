/**
 * Created by vathavaria on 7/13/17.
 */

import React from "react";
import ReactGA from "react-ga";
import { Component } from "react/lib/ReactBaseClasses";
import { Alert, Col, Modal, Row } from "react-bootstrap";
import PollKeywords from "./PollKeywords";

class PollQuestion extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            showSelf: true,
            showKeywordModel: false,
            approved: false
        };
    }

    /**
     * Handle click on Approve or Disapprove button
     * @param {boolean} isApproved - approve if this is true else disapprove
     */
    showPollKeywordModal(isApproved) {
        //	track event
        ReactGA.event({
            category: "User",
            action: "Modal_Approve_or_Disapprove",
            label: isApproved ? "approve" : "disapprove"
        });
        //  Go to next modal
        this.setState({
            showSelf: false,
            showKeywordModel: true,
            approved: isApproved
        });
    }

    /**
     * Component layout
     * @returns JSX
     */
    render() {
        const {
            approvalCount,
            disapprovalCount,
            onHide,
            politicianId,
            politicianName,
            politicianTitle,
            positiveTags,
            negativeTags,
            ...restProps
        } = this.props;

        const { approved } = this.state;

        const pollKeywordModalClose = closeParent => {
            this.setState({ showKeywordModel: false, showSelf: !closeParent });
            if (closeParent === true) {
                onHide();
            }
        };

        return (
            <div>
                {this.state.showSelf && (
                    <Modal {...restProps} onHide={() => onHide()} dialogClassName="custom-modal">
                        <Modal.Header closeButton />
                        <Modal.Body>
                            <div className="texto_modales_center">
                                <div className="margin_abajo_big">
                                    Do you <span className="color_approve">approve</span> or{" "}
                                    <span className="color_disapprove">disapprove</span> of the way{" "}
                                    {this.props.politicianName} is handling his job as{" "}
                                    {this.props.politicianTitle}?
                                    <br />
                                    <span className="modal_text_small">
                                        Reviews are published publicly, organized by topic, and sent
                                        directly to politicians.
                                    </span>
                                </div>

                                <Row className="justify-content-center margin_abajo_big">
                                    <Col
                                        xsOffset={1}
                                        xs={5}
                                        mdOffset={1}
                                        md={5}
                                        className="text-center"
                                    >
                                        <a
                                            className="btn btn-secondary btn_circle modal_btn approve"
                                            href="#"
                                            onClick={() => this.showPollKeywordModal(true)}
                                        >
                                            <i
                                                className="fa fa-thumbs-up align-middle"
                                                aria-hidden="true"
                                            />
                                            <div className="box">
                                                <span className="votes">{approvalCount}</span>
                                                <span>Approve</span>
                                            </div>
                                        </a>
                                    </Col>
                                    <Col
                                        xs={5}
                                        xsPull={1}
                                        md={5}
                                        mdPull={1}
                                        className="text-center"
                                    >
                                        <a
                                            className="btn btn-secondary btn_circle modal_btn disapprove"
                                            href="#"
                                            onClick={() => this.showPollKeywordModal(false)}
                                        >
                                            <i className="fa fa-thumbs-down" aria-hidden="true" />
                                            <div className="box">
                                                <span className="votes">{disapprovalCount}</span>
                                                <span>Disapprove</span>
                                            </div>
                                        </a>
                                    </Col>
                                </Row>
                            </div>
                        </Modal.Body>
                        <Modal.Footer />
                    </Modal>
                )}
                <PollKeywords
                    show={this.state.showKeywordModel}
                    onHide={pollKeywordModalClose}
                    approved={approved}
                    politicianId={politicianId}
                    politicianName={politicianName}
                    politicianTitle={politicianTitle}
                    suggestedTags={approved ? positiveTags : negativeTags}
                />
            </div>
        );
    }
}

export default PollQuestion;
