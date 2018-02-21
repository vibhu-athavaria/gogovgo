/**
 * Created by vathavaria on 6/23/17.
 */

import React from "react";
import { Component } from "react/lib/ReactBaseClasses";
import { FormControl, FormGroup, Modal } from "react-bootstrap";
import ReCAPTCHA from "react-google-recaptcha";
import ReactGA from "react-ga";

class PollReview extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            reviewText: props.reviewText,
            reviewTextValidation: null
        };
    }

    render() {
        const { onHide, tags, prev, next } = this.props;

        const reviewTags = tags.map(tag => (
            <button className="reason-tags" key={tag.id}>
                {tag.name}
            </button>
        ));

        // specifying verify callback function for recatcha
        const onChangeCaptcha = value => {
            if (!value) return;
            ReactGA.event({
                category: "User",
                action: "Modal_ReviewDescription",
                label: "Submit"
            });
            next({ reviewText: this.state.reviewText });
        };

        const onSubmit = () => {
            this.refs.recaptcha.execute();
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
            <Modal show={true} onHide={onHide} dialogClassName="custom-modal" keyboard={true}>
                <Modal.Header closeButton />
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
                            value={this.state.reviewText}
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
                        <button type="button" className="btn btn-modal btn-link" onClick={prev}>
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
        );
    }
}

export default PollReview;
