/**
 * Created by vathavaria on 6/23/17.
 */

import React, { Component } from "react";
import PoliticianBio from "./PoliticianBio";
import PoliticianDetail from "./PoliticianDetail";
import ReviewModal from "./ReviewModal";
import { Col, Grid, Modal } from "react-bootstrap";
import { gql, graphql } from "react-apollo";

class Politician extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            open: false,
            showReviewModal: false,
            bgStyle: null
        };
        this.updateStyle(null, props);
    }

    componentDidMount() {
        this.updateStyle(null);
        window.addEventListener("resize", this.updateStyle.bind(this));
        this.setState({
            showReviewModal: !!this.props.reviewId
        });
    }

    componentWillReceiveProps(nextProps) {
        this.updateStyle(null, nextProps);
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.updateStyle.bind(this));
    }

    /**
     * Logic to show and hide politicians hero banner
     * based on current screen resolution
     */
    updateStyle(event, props) {
        if (!props) props = this.props;
        if (!props.data || !props.data.politician) return;
        const { politician } = props.data;
        if (!politician) return;
        const style =
            window.innerWidth > 768 ? { backgroundImage: `url(${politician.heroUrl})` } : null;
        if (style !== this.state.bgStyle) this.setState({ bgStyle: style });
    }

    render() {
        const {
            data: { loading, error, politician }
        } = this.props;
        if (loading) {
            return <p>Loading...</p>;
        } else if (error) {
            return <p>Error!</p>;
        }

        const reviewModalClose = () => {
            this.setState({ showReviewModal: false });
        };

        return (
            <div>
                <div id="head_politician" style={this.state.bgStyle}>
                    <Grid>
                        <Col lg={5} md={7}>
                            <PoliticianBio
                                title={politician.publicOfficeTitle.displayName}
                                bio={politician.bio}
                                avatarUrl={politician.avatarUrl}
                                jobDescription={politician.jobDescription}
                                name={politician.firstName + " " + politician.lastName}
                                politicalParty={politician.politicalParty}
                                approvalRating={politician.approvalRating}
                                approvalCount={politician.approvalCount}
                                disapprovalCount={politician.disapprovalCount}
                                politicianId={politician.id}
                                positiveTags={politician.positiveTags}
                                negativeTags={politician.negativeTags}
                            />
                        </Col>
                    </Grid>
                </div>
                <div id="politician-content">
                    <PoliticianDetail
                        {...politician}
                        politicianId={politician.id}
                        politicianName={politician.firstName + " " + politician.lastName}
                        politicianTitle={politician.publicOfficeTitle.displayName}
                        reviewId={this.props.reviewId}
                    />

                    <Modal
                        show={this.state.showReviewModal}
                        dialogClassName="custom-modal"
                        keyboard={true}
                    >
                        <Modal.Header
                            bsClass="margin_abajo_mini"
                            closeButton
                            onHide={() => reviewModalClose()}
                        />
                        <Modal.Body>
                            <ReviewModal reviewId={this.props.reviewId} showShareURL={true} />
                        </Modal.Body>
                    </Modal>
                </div>
            </div>
        );
    }
}

// Initialize GraphQL queries or mutations with the `gql` tag
const getPolitician = gql`
    query getPolitician($url: String!) {
        politician(url: $url) {
            id
            firstName
            lastName
            heroUrl
            avatarUrl
            bio
            jobDescription
            politicalParty
            approvalRating
            approvalCount
            disapprovalCount
            publicOfficeTitle {
                displayName
            }
            mailingAddress
            website
            phoneNumber
        }
    }
`;

const PoliticianWithData = graphql(getPolitician, {
    options: props => ({ variables: { url: props.politicianTitleUrl } })
})(Politician);

export default PoliticianWithData;
