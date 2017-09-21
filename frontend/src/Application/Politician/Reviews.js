/**
 * Created by vathavaria on 6/23/17.
 */

import React from 'react';
import {Component} from "react/lib/ReactBaseClasses";
import Review from "./Review";
import PollQuestion from '../Poll/PollQuestion'
import {Col, Row} from "react-bootstrap";

class Reviews extends Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			showPollQuestions: false
		};

	}

	render() {
		// Event handlers
		const pollModelClose = () => this.setState({ showPoll: false });


		let leftReviews =0;
		let rightReviews = 0;
		let topNegativeTags = [];
		let topPostiveTags = [];
		let approvedReviews = [];
		let disapprovedReviews = [];
		this.props.reviews.forEach(function(review, index) {
			if (review.status === "APPROVED") {
				if (review.sentiment === "POSITIVE") {
					approvedReviews.push(<Review key={"approve:" + index} data={review} approve={true}/>);
					leftReviews += 1;

				} else {
					disapprovedReviews.push(<Review key={"disapprove:" + index} data={review}  approve={false}/>);
					rightReviews += 1;
				}
			}

		});

		this.props.negativeTags.forEach(function(tag, index) {
			topNegativeTags.push(
				<button type="button" className="btn btn-tags" key={"ntag-"+index}>{tag}</button>
			)
		});

		this.props.positiveTags.forEach(function(tag, index) {
			topPostiveTags.push(
				<button type="button" className="btn btn-tags" key={"ntag-"+index}>{tag}</button>
			)
		});

		const getStyle = () => {
			if (leftReviews >= rightReviews) {
				return {borderRight: '1px solid #efefef'}
			} else {
				return {borderLeft: '1px solid #efefef',}
			}

		};


		return (
		<Col>
			<Row>
				<Col xs={12} lg={12} md={18}>
					<div className="titulo_content text-center">Reviews</div>
					<div className="go-gov-go-reviews-are">
						GoGovGo reviews are crowdsourced reviews provided by
						citizens all over the world. Explore reviews provided by others, or submit your own to engage in politics, and connect with others around the world.
					</div>
				</Col>
			</Row>
			<Row>
				<Col sm={6}>
					<div className="content_title color_approve margin_abajo_small">Approve </div>
					<div className="content_text margin_abajo_small">
						Top reasons why people <span className="color_approve">approve </span>
						of the way {this.props.politicianName} is handling his job as {this.props.politicianTitle}:
					</div>
					<div className="content_tag">
						<div className="row">
							<div className="col col-md-12 text-center">
								{topPostiveTags}
							</div>
						</div>
					</div>
				</Col>

				<Col sm={6}>
					<div className="content_title color_disapprove margin_abajo_small">Disapprove </div>
					<div className="content_text margin_abajo_small">
						Top reasons why people <span className="color_disapprove">disapprove </span>  of the way {this.props.politicianName} is handling his job as {this.props.politicianTitle}:
					</div>
					<div className="content_tag">
						<div className="row ">
							<div className="col col-md-12 text-center">
								{topNegativeTags}
							</div>
						</div>
					</div>
				</Col>
			</Row>

			<div className="contenedor_articulos text-left">
				<Row>
					<Col lg={6} sm={6} className="review-approve" style={getStyle()}>
						{approvedReviews}
					</Col>
					<Col lg={6} sm={6} className="review-disapprove" style={getStyle()}>
						{disapprovedReviews}
					</Col>
				</Row>
			</div>

			<Row>
				<Col lg={6} sm={6}>
					<button className="btn btn-default btn-see-more pull-right" type="submit">See more</button>
				</Col>
				<Col lg={6} sm={6}>
					<button className="btn btn-primary btn-see-more-primary pull-left" type="submit" onClick={()=>this.setState({showPoll: true})}>
						Submit Review
					</button>
				</Col>
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
		</Col>

		);
	}
}

export default Reviews;
