import React, { Component } from "react";
import ReactHighmaps from "react-highcharts/ReactHighmaps";
import map from "./mapdata";

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
                pointFormat:
                    '<span class="f32"><span class="flag {point.flag}"></span></span>' +
                    " {point.name}: <b>{point.value}</b>/km²"
            },

            colorAxis: {
                min: 1,
                max: 100,
                type: "linear"
            },

            series: [
                {
                    mapData: map
                }
            ]
        };
        return <ReactHighmaps config={config} />;
    }
}
