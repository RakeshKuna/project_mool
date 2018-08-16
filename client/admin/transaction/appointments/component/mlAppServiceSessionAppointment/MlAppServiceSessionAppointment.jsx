import React, { Component } from 'react';
import MlAppSelectedTaskMyAppointment from './mlAppInternalTaskAppointment/MlAppSelectedTaskMyAppointment';
import { fetchAdminSessionAppointment } from '../../action/fetchAdminSessionAppointment';
import moment from "moment";

export default class MlAppServiceSessionAppointment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orderId: props.orderId,
      data: {
        appointmentInfo: {},
        client: {},
        service: {},
        owner: {},
        sessionInfo: []
      }
    };
    this.fetchServiceSessionAppointments = this.fetchServiceSessionAppointments.bind(this);
  }

  componentWillReceiveProps({ orderId }) {
    this.setState({ orderId }, () => {
      this.fetchServiceSessionAppointments();
    })
  }

  componentWillMount() {
    this.fetchServiceSessionAppointments();
  }

  async fetchServiceSessionAppointments() {
    if (this.state.orderId) {
      let response = await fetchAdminSessionAppointment(this.state.orderId);
      if (response && response.success) {
        let data = JSON.parse(response.result);
        data = data[0] ? data[0] : {};
        data.client = data.client ? data.client : {};
        data.owner = data.owner ? data.owner : {};
        data.sessionInfo = data.sessionInfo ? data.sessionInfo : [];
        data.service = data.service ? data.service : {};
        this.setState({
          data
        });
      }
    }
  }

  render() {
    return (
      <div className="ml_tabs">
        <ul className="nav nav-pills">
          <li className="active">
            <a href={`#${this.state.orderId}1a`} data-toggle="tab">Details</a>
          </li>
          <li>
            <a href={`#${this.state.orderId}2a`} data-toggle="tab">Activity Log</a>
          </li>
          <li>
            <a href={`#${this.state.orderId}3a`} data-toggle="tab">Service Details</a>
          </li>
          <li>
            <a href={`#${this.state.orderId}4a`} data-toggle="tab">Device Details</a>
          </li>
        </ul>
        <div className="tab-content clearfix">
          <div className="tab-pane active" id={`${this.state.orderId}1a`}>
            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <input type="text" placeholder="User Id" value={this.state.data.client.userId} defaultValue="" className="form-control float-label" id="" />
                </div>
                <div className="form-group">
                  <input type="text" placeholder="Transaction Id" value={this.state.data.service.transactionId} defaultValue="" className="form-control float-label" id="" />
                </div>
                <div className="form-group">
                  <input type="text" placeholder="Date & Time" value={this.state.data.createdAt ? moment(this.state.data.createdAt).format(Meteor.settings.public.dateFormat) : ' ' } defaultValue="" className="form-control float-label" id="" />
                </div>
                <div className="form-group">
                  <input type="text" placeholder="Name" value={this.state.data.client.name} defaultValue="" className="form-control float-label" id="" />
                </div>
                <div className="form-group">
                  <input type="text" placeholder="Email ID" value={this.state.data.client.email} defaultValue="" className="form-control float-label" id="" />
                </div>
                <div className="form-group">
                  <input type="text" placeholder="Phone no" value={this.state.data.client.phoneNo} defaultValue="" className="form-control float-label" id="" />
                </div>
                <div className="form-group">
                  <input type="text" placeholder="Cluster" value={this.state.data.client.cluster} defaultValue="" className="form-control float-label" id="" />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <input type="text" placeholder="Chapter" value={this.state.data.client.chapter} defaultValue="" className="form-control float-label" id="" />
                </div>
                <div className="form-group">
                  <input type="text" placeholder="Sub Chapter" value={this.state.data.client.subChapter} defaultValue="Moolya" className="form-control float-label" id="" />
                </div>
                <div className="form-group">
                  <input type="text" placeholder="Community" value={this.state.data.client.community} defaultValue="" className="form-control float-label" id="" />
                </div>
                <div className="panel panel-default cancel_app" style={{ 'display': 'none' }}>
                  <div className="panel-heading">Cancel an appointment</div>
                  <div className="panel-body">
                    <h4 className="text-center">Ae you sure do you want to cancel an<br /> appointment?</h4>
                    <div className="form-group">
                      <textarea placeholder="Enter he reason" className="form-control float-label" id=""></textarea>
                    </div>
                    <br className="brclear" />
                    <div className="form-group ">
                      <div className="input_types">
                        <input id="checkbox1" type="checkbox" name="checkbox" value="1" /><label htmlFor="checkbox1"><span></span>I agree to the Tearms & Conitions </label>
                      </div>
                    </div>
                    <a href="#" className="fileUpload mlUpload_btn cancel_send">Send</a> <a href="#" className="fileUpload mlUpload_btn cancel_cancel">Cancel</a>
                  </div>
                </div>
                <div className="panel panel-default release_pay" style={{ 'display': 'none' }}>
                  <div className="panel-heading">Release Payment</div>
                  <div className="panel-body">
                    <h4>Total amount paid : <b>5,700 INR</b></h4>
                    <div className="form-group">
                      <div className="input_types">
                        <input id="checkbox1" type="checkbox" name="checkbox" value="1" /><label htmlFor="checkbox1"><span></span>Release Payment </label>
                      </div>
                    </div>
                    <br className="brclear" />
                    <h4 className="text-left">Select Release type</h4>
                    <div className="form-group">
                      <div className="input_types">
                        <input id="checkbox1" type="checkbox" name="checkbox" value="1" /><label htmlFor="checkbox1"><span></span>Full</label>
                      </div>
                      <div className="input_types">
                        <input id="checkbox1" type="checkbox" name="checkbox" value="1" /><label htmlFor="checkbox1"><span></span>Partial</label>
                      </div>
                    </div>
                    <div className="form-group">
                      <input type="text" placeholder="Enter Units" defaultValue="Hyderabad" className="form-control float-label" id="" />
                    </div>
                    <div className="form-group">
                      <textarea placeholder="Reason" className="form-control float-label" id=""></textarea>
                    </div>

                    <a href="#" className="fileUpload mlUpload_btn release_send">Send</a> <a href="#" className="fileUpload mlUpload_btn release_cancel">Cancel</a>
                  </div>
                </div>
                <div className="final_btns">
                </div>
              </div>

            </div>
          </div>
          <div className="tab-pane" id={`${this.state.orderId}2a`}>
            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <input type="text" placeholder="Appointment Id" value={this.state.orderId} defaultValue="" className="form-control float-label" id="" />
                </div>
                <div className="form-group">
                  <input type="text" placeholder="Appointment date & Time" value={this.state.data.startDate ? moment(this.state.data.startDate).format(Meteor.settings.public.dateFormat) : ' ' } defaultValue="" className="form-control float-label" id="" />
                </div>
                <div className="form-group">
                  <input type="text" placeholder="Transaction Id" value={this.state.data.service.transactionId} defaultValue="" className="form-control float-label" id="" />
                </div>
                <div className="form-group">
                  <input type="text" placeholder="Appointment With" value={this.state.data.owner.name} defaultValue="" className="form-control float-label" id="" />
                </div>
                <div className="form-group">
                  <input type="text" placeholder="User ID" value={this.state.data.owner.profileId} defaultValue="" className="form-control float-label" id="" />
                </div>
                <div className="form-group">
                  <input type="text" placeholder="Community" value={this.state.data.owner.community} defaultValue="" className="form-control float-label" id="" />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <input type="text" placeholder="Sub Chapter" value={this.state.data.owner.subChapter} defaultValue="" className="form-control float-label" id="" />
                </div>
                <div className="form-group">
                  <input type="text" placeholder="Chapter" value={this.state.data.owner.chapter} defaultValue="" className="form-control float-label" id="" />
                </div>
                <div className="form-group">
                  <input type="text" placeholder="Cluster" value={this.state.data.owner.cluster} defaultValue="" className="form-control float-label" id="" />
                </div>
                <div className="form-group">
                  <input type="text" placeholder="Contact Number" value={this.state.data.owner.phoneNo} defaultValue="" className="form-control float-label" id="" />
                </div>
                <div className="form-group">
                  <input type="text" placeholder="Email ID" value={this.state.data.owner.email} defaultValue="" className="form-control float-label" id="" />
                </div>
                <div className="form-group">
                  <input type="text" placeholder="Gender" value={this.state.data.owner.gender} defaultValue="" className="form-control float-label" id="" />
                </div>
              </div>

            </div>
          </div>
          <div className="tab-pane" id={`${this.state.orderId}3a`}>
            {/* <p>Take from this page "appFunderMyAppointment"</p> */}
            <MlAppSelectedTaskMyAppointment appointment={{
              appointmentId: this.state.orderId,
              resourceId: this.state.data.appointmentInfo.taskId,
              sessionId: this.state.data.appointmentInfo.sessionId
            }} />
          </div>
          <div className="tab-pane" id={`${this.state.orderId}4a`}>
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
        </div>
      </div>
    )
  }
}
