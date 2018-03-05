/**
 * Created by vathavaria on 6/23/17.
 */

import React from "react";
import Poll from "../Poll/Poll";
import { Row, Tab, Tabs } from "react-bootstrap";
// import ApprovalRating from "./ApprovalRating";

const PoliticianBio = props => (
    <div>
        <div className="container_text_banner">
            <Row>
                <div className="avatar-image pull-left">
                    <img src={props.avatarUrl} alt={props.name} />
                </div>
                <div className="text pull-left">
                    <div className="cabecera_1_banner">{props.title}</div>
                    <div className="cabecera_2_banner">{props.name}</div>
                    <div className="cabecera_3_banner margin_abajo_small">
                        {props.politicalParty}
                    </div>
                </div>
            </Row>

            <Row>
                <div className="margin_abajo_small" />
                <div className="politician-bio-and-job margin_abajo_medium">
                    <Tabs defaultActiveKey={1} id="politician-detail-bio-and-job">
                        <Tab eventKey={1} title="Bio">
                            {props.bio}
                        </Tab>
                        <Tab eventKey={2} title="Job Description">
                            {props.jobDescription}
                        </Tab>
                    </Tabs>
                </div>
            </Row>
            {/*<ApprovalRating approvalRating={props.approvalRating}/>*/}
        </div>
        <Poll
            approvalCount={props.approvalCount}
            disapprovalCount={props.disapprovalCount}
            politicianId={props.politicianId}
            politicianTitle={props.title}
            politicianName={props.name}
            positiveTags={props.positiveTags}
            negativeTags={props.negativeTags}
        />
    </div>
);

export default PoliticianBio;
