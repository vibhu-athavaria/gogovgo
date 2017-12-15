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
		this.state = {
			showKeywordModel: false,
			approved: false,
			showAlert: false,
			location: ''
		}
	}

	// initializeState(props) {
	// 	return {
	// 		showKeywordModel: false,
	// 		approved: false,
	// 		showAlert: false,
	// 		location: ''
	// 	}
	// }
	//
	// componentWillReceiveProps(nextProps) {
	// 	this.setState(this.initializeState(nextProps));
	// }

	showPollReviewModal = (isApproved) => {
		if (this.state.location === '') {
			this.setState({showAlert: true})
		} else {
			this.setState({
				showKeywordModel: true,
				approved: isApproved
			});
		}
	};

	render() {
		const {approvalCount, disapprovalCount, onHide, politicianId, politicianName, politicianTitle, ...restProps} = this.props;

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

		const locationInputStyles = {
			root: {
				position: 'relative',
				paddingBottom: '0px',
			},
			input: {
				display: 'inline-block',
				width: '100%',
				padding: '10px',
				color: '#464646'
			},
			autocompleteContainer: {
				position: 'absolute',
				top: '100%',
				backgroundColor: 'white',
				border: '1px solid #555555',
				width: '100%'
			},
			autocompleteItem: {
				backgroundColor: '#ffffff',
				padding: '10px',
				color: '#555555',
				cursor: 'pointer',
				fontSize: '12px',
				textAlign: 'left'
			},
			autocompleteItemActive: {
				backgroundColor: '#fafafa'
			},
			googleLogoContainer: {
				textAlign: 'right',
				padding: '1px',
				backgroundColor: '#fafafa'
			},
			googleLogoImage: {
				width: 50
			}
		};

		const cssClasses = {
			root: 'form-group',
			input: 'form-control',
			autocompleteContainer: 'location-autocomplete-container'
		};

		const inputProps = {
			value: this.state.location,
			onChange: onChangePlaceAutoComplete,
			placeholder: "Enter your location..."
		};

		return (
			<div>
				<Modal {...restProps} dialogClassName="custom-modal">
					<Modal.Header closeButton onHide={() => onHide()}/>
					<Modal.Body>
						<div className="texto_modales_center">
							<div className="margin_abajo_big">
								Do you <span className="color_approve">approve</span> or <span className="color_disapprove">disapprove</span> of the way {this.props.politicianName} is handling his job as {this.props.politicianTitle}?
								<br/><span className="modal_text_small">Reviews are published publicly, organized by topic, and sent directly to politicians.</span>
							</div>

							{ this.state.showAlert && (
								<Alert bsStyle="danger">
									<h4>Please enter a valid location!</h4>
								</Alert>
							)}

							<div className="margin_abajo_big">
								<PlacesAutocomplete
									inputProps={inputProps}
									onSelect={onSelectPlaceAutoComplete}
									styles={locationInputStyles}
								/>
							</div>

							<Row className="justify-content-center margin_abajo_big">
								<Col xsOffset={1} xs={5} mdOffset={1} md={5} className="text-center">
									<a className="btn btn-secondary btn_circle modal_btn" href="#" onClick={() => this.showPollReviewModal(true)}>
										<i className="fa fa-thumbs-up align-middle" aria-hidden="true"></i>
										<div className="box">
											<span className="votes">{approvalCount}</span><span>Approve</span>
										</div>
									</a>
								</Col>
								<Col xs={5} xsPull={1} md={5} mdPull={1} className="text-center">
									<a className="btn btn-secondary btn_circle modal_btn" href="#" onClick={() => this.showPollReviewModal(false)}>
										<i className="fa fa-thumbs-down" aria-hidden="true"></i>
										<div className="box">
											<span className="votes">{disapprovalCount}</span><span>Disapprove</span>
										</div>
									</a>
								</Col>
							</Row>
						</div>
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
					politicianName={politicianName}
					politicianTitle={politicianTitle}
				/>

			</div>
		);
	}
}

export default PollQuestion;
