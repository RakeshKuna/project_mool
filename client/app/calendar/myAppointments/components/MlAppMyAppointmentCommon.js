/**
 * Appointment pending component
 * @Author :: Birendra Kumar
 * @Dated :: 17/08/2017
 */

// import NPM module(s)
import React, {Component} from 'react';
import MlAppOngoingSelectedMyAppointment from './mlAppServiceTaskAppointment/MlAppOngoingSelectedMyAppointment';
import MlAppSelectedTaskMyAppointment from './mlAppInternalTaskAppointment/MlAppSelectedTaskMyAppointment';
import MlAppSelectedSelfTaskMyAppointment from './mlAppSelfTaskAppointment/MlAppSelectedSelfTaskMyAppointment';
import {ongoingAppointmentActionHandler} from '../actions/fetchOngoingAppointments';

export default class MlAppPendingMyAppointment extends Component{
  constructor(props){
    super(props);
    this.state = {
      appointments:[],
      selectedAppointment: {},
      isSelectedAppointment: false
    };
    this.fetchAppointment();
    this.resetSelectedAppointment = this.resetSelectedAppointment.bind(this);
  }

  async fetchAppointment(){
    let response = await ongoingAppointmentActionHandler(this.props.status);
    if(response) {
      this.setState({
        appointments:response
      })
    };
  }

  /**
   * Method :: viewAppointment
   * Desc :: Redirect with view appointment component
   * @param id :: current service id
   */
  viewAppointment(appointment) {
    let data = {
      _id: appointment._id,
      appointmentType: appointment.appointmentType,
      appointmentId: appointment.appointmentId,
      seeker: appointment.client,
      provider: appointment.provider,
      resourceId: appointment.appointmentInfo.resourceId,
      serviceName: appointment.appointmentInfo.serviceName,
      sessionId: appointment.appointmentInfo.sessionId,
      startDate: appointment.startDate,
      endDate: appointment.endDate
    };
    this.setState({
      selectedAppointment: data,
      isSelectedAppointment: true
    });
  }
  componentDidUpdate()
  {
    var WinWidth = $(window).width();
    var WinHeight = $(window).height();
    $('.tab_wrap_scroll').height(WinHeight-($('.app_header').outerHeight(true)+120));
    if(WinWidth > 768){
      $(".tab_wrap_scroll").mCustomScrollbar({theme:"minimal-dark"});}

  }

  resetSelectedAppointment() {
    this.setState({isSelectedAppointment: false}, () => this.fetchAppointment() );
  }

  getAppointmentComponentToLoad() {
    const {selectedAppointment} = this.state;
    switch (selectedAppointment.appointmentType) {
      case 'SERVICE-TASK':
        return (<MlAppOngoingSelectedMyAppointment resetSelectedAppointment={this.resetSelectedAppointment} status={this.props.status} appointment={selectedAppointment} />)
        break;
      case 'INTERNAL-TASK':
        return (<MlAppSelectedTaskMyAppointment resetSelectedAppointment={this.resetSelectedAppointment} status={this.props.status} appointment={selectedAppointment} />)
        break;
      case 'SELF-TASK':
        return (<MlAppSelectedSelfTaskMyAppointment resetSelectedAppointment={this.resetSelectedAppointment} status={this.props.status} appointment={selectedAppointment} />)
        break;
      default:
      // do nothing
    }
  }

  render() {
    const that = this;
    const {selectedAppointment, isSelectedAppointment} = this.state;
    return (
      <div>
        {(selectedAppointment && isSelectedAppointment) ?
          <div>{this.getAppointmentComponentToLoad()}</div>
          :
          <div className="tab_wrap_scroll ideators_list">
            {that.state.appointments.map(function (appointment, index) {
              return (
                <div className="col-md-2 col-sx-3 col-sm-4 col-lg-2" key={index}>
                  <div className="ideators_list_block" onClick={()=>that.viewAppointment(appointment)}>
                    <div className="inactive"><span>inactive</span></div>
                    <h3>{ (appointment.appointmentInfo && appointment.appointmentType === 'SERVICE-TASK') ?
                      appointment.appointmentInfo.serviceName : appointment.appointmentInfo.taskName}</h3>
                    <img src="/images/valuation.png" className="c_image"/>
                    <div className="block_footer">
                      <span></span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        }
      </div>
    )
  }
};
