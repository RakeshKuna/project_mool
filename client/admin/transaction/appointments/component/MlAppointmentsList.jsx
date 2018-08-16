/**
 * Created by pankaj on 13/9/17.
 */

import React, {Component, PropTypes} from 'react';
import MlTableViewContainer from "../../../core/containers/MlTableViewContainer";
import {mlAppointmentsTableConfig} from "../config/MlAppointmentsConfig";

export default class MlAppointmentsList extends Component {
  render() {
    return (
      <div className="admin_main_wrap">
        <div className="admin_padding_wrap">
          <h2>Appointment</h2>
          <MlTableViewContainer {...mlAppointmentsTableConfig} forceFetch={true}/>
        </div>
      </div>
    );
  }
}
