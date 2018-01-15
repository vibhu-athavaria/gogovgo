/**
 * Created by vathavaria on 6/23/17.
 */

import React, { Component } from "react";
import PoliticianWithData from "./Politician/Politician";
import Header from "./Header";
import Footer from "./Footer";
import "../assets/css/App.css";
import { decrypt } from "../utils/security";

class Home extends Component {
    render() {
        const { titleUrl, country, decryptReviewId } = this.props;
        let reviewId = null;
        if (decryptReviewId) {
            reviewId = decrypt(decryptReviewId);
        }
        return (
            <div>
                <Header titleUrl={titleUrl} country={country} />
                <PoliticianWithData politicianTitleUrl={titleUrl} reviewId={reviewId} />
                <Footer />
            </div>
        );
    }
}

export default Home;
