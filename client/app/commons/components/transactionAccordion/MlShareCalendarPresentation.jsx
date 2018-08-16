import React from 'react';
import moment from "moment";
export default class MlShareCalendarPresentation extends React.Component {

  componentDidMount() {
    $('.float-label').jvFloat();

  }
  componentWillMount() {
    this.setState({ data: this.props.propsData });
    console.log('---this.props---', this.props.propsData)
  }

  render() {
    let that = this;
    const { propsData, deactivateLink } = this.props || {
      propsData: {
        ownerInfo: {}
      }
    };
    const userDetails = propsData.ownerInfo ? propsData.ownerInfo : {};
    let transId = Math.random().toString(36).slice(2); //userDetails.userId;
    return (
      <div className="ml_tabs">
        <ul className="nav nav-pills">
          <li className="active">
            <a href={"#1a" + transId} data-toggle="tab">Details</a>
          </li>
          <li>
            <a href={"#2a" + transId} data-toggle="tab">Activity Log</a>
          </li>
          {/*<li>*/}
            {/*<a href={"#3a" + transId} data-toggle="tab">Device Details</a>*/}
          {/*</li>*/}
          <li>
            <a href={"#4a" + transId} data-toggle="tab">History</a>
          </li>
        </ul>
        <div className="tab-content clearfix">
          <div className="tab-pane active" id={"1a" + transId}>
            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <input type="text" disabled placeholder="User Id" value={userDetails.userId} className="form-control float-label" />
                </div>
                <div className="form-group">
                  <input type="text" disabled placeholder="Transaction Id" value={userDetails.transactionId} className="form-control float-label" id="" />
                </div>
                <div className="form-group">
                  <input type="text" disabled placeholder="Date & Time" value={propsData.createdAt ? moment(propsData.createdAt).format(Meteor.settings.public.dateFormat) : ' ' } className="form-control float-label" id="" />
                </div>
                <div className="form-group">
                  <input type="text" disabled placeholder="Name" value={userDetails.name} className="form-control float-label" id="" />
                </div>
                <div className="form-group">
                  <input type="text" disabled placeholder="Email Id" value={userDetails.email} className="form-control float-label" id="" />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <input type="text" disabled placeholder="Phone no" value={userDetails.mobileNumber} className="form-control float-label" id="" />
                </div>
                <div className="form-group">
                  <input type="text" disabled placeholder="Cluster" value={userDetails.cluster} className="form-control float-label" id="" />
                </div>
                <div className="form-group">
                  <input type="text" disabled placeholder="Chapter" value={userDetails.chapter} className="form-control float-label" id="" />
                </div>
                <div className="form-group">
                  <input type="text" disabled placeholder="Sub Chapter" value={userDetails.subChapter} className="form-control float-label" id="" />
                </div>
                <div className="form-group">
                  <input type="text" disabled placeholder="Community" value={userDetails.community} className="form-control float-label" id="" />
                </div>
              </div>
            </div>
          </div>
          <div className="tab-pane" id={`2a${transId}`}>
            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <input type="text" placeholder="Shared Date & Time" value={propsData && propsData.createdAt ? propsData.createdAt : ''} className="form-control float-label" id="" />
                </div>
                <h5>Shared with :</h5>
                <ul>
                  {
                    propsData.users && propsData.users.map(function (user, index) {
                      return (
                        <li key={index}>
                          {/*<FontAwesome name='minus'/>*/}
                          <img src={user.profilePic ? user.profilePic : "/images/data_balance.jpg"} />
                          <span>{user.displayName}</span>
                        </li>
                      )
                    })
                  }
                </ul>
                <div className="clearfix" />
                <br />
                <div className="form-group">
                  <input type="text" placeholder="Status" value="Completed" className="form-control float-label" id="" />
                </div>
              </div>
              <div className="col-md-6">
                {propsData.isActive ? <a href="#" className="fileUpload mlUpload_btn release_cancel" onClick={()=>deactivateLink(propsData)}>Deactivate</a> : <a href="#" className="fileUpload mlUpload_btn release_cancel" onClick={()=>deactivateLink(propsData)}>Activate</a> }
              </div>
            </div>
          </div>
          <div className="tab-pane" id={"3a" + transId}>
            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <input type="text" placeholder="Device name" defaultValue="Ipad air 2" className="form-control float-label" id="" />
                </div>
                <div className="form-group">
                  <input type="text" placeholder="Device ID" defaultValue="L8125#585" className="form-control float-label" id="" />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <input type="text" placeholder="Device IP" defaultValue="10.20.1.6" className="form-control float-label" id="" />
                </div>
                <div className="form-group">
                  <input type="text" placeholder="IP Location" defaultValue="Hyderabad" className="form-control float-label" id="" />
                </div>
              </div>
            </div>
          </div>
          <div className="tab-pane" id={"4a" + transId}>
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
