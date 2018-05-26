import React from "react";
import { Link } from "react-router-dom";

const Contact = () => (
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
            <div className="contact-form">
                <input type="text" className="form-control" placeholder="Name" />
                <input type="email" className="form-control" placeholder="Email" />
                <textarea className="form-control" placeholder="Message" />
                <button className="btn btn-primary">Submit</button>
            </div>
        </div>
    </div>
);

export default Contact;
