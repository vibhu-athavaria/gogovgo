/**
 * Created by vathavaria on 8/03/17.
 */

import React from 'react';
import {Component} from "react/lib/ReactBaseClasses";
import { Link } from 'react-router-dom';



class Cabinet extends Component {

	render() {
		let members = [];
		this.props.staff.forEach(function(cabinet, index) {
			const url = '/politician/'+cabinet.member.publicOfficeTitle.country+'/'+cabinet.member.publicOfficeTitle.url;
			members.push(
				<div className="col-xs-6 col-sm-3 text-center" key={"member:"+index}>
					<Link to={url} className="hover_black">
						<img src={cabinet.member.thumbnailTag} />
						<span className="hover-black-info ">
							{cabinet.member.firstName + " " + cabinet.member.lastName}
							<small className="hover-black-info-small">{cabinet.member.publicOfficeTitle.displayName}</small>
						</span>
					</Link>
				</div>
			)
		});

		return (
			<div role="tabpanel" className="tab-pane in active" id="cabinet">

				<div className="row">
					<div className="col">
						<div className="content-tab titulo_content text-center">
							Presidential Cabinet
						</div>
						<div className="go-gov-go-reviews-are">
							The Presidential Cabinet is a group of top government leaders that act as an advisory group to the President of the United States on key aspects of the economy, safety, and well being of the country.
						</div>
					</div>
				</div>
				<div className="row">
					{members}
				</div>

				<hr className="line-two"/>

				<div className="row">
					<div className="col">
						<div className="contenedor_suggest">
							<div className="suggest_title">
								Are we missing something important?
							</div>
							<div className="suggest_enlace text-center">
								Suggest improvements
							</div>
						</div>

					</div>
				</div>
			</div>
		);
	}
}

export default Cabinet;
