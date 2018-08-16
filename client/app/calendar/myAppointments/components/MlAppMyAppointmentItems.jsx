/**
 * Created by pankaj on 8/9/17.
 */
/**
 * Appointment pending component
 * @Author :: Birendra Kumar
 * @Dated :: 17/08/2017
 */

// import NPM module(s)
import React, {Component} from 'react';
import FontAwesome from 'react-fontawesome';
import Moment from 'moment';
import MlAppOngoingSelectedMyAppointment from './mlAppServiceTaskAppointment/MlAppOngoingSelectedMyAppointment';
import MlAppSelectedTaskMyAppointment from './mlAppInternalTaskAppointment/MlAppSelectedTaskMyAppointment';
import MlAppSelectedSelfTaskMyAppointment from './mlAppSelfTaskAppointment/MlAppSelectedSelfTaskMyAppointment';
import {ongoingAppointmentActionHandler} from '../actions/fetchOngoingAppointments';
import NoDataList from '../../../../commons/components/noData/noDataList';
import MlLoader from "../../../../commons/components/loader/loader";
import generateAbsolutePath from '../../../../../lib/mlGenerateAbsolutePath';

export default class MlAppMyAppointmentItems extends Component{
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
      endDate: appointment.endDate,
      isCancelled: appointment.isCancelled,
    };
    FlowRouter.setQueryParams({appointment:data});
    // this.setState({
    //   selectedAppointment: data,
    //   isSelectedAppointment: true
    // });
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
    console.log(this.props);
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
  getAppointmentType(moduleName) {
    switch (moduleName) {
      case 'myPendingAppointment':
        return "Pending Appointments"
        break;
      case 'myCurrentAppointment':
        return "Accepted Appointments"
        break;
      case 'myCompletedAppointment':
        return "Completed Appointments"
        break;
      case 'myRejectedAppointment':
        return "Rejected Appointments"
        break;
      case 'myTodayAppointment':
        return "Today Appointments"
        break;
      case 'myExpiredAppointment':
        return "Expired Appointments"
        break;
      default:
            return "Appointments"
      // do nothing
    }
  }

  render() {
    const that = this;
    let appointments = this.props.data || [];
    let config=this.props.config;
    console.log('----appointments---', appointments, ' / ', status);
    let status = (appointments && appointments.length > 0) ? appointments[0].appointmentWith.status : '';
    let activeClassName = (status === 'Completed' || status === 'Rejected') ? 'warning' : ''
    const {selectedAppointment, isSelectedAppointment} = this.state;
    return (
      <div>
        {config.loading === true ? ( <MlLoader/>) : (
         <div>
        {(selectedAppointment && isSelectedAppointment) ?
          <div>{this.getAppointmentComponentToLoad()}</div>
          :(<div>{appointments && !appointments.length?(<NoDataList appointment={true} moduleName={this.getAppointmentType(config.moduleName)}/>):(
          <div className="tab_wrap_scroll ideators_list">
            {appointments.map(function (appointment, index) {
              let startDate, currenDate, days, startMsg, hours, minutes;
              if (appointment.startDate) {
                startDate = new Moment(appointment.startDate,"YYYY-MM-DD HH:mm:ss");
                currenDate = new Moment(new Date(),"YYYY-MM-DD HH:mm:ss");
                days = startDate.diff(currenDate, 'days');
                hours = startDate.diff(currenDate, 'hours')%24;
                minutes = startDate.diff(currenDate, 'minutes')%60;
                if (days > 1) {
                  startMsg = `Starts in ${days} Days`;
                }else if(days<0){
                  startMsg = ``;
                } else if (hours >= 0 && minutes >= 0) {
                  startMsg = `Starts in ${hours > 0 ? `${hours} Hrs :` : ''}  ${minutes} Mins`;
                }
              }
              return (

                <div className="col-lg-2 col-md-4 col-sm-4">
                  <div className="card_block appointment_card" onClick={()=>that.viewAppointment(appointment)}>
                    <h3>{appointment.appointmentWith && appointment.appointmentWith.displayName}</h3>
                    <div className={`active ${activeClassName}`}>
                      {status === 'Completed' &&
                      <FontAwesome name='check'/>
                      }
                      {status === 'Rejected' &&
                      <FontAwesome name='times'/>
                      }
                    </div>
                    <div className="clearfix"></div>
                    <div className="list_icon mart0">
                      <span className="profile-text">With</span>
                      <div className="clearfix"></div>
                      {(appointment.appointmentWith && appointment.appointmentWith.userProfilePic) ?
                        <img className="c_image" src={generateAbsolutePath(appointment.appointmentWith.userProfilePic)}/>
                        : <i className="c_image ml my-ml-Ideator"></i>
                      }
                      <br />
                      <div className="clearfix"></div>
                      {status === 'Completed' &&
                      <span className="date">{`Completed on ${new Moment(appointment.endDate).format(Meteor.settings.public.dateFormat)}`}</span>
                      }
                      {(status === 'Accepted' || status === 'Pending') &&
                      <span className="date">{new Moment(appointment.startDate).format(Meteor.settings.public.dateFormat)} GMT </span>
                      }
                      {status === 'Rejected' &&
                      <span className="date">{`${new Moment(appointment.startDate).format(Meteor.settings.public.dateFormat)} GMT (${appointment.isCancelled?'Cancelled':'Rejected'})`}</span>
                      }
                      {(status !== 'Rejected' && status !== 'Completed') &&
                      <span className="date">{startMsg}</span>
                      }
                    </div>
                    <div className="block_footer"><span>{ (appointment.appointmentInfo && appointment.appointmentType === 'SERVICE-TASK') ?
                      appointment.appointmentInfo.serviceName : appointment.appointmentInfo.taskName}</span></div>
                  </div>
                </div>

              )
            })}
          </div>
        )}</div>)

        }
      </div>
        )}
      </div>
    )
  }
};
