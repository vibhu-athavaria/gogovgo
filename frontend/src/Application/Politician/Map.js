import React, { Component } from "react";
import { gql, graphql } from "react-apollo";
import ReactHighmaps from "react-highcharts/ReactHighmaps";

class Map extends Component {
    state = { mapType: "us", mapLayout: null, loading: true };

    componentDidMount() {
        this.loadMap(this.props.filters);
    }

    componentWillReceiveProps(nextProps) {
        const { filters } = nextProps;
        let map = filters.country === "US" ? "us" : "world";
        if (map === "US" && filters.state !== "all") map += "-" + filters.state.toLowerCase();
        if (map === this.state.mapType) return;
        this.setState({ mapType: map });
        this.loadMap(filters);
        const {
            data: { fetchMore }
        } = this.props;
        fetchMore({
            variables: { id: parseInt(this.props.politicianId, 10), maptype: map },
            updateQuery: (previousResult, { fetchMoreResult, queryVariables }) => {
                return fetchMoreResult;
            }
        });
    }

    loadMap(filters) {
        if (!filters) return;
        let url = "https://code.highcharts.com/mapdata/";
        if (filters.country !== "US") {
            url += "custom/world.js";
        } else {
            const postfix = filters.state != "all" ? `-${filters.state.toLowerCase()}` : "";
            url += `countries/us/us${postfix}-all.js`;
        }

        fetch(url)
            .then(res => res.text())
            .then(data => {
                data = data.substring(data.indexOf("=") + 2);
                data = JSON.parse(data);
                this.setState({ loading: false, mapLayout: data });
            });
    }

    render() {
        const { mapdata } = this.props.data;
        const { mapType, loading, mapLayout } = this.state;
        if (!mapdata || loading) return null;

        const cleanData = data => {
            let _data = [];
            for (let entry of data)
                _data.push({
                    code: entry.code,
                    value: entry.value,
                    name: entry.name,
                    negative: entry.negative,
                    positive: entry.positive
                });
            return _data;
        };

        const _this = this;

        let mapConfig = {
            chart: {
                map: mapLayout,
                borderWidth: 0
            },

            title: { text: "" },

            legend: { enabled: false },

            mapNavigation: { enabled: false },

            colorAxis: {
                min: 0,
                max: 1,
                stops: [[0, "#D92D24"], [0.5, "#E3E3E3"], [1, "#2FA543"]]
            },

            series: [
                {
                    animation: { duration: 1000 },
                    data: cleanData(mapdata.data),
                    joinBy: mapType !== "us" ? ["iso-a2", "code"] : ["postal-code", "code"],
                    dataLabels: { enabled: true, color: "#FFFFFF", format: "{point.code}" },
                    name: `Approval rating per ${mapType === "us" ? "state" : "country"}`,
                    tooltip: {
                        pointFormat:
                            "{point.name}: <br/> Approval: {point.positive}% <br/> Disapproval: {point.negative}%"
                    },
                    point: {
                        events: {
                            click: event => {
                                if (mapType !== "us") return;
                                let state;
                                if (event.target.tagName === "tspan") {
                                    state = event.target.innerHTML;
                                } else {
                                    const params = event.target.className.baseVal.split(" ");
                                    const keyword = "highcharts-key-us-";
                                    for (let param of params) {
                                        if (param.indexOf(keyword) !== -1) {
                                            state = param.replace(keyword, "").toUpperCase();
                                            break;
                                        }
                                    }
                                }
                                _this.loadMap({ country: "US", state: state });
                            }
                        }
                    }
                }
            ]
        };

        //
        return (
            <div>
                <ReactHighmaps config={mapConfig} />
                <div className="row-flex map-legend">
                    <span className="color_approve">Approve</span>
                    <span className="legend-bar" />
                    <span className="color_disapprove">Disapprove</span>
                </div>
            </div>
        );
    }
}

// Initialize GraphQL queries or mutations with the `gql` tag
const getMapData = gql`
    query getMapdata($id: Int!, $maptype: String!) {
        mapdata(id: $id, maptype: $maptype) {
            data {
                code
                name
                value
                positive
                negative
            }
        }
    }
`;

const MapWithData = graphql(getMapData, {
    options: props => ({ variables: { id: props.politicianId, maptype: "us" } })
})(Map);

export default MapWithData;
