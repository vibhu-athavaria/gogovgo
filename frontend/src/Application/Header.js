/**
 * Created by vathavaria on 6/23/17.
 */

import React from 'react';
import {Component} from "react/lib/ReactBaseClasses";
import HowItWorks from "./HowItWorks";
import {Col, Grid, MenuItem, Nav, Navbar, NavDropdown, NavItem, Row} from "react-bootstrap";
import {gql, graphql} from "react-apollo";
import { LinkContainer } from 'react-router-bootstrap';


class Header extends Component {

	constructor(props, context) {
		super(props, context);
		this.state = { howItWorksShow: false};
	};

	render() {
		// const {data: {loading, error, publicOfficeTitleTypes, titleUrl}} = this.props;
		const eventKey = 4;
		let menuItemCol1 = [];
		let menuItemCol2 = [];
		// publicOfficeTitleTypes.forEach(function (publicOffice, index) {
		// 	const url = '/politician/' + publicOffice.country + '/' + publicOffice.url;
		// 	const link = (
		// 		<LinkContainer to={url} key={"link-index-" + index}>
		// 			<MenuItem
		// 				eventKey={eventKey + "." + (index + 1)}
		// 				key={"menu-item-index-" + index}>{publicOffice.displayName}
		// 			</MenuItem>
		// 		</LinkContainer>
		// 	);
		// 	if (index%2 === 0) {
		// 		menuItemCol1.push(link)
		// 	} else {
		// 		menuItemCol2.push(link)
		// 	}
		// });

		let howItWorksClose = () => this.setState({howItWorksShow: false});
		return (
			<Navbar className="main-menu" collapseOnSelect fluid>
				<Navbar.Header>
					<Navbar.Brand>
						<a className="main" href="/">
							<div className="logo">
								<span className="main">RateYourPolitician.org</span>
								<span className="slogan">Government, simplified</span>
							</div>
						</a>
					</Navbar.Brand>
					<Navbar.Toggle />
				</Navbar.Header>
				<Navbar.Collapse>
					{/*<Nav>*/}
						{/*<NavDropdown className="header-dropdown" eventKey={3} title="Select Politician" id="basic-nav-dropdown">*/}
							{/*<Row className="header-dropdown-container">*/}
								{/*<Col md={6} sm={6} className="dropdown-menu-left">*/}
									{/*{menuItemCol1}*/}
								{/*</Col>*/}
								{/*<Col md={6} sm={6} className="dropdown-menu-right">*/}
									{/*{menuItemCol2}*/}
								{/*</Col>*/}
							{/*</Row>*/}
						{/*</NavDropdown>*/}
					{/*</Nav>*/}
					<Nav pullRight>
						<NavItem className="nav-link how-it-work" href="javascript:void(0)"
								 onClick={() => this.setState({howItWorksShow: true})}>How it Works
						</NavItem>
					</Nav>
				</Navbar.Collapse>
				<HowItWorks show={this.state.howItWorksShow} onHide={howItWorksClose}/>
			</Navbar>
		);
	}
}

// const getHeaderNav = gql`
// 	query getHeaderNav($country:String!) {
// 	publicOfficeTitleTypes(country: $country){
// 		url,
// 		displayName,
// 		country
// 	}
// }`;
//
// const HeaderWithNav = graphql(getHeaderNav, {
// 	options: (props) => ({ variables: { country: props.country },})
// })(Header);


export default Header;
