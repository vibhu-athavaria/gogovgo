import React, { Component } from "react";
import ReactHighmaps from "react-highcharts/ReactHighmaps";
import map from "./mapdata";

const data = [
    {
        code: "CA",
        value: 12,
        name: "Canada"
    },
    {
        code: "IN",
        value: 5,
        name: "India"
    },
    {
        code: "MX",
        value: 20,
        name: "Mexico"
    },
    {
        code: "US",
        value: 63,
        name: "United States"
    }
];

export default class Map extends Component {
    render() {
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
                max: 80,
                type: "linear"
            },

            series: [
                {
                    data: data,
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
