/**
 * Created by vathavaria on 7/13/17.
 */

import React from 'react';
import {Component} from "react/lib/ReactBaseClasses";
import {Alert, Col, Modal, Row} from "react-bootstrap";
import PollKeywords from "./PollKeywords";
import PlacesAutocomplete from 'react-places-autocomplete'
import PollQuestion from './PollQuestion'
import PollKeyword from './PollKeywords'
import PollReview from './PollReview'
import SubscribeMoal from './SubscribeModal'
import ShareReviewURLModal from './ShareReviewURLModal'
import {POLL_MODAL_STATE} from '../../utils/constants'


class PollModal extends Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			pollState: POLL_MODAL_STATE.QUESTION,
			location: '',
			approved: false,
			showAlert: false,
		}
	}

	changeModalState = (pollState) => {
		this.setState({ pollState: pollState})
	};

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
		const {approvalCount, disapprovalCount, onHide, politicianId, politicianName, politicianTitle, positiveTags, negativeTags, ...restProps} = this.props;

		const showModal = (pollState) => {
			switch(pollState) {
				case POLL_MODAL_STATE.QUESTION:
					return <PollQuestion
						politicianId={politicianId}
						politicianName={politicianName}
						politicianTitle={politicianTitle}
						approvalCount={approvalCount}
						disapprovalCount={disapprovalCount}
						positiveTags={positiveTags}
						negativeTags={negativeTags}
						changeModalTo={(pollState) => this.changeModalState(pollState)}
					/>;
				case POLL_MODAL_STATE.TAGS:
					return <PollKeywords
						approved={this.state.approved}
						location={this.state.location}
						politicianId={politicianId}
						politicianName={politicianName}
						politicianTitle={politicianTitle}
						suggestedTags={this.state.approved? positiveTags : negativeTags}
						changeModalTo={(pollState) => this.changeModalState(pollState)}
					/>;
				case POLL_MODAL_STATE.REVIEW:
					return <PollReview/>;
				case POLL_MODAL_STATE.SUBSCRIBE:
					return <SubscribeMoal/>;
				case POLL_MODAL_STATE.SHARE:
					return <ShareReviewURLModal/>
			}
		};

		return (
			<div>
				<Modal {...restProps} dialogClassName="custom-modal">
					<Modal.Header closeButton onHide={() => onHide()}/>
					<Modal.Body>
						{showModal(this.state.pollState)}
					</Modal.Body>
					<Modal.Footer>
					</Modal.Footer>
				</Modal>
			</div>
		);
	}
}

export default PollModal;
