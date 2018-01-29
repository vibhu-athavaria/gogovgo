/**
 * Created by vathavaria on 8/16/17.
 */

import React, { Component } from "react";
import ReactGA from "react-ga";

ReactGA.initialize("UA-38738020-12");

const Tracker = (WrappedComponent, options = {}) => {
    const trackPage = page => {
        ReactGA.set({
            page,
            ...options
        });
        ReactGA.pageview(page);
    };

    const HOC = class extends Component {
        componentDidMount() {
            const page = this.props.location.pathname;
            trackPage(page);
        }

        componentWillReceiveProps(nextProps) {
            const currentPage = this.props.location.pathname;
            const nextPage = nextProps.location.pathname;

            if (currentPage !== nextPage) {
                trackPage(nextPage);
            }
        }

        render() {
            return <WrappedComponent {...this.props} />;
        }
    };

    return HOC;
};

export default Tracker;
