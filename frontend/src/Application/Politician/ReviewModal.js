/**
 * Created by vathavaria on 12/9/17.
 */


import React from 'react';
import {Component} from "react/lib/ReactBaseClasses";
import {Col, Row} from "react-bootstrap";
import moment from 'moment';
import {gql, graphql} from "react-apollo";

class ReviewComponent extends Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			open: false
		}
	}

	render() {
		const {data: {loading, error, review}} = this.props;
		if (loading) {
			return <p>Loading...</p>;
		} else if (error) {
			return <p>Error!</p>;
		} else {
			let sentimentClass = this.props.approve ? "color_approve" : "color_disapprove";
			let sentimentText = this.props.approve ? "Approve" : "Disapprove";
			sentimentClass += " content_title_2 margin_abajo_mini";
			let reasons = [];
			review.reasons.forEach(function (reason, index) {
				reasons.push(
					<button key={"reason:" + index} type="button"
							className="btn btn-tags">{reason.reasonTag.value}</button>
				)
			});

			const ellipsify = (str, length) => {
				if (str.length > length && !this.state.open) {
					return (
						<div>
							<div className="content_title_2_text">
								{(str.substring(0, length) + "...")}
							</div>
							<a href="javascript:void(0)" className="read-more" onClick={ (e) => {
								e.stopPropagation();
								this.setState({open: !this.state.open})
							}}>Read More <i className="fa fa-angle-down" aria-hidden="true"></i></a>
						</div>
					);

				}
				else {
					return (
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
						<div
							className="content_title_2_sub margin_abajo_mini">{review.user ? review.user : "Anonymous"}</div>
						<div className="content_title_2_ciudad margin_abajo_mini">{review.city}, {review.state}</div>
					</div>
					<div className="article_section_2 margin_abajo_mini">

						<div
							className="content_title_2_ciudad margin_abajo_mini">{created_moment.format("MMMM Do, YYYY")}</div>
					</div>
					<div className="article_section_3 margin_abajo_mini">
						{reasons}
					</div>
					<div className="article_section_4 margin_abajo_big">
						{ellipsify(review.body, 120)}
					</div>
					<div>
						<Row>
							<Col xs={3} sm={3} md={4} lg={2}>
								<div className="action-icons">
									<a href="javascript:void(0)">
										<i className="fa fa-thumbs-o-up" aria-hidden="true"></i>
										<span className="votes">{review.upVote}</span>
									</a>
								</div>
							</Col>
							<Col xs={9} sm={9} md={8} lg={10}>
								<div className="action-icons">
									<a href="javascript:void(0)">
										<i className="fa fa-thumbs-o-down" aria-hidden="true"></i>
										<span className="votes">{review.downVote}</span>
									</a>
								</div>
							</Col>
						</Row>
					</div>
				</div>
			);
		}
	}
}

// Initialize GraphQL queries or mutations with the `gql` tag
const getReview = gql`
	query getReview($id:ID!) {
		review(id:$id) {
			id,			
		  	user {
				firstName,
				lastName
		  	},
		  	sentiment,
		  	status,
		  	city,
		  	state,
		  	body,
		  	upVote,
		  	downVote,
		  	created,
		  	reasons {
				reasonTag {
					value
				}			 
			}
  		}
	}
`;

const ReviewModal = graphql(getReview, {
	options: (props) => ({ variables: { id: props.reviewId },})
})(ReviewComponent);


export default ReviewModal;
