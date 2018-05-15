import React, { Component } from "react";
import { gql, graphql } from "react-apollo";
import ReactHighmaps from "react-highcharts/ReactHighmaps";
import WorldMap from "./mapdata";
import USMap from "./usdata";

class Map extends Component {
    state = { mapType: "us" };

    componentWillReceiveProps(nextProps) {
        const map = nextProps.country === "US" ? "us" : "world";
        if (map === this.state.mapType) return;
        this.setState({ mapType: map });
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

    render() {
        const { mapdata } = this.props.data;
        if (!mapdata) return null;

        const { mapType } = this.state;

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

        let mapConfig = {
            chart: {
                map: mapType !== "us" ? WorldMap : USMap,
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
                    }
                }
            ]
        };

        //
        return <ReactHighmaps config={mapConfig} />;
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
