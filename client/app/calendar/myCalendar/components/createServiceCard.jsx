/**
 * Parent component for service
 * @Author :: Mukhil P
 * @Dated :: 20/06/2017
 */

import {
  createServiceActionHandler,
  fetchServiceActionHandler,
  fetchProfileActionHandler,
  updateServiceActionHandler,
  fetchTasksAmountActionHandler,
  fetchTaskDetailsForServiceCard
} from '../../manageScheduler/service/actions/MlServiceActionHandler';
import { fetchTaskActionHandler } from './myTaskAppointments/actions/MlAppointmentActionHandler'
import Step2 from './Step2'
import MlAppActionComponent from "../../../commons/components/MlAppActionComponent";
import MlAccordion from "../../../commons/components/MlAccordion";
import formHandler from "../../../../commons/containers/MlFormHandler";

// import NPM module(s)
import React, {Component} from "react";
import Moment from "moment";
import _ from 'lodash';

// import custom method(s) and component(s)
import StepZilla from '../../../../commons/components/stepzilla/StepZilla';
import Step1 from './Step1';
import Step3 from './Step3'
import {servicesForAppointmentsActionHandler} from  '../../myAppointments/actions/fetchRequestedAppointments'
import CalenderHead from './calendarHead';
import MlAppTaskAppointmentBasicInfo from './MlAppTaskAppointmentBasicInfo';
import MlAppTaskAppointmentSessions from './MlAppTaskAppointmentSessions';
import MlAppTaskAppointmentTermAndCondition from './MlAppTaskAppointmentTermAndCondition';
import MlAppMyTaskAppointments from './myTaskAppointments/containers/MlAppMyTaskAppointments';
import { bookUserServiceCardAppointmentActionHandler } from '../../../calendar/myCalendar/actions/fetchMyCalendar'
class MlAppServiceManageSchedule extends Component {

  /**
   * Constructor
   * @param props :: Object - Parents data
   */
  constructor(props) {
    super(props);
    this.state = {
      isTaskComponent: false,
      serviceBasicInfo: {
        duration:{}
      },
      TaskDetails:[{}],
      activities: [],
      attachments: [],
      task:{},
      selectedTab:"",
      selectedSessionId: '',
      extraUsers:[]
    };
    this.onChangeSteps = this.onChangeSteps.bind(this);
    this.selectService.bind(this);
    this.setSessionId.bind(this);
    this.redirectWithCalendar = this.redirectWithCalendar.bind(this);
    this.saveAction.bind(this);
    this.bookServiceCard.bind(this);
    this.getSessionNumber  = this.getSessionNumber.bind(this);
    this.getTask = this.getTask.bind(this);
  }

  componentWillMount() {
    this.getServiceList()
  }

  getSessionNumber() {

  }

  async getServiceList() {
    const resp = await servicesForAppointmentsActionHandler();
    console.log(resp)
  }

  selectedServiceSeeker(seviceSeeker){
    this.setState({seviceSeeker});
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

  redirectWithCalendar(componentToLoad) {
    this.props.componentToLoad(componentToLoad);
  }

  /**
   * Method :: onChangeSteps
   * Desc :: Changed stepzila based on select service or task
   */
  onChangeSteps() {
    const {isTaskComponent} = this.state;
    this.setState({isTaskComponent: !isTaskComponent })
  }

  selectedService(response) {
    this.setState({serviceId: response})
    this.getServiceDetails(response)
  }

  async getServiceDetails(serviceId) {
    let {finalAmount, prevFinalAmount, serviceTask, tasks, serviceTermAndCondition, attachments, servicePayment, taxStatus, facilitationCharge} = this.state;
    if (serviceId) {
      let service = await fetchServiceActionHandler(serviceId);
      if (service) {
        console.log('service', service);
        let tasks = [];
        let currentDate = new Date()
        let expiryDate = Date.parse(service.validTill);
        let remainingDate = Math.floor((expiryDate - currentDate) / (1000 * 60 * 60 * 24));
        remainingDate = isNaN(remainingDate) ? '' : remainingDate;
        let duration = {
          hours: service.duration.hours,
          minutes: service.duration.minutes
        }
        let serviceInfo = {
          duration: duration,
          name: service.name,
          noOfSession: service.noOfSession,
          sessionFrequency: service.sessionFrequency,
          status: service.status,
          validTill: service.validTill,
          daysToExpire: remainingDate,
          totalAmount: service.finalAmount
        };

        if (service.termsAndCondition) {
           var TermAndCondition = _.omit(service.termsAndCondition, '__typename');
        }

        // if(service.attachments) {
        //     var attachmentDetails = _.omit(service.attachments, '__typename');
        // }

        this.setState({
          serviceBasicInfo: serviceInfo,
          serviceTermAndCondition: TermAndCondition,
          //attachments: attachmentDetails,
          serviceTask: service.tasks ? service.tasks : []
        })
      }
    }
    this.getTaskDetails()
  }


  async getTaskDetails() {
    let orderId = this.state.details && this.state.details.orderId ? this.state.details.orderId : '';
    const resp = await fetchTaskDetailsForServiceCard(this.state.profileId, this.state.serviceId, orderId);
    if(resp){
      let task = this.state.serviceTask.map(function (data) {
        let taskInfo = resp.find(function (respTask) {
          return respTask.id == data.id;
        });
        return taskInfo;
      });
      let attachmentDetails = [];
      let activities = [];
      if (task && task.length > 0) {
        task.forEach((taskData) => {
          if (taskData.attachments && taskData.attachments.length > 0) {
            taskData.attachments.forEach((attachment) => {
              attachmentDetails.push(attachment)
            });
          }
          if (taskData.session && taskData.session.length > 0) {
            taskData.session.forEach((session) => {
              if (session.activities && session.activities.length > 0) {
                session.activities.forEach((activity) => {
                  let deliverables = [];
                  if (activity.deliverable && activity.deliverable.length > 0) {
                    activity.deliverable.forEach((deliverable) => {
                      deliverables.push(deliverable)
                    });
                  }
                  activities.push({name: activity.name, id: activity.id, deliverables: deliverables});
                });
              }
            });
          }
        });
      }
      console.log('task',task);
      this.setState({
        TaskDetails: task,
        attachments: attachmentDetails,
        activities: activities
      });
    }

  }

  selectService(taskId) {
    this.getTask(taskId)
  }

  getTask(taskId) {
    console.log('taskId', taskId);
    console.log(this.state.TaskDetails, 'TaskDetails');
    const resp =  this.state.TaskDetails.find( (task) => task.id == taskId );  //await fetchTaskActionHandler(taskId)
    this.setState({task: resp, selectedTab: taskId})
  }

  bookDetails(response) {
    this.setState({details: response})
  }

  async saveAction(response) {
    this.setState({response: response})

  }

  setSessionId(sessionId) {
    this.setState({selectedSessionId: sessionId});
  }

  addExtraUsers(user){
    let extraUsers = this.state.extraUsers ? this.state.extraUsers : [] ;
    extraUsers.push(user);
    this.setState({
      extraUsers: extraUsers
    });
  }

  async bookServiceCard() {
    let data = this.state.response;
    data.extraUsers = this.state.extraUsers;
    const resp = await bookUserServiceCardAppointmentActionHandler(data);
    if (resp.code === 200) {
      toastr.success(resp.result);
      this.redirectWithCalendar('calendar');
    }else {
      toastr.error(resp.result)
    }
  }

  async bookActionHandler(){
    switch(this.state.currentComponent) {
      case 'BasicInfo':
        let firstStep = this.state.details;
        if (firstStep && this.state.serviceId) {
          this.bookServiceCard();
        } else {
          toastr.error('Please select a service seeker');
        }
        break;
      case 'SessionDetails':
        if (this.state.selectedSessionId) {
          this.bookServiceCard();
        } else {
          toastr.error('Please select a session');
        }
        break;
      case 'termAndCondition':
        if (this.state.selectedSessionId) {
          this.bookServiceCard();
        } else {
          toastr.error('Please select a session');
        }
        break;
      default:
      // do nothing
    }
  }

 async  saveActionHandler() {
    switch(this.state.currentComponent) {
      case 'BasicInfo':
        let firstStep = this.state.details;
        if (firstStep && this.state.serviceId) {
          toastr.success("'Service card' saved successfully")
        } else {
          toastr.error('Please select a service seeker');
        }
        break;
      case 'SessionDetails':
        if (this.state.selectedSessionId) {
          // this.bookServiceCard();
          toastr.success("'Session details' saved successfully")
        } else {
          toastr.error('Please select a session');
        }
        break;
      case 'termAndCondition':
        if (this.state.selectedSessionId) {
          toastr.success("'Terms and Conditions' saved successfully")
        } else {
          toastr.error('Please select a session');
        }
        break;
      default:
        // do nothing
    }
  }

  activeComponent(Component) {
    this.setState({currentComponent: Component})
  }


  /**
   * Method :: setServiceSteps
   * Desc :: Sets components steps for stepzila to create and update service data
   */
  setServiceSteps() {
    const {
      serviceBasicInfo,
      isTaskComponent
    } = this.state;
    let steps = [
      {
        name: 'View',
        component: <Step1
          profileId={this.props.profileId}
          serviceId={this.state.serviceId}
          isTaskComponent={isTaskComponent}
          bookDetails={this.bookDetails.bind(this)}
          onChangeSteps={this.onChangeSteps}
          selectedService={this.selectedService.bind(this)}
          selectedServiceSeeker={this.selectedServiceSeeker.bind(this)}
          seviceSeeker={this.state.seviceSeeker||''}
          setSessionId={this.setSessionId.bind(this)}
          serviceBasicInfo={serviceBasicInfo}
          appointmentDate={this.props.appointmentDate}
          activeComponent={this.activeComponent.bind(this)}
        />,
        icon: <span className="ml my-ml-add_tasks"></span>
      },
      {
        name:'Tasks',
        component: <Step2
          taskDetails={this.state.TaskDetails}
          selectService={this.selectService.bind(this)}
          task={this.state.task}
          serviceTask={this.state.serviceTask}
          selectedTab={this.state.selectedTab}
          details={this.state.details}
          setSessionId={this.setSessionId.bind(this)}
          saveAction={this.saveAction.bind(this)}
          activeComponent={this.activeComponent.bind(this)}
          redirectWithCalendar={this.redirectWithCalendar}
          addExtraUsers={this.addExtraUsers.bind(this)}
          getSessionNumber={this.getSessionNumber.bind(this)}
        />,
        icon: <span className="ml fa fa-users"></span>
      },
      {
        name: 'Terms & Conditions',
        component: <Step3
          serviceTermAndCondition={this.state.serviceTermAndCondition}
          taskDetails={this.state.TaskDetails}
          attachments={this.state.attachments}
          activeComponent={this.activeComponent.bind(this)}
          activities={this.state.activities}
        />,
        icon: <span className="ml ml-payments"></span>
      },
    ];
    return steps;
  }


  /**
   * Method :: React render
   * Desc :: Showing html page
   * @returns {XML}
   */
  render() {

    let _this = this;
    let appActionConfig = [
      {
        showAction: this.state.selectedSessionId?true:false,
        actionName: 'book',
        handler: async(event) => _this.props.handler(_this.bookActionHandler.bind(this))
      },
      {
        showAction: true,
        actionName: 'save',
        handler: async(event) => _this.props.handler(_this.saveActionHandler.bind(this))
      },
      {
        showAction: true,
        actionName: 'exit',
        handler: async(event) => this.redirectWithCalendar('calendar')
          // FlowRouter.go('/app/calendar/manageSchedule/' + _this.profileId + '/serviceList')
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
            resourceDetails={{resourceId: 'service', resourceType: 'service'}}   //resource id need to be given
            actionOptions={appActionConfig}/>
        }]
    };
    const {appointmentDate, profileId} = this.props;
    const {isTaskComponent} = this.state;
    return (
      <div className="col-lg-12">
        <div className="app_padding_wrap">
          <div className="clearfix"/>
          <div className="">
            <div className='step-progress'>
              <div id="root">
                {!isTaskComponent ?
                  <div>
                  <StepZilla steps={this.setServiceSteps()}
                             stepsNavigation={true}
                             prevBtnOnLastStep={true}
                             showNavigation={false}/>
                    <MlAccordion accordionOptions={genericPortfolioAccordionConfig} {...this.props} />
                  </div>

                  :
                  <MlAppMyTaskAppointments isTaskComponent={isTaskComponent}
                                           appointmentDate={appointmentDate}
                                           redirectWithCalendar={this.redirectWithCalendar}
                                           onChangeSteps={this.onChangeSteps}
                                           profileId={profileId}
                  />
                }

              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
};

export default MlAppServiceManageSchedule = formHandler()(MlAppServiceManageSchedule);
