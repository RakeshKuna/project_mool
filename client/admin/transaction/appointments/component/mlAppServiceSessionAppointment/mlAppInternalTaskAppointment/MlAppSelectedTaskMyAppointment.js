/**
 * Parent component for selected ongoing my appointment
 * @Author :: Birendra Kumar
 * @Dated :: 24/07/2017
 */

// import NPM module(s)
import React, { Component } from "react";

// import custom method(s) and component(s)
import StepZilla from '../../../../../../commons/components/stepzilla/StepZilla';
import MlAppTaskMyAppointmentBasicInfo from './MlAppTaskMyAppointmentBasicInfo';
import MlAppTaskMyAppointmentSession from './MlAppTaskMyAppointmentSession';
import MlAppTaskMyAppointmentTermAndCondition from './MlAppTaskMyAppointmentTermAndCondition';
import { findTaskActionHandler } from '../actions/fetchOngoingAppointments';
import formHandler from "../../../../../../commons/containers/MlFormHandler";
import MlAppActionComponent from "../../../../../../commons/components/actions/ActionComponent";
import { updateAppointmentActionHandler } from '../actions/appointmentActionHandler';
import { fetchSlotAppointmentsDetailsActionHandler } from '../actions/fetchSlotDetails';

class MlAppSelectedTaskMyAppointment extends Component {

  /**
   * Constructor
   * @param props :: Object - Parents data
   */
  constructor(props) {
    super(props);
    this.state = {
      task: {},
      slotInfo: {
        attendeeDetails: []
      }
    };
    this.taskId = this.props.appointment.resourceId;
    this.getTaskDetails = this.getTaskDetails.bind(this);
    this.setTaskSteps = this.setTaskSteps.bind(this);
    this.getSlotDetails = this.getSlotDetails.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.taskId = nextProps.appointment.resourceId;
    this.getTaskDetails();
    this.getSlotDetails();
  }

  componentDidMount() {
    $('.switch input').change(function () {
      if ($(this).is(':checked')) {
        $(this).parent('.switch').addClass('on');
      } else {
        $(this).parent('.switch').removeClass('on');
      }
    });
  }

  /**
   * Method :: setTaskSteps
   * Desc :: Sets components steps for stepzila to create and update task data
   */
  setTaskSteps() {
    const { appointment } = this.props;
    const { task, slotInfo } = this.state;
    const steps = [
      {
        name: 'Task',
        component: <MlAppTaskMyAppointmentBasicInfo
          task={task}
          appointment={appointment} />,
        icon: <span className="ml fa fa-list-alt"></span>
      },
      {
        name: 'Sessions',
        component: <MlAppTaskMyAppointmentSession
          task={task}
          slotInfo={slotInfo}
          appointment={appointment} />,
        icon: <span className="ml my-ml-sessions"></span>
      },
      {
        name: 'Info',
        component: <MlAppTaskMyAppointmentTermAndCondition
          task={task}
          appointment={appointment} />,
        icon: <span className="ml my-ml-info"></span>
      }

    ];
    return steps;
  }

  /**
   * Method :: getTaskDetails
   * Desc   :: fetch the current task details from server and set in state
   * @returns Void
   */
  async getTaskDetails() {
    if (this.props.appointment.sessionId) {
      let task = await findTaskActionHandler(this.props.appointment.resourceId, this.props.appointment.sessionId);
      this.setState({
        task: task || {}
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
   * Method :: getSlotInfo
   * Desc   :: fetch the current slot details from server and set in state
   * @returns Void
   */
  async getSlotDetails() {
    if (this.props.appointment && this.props.appointment.appointmentId) {
      let slotInfo = await fetchSlotAppointmentsDetailsActionHandler([this.props.appointment.appointmentId]);
      if (slotInfo && slotInfo[0]) {
        this.setState({
          slotInfo: slotInfo[0]
        });
      }
    }
  }

  /**
   * Method :: React render
   * Desc :: Showing html page
   * @returns {XML}
   */
  render() {
    // const status = this.props.status;
    let status = FlowRouter.getQueryParam('tab');
    let appActionConfig = [];
    const that = this;
    switch (status) {
      case 'pending':
        appActionConfig = [
          {
            showAction: true,
            actionName: 'accept',
            handler: async (event) => that.props.handler(that.updateAppointment.bind(this, 'Accepted'))
          },
          {
            showAction: true,
            actionName: 'reject',
            handler: async (event) => that.props.handler(that.updateAppointment.bind(this, 'Rejected'))
          }
        ];
        break;
      case 'current':
        appActionConfig = [
          {
            showAction: true,
            actionName: 'complete',
            handler: async (event) => that.props.handler(that.updateAppointment.bind(this, 'Completed'))
          }
        ];
        break;
      case 'rejected':
        appActionConfig = [
          {
            showAction: true,
            actionName: 'accept',
            handler: async (event) => that.props.handler(that.updateAppointment.bind(this, 'Accepted'))
          }
        ];
        break;
      default:
      // do nothing
    }
    export const genericPortfolioAccordionConfig = {
      id: 'portfolioAccordion',
      panelItems: [
        {
          'title': 'Actions',
          isText: false,
          style: { 'background': '#ef4647' },
          contentComponent: <MlAppActionComponent
            resourceDetails={{ resourceId: 'internaltask', resourceType: 'internaltask' }}   //resource id need to be given
            actionOptions={appActionConfig} />
        }]
    };
    return (
      <div className="col-lg-12 app_main_wrap">
        <div className="app_padding_wrap">
          <div className="clearfix" />
          <div className="col-md-12">
            <div className='step-progress'>
              <div id="root">
                <StepZilla steps={this.setTaskSteps()}
                  stepsNavigation={true}
                  showNavigation={false}
                  prevBtnOnLastStep={false} />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
};

export default MlAppSelectedTaskMyAppointment = formHandler()(MlAppSelectedTaskMyAppointment);
