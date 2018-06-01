import React, { Component } from "react";
import { Link } from "react-router-dom";
import { gql, graphql } from "react-apollo";

/**
 * Component for 'Contact' page
 */
class Contact extends Component {
    state = {
        busy: false,
        form: { name: "", email: "", message: "" },
        errors: [],
        sent: false
    };

    /**
     * Update form in state as user types in input/textarea field
     * @param {string} field - name of form field
     * @param {object} event - onchange JS event
     */
    handleChange(field, event) {
        let form = { ...this.state.form };
        form[field] = event.target.value;
        this.setState({ form: form });
    }

    /**
     * Handle submission
     */
    handleSubmit = () => {
        if (this.state.busy) return;
        this.setState({ busy: true, errors: [], sent: false });
        this.props
            .mutate({ variables: { ...this.state.form } })
            .then(({ data: { contact } }) => {
                let state = { busy: false };
                if (contact.sent) {
                    state.sent = true;
                    state.form = { name: "", email: "", message: "" };
                } else {
                    state.errors = contact.errors;
                }
                this.setState(state);
            })
            .catch(error => {
                console.warn("there was an error sending the query", error);
                this.setState({ errors: [error.graphQLErrors[0].message] });
            });
    };

    /**
     * Alert to show on page
     * @returns JSX
     */
    getAlert() {
        const { busy, errors, sent } = this.state;
        if (busy) return <div class="alert alert-info">Sending email...</div>;
        if (sent) return <div class="alert alert-success">Your message has been sent.</div>;
        if (errors.length)
            return (
                <div class="alert alert-danger">
                    <strong>Failed!</strong> The following error(s) have occured:
                    <ul>{errors.map((error, index) => <li key={index}>{error}</li>)}</ul>
                </div>
            );
    }

    /**
     * Component layout
     * @returns JSX
     */
    render() {
        const { form } = this.state;
        return (
            <div className="submit-step">
                <div className="logo">
                    <Link to="/politician/us/president-united-states" className="main">
                        DonaldTrumpReviews.com
                    </Link>
                </div>
                <div className="p10">
                    <div className="texto_modales mb10">Contact DonaldTrumpReviews.com</div>
                    <div className="modal_text_small opinion">
                        Use the following form to contact DonaldTrumpReviews.com staff.
                    </div>

                    {this.getAlert()}

                    <div className="contact-form">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Name"
                            value={form.name}
                            onChange={event => this.handleChange("name", event)}
                        />
                        <input
                            type="email"
                            className="form-control"
                            placeholder="Email"
                            value={form.email}
                            onChange={event => this.handleChange("email", event)}
                        />
                        <textarea
                            className="form-control"
                            placeholder="Message"
                            value={form.message}
                            onChange={event => this.handleChange("message", event)}
                        />
                        <button className="btn btn-primary" onClick={this.handleSubmit}>
                            Submit
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

//  GraphQL mutation
const submitQuery = gql`
    mutation($name: String!, $email: String!, $message: String!) {
        contact(name: $name, email: $email, message: $message) {
            sent
            errors
        }
    }
`;

export default graphql(submitQuery)(Contact);
