/**
 * Parent component for selected ongoing my appointment
 * @Author :: Birendra Kumar
 * @Dated :: 24/07/2017
 */

// import NPM module(s)
import React, {Component} from "react";
import Moment from "moment";
import _ from 'lodash';

// import custom method(s) and component(s)
import MlAppSelfTaskMyAppointmentInfo from './MlAppSelfTaskMyAppointmentInfo';
import {fetchSelfTaskById} from '../../actions/fetchOngoingAppointments';
import MlAccordion from "../../../../commons/components/MlAccordion";
import formHandler from "../../../../../commons/containers/MlFormHandler";
import MlAppActionComponent from "../../../../commons/components/MlAppActionComponent";
import {updateAppointmentActionHandler} from '../../actions/appointmentActionHandler';

class MlAppSelectedSelfTaskMyAppointment extends Component {

  /**
   * Constructor
   * @param props :: Object - Parents data
   */
  constructor(props) {
    super(props);
    this.state = {
      selfTask: {}
    };
    this.selfTaskId = this.props.appointment.resourceId;
    this.getSelfTaskDetails = this.getSelfTaskDetails.bind(this);
  }

  componentWillMount() {
    this.getSelfTaskDetails();
  }

  /**
   * Method :: getSelfTaskDetails
   * Desc   :: fetch the current self task details from server and set in state
   * @returns Void
   */
  async getSelfTaskDetails() {
    if (this.props.appointment.resourceId) {
      let selfTask = await fetchSelfTaskById(this.selfTaskId);
      this.setState({
        selfTask: selfTask || {}
      });
    }
  }

  async updateAppointment(status) {
    const resp = await updateAppointmentActionHandler(this.props.appointment.appointmentId, status);
    this.showResponseMsg(resp, `Appointment ${status} successfully`);
  }
  /**
   * Method :: showResponseMsg
   * Desc :: Show to error(s) or success(es) msg
   * @param response :: server response
   */
  showResponseMsg(response, msg) {
    if (response.success) {
      toastr.success(msg);
      this.props.resetSelectedAppointment();
    } else {
      toastr.error(response.result);
    }
  }

  /**
   * Method :: React render
   * Desc :: Showing html page
   * @returns {XML}
   */
  render() {
    const status = this.props.status;
    const that = this;
    let appActionConfig = [
      {
        showAction: true,
        actionName: 'complete',
        handler: async(event) => that.props.handler(that.updateAppointment.bind(this, 'Completed'))
      }
    ];
    export const genericPortfolioAccordionConfig = {
      id: 'portfolioAccordion',
      panelItems: [
        {
          'title': 'Actions',
          isText: false,
          style: {'background': '#ef4647'},
          contentComponent: <MlAppActionComponent
            resourceDetails={{resourceId: 'selftask', resourceType: 'selftask'}}   //resource id need to be given
            actionOptions={appActionConfig}/>
        }]
    };
    return (
      <div className="col-lg-12">
        <div className="app_padding_wrap">
          <div className="clearfix"/>
          <div className="col-md-12">
            <MlAppSelfTaskMyAppointmentInfo selfTask={this.state.selfTask} />
          </div>
          {status !== 'Completed' &&
          <MlAccordion accordionOptions={genericPortfolioAccordionConfig} {...this.props} />
          }
        </div>
      </div>
    )
  }
};

export default MlAppSelectedSelfTaskMyAppointment = formHandler()(MlAppSelectedSelfTaskMyAppointment);
