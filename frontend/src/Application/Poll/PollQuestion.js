/**
 * Created by vathavaria on 7/13/17.
 */

import React from "react";
import ReactGA from "react-ga";
import { Modal, Row } from "react-bootstrap";

const PollQuestion = props => {
    const { approvalCount, disapprovalCount, politicianName, politicianTitle } = props;

    /**
     * Handle click on Approve or Disapprove button
     * @param {boolean} isApproved - approve if this is true else disapprove
     */
    const next = isApproved => {
        //	track event
        ReactGA.event({
            category: "User",
            action: "Modal_Approve_or_Disapprove",
            label: isApproved ? "approve" : "disapprove"
        });
        //  Go to next modal
        props.next({ approved: isApproved });
    };

    return (
        <Modal show={true} dialogClassName="custom-modal">
            <Modal.Body>
                <div className="texto_modales_center">
                    <div className="margin_abajo_big">
                        Do you <span className="color_approve">approve</span> or{" "}
                        <span className="color_disapprove">disapprove</span> of the way{" "}
                        {politicianName} is handling his job as {politicianTitle}?
                        <br />
                        <span className="modal_text_small">
                            Reviews are published publicly, organized by topic, and sent directly to
                            politicians.
                        </span>
                    </div>

                    <Row className="justify-content-center a_or_d">
                        <button
                            className="btn btn-secondary btn_circle modal_btn approve"
                            onClick={() => next(true)}
                        >
                            <i className="fa fa-thumbs-up align-middle" aria-hidden="true" />
                            <div className="box">
                                <span className="votes">{approvalCount}</span>
                                <span>Approve</span>
                            </div>
                        </button>
                        <button
                            className="btn btn-secondary btn_circle modal_btn disapprove"
                            onClick={() => next(false)}
                        >
                            <i className="fa fa-thumbs-down" aria-hidden="true" />
                            <div className="box">
                                <span className="votes">{disapprovalCount}</span>
                                <span>Disapprove</span>
                            </div>
                        </button>
                    </Row>
                    <span className="modal_text_small">Safe, secure, and anonymous</span>
                </div>
            </Modal.Body>
            <Modal.Footer />
        </Modal>
    );
};

export default PollQuestion;
