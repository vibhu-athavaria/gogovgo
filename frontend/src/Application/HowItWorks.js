/**
 * Created by vathavaria on 6/29/17.
 */

import React from 'react';
import {Component} from "react/lib/ReactBaseClasses";
import {Col, Modal, Row} from "react-bootstrap";
import profile from '../assets/images/profile.png'
import hand from '../assets/images/hand.png'
import baloon from '../assets/images/baloon.png'

class HowItWorks extends Component {
	render() {

		const footer_style = {
			backgroundColor: '#0a54b6',
			textAlign: 'left',
			color: '#ffffff',
		};
		const h2_style = {
			marginRight: '10px',
			display: 'inline'
		};

		return (
			<Modal {...this.props} aria-labelledby="contained-modal-title-lg">
				<Modal.Header closeButton>

				</Modal.Header>
				<Modal.Body>
					<div className="texto_modales margin_abajo_big">How it Works</div>

					<Row className="margin_abajo_toobig">
						<Col xs={4} className="text-center ">
							<div className="content_circle_blue">
								<a>
									<img src={profile} alt=""/>
								</a>
							</div>
							<div className="texto_modales_rg">Find and learn about your <br/> government representatives.</div>
						</Col>
						<Col xs={4} className="text-center">
							<div className="content_circle_blue">
								<a>
									<img src={baloon} alt=""/>
								</a>
							</div>
							<div className="texto_modales_rg">Engage with them by submitting reviews, reporting problems, <br/>
							or making suggestions anonymously.</div>
						</Col>
						<Col xs={4} className="text-center">
                            <div className="content_circle_blue">
                                <a>
                                    <img src={hand} alt=""/>
                                </a>
                            </div>
                            <div className="texto_modales_rg">GoGovGo organizes comments, delivers them to lawmakers, <br/>
                             and tracks progress, automatically.</div>
                        </Col>
					</Row>
				</Modal.Body>
				<Modal.Footer style={footer_style}>
					<h3 style={h2_style}>GoGovGo</h3> <text>Government, Simplified</text>
				</Modal.Footer>
			</Modal>
		);
	}
}

export default HowItWorks;
