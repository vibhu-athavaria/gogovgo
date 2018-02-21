/**
 * Created by vathavaria on 6/23/17.
 */

import React from "react";
import { Component } from "react/lib/ReactBaseClasses";
import { Button, Col, FormGroup, Grid, Label, Modal, Row } from "react-bootstrap";
import ReactTags from "react-tag-autocomplete";
import ReactGA from "react-ga";

// import TagsInput from 'react-tagsinput'
// import 'react-tagsinput/react-tagsinput.css'

class PollKeywords extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            reasonTags: [],
            showReviewModel: false,
            reasonInputValue: "",
            tags: [],
            suggestions: []
        };
    }

    componentWillMount() {
        const _sg = this.props.approved ? this.props.positiveTags : this.props.negativeTags;
        const suggestions = _sg.map((tag, index) => {
            return { id: index + 1, name: tag };
        });
        this.setState({ suggestions: suggestions });
    }

    render() {
        // Local variables
        const { approved, onHide, politicianId, politicianName, suggestedTags, prev } = this.props;
        const { tags } = this.state;

        let reasons = [];
        let emotionTag = "";

        tags.forEach(function(reason, index) {
            reasons.push(<Label key={"reason:" + index}>{reason}</Label>);
        });

        console.log("suggestions are\n", this.state.suggestions);
        const reasonInputPlaceholder = this.state.suggestions
            .slice(0, 3)
            .map(tag => {
                return tag.name;
            })
            .join(", ");

        if (approved === true) {
            emotionTag = <span className="color_approve">satisfied</span>;
        } else {
            emotionTag = <span className="color_disapprove">dissatisfied</span>;
        }
        const pollQuestion = (
            <div className="texto_modales margin_abajo_medium">
                What are the primary reason that you are {emotionTag} with {politicianName}'s
                performance?
            </div>
        );

        // Event handlers
        const pollReviewModelClose = closeParent => {
            this.setState({ showReviewModel: false, showSelf: !closeParent });
            if (closeParent === true) {
                onHide(closeParent);
            }
        };

        const reviewModelShow = () => {
            ReactGA.event({
                category: "User",
                action: "Modal_PrimaryReasons",
                label: "Next"
            });
            this.props.next({ tags: this.state.tags });
        };

        const handleDelete = index => {
            const tags = this.state.tags.slice(0);
            const tag = tags.splice(index, 1);
            const suggestions = this.state.suggestions;
            suggestions.push(tag[0]);
            this.setState({ suggestions: suggestions, tags: tags });
        };

        const handleAddition = tag => {
            const tags = [].concat(this.state.tags, tag);
            const suggestions = this.state.suggestions.filter(function(elm) {
                return elm.id !== tag.id;
            });
            this.setState({ tags: tags, suggestions: suggestions });
        };

        return (
            <Modal show={true} onHide={() => onHide()} dialogClassName="custom-modal">
                <Modal.Header closeButton />
                <Modal.Body>
                    <Grid fluid>
                        <Row>
                            <Col sm={24} md={12}>
                                {pollQuestion}
                            </Col>
                        </Row>
                        <Row>
                            <FormGroup className="margin_abajo_big">
                                <Row>
                                    <Col sm={12} md={12} lg={12}>
                                        <div className="form-group">
                                            <ReactTags
                                                tags={this.state.tags}
                                                suggestions={this.state.suggestions}
                                                handleDelete={handleDelete}
                                                handleAddition={handleAddition}
                                                autoResize={false}
                                                placeholder={reasonInputPlaceholder + "..."}
                                                allowNew={true}
                                            />
                                        </div>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs={12} className="text-center margin_abajo_big" />
                                </Row>
                            </FormGroup>
                        </Row>
                    </Grid>
                </Modal.Body>
                <Modal.Footer>
                    <div className="form-group text-center margin_abajo_medium">
                        <button
                            type="button"
                            className="btn btn-modal btn-link"
                            onClick={() => prev()}
                        >
                            Back
                        </button>
                        <button
                            type="button"
                            className="btn btn-modal btn-primary"
                            onClick={reviewModelShow}
                        >
                            Next
                        </button>
                    </div>
                </Modal.Footer>
                {/*  <PollReview
                    show={this.state.showReviewModel}
                    onHide={pollReviewModelClose}
                    tags={this.state.tags}
                    approved={approved}
                    politicianId={politicianId}
                /> */}
            </Modal>
        );
    }
}

export default PollKeywords;
