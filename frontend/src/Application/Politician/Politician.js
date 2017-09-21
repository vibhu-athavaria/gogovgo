/**
 * Created by vathavaria on 6/23/17.
 */

import React from 'react';
import {Component} from "react/lib/ReactBaseClasses";
import PoliticianBio from "./PoliticianBio";
import PoliticianDetail from "./PoliticianDetail";
import {Col, Grid} from "react-bootstrap";
import {gql, graphql} from "react-apollo";


class Politician extends Component {

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
					/>
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
			staff {
				member {
					firstName,
					lastName,  
					thumbnailTag,
					publicOfficeTitle {
					  displayName,
					  url,
					  country
					}
			  	}
			},
			mailingAddress,
			website,
			phoneNumber,
			reviews {
			  	user {
					firstName,
					lastName
			  	},
			  	sentiment,
			  	status,
			  	city,
			  	state,
			  	body,
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
