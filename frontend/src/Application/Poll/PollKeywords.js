/**
 * Created by vathavaria on 6/23/17.
 */

import React from 'react';
import {Component} from "react/lib/ReactBaseClasses";
import {
	Button, Col, FormGroup, Grid, Label, Modal, Row
} from "react-bootstrap";
import TagsInput from 'react-tagsinput'
import 'react-tagsinput/react-tagsinput.css'

import PollReview from "./PollReview";

class PollKeywords extends Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			reasonTags: [],
			showReviewModel: false,
			reasonInputValue: '',
			tags: []
		};

	}


	render() {
		// Local variables
		const { approved, onHide, politicianId, politicianName, location, ...rest } = this.props;
		const reasonTags = this.state.reasonTags;
		let reasons = [];
		let emotionTag = '';
		let reasonInputPlaceholder = '';

		reasonTags.forEach(function(reason, index) {
			reasons.push(<Label key={"reason:" + index}>{reason}</Label>)
		});

		if (approved === true) {
			emotionTag = (<span className="color_approve">satisfied</span>);
			reasonInputPlaceholder = "jobs, economy, immigration...";
		} else {
			emotionTag = (<span className="color_disapprove">dissatisfied</span>);
			reasonInputPlaceholder = "budget deficit, tax increased, poverty rate...";
		}
		const pollQuestion = (<div className="texto_modales margin_abajo_medium">What are the primary reason that you are {emotionTag} with {politicianName}'s performance?</div>);

		// Event handlers
		const reviewModelClose = (closeParent) => {
			this.setState({ showReviewModel: false });
			if (closeParent === true) {
				onHide(closeParent);
			}
		};

		const reviewModelShow = () => {
			this.setState({showReviewModel: true})
		};

		const addReason = () => {
			let reason = this.state.reasonInputValue;
			this.setState({
				reasonTags: this.state.reasonTags.concat([reason]),
				reasonInputValue: ''
			})
		};

		const handleChange = (tags) => {
			this.setState({tags})
		};

		return (

			<div>
				<Modal {...rest} dialogClassName="custom-modal">
					<Modal.Header closeButton onHide={() => {onHide(true)}}>
					</Modal.Header>
					<Modal.Body>
						<Grid fluid>
							<Row >
								<Col sm={24} md={12}>
									{pollQuestion}
									<div className="texto_modales_rg margin_abajo_big">
										Sharing the detail of your opinion is the best way to engage with and influence government actions.
									</div>
								</Col>
							</Row>
							<Row>
								<FormGroup className="margin_abajo_big">
									<Row>
										<Col sm={12} md={12} lg={12}>
											<div className="form-group">
												<TagsInput placeHolder={reasonInputPlaceholder} value={this.state.tags} onChange={handleChange} />
											</div>
										</Col>
									</Row>
									<Row>
										<Col xs={12} className="text-center margin_abajo_big">

										</Col>
									</Row>
									<div className="form-group text-center margin_abajo_medium">
										<button type="button" className="btn btn-modal btn-link" onClick={() => onHide(false)}>Back</button>
										<button type="button" className="btn btn-modal btn-primary" onClick={reviewModelShow}>Next</button>
									</div>

								</FormGroup>
							</Row>
						</Grid>

					</Modal.Body>
					<Modal.Footer>

					</Modal.Footer>
				</Modal>

				<PollReview
					show={this.state.showReviewModel}
					onHide={reviewModelClose}
					reasonTags={this.state.tags}
					approved={approved}
					politicianId={politicianId}
				/>
			</div>
		);
	}
}

export default PollKeywords;
