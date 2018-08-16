import React, { Component } from 'react';
import { fetchAppAppointmentByTransactionId } from '../../action/fetchAppointment';
import MlAppSelectedTaskMyAppointment from '../../../../../calendar/myAppointments/components/mlAppInternalTaskAppointment/MlAppSelectedTaskMyAppointment';
import MlAppCalendarServiceAppointment from '../../../../../calendar/common/components/mlAppServiceTaskAppointment/MlAppCalendarServiceAppointment';
import { getSessionDayAvailable } from './../../action/getSessionDayAvailable';
import FontAwesome from 'react-fontawesome';
import Datetime from "react-datetime";
import moment from "moment";
import { rescheduleUserServiceCardAppointment } from '../../action/rescheduleSessionAppointment';
import SessionTable from './SessionTable';
import { cancelUserServiceCardAppointment } from '../../action/cancelSessionAppointment';
import AppointmentModal from './../AppointmentModal';

export default class MlAppServiceSessionAppointment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orderId: props.orderId,
      docId: props.docId,
      selectedDate: moment(),
      selectedDates:"",
      showSession: false,
      loadingSlots: false,
      validTill:"",
      clientName:"",
      startDate:"",
      endDate:"",
      data: {
        appointmentInfo: {},
        client: {},
        service: {},
        owner: {},
        sessionInfo: [],
        availableSlots: []
      }
    };
    this.fetchServiceSessionAppointments = this.fetchServiceSessionAppointments.bind(this);
    this.changeDate = this.changeDate.bind(this);
    this.updateSession = this.updateSession.bind(this);
    this.cancelSession = this.cancelSession.bind(this);
  }

  componentWillReceiveProps({ orderId, docId }) {
    this.setState({ orderId, docId }, () => {
      this.fetchServiceSessionAppointments();
    })
  }

  componentWillMount() {
    this.fetchServiceSessionAppointments();
  }

  async updateSession(slot) {
    const startTime = slot.slotTime.split('-')[0];
    const startHour = Number(startTime.split(':')[0]);
    const startMinutes = Number(startTime.split(':')[1]);
    let response = await rescheduleUserServiceCardAppointment(this.state.docId, {
      orderId: this.state.data.appointmentInfo.serviceOrderId,
      sessionId: this.state.data.appointmentInfo.sessionId,
      hours: startHour,
      minutes: startMinutes,
      day: this.state.selectedDate.get('date'),
      month: this.state.selectedDate.get('month'),
      year: this.state.selectedDate.get('year')
    });
    if (response && response.success) {
      toastr.success(response.result);
      this.setState({
        showSession: false
      })
    } else {
      toastr.error(response.result);
    }
  }

  async cancelSession() {
    let response = await cancelUserServiceCardAppointment(this.state.docId);
    if (response && response.success) {
      toastr.success(response.result);
    } else {
      toastr.error(response.result);
    }
  }

  async changeDate(event) {
    const that = this;
    if (event._d) {
      let value = new moment(event._d);
      this.setState({ selectedDate: value, selectedDates: value, loadingSlots: true });
      const availableSlots = await getSessionDayAvailable(
        this.state.data.appointmentInfo.serviceOrderId,
        this.state.data.appointmentInfo.sessionId,
        value.get('date'),
        value.get('month'),
        value.get('year')
      );
      let stateCopy = this.state;
      stateCopy.data.availableSlots = availableSlots ? availableSlots : [];
      stateCopy.loadingSlots = false;
      this.setState(stateCopy);
    }
  }

  async fetchServiceSessionAppointments() {
    if (this.state.orderId) {
      let response = await fetchAppAppointmentByTransactionId(this.state.orderId);
      if (response && response.success) {
        let data = JSON.parse(response.result);
        data = data[0] ? data[0] : {};
        data.client = data.client ? data.client : {};
        data.owner = data.owner ? data.owner : {};
        data.sessionInfo = data.sessionInfo ? data.sessionInfo : [];
        data.service = data.service ? data.service : {};
        data.service && data.service.validTill ? this.setState({validTill: data.service.validTill}): "";
        data.appointmentInfo = data.appointmentInfo || {};
        let availableSlots = await getSessionDayAvailable(
          data.appointmentInfo.serviceOrderId,
          data.appointmentInfo.sessionId,
          new Date().getDate(),
          new Date().getMonth(),
          new Date().getFullYear()
        )
        data.availableSlots = availableSlots ? availableSlots : [];
        this.setState({
          data,
          loadingSlots: false,
          clientName: data.client.name,
          startDate: data.startDate,
          endDate: data.endDate,
        });
      }
    }
    this.forceUpdate();
  }

  render() {
    let currentUser = this.state.data.owner;
    let appointmentWith = this.state.data.client;
    var yesterday = Datetime.moment().subtract(1, 'day');
    let validTill = this.state.validTill ? `${new moment(this.state.validTill).format(Meteor.settings.public.dateFormat)} GMT`: "";
    var validDate = function (current) {
      if(validTill) return current.isAfter(yesterday) && current.isBefore(validTill);
      else return current.isAfter(yesterday);
    }

    if(Meteor.userId()===this.state.data.client.userId) {
      currentUser = this.state.data.client;
      appointmentWith = this.state.data.owner;
    }
    return (
      <div>
        {!this.state.showSession &&
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
              {/*<li>*/}
              {/*<a href={`#${this.state.orderId}4a`} data-toggle="tab">Device Details</a>*/}
              {/*</li>*/}
            </ul>
            <div className="tab-content clearfix">
              <div className="tab-pane active" id={`${this.state.orderId}1a`}>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <input type="text" placeholder="User Id" value={currentUser.userId} defaultValue="" className="form-control float-label" id="" />
                    </div>
                    <div className="form-group">
                      <input type="text" placeholder="Transaction Id" value={this.state.data.service.transactionId} defaultValue="" className="form-control float-label" id="" />
                    </div>
                    <div className="form-group">
                      <input type="text" placeholder="Date & Time"
                             value={`${new moment(this.state.data.createdAt).format(Meteor.settings.public.dateFormat)} GMT`} defaultValue="" className="form-control float-label" id="" />
                    </div>
                    <div className="form-group">
                      <input type="text" placeholder="Name" value={currentUser.name} defaultValue="" className="form-control float-label" id="" />
                    </div>
                    <div className="form-group">
                      <input type="text" placeholder="Email ID" value={currentUser.email} defaultValue="" className="form-control float-label" id="" />
                    </div>
                    <div className="form-group">
                      <input type="text" placeholder="Phone no" value={currentUser.phoneNo} defaultValue="" className="form-control float-label" id="" />
                    </div>
                    <div className="form-group">
                      <input type="text" placeholder="Cluster" value={currentUser.cluster} defaultValue="" className="form-control float-label" id="" />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <input type="text" placeholder="Chapter" value={currentUser.chapter} defaultValue="" className="form-control float-label" id="" />
                    </div>
                    <div className="form-group">
                      <input type="text" placeholder="Sub Chapter" value={currentUser.subChapter} defaultValue="Moolya" className="form-control float-label" id="" />
                    </div>
                    <div className="form-group">
                      <input type="text" placeholder="Community" value={currentUser.community} defaultValue="" className="form-control float-label" id="" />
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
                      <a onClick={() => { this.setState({ showModal: true }) }} className="fileUpload mlUpload_btn final_cancel">Cancel</a>
                      <a onClick={() => { this.setState({ showSession: true }) }} className="fileUpload mlUpload_btn final_sign">Modify</a>
                    </div>
                  </div>
                  <AppointmentModal
                    message="Are you sure you want to cancel the session?"
                    onOkClick={() => { this.cancelSession(); this.setState({ showModal: false }) }}
                    onCancelClick={() => { this.setState({ showModal: false }) }}
                    showModal={this.state.showModal} />

                </div>
              </div>
              <div className="tab-pane" id={`${this.state.orderId}2a`}>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <input type="text" placeholder="Appointment Id" value={this.state.orderId} defaultValue="" className="form-control float-label" id="" />
                    </div>
                    <div className="form-group">
                      <input type="text" placeholder="Appointment date & Time"
                             value={`${new moment(this.state.data.startDate).format(Meteor.settings.public.dateFormat)} GMT`} defaultValue="" className="form-control float-label" id="" />
                    </div>
                    <div className="form-group">
                      <input type="text" placeholder="Transaction Id" value={this.state.data.service.transactionId} defaultValue="" className="form-control float-label" id="" />
                    </div>
                    <div className="form-group">
                      <input type="text" placeholder="Appointment With" value={appointmentWith.name} defaultValue="" className="form-control float-label" id="" />
                    </div>
                    <div className="form-group">
                      <input type="text" placeholder="User ID" value={appointmentWith.userId} defaultValue="" className="form-control float-label" id="" />
                    </div>
                    <div className="form-group">
                      <input type="text" placeholder="Community" value={appointmentWith.community} defaultValue="" className="form-control float-label" id="" />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <input type="text" placeholder="Sub Chapter" value={appointmentWith.subChapter} defaultValue="" className="form-control float-label" id="" />
                    </div>
                    <div className="form-group">
                      <input type="text" placeholder="Chapter" value={appointmentWith.chapter} defaultValue="" className="form-control float-label" id="" />
                    </div>
                    <div className="form-group">
                      <input type="text" placeholder="Cluster" value={appointmentWith.cluster} defaultValue="" className="form-control float-label" id="" />
                    </div>
                    <div className="form-group">
                      <input type="text" placeholder="Contact Number" value={appointmentWith.phoneNo} defaultValue="" className="form-control float-label" id="" />
                    </div>
                    <div className="form-group">
                      <input type="text" placeholder="Email ID" value={appointmentWith.email} defaultValue="" className="form-control float-label" id="" />
                    </div>
                    <div className="form-group">
                      <input type="text" placeholder="Gender" value={appointmentWith.gender} defaultValue="" className="form-control float-label" id="" />
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
                }}
                data = {{
                  client: this.state.clientName,
                  endDate: this.state.endDate,
                  startDate:this.state.startDate
                }}
                service={this.state.data.service||{}}
                 showCancelAndRescheduleInfo={true}
                />
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
        }
        {
          this.state.showSession &&
          <div>
            <div className="col-md-4">
              <Datetime
                dateFormat="DD-MM-YYYY"
                timeFormat={false}
                inputProps={{ placeholder: "Selected date", readOnly: true }}
                value={this.state.selectedDate
                  ? moment(this.state.selectedDate).format(Meteor.settings.public.dateOnlyFormat)
                  : ''}
                  isValidDate={validDate}
                onChange={(event) => this.changeDate(event)}
              />
              <FontAwesome name="calendar" className="password_icon" />
            </div>
            <a onClick={() => { this.setState({ showSession: false }) }}
              className="fileUpload mlUpload_btn cancel_send">
              Cancel</a>
            <SessionTable
              showLoading={this.state.loadingSlots}
              availableSlots={this.state.data.availableSlots}
              updateSession={this.updateSession}
              selectedDate={this.state.selectedDates}/>
          </div>
        }
      </div>
    )
  }
}
