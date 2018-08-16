/**
 * Created by pankaj on 10/9/17.
 */
import React from 'react';

import MlAppCalendarServiceAppointment from './mlAppServiceTaskAppointment/MlAppCalendarServiceAppointment';
import MlAppCalendarTaskAppointment from './mlAppInternalTaskAppointment/MlAppCalendarTaskAppointment';
import MlAppCalendarSelfTaskMyAppointment from './mlAppSelfTaskAppointment/MlAppCalendarSelfTaskMyAppointment';

export default class MlAppCalenderAppointmentInfo extends React.Component {

  render () {
    const {selectedAppointment} = this.props;
    let status = "Completed";
    console.log(selectedAppointment);
    switch (selectedAppointment.appointmentType) {
      case 'SERVICE-TASK':
        return (<MlAppCalendarServiceAppointment resetSelectedAppointment={this.resetSelectedAppointment} status={status} appointment={selectedAppointment} />)
        break;
      case 'INTERNAL-TASK':
        return (<MlAppCalendarTaskAppointment resetSelectedAppointment={this.resetSelectedAppointment} status={status} appointment={selectedAppointment} />)
        break;
      case 'SELF-TASK':
        return (<MlAppCalendarSelfTaskMyAppointment resetSelectedAppointment={this.resetSelectedAppointment} status={status} appointment={selectedAppointment} />)
        break;
      default:
        return <div>To do</div>
    }
  }
}
