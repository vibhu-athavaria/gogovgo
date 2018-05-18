/**
 * Created by vathavaria on 6/23/17.
 */

import React, { Component } from "react";
import Poll from "../Poll/Poll";
import { Row, Tab, Tabs } from "react-bootstrap";

export default class PoliticianBio extends Component {
    state = { show: { bio: false, desc: false } };

    render() {
        const { props } = this;
        let { show } = this.state;

        const readMore = key => {
            show[key] = true;
            this.setState({ show });
        };

        let readMoreBio;
        let readMoreDesc;

        if (!show.bio) {
            readMoreBio = (
                <div>
                    <button className="read-more" onClick={e => readMore("bio")}>
                        Read More <i className="fa fa-angle-down" aria-hidden="true" />
                    </button>
                </div>
            );
        }
        if (!show.desc) {
            readMoreDesc = (
                <div>
                    <button className="read-more" onClick={e => readMore("desc")}>
                        Read More <i className="fa fa-angle-down" aria-hidden="true" />
                    </button>
                </div>
            );
        }

        return (
            <div className="p-bio">
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
                                    <div className="hidden-xs">{props.bio}</div>
                                    <div className="visible-xs">
                                        {show.bio ? props.bio : props.bio.substring(0, 200)}
                                        {readMoreBio}
                                    </div>
                                </Tab>
                                <Tab eventKey={2} title="Job Description">
                                    <div className="hidden-xs">{props.jobDescription}</div>
                                    <div className="visible-xs">
                                        {show.desc
                                            ? props.jobDescription
                                            : props.jobDescription.substring(0, 200)}
                                        {readMoreDesc}
                                    </div>
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
    }
}
