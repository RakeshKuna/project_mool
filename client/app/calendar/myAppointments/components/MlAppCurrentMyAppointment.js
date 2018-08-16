/**
 * Appointment current component
 * @Author :: Birendra Kumar
 * @Dated :: 17/08/2017
 */

// import NPM module(s)
import React, {Component} from 'react';
import MlAppMyAppointmentCommon from './MlAppMyAppointmentCommon';

export default class MlAppCurrentMyAppointment extends Component{
  render() {
    return (<MlAppMyAppointmentCommon status="Accepted" />);
  }
};
