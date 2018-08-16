

import React, { Component } from "react";
import MlAppScheduleHead from "../../commons/components/MlAppScheduleHead";
import formHandler from "../../../../../commons/containers/MlFormHandler";
import { findTaskActionHandler } from "../actions/saveCalanderTask";
import { createTaskActionHandler, updateTaskActionHandler } from "../actions/saveCalanderTask";
import MlAppActionComponent from "../../../../commons/components/MlAppActionComponent";
import MlAccordion from "../../../../commons/components/MlAccordion";
import StepZilla from "../../../../../commons/components/stepzilla/StepZilla";
import MlAppTaskCreate from "./MlAppTaskCreate";
import MlAppTaskSession from "./MlAppTaskSession";
import MlAppTaskConditions from "./MlAppTaskConditions";
import MlAppTaskPayment from "./MlAppTaskPayment";
import MlAppTaskStep5 from "./MlAppTaskStep5";
import {appClient} from '../../../../core/appConnection';
import { fetchCurrencyTypeActionHandler } from '../../../../../commons/actions/mlCurrencySymbolHandler'

import _ from "lodash";

class MlAppTaskLanding extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      saved:false,currencySymbol:""
    }
    this.activeComponent = this.activeComponent.bind(this);
    return this;
  }

  componentWillMount() {
    this.getCurrencyType();
  }

  resetSaved(){
    this.setState({saved:false});
  }

  async getCurrencyType() {
    const response = await fetchCurrencyTypeActionHandler(appClient, null);
    this.setState({currencySymbol: response.symbol})
    return response;
  }

  async saveTaskDetails() {
    let sendData = this.state.createData
    let isExternal = this.state.isExternal;
    let taskId = this.props.editMode ? this.props.taskId : FlowRouter.getQueryParam('id')
    var response;
    this.errorMsg = '';

    if (this.state.currentComponent === 0) {
      if (!sendData || !this.state.saveType) {
        this.errorMsg = 'No changes to save';
        toastr.error(this.errorMsg);
        return false;
      } else {
        if (!sendData.name) {
          this.errorMsg = 'Task Name is required';
          toastr.error(this.errorMsg);
          return false;
        }
        if (!sendData.displayName) {
          this.errorMsg = 'Display Name is required';
          toastr.error(this.errorMsg);
          return false;
        }
        if (!sendData.isInternal && !sendData.isExternal) {
          this.errorMsg = 'Task Type is required';
          toastr.error(this.errorMsg);
          return false;
        }
        if (!sendData.noOfSession) {
          sendData.noOfSession = 1;
        }
        if (sendData.noOfSession < 1) {
          toastr.error('Number of session cannot be less than 1');
          return false;
        }
        if (sendData.isActive) {
          if (this.state.saveType === 'taskCreate') {
            this.errorMsg = 'Status cannot be active without adding sessions';
            toastr.error(this.errorMsg);
            return false;
          }
          if (this.state.saveType === 'taskUpdate') {
            if (sendData.session && sendData.session.length) {
              let showError = true;
              for (let i = 0; i < sendData.session.length; i++) {
                if (sendData.session[i].activities && sendData.session[i].activities.length) {
                  showError = false;
                }
              }
              if (showError) {
                this.errorMsg = 'Status cannot be active without adding sessions';
                toastr.error(this.errorMsg);
                return false;
              }
            } else {
              this.errorMsg = 'Status cannot be active without adding sessions';
              toastr.error(this.errorMsg);
              return false;
            }
          }
        }
      }
    }
    if (this.state.currentComponent === 1) {
      if (sendData.session && sendData.session.length) {
        let showError = true;
        let durationError=false;
        for (let i = 0; i < sendData.session.length; i++) {
          if (sendData.session[i].activities && sendData.session[i].activities.length) {
            showError = false;
          }
          if(!sendData.session[i].duration || (!sendData.session[i].duration.hours&&!sendData.session[i].duration.minutes)){
            durationError=true;
          }
        }
        if (durationError) {
          this.errorMsg = 'Select validate duration';
          toastr.error(this.errorMsg);
          return false;
        }
        if (showError) {
          this.errorMsg = 'Select atleast one activity';
          toastr.error(this.errorMsg);
          return false;
        }
      } else {
        this.errorMsg = 'Select atleast one activity';
        toastr.error(this.errorMsg);
        return false;
      }
    }

    sendData && sendData.payment ? sendData.payment.currencyType = this.state.currencySymbol : ""

    if (sendData && sendData.payment && sendData.payment.isDiscount) {

      if (!sendData.name) {
        this.errorMsg = 'Task Name is required';
        toastr.error(this.errorMsg);
        return false;
      } else if (!sendData.displayName) {
        this.errorMsg = 'Display Name is required';
        toastr.error(this.errorMsg);
        return false;
      } else if (!sendData.isExternal && !sendData.isInternal) {
        this.errorMsg = 'Task Type is required';
        toastr.error(this.errorMsg);
        return false;
      } else if (!sendData.noOfSession) {
        this.errorMsg = 'Number of Session is Mandatory';
        toastr.error(this.errorMsg);
        return false;
      }


      else if (sendData.payment.activitiesDerived === '' || typeof sendData.payment.activitiesDerived === 'undefined' || sendData.payment.activitiesDerived === null) {
        this.errorMsg = 'Payable amount is required';
        toastr.error(this.errorMsg);
        return false;
      }
      switch (sendData.payment.discountType) {
        case 'amount':
          if (isNaN(sendData.payment.discountValue)) {
            this.errorMsg = 'Please enter a valid number';
          } else if (parseFloat(sendData.payment.discountValue) > parseFloat(sendData.payment.activitiesDerived)) {
            this.errorMsg = 'Amount must be equal or less than the payable amount'
          }
          break;
        case 'percent':
          if (isNaN(sendData.payment.discountValue)) {
            this.errorMsg = 'Please enter a valid number';
          } else if (parseFloat(sendData.payment.discountValue) > 100) {
            this.errorMsg = 'Percent must be equal or less than 100'
          }
          break;
        default:
          this.errorMsg = '';
      }
    }
    /*if (sendData && isExternal) {
      let {activities} = this.state;
      if (sendData.session && sendData.session.length > 0 && activities && activities.length> 0) {
        sendData.session.map((sessionData, index) => {
          let isOnline = false;
          if (sessionData.activities && sessionData.activities.length > 0) {
            sessionData.activities.map((activityId) => {
              let activity = activities.filter((activityData) => { return activityData._id === activityId});
              if (activity && activity.length > 0) {
                if (activity[0].mode === 'online' && !isOnline) {
                  isOnline = true;
                }
              }
            })
          } else {
            isOnline = true;
          }
          if(!isOnline) {
            this.errorMsg = 'Activity must be at least one online mode for external task in Session ' + (1 + index);
            return false;
          }
        })
      }
    }*/
    if (!this.errorMsg) {
      switch (this.state.saveType) {
        case 'taskCreate': {
          response = await createTaskActionHandler(sendData)
          this.setState({saved:true});
          return response
        }
          break;
        case 'taskUpdate': {
          if (taskId){
            response = await updateTaskActionHandler(taskId, sendData)
            this.setState({saved:true});
          }
          else
            toastr.error("Invalid Request");
          return response
        }
          break;
        default:
          console.log('save type required')
      }
    } else {
      toastr.error(this.errorMsg);
      return false;
    }
  }

  async handleError(response) {
    console.log('error')
    console.log(response)
  };

  activeComponent(currentComponent) {
    console.log(currentComponent);
    this.setState({ currentComponent });
  }

  async handleSuccess(response) {
    console.log(response)
    if (response && response.success) {
      if (this.state.saveType == 'taskCreate')
        FlowRouter.setQueryParams({ id: response.result })
      toastr.success("Saved successfully. Please proceed to next step");
    } else if (response && !response.success) {
      toastr.error(response.result);
    }
  }


  getCreateDetails(details) {
    details['profileId'] = this.props.profileId
    let taskId = this.props.editMode ? this.props.taskId : FlowRouter.getQueryParam('id')
    let typeHandel = taskId ? "taskUpdate" : "taskCreate"
    // let typeHandel = this.props.editMode ? "taskUpdate" : "taskCreate"
    this.setState({ createData: details, saveType: typeHandel });
  }

  getSessionDetails(details, activities, isExternal) {
    let totalMinutes = details.reduce(function (sum, value) {
      let duration = value.duration ? value.duration : {};
      return parseInt(sum) + parseInt((duration.hours ? duration.hours : 0)) * 60 + parseInt((duration.minutes ? duration.minutes : 0));
    }, 0);
    let obj = {
      duration: {
        hours: parseInt(totalMinutes / 60),
        minutes: totalMinutes % 60
      },
      session: details
    }
    this.setState({ createData: obj, saveType: 'taskUpdate', activities: activities, isExternal: isExternal });
  }

  getPaymentDetails(details) {
    this.setState({ createData: details, saveType: 'taskUpdate' });
  }

  getConditionDetails(details) {
    this.setState({ createData: details, saveType: 'taskUpdate' });
  }

  render() {
    let that = this;
    let appActionConfig = [
      {
        showAction: true,
        actionName: 'save',
        handler: async (event) => this.props.handler(this.saveTaskDetails.bind(this), this.handleSuccess.bind(this), this.handleError.bind(this))
      },
      {
        showAction: true,
        actionName: 'cancel',
        handler: async (event) => {
          FlowRouter.go('/app/calendar/manageSchedule/' + this.props.profileId + '/taskList')
        }
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
            resourceDetails={{ resourceId: 'sacsdvdsv', resourceType: 'task' }}   //resource id need to be given
            actionOptions={appActionConfig} />
        }]
    };

    const steps =
      [
        {
          name: 'Create Task',
          component: <MlAppTaskCreate
            activeComponent={this.activeComponent}
            saved={this.state.saved}
            resetSaved={this.resetSaved.bind(this)}
            getCreateDetails={this.getCreateDetails.bind(this)}
            taskId={this.props.editMode ? this.props.taskId : FlowRouter.getQueryParam('id')} />,
          icon: <span className="ml my-ml-add_tasks"></span>
        },
        {
          name: 'Choose Activity',
          component: <MlAppTaskSession
            activeComponent={this.activeComponent}
            getSessionDetails={this.getSessionDetails.bind(this)}
            taskId={this.props.editMode ? this.props.taskId : FlowRouter.getQueryParam('id')}
            editMode={true}
            profileId={this.props.profileId} />,
          icon: <span className="ml flaticon-ml-file-1"></span>
        },
        {
          name: 'Terms and Conditions',
          component: <MlAppTaskConditions
            activeComponent={this.activeComponent}
            getConditionDetails={this.getConditionDetails.bind(this)}
            taskId={this.props.editMode ? this.props.taskId : FlowRouter.getQueryParam('id')} />,
          icon: <span className="ml flaticon-ml-interface-2"></span>
        },
        {
          name: 'Payment',
          component: <MlAppTaskPayment
            activeComponent={this.activeComponent}
            getPaymentDetails={this.getPaymentDetails.bind(this)} client={appClient}
            taskId={this.props.editMode ? this.props.taskId : FlowRouter.getQueryParam('id')} />,
          icon: <span className="ml ml-payments"></span>
        },
        {
          name: 'History', component: <MlAppTaskStep5
            activeComponent={this.activeComponent} />,
          icon: <span className="ml my-ml-history"></span>
        }
      ]

    return (
      <div className="app_main_wrap">
        <div className="app_padding_wrap">
          <MlAppScheduleHead type="task" />
          <div className="col-md-12">
            <div className='step-progress'>
              <div id="root">
                <StepZilla steps={steps} stepsNavigation={true} showNavigation={false} prevBtnOnLastStep={false} dontValidate={false} showConfirm={true} />
              </div>
            </div>
          </div>
          <MlAccordion accordionOptions={genericPortfolioAccordionConfig} {...this.props} />
        </div>
      </div>
    )
  }
}
;
export default MlAppTaskLanding = formHandler()(MlAppTaskLanding);
