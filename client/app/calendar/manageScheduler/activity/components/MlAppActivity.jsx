/** ************************************************************
 * Date: 19 Jun, 2017
 * Programmer: Mukhil <mukhil.padnamanabhan@raksan.in>
 * Description : This will manage the activities
 * JavaScript XML file MlAppActivity.jsx
 * *************************************************************** */

/**
 * Imports libs and components
 */
import React, { Component } from "react";
import MlAppScheduleHead from "../../commons/components/MlAppScheduleHead";
import StepZilla from "../../../../../commons/components/stepzilla/StepZilla";
import MlAppBasicInfo from "./MlAppActivityBasicInfo";
import MlAppChooseTeam from "./MlAppChooseTeam";
import MlAppActivityPayment from "./MlAppActivityPayment";
import MlAppActivityHistory from "./MlAppActivityHistory";
import { createActivityActionHandler, getActivityActionHandler, updateActivityActionHandler } from './../actions/activityActionHandler';
import MlAccordion from "../../../../commons/components/MlAccordion";
import formHandler from "../../../../../commons/containers/MlFormHandler";
import MlAppActionComponent from "../../../../commons/components/MlAppActionComponent";
import { initalizeFloatLabel } from '../../../../../commons/utils/formElemUtil';
import { fetchCurrencyTypeActionHandler } from '../../../../../commons/actions/mlCurrencySymbolHandler'
import {appClient} from '../../../../core/appConnection';

class MlAppActivity extends Component {

  /**
   * Constructor
   * @param props :: Object - Parents data
   */
  constructor(props) {
    super(props)
    this.state = {
      activityId: " ",
      basicInfo: {
        industryTypes: [],
        duration: {},
        deliverable: ['']
      },
      teamInfo: [{
        users: []
      }],
      paymentInfo: {
        isDiscount: false
      },
      activeComponent: 0,
      saved:false,
    };
    this.getActivityDetails = this.getActivityDetails.bind(this);
    this.setActivityDetails = this.setActivityDetails.bind(this);
    this.profileId = FlowRouter.getParam('profileId');
    this.activeComponent = this.activeComponent.bind(this);
  }

  /**
   * ComponentDidMount
   * Desc :: Initializing the switch and fetch activity data in edit mode
   */
  componentDidMount() {
    $('.switch input').change(function () {
      if ($(this).is(':checked')) {
        $(this).parent('.switch').addClass('on');
      } else {
        $(this).parent('.switch').removeClass('on');
      }
    });
    this.getActivityDetails();
  }

  resetSaved(){
    this.setState({saved:false});
  }

  componentWillUpdate() {
    initalizeFloatLabel();
  }

  activeComponent(currentComponent) {
    console.log(currentComponent);
    this.setState({ currentComponent });
  }
  /**
   * Method :: getActivityDetails
   * Desc   :: fetch the current activity details from server and set in state
   * @returns Void
   */
  async getActivityDetails() {
    const that = this;
    let id = FlowRouter.getQueryParam('id');
    if (!id) {
      this.setState({ editScreen: false })
    } else {
      let activity = await getActivityActionHandler(id);
      if (activity) {
        let duration = activity.duration ? activity.duration : {};
        duration = {
          hours: duration.hours ? duration.hours : '',
          minutes: duration.minutes ? duration.minutes : ''
        };

        /**
         * Set activity basic info
         */
        let activityBasicInfo = {
          name: activity.name,
          displayName: activity.displayName,
          isInternal: activity.isInternal,
          isExternal: activity.isExternal,
          isActive: activity.isActive,
          mode: activity.mode ? activity.mode : "online",
          isServiceCardEligible: activity.isServiceCardEligible,
          industryTypes: activity.industryTypes ? activity.industryTypes : [],
          duration: duration,
          deliverable: activity.deliverable && activity.deliverable.length ? (new Array(activity.deliverable))[0] : [''],
          note: activity.note,
          imageLink: activity.imageLink,
          conversation: activity.conversation && activity.conversation.length ? (new Array(activity.conversation))[0] : []
        };
        let teamInfo = activity.teams ? activity.teams : [{ users: [] }];
        teamInfo = teamInfo.map(function (team) {
          return {
            resourceId: team.resourceId,
            resourceType: team.resourceType,
            users: team.users.map(function (user) {
              return {
                userId: user.userId,
                profileId: user.profileId,
                isMandatory: user.isMandatory
              }
            })
          }
        });

        let paymentInfo = activity.payment ? activity.payment : {};

        paymentInfo = {
          amount: paymentInfo.amount ? paymentInfo.amount : '',
          derivedAmount: paymentInfo.derivedAmount ? paymentInfo.derivedAmount : '',
          discountType: paymentInfo.discountType ? paymentInfo.discountType : '',
          discountValue: paymentInfo.discountValue ? paymentInfo.discountValue : '',
          isDiscount: paymentInfo.isDiscount ? paymentInfo.isDiscount : false,
          currencyType : paymentInfo.currencyType ? paymentInfo.currencyType : ""
        };

        that.setState({
          basicInfo: activityBasicInfo,
          teamInfo: teamInfo,
          isExternal: activity.isExternal,
          isInternal: activity.isInternal,
          paymentInfo: paymentInfo
        });
      }
    }
    initalizeFloatLabel();
  }

  /**
   * Method :: setActivityDetails
   * Desc :: Set the current update activity details
   * @param data :: activity object
   */
  setActivityDetails(data, isBasicData) {
    this.activityDetails = data;
    this.isBasicData = isBasicData || false;
  }



  toastError(msg) {
    toastr.error(msg + ' is  Mandatory');
  }

  /**
   * Method :: saveActivity
   * Desc   :: Save activity data on server
   * @param data :: Object :: Activity data
   * @returns Void
   */
  async saveActivity() {
    let id = FlowRouter.getQueryParam('id');
    let activityDetails = this.activityDetails;
    if (!this.profileId) {
      toastr.error("Please select a profile");
      return false;
    }

    if (this.state.currentComponent === 0) {
      if (!activityDetails) {
        this.toastError("Please enter or select an 'Activity Name'");
        return false;
      }
      let duration = activityDetails.duration;
      if (!duration) {
        toastr.error("Enter a valid duration");
        return false;
      }

      /**
       * Remove duration key if they are not in int format
       */
      if (!parseInt(duration.hours)) {
        delete duration.hours;
      }
      if (!parseInt(duration.minutes)) {
        delete duration.minutes;
      }

      if (!duration.hours && !duration.minutes) {
        toastr.error("Enter a valid duration");
        return false;
      }

      if (!(activityDetails.conversation && activityDetails.conversation.length) && activityDetails.mode === 'online') {
        this.toastError("'Conversation Type' is mandatory");
        return false;
      } else if (!(activityDetails.deliverable && activityDetails.deliverable.length && activityDetails.deliverable[0])) {
        this.toastError("'Deliverable' field is mandatory");
        return false;
      } else if (!activityDetails.displayName) {
        this.toastError("'Display Name' is mandatory");
        return false;
      } else if (!activityDetails.name) {
        this.toastError("'Activity Name' is mandatory");
        return false;
      } else if (!(activityDetails.isExternal || activityDetails.isInternal)) {
        this.toastError("'Activity Type' is mandatory");
        return false;
      }

      if (activityDetails.mode !== 'online') {
        delete activityDetails.conversation;
      }
      activityDetails.isServiceCardEligible = activityDetails.isExternal ? activityDetails.isServiceCardEligible : false;
      activityDetails.duration = duration;
    }
    else if (this.state.currentComponent === 1) {
      if (!activityDetails.payment || !(activityDetails.payment.amount)) {
        this.toastError("'Gross Payable Amount' is mandatory");
        return false;
      }
    }

    activityDetails.profileId = this.profileId;
    if (activityDetails && activityDetails.teams) {
      let data = activityDetails.teams && activityDetails.teams.map(function (team) {
        team.users = team.users.filter(function (user) {
          return user.isAdded;
        }).map(function (user) {
          return {
            profileId: user.profileId,
            userId: user.userId,
            isMandatory: user.isMandatory ? true : false
          }
        });
        return team;
      });
      activityDetails.teams = data;
    }
    if (id) {
      const res = await updateActivityActionHandler(id, activityDetails);
      if (res.success) {
        toastr.success("Updated Successfully");
        this.setState({saved:true});
        this.getActivityDetails();
      } else {
        toastr.error(res.result);
      }
    } else {
      const res = await createActivityActionHandler(activityDetails);
      if (res.success) {
        toastr.success("Created Successfully");
        this.setState({saved:true});
        FlowRouter.setQueryParams({ id: res.result });
      } else {
        toastr.error(res.result);
      }
    }
  }
  /**
   * Method :: setActivitySteps
   * Desc :: Setting up steps for activity different step
   */
  setActivitySteps() {
    const that = this;
    const steps = [
      {
        name: 'Create',
        component: <MlAppBasicInfo getActivityDetails={this.getActivityDetails}
          setActivityDetails={that.setActivityDetails}
          activeComponent={this.activeComponent}
          data={that.state.basicInfo} />,
        icon: <span className="ml my-ml-add_tasks"></span>
      },
      {
        name: 'Choose team',
        component: <MlAppChooseTeam getActivityDetails={this.getActivityDetails}
          setActivityDetails={that.setActivityDetails}
          activeComponent={this.activeComponent}
          isInternal={this.state.isInternal}
          isExternal={this.state.isExternal}
          data={this.state.teamInfo} />,
        icon: <span className="ml fa fa-users"></span>
      },
      {
        name: 'Payment', component:
        <MlAppActivityPayment getActivityDetails={this.getActivityDetails}
          setActivityDetails={that.setActivityDetails}
          activeComponent={this.activeComponent}
          resetSaved={this.resetSaved.bind(this)}
          saved={this.state.saved} client={appClient}
          data={this.state.paymentInfo} />,
        icon: <span className="ml ml-payments"></span>
      },
      {
        name: 'History',
        component: <MlAppActivityHistory
          activeComponent={this.activeComponent} />,
        icon: <span className="ml my-ml-history"></span>
      }
    ];
    return steps;
  }
  async getCurrencyType(userId) {
    const response = await fetchCurrencyTypeActionHandler(appClient, userId);
    this.setState({currencySymbol: response.symbol})
    return response;
  }
  /**
   * Render
   * Desc   :: Render the HTML for this component
   * @returns {HTML}
   */
  render() {
    const that = this;
    /**
     * Setting up action handler for activity different event
     */
    let appActionConfig = [
      {
        showAction: true,
        actionName: 'save',
        handler: async (event) => that.props.handler(that.saveActivity.bind(this))
      },
      {
        showAction: true,
        actionName: 'cancel',
        handler: async (event) => {
          FlowRouter.go('/app/calendar/manageSchedule/' + this.profileId + '/activityList')
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
            resourceDetails={{ resourceId: 'activity', resourceType: 'activity' }}   //resource id need to be given
            actionOptions={appActionConfig} />
        }]
    };
    /**
     * Return the html to render
     */
    return (
      <div className="app_main_wrap">
        <div className="app_padding_wrap">
          <MlAppScheduleHead type="activity" />
          <div className="col-md-12">
            <div className='step-progress'>
              <div id="root">
                <StepZilla steps={this.setActivitySteps()} stepsNavigation={true} showNavigation={false} prevBtnOnLastStep={false} />
              </div>
            </div>
          </div>
          <MlAccordion accordionOptions={genericPortfolioAccordionConfig} {...this.props} />
        </div>
      </div>
    )
  }
};

export default MlAppActivity = formHandler()(MlAppActivity);
