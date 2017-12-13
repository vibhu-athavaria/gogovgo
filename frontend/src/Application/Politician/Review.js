/**
 * Created by vathavaria on 6/23/17.
 */

import React from 'react';
import {Component} from "react/lib/ReactBaseClasses";
import {Col, Row} from "react-bootstrap";
import moment from 'moment';

class Review extends Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			open: false
		}
	}

	render() {
		const review = this.props.data;
		let sentimentClass =  this.props.approve ? "color_approve" : "color_disapprove";
		let sentimentText =  this.props.approve ? "Approve" : "Disapprove";
		sentimentClass += " content_title_2 margin_abajo_mini";
		let reasons = [];
		review.reasons.forEach(function(reason, index) {
			reasons.push(
				<button key={"reason:" + index} type="button" className="btn btn-tags">{reason.reasonTag.value}</button>
			)
		});

		const ellipsify = (str , length) => {
			if (str.length > length && !this.state.open) {
				return (
					<div>
						<div className="content_title_2_text">
							{(str.substring(0, length) + "...")}
						</div>
						<a href="javascript:void(0)" className="read-more" onClick={ (e)=> {e.stopPropagation();this.setState({ open: !this.state.open })}}>Read More <i className="fa fa-angle-down" aria-hidden="true"></i></a>
					</div>
				);

			}
			else {
				return(
					<div className="content_title_2_text">
						{str}
					</div>
				)
			}
		};
        var created_moment = moment(review.created);
		return (
			<div className="divisor">
				<div className="article_section_1 margin_abajo_big">
					<div className={sentimentClass}>{sentimentText}</div>
					<div className="content_title_2_sub margin_abajo_mini">{review.user? review.user : "Anonymous"}</div>
					<div className="content_title_2_ciudad margin_abajo_mini">{review.city}, {review.state}</div>
				</div>
				<div className="article_section_2 margin_abajo_mini">

					<div className="content_title_2_ciudad margin_abajo_mini">{created_moment.format("MMMM Do, YYYY")}</div>
				</div>
				<div className="article_section_3 margin_abajo_mini">
					{reasons}
				</div>
				<div className="article_section_4 margin_abajo_mini ">
					{ellipsify(review.body, 120)}
				</div>
				<div className="action-icons">
					<Row>
						<Col xs={3} sm={3} md={2} lg={2}>
							<a href="javascript:void(0)">
								<i className="fa fa-thumbs-o-up fa-stack-2x" aria-hidden="true"></i>
							</a>
							<div className="box">
								<span className="votes">{review.upVote}</span>
							</div>
						</Col>
						<Col xs={4} sm={4} md={3} lg={3}>
							<a href="javascript:void(0)" >
								<i className="fa fa-thumbs-o-down fa-stack-2x" aria-hidden="true"></i>
							</a>
							<div className="box">
								<span className="votes">{review.downVote}</span>
							</div>
						</Col>
					</Row>
				</div>
			</div>
		);
	}
}

export default Review;
