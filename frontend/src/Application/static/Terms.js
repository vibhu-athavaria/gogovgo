import React from "react";
import { Link } from "react-router-dom";
import { ListGroup, ListGroupItem } from "react-bootstrap";

const Terms = () => (
    <div className="submit-step">
        <div className="logo">
            <Link to="/politician/us/president-united-states" className="main">
                DonaldTrumpReviews.com
            </Link>
        </div>
        <div className="p10">
            <div className="texto_modales mb10">Terms of Service ("Terms")</div>
            <ListGroup>
                <ListGroupItem>Last updated: July 12, 2017</ListGroupItem>
                <ListGroupItem>
                    Please read these Terms of Service ("Terms", "Terms of Service") carefully
                    before using the DonaldTrumpReviews.com website (the "Service") operated by
                    DonaldTrumpReviews ("us", "we", or "our"). Your access to and use of the Service
                    is conditioned on your acceptance of and compliance with these Terms. These
                    Terms apply to all visitors, users and others who access or use the Service. By
                    accessing or using the Service you agree to be bound by these Terms. If you
                    disagree with any part of the terms then you may not access the Service. This
                    Terms of Service is licensed by TermsFeed Generator to DonaldTrumpReviews.
                </ListGroupItem>
                <ListGroupItem header="Links To Other Web Sites">
                    Our Service may contain links to third-party web sites or services that are not
                    owned or controlled by DonaldTrumpReviews. DonaldTrumpReviews has no control
                    over, and assumes no responsibility for, the content, privacy policies, or
                    practices of any third party web sites or services. You further acknowledge and
                    agree that DonaldTrumpReviews shall not be responsible or liable, directly or
                    indirectly, for any damage or loss caused or alleged to be caused by or in
                    connection with use of or reliance on any such content, goods or services
                    available on or through any such web sites or services. We strongly advise you
                    to read the terms and conditions and privacy policies of any third-party web
                    sites or services that you visit.
                </ListGroupItem>
                <ListGroupItem header="Termination">
                    We may terminate or suspend access to our Service immediately, without prior
                    notice or liability, for any reason whatsoever, including without limitation if
                    you breach the Terms. All provisions of the Terms which by their nature should
                    survive termination shall survive termination, including, without limitation,
                    ownership provisions, warranty disclaimers, indemnity and limitations of
                    liability.
                </ListGroupItem>
                <ListGroupItem header="Governing Law">
                    These Terms shall be governed and construed in accordance with the laws of
                    California, United States, without regard to its conflict of law provisions. Our
                    failure to enforce any right or provision of these Terms will not be considered
                    a waiver of those rights. If any provision of these Terms is held to be invalid
                    or unenforceable by a court, the remaining provisions of these Terms will remain
                    in effect. These Terms constitute the entire agreement between us regarding our
                    Service, and supersede and replace any prior agreements we might have between us
                    regarding the Service.
                </ListGroupItem>
                <ListGroupItem header="Changes">
                    We reserve the right, at our sole discretion, to modify or replace these Terms
                    at any time. If a revision is material we will try to provide at least 15 days
                    notice prior to any new terms taking effect. What constitutes a material change
                    will be determined at our sole discretion. By continuing to access or use our
                    Service after those revisions become effective, you agree to be bound by the
                    revised terms. If you do not agree to the new terms, please stop using the
                    Service.
                </ListGroupItem>
                <ListGroupItem header="Contact Us">
                    If you have any questions about these Terms, please{" "}
                    <Link to="/contact">contact us</Link>.
                </ListGroupItem>
            </ListGroup>
        </div>
    </div>
);

export default Terms;
