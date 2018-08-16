// import NPM module(s)
import React, { Component } from 'react';
import ScrollArea from 'react-scrollbar';
import Moment from "moment";
import { initalizeFloatLabel } from "../../../../../commons/utils/formElemUtil";
import FontAwesome from 'react-fontawesome';
import generateAbsolutePath from '../../../../../../lib/mlGenerateAbsolutePath';

export default class MlAppTaskMyAppointmentSession extends Component {

  constructor(props) {
    super(props);
    this.state = {
      activities: [],
      selectedSessionId: '',
      isExternal: props.task.isExternal || false,
      isInternal: props.task.isInternal || false
    };
  }

  componentDidMount() { 
    initalizeFloatLabel();
    let mySwiper = new Swiper('.manage_tasks', {
      speed: 400,
      spaceBetween:15,
      slidesPerView:5,
    });
    // $('.float-label').jvFloat();
    var WinHeight = $(window).height();
    $('.step_form_wrap').height(WinHeight - (290 + $('.app_header').outerHeight(true)));
  }

  /**
   * Method :: getSessionList
   * Desc :: List of task session
   * @return XML
   */

  getSessionList() {
    let session = this.props.task.session;
    const sessionsList = session ? session.map((data, index) => {
      if (data && data.sessionId === this.props.appointment.sessionId) {
        return (
          <div onClick={() => this.setSession(index, data.sessionId, data.duration)} className="panel panel-info" key={index}>
            <div className="panel-heading" style={{ 'paddingBottom': '30px' }}>
              <div className="col-md-2 nopadding-left">Session {index + 1}</div>
              <div className="col-md-4">
                <div style={{ 'marginTop': '-4px' }}>
                  <label>Duration: &nbsp;
                    <input type="text"
                      className="form-control inline_input"
                      value={data.duration.hours || 0} /> Hours
                    <input type="text"
                      className="form-control inline_input"
                      value={data.duration.minutes || 0} /> Mins
                  </label>
                </div>
              </div>
              {/*<div className="col-md-4 col-lg-4 pull-right">
                <div  style={{'marginTop':'-4px'}}>
                  <div className="input_types">
                    <input id="slottime" type="checkbox" slottime="clone" value="1"
                           checked />
                    <label htmlFor="slottime"><span><span></span></span></label>
                  </div>
                  <label style={{'marginTop':'5px'}} htmlFor="fancy-checkbox-default">
                    22nd May 2017 11:16:30
                  </label>
                </div>
              </div>*/}
            </div>
            <div className="panel-body">
              <div className="swiper-container manage_tasks">
                <div className="swiper-wrapper">
                  {data.activities && data.activities.map((activity, index) => {
                    return (
                      <div className="col-lg-2 col-md-4 col-sm-4 swiper-slide" key={index}>
                        <div className="card_block"><h3>{activity.displayName}</h3>
                          <div className={activity.isActive ? 'active' : 'inactive'}></div>
                          <div className="clearfix"></div>
                          <div className="list_icon mart0">
                            <span className="price">Rs. {(activity.payment && activity.payment.derivedAmount) ? activity.payment.derivedAmount.toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") : '0.00'}</span>
                            <span className="price pull-right">{(activity.isExternal && !activity.isInternal? 'EXT' : (activity.isInternal && !activity.isExternal ? 'INT' : (activity.isExternal && activity.isInternal ? 'INT + EXT' : '')))}</span>
                            <div className="clearfix"></div>
                            {activity.imageLink ?
                              <img className="c_image" src={activity.imageLink ? generateAbsolutePath(activity.imageLink) : "/images/activity_1.jpg"}/>
                              : <i className="c_image ml my-ml-Ideator"></i>
                            }
                            <div className="clearfix"></div>
                            <span className="price">{activity.duration ? `${activity.duration.hours ? activity.duration.hours : 0} Hrs ${activity.duration.minutes ? activity.duration.minutes : 0} Mins` : ''}</span>
                            <button className={`btn ${activity.mode === 'online' ? 'btn-danger' : 'btn-success'} pull-right`}>{activity.mode}</button>
                          </div><div className="block_footer"><span>{activity.isServiceCardEligible ? 'Service Cardeable' : 'Non-Service Cardeable'}</span></div></div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        )
      }
    }) : [];
    return sessionsList;
  }
  /**
   * Method :: React render
   * Desc :: Showing html page
   * @returns {XML}
   */
  render() {
    let data = this.props.slotInfo || {};

    let appointmentType = data.appointmentType === "SERVICE-TASK" ? "External" : "Internal";
    data.attendeeDetails = data.attendeeDetails ? data.attendeeDetails : [];
    let user = data.attendeeDetails.find((attendee) => {
      if (data.appointmentType === "SERVICE-TASK") {
        return attendee.isClient
      } else {
        return attendee.isProvider
      }
    });
    user = user ? user : {};
    return (
      <div className="step_form_wrap step1">
        <ScrollArea speed={0.8} className="step_form_wrap" smoothScrolling={true} default={true}>
          <br />
          <div className="panel panel-default">
            <div className="panel-body">
              {this.getSessionList()}
            </div>
          </div>

          <div className="row">
            <div className="panel panel-default cal_view_task pending">
              <div className="panel-body">
                <div className="col-md-12 nopadding">
                  <div className="col-md-3 nopadding text-center">
                    <img src={user.profileImage ? generateAbsolutePath(user.profileImage) : '/images/img2.png'} className="image" />
                    <div className="">
                      <span>{`${this.props.data.client}`}</span>
                    </div>
                  </div>
                  <div className="col-md-9">
                    <br />
                    <div className="form-group">
                      <input className="form-control float-label" type="text" placeholder="Start Date Time" defaultValue={this.props.data.startDate ? new Moment(this.props.data.startDate).format(Meteor.settings.public.dateFormat) : ''} id="" disabled />
                    </div>
                    <div className="form-group">
                      <input type="text" placeholder="End Date Time" defaultValue={this.props.data.endDate ? new Moment(this.props.data.endDate).format(Meteor.settings.public.dateFormat) : ''} className="form-control float-label" id="" disabled />
                    </div>
                  </div>
                </div>
                <div className="col-md-12 naopadding att_members" >
                  <ul className="users_list">
                    {data.attendeeDetails ? data.attendeeDetails.map(function (info) {
                      if (data.appointmentType === "SERVICE-TASK" && info.isClient) {
                        return;
                      } else if (data.appointmentType !== "SERVICE-TASK" && info.isProvider) {
                        return;
                      }
                      return (
                        <li>
                          <a href="">
                            {info.status === 'Accepted' ? <FontAwesome name='circle' style={{ 'position': 'absolute', 'color': 'yellowgreen' }} /> : info.status === 'Pending' ? <FontAwesome name='circle' style={{ 'position': 'absolute', 'color': 'yellow' }} /> :
                              info.status === 'Rejected' ? <FontAwesome name='circle' style={{ 'position': 'absolute', 'color': 'red' }} /> : <FontAwesome name='circle' style={{ 'position': 'absolute', }} />}
                            <img src={info.profileImage ? generateAbsolutePath(info.profileImage) : "/images/img2.png"} /><br />
                            <div className="tooltiprefer">
                              <span>{`${info.firstName} ${info.lastName}`}</span>
                            </div>
                          </a>
                        </li>
                      )
                    }) : <div></div>}
                  </ul>
                </div>
              </div>
            </div>
          </div>


        </ScrollArea>
      </div>
    )
  }
};

