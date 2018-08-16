/**
 * Parent component for service
 * @Author :: Mukhil P
 * @Dated :: 20/06/2017
 */

// import NPM module(s)
import React, { Component } from "react";
import Moment from "moment";
import _ from 'lodash';

// import custom method(s) and component(s)
import MlAppScheduleHead from '../../commons/components/MlAppScheduleHead';
import StepZilla from '../../../../../commons/components/stepzilla/StepZilla';
import MlAppServiceBasicInfo from './MlAppServiceBasicInfo';
import MlAppServiceSelectTask from './MlAppServiceSelectTask';
import MlAppServiceTermsAndConditions from './MlAppServiceTermsAndConditions';
import MlAppServicePayment from './MlAppServicePayment';
import MlAppServiceHistory from "./MlAppServiceHistory";
import MlAppActionComponent from "../../../../commons/components/MlAppActionComponent";
import MlAccordion from "../../../../commons/components/MlAccordion";
import formHandler from "../../../../../commons/containers/MlFormHandler";
import { initalizeFloatLabel } from '../../../../../commons/utils/formElemUtil';
import {appClient} from '../../../../core/appConnection';
import {
  createServiceActionHandler,
  fetchServiceActionHandler,
  fetchProfileActionHandler,
  updateServiceActionHandler,
  fetchTasksAmountActionHandler,
  updateGoLiveServiceActionHandler,
  fetchTaskDetailsForServiceCard,
  updateReviewServiceActionHandler,
  cloneServiceCardActionHandler
} from '../actions/MlServiceActionHandler';
import { fetchTaskDetailsActionHandler } from '../../task/actions/fetchTaskDetails';

class MlAppServiceManageSchedule extends Component {

  /**
   * Constructor
   * @param props :: Object - Parents data
   */
  constructor(props) {
    super(props);
    this.state = {
      serviceBasicInfo: {
        duration: {}
      },
      finalAmount: 0,
      prevFinalAmount: 0,
      serviceTask: {
        selectedTaskDetails: {
          displayName: '',
          noOfSession: '',
          sessionFrequency: '',
          duration: {
            hours: 0,
            minutes: 0
          }
        }
      },
      service: {},
      serviceTermAndCondition: {},
      attachments: [],
      servicePayment: {},
      currencySymbol:"",
      isRedirect: false,
      facilitationCharge: {},
      tasks: [],
      taxStatus: 'taxexclusive',
      clusterData: {},userId:"", profileId:""
    };
    this.options = [
      { value: 'Onetime', label: 'One Time' },
      { value: 'Daily', label: 'Daily' },
      { value: 'Weekly', label: 'Weekly' },
      { value: 'Monthly', label: 'Monthly' },
      { value: 'Quarterly', label: 'Quarterly' },
      { value: 'Yearly', label: 'Yearly' },
    ];
    this.profileId = this.props.profileId ? this.props.profileId : FlowRouter.getParam('profileId');
    this.serviceId = this.props.serviceId ? this.props.serviceId : FlowRouter.getQueryParam('id');
    this.getServiceDetails = this.getServiceDetails.bind(this);
    this.saveService = this.saveService.bind(this);
    this.onChangeFormField = this.onChangeFormField.bind(this);
    this.checkBoxHandler = this.checkBoxHandler.bind(this);
    this.validTill = this.validTill.bind(this);
    this.setSessionFrequency = this.setSessionFrequency.bind(this);
    this.optionsBySelectstates = this.optionsBySelectstates.bind(this);
    this.optionsBySelectChapters = this.optionsBySelectChapters.bind(this);
    this.optionsBySelectCommunities = this.optionsBySelectCommunities.bind(this);
    this.optionsBySelectService = this.optionsBySelectService.bind(this);
    this.updateSessionSequence = this.updateSessionSequence.bind(this);
    this.onChangeCheckBox = this.onChangeCheckBox.bind(this);
    this.onChangeValue = this.onChangeValue.bind(this);
    this.checkDiscountEligibility = this.checkDiscountEligibility.bind(this);
    this.calculateDiscounts = this.calculateDiscounts.bind(this);
    this.checkTaxStatus = this.checkTaxStatus.bind(this);
    this.checkPromoStatus = this.checkPromoStatus.bind(this);
    this.checkApprovalRequiredFromSeeker = this.checkApprovalRequiredFromSeeker.bind(this);
    this.checkDiscountStatus = this.checkDiscountStatus.bind(this);
    this.deleteSelectedTask = this.deleteSelectedTask.bind(this);
    this.getRedirectServiceList = this.getRedirectServiceList.bind(this);
    this.cloneServiceCard = this.cloneServiceCard.bind(this);
    this.setServiceExpiry = this.setServiceExpiry.bind(this);
    this.activateComponent = this.activateComponent.bind(this);
  }

  componentWillMount() {
    this.getUserProfile();
    this.getTaskDetailsForService();
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

  componentWillUpdate() {
    initalizeFloatLabel();
  }

  /**
   * Method :: getRedirectServiceList
   * Desc :: Set the redirect with service list component
   */
  getRedirectServiceList(isRedirect) {
    this.setState({ isRedirect: isRedirect });
  }

  activateComponent(index) {
    this.setState({
      currentComponent: index
    })
  }
  /**
   * Method :: setServiceSteps
   * Desc :: Sets components steps for stepzila to create and update service data
   */
  setServiceSteps() {
    let canStatusChange = (this.state.serviceBasicInfo.isLive || this.state.serviceBasicInfo.isApproved ) && FlowRouter.getQueryParam("id")  ;
    const {
      serviceBasicInfo,
      daysRemaining,
      clusterCode,
      clusters,
      clusterName,
      serviceTermAndCondition,
      attachments,
      servicePayment,
      facilitationCharge,
      taxStatus,
      serviceTask,
      finalAmount,
      prevFinalAmount
    } = this.state;
    let steps = [
      {
        name: !this.props.viewMode ? 'Create' : 'View',
        component: <MlAppServiceBasicInfo data={serviceBasicInfo}
          clusterCode={clusterCode}
          clusterName={clusterName}
          clusters={clusters}
          activateComponent={this.activateComponent}
          getRedirectServiceList={this.getRedirectServiceList}
          clusterData={this.state.clusterData}
          daysRemaining={daysRemaining}
          optionsBySelectstates={this.optionsBySelectstates}
          optionsBySelectChapters={this.optionsBySelectChapters}
          optionsBySelectCommunities={this.optionsBySelectCommunities}
          getServiceDetails={this.getServiceDetails}
          options={this.options}
          checkBoxHandler={this.checkBoxHandler}
          validTill={this.validTill}
          viewMode={this.props.viewMode || (this.state.serviceBasicInfo && (this.state.serviceBasicInfo.isLive  || this.state.serviceBasicInfo.isApproved || this.state.serviceBasicInfo.isReview ))}
          canStatusChange={ canStatusChange }
          setSessionFrequency={this.setSessionFrequency}
          onChangeFormField={this.onChangeFormField}
          setServiceExpiry={this.setServiceExpiry} />,

        icon: <span className="ml my-ml-add_tasks"></span>
      },
      {
        name: !this.props.viewMode ? 'Select Tasks' : 'Tasks',
        component: <MlAppServiceSelectTask serviceTask={serviceTask}
          profileId={this.profileId}
          serviceId={this.serviceId}
          activateComponent={this.activateComponent}
          getRedirectServiceList={this.getRedirectServiceList}
          deleteSelectedTask={this.deleteSelectedTask}
          getServiceDetails={this.getServiceDetails}
          viewMode={this.props.viewMode || (this.state.serviceBasicInfo && (this.state.serviceBasicInfo.isLive  || this.state.serviceBasicInfo.isApproved || this.state.serviceBasicInfo.isReview ))}
          saveService={this.saveService}
          selectedTaskId={serviceTask.selectedTaskId}
          optionsBySelectService={this.optionsBySelectService}
          updateSessionSequence={this.updateSessionSequence}
        />,
        icon: <span className="ml fa fa-users"></span>
      },
      {
        name: 'Terms & Conditions',
        component: <MlAppServiceTermsAndConditions serviceTermAndCondition={serviceTermAndCondition}
          attachments={attachments}
          viewMode={this.props.viewMode || (this.state.serviceBasicInfo && (this.state.serviceBasicInfo.isLive  || this.state.serviceBasicInfo.isApproved || this.state.serviceBasicInfo.isReview ))}
          activateComponent={this.activateComponent}
          getRedirectServiceList={this.getRedirectServiceList}
          onChangeCheckBox={this.onChangeCheckBox}
          onChangeValue={this.onChangeValue}
          getServiceDetails={this.getServiceDetails} />,
        icon: <span className="ml ml-payments"></span>
      },
      {
        name: 'Payment',
        component: <MlAppServicePayment servicePayment={servicePayment}
          taxStatus={taxStatus} currencySymbol={this.state.currencySymbol}
          finalAmount={finalAmount} currencyType={this.currencyType.bind(this)}
          prevFinalAmount={prevFinalAmount} client={appClient}
          viewMode={this.props.viewMode || (this.state.serviceBasicInfo && (this.state.serviceBasicInfo.isLive  || this.state.serviceBasicInfo.isReview ))}
          activateComponent={this.activateComponent}
          getRedirectServiceList={this.getRedirectServiceList}
          getServiceDetails={this.getServiceDetails}
          facilitationCharge={facilitationCharge}
          checkDiscountEligibility={this.checkDiscountEligibility}
          calculateDiscounts={this.calculateDiscounts}
          checkTaxStatus={this.checkTaxStatus}
          checkPromoStatus={this.checkPromoStatus}
          checkApprovalRequiredFromSeeker={this.checkApprovalRequiredFromSeeker}
          checkDiscountStatus={this.checkDiscountStatus}
          bookService={this.props.bookService}
          canStatusChange={ canStatusChange }
          serviceId={this.props.serviceId} />,

        icon: <span className="ml ml-payments"></span>
      },

    ];
    return steps;
  }

  /**
   * Delete the selected task
   * @param taskId :: String
   */
  async deleteSelectedTask(taskId) {
    let { serviceTask, tasks } = this.state;
    let services = { tasks: [] };
    if (taskId) {
      serviceTask.tasks.map((taskInfo) => {
        if (taskInfo.id !== taskId) {
          let sessionDetails = [];
          let serviceDetails = tasks && tasks.filter((taskData) => {
            return taskInfo.id === taskData.id
          });
          let isServiceDetails = false;
          if (serviceDetails && serviceDetails.length > 0) {
            isServiceDetails = true
          }
          if (taskInfo.session && taskInfo.session.length > 0 && isServiceDetails) {
            taskInfo.session.forEach((session, index) => {
              let seqData = '';
              if (isServiceDetails && serviceDetails[0]['sessions'] && serviceDetails[0]['sessions'].length > 0) {
                seqData = serviceDetails[0]['sessions'][index].sequence;
              }
              sessionDetails.push({ id: session.sessionId, sequence: session.sequence || seqData })
            });
            let task = {
              id: taskInfo.id,
              sequence: taskInfo.sequence || serviceDetails[0].sequence,
              sessions: sessionDetails
            };
            services.tasks.push(task);
          }
        }
      });
      serviceTask.selectedTaskId = '';
      this.setState({
        tasks: tasks,
        serviceTask: serviceTask
      });
      const resp = await updateServiceActionHandler(this.serviceId, services);
      this.getServiceDetails();
      this.optionsBySelectService();
      this.showResponseMsg(resp, 'Task deleted Successfully');
    } else {
      toastr.error('Please select a task to delete');
      return;
    }
  }
  /**
   * Method :: getTaskDetailsForService
   * Desc :: Get the tasks for service card eligibility
   */
  async getTaskDetailsForService() {
    let { serviceTask } = this.state;
    if (this.profileId) {
      let resp;
      if (this.props.viewMode) {
        resp = await fetchTaskDetailsForServiceCard('', this.serviceId);
      } else {
        resp = await fetchTaskDetailsForServiceCard(this.profileId, this.serviceId);
      }
      serviceTask.serviceTaskDetails = resp;
      this.setState({ serviceTask: serviceTask })
    }
  }

  /**
   * Method :: optionsBySelectService
   * Desc :: Set the current selected task and tab
   */
  optionsBySelectService(taskId) {
    let { serviceTask, service, tasks } = this.state;
    let task, sequence;
    let session = [];
    if (taskId) {
      serviceTask.selectedTaskId = taskId;
      //console.log(service, serviceTask);
      let selectedTaskDetails = serviceTask.serviceTaskDetails.filter((task) => {
        return task.id === taskId
      });
      selectedTaskDetails = selectedTaskDetails[0];
      if (tasks && tasks.length) {
        task = tasks.filter((task) => {
          return task.id === taskId;
        });
        if (task && task.length > 0) {
          sequence = task[0].sequence;
          task[0].sessions.map((session, index) => {
            selectedTaskDetails.session[index]['sequence'] = selectedTaskDetails.session[index].sequence || _.cloneDeep(session.sequence);
          });
        }
      }
      serviceTask.selectedTaskDetails = {
        id: selectedTaskDetails.id,
        sequence: selectedTaskDetails.sequence || sequence,
        displayName: selectedTaskDetails.displayName || '',
        noOfSession: selectedTaskDetails.noOfSession || '',
        sessionFrequency: selectedTaskDetails.sessionFrequency || '',
        duration: selectedTaskDetails.duration || {},
        session: selectedTaskDetails.session || []
      };
    } else {
      serviceTask.selectedTaskDetails = {
        id: '',
        sequence: '',
        displayName: '',
        noOfSession: '',
        sessionFrequency: '',
        duration: { hours: '', minutes: '' },
        session: []
      };
      serviceTask.selectedTaskId = '';
    }
    this.setState({
      serviceTask: serviceTask
    });
  }

  /**
   * Method :: updateSessionSequence
   * Desc :: Update the session sequence of task
   */
  updateSessionSequence(evt, sessionId) {
    let { selectedTaskId, serviceTaskDetails, selectedTaskDetails } = this.state.serviceTask;
    if (evt.target.id === 'tasksequence') {
      selectedTaskDetails.sequence = evt.target.value;
    } else {
      let sessionIndex = selectedTaskDetails.session.findIndex((session) => {
        return session.sessionId === sessionId;
      });
      if (sessionIndex !== -1) {
        let sessionDetails = _.cloneDeep(selectedTaskDetails.session);
        sessionDetails[sessionIndex]['sequence'] = evt.target.value;
        selectedTaskDetails.session = sessionDetails;
      }
    }
    this.setState({ selectedTaskDetails: selectedTaskDetails });
  }

  /**
   * Method :: getServiceDetails
   * Desc   :: fetch the current service details from server and set in state
   * @returns Void
   */
  async getServiceDetails() {
    let { serviceBasicInfo, finalAmount, prevFinalAmount, clusterData, serviceTask, service, tasks, serviceTermAndCondition, attachments, servicePayment, taxStatus, facilitationCharge } = this.state;
    if (this.serviceId) {
      service = await fetchServiceActionHandler(this.serviceId);
      if (service) {
        tasks = [];
        let { state, city, community } = service;
        serviceBasicInfo = {
          duration: service.duration,
          profileId: service.profileId,
          name: service.name,
          displayName: service.displayName,
          noOfSession: service.noOfSession,
          sessionFrequency: service.sessionFrequency,
          isActive: service.isActive,
          validTill: service.validTill,
          cluster: service.cluster,
          isBeSpoke: service.isBeSpoke,
          isApproved: service.isApproved,
          isReview: service.isReview,
          isLive: service.isLive,
          city: service.city,
          state: service.state,
          serviceExpiry: service.serviceExpiry,
          community: service.community
        };
        finalAmount = service.finalAmount;
        prevFinalAmount = service.finalAmount;
        tasks = _.cloneDeep(service.tasks) || [];
        tasks.sessions = _.cloneDeep(service.tasks.sessions) || [];
        serviceTask.serviceOptionTasks = [];
        let attachmentDetails = [];
        serviceTask.tasks = service.tasks || [];
        if (serviceTask.serviceTaskDetails && serviceTask.serviceTaskDetails.length > 0) {
          serviceTask.tasks = _.intersectionBy(serviceTask.serviceTaskDetails, service.tasks, 'id');
          serviceTask.serviceTaskDetails.forEach((task, key) => {
            if (service.tasks.map((data) => data.id).indexOf(task.id) === -1) {
              serviceTask.serviceOptionTasks.push(task);
            }
          });
          serviceTask.tasks.forEach((task) => {
            if (task.attachments && task.attachments.length > 0) {
              task.attachments.forEach((attachment) => {
                attachmentDetails.push(attachment)
              });
            }
          });
        }
        if (service.termsAndCondition) {
          serviceTermAndCondition = _.omit(service.termsAndCondition, '__typename');
        }
        if (service.facilitationCharge) {
          facilitationCharge = _.cloneDeep(service.facilitationCharge);
        }
        if (service.payment) {
          servicePayment = _.cloneDeep(service.payment);
          servicePayment.isTaxInclusive = servicePayment.isTaxInclusive ? true : false;
          taxStatus = servicePayment.isTaxInclusive ? 'taxinclusive' : 'taxexclusive';
        }
        attachments = _.cloneDeep(attachmentDetails);
        if (state && state.length > 0) {
          let states = [];
          state.forEach((data) => {
            states.push(data.id);
          });
          clusterData.state = states;
        }
        if (city && city.length > 0) {
          let cities = [];
          city.forEach((data) => {
            cities.push(data.id);
          });
          clusterData.chapters = cities;
        }
        if (community && community.length > 0) {
          let communities = [];
          community.forEach((data) => {
            communities.push(data.id);
          });
          clusterData.community = communities;
        }
      }
      this.props.serviceId ? this.props.serviceInfo(service) : "";
    }
    var validTillDate = Date.parse(serviceBasicInfo.validTill);
    var currentDate = new Date();
    let remainingDate = Math.floor((validTillDate - currentDate) / (1000 * 60 * 60 * 24));
    remainingDate = isNaN(remainingDate) ? '' : remainingDate;
    this.setState({
      serviceBasicInfo: serviceBasicInfo,
      daysRemaining: remainingDate,
      clusterData: clusterData,
      serviceTask: serviceTask,
      serviceTermAndCondition: serviceTermAndCondition,
      attachments: attachments,
      service: service,
      tasks: tasks,
      facilitationCharge: facilitationCharge,
      servicePayment: servicePayment,
      taxStatus: taxStatus,
      finalAmount: finalAmount,
      prevFinalAmount: prevFinalAmount
    }, () => {
      this.getUserProfile()

    });
  }

  /**
   * Method :: getUserProfile
   * Desc :: Get the current user profile
   */
  async getUserProfile() {
    const resp = await fetchProfileActionHandler(this.profileId);
    if (resp) {
      this.setState({
        clusters: resp.clusterId,
        clusterName: resp.clusterName,
        clusterCode: resp.countryId
      });
    }
  }

  /**
   * Method :: showResponseMsg
   * Desc :: Show to error(s) or success(es) msg
   * @param response :: server response
   */
  showResponseMsg(response, msg) {
    if (response.success) {
      toastr.success(msg);
    } else {
      toastr.error(response.result);
    }
  }

  /**
   * Method :: onChangeCheckBox
   * Desc :: Set the boolean value
   */
  onChangeCheckBox(event) {
    let { serviceTermAndCondition } = this.state;
    if (event.target.id === 'schedulable') {
      serviceTermAndCondition.isReschedulable = !event.target.checked;
    } else {
      serviceTermAndCondition.isCancelable = !event.target.checked;
    }
    this.setState({ serviceTermAndCondition: serviceTermAndCondition });
  }

  /**
   * Method :: onChangeValue
   * Desc :: Sets the current value in term and condition
   */
  onChangeValue(event) {
    let { serviceTermAndCondition } = this.state;
    let { id, value } = event.target;
    if (isNaN(value)) {
      toastr.error('Please enter a valid number');
    } else if (event.target.id === 'rescheduler') {
      serviceTermAndCondition.noOfReschedulable = value;
    } else {
      serviceTermAndCondition.noOfDaysBeforeCancelation = value;
    }
    this.setState({ serviceTermAndCondition: serviceTermAndCondition });
  }

  isDataValid(serviceBasicInfo) {
    if (this.state.currentComponent === 0) {
      if (!serviceBasicInfo.name) {
        toastr.error('Service name is mandatory');
        return false;
      }
      if (!serviceBasicInfo.displayName) {
        toastr.error('Display name is mandatory');
        return false;
      }
      if (!serviceBasicInfo.validTill) {
        toastr.error('Valid till is mandatory');
        return false;
      }
      if (!(serviceBasicInfo.state && serviceBasicInfo.state.length)) {
        toastr.error('State is mandatory');
        return false;
      }
      if(!serviceBasicInfo.sessionFrequency) {
        toastr.error('Session Frequency is mandatory');
        return false;
      }
      if (!serviceBasicInfo.chapters) {
        if (!(serviceBasicInfo.city && serviceBasicInfo.city.length)) {
          toastr.error('City is mandatory');
          return false;
        }
      } else if (!(serviceBasicInfo.chapters && serviceBasicInfo.chapters.length)) {
        toastr.error('City is mandatory');
        return false;
      }
      if (!(serviceBasicInfo.community && serviceBasicInfo.community.length)) {
        toastr.error('Community is mandatory');
        return false;
      }
    }
    return true;
  }

  /**
   * Method :: saveService
   * Desc   :: Save service data on server
   * @param data :: Object :: Service data
   * @returns Void
   */
  async saveService() {
    let { clusters, isRedirect, tasks, finalAmount, prevFinalAmount, clusterName, chapterName, stateName, communitiesName, serviceBasicInfo, serviceTask, service, serviceTermAndCondition, servicePayment, facilitationCharge } = this.state;
    let isError = false;
    if (servicePayment.isDiscount && isRedirect) {
      this.errorMsg = '';
      this.paymentValidate();
      if (this.errorMsg) {
        return false;
      }
    }
    if (!this.isDataValid(this.state.serviceBasicInfo)) {
      return false;
    }
    // Check validation for a number in service Term And Condition
    if ((serviceTermAndCondition.noOfReschedulable && isNaN(serviceTermAndCondition.noOfReschedulable)) ||
      (serviceTermAndCondition.noOfDaysBeforeCancelation && isNaN(serviceTermAndCondition.noOfDaysBeforeCancelation))) {
      toastr.error('Please enter a valid number');
      return false;
    }

    // Service basic info construct
    if (chapterName) {
      let cities = [];
      chapterName.map((data) => {
        cities.push({ id: data.value, name: data.label })
      });
      serviceBasicInfo.city = cities;
    }

    if (stateName) {
      let states = [];
      stateName.map((data) => {
        states.push({ id: data.value, name: data.label })
      });
      serviceBasicInfo.state = states;
    }

    if (communitiesName) {
      let communities = [];
      communitiesName.map((data) => {
        communities.push({ id: data.value, name: data.label })
      });
      serviceBasicInfo.community = communities;
    }
    let services = {
      userId: '',
      profileId: this.profileId,
      name: serviceBasicInfo.name,
      displayName: serviceBasicInfo.displayName,
      noOfSession: serviceBasicInfo.noOfSession,
      sessionFrequency: serviceBasicInfo.sessionFrequency,
      duration: {
        hours: serviceBasicInfo.duration.hours,
        minutes: serviceBasicInfo.duration.minutes
      },
      serviceExpiry: serviceBasicInfo.serviceExpiry,
      isActive: serviceBasicInfo.isActive,
      validTill: serviceBasicInfo.validTill ? new Moment(serviceBasicInfo.validTill).format(Meteor.settings.public.dateFormat) : null,
      city: serviceBasicInfo.city,
      cluster: {
        id: clusters,
        name: clusterName
      },
      state: serviceBasicInfo.state,
      community: serviceBasicInfo.community
    };

    // Service selected task construct
    if (serviceTask.selectedTaskDetails && serviceTask.selectedTaskId && !isRedirect) {
      let sessions = [];
      let serviceDetails = service.tasks && service.tasks.filter((task) => {
        return task.id === serviceTask.selectedTaskId
      });
      let taskSequence;
      if (serviceTask.selectedTaskDetails.session && serviceTask.selectedTaskDetails.session.length > 0) {
        if (!serviceTask.selectedTaskDetails.sequence) {
          toastr.error('Task sequence is required');
          isError = true;
          return false;
        }
        if (serviceDetails && serviceDetails.length > 0) {
          taskSequence = serviceDetails[0].sequence;
        }
        serviceTask.selectedTaskDetails.session.forEach((session, index) => {
          let seqData = '';
          if (taskSequence) {
            seqData = serviceDetails[0]['sessions'][index].sequence;
          }
          if (!session.sequence) {
            isError = true;
            return false;
          }
          sessions.push({ id: session.sessionId, sequence: (session.sequence || seqData), isOffline: session.isOffline || false })
        });
        if (isError) {
          toastr.error('Session sequence is required');
        } else {
          if (sessions && sessions.length > 0) {
            let sequenceArr = sessions.map((session) => { return session.sequence });
            let isDuplicate = sequenceArr.some((sequence, index) => {
              return sequenceArr.indexOf(sequence) !== index
            });
            if (isDuplicate) {
              toastr.error('Session sequence can not be duplicated');
              isError = true;
              return false;
            }
          }
        }
      } else {
        toastr.error('Task is required to save');
        isError = true;
        return false;
      }
      if (isError) {
        return false;
      }
      services.tasks = [];
      let task = {
        id: serviceTask.selectedTaskDetails.id,
        sequence: serviceTask.selectedTaskDetails.sequence || taskSequence,
        sessions: sessions
      };
      services.tasks.push(task);
      tasks = [];
      tasks.push(task);
      serviceTask.tasks.map((taskInfo) => {
        if (taskInfo.id !== serviceTask.selectedTaskId) {
          let sessionDetails = [];
          let serviceDetails = service.tasks && service.tasks.filter((taskData) => {
            return taskInfo.id === taskData.id
          });
          let isServiceDetails = false;
          if (serviceDetails && serviceDetails.length > 0) {
            isServiceDetails = true
          }
          if (taskInfo.session && taskInfo.session.length > 0) {
            taskInfo.session.forEach((session, index) => {
              let seqData = '';
              if (isServiceDetails) {
                seqData = serviceDetails[0]['sessions'][index] && serviceDetails[0]['sessions'][index].sequence;
              }
              sessionDetails.push({ id: session.sessionId, sequence: session.sequence || seqData })
            });
          }
          let task = {
            id: taskInfo.id,
            sequence: taskInfo.sequence || (isServiceDetails && serviceDetails[0].sequence),
            sessions: sessionDetails
          };
          services.tasks.push(task);
          tasks.push(task);
        }
      });
      this.setState({ tasks: tasks });
    } else if (this.state.currentComponent === 1) {
      toastr.error('Task is required to save');
      isError = true;
      return false;
    }
    if (!_.isEmpty(serviceTermAndCondition)) {
      services.termsAndCondition = _.cloneDeep(serviceTermAndCondition);
    }
    if ((servicePayment.discountType && servicePayment.discountValue <= 0) || !servicePayment.discountValue) {
      servicePayment.discountValue = 0;
      if (facilitationCharge.amount > 0) {
        finalAmount = parseFloat(servicePayment.tasksDerived);
        if (facilitationCharge.type === 'amount') {
          finalAmount = parseFloat(finalAmount + parseFloat(facilitationCharge.amount)).toFixed(2);
        } else if (facilitationCharge.type === 'percent') {
          let prevAmount = (parseFloat(servicePayment.tasksDerived) * parseFloat(facilitationCharge.amount) / 100);
          finalAmount = parseFloat(finalAmount + prevAmount).toFixed(2);
        }
      }
    }
    servicePayment.currencyType = servicePayment.currencyType ? servicePayment.currencyType : this.state.currencySymbol;
    services.payment = servicePayment;
    services.finalAmount = finalAmount || servicePayment.tasksDerived;
    services.facilitationCharge = facilitationCharge;
    if (!this.serviceId) {
      const resp = await createServiceActionHandler(services);
      this.showResponseMsg(resp, 'Created Successfully');
      if (resp.success) {
        this.serviceId = resp.result;
        this.setState({ serviceTask: service });
        FlowRouter.setQueryParams({ id: this.serviceId });
      }
    } else {
      const resp = await updateServiceActionHandler(this.serviceId, services);
      if (resp.success && serviceTask.selectedTaskId) {
        this.optionsBySelectService();
      }
      this.getServiceDetails();
      this.showResponseMsg(resp, 'Updated Successfully');
      if (isRedirect) {
        FlowRouter.go(`/app/calendar/manageSchedule/${this.profileId}/serviceList`);
      }
    }
  }

  /**
   * Method :: checkDiscountEligibility
   * Desc :: Check the eligibility
   */
  checkDiscountEligibility(event) {
    let { servicePayment, finalAmount, facilitationCharge, prevFinalAmount } = this.state;
    servicePayment.discountValue = 0;
    servicePayment.isDiscount = !event.target.checked;
    if (!servicePayment.isDiscount) {
      servicePayment.discountType = '';
      if (facilitationCharge.amount > 0) {
        finalAmount = parseFloat(servicePayment.tasksDerived);
        if (facilitationCharge.type === 'amount') {
          finalAmount = parseFloat(finalAmount + parseFloat(facilitationCharge.amount)).toFixed(2);
        } else if (facilitationCharge.type === 'percent') {
          let prevAmount = (parseFloat(servicePayment.tasksDerived) * parseFloat(facilitationCharge.amount) / 100);
          finalAmount = parseFloat(finalAmount + prevAmount).toFixed(2);
        }
      }
    }
    this.setState({
      servicePayment: servicePayment,
      finalAmount: finalAmount
    });
  }
  currencyType( currencySymbol) {
    this.setState({currencySymbol:currencySymbol})
  }

  /**
   * Validate the payment based on discount
   * @return {boolean}
   */
  paymentValidate() {
    let { servicePayment, finalAmount, prevFinalAmount, facilitationCharge } = this.state;
    this.errorMsg = '';
    if (servicePayment.tasksDerived === '' || servicePayment.tasksDerived === 'undefined' || servicePayment.tasksDerived === null) {
      this.errorMsg = 'Task derived amount is required';
      toastr.error(this.errorMsg);
      return false;
    }
    switch (servicePayment.discountType) {
      case 'amount':
        if (isNaN(servicePayment.discountValue)) {
          this.errorMsg = 'Please enter a valid number';
        } else if (parseFloat(servicePayment.discountValue) > parseFloat(servicePayment.tasksDerived)) {
          this.errorMsg = 'Amount must be equal or less than the task derived amount'
        }
        break;
      case 'percent':
        if (isNaN(servicePayment.discountValue)) {
          this.errorMsg = 'Please enter a valid number';
        } else if (parseFloat(servicePayment.discountValue) > 100) {
          this.errorMsg = 'Percent must be equal or less than 100'
        }
        break;
      default:
      // do nothing
    }
    if (this.errorMsg) {
      toastr.error(this.errorMsg);
      return false;
    }
  }
  /**
   * Method :: calculateDiscounts
   * Desc :: Calculate the discount as per discount status
   */
  calculateDiscounts(event) {
    let { servicePayment, finalAmount, prevFinalAmount, facilitationCharge } = this.state;
    finalAmount = servicePayment.tasksDerived;
    servicePayment.discountValue = 0;
    if (servicePayment.isDiscount) {
      servicePayment.discountValue = event.target.value;
      switch (servicePayment.discountType) {
        case 'amount':
          if (parseFloat(event.target.value) >= 0) {
            let value = parseFloat(servicePayment.tasksDerived) - parseFloat(servicePayment.discountValue);
            finalAmount = value ? parseFloat(value).toFixed(2) : null;
          }
          break;
        case 'percent':
          if (parseFloat(event.target.value) >= 0) {
            let percentageAmmount = (parseFloat(servicePayment.tasksDerived) * parseFloat(servicePayment.discountValue)) / 100;
            let value = parseFloat(servicePayment.tasksDerived) - percentageAmmount;
            finalAmount = value ? parseFloat(value).toFixed(2) : null;
          }
          break;
        default:
        // do nothing
      }
      if (facilitationCharge.type && facilitationCharge.amount > 0) {
        if (facilitationCharge.type === 'amount') {
          finalAmount = parseFloat(finalAmount + facilitationCharge.amount).toFixed(2);
        } else if (facilitationCharge.type === 'percent') {
          let prevAmount = (parseFloat(servicePayment.tasksDerived) * parseFloat(facilitationCharge.amount) / 100);
          finalAmount = parseFloat(finalAmount + prevAmount).toFixed(2);
        }
      }
      this.setState({
        servicePayment: servicePayment,
        finalAmount: finalAmount
      }, () => {
        this.paymentValidate(); // check for payment validation
      });
    } else {
      this.setState({ servicePayment: servicePayment, finalAmount: finalAmount });
    }
  }

  /**
   * Method :: checkDiscountStatus
   * Desc :: Check the discount as per discount eligibility
   */
  checkDiscountStatus(event) {
    let { servicePayment, facilitationCharge, finalAmount, prevFinalAmount } = this.state;
    servicePayment.discountValue = 0;
    if (facilitationCharge.amount > 0) {
      finalAmount = prevFinalAmount ? parseFloat(prevFinalAmount).toFixed(2) : null;
    } else {
      finalAmount = servicePayment.tasksDerived ? parseFloat(servicePayment.tasksDerived).toFixed(2) : null;
    }
    if (servicePayment.isDiscount) {
      servicePayment.discountType = event.target.id;
    }
    this.setState({
      servicePayment: servicePayment,
      finalAmount: finalAmount
    });
  }

  /**
   * Method :: checkTaxStatus
   * Desc :: Check the tax status
   */
  checkTaxStatus(event) {
    let { servicePayment, taxStatus } = this.state;
    taxStatus = event.target.id;
    if (taxStatus === 'taxinclusive') {
      servicePayment.isTaxInclusive = true;
    } else {
      servicePayment.isTaxInclusive = false;
    }
    this.setState({ servicePayment: servicePayment, taxStatus: taxStatus });
  }

  /**
   * Method :: checkPromoStatus
   * Desc :: Check the promo code status
   */
  checkPromoStatus(event) {
    let { servicePayment } = this.state;
    servicePayment.isPromoCodeApplicable = !event.target.checked;
    this.setState({ servicePayment: servicePayment });
  }

  /**
   * Method :: checkApprovalRequiredFromSeeker
   * Desc :: Check the isApproval Required From Seeker status
   */
  checkApprovalRequiredFromSeeker(event) {
    let { servicePayment } = this.state;
    servicePayment.isApprovalRequiredFromSeeker = !event.target.checked;
    this.setState({ servicePayment: servicePayment });
  }


  /**
   * Method :: onChangeFormField
   * Desc :: Set the current changed value in state
   * @return Void
   */
  onChangeFormField(event) {
    const { id, value } = event.target;
    let { serviceBasicInfo } = this.state;
    serviceBasicInfo[id] = value;
    this.setState({ serviceBasicInfo: serviceBasicInfo });
  }

  /**
   * Method :: checkBoxHandler
   * Desc :: set the current status
   * @return Void
   */
  checkBoxHandler(event) {
    let { serviceBasicInfo } = this.state;
    serviceBasicInfo.isActive = event.target.checked;
    this.setState({ serviceBasicInfo: serviceBasicInfo });
  }

  /**
   * Method :: validTill
   * Desc :: set the current date time picker
   */
  validTill(event) {
    if (event._d) {
      let value = new Moment(event._d);
      let { serviceBasicInfo } = this.state;
      serviceBasicInfo.validTill = value;
      this.setState({ serviceBasicInfo: serviceBasicInfo });
    }
  }

  /**
   * Method :: optionsBySelectChapters
   * Desc :: set the current chapter details
   */
  optionsBySelectChapters(value, calback, selObject) {
    let { serviceBasicInfo, clusterData } = this.state;
    serviceBasicInfo.chapters = value;
    clusterData.chapters = value;
    this.setState({
      serviceBasicInfo: serviceBasicInfo,
      clusterData: clusterData,
      chapterName: selObject,
      subChapterName: null
    });
  }

  /**
   * Method :: optionsBySelectstates
   * Desc :: set the current state details
   */
  optionsBySelectstates(value, calback, selObject) {
    let { serviceBasicInfo, clusterData } = this.state;
    serviceBasicInfo.state = value;
    clusterData.state = value;
    this.setState({
      serviceBasicInfo: serviceBasicInfo,
      clusterData: clusterData,
      stateName: selObject
    });
  }

  /**
   * Method :: opttionsBySelectCommunities
   * Desc :: set the current community details
   */
  optionsBySelectCommunities(value, calback, selObject) {
    let { serviceBasicInfo, clusterData } = this.state;
    serviceBasicInfo.community = value;
    clusterData.community = value;
    this.setState({
      serviceBasicInfo: serviceBasicInfo,
      clusterData: clusterData,
      communitiesName: selObject
    });
  }

  /**
   * Method :: setSessionFrequency
   * Desc :: set the current frequency details
   */
  setSessionFrequency(value) {
    let serviceBasicInfo = this.state.serviceBasicInfo;
    serviceBasicInfo.sessionFrequency = value;
    this.setState({ serviceBasicInfo: serviceBasicInfo })
  }


  setServiceExpiry(event) {
    let serviceBasicInfo = this.state.serviceBasicInfo;
    serviceBasicInfo.serviceExpiry = event && event.target && event.target.value ? event.target.value : event;
    this.setState({ serviceBasicInfo: serviceBasicInfo })
  }

  /**
   * Method :: setGoLiveService
   * Desc :: Set the service go live
   */
  async setGoLiveService() {
    const resp = await updateGoLiveServiceActionHandler(this.serviceId);
    this.showResponseMsg(resp, 'Your service is now live');
    FlowRouter.go('/app/calendar/manageSchedule/' + this.profileId + '/serviceList');
  }

  /**
   * Method :: sendReviewService
   * Desc :: Send to admin for review
   */
  async sendReviewService() {
    const resp = await updateReviewServiceActionHandler(this.serviceId);
    this.showResponseMsg(resp, 'Sent for review successfully');
    FlowRouter.go('/app/calendar/manageSchedule/' + this.profileId + '/serviceList');
  }

  /**
   * Method :: sendReviewService
   * Desc :: Send to admin for review
   */
  async cloneServiceCard() {
    //console.log('Clone', this.serviceId);
    const resp = await cloneServiceCardActionHandler(this.serviceId);
    this.showResponseMsg(resp, 'Service clone successfully');
    if (resp.success) {
      FlowRouter.go('/app/calendar/manageSchedule/' + this.profileId + '/serviceList');
    }
  }
  /**
   * Method :: React render
   * Desc :: Showing html page
   * @returns {XML}
   */
  render() {
    let { serviceBasicInfo, service } = this.state;
    const isViewMode = this.props.viewMode;
    const isApproved = serviceBasicInfo.isApproved;
    //console.log("Service :", service);
    let _this = this;
    let appActionConfig = [
      {
        showAction: true,
        actionName: 'save',
        handler: async (event) => _this.props.handler(isViewMode ? _this.props.bookService.bind(this, true) : _this.saveService.bind(this))
      },
      {
        showAction: _this.serviceId && this.state.service && this.state.service.isActive && ["Send For Review", "Gone Live", "Admin Approved"].indexOf(this.state.service.status) == -1 ? true : false,
        actionName: 'send for review',
        handler: async (event) => _this.props.handler(_this.sendReviewService.bind(this))
      },
      {
        showAction: isApproved && this.state.service && this.state.service.isActive && this.state.service.status !== "Gone Live" ? true : false,
        actionName: 'golive',
        handler: async (event) => _this.props.handler(_this.setGoLiveService.bind(this))
      },
      {
        showAction: true,
        actionName: 'cancel',
        handler: async (event) => {
          FlowRouter.go('/app/calendar/manageSchedule/' + _this.profileId + '/serviceList')
        }
      },
      {
        showAction: _this.serviceId ? true : false,
        actionName: 'clone',
        handler: async (event) => _this.props.handler(_this.cloneServiceCard.bind(this))
      }
    ];
    export const genericPortfolioAccordionConfig = {
      id: 'portfolioAccordion',
      panelItems: [
        {
          'title': 'Actions',
          isText: false,
          style: { 'background': '#ef4647' },
          contentComponent: <MlAppActionComponent
            resourceDetails={{ resourceId: 'service', resourceType: 'service' }}   //resource id need to be given
            actionOptions={appActionConfig} />
        }]
    };
    return (
      <div className="app_main_wrap">
        <div className="app_padding_wrap">
          {!this.props.viewMode ? <MlAppScheduleHead type="service" /> : ""}
          <div className="col-md-12">
            <div className='step-progress'>
              <div id="root">
                <StepZilla steps={this.setServiceSteps()}
                  stepsNavigation={true}
                  showNavigation={false}
                  prevBtnOnLastStep={false} />
              </div>
            </div>
          </div>
          {!isViewMode &&
            <MlAccordion accordionOptions={genericPortfolioAccordionConfig} {...this.props} />
          }
        </div>
      </div>
    )
  }
};

export default MlAppServiceManageSchedule = formHandler()(MlAppServiceManageSchedule);
