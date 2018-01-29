/**
 * Created by vathavaria on 6/23/17.
 */

import React from "react";
import { Component } from "react/lib/ReactBaseClasses";
import { FormControl, FormGroup, Modal } from "react-bootstrap";
import SubscribeModalWithMutation from "./SubscribeModal";
import ReCAPTCHA from "react-google-recaptcha";
import ReactGA from "react-ga";

class PollReview extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = this.initializeState(props);
    }

    initializeState(props) {
        return {
            showSelf: true,
            politicianId: props.politicianId,
            reviewText: "",
            reviewTextValidation: null,
            showSubscribeModal: false
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState(this.initializeState(nextProps));
    }

    render() {
        const { approved, onHide, location, tags, ...rest } = this.props;

        let reviewTags = [];
        tags.forEach(function(tag, index) {
            reviewTags.push(<button className="reason-tags">{tag.name}</button>);
        });

        // specifying verify callback function for recatcha
        const onChangeCaptcha = value => {
            if (!value) return;
            ReactGA.event({
                category: "User",
                action: "Modal_ReviewDescription",
                label: "Submit"
            });
            this.setState({ showSubscribeModal: true, showSelf: false });
        };

        const closeSubscribeModal = closeParent => {
            this.setState({ showSubscribeModal: false, showSelf: !closeParent });
            if (closeParent === true) {
                onHide(closeParent);
            }
        };

        const onSubmit = () => {
            if (this.state.reviewText === "") {
                this.setState({ reviewTextValidation: "error" });
            } else {
                this.refs.recaptcha.execute();
            }
        };

        const handleReviewTextChange = e => {
            if (e.key !== "Enter") {
                this.setState({
                    reviewText: e.target.value,
                    reviewTextValidation: null
                });
            }
        };

        return (
            <div>
                {this.state.showSelf && (
                    <Modal {...rest} dialogClassName="custom-modal" keyboard={true}>
                        <Modal.Header closeButton onHide={() => onHide(true)} />

                        <Modal.Body>
                            <div className="texto_modales margin_abajo_medium">
                                Please explain your selection in more detail:
                            </div>
                            <div className="margin_abajo_medium text-center">{reviewTags}</div>
                            <FormGroup
                                className="margin_abajo_big"
                                validationState={this.state.reviewTextValidation}
                            >
                                <FormControl
                                    componentClass="textarea"
                                    placeholder="Please explain your answer in more detail..."
                                    onChange={handleReviewTextChange}
                                    bsSize="large"
                                />
                            </FormGroup>
                            <div className="margin_abajo_medium text-center recaptcha">
                                <ReCAPTCHA
                                    ref="recaptcha"
                                    sitekey="6Leo7EIUAAAAAHkkXEBgYEfl77K2-iuYGbn9AmAR"
                                    size="invisible"
                                    onChange={onChangeCaptcha}
                                />
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <div className="form-group text-center margin_abajo_medium">
                                <button
                                    type="button"
                                    className="btn btn-modal btn-link"
                                    onClick={() => onHide(false)}
                                >
                                    Back
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-modal btn-primary"
                                    onClick={onSubmit}
                                >
                                    Next
                                </button>
                            </div>
                        </Modal.Footer>
                    </Modal>
                )}
                <SubscribeModalWithMutation
                    show={this.state.showSubscribeModal}
                    tags={tags}
                    location={location}
                    politicianId={this.props.politicianId}
                    approved={approved}
                    reviewText={this.state.reviewText}
                    onHide={() => closeSubscribeModal(true)}
                />
            </div>
        );
    }
}

export default PollReview;
