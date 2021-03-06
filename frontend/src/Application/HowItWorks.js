/**
 * Created by vathavaria on 6/29/17.
 */

import React, { Component } from "react";
import { Col, Modal, Row } from "react-bootstrap";
// import profile from "../assets/images/profile.png";
import hand from "../assets/images/hand.png";
import baloon from "../assets/images/baloon.png";

class HowItWorks extends Component {
    render() {
        const footer_style = {
            backgroundColor: "#0a54b6",
            textAlign: "left",
            color: "#ffffff"
        };
        const h2_style = {
            marginRight: "10px",
            display: "inline"
        };

        return (
            <Modal id="hiw-modal" {...this.props} aria-labelledby="contained-modal-title-lg">
                <Modal.Header closeButton />
                <Modal.Body>
                    <div className="texto_modales margin_abajo_big">How it Works</div>

                    <Row className="margin_abajo_medium">
                        <Col xs={6} className="text-center">
                            <div className="content_circle_blue">
                                <a>
                                    <img src={baloon} alt="" />
                                </a>
                            </div>
                            <div className="texto_modales_rg">
                                Submit new reviews, and upvote reviews you agree with. #Hashtags are
                                encouraged.
                            </div>
                        </Col>
                        <Col xs={6} className="text-center">
                            <div className="content_circle_blue">
                                <a>
                                    <img src={hand} alt="" />
                                </a>
                            </div>
                            <div className="texto_modales_rg">
                                Reviews are sent to politicians, and the most upvoted reviews earn
                                authors special access to new product features.
                            </div>
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer style={footer_style}>
                    <h3 style={h2_style}>DonaldTrumpReviews</h3>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default HowItWorks;
