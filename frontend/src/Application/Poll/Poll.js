/**
 * Created by vathavaria on 6/23/17.
 */

import React from 'react';
import {Component} from "react/lib/ReactBaseClasses";
import { withCookies, Cookies } from 'react-cookie';
import { instanceOf } from 'prop-types';
import {Col, Row} from "react-bootstrap";
import PollReview from "./PollReview";
import PropTypes from 'prop-types';


class Poll extends Component {

	constructor(props, context) {
		super(props, context);
		this.state = {
			showReviewModel: false,
			approved: false
		};
	};

	componentWillMount() {
		const { cookies } = this.props;
		this.setState({votes: cookies.get('votes') || {}});

	}

	render() {
		const {politicianId} = this.props;
		const {votes} = this.state;
		const voted = votes.hasOwnProperty(politicianId) ? votes[politicianId]: '';
		const votedClass = voted !== ''? voted === 'approved'? 'voted-approve': 'voted-disapprove': '';

		const pollReviewModalClose = () => {
			this.setState({showReviewModel: false})
		};

		const showPollReviewModal = (isApproved) => {
			this.setState({
				showReviewModel: true,
				approved: isApproved
			})
		};

		return (
			<div>
			<Row>
				<Col xs={6} sm={3} md={4} lg={5}>
					<Row>
						<a className={"btn btn-secondary btn_circle approve " + votedClass} href="javascript:void(0)" onClick={()=> !voted ? showPollReviewModal(true):''}>
							<i className="fa fa-thumbs-up align-middle" aria-hidden="true"></i>
							<div className="box">
								<span className="votes">{this.props.approvalCount}</span><span>Approve</span>
							</div>
						</a>
					</Row>
				</Col>
				<Col xs={6} sm={9} md={8} lg={7}>
					<Row>
						<a className={"btn btn-secondary btn_circle disapprove " + votedClass} href="javascript:void(0)" onClick={()=> !voted ? showPollReviewModal(false):''}>
							<i className="fa fa-thumbs-down" aria-hidden="true"></i>
							<div className="box">
								<span className="votes">{this.props.disapprovalCount}</span><span>Disapprove</span>
							</div>
						</a>
					</Row>
				</Col>
			</Row>
			<Row>
				<div className="share-your-opinion-b">Share your opinion by clicking one of the buttons above.
					<br/> Reviews are safe, secure, and anonymous.
				</div>
			</Row>

			<PollReview
				show={this.state.showReviewModel}
				onHide={pollReviewModalClose}
				approved={this.state.approved}
				politicianId={this.props.politicianId}
				politicianTitle={this.props.politicianTitle}
				politicianName={this.props.politicianName}
			/>


			</div>
		);
	}
}

Poll.propTypes = {
	cookies: PropTypes.instanceOf(Cookies).isRequired,
};

export default withCookies(Poll);
