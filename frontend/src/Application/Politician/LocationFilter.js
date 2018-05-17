import React, { Component } from "react";

export default class LocationFilter extends Component {
    state = {
        options: { countries: [], states: [] }
    };

    componentDidMount() {
        let { origin } = window.location;
        if (origin.indexOf("localhost") !== -1) origin = "http://localhost:8030";
        fetch(origin + "/api/countries/?restrict=reviews")
            .then(res => res.json())
            .then(data => this.setState({ options: data }));
    }

    handleChange(field, event) {
        let filters = Object.assign({}, this.props.filters);
        filters[field] = event.target.value;
        this.props.onFilter(filters);
    }

    onSubmit = () => {
        this.props.onFilter(this.props.filters);
    };

    render() {
        const { options } = this.state;
        const { filters } = this.props;

        const countrySelector = (
            <select
                className="form-control location-selector"
                value={filters.country}
                onChange={e => this.handleChange("country", e)}
            >
                <option value="all">All countries</option>
                {options.countries.map((country, i) => (
                    <option key={i} value={country.short}>
                        {country.long}
                    </option>
                ))}
            </select>
        );

        let stateSelector;
        if (filters.country === "US") {
            stateSelector = (
                <select
                    className="form-control location-selector"
                    value={filters.state}
                    onChange={e => this.handleChange("state", e)}
                >
                    <option value="all">All states</option>
                    {options.states.map((state, i) => (
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
                filters.timelimit === option.value
                    ? "glyphicon glyphicon-record"
                    : "fa fa-circle-o";
            return (
                <div
                    key={option.value}
                    onClick={e =>
                        this.handleChange("timelimit", { target: { value: option.value } })
                    }
                >
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
