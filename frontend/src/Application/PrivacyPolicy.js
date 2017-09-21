/**
 * Created by vathavaria on 6/29/17.
 */

import React from 'react';
import {Component} from "react/lib/ReactBaseClasses";
import {Col, ListGroup, ListGroupItem, Modal, Row} from "react-bootstrap";

class PrivacyPolicy extends Component {
	render() {

		const footer_style = {
			backgroundColor: '#0a54b6',
			textAlign: 'left',
			color: '#ffffff',
		};
		const h2_style = {
			marginRight: '10px',
			display: 'inline'
		};

		return (
			<Modal {...this.props} aria-labelledby="contained-modal-title-lg">
				<Modal.Header closeButton>

				</Modal.Header>
				<Modal.Body>
					<div className="texto_modales margin_abajo_tobig">Privacy Policy</div>
					<Row>
						<Col xs={12}>
						<ListGroup>
							<ListGroupItem>
								This Privacy Policy describes our policies on the collection, use, and disclosure of information about you in connection with your use of our services, including those offered through our websites, emails, and mobile applications (collectively, the "Service"). The terms "we", "us", and "GoGovGo" refer to GoGovGo Inc., a Delaware corporation. When you use the Service, you consent to our collection, use, and disclosure of information about you as described in this Privacy Policy.
							</ListGroupItem>

							<ListGroupItem header="INFORMATION WE COLLECT AND HOW WE USE IT">
								We may collect and store information about you when you use the Service. We use the information to fulfill your requests, provide the Service’s functionality, improve the Service’s quality, personalize your experience, track usage of the Service, provide feedback to third party businesses that are listed on the Service, display relevant advertising, market the Service, provide customer support, message you, back up our systems and allow for disaster recovery, enhance the security of the Service, and comply with legal obligations.

								Among the information we collect, please note:

								Account Information: If you create an account on GoGovGo, we may store and use your full name, email address, zip code, and other information you may provide with your account, such as your gender and birth date. Your first name and last initial, as well as any photo you submit through the registration process, will be publicly displayed as part of your account profile. You can modify some of the information associated with your account here. If you believe that someone has created an unauthorized account depicting you or your likeness, you can request its removal by flagging it.

								Public Content: The information that you contribute through the Service is intended for public consumption, including your reviews, tips, photos, videos, comments, likes, lists, compliments, and account profile. We may display this information through the Service, share it with businesses, and further distribute it to a wider audience through third party sites and services.
								Contacts: You can invite your friends to join the Service by providing us with their contact information, or by allowing us to access your contacts from your computer, mobile device, or third party sites to select which friends you want to invite. If you allow us to access your contacts, we may transmit that information to GoGovGo long enough to process your invitations.
								Communications: When you sign up for an account or use certain features, you are opting to receive messages from other GoGovGo users, businesses, and GoGovGo itself. You can manage some of your messaging preferences here, but note that you cannot opt out of receiving certain administrative, transactional, or legal messages from GoGovGo. For example, if you make a reservation through the Service, we may send you messages about your reservation using the contact information you provide, including SMS text messages to your phone. We may also track your actions in response to the messages you receive from GoGovGo or through the Service, such as whether you deleted, opened, or forwarded such messages. If you exchange messages with others through the Service, we may store them in order to process and deliver them, allow you to manage them, and we may review and disclose them in connection with investigations related to the operation and use of the Service. We may not deliver messages that we believe are objectionable, such as spam messages or requests to exchange reviews for compensation. If you send or receive messages through the Service via SMS text message, we may log phone numbers, phone carriers, and the date and time that the messages were processed. Carriers may charge recipients for texts that they receive. We may also store information that you provide through communications to us, including from phone calls, letters, emails and other electronic messages, or in person. If you are a representative of a business listed on GoGovGo, including users of GoGovGo for Business Owners, we may contact you, including by phone or email, using the contact information you provide us, make publicly available, or that we have on record for your business.

								Transactional Information: If you initiate a transaction through the Service, such as a reservation or purchase, we may collect and store information about you, such as your name, phone number, address, email, and credit card information, as well as any other information you provide to us, in order to process your transaction, send communications about them to you, and populate forms for future transactions. This information may be shared with third parties for the same purposes. GoGovGo does not disclose your personal information to third parties for the purpose of directly marketing their services to you unless you first agree to such disclosure. When you submit credit card numbers, we encrypt that information using industry standard technology. If you write reviews about businesses with which you transact through the Service, we may publicly display the fact that you transacted with those businesses. For example, if you make a dinner reservation through the Service and write a review about your experience, we may publicly display the fact that you made your dinner reservation through the Service.

								Activity: We may store information about your use of the Service, such as your search activity, the pages you view, the date and time of your visit, businesses you call using our mobile applications, and reservations and purchases you make through the Service. We also may store information that your computer or mobile device provides to us in connection with your use of the Service, such as your browser type, type of computer or mobile device, browser language, IP address, mobile carrier, phone number, unique device identifier, advertising identifier, location (including geolocation, beacon based location, and GPS location), and requested and referring URLs. You may be able to disallow our use of certain location data through your device or browser settings, for example by disabling “Location Services” for the GoGovGo application in iOS privacy settings.
							</ListGroupItem>

							<ListGroupItem header="COOKIES">
								We, and third parties with whom we partner, may use cookies, web beacons, tags, scripts, local shared objects such as HTML5 and Flash (sometimes called "flash cookies"), advertising identifiers (including mobile identifiers such as Apple’s IDFA or Google’s Advertising ID) and similar technology ("Cookies") in connection with your use of the Service, third party websites, and mobile applications. Cookies may have unique identifiers, and reside, among other places, on your computer or mobile device, in emails we send to you, and on our web pages. Cookies may transmit information about you and your use of the Service, such as your browser type, search preferences, IP address, data relating to advertisements that have been displayed to you or that you have clicked on, and the date and time of your use. Cookies may be persistent or stored only during an individual session.

								The purposes for which we use Cookies in the Service include:

								Purpose	Explanation

								Processes	Intended to make the Service work in the way you expect. For example, we use a Cookie that tells us whether you have already signed up for an account.

								Authentication, Security, and Compliance	Intended to prevent fraud, protect your data from unauthorized parties, and comply with legal requirements. For example, we use Cookies to determine if you are logged in.

								Preferences	Intended to remember information about how you prefer the Service to behave and look. For example, we use a Cookie that tells us whether you have declined to allow us to use your phone’s geolocation data.

								Notifications	Intended to allow or prevent notices of information or options that we think could improve your use of the Service. For example, we use a Cookie that stops us from showing you the signup notification if you have already seen it.

								Analytics	Intended to help us understand how visitors use the Service. For example, we use a Cookie that tells us how our search suggestions correlate to your interactions with the search page.

								Managing Cookies: It may be possible to disable some (but not all) Cookies through your device or browser settings, but doing so may affect the functionality of the Service. The method for disabling Cookies may vary by device and browser, but can usually be found in preferences or security settings. For example, iOS and Android devices each have settings which are designed to limit forms of ad tracking. For flash cookies, you can manage your privacy settings by clicking here. Please note that changing any of these settings does not prevent the display of all advertisements to you.

								Aggregate Information: We may share user information in the aggregate with third parties, such as advertisers and content distributors. For example, we may disclose the number of users that have been exposed to, or clicked on, advertisements.

								Business Transfers: We may share information from or about you with our parent companies, subsidiaries, joint ventures, or other companies under common control, in which case we will require them to honor this Privacy Policy. If another company acquires GoGovGo or all or substantially all of our assets, that company will possess the same information, and will assume the rights and obligations with respect to that information as described in this Privacy Policy.

								Investigations: We may investigate and disclose information from or about you if we have a good faith belief that such investigation or disclosure (a) is reasonably necessary to comply with legal process and law enforcement instructions and orders, such as a search warrant, subpoena, statute, judicial proceeding, or other legal process served on us; (b) is helpful to prevent, investigate, or identify possible wrongdoing in connection with the Service; or (c) protects our rights, reputation, property, or that of our users, affiliates, or the public, such as disclosures in connection with our Consumer Alerts program. If you flag or otherwise complain to GoGovGo about content through the Service, we may share the substance of your complaint with the contributor of that content in order to provide an opportunity for the contributor to respond.

								Links: The Service may contain links to unaffiliated third party services. Except as set forth herein, we do not share your personal information with them, and are not responsible for their privacy practices. We suggest you read the privacy policies on or applicable to all such third party services.

								Third Party Accounts: If you sign up for GoGovGo using a third party service like Facebook, or link your GoGovGo account to your account with a third party service like Facebook or Twitter, we may receive information about you from such third party service.
							</ListGroupItem>

							<ListGroupItem header="CONTROLLING YOUR PERSONAL DATA">
								Other users may be able to identify you, or associate you with your account, if you include personal information in the content you post publicly. You can reduce the risk of being personally identified by using the Service pseudonymously, though doing so could detract from the credibility of your contributions to the Service. Users can also use the Find Friends feature to find one another based on their names or email addresses. You can adjust the settings for this feature here.
								Please also note that the messages you send or receive using the Service are only private to the extent that both you and the person you are communicating with keep them private. For example, if you send a message to another user, that user may choose to publicly post it. Also, GoGovGo may access and disclose such messages in the course of investigations relating to use of the Service.
							</ListGroupItem>

							<ListGroupItem header="DATA RETENTION AND ACCOUNT TERMINATION">
								We will remove your public posts from view and/or dissociate them from your account profile, but we may retain information about you for the purposes authorized under this Privacy Policy unless prohibited by law. For example, we may retain information to prevent, investigate, or identify possible wrongdoing in connection with the Service or to comply with legal obligations.
							</ListGroupItem>
							<ListGroupItem header="CHILDREN">
								The Service is intended for general audiences and is not directed to children under 13. We do not knowingly collect personal information from children under 13. If you become aware that a child has provided us with personal information without parental consent, please contact us here. If we become aware that a child under 13 has provided us with personal information without parental consent, we take steps to remove such information and terminate the child's account.
							</ListGroupItem>
							<ListGroupItem header="SECURITY">
								We follow generally accepted industry standards to protect the personal information submitted to us, both during transmission and once we receive it. However, no method of transmission over the Internet or via mobile device, or method of electronic storage, is 100% secure. Therefore, while we strive to use commercially acceptable means to protect your personal information, we cannot guarantee its absolute security.
							</ListGroupItem>
							<ListGroupItem header="CONTACT INFORMATION">
								If you believe that GoGovGo has not adhered to this Privacy Policy, you may contact us online by emailing ContactGoGovGo@gmail.com

								GoGovGo Inc.
								635 Tennessee St Apt 303
								San Francisco, California 94107
								United States of America
							</ListGroupItem>
							<ListGroupItem header="INTERNATIONAL DATA TRANSFER">
								For users residing in the European Union, please note that the personal data information we obtain from or about you may be transferred, processed and stored outside of the E.U. for the purposes described in this Privacy Policy, including in the United States of America. We take the privacy of our users seriously and therefore take steps to safeguard your information, including assuring an adequate level of data protection in accordance with E.U. standards. If you would like additional information about your personal data and its use in connection with this Service, including correcting any incorrect information, please contact the Data Privacy Manager at the address above. We will take such steps as we deem necessary to confirm your identity before sharing any personal data with you. We will respond to proper and confirmed requests relating to personal data within 30 days, or as otherwise required by applicable law. If you are not satisfied with the way your request was handled, you may refer your request to the Irish Data Protection Commissioner.
							</ListGroupItem>
							<ListGroupItem header="MODIFICATIONS TO THIS PRIVACY POLICY">
								We may revise this Privacy Policy from time to time. The most current version of the Privacy Policy will govern our collection, use, and disclosure of information about you and will be located here. If we make material changes to this Privacy Policy, we will notify you by email or by posting a notice on the Service prior to the effective date of the changes. By continuing to access or use the Service after those changes become effective, you agree to the revised Privacy Policy.
							</ListGroupItem>
							<ListGroupItem header="CALIFORNIA RESIDENTS: YOUR CALIFORNIA PRIVACY RIGHTS">
								GoGovGo does not disclose your personal information to third parties for the purpose of directly marketing their services to you unless you first agree to such disclosure. If you have any questions regarding this policy, or would like to change your preferences, you may contact us at the address listed above in Section 8.
							</ListGroupItem>
						</ListGroup>
						</Col>
					</Row>
				</Modal.Body>
				<Modal.Footer style={footer_style}>
					<h3 style={h2_style}>GoGovGo</h3> <text>Government, Simplified</text>
				</Modal.Footer>
			</Modal>
		);
	}
}

export default PrivacyPolicy;
