/**
 * Created by vathavaria on 6/23/17.
 */

import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import '../assets/css/landing-page.css'
import Terms from "./Terms";
import PrivacyPolicy from "./PrivacyPolicy";
import landing_page_hero from '../assets/images/landing_page_hero.png'
import {Col, Row} from "react-bootstrap";

class LandingPage extends Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			terms: false,
			privacyPolicy: false
		};
	};

	render() {
		let termsClose = () => this.setState({ terms: false });
		let privacyPolicyClose = () => this.setState({ privacyPolicy: false });

		return (
		<div className="page-container">
			<Row>
				<Col md={6} className="homepage-left">
					<div className="go-gov-go">GoGovGo</div>
					<div className="government-simplifi-logo">Government, simplified</div>
					<div className="government-simplifi-big-container">
						<div className="government-simplifi-big" >
							Government, simplified.
						</div>
						<div className="find-and-connect-with">
							GoGovGo is the best way to contact your government representatives online. Report problems and make suggestions about anything in seconds, and we handle the rest, automatically.
						</div>


					</div>
					<div className="enter-button-container">
						<Link className="enter-button" to="/politician/us/president-united-states">Contact Your Politician</Link>

					</div>
					<Row className="homepage-footer-links">
						<Col md={4} className="footer-link"><a href="javascript:void(0)" onClick={()=>this.setState({privacyPolicy: true})}>Privacy Policy</a></Col>
						<Col md={4} className="footer-link"><a href="javascript:void(0)" onClick={()=>this.setState({terms: true})}>Terms of Use</a></Col>
						<Col md={4} className="footer-link"><a href="mailto:contactGoGovGo@gmail.com">Contacts</a></Col>
					</Row>

				</Col>
				<Col md={6} className="homepage-right">
					<div className="homepage-hero">
						<img src={landing_page_hero} alt="landing_page_hero" />
					</div>
				</Col>
			</Row>
			<Terms show={this.state.terms} onHide={termsClose}/>
			<PrivacyPolicy show={this.state.privacyPolicy} onHide={privacyPolicyClose}/>
		</div>

		);
	}
}

export default LandingPage
