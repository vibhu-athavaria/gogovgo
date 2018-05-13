/**
 * Central logic to show all steps in Poll modal
 * Created on Feb 19, 2018
 * @author Manvir Singh (mail@manvir.me)
 */

import React, { Component } from "react";
import { Link } from "react-router-dom";

import PollQuestion from "./PollQuestion";
import PollReview from "./PollReview";
import PollLocation from "./PollLocation";
import SubscribeModal from "./SubscribeModal";
import ShareReviewURLModal from "./ShareReviewURLModal";

export default class BaseModal extends Component {
    constructor(props) {
        super(props);
        this.baseUrl = "/politician/us/president-united-states";
        this.state = { step: 1, approved: null, tags: [], reviewId: null, reviewText: "" };
        if (props.location.pathname !== this.baseUrl + "/submit" || !this.getProps().politicianId) {
            props.history.push(this.baseUrl);
        }
    }

    componentDidMount() {
        document.childNodes[1].className = "bg-grey";
    }

    componentWillUnmount() {
        document.childNodes[1].className = "";
    }

    componentWillReceiveProps(nextProps) {
        let step = parseInt(nextProps.location.search.replace("?", "").split("=")[1], 10);
        if (!step) step = 1;
        this.setState({ step: step });
    }

    /**
     * A central list of props to show on all sub components/modals
     * @returns {object}
     */
    getProps() {
        return {
            ...window.store,
            ...this.state,
            prev: () => this.props.history.push("?step=" + (this.state.step - 1)),
            next: data => this.next(data),
            history: this.props.history,
            show: true
        };
    }

    /**
     * Go to next step in modal flow
     * also update data in state as passed from individual sub components
     * @param {object} newState - new values to update state with
     */
    next(newState) {
        this.setState({ ...newState }, () => {
            this.props.history.push("?step=" + (this.state.step + 1));
        });
    }

    /**
     *  Returns the modal to show at current step in poll submit flow
     */
    getModal() {
        let props = this.getProps();
        let modal;
        switch (this.state.step) {
            case 2:
                modal = <PollReview {...props} />;
                break;
            case 3:
                modal = <PollLocation {...props} />;
                break;
            case 4:
                modal = <SubscribeModal {...props} />;
                break;
            case 5:
                modal = <ShareReviewURLModal {...props} />;
                break;
            default:
                modal = <PollQuestion {...props} />;
                break;
        }
        return modal;
    }

    render() {
        let modal = this.getModal();
        return (
            <div className="submit-step">
                <div className="logo">
                    <Link to="/politician/us/president-united-states" className="main">
                        DonaldTrumpReviews.com
                    </Link>
                </div>
                {modal}
            </div>
        );
    }
}
