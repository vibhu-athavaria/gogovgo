import React, { Component } from "react";
import { gql, graphql } from "react-apollo";
import ReactHighmaps from "react-highcharts/ReactHighmaps";
import WorldMap from "./mapdata";
import USMap from "./usdata";

class Map extends Component {
    state = { mapType: "us" };

    render() {
        const { mapdata } = this.props.data;
        if (!mapdata) return null;

        const cleanData = data => {
            let _data = [];
            for (let entry of data)
                _data.push({ code: entry.code, value: entry.value, name: entry.name });
            return _data;
        };

        let mapConfig;

        if (this.state.mapType === "world") {
            mapConfig = {
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
                        mapData: WorldMap,
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
        } else {
            mapConfig = {
                chart: {
                    map: USMap,
                    borderWidth: 0
                },

                title: {
                    text: "US population density (/km²)"
                },

                exporting: {
                    sourceWidth: 600,
                    sourceHeight: 500
                },

                legend: {
                    layout: "horizontal",
                    borderWidth: 0,
                    backgroundColor: "rgba(255,255,255,0.85)",
                    floating: true,
                    verticalAlign: "top",
                    y: 25
                },

                mapNavigation: {
                    enabled: false
                },

                colorAxis: {
                    min: 1,
                    max: mapdata.maxScale,
                    type: "linear"
                },

                series: [
                    {
                        animation: {
                            duration: 1000
                        },
                        data: cleanData(mapdata.data),
                        joinBy: ["postal-code", "code"],
                        // dataLabels: {
                        //     enabled: true,
                        //     color: "#FFFFFF",
                        //     format: "{point.code}"
                        // },
                        name: "Population density",
                        tooltip: {
                            pointFormat: "{point.name}: {point.value}%"
                        }
                    }
                ]
            };
        }
        return <ReactHighmaps config={mapConfig} />;
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
    options: props => ({ variables: { id: props.politicianId, maptype: "us" } })
})(Map);

export default MapWithData;
