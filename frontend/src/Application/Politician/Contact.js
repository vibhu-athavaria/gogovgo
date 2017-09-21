/**
 * Created by vathavaria on 8/3/17.
 */

import React from 'react';
import {Component} from "react/lib/ReactBaseClasses";

class Contact extends Component {

	render() {
		return (
			<div role="tabpanel" className="tab-pane in active" id="contact">
				<div className="row">
					<div className="col-xs-12">
						<div className="content-tab text-center">
							<div className="titulo_content margin_abajo_big">Contact</div>
							<p><strong>Department Website:</strong> {this.props.website}</p>
							<p><strong>Contact Info:</strong></p>
							<ul className="list-unstyled">
								<li>
									<p><span><i className="fa fa-phone"></i></span> {this.props.phoneNumber}</p>
								</li>
								<li>
									<p><span><i className="fa fa-envelope"></i></span> {this.props.mailingAddress}</p>
								</li>
							</ul>
						</div>
					</div>
				</div>
				<hr className="line-two"/>
				<div className="row">
					<div className="col text-center">
						<div className="contenedor_suggest">
							<div className="suggest_title">
								Are we missing something important?
							</div>
							<a className="suggest_enlace" href="mailto:contactGoGovGo@gmail.com">
								Suggest improvements
							</a>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default Contact;
