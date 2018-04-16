/**
 * Created by vathavaria on 6/23/17.
 */

import React from "react";
import { Component } from "react/lib/ReactBaseClasses";
import Terms from "./Terms";
import PrivacyPolicy from "./PrivacyPolicy";

class Footer extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            terms: false,
            privacyPolicy: false
        };
    }

    render() {
        let termsClose = () => this.setState({ terms: false });
        let privacyPolicyClose = () => this.setState({ privacyPolicy: false });

        const handleClick = (event, state) => {
            event.preventDefault();
            this.setState(state);
        };

        return (
            <footer>
                <div className="container">
                    <div className="row">
                        <div className="col-xs-12 col-sm-2">
                            <div className="row">
                                <span className="logo_header">DonaldTrumpReviews.com</span>
                            </div>
                        </div>
                        <div className="col-xs-12 col-sm-10">
                            <div className="row pull-right piter_footer">
                                <ul className="list-inline text-right item_footer">
                                    <li className="list-inline-item">
                                        <a
                                            href="#privacy"
                                            onClick={e => handleClick(e, { privacyPolicy: true })}
                                        >
                                            Privacy Policy
                                        </a>
                                    </li>
                                    <li className="list-inline-item">
                                        <a
                                            href="#terms"
                                            onClick={e => handleClick(e, { terms: true })}
                                        >
                                            Terms of Use
                                        </a>
                                    </li>
                                    <li className="list-inline-item">
                                        <a href="mailto:contactGoGovGo@gmail.com">Contact</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <Terms show={this.state.terms} onHide={termsClose} />
                <PrivacyPolicy show={this.state.privacyPolicy} onHide={privacyPolicyClose} />
            </footer>
        );
    }
}

export default Footer;
