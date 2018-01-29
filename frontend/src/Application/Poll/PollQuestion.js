/**
 * Created by vathavaria on 7/13/17.
 */

import React from "react";
import { Component } from "react/lib/ReactBaseClasses";
import { Alert, Col, Modal, Row } from "react-bootstrap";
import PollKeywords from "./PollKeywords";
import PlacesAutocomplete, { geocodeByAddress } from "react-places-autocomplete";
import ReactGA from "react-ga";

/**
 * Get city, state & country information from geocode API results
 * @param {array} results - Array of results from Geocode API
 * @returns {object}
 *
 * Note: see the link below for example of `results` param
 * https://maps.googleapis.com/maps/api/geocode/json?address=Mountain+View,+CA
 *
 */
const processGeocodeResult = results => {
    let data = { city: null, state: null, country: null };
    if (!results.length) return data;

    const addressData = results[0].address_components;
    for (let i = 0; i < addressData.length; i++) {
        const entry = addressData[i];
        if (entry.types.indexOf("locality") !== -1) {
            data.city = entry.long_name;
        } else if (entry.types.indexOf("administrative_area_level_1") !== -1) {
            data.state = entry.short_name ? entry.short_name : entry.long_name;
        } else if (entry.types.indexOf("country") !== -1) {
            data.country = entry.short_name;
        }
    }

    return data;
};

class PollQuestion extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            showSelf: true,
            showKeywordModel: false,
            approved: false,
            showAlert: false,
            location: ""
        };
        this._locationObject = {};
    }

    showPollKeywordModal = isApproved => {
        const { location } = this.state;

        if (location === "") {
            this.setState({ showAlert: true });
        } else {
            //	track event
            ReactGA.event({
                category: "User",
                action: "Modal_Approve_or_Disapprove",
                label: isApproved ? "approve" : "disapprove"
            });
            //	Validate location
            //	convert location to city, state, country
            geocodeByAddress(location).then(results => {
                const locationData = processGeocodeResult(results);
                if (!locationData.country) {
                    this.setState({ showAlert: true });
                } else {
                    this._locationObject = locationData;
                    this.setState({
                        showSelf: false,
                        showKeywordModel: true,
                        approved: isApproved
                    });
                }
            });
        }
    };

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

        const onChangePlaceAutoComplete = location => {
            this.setState({
                location: location,
                showAlert: false
            });
        };

        const onSelectPlaceAutoComplete = location => {
            this.setState({
                location: location,
                showAlert: false
            });
        };

        const pollKeywordModalClose = closeParent => {
            this.setState({ showKeywordModel: false, showSelf: !closeParent });
            if (closeParent === true) {
                onHide();
            }
        };

        const locationInputStyles = {
            root: {
                position: "relative",
                paddingBottom: "0px"
            },
            input: {
                display: "inline-block",
                width: "100%",
                padding: "10px",
                color: "#464646"
            },
            autocompleteContainer: {
                position: "absolute",
                top: "100%",
                backgroundColor: "white",
                border: "1px solid #555555",
                width: "100%",
                zIndex: "100"
            },
            autocompleteItem: {
                backgroundColor: "#ffffff",
                padding: "10px",
                color: "#555555",
                cursor: "pointer",
                fontSize: "12px",
                textAlign: "left"
            },
            autocompleteItemActive: {
                backgroundColor: "#fafafa"
            },
            googleLogoContainer: {
                textAlign: "right",
                padding: "1px",
                backgroundColor: "#fafafa"
            },
            googleLogoImage: {
                width: 50
            }
        };

        const inputProps = {
            value: this.state.location,
            onChange: onChangePlaceAutoComplete,
            placeholder: "Enter your location..."
        };

        const placeOptions = {
            types: ["(regions)"]
        };

        return (
            <div>
                {this.state.showSelf && (
                    <Modal {...restProps} dialogClassName="custom-modal">
                        <Modal.Header closeButton onHide={() => onHide()} />
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

                                {this.state.showAlert && (
                                    <Alert bsStyle="danger">
                                        <h4>Please enter a valid location!</h4>
                                    </Alert>
                                )}

                                <div className="margin_abajo_big">
                                    <PlacesAutocomplete
                                        inputProps={inputProps}
                                        onSelect={onSelectPlaceAutoComplete}
                                        styles={locationInputStyles}
                                        options={placeOptions}
                                    />
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
                    approved={this.state.approved}
                    location={this._locationObject}
                    politicianId={politicianId}
                    politicianName={politicianName}
                    politicianTitle={politicianTitle}
                    suggestedTags={this.state.approved ? positiveTags : negativeTags}
                />
            </div>
        );
    }
}

export default PollQuestion;
