/**
 * Created by vathavaria on 6/23/17.
 */

import React from "react";
import { Link } from "react-router-dom";

const Footer = () => (
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
                                <Link to="/privacy">Privacy Policy</Link>
                            </li>
                            <li className="list-inline-item">
                                <Link to="/terms">Terms of Use</Link>
                            </li>
                            <li className="list-inline-item">
                                <Link to="/contact">Contact</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </footer>
);

export default Footer;
