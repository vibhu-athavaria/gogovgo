/**
 * Created by vathavaria on 6/23/17.
 */

import React from 'react';
import {Component} from "react/lib/ReactBaseClasses";
import { withCookies, Cookies } from 'react-cookie';
import { instanceOf } from 'prop-types';
import {ControlLabel, FormControl, FormGroup, Modal} from "react-bootstrap";
import {gql} from "react-apollo";
import {graphql} from "react-apollo";
import PropTypes from 'prop-types';

class SubscribeModal extends Component {

	initializeState() {
		return {
			fullname: '',
			fullnameValidation: null,
			emailAddress: '',
			emailValidation: null,
			// location: '',
			// locationValidation: null
		}
	}

	constructor(props, context) {
		super(props, context);
		this.state = this.initializeState()
	}

	componentWillReceiveProps() {
		this.setState(this.initializeState())
	}


	componentWillMount() {
		const { cookies } = this.props;
		this.setState({votes: cookies.get('votes') || {}});
	}

	render() {
		const {politicianId, reviewText, approved, mutate, onHide, ...rest} = this.props;
		const {votes} = this.state;
		const sentiment = approved ? 'positive': 'negative';
		const { cookies } = this.props;

		const validateEmail = (email) => {
			const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			return re.test(email);
		};

		const onSubmit = () => {
			mutate({
				variables: {
					politicianId:politicianId,
					sentiment: sentiment,
					body: reviewText,
					fullname: this.state.fullname,
					emailAddress: this.state.emailAddress,
					// location: this.state.location
				}
			})
				.then(({ data }) => {
					onHide(true);
					votes[politicianId] = approved ? "approved": "disapproved";
					this.setState({votes: votes});
					cookies.set('votes', votes, { path: '/' });
					window.location.reload();
				}).catch((error) => {
				console.log('there was an error sending the query', error);
			});
		};

		const onSubmitWithUserValidation = () => {
			let errorState = {};
			let validationErrors = false;

			if (this.state.fullname === '') {
				errorState.fullnameValidation = 'error';
				validationErrors = true;
			}

			if (this.state.emailAddress === '' || !validateEmail(this.state.emailAddress)) {
				errorState.emailValidation = 'error';
				validationErrors = true;
			}

			// if (this.state.location === '') {
			// 	errorState.locationValidation = 'error'
			// }

			if (validationErrors) {
				this.setState(errorState)
			} else {
				onSubmit();
			}
		};


		const fullnameTextChange = (e) => {
			if (e.key !== 'Enter') {
				this.setState({
					fullname: e.target.value,
					fullnameValidation: null
				})
			}
		};

		const emailAddressTextChange = (e) => {
			if (e.key !== 'Enter') {
				this.setState({
					emailAddress: e.target.value,
					emailValidation: null
				})
			}
		};

		// const locationTextChange = (e) => {
		// 	if (e.key !== 'Enter') {
		// 		this.setState({
		// 			location: e.target.value,
		// 			locationValidation: null
		// 		})
		// 	}
		// };

		return (

			<Modal {...rest} dialogClassName="custom-modal">
				<Modal.Header/>
				<Modal.Body>
					<div className="text-center">
						<div className="circle centered blue">
							<i className="fa fa-check" aria-hidden="true"></i>
						</div>
						<div className="your-review-has-been">
							Your review has been submitted. We will take it from here, and make <br/>
							sure your feedback gets to lawmakers and decision makers.
						</div>
					</div>
					<div className="texto_modales margin_abajo_big">Get Updates from GoGovGo</div>
					<form>
					<FormGroup validationState={this.state.fullnameValidation}>
						<ControlLabel>Full name</ControlLabel>
						<FormControl
							id="fullnametxt"
							type="text"
							placeholder="Enter your name"
							onChange={fullnameTextChange}
						/>
					</FormGroup>
					<FormGroup validationState={this.state.emailValidation}>
						<ControlLabel>E-mail</ControlLabel>
						<FormControl
							id="emailtxt"
							type="email"
							placeholder="Enter your e-mail"
							onChange={emailAddressTextChange}
						/>
					</FormGroup>
					{/*<FormGroup  validationState={this.state.locationValidation}>*/}
						{/*<ControlLabel>Location</ControlLabel>*/}
						{/*<FormControl*/}
							{/*id="locationtxt"*/}
							{/*type="text"*/}
							{/*placeholder="Enter your location"*/}
							{/*onChange={locationTextChange}*/}
						{/*/>*/}
					{/*</FormGroup>*/}
					</form>
				</Modal.Body>
				<Modal.Footer>
					<div className="form-group text-center margin_abajo_medium">
						<button type="button" className="btn btn-modal btn-link" onClick={onSubmit.bind(this)}>Skip</button>
						<button type="button" className="btn btn-modal btn-primary" onClick={onSubmitWithUserValidation.bind(this)}>Submit</button>
					</div>
				</Modal.Footer>
			</Modal>

		);
	}
}

SubscribeModal.propTypes = {
	cookies: PropTypes.instanceOf(Cookies).isRequired,
};

const submitQuery = gql`
  mutation createReview(
  		$politicianId: ID!,
  		$sentiment: String!,  		  		
  		$body: String!,
  		$userId: ID
	) {
    	createReview(
    		politicianId:$politicianId, 
    		sentiment:$sentiment, 
    		body:$body,
    		userId:$userId
		) {
      		review {
      			id
      		}
		}
  	}
`;

const SubscribeModalWithMutation = graphql(submitQuery)(SubscribeModal);

export default withCookies(SubscribeModalWithMutation);
