import React, { Component } from "react";
import { gql, graphql } from "react-apollo";
import ReactHighmaps from "react-highcharts/ReactHighmaps";
import map from "./mapdata";

class Map extends Component {
    render() {
        const { mapdata } = this.props.data;
        if (!mapdata) return null;

        const cleanData = data => {
            let _data = [];
            for (let entry of data)
                _data.push({ code: entry.code, value: entry.value, name: entry.name });
            return _data;
        };

        const config = {
            title: {
                text: ""
            },

            mapNavigation: {
                enabled: false
            },

            tooltip: {
                backgroundColor: null,
                borderWidth: 0,
                shadow: false,
                useHTML: true,
                pointFormat: "{point.name}: <b>{point.value}</b>%"
            },

            colorAxis: {
                min: 1,
                max: mapdata.maxScale,
                type: "linear"
            },

            series: [
                {
                    data: cleanData(mapdata.data),
                    mapData: map,
                    joinBy: ["iso-a2", "code"],
                    name: "Reviews per country",
                    states: {
                        hover: {
                            color: "#a4edba"
                        }
                    }
                }
            ]
        };
        return <ReactHighmaps config={config} />;
    }
}

// Initialize GraphQL queries or mutations with the `gql` tag
const getMapData = gql`
    query getMapdata($id: Int!, $maptype: String!) {
        mapdata(id: $id, maptype: $maptype) {
            maxScale
            data {
                code
                name
                value
            }
        }
    }
`;

const MapWithData = graphql(getMapData, {
    options: props => ({ variables: { id: props.politicianId, maptype: "world" } })
})(Map);

export default MapWithData;
