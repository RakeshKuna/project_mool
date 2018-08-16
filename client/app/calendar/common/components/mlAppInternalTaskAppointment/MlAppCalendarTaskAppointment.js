/**
 * Parent component for selected ongoing my appointment
 * @Author :: Birendra Kumar
 * @Dated :: 24/07/2017
 */

// import NPM module(s)
import React, {Component} from "react";

// import custom method(s) and component(s)
import StepZilla from '../../../../../commons/components/stepzilla/StepZilla';
import MlAppCalendarTaskAppointmentBasicInfo from './MlAppCalendarTaskAppointmentBasicInfo';
import MlAppCalendarTaskAppointmentSession from './MlAppCalendarTaskAppointmentSession';
import MlAppCalendarTaskAppointmentTermAndCondition from './MlAppCalendarTaskAppointmentTermAndCondition';
import {findTaskActionHandler} from '../../actions/fetchOngoingAppointments';
import MlAccordion from "../../../../commons/components/MlAccordion";
import formHandler from "../../../../../commons/containers/MlFormHandler";
import MlAppActionComponent from "../../../../commons/components/MlAppActionComponent";
import {updateAppointmentActionHandler} from '../../actions/appointmentActionHandler';

class MlAppCalendarTaskAppointment extends Component {

  /**
   * Constructor
   * @param props :: Object - Parents data
   */
  constructor(props) {
    super(props);
    this.state = {
      task: {}
    };
    this.taskId = this.props.appointment.resourceId;
    this.getTaskDetails = this.getTaskDetails.bind(this);
    this.setTaskSteps = this.setTaskSteps.bind(this);
  }

  componentWillMount() {
    this.getTaskDetails();
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
    const {appointment} = this.props;
    const {task} = this.state;
    const steps = [
      {
        name: 'Task',
        component: <MlAppCalendarTaskAppointmentBasicInfo
          task={task}
          appointment={appointment} />,
        icon: <span className=""></span>
      },
      {
        name: 'Sessions',
        component: <MlAppCalendarTaskAppointmentSession
          task={task}
          appointment={appointment}/>,
        icon: <span className=""></span>
      },
      {
        name: 'Info',
        component: <MlAppCalendarTaskAppointmentTermAndCondition
          task={task}
          appointment={appointment}/>,
        icon: <span className=""></span>
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
    if (this.props.appointment.resourceId) {
      let task = await findTaskActionHandler(this.taskId, this.props.appointment.sessionId);
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
   * Method :: React render
   * Desc :: Showing html page
   * @returns {XML}
   */
  render() {
    const status = this.props.status;
    let appActionConfig = [];
    const that = this;
    switch (status) {
      case 'Pending':
        appActionConfig = [
          {
            showAction: true,
            actionName: 'accept',
            handler: async(event) => that.props.handler(that.updateAppointment.bind(this, 'Accepted'))
          },
          {
            showAction: true,
            actionName: 'reject',
            handler: async(event) => that.props.handler(that.updateAppointment.bind(this, 'Rejected'))
          }
        ];
        break;
      case 'Accepted':
        appActionConfig = [
          {
            showAction: true,
            actionName: 'complete',
            handler: async(event) => that.props.handler(that.updateAppointment.bind(this, 'Completed'))
          }
        ];
        break;
      case 'Rejected':
        appActionConfig = [
          {
            showAction: true,
            actionName: 'accept',
            handler: async(event) => that.props.handler(that.updateAppointment.bind(this, 'Accepted'))
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
          style: {'background': '#ef4647'},
          contentComponent: <MlAppActionComponent
            resourceDetails={{resourceId: 'internaltask', resourceType: 'internaltask'}}   //resource id need to be given
            actionOptions={appActionConfig}/>
        }]
    };
    return (
      <div className="col-lg-12">
        <div className="app_padding_wrap">
          <div className="clearfix"/>
          <div className="col-md-12">
            <div className='step-progress'>
              <div id="root">
                <StepZilla steps={this.setTaskSteps()}
                           stepsNavigation={true}
                           prevBtnOnLastStep={true}/>
              </div>
            </div>
          </div>
          {status !== 'Completed' &&
            <MlAccordion accordionOptions={genericPortfolioAccordionConfig} {...this.props} />
          }
        </div>
      </div>
    )
  }
};

export default MlAppCalendarTaskAppointment = formHandler()(MlAppCalendarTaskAppointment);
