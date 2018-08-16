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
import MlAppCalendarServiceAppointmentServiceBasicInfo from './MlAppCalendarServiceAppointmentServiceBasicInfo';
import MlAppCalendarServiceAppointmentSession from './MlAppCalendarServiceAppointmentSession';
import MlAppCalendarServiceAppointmentInfo from './MlAppCalendarServiceAppointmentInfo';
import {fetchServiceByServiceId} from '../../../myAppointments/actions/fetchOngoingAppointments';
import MlAccordion from "../../../../commons/components/MlAccordion";
import formHandler from "../../../../../commons/containers/MlFormHandler";
import MlAppActionComponent from "../../../../commons/components/MlAppActionComponent";
import {updateAppointmentActionHandler} from '../../actions/appointmentActionHandler';

class MlAppCalendarServiceAppointment extends Component {

  /**
   * Constructor
   * @param props :: Object - Parents data
   */
  constructor(props) {
    super(props);
    this.state = {
      service: {}
    };
    this.serviceId = this.props.appointment.resourceId;
    this.getServiceDetails = this.getServiceDetails.bind(this);
    this.setServiceSteps = this.setServiceSteps.bind(this);
  }

  componentWillMount() {
    this.getServiceDetails();
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
    const {service, daysRemaining} = this.state;
    const steps = [
      {
        name: 'Services',
        component: <MlAppCalendarServiceAppointmentServiceBasicInfo
          service={service}
          daysRemaining={daysRemaining}
          appointment={appointment} />,
        icon: <span className="ml fa fa-puzzle-piece"></span>
      },
      {
        name: 'Sessions',
        component: <MlAppCalendarServiceAppointmentSession
          service={service}
          appointment={appointment}/>,
        icon: <span className="ml flaticon-ml-file-1"></span>
      },
      {
        name: 'Info',
        component: <MlAppCalendarServiceAppointmentInfo
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

export default MlAppCalendarServiceAppointment = formHandler()(MlAppCalendarServiceAppointment);
