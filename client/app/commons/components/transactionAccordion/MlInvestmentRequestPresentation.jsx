/**
 * Created by pankaj on 10/8/17.
 */
import React from 'react';
import moment from "moment";
export default class MlConnectionRequestPresentation extends React.Component {

  componentDidMount() {
    $('.float-label').jvFloat();

  }
  componentWillMount() {
    console.log('---this.props---', this.props.data)
  }

  render() {
    const { userDetails, activityLog, data, canAccept, canReject, showAcceptAndReject} = this.props;
    let transId = Math.random().toString(36).slice(2); //userDetails.userId;
    return (
      <div className="ml_tabs">
        <ul className="nav nav-pills">
          <li className="active">
            <a href={"#1a"+transId} data-toggle="tab">Details</a>
          </li>
          <li>
            <a href={"#2a"+transId} data-toggle="tab">Activity Log</a>
          </li>
          {/*<li>*/}
            {/*<a href={"#3a"+transId} data-toggle="tab">Device Details</a>*/}
          {/*</li>*/}
          <li>
            <a href={"#4a"+transId} data-toggle="tab">History</a>
          </li>
        </ul>
        <div className="tab-content clearfix">
          <div className="tab-pane active" id={"1a"+transId}>
            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <input type="text" disabled placeholder="User Id" value={userDetails.userId} className="form-control float-label"/>
                </div>
                <div className="form-group">
                  <input type="text" disabled placeholder="Transaction Id" value={userDetails.transactionId} className="form-control float-label" id=""/>
                </div>
                <div className="form-group">
                  <input type="text" disabled placeholder="Date & Time" value={userDetails.dateTime ? moment(userDetails.dateTime).format(Meteor.settings.public.dateFormat) : ' ' } className="form-control float-label" id=""/>
                </div>
                <div className="form-group">
                  <input type="text" disabled placeholder="Name" value={userDetails.name} className="form-control float-label" id=""/>
                </div>
                <div className="form-group">
                  <input type="text" disabled placeholder="Email Id" value={userDetails.email} className="form-control float-label" id=""/>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <input type="text" disabled placeholder="Phone no" value={userDetails.phoneNo} className="form-control float-label" id=""/>
                </div>
                <div className="form-group">
                  <input type="text" disabled placeholder="Cluster" value={userDetails.cluster} className="form-control float-label" id=""/>
                </div>
                <div className="form-group">
                  <input type="text" disabled placeholder="Chapter" value={userDetails.chapter} className="form-control float-label" id=""/>
                </div>
                <div className="form-group">
                  <input type="text" disabled placeholder="Sub Chapter" value={userDetails.subChapter} className="form-control float-label" id=""/>
                </div>
                <div className="form-group">
                  <input type="text" disabled placeholder="Community" value={userDetails.community} className="form-control float-label" id=""/>
                </div>
              </div>
            </div>
          </div>
          <div className="tab-pane" id={"2a"+transId}>
            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <input type="text" disabled placeholder="Time Date" defaultValue={activityLog.dateTime ? moment(activityLog.dateTime).format(Meteor.settings.public.dateFormat) : ' ' } className="form-control float-label" id=""/>
                </div>
                <div className="form-group">
                  <input type="text" disabled placeholder="Activity Type" defaultValue={activityLog.type} className="form-control float-label" id=""/>
                </div>
                <div className="form-group">
                  <input type="text" disabled placeholder="Status" defaultValue={activityLog.status} className="form-control float-label" id=""/>
                </div>
                <br className="clearfix" />
                <br className="clearfix" />
                <div className="clearfix" />
              </div>
              <div className="col-md-6">
                { showAcceptAndReject ?
                <div className="ml_btn">
                  {canAccept ? <a href="" className="save_btn" onClick={this.props.OnBoardHandler.bind(this, data._id, activityLog.type, 'accept')}>Accept</a>:""}
                  {canReject ? <a href="" className="cancel_btn" onClick={this.props.OnBoardHandler.bind(this, data._id, activityLog.type, 'reject')}>Reject</a>:""}
                </div>
                  : '' }
              </div>
            </div>
          </div>
          <div className="tab-pane" id={"3a"+transId}>
            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <input type="text" placeholder="Device name" defaultValue="Ipad air 2" className="form-control float-label" id=""/>
                </div>
                <div className="form-group">
                  <input type="text" placeholder="Device ID" defaultValue="L8125#585" className="form-control float-label" id=""/>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <input type="text" placeholder="Device IP" defaultValue="10.20.1.6" className="form-control float-label" id=""/>
                </div>
                <div className="form-group">
                  <input type="text" placeholder="IP Location" defaultValue="Hyderabad" className="form-control float-label" id=""/>
                </div>
              </div>
            </div>
          </div>
          <div className="tab-pane" id={"4a"+transId}>
            <div className="row">
              <div className="col-md-12">
                <b>No data available.</b>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
