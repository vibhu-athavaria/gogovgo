/**
 * Location step in review modal
 * Save country and state information
 */
import React from "react";
import ReactGA from "react-ga";
import { Component } from "react/lib/ReactBaseClasses";
import { Modal } from "react-bootstrap";

class PollLocation extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            location: { state: "", country: "US", postalCode: "" },
            locationOptions: { countries: [], states: [] },
            error: null
        };
    }

    /**
     * Load list of available countries and state from API
     */
    componentDidMount() {
        if (this.props.location) this.setState({ location: this.props.location });
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
        if (field === "country") location.state = "";
        this.setState({ location: location, error: null });
    }

    /**
     * Handle click on next button
     */
    submit = () => {
        const { location } = this.state;
        if (location.country === "US") {
            if (!location.state.length) {
                return this.setState({ error: "The state field is required." });
            }
            if (!location.postalCode.length) {
                return this.setState({ error: "The postal code field is required." });
            }
        }
        //	track event
        ReactGA.event({
            category: "User",
            action: "Modal_Location_Next"
        });
        //  go to next page
        this.props.next({ location: this.state.location });
    };

    /**
     * Component layout
     * @returns JSX
     */
    render() {
        const { location, locationOptions, error } = this.state;

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
        let postalCode;

        if (location.country === "US") {
            stateSelector = (
                <select
                    className="form-control location-selector"
                    value={location.state}
                    onChange={e => this.handleChange("state", e)}
                >
                    <option value="">Select your state</option>
                    {locationOptions.states.map((state, i) => (
                        <option key={i} value={state.short}>
                            {state.long}
                        </option>
                    ))}
                </select>
            );

            if (location.state.length) {
                postalCode = (
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Postal code"
                        value={location.postalCode}
                        onChange={e => this.handleChange("postalCode", e)}
                        style={{ marginBottom: "10px" }}
                    />
                );
            }
        }

        return (
            <div>
                <Modal.Body>
                    <div className="texto_modales_center">
                        <div className="margin_abajo_big">Your location</div>
                        <div className="margin_abajo_big">
                            {countrySelector}
                            {stateSelector}
                            {postalCode}
                            {error && (
                                <div
                                    className="alert alert-danger"
                                    style={{ fontSize: "1.3rem", padding: "5px", margin: 0 }}
                                >
                                    {error}
                                </div>
                            )}
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <div className="form-group text-center m0">
                        <button
                            type="button"
                            className="btn btn-modal btn-link"
                            onClick={this.props.prev}
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
            </div>
        );
    }
}

export default PollLocation;
