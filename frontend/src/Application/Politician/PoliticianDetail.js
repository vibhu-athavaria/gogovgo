/**
 * Created by vathavaria on 6/23/17.
 */

import React from "react";
import Reviews from "./Reviews";
import { Col, Row } from "react-bootstrap";

const PoliticianDetail = props => (
    <div className="container placeholder">
        <Row className="border_gris">
            <Col xs={12} className="text-center">
                <Reviews {...props} />
            </Col>
        </Row>
    </div>
);

export default PoliticianDetail;

//  NOTE form manvir: below is old code for Politician detail modal
//  Commenting out as I don't know if it's obsolete or might be useful in future
//  @vibhu - please take a look and remove it if it's no longer needed
//
// class PoliticianDetail extends Component {
//     render() {
//         // let cabinetTab = "";
//         // if (this.props.staff.length > 0) {
//         // 	cabinetTab = (
//         // 		<Tab tabClassName="nav-item" eventKey={2} title="Presidential Cabinet">
//         // 			<Cabinet staff={this.props.staff}/>
//         // 		</Tab>
//         // 	)
//         // }
//         return (
//             <div className="container placeholder">
//                 <Row className="border_gris">
//                     <Col xs={12} className="text-center">
//                         <Reviews {...this.props} />
//                         {/*<Tabs defaultActiveKey={1} id="politician-detail">*/}
//                         {/*<Tab tabClassName="nav-item" eventKey={1} title="Public Opinion">*/}
//                         {/*<Reviews*/}
//                         {/*reviews={this.props.reviews}*/}
//                         {/*politicianId={this.props.politicianId}*/}
//                         {/*politicianName={this.props.politicianName}*/}
//                         {/*politicianTitle={this.props.politicianTitle}*/}
//                         {/*approvalCount={this.props.approvalCount}*/}
//                         {/*disapprovalCount={this.props.disapprovalCount}*/}
//                         {/*positiveTags={this.props.positiveTags}*/}
//                         {/*negativeTags={this.props.negativeTags}*/}
//                         {/*/>*/}
//                         {/*</Tab>*/}

//                         {/*{cabinetTab}*/}

//                         {/*<Tab tabClassName="nav-item" eventKey={3} title="Contact">*/}
//                         {/*<Contact*/}
//                         {/*website={this.props.website}*/}
//                         {/*mailingAddress={this.props.mailingAddress}*/}
//                         {/*phoneNumber={this.props.phoneNumber}*/}
//                         {/*/>*/}
//                         {/*</Tab>*/}
//                         {/*</Tabs>*/}
//                     </Col>
//                 </Row>
//             </div>
//         );
//     }
// }
