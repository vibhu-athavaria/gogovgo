/**
 * Created by vathavaria on 6/23/17.
 */

import React from 'react';
import {Component} from "react/lib/ReactBaseClasses";
import {Col, Row} from "react-bootstrap";
import { withCookies, Cookies } from 'react-cookie';
import moment from 'moment';
import {ControlLabel, FormControl, FormGroup, InputGroup} from "react-bootstrap";
import {CopyToClipboard} from 'react-copy-to-clipboard';
import {encrypt} from "../../utils/security"
import {graphql, gql} from "react-apollo";
import PropTypes from 'prop-types';


class Review extends Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			open: false,
			value: '',
			copied: false,
			showShareURL: false,
			reactedUp: false,
			reactedDown: false,
			upVoteCount: 0,
			downVoteCount: 0
		}
	}

	componentDidMount() {
		const reviewURL = window.location.href + '/reviews/' + encrypt(this.props.reviewId);
		this.setState({
			value: reviewURL,
			showShareURL: this.props.showShareURL,
			upVoteCount: this.props.data.upVote,
			downVoteCount: this.props.data.downVote
		})
	}

	componentWillMount() {
		const { cookies, data} = this.props;
		const emotionalReaction = cookies.get('emotionalReaction') || {};
		if(data.id in emotionalReaction) {
			if (emotionalReaction[data.id]) {
				this.setState({reactedUp: true})
			} else {
				this.setState({reactedDown: true})
			}
		}
	}

	render() {
		const {data, cookies, mutate, ...rest} = this.props;
		const review = data;
		const {reactedUp, reactedDown, upVoteCount, downVoteCount} = this.state;

		let sentimentClass =  this.props.approve ? "color_approve" : "color_disapprove";
		let sentimentText =  this.props.approve ? "Approve" : "Disapprove";
		sentimentClass += " content_title_2 margin_abajo_mini";
		let reasons = [];
		review.reasons.forEach(function(reason, index) {
			reasons.push(
				<button key={"reason:" + index} type="button" className="btn btn-tags">{reason.reasonTag.value}</button>
			)
		});

		const actionIconHandler = (thumbUp) => {
			mutate({
				variables: {
					reviewId: review.id,
					upVote: thumbUp
				}
			}).then(({data}) => {
				let emotionalReaction = cookies.get('emotionalReaction') || {};
				emotionalReaction[review.id] = thumbUp;
				cookies.set('emotionalReaction', emotionalReaction, { path: '/' });
				if (thumbUp) {
					this.setState({upVoteCount: upVoteCount+1, reactedUp: true})
				} else {
					this.setState({downVoteCount: downVoteCount+1, reactedDown: true})
				}
			});
		};

		const ellipsify = (str , length) => {
			if (str.length > length && !this.state.open) {
				return (
					<div>
						<div className="content_title_2_text">{(str.substring(0, length) + "...")}</div>
						<a href="javascript:void(0)" className="read-more" onClick={ (e)=> {e.stopPropagation();this.setState({ open: !this.state.open })}}>Read More <i className="fa fa-angle-down" aria-hidden="true"></i></a>
					</div>
				);
			}
			else {
				return(<div className="content_title_2_text">{str}</div>)
			}
		};

        const created_moment = moment(review.created);
		return (
			<div className="divisor">
				<div className="article_section_1 margin_abajo_big">
					<div className={sentimentClass}>{sentimentText}</div>
					<div className="content_title_2_sub margin_abajo_mini">{review.user? review.user : "Anonymous"}<span className="content_title_2_ciudad"> ({review.city}, {review.state})</span></div>
					<div className="content_title_2_ciudad margin_abajo_mini"></div>
					<div className="content_title_2_ciudad margin_abajo_mini">{created_moment.format("MMMM Do, YYYY")}</div>
				</div>
				<div className="article_section_2 margin_abajo_mini">

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
							<a href="javascript:void(0)" onClick={() => {if(!(reactedUp || reactedDown)) {actionIconHandler(true)}}}>
								<span className={"votes-approve "+ (reactedUp? "reacted-up": "")}>{upVoteCount}</span>
							</a>
						</Col>
						<Col xs={4} sm={4} md={3} lg={3}>
							<a href="javascript:void(0)" onClick={() => {if(!(reactedUp || reactedDown)) {actionIconHandler(false)}}}>
								<span className={"votes-disapprove "+ (reactedDown? "reacted-down": "")}>{downVoteCount}</span>
							</a>
						</Col>
					</Row>
				</div>

				{ this.state.showShareURL && (
					<div className="margin_abajo_big">
						<ControlLabel>Copy this private URL to share:</ControlLabel>
						<FormGroup>
							<InputGroup>
								<FormControl
									id="fullnametxt"
									type="text"
									value={this.state.value}
									onChange={({target: {value}}) => this.setState({value, copied: false})}
								/>
								<InputGroup.Button>
									<CopyToClipboard text={this.state.value}
													 onCopy={() => this.setState({copied: true})}>
										<button>{this.state.copied? "Copied": "Copy"}</button>
									</CopyToClipboard>
								</InputGroup.Button>
							</InputGroup>
						</FormGroup>
					</div>
				)}
			</div>
		);
	}
}


Review.propTypes = {
	cookies: PropTypes.instanceOf(Cookies).isRequired,
};

const updateQuery = gql`
  mutation updateReview(
  		$reviewId: ID!,
  		$upVote: Boolean!,  		  		
	) {
    	updateReview(
    		reviewId:$reviewId, 
    		upVote:$upVote, 
		) {
      		review {
      			id
      		}
		}
  	}
`;


Review = graphql(updateQuery)(Review);
export default withCookies(Review);
