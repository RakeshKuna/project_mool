/*
/!**
 * Created by pankaj on 24/7/17.
 */
 /*
import React from 'react';
import MlAppOngoingSelectedMyAppointment from './MlAppOngoingSelectedMyAppointment';
import {ongoingAppointmentActionHandler} from '../../actions/fetchOngoingAppointments';

export default class MlAppOngoingMyAppointment extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      appointments:[],
      selectedAppointment: {},
      isSelectedAppointment: false
    };
    this.fetchAppointment();
  }

  async fetchAppointment(){
    let response = await ongoingAppointmentActionHandler();
    if(response) {
      this.setState({
        appointments:response
      })
    };
  }

  /!**
   * Method :: viewAppointment
   * Desc :: Redirect with view appointment component
   * @param id :: current service id
   *!/
  viewAppointment(appointment) {
    let data = {
      _id: appointment._id,
      seeker: appointment.client,
      provider: appointment.provider,
      serviceId: appointment.appointmentInfo.resourceId,
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

  render() {
    const that = this;
    const {selectedAppointment, isSelectedAppointment} = this.state;
    return (
      <div>
        {(selectedAppointment && isSelectedAppointment) ?
          <MlAppOngoingSelectedMyAppointment appointment={selectedAppointment} />
          :
          <div>
            {that.state.appointments.map(function (appointment, index) {
              return (
                <div className="col-lg-2 col-md-4 col-sm-4" key={index} >
                  <div className="list_block list_block_intrests notrans" onClick={()=>that.viewAppointment(appointment)}>
                    <div className="hex_outer"><img src="/images/valuation.png"/></div>
                    <div className="task-status pending"></div>
                    <h3>{ appointment.appointmentInfo ?  appointment.appointmentInfo.serviceName : ''}</h3>
                  </div>
                </div>
              )
            })}
          </div>
        }
      </div>
    )
  }

}

*/
