import React, { Component } from "react";

export default class LocationFilter extends Component {
    state = {
        location: { country: "all", state: "all" },
        locationOptions: { countries: [], states: [] },
        timelimit: "all"
    };

    componentDidMount() {
        let { origin } = window.location;
        if (origin.indexOf("localhost") !== -1) origin = "http://localhost:8030";
        fetch(origin + "/api/countries/")
            .then(res => res.json())
            .then(data => this.setState({ locationOptions: data }));
    }

    handleChange(field, event) {
        let { location } = this.state;
        location[field] = event.target.value;
        this.setState({ location: location });
    }

    onSubmit = () => {
        const filters = { ...this.state.location, timelimit: this.state.timelimit };
        this.props.filter(filters);
    };

    render() {
        const { location, locationOptions } = this.state;

        const countrySelector = (
            <select
                className="form-control location-selector"
                value={location.country}
                onChange={e => this.handleChange("country", e)}
            >
                <option value="all">All countries</option>
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
                    <option value="all">All states</option>
                    {locationOptions.states.map((state, i) => (
                        <option key={i} value={state.short}>
                            {state.long}
                        </option>
                    ))}
                </select>
            );
        }

        const timeOptions = [
            { name: "All-time", value: "all" },
            { name: "Last 90 days", value: 90 }
        ].map(option => {
            const iconClass =
                this.state.timelimit === option.value
                    ? "glyphicon glyphicon-record"
                    : "fa fa-circle-o";
            return (
                <div key={option.value} onClick={e => this.setState({ timelimit: option.value })}>
                    <i className={"icon " + iconClass} />
                    <span>{option.name}</span>
                </div>
            );
        });

        return (
            <div id="map-filters">
                <h4>Filter by:</h4>
                {countrySelector}
                {stateSelector}
                <div className="filter-time">{timeOptions}</div>
                <button className="btn btn-primary" onClick={this.onSubmit}>
                    Filter
                </button>
            </div>
        );
    }
}
