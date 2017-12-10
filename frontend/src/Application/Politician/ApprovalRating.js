/**
 * Created by vathavaria on 6/23/17.
 */

import React from 'react';
import {Component} from "react/lib/ReactBaseClasses";
import {Col, Row} from "react-bootstrap";

class ApprovalRating extends Component {

	render() {
		let {approvalRating} = this.props;

		let progressBarWidth = approvalRating + "%";

		return (
			<Row>
				<div className="container_percent margin_abajo_mini">
					<Col>
						<div className="container_percent margin_abajo_mini">
							<div className="text_big_porcentan">  {approvalRating}%</div>
								<div className=" text_percent align-middle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
									Approval Rating
								</div>

						</div>
					</Col>
					<Col>
						<div className="progress ancho_progress">
							<div className="progress-bar" role="progressbar" style={{width: progressBarWidth}} aria-valuenow={approvalRating} aria-valuemin="0" aria-valuemax="100"></div>
						</div>
					</Col>
				</div>
			</Row>
		);
	}
}
export default ApprovalRating;
