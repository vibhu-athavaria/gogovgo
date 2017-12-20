/**
 * Created by vathavaria on 6/23/17.
 */

import React from 'react';
import {Component} from "react/lib/ReactBaseClasses";
import PoliticianBio from "./PoliticianBio";
import PoliticianDetail from "./PoliticianDetail";
import ReviewModal from "./ReviewModal"
import {Col, Grid, Modal} from "react-bootstrap";
import {gql, graphql} from "react-apollo";


class Politician extends Component {

	constructor(props, context) {
		super(props, context);
		this.state = {
			open: false,
			showReviewModal: false
		}
	}

	componentDidMount() {
		this.setState({
			showReviewModal: !!this.props.reviewId
		})
	}


	render() {
		const {data: {loading, error, politician}} = this.props;
		if (loading) {
			return <p>Loading...</p>;
		} else if (error) {
			return <p>Error!</p>;
		} else {
			let approvalCount = 0;
			let disapprovalCount = 0;
			politician.reviews.forEach(function(review, index) {
				if (review.sentiment === "POSITIVE") {
					approvalCount += 1;
				} else {
					disapprovalCount += 1;
				}
			});

			const headPoliticianStyle = {
				backgroundImage: `url(${politician.heroUrl})`
			};

			const reviewModalClose = () => {
				this.setState({showReviewModal: false});
			};

			return (
				<div>
					<div id="head_politician" style={headPoliticianStyle}>
						<Grid>
							<Col lg={5} md={7}>
								<PoliticianBio
									title={politician.publicOfficeTitle.displayName}
									bio={politician.bio}
									jobDescription={politician.jobDescription}
									name={politician.firstName + " " + politician.lastName}
									politicalParty={politician.politicalParty}
									approvalRating={politician.approvalRating}
									approvalCount={approvalCount}
									disapprovalCount={disapprovalCount}
									politicianId={politician.id}
									positiveTags={politician.positiveTags}
									negativeTags={politician.negativeTags}
								/>
							</Col>
						</Grid>
					</div>
					<PoliticianDetail
						reviews={politician.reviews}
						website={politician.website}
						phoneNumber={politician.phoneNumber}
						mailingAddress={politician.mailingAddress}
						approvalCount={approvalCount}
						disapprovalCount={disapprovalCount}
						politicianId={politician.id}
						politicianName={politician.firstName + " " + politician.lastName}
						politicianTitle={politician.publicOfficeTitle.displayName}
						positiveTags={politician.positiveTags}
						negativeTags={politician.negativeTags}
						staff={politician.staff}
						reviewId={this.props.reviewId}
					/>

					<Modal show={this.state.showReviewModal} dialogClassName="custom-modal" keyboard={true}>
						<Modal.Header bsClass="margin_abajo_mini" closeButton onHide={() => reviewModalClose()}/>
						<Modal.Body>
							<ReviewModal reviewId={this.props.reviewId} showShareURL={true} />
						</Modal.Body>
					</Modal>
				</div>
			);
		}
	}
}

// Initialize GraphQL queries or mutations with the `gql` tag
const getPolitician = gql`
	query getPolitician($url:String!) {
		politician(url:$url) {
			id,
			firstName,
			lastName,
			heroUrl,
			bio,
			jobDescription,
			politicalParty,
			approvalRating,
			positiveTags,
			negativeTags,
			publicOfficeTitle {
				displayName
			},					
			mailingAddress,
			website,
			phoneNumber,
			reviews {
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
	}
`;

const PoliticianWithData = graphql(getPolitician, {
	options: (props) => ({ variables: { url: props.politicianTitleUrl },})
})(Politician);


export default PoliticianWithData;
