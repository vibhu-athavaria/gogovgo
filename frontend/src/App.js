import React, {Component} from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Tracker from './Tracker'
import Home from "./Application/Home";
import LandingPage from "./Application/LandingPage"


class App extends Component {

  	render() {
		const Politician = ({ match }) => {
			return (
				<Home titleUrl={match.params.title_url} country={match.params.country}/>
			)
		};

		const PoliticianWithReview = ({ match }) => {
			return (
				<Home titleUrl={match.params.title_url} country={match.params.country} decryptReviewId={match.params.review_id}/>
			)
		};

		return (
			<Router >
				<div>
					<Route exact path="/" component={Tracker(LandingPage)}/>
					<Route exact path="/politician/:country/:title_url" component={Tracker(Politician)} />
					<Route path="/politician/:country/:title_url/reviews/:review_id" component={Tracker(PoliticianWithReview)} />
				</div>
			</Router>
		)
	}
}

export default App;
