import React, { Component } from "react";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import Tracker from "./Tracker";
import Home from "./Application/Home";
import LandingPage from "./Application/LandingPage";

class App extends Component {
    render() {
        /**
         * Component to redirect traffic from homepage to /politician/us/president-united-states
         * @param {object} props
         */
        const HomeRedirect = props => {
            return <Redirect to="/politician/us/president-united-states" />;
        };

        /**
         * Component to view a single politician
         */
        const Politician = ({ match }) => {
            return <Home titleUrl={match.params.title_url} country={match.params.country} />;
        };

        const PoliticianWithReview = ({ match }) => {
            return (
                <Home
                    titleUrl={match.params.title_url}
                    country={match.params.country}
                    decryptReviewId={match.params.review_id}
                />
            );
        };

        return (
            <Router>
                <div>
                    <Route exact path="/" component={Tracker(HomeRedirect)} />
                    <Route
                        exact
                        path="/politician/:country/:title_url"
                        component={Tracker(Politician)}
                    />
                    <Route
                        path="/politician/:country/:title_url/reviews/:review_id"
                        component={Tracker(PoliticianWithReview)}
                    />
                </div>
            </Router>
        );
    }
}

export default App;
