/**
 * Created by vathavaria on 6/23/17.
 */

import React from "react";
import { Component } from "react/lib/ReactBaseClasses";
import { FormControl, FormGroup, Modal } from "react-bootstrap";
import ReCAPTCHA from "react-google-recaptcha";
import ReactGA from "react-ga";
// import PollQuestion from "./PollQuestion";

class PollReview extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            reviewText: props.reviewText,
            reviewTextValidation: null
        };
    }

    render() {
        const { prev, next, approved, politicianName } = this.props;

        // const reviewTags = tags.map(tag => (
        //     <button className="reason-tags" key={tag.id}>
        //         {tag.name}
        //     </button>
        // ));

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
        let emotionTag = "";
        if (approved === true) {
            emotionTag = <span className="color_approve">satisfied</span>;
        } else {
            emotionTag = <span className="color_disapprove">dissatisfied</span>;
        }
        const pollQuestion = (
            <div className="texto_modales margin_abajo_medium">
                Why are you {emotionTag} with {politicianName}'s performance as President of the
                United States?
            </div>
        );

        return (
            <div>
                <Modal.Body>
                    <div className="texto_modales margin_abajo_medium">{pollQuestion}</div>
                    <div className="modal_text_small opinion">
                        Share your opinion to influence others and send your review directly to
                        politicians. The most upvoted reviews earn authors special access to new
                        product features. Common #hashtags are displayed on the politician's
                        homepage, and all reviews are anonymous.
                    </div>
                    <FormGroup
                        className="margin_abajo_big"
                        validationState={this.state.reviewTextValidation}
                    >
                        <FormControl
                            componentClass="textarea"
                            placeholder="Donald Trump is a former #businessMan and current #presidentOfUS, and lives in the #whiteHouse."
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
                    <div className="form-group text-center m0">
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
            </div>
        );
    }
}

export default PollReview;
