import React from "react";
import {render} from "react-dom";
import {BootstrapTable, TableHeaderColumn} from "react-bootstrap-table";
import {initalizeFloatLabel,OnToggleSwitch} from "../../../utils/formElemUtil";
import {graphql} from "react-apollo";
import {fetchShareDetails} from '../actions/MlShareActionHandler'
import moment from "moment";
import gql from "graphql-tag";
import MoolyaSelect from "../../../commons/components/MlAdminSelectWrapper";
import {getAdminUserContext} from '../../../../commons/getAdminUserContext'
import _ from "lodash";
var FontAwesome = require('react-fontawesome');
import generateAbsolutePath from '../../../../../lib/mlGenerateAbsolutePath'


export default class MlShareDetailsComponent extends React.Component {
  constructor(props){
    super(props);
    this.state= {
      shareId: props._id?props._id:"",
      data: {},
      isGenerateLinkDisable: false,
      stages: [{
        stageId: "",
        isActive:false,
        stageActions: [{
          actionId: "",
          actionType:"",
          isActive:false,
        }]
      }]
    }
    this.getShareDetails.bind(this);
    return this;
  }

  componentDidMount() {
    initalizeFloatLabel();
  }
  componentDidUpdate(){
    initalizeFloatLabel();
    OnToggleSwitch(true,true);
  }

  componentWillMount() {
    let shareId= this.props && this.props.data ? this.props.data._id : '';
    if(shareId){
      this.setState({shareId: shareId}, function () {
        const resp = this.getShareDetails()
        return resp;
      }.bind(this));
    }
  }

  async getShareDetails() {
    const response  = await fetchShareDetails(this.state.shareId)
    console.log('---response---', response)
    this.setState({data: response})
    return response;
  }


  render() {
    let that = this;
    let ownerInfo = this.state && this.state.data && this.state.data.ownerInfo ? this.state.data.ownerInfo : {};
    let users = this.state && this.state.data && this.state.data.users ? this.state.data.users : [];
    let files = this.state && this.state.data && this.state.data.files ? this.state.data.files : [];
    let transId = this.state && this.state.shareId ? this.state.shareId : '';
    let createdAt = that.state.data && that.state.data.createdAt ? moment(that.state.data.createdAt).format(Meteor.settings.public.dateFormat):"";
    let sharedStartDate = that.state.data && that.state.data.sharedStartDate ? moment(that.state.data.sharedStartDate).format(Meteor.settings.public.dateFormat):"";
    let sharedEndDate = that.state.data && that.state.data.sharedEndDate ? moment(that.state.data.sharedEndDate).format(Meteor.settings.public.dateFormat):"";
    // console.log('this.state', this.state);
    return (
      <div className="ml_tabs">
        <ul  className="nav nav-pills">
          <li className="active">
            <a  href={`#customerDetails${transId}`} data-toggle="tab">Details</a>
          </li>
          <li>
            <a  href={`#share${transId}`} data-toggle="tab">Activity Log</a>
          </li>
          <li>
            <a  href={`#deviceDetails${transId}`} data-toggle="tab">Device Details</a>
          </li>
          <li>
            <a  href={`#history${transId}`} data-toggle="tab">History</a>
          </li>
        </ul>

        <div className="tab-content clearfix">
          <div className="tab-pane active" id={`customerDetails${transId}`}>
            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <input type="text" placeholder="User Id" value={ownerInfo.profileId} className="form-control float-label" readOnly="true"/>
                </div>
                <div className="form-group ">
                  <input type="text" placeholder="Transaction Id" value={transId} className="form-control float-label"  readOnly="true"/>
                </div>
                <div className="form-group">
                  <input type="text" placeholder="Date & Time" value={ that.state.data&& that.state.data.createdAt ?createdAt : ''} className="form-control float-label"  readOnly="true"/>
                </div>
                <div className="clearfix"></div>
                <div className="form-group">
                  <input type="text" placeholder="Name" value={ownerInfo.name} className="form-control float-label"  readOnly="true"/>
                </div>
                <div className="form-group">
                  <input type="text" placeholder="Email" value={ownerInfo.email} className="form-control float-label"  readOnly="true"/>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <input type="text" placeholder="Phone Number" value={ownerInfo.mobileNumber} className="form-control float-label"  readOnly="true"/>
                </div>
                <div className="form-group">
                  <input type="text" placeholder="Cluster" value={ownerInfo.cluster} className="form-control float-label"  readOnly="true"/>
                </div>
                <div className="form-group">
                  <input type="text" placeholder="Chapter" value={ownerInfo.chapter} className="form-control float-label"  readOnly="true"/>
                </div>
                <div className="form-group">
                  <input type="text" placeholder="Sub Chapter" value={ownerInfo.subChapter} className="form-control float-label"  readOnly="true"/>
                </div>
                <div className="form-group">
                  <input type="text" placeholder="Community" value={ownerInfo.community} className="form-control float-label"  readOnly="true"/>
                </div>
                <br className="clearfix" />
              </div>
            </div>
          </div>
          <div className="tab-pane" id={`share${transId}`}>
            <div className="row table_tab">
              <div className="col-md-6">
                <div className="form-group">
                  <input type="text" placeholder="Shared Date & Time" value={ that.state.data && that.state.data.createdAt ? createdAt: ''} className="form-control float-label" id=""/>
                </div>
                <h5>Shared with :</h5>
                <ul className="img_upload ul-hide">
                  {
                    users.map(function (user, index) {
                      return (
                        <li key={index}>
                          {/*<FontAwesome name='minus'/>*/}
                          <img src={ user.profilePic ? generateAbsolutePath(user.profilePic) : "/images/def_profile.png"}/>
                          <span>{user.displayName}</span>
                        </li>
                      )
                    })
                  }
                </ul>
                <div className="clearfix" />
                <br />
                <div className="form-group">
                  <input type="text" placeholder="Status" defaultValue="Completed" className="form-control float-label" id=""/>
                </div>
              </div>
              <div className="col-md-6">
                <h4>Shared Content</h4>
                <ul className="doc_upload">
                  {
                    files.map(function (file, index) {
                      return (
                        <li key={index}>
                          {/*<FontAwesome name='minus'/>*/}
                          {file.fileType === "image" || file.fileType === "template" ?
                            <img src={ file.url ? generateAbsolutePath(file.url) : "/images/doc.png"}/> :
                            file.fileType === "document" ? <img src="/images/doc.png"/> :
                              <img src="/images/video_1.jpg"/> }
                        </li>
                      )
                    })
                  }

                </ul>
                <div className="clearfix" />
                <br/>
                <div className="col-md-6 nopadding-left">
                  <div className="form-group">
                    <input type="text" placeholder="From" value={ this.state.data && this.state.data.sharedStartDate ? sharedStartDate: 'NA' } disabled defaultValue="10.20.1.6" className="form-control float-label" id=""/>
                  </div>
                </div>
                <div className="col-md-6 nopadding-right">
                  <div className="form-group">
                    <input type="text" placeholder="To" value={ this.state.data && this.state.data.sharedEndDate ? sharedEndDate : 'NA' } disabled defaultValue="10.20.1.6" className="form-control float-label" id=""/>
                  </div>
                </div>
                <div className="clearfix" />
                <div className="input_types">
                  <input id="checkbox1" type="checkbox" name="checkbox" checked={ this.state.data && this.state.data.isDownloadable ? this.state.data.isDownloadable : false } disabled value="1" /><label htmlFor="checkbox1"><span></span>Can Download this content</label>
                </div>
              </div>
            </div>
          </div>
          <div className="tab-pane" id={`deviceDetails${transId}`}>
            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <input type="text" placeholder="Device Name" value={that.state.data.deviceDetails&&that.state.data.deviceDetails.deviceName?that.state.data.deviceDetails.deviceName:""} className="form-control float-label"  readOnly="true"/>
                </div>
                <div className="form-group ">
                  <input type="text" placeholder="Device Id" value={that.state.data.deviceDetails&&that.state.data.deviceDetails.deviceId?that.state.data.deviceDetails.deviceId:""} className="form-control float-label" />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <input type="text" placeholder="IP Address" value={that.state.data.deviceDetails&&that.state.data.deviceDetails.ipAddress?that.state.data.deviceDetails.ipAddress:""} className="form-control float-label"  readOnly="true"/>
                </div>
                <div className="form-group">
                  <input type="text" placeholder="IP Location" value={that.state.data.deviceDetails&&that.state.data.deviceDetails.location?that.state.data.deviceDetails.location:""} className="form-control float-label"  readOnly="true"/>
                </div>
                <br className="clearfix" />
              </div>
            </div>
          </div>
          <div className="tab-pane" id={`history${transId}`}>

          </div>

        </div>

      </div>

    );
  }
}



