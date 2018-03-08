/**
 * Created by vathavaria on 6/23/17.
 */

import React from "react";
import { Component } from "react/lib/ReactBaseClasses";
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
            window.location.href.replace("#", "") + "/reviews/" + encrypt(this.props.reviewId);
        this.setState({ value: reviewURL });
    }

    render() {
        const onClose = () => {
            this.props.onHide(true);
            window.location.reload();
        };

        return (
            <Modal show={true} onHide={onClose} dialogClassName="custom-modal">
                <Modal.Header />
                <Modal.Body>
                    <div className="text-center">
                        <div className="circle centered blue">
                            <i className="fa fa-check" aria-hidden="true" />
                        </div>
                        <div className="your-review-has-been">
                            Your review has been submitted, and will be published within 24 hours.
                            Use the link below to share with other and track progress.
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
                                    <button>{this.state.copied ? "Copied" : "Copy"}</button>
                                </CopyToClipboard>
                            </InputGroup.Button>
                        </InputGroup>
                    </FormGroup>
                </Modal.Body>
                <Modal.Footer>
                    <div className="form-group text-center margin_abajo_medium">
                        <button type="button" className="btn btn-modal btn-link" onClick={onClose}>
                            Close
                        </button>
                    </div>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default ShareReviewURLModal;
