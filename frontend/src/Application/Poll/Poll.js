/**
 * Created by vathavaria on 6/23/17.
 */

import React from 'react';
import {Component} from "react/lib/ReactBaseClasses";
import { withCookies, Cookies } from 'react-cookie';
import { instanceOf } from 'prop-types';
import {Col, Row} from "react-bootstrap";
import PollReview from "./PollReview";
import PollQuestion from "./PollQuestion"
import PropTypes from 'prop-types';


class Poll extends Component {

	constructor(props, context) {
		super(props, context);
		this.state = {
			showPoll: false,
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

		const pollModelClose = () => {
			this.setState({showPoll: false})
		};

		const showPollModel = (isApproved) => {
			this.setState({
				showPoll: true,
				approved: isApproved
			})
		};

		return (
			<div>
				<Row>
					<Col xs={6} sm={3} md={4} lg={5}>
						<Row>
							<div className="action-icons">
							{/*<a className={"btn btn-secondary btn_circle approve " + votedClass} href="javascript:void(0)" onClick={()=> !voted ? showPollReviewModal(true):''}>*/}
								<i className="fa fa-thumbs-up align-middle" aria-hidden="true"></i>
								<div className="box">
									<span className="votes">{this.props.approvalCount}</span><span>Approve</span>
								</div>
							{/*</a>*/}
							</div>
						</Row>
					</Col>
					<Col xs={6} sm={9} md={8} lg={7}>
						<Row>
							<div className="action-icons">
							{/*<a className={"btn btn-secondary btn_circle disapprove " + votedClass} href="javascript:void(0)" onClick={()=> !voted ? showPollReviewModal(false):''}>*/}
								<i className="fa fa-thumbs-down" aria-hidden="true"></i>
								<div className="box">
									<span className="votes">{this.props.disapprovalCount}</span><span>Disapprove</span>
								</div>
							{/*</a>*/}
							</div>
						</Row>
					</Col>
				</Row>
				<Row>
					<div>
						<a className={"btn btn-secondary btn_circle disapprove " + votedClass} href="javascript:void(0)" onClick={()=> !voted ? showPollModel(false):''}>
							Rate Your Politician
						</a>
					<div className="share-your-opinion-b">Safe. Secure. Anonymous.
					</div>
						</div>
				</Row>

				<PollQuestion
					show={this.state.showPoll}
					onHide={pollModelClose}
					politicianId={this.props.politicianId}
					politicianName={this.props.politicianName}
					politicianTitle={this.props.politicianTitle}
					approvalCount={this.props.approvalCount}
					disapprovalCount={this.props.disapprovalCount}
				/>

				{/*<PollReview*/}
					{/*show={this.state.showReviewModel}*/}
					{/*onHide={pollReviewModalClose}*/}
					{/*approved={this.state.approved}*/}
					{/*politicianId={this.props.politicianId}*/}
					{/*politicianTitle={this.props.politicianTitle}*/}
					{/*politicianName={this.props.politicianName}*/}
				{/*/>*/}


			</div>
		);
	}
}

Poll.propTypes = {
	cookies: PropTypes.instanceOf(Cookies).isRequired,
};

export default withCookies(Poll);
