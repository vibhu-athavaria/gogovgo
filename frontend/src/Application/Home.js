/**
 * Created by vathavaria on 6/23/17.
 */

import React, { Component } from 'react';
import PoliticianWithData from "./Politician/Politician";
import HeaderWithNav from "./Header";
import Footer from "./Footer";
import '../assets/css/App.css'


class Home extends Component {
	render() {
		let politicianTitleUrl = this.props.titleUrl;

		return (
			<div>
				<HeaderWithNav titleUrl={politicianTitleUrl} country={this.props.country}/>
				<PoliticianWithData politicianTitleUrl={politicianTitleUrl}/>
				<Footer/>
			</div>

		);
	}
}

export default Home
