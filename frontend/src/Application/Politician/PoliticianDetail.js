/**
 * Created by vathavaria on 6/23/17.
 */

import React from "react";
import { Component } from "react/lib/ReactBaseClasses";
import Reviews from "./Reviews";
import { Col, Row, Tab, Tabs } from "react-bootstrap";

import Cabinet from "./Cabinet";
import Contact from "./Contact";

class PoliticianDetail extends Component {
    render() {
        // let cabinetTab = "";
        // if (this.props.staff.length > 0) {
        // 	cabinetTab = (
        // 		<Tab tabClassName="nav-item" eventKey={2} title="Presidential Cabinet">
        // 			<Cabinet staff={this.props.staff}/>
        // 		</Tab>
        // 	)
        // }
        return (
            <div className="container placeholder">
                <Row className="border_gris">
                    <Col xs={12} className="text-center">
                        <Reviews {...this.props} />
                        {/*<Tabs defaultActiveKey={1} id="politician-detail">*/}
                        {/*<Tab tabClassName="nav-item" eventKey={1} title="Public Opinion">*/}
                        {/*<Reviews*/}
                        {/*reviews={this.props.reviews}*/}
                        {/*politicianId={this.props.politicianId}*/}
                        {/*politicianName={this.props.politicianName}*/}
                        {/*politicianTitle={this.props.politicianTitle}*/}
                        {/*approvalCount={this.props.approvalCount}*/}
                        {/*disapprovalCount={this.props.disapprovalCount}*/}
                        {/*positiveTags={this.props.positiveTags}*/}
                        {/*negativeTags={this.props.negativeTags}*/}
                        {/*/>*/}
                        {/*</Tab>*/}

                        {/*{cabinetTab}*/}

                        {/*<Tab tabClassName="nav-item" eventKey={3} title="Contact">*/}
                        {/*<Contact*/}
                        {/*website={this.props.website}*/}
                        {/*mailingAddress={this.props.mailingAddress}*/}
                        {/*phoneNumber={this.props.phoneNumber}*/}
                        {/*/>*/}
                        {/*</Tab>*/}
                        {/*</Tabs>*/}
                    </Col>
                </Row>
            </div>
        );
    }
}

export default PoliticianDetail;
