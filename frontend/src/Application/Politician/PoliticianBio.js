/**
 * Created by vathavaria on 6/23/17.
 */

import React from 'react';
import {Component} from "react/lib/ReactBaseClasses";
import ApprovalRating from "./ApprovalRating";
import Poll from "../Poll/Poll";
import {Row, Tab, Tabs} from "react-bootstrap";

class PoliticianBio extends Component {

	render() {
		return (
			<div className="container_text_banner">
				<Row>
					<div className="cabecera_1_banner">{this.props.title}</div>
				</Row>
				<Row>
					<div className="cabecera_2_banner">{this.props.name}</div>
				</Row>
				<Row>
					<div className="cabecera_3_banner margin_abajo_small">{this.props.politicalParty}</div>
				</Row>
				<Row>
					<div className="margin_abajo_small"></div>
					<div className="politician-bio-and-job margin_abajo_medium">
						<Tabs defaultActiveKey={1} id="politician-detail-bio-and-job">
							<Tab eventKey={1} title="Bio">{this.props.bio}</Tab>
							<Tab eventKey={2} title="Job Description">{this.props.jobDescription}</Tab>
						</Tabs>

					</div>
				</Row>
				{/*<ApprovalRating approvalRating={this.props.approvalRating}/>*/}
				<Poll
					approvalCount={this.props.approvalCount}
					disapprovalCount={this.props.disapprovalCount}
					politicianId={this.props.politicianId}
					politicianTitle={this.props.title}
					politicianName={this.props.name}
				/>
			</div>
		);
	}
}

export default PoliticianBio;
