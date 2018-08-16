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
import StepZilla from '../../../../../commons/components/stepzilla/StepZilla';
import MlAppOngoingMyAppointmentServiceBasicInfo from './MlAppOngoingMyAppointmentServiceBasicInfo';
import MlAppOngoingMyAppointmentSession from './MlAppOngoingMyAppointmentSession';
import MlAppOngoingMyAppointmentInfo from './MlAppOngoingMyAppointmentInfo';
import {fetchServiceByServiceId} from '../../actions/fetchOngoingAppointments';
import MlAccordion from "../../../../commons/components/MlAccordion";
import formHandler from "../../../../../commons/containers/MlFormHandler";
import MlAppActionComponent from "../../../../commons/components/MlAppActionComponent";
import {updateAppointmentActionHandler} from '../../actions/appointmentActionHandler';
import {fetchSlotAppointmentsDetailsActionHandler} from './../../actions/fetchSlotDetails';

class MlAppOngoingSelectedMyAppointment extends Component {

  /**
   * Constructor
   * @param props :: Object - Parents data
   */
  constructor(props) {
    super(props);
    this.state = {
      service: {},
      slotInfo:{
        attendeeDetails: []
      }
    };
    this.serviceId = this.props.appointment.resourceId;
    this.getServiceDetails = this.getServiceDetails.bind(this);
    this.setServiceSteps = this.setServiceSteps.bind(this);
    this.getSlotDetails = this.getSlotDetails.bind(this);
  }

  componentWillMount() {
    this.getServiceDetails();
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
   * Method :: setServiceSteps
   * Desc :: Sets components steps for stepzila to create and update service data
   */
  setServiceSteps() {
    const {appointment} = this.props;
    const {service, daysRemaining, slotInfo} = this.state;
    const steps = [
      {
        name: 'Services',
        component: <MlAppOngoingMyAppointmentServiceBasicInfo
          service={service}
          daysRemaining={daysRemaining}
          appointment={appointment} />,
        icon: <span className="ml fa fa-puzzle-piece"></span>
      },
      {
        name: 'Sessions',
        component: <MlAppOngoingMyAppointmentSession
          service={service}
          slotInfo={slotInfo}
          appointment={appointment}/>,
        icon: <span className="ml flaticon-ml-file-1"></span>
      },
      {
        name: 'Info',
        component: <MlAppOngoingMyAppointmentInfo
          service={service}
          appointment={appointment}/>,
        icon: <span className="ml my-ml-info"></span>
      }

    ];
    return steps;
  }

  /**
   * Method :: getServiceDetails
   * Desc   :: fetch the current service details from server and set in state
   * @returns Void
   */
  async getServiceDetails() {
    if (this.props.appointment.resourceId) {
      let service = await fetchServiceByServiceId(this.serviceId, this.props.appointment.sessionId);
      let validTillDate = Date.parse(service.validTill);
      let currentDate = new Date();
      let remainingDate = Math.floor((validTillDate - currentDate) / (1000 * 60 * 60 * 24));
      remainingDate = isNaN(remainingDate) ? '' : remainingDate;
      this.setState({
        service: service || {},
        daysRemaining: remainingDate
      });
    }
  }

  /**
   * Method :: getSlotInfo
   * Desc   :: fetch the current slot details from server and set in state
   * @returns Void
   */
  async getSlotDetails() {
    if ( this.props.appointment  && this.props.appointment.appointmentId) {
      let slotInfo = await fetchSlotAppointmentsDetailsActionHandler([this.props.appointment.appointmentId]);
      if(slotInfo && slotInfo[0]) {
        this.setState({
          slotInfo: slotInfo[0]
        });
      }
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
            handler: async(event) => that.props.handler(that.updateAppointment.bind(this, 'Accepted'))
          },
          {
            showAction: true,
            actionName: 'reject',
            handler: async(event) => that.props.handler(that.updateAppointment.bind(this, 'Rejected'))
          }
        ];
        break;
      case 'current':
        appActionConfig = [
          {
            showAction: true,
            actionName: 'complete',
            handler: async(event) => that.props.handler(that.updateAppointment.bind(this, 'Completed'))
          }
        ];
        break;
        case 'today':
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
            showAction: this.props.isCancelled || false,
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
            resourceDetails={{resourceId: 'servicetask', resourceType: 'servicetask'}}   //resource id need to be given
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
                <StepZilla steps={this.setServiceSteps()}
                           stepsNavigation={true}
                           showNavigation={false}
                           prevBtnOnLastStep={false}/>
              </div>
            </div>
          </div>
          {status !== 'completed' && !this.props.isCancelled &&
            <MlAccordion accordionOptions={genericPortfolioAccordionConfig} {...this.props} />
          }
        </div>
      </div>
    )
  }
};

export default MlAppOngoingSelectedMyAppointment = formHandler()(MlAppOngoingSelectedMyAppointment);
