/**
 * Created by vathavaria on 7/13/17.
 */

import React from 'react';
import {Component} from "react/lib/ReactBaseClasses";
import {Col, Modal, Row} from "react-bootstrap";
import PollReview from "./PollReview";

class PollQuestion extends Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			showReviewModel: false,
			approved: false
		};

	}

	render() {
		const {politicianId, onHide, ...restProps} = this.props;

		let pollReviewModalClose = (closeParent) => {
			this.setState({showReviewModel: false});
			if (closeParent === true) {
				onHide();
			}
		};

		let showPollReviewModal = (isApproved) => {
			this.setState({
				showReviewModel: true,
				approved: isApproved
			})
		};


		return (

			<div>
				<Modal {...restProps} dialogClassName="custom-modal">
					<Modal.Header closeButton onHide={() => onHide()}/>
					<Modal.Body>
						<div className="texto_modales margin_abajo_big">
							Do you <span className="color_approve">approve</span> or <span className="color_disapprove">disapprove</span> of the way {this.props.politicianName} is handling his job as {this.props.politicianTitle}?
						</div>

						<Row className="justify-content-center margin_abajo_tobig">
							<Col xs={18} md={12} className="text-center">
								<a className="btn btn-secondary btn_circle modal_btn" href="#" onClick={() => showPollReviewModal(true)}>
									<i className="fa fa-thumbs-up align-middle" aria-hidden="true"></i>
									<div className="box">
										<span className="votes">{this.props.approvalCount}</span><span>Approve</span>
									</div>
								</a>
								<a className="btn btn-secondary btn_circle modal_btn" href="#" onClick={() => showPollReviewModal(false)}>
									<i className="fa fa-thumbs-down" aria-hidden="true"></i>
									<div className="box">
										<span className="votes">{this.props.disapprovalCount}</span><span>Disapprove</span>
									</div>
								</a>
							</Col>
						</Row>
					</Modal.Body>
					<Modal.Footer>

					</Modal.Footer>
				</Modal>
				<PollReview
					show={this.state.showReviewModel}
					onHide={pollReviewModalClose}
					approved={this.state.approved}
					politicianId={politicianId}
					politicianName={this.props.politicianName}
					politicianTitle={this.props.politicianTitle}
				/>

			</div>
		);
	}
}

export default PollQuestion;
