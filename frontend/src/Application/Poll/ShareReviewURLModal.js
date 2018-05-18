/**
 * Created by vathavaria on 6/23/17.
 */

import React, { Component } from "react";
import { ControlLabel, FormControl, FormGroup, InputGroup, Modal } from "react-bootstrap";
import { encrypt } from "../../utils/security";
import { CopyToClipboard } from "react-copy-to-clipboard";

class ShareReviewURLModal extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            value: "",
            copied: false
        };
    }

    componentDidMount() {
        const reviewURL =
            window.location.origin +
            "/politician/us/president-united-states/reviews/" +
            encrypt(this.props.reviewId);
        this.setState({ value: reviewURL });
    }

    render() {
        const onClose = () => {
            this.props.history.push("/politician/us/president-united-states");
        };

        return (
            <div>
                <Modal.Body>
                    <div className="text-center">
                        <div className="circle centered blue">
                            <i className="fa fa-check" aria-hidden="true" />
                        </div>
                        <div className="your-review-has-been">
                            Your review has been published. Use the link below to access your review
                            and share with friends. The most upvoted reviews earn authors special
                            access to new product features.
                        </div>
                    </div>

                    <ControlLabel>Copy this private URL to share:</ControlLabel>
                    <FormGroup>
                        <InputGroup>
                            <FormControl
                                id="fullnametxt"
                                type="text"
                                value={this.state.value}
                                onChange={({ target: { value } }) =>
                                    this.setState({ value, copied: false })
                                }
                            />
                            <InputGroup.Button>
                                <CopyToClipboard
                                    text={this.state.value}
                                    onCopy={() => this.setState({ copied: true })}
                                >
                                    <button className="btn btn-primary">
                                        {this.state.copied ? "Copied" : "Copy"}
                                    </button>
                                </CopyToClipboard>
                            </InputGroup.Button>
                        </InputGroup>
                    </FormGroup>
                </Modal.Body>
                <Modal.Footer>
                    <div className="form-group text-center m0">
                        <button
                            type="button"
                            className="btn btn-modal btn-primary"
                            onClick={onClose}
                        >
                            Continue
                        </button>
                    </div>
                </Modal.Footer>
            </div>
        );
    }
}

export default ShareReviewURLModal;
