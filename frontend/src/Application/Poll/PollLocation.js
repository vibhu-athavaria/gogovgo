/**
 * Location step in review modal
 * Save country and state information
 */
import React from "react";
import ReactGA from "react-ga";
import { Component } from "react/lib/ReactBaseClasses";
import { Modal } from "react-bootstrap";
import SubscribeModalWithMutation from "./SubscribeModal";

class PollLocation extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            showSelf: true,
            showSubscribeModal: false,
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
     * Handle click on next button
     */
    submit = () => {
        //	track event
        ReactGA.event({
            category: "User",
            action: "Modal_Location_Next"
        });
        //  go to next page
        this.setState({ showSelf: false, showSubscribeModal: true });
    };

    /**
     * Component layout
     * @returns JSX
     */
    render() {
        const { onHide, politicianId, approved, tags, reviewText, ...restProps } = this.props;

        const { location, locationOptions } = this.state;

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

        const closeModal = () => {
            this.setState({ showSelf: true, showSubscribeModal: false });
            onHide(true);
        };

        return (
            <div>
                {this.state.showSelf && (
                    <Modal
                        {...restProps}
                        onHide={() => onHide(true)}
                        dialogClassName="custom-modal"
                    >
                        <Modal.Header closeButton />
                        <Modal.Body>
                            <div className="texto_modales_center">
                                <div className="margin_abajo_big">Your location</div>
                                <div className="margin_abajo_big">
                                    {countrySelector}
                                    {stateSelector}
                                </div>
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
                                    onClick={this.submit}
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
                    politicianId={politicianId}
                    approved={approved}
                    reviewText={reviewText}
                    onHide={closeModal}
                />
            </div>
        );
    }
}

export default PollLocation;
