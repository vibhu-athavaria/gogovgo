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
