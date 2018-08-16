/**
 * Created by pankaj on 13/9/17.
 */

import React, { Component, PropTypes } from 'react';
import MlAppServicePurchasedDetail from './mlAppServicePurchasedDetail/MlAppServicePurchasedDetail';
import MlAppServiceSessionAppointment from './mlAppServiceSessionAppointment/MlAppServiceSessionAppointment';
export default class MlAppointmentsDetailsComponent extends Component {
  render() {
    let appointmentId = this.props.appointmentId;
    let appointmentType = this.props.transactionType;
    if (appointmentType === "Service-Purchased") {
      return (
        <MlAppServicePurchasedDetail orderId={appointmentId} />
      )
    } else {
      return (
        <MlAppServiceSessionAppointment orderId={appointmentId} docId={this.props.docId} />
      );
    }

  }
}

