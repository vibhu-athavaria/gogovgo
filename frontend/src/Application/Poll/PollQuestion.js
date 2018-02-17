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
            approved: false,
            location: { state: "", country: "US" },
            locationOptions: { countries: [], states: [] }
        };
    }

    /**
     * Load list of available countries and state from API
     */
    componentDidMount() {
        let { origin } = window.location;
        if (origin.indexOf("localhost") !== -1) origin = "http://localhost:8030";
        fetch(origin + "/api/countries/")
            .then(res => res.json())
            .then(data => this.setState({ locationOptions: data }));
    }

    /**
     * Handle update on select element
     * @param {string} field - name of location field to change - `country` or `state`
     * @param {object} event - JS onchange event
     */
    handleChange(field, event) {
        let { location } = this.state;
        location[field] = event.target.value;
        if (field == "country") location.state = "";
        this.setState({ location: location });
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

        const { location, locationOptions, approved } = this.state;

        /**
         * Country & state select elements
         */
        const countrySelector = (
            <select
                className="form-control location-selector"
                value={location.country}
                onChange={e => this.handleChange("country", e)}
            >
                {locationOptions.countries.map((country, i) => (
                    <option key={i} value={country.short}>
                        {country.long}
                    </option>
                ))}
            </select>
        );

        let stateSelector;
        if (location.country === "US") {
            stateSelector = (
                <select
                    className="form-control location-selector"
                    value={location.state}
                    onChange={e => this.handleChange("state", e)}
                >
                    <option value="">Select your state (optional)</option>
                    {locationOptions.states.map((state, i) => (
                        <option key={i} value={state.short}>
                            {state.long}
                        </option>
                    ))}
                </select>
            );
        }

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

                                <div className="margin_abajo_big">
                                    {countrySelector}
                                    {stateSelector}
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
                    location={location}
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
