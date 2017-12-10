/**
 * Created by vathavaria on 7/13/17.
 */

import React from 'react';
import {Component} from "react/lib/ReactBaseClasses";
import {Alert, Col, Modal, Row} from "react-bootstrap";
import PollKeywords from "./PollKeywords";
import PlacesAutocomplete from 'react-places-autocomplete'

class PollQuestion extends Component {
	constructor(props, context) {
		super(props, context);
		this.state = this.initializeState(props)
	}

	initializeState(props) {
		return {
			showKeywordModel: false,
			approved: false,
			showAlert: false,
			location: ''
		}
	}

	componentWillReceiveProps(nextProps) {
		this.setState(this.initializeState(nextProps));
	}

	showPollReviewModal = (isApproved) => {
		if (this.state.location !== '') {
			this.setState({
				showKeywordModel: true,
				approved: isApproved
			});
		} else {
			this.setState({showAlert: true})
		}
	};

	render() {
		const {politicianId, onHide, ...restProps} = this.props;

		const onChangePlaceAutoComplete = (location) => {
			this.setState({
				location: location,
				showAlert: false
			});
		};

		const onSelectPlaceAutoComplete = (location) => {
			this.setState({
				location: location,
				showAlert: false
			});
		};

		const pollReviewModalClose = (closeParent) => {
			this.setState({showKeywordModel: false});
			if (closeParent === true) {
				onHide();
			}
		};


		const inputProps = {
			value: this.state.location,
			onChange: onChangePlaceAutoComplete
		};

		return (
			<div>
				<Modal {...restProps} dialogClassName="custom-modal">
					<Modal.Header closeButton onHide={() => onHide()}/>
					<Modal.Body>
						<div className="texto_modales margin_abajo_big">
							Do you <span className="color_approve">approve</span> or <span className="color_disapprove">disapprove</span> of the way {this.props.politicianName} is handling his job as {this.props.politicianTitle}?
							<br/><small>Reviews are published publicly, organized by topics, and sent directly to politicians.</small>
						</div>

						{ this.state.showAlert && (
							<Alert bsStyle="danger">
								<h4>Please enter a valid location!</h4>
							</Alert>
						)}
						<PlacesAutocomplete inputProps={inputProps} onSelect={onSelectPlaceAutoComplete} />

						<Row className="justify-content-center margin_abajo_tobig">
							<Col xs={18} md={12} className="text-center">
								<a className="btn btn-secondary btn_circle modal_btn" href="#" onClick={() => this.showPollReviewModal(true)}>
									<i className="fa fa-thumbs-up align-middle" aria-hidden="true"></i>
									<div className="box">
										<span className="votes">{this.props.approvalCount}</span><span>Approve</span>
									</div>
								</a>
								<a className="btn btn-secondary btn_circle modal_btn" href="#" onClick={() => this.showPollReviewModal(false)}>
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
				<PollKeywords
					show={this.state.showKeywordModel}
					onHide={pollReviewModalClose}
					approved={this.state.approved}
					location={this.state.location}
					politicianId={politicianId}
					politicianName={this.props.politicianName}
					politicianTitle={this.props.politicianTitle}
				/>

			</div>
		);
	}
}

export default PollQuestion;
