import React, {Component, PropTypes} from "react";
import {render} from "react-dom";
import backendUserRoute from "../actions/routesBackendUserLIst";
let FontAwesome = require('react-fontawesome');
import ScrollArea from 'react-scrollbar';
import generateAbsolutePath from '../../../../../lib/mlGenerateAbsolutePath'

export default class MlBackendUserListView extends Component {

  render() {
    const data = this.props.data || [];
    const list = data.map(function (prop) {
      let StatusActive = '', userStatus = '';
      let username = ''
      if (prop.profile.InternalUprofile) {
        let status = prop.profile.isActive;
        if (prop.profile.InternalUprofile.moolyaProfile.displayName) {
          username = prop.profile.InternalUprofile.moolyaProfile.displayName;
        } else {
          // let firstName = prop.profile.InternalUprofile.moolyaProfile.firstName;
          // let lastName = prop.profile.InternalUprofile.moolyaProfile.lastName
          let firstName = prop.profile.firstName;
          let lastName = prop.profile.lastName
          username = firstName + " " + lastName
        }
        if (status == true) {
          StatusActive = 'active-User'
          userStatus = 'active'
        } else {
          StatusActive = 'inactive-user'
          userStatus = 'inactive'
        }
      }
      let gImg = prop.profile.genderType==='female'?"/images/female.jpg":"/images/def_profile.png"
      let genderImage = (!prop.profile.profileImage || prop.profile.profileImage==" ")?gImg:prop.profile.profileImage;

      return (
        <div className="col-lg-2 col-md-4 col-sm-4" key={prop._id}>
          <div className="list_block provider_block">
            <div className={`cluster_status ${userStatus}_cl`}>{/*<span className={`ml ml-${StatusActive}`}></span>*/}</div>
            {prop.profile.isMoolya?<div className="list-moolya-icon"><span className="ml ml-moolya-symbol"></span></div>:<span></span>}
            <a href={backendUserRoute.backendUserDetailRoute(prop._id)}>
              <div className="provider_mask">
                <img src="/images/funder_bg.png"/>
                <img className="user_pic"
                     src={generateAbsolutePath(genderImage)}/>
              </div>
            </a>
            <h3>{username} <br />
              {prop.roleNames}</h3>
          </div>
        </div>)

    });

    return (<div className="row">
      <h2>BackendUsers</h2>
      <div className="list_scroll">
        <ScrollArea
          speed={0.8}
          className="list_scroll"
          smoothScrolling={true}
        >
      {list}
        </ScrollArea>
      </div>
      </div>);
  }
}
