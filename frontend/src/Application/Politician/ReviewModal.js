/**
 * Created by vathavaria on 12/9/17.
 */


import React from 'react';
import {Component} from "react/lib/ReactBaseClasses";
import {gql, graphql} from "react-apollo";
import Review from './Review'

class ReviewModal extends Component {

	render() {
		const {data: {loading, error, review}} = this.props;
		if (loading) {
			return <p>Loading...</p>;
		} else if (error) {
			return <p>Error!</p>;
		} else {
			return (<Review approve={this.props.approve} data={review} showShareURL={this.props.showShareURL}/>);
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

ReviewModal = graphql(getReview, {
	options: (props) => ({ variables: { id: props.reviewId },})
})(ReviewModal);


export default ReviewModal;
