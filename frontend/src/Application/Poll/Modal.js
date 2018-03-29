/**
 * Central logic to show all steps in Poll modal
 * Created on Feb 19, 2018
 * @author Manvir Singh (mail@manvir.me)
 */

import React, { Component } from "react";

import PollQuestion from "./PollQuestion";

import PollReview from "./PollReview";
import PollLocation from "./PollLocation";
import SubscribeModal from "./SubscribeModal";
import ShareReviewURLModal from "./ShareReviewURLModal";

export default class BaseModal extends Component {
    state = { step: 1, approved: null, tags: [], reviewId: null, reviewText: "" };

    /**
     * A central list of props to show on all sub components/modals
     * @returns {object}
     */
    getProps() {
        return {
            ...this.props,
            ...this.state,
            prev: () => this.setState({ step: this.state.step - 1 }),
            next: data => this.next(data),
            show: true
        };
    }

    /**
     * Go to next step in modal flow
     * also update data in state as passed from individual sub components
     * @param {object} newState - new values to update state with
     */
    next(newState) {
        this.setState({ ...newState, step: this.state.step + 1 });
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
        return modal;
    }
}
