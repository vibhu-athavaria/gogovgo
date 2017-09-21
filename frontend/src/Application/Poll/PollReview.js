/**
 * Created by vathavaria on 6/23/17.
 */

import React from 'react';
import {Component} from "react/lib/ReactBaseClasses";
import { FormControl, FormGroup, Modal } from "react-bootstrap";
import SubscribeModalWithMutation from "../SubscribeModal";
import ReCAPTCHA from "react-google-recaptcha";


class PollReview extends Component {
	constructor(props, context) {
		super(props, context);
		this.state = this.initializeState(props)
	}

	initializeState(props) {
		return {
			politicianId: props.politicianId,
			reviewText: '',
			reviewTextValidation: null,
			showSubscribeModal: false,
			isHuman: false
		}
	}

	componentWillReceiveProps(nextProps) {
		this.setState(this.initializeState(nextProps));
	}

	render() {
		const {approved, onHide, politicianName, ...rest} = this.props;
		let pollQuestion;

		if (approved === true) {
			pollQuestion = <div className="texto_modales margin_abajo_medium">
				What are the primary reasons that you are <br/> <span className="color_approve">satisfied</span> with {politicianName}’s performance?
			</div>
		} else {
			pollQuestion = <div className="texto_modales margin_abajo_medium">
				What are the primary reasons that you are <br/> <span className="color_disapprove">dissatisfied</span> with {politicianName}’s performance?
			</div>
		}

		// specifying verify callback function for recatcha
		const onChangeCaptcha = (value) => {
			console.log(value);
			this.setState({isHuman: !!value});
		};


		const closeSubscribeModal = (closeParent) => {
			this.setState({showSubscribeModal: false});
			if (closeParent === true) {
				onHide(closeParent)
			}
		};

		const onSubmit = () => {
			if (this.state.reviewText === '') {
				this.setState({reviewTextValidation: 'error'})
			} else {
				this.setState({
					showSubscribeModal: true,
				});
			}
		};

		const handleReviewTextChange = (e) => {
			if (e.key !== 'Enter') {
				this.setState({
					reviewText: e.target.value,
					reviewTextValidation: null
				})
			}
		};


		return (
			<div>
				<Modal {...rest} dialogClassName="custom-modal" keyboard={true}>
					<Modal.Header closeButton onHide={() => onHide(true)}>
					</Modal.Header>

					<Modal.Body>
						{pollQuestion}

						<div className="texto_modales_rg margin_abajo_big">
							Please explain your answer in more detail (optional):
						</div>
						<FormGroup className="margin_abajo_big" validationState={this.state.reviewTextValidation}>
							<FormControl
								componentClass="textarea"
								placeholder="Please explain your answer in more detail..."
								onChange={handleReviewTextChange}
								bsSize="large"
							/>
						</FormGroup>
						<div className="margin_abajo_medium text-center recaptcha">
								<ReCAPTCHA
									ref="recaptcha"
									sitekey="6LeLIi8UAAAAAJ_kXlghvCfyava-bYboEEGT0nvj"
									onChange={onChangeCaptcha}
								/>
						</div>
					</Modal.Body>
					<Modal.Footer>
						<div className="form-group text-center margin_abajo_medium">
							<button type="button" className="btn btn-modal btn-link" onClick={() => onHide(false)}>Back</button>
							<button type="button" className="btn btn-modal btn-primary" onClick={onSubmit} disabled={!this.state.isHuman}>Next</button>
						</div>
					</Modal.Footer>
				</Modal>

				<SubscribeModalWithMutation
					show={this.state.showSubscribeModal}
					politicianId={this.props.politicianId}
					approved={this.props.approved}
					reviewText={this.state.reviewText}
					onHide={() => closeSubscribeModal(true)}
				/>
			</div>
		);
	}
}

export default PollReview;
