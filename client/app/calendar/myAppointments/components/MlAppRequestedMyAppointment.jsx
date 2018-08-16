/**
 * Created by pankaj on 24/7/17.
 */

import React from 'react';
import {requestedAppointmentActionHandler, getBeSpokeForAppointments} from '../actions/fetchRequestedAppointments';
import NoDataList from '../../../../commons/components/noData/noDataList';
import MlLoader from "../../../../commons/components/loader/loader";
import BeSpokeView from "../../../../admin/transaction/portfolio/component/Funders/edit/Services/Presentation/beSpokeView";
import generateAbsolutePath from '../../../../../lib/mlGenerateAbsolutePath';
export default class MlAppRequestedMyAppointment extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      appointments:[],
      showDetails: false
    }
    // this.fetchAppointment();
  }
  componentDidUpdate()
  {
    var WinWidth = $(window).width();
    var WinHeight = $(window).height();
    $('.tab_wrap_scroll').height(WinHeight-($('.app_header').outerHeight(true)+120));
    if(WinWidth > 768){
      $(".tab_wrap_scroll").mCustomScrollbar({theme:"minimal-dark"});}

  }

  async fetchAppointment(){
    let response = await requestedAppointmentActionHandler();
    if(response) {
      this.setState({
        appointments:response
      })
    };
  }

  selectedAppointment(appointmentInfo , context) {
    this.fetchBeSpokeDetails(appointmentInfo._id);
  }

  async fetchBeSpokeDetails(serviceId) {
    const response = await getBeSpokeForAppointments(serviceId)
    this.setState({ beSpokeDetails: response, showDetails: true})
    return response;
  }



  render() {
    const that = this;
    let appointments = that.props.data || [];
    let config=this.props.config;
    return (
      !(this.state.showDetails) ?<div>
        {config.loading === true ? ( <MlLoader/>) : (
      <div>
        {appointments && !appointments.length ? (<NoDataList appointment={true} moduleName="Requested Appointments"/>) : (
          <div className="tab_wrap_scroll ideators_list">
            {appointments.map(function (appointment, index) {
              return (
              <div className="col-lg-2 col-md-4 col-sm-4" key={index}>
                <div className="card_block appointment_card"  onClick={that.selectedAppointment.bind(that,appointment )}><h3>{appointment.displayName}</h3>
                  <div className="clearfix"></div>
                  <div className="list_icon mart0">
                    <span className="profile-text">By</span>
                    <button className={`btn ${appointment.mode === 'online' ? 'btn-danger' : 'btn-success'} pull-right`}>{appointment.mode}</button>
                    <div className="clearfix"></div>
                    <img className="c_image" src={appointment.beSpokeCreatorProfileImage?generateAbsolutePath(appointment.beSpokeCreatorProfileImage):'/images/def_profile.png'}/>
                    <div className="clearfix"></div>
                    <span className="price">{appointment.duration ? `${appointment.duration.hours ? appointment.duration.hours : 0} Hrs ${appointment.duration.minutes ? appointment.duration.minutes : 0} Mins` : ''}</span>
                    <span className="price pull-right">{`${appointment.noOfSession ? appointment.noOfSession : '0'} Sessions`}</span>
                  </div><div className="block_footer"><span>{"BeSpoke"}</span></div></div>
              </div>
              )
            })}
          </div>)
        }
        </div>
        )}
      </div> : <BeSpokeView data={this.state.beSpokeDetails} module={"appointments"}/>
    )
  }
}
