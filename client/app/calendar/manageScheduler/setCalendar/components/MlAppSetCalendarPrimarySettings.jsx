/**
 * Created by pankaj on 28/6/17.
 */

import React from 'react';
var FontAwesome = require('react-fontawesome');
import ScrollArea from 'react-scrollbar';
import { updateCalendarSettingActionHandler } from '../actions/updateCalendarSettings';
import MlAccordion from "../../../../commons/components/MlAccordion";
import formHandler from "../../../../../commons/containers/MlFormHandler";
import MlAppActionComponent from "../../../../commons/components/MlAppActionComponent";
import PopoverActionIcon from '../../../../../app/appActions/components/PopoverActionIcon';
import CalendarPopOver from './CalendarPopOver';

class MlAppCalendarPrimarySettings extends React.Component {

  constructor(props) {
    super(props);
    let slotDuration = props.primarySettings.slotDuration ? props.primarySettings.slotDuration : {};
    slotDuration = {
      hours: slotDuration.hours ? slotDuration.hours : "",
      minutes: slotDuration.minutes ? slotDuration.minutes : ""
    };
    this.state = {
      slotDuration: slotDuration,
      appointmentCountPerSlots: props.primarySettings.appointmentCountPerSlots ? props.primarySettings.appointmentCountPerSlots : "",
      slotBreakTime: props.primarySettings.slotBreakTime ? props.primarySettings.slotBreakTime : "",
      isOverlappingSchedule: props.primarySettings.isOverlappingSchedule ? props.primarySettings.isOverlappingSchedule : false
    };
    this.updateCalendarSetting = this.updateCalendarSetting.bind(this);
  }

  componentWillReceiveProps(props) {
    let slotDuration = props.primarySettings.slotDuration ? props.primarySettings.slotDuration : {};
    slotDuration = {
      hours: slotDuration.hours ? slotDuration.hours : "",
      minutes: slotDuration.minutes ? slotDuration.minutes : ""
    };
    this.setState({
      slotDuration: slotDuration,
      appointmentCountPerSlots: props.primarySettings.appointmentCountPerSlots ? props.primarySettings.appointmentCountPerSlots : "",
      slotBreakTime: props.primarySettings.slotBreakTime ? props.primarySettings.slotBreakTime : "",
      isOverlappingSchedule: props.primarySettings.isOverlappingSchedule ? props.primarySettings.isOverlappingSchedule : false
    });
  }

  componentDidMount() {
    $('.float-label').jvFloat();
    var WinHeight = $(window).height();
    $('.step_form_wrap').height(WinHeight - (290 + $('.app_header').outerHeight(true)));
  }

  updateSlotBreakTime(event) {
    // if(event.target.value > 0) {
    this.setState({
      slotBreakTime: event.target.value
    });
    // }
  }

  updateAppointmentCountPerSlots(event) {
    // if(event.target.value > 0) {
    this.setState({
      appointmentCountPerSlots: event.target.value
    });
    // }
  }

  updateOverlappingSchedule(event) {
    this.setState({
      isOverlappingSchedule: event.target.checked
    });
  }

  updateSlotDuration(event, type) {
    let slotDuration = this.state.slotDuration;
    // if( parseInt(event.target.value) >= 0) {
    slotDuration[type] = event.target.value === "" ? "":event.target.value
    // }
    this.setState({
      slotDuration: slotDuration
    });
  }

  portfolioShareHandler(actionConfig, handlerCallback) {
    if (handlerCallback) {//to handle the popover
      handlerCallback({ });
    }
  }

  async updateCalendarSetting() {
    let dataToInsert = {
      slotDuration: {},
      isOverlappingSchedule: this.state.isOverlappingSchedule
    };
    /* Validating data */
    if (!this.state.appointmentCountPerSlots) {
      toastr.error('Appointment count per slot is mandatory');
      return false;
    }
    if (this.state.appointmentCountPerSlots < 1) {
      toastr.error('Invalid value for Appointment count per slot');
      return false;
    }
    if (!this.state.slotDuration.hours && !this.state.slotDuration.minutes) {
      toastr.error('Slot duration is mandatory');
      return false;
    }

    if (this.state.slotDuration.hours !== "" && Number(this.state.slotDuration.hours) < 0) {
      toastr.error('Invalid value for hours');
      return false;
    }

    if (this.state.slotDuration.hours !== "" && Number(this.state.slotDuration.minutes) < 0) {
      toastr.error('Invalid value for minutes');
      return false;
    }

    if (this.state.slotBreakTime || this.state.slotBreakTime.length) {
      dataToInsert.slotBreakTime = this.state.slotBreakTime;
    }
    if (this.state.appointmentCountPerSlots || this.state.appointmentCountPerSlots.length) {
      dataToInsert.appointmentCountPerSlots = this.state.appointmentCountPerSlots;
    }
    if (this.state.slotDuration.hours || this.state.slotDuration.hours === 0 || this.state.slotDuration.hours.length) {
      dataToInsert.slotDuration.hours = this.state.slotDuration.hours;
    }
    if (this.state.slotDuration.minutes || this.state.slotDuration.minutes === 0 || this.state.slotDuration.minutes.length) {
      dataToInsert.slotDuration.minutes = this.state.slotDuration.minutes;
    }
    let profileId = FlowRouter.getParam('profileId');
    let response = await updateCalendarSettingActionHandler(profileId, dataToInsert);
    if (response.success) {
      toastr.success(response.result);
      this.props.fetchCalendarSettings();
    } else {
      toastr.error(response.result);
    }
  }

  render() {
    const that = this;
    console.log("props.primarySettings:",that.props.primarySettings);
    /**
     * Setting up action handler for activity different event
     */
    let appActionConfig = [];
    if( !that.props.hasAppointment ) {
      appActionConfig.push({
        showAction: true,
        actionName: 'save',
        handler: async (event) => that.props.handler(that.updateCalendarSetting.bind(this))
      });
    } else {
      appActionConfig.push({
        showAction: true,
        actionName: 'save',
        hasPopOver: true,
        popOverTitle: 'Are you sure ?',
        placement: 'top',
        target: 'sharedLibrary',
        popOverComponent: <CalendarPopOver save={this.updateCalendarSetting.bind(this)} />,
        actionComponent: PopoverActionIcon,
        handler: this.portfolioShareHandler.bind(this),
      });
    }
    export const genericPortfolioAccordionConfig = {
      id: 'portfolioAccordion',
      panelItems: [
        {
          'title': 'Actions',
          isText: false,
          style: { 'background': '#ef4647' },
          contentComponent: <MlAppActionComponent
            resourceDetails={{ resourceId: 'calendar', resourceType: 'calendar' }}   //resource id need to be given
            actionOptions={appActionConfig} />
        }]
    };
    return (
      <div className="step_form_wrap step1">
        <ScrollArea speed={0.8} className="step_form_wrap" smoothScrolling={true} default={true} >
          <form className="calendar-settings">
            <div className="form-group">
              <label>
                <FontAwesome name="clock-o" className="fa-2x" />
                Slot duration: &nbsp;
              <input type="number" onChange={(evt) => this.updateSlotDuration(evt, 'hours')} value={(this.state.slotDuration.hours ? this.state.slotDuration.hours : '')} className="form-control inline_input" /> Hours
              <input type="number" onChange={(evt) => this.updateSlotDuration(evt, 'minutes')} value={(this.state.slotDuration.minutes ? this.state.slotDuration.minutes : '')} className="form-control inline_input" /> Mins
            </label>
            </div>
            <div className="form-group">
              <label>
                {/*<FontAwesome name="clock-o"/>*/}
                <span className="ml my-ml-calendar fa-2x" />
                Number of Appointments per slot: &nbsp;
              <input type="number" onChange={(evt) => this.updateAppointmentCountPerSlots(evt)} value={(this.state.appointmentCountPerSlots ? this.state.appointmentCountPerSlots : '')} className="form-control inline_input" />
              </label>
            </div>
            {/*<div className="form-group">*/}
            {/*<label>*/}
            {/*<FontAwesome name="clock-o"/>*/}
            {/*Time slots per break-up time: &nbsp;*/}
            {/*<input type="number" onChange={(evt)=>this.updateSlotBreakTime(evt)} value={(this.state.slotBreakTime ? this.state.slotBreakTime : '')} className="form-control inline_input"/>*/}
            {/*</label>*/}
            {/*</div>*/}
            <div className="form-group switch_wrap switch_names inline_switch small_sw">
              <label style={{ 'marginLeft': '0px' }}>
                {/*<FontAwesome name="clock-o"/>*/}
                <span className="ml my-ml-switch_profile-01 fa-2x" />
                Overlapping in schedule</label>
              <span className={!this.state.isOverlappingSchedule ? "state_label acLabel" : "state_label" }>No</span><label className="switch nocolor-switch">
                <input type="checkbox" onClick={(evt) => this.updateOverlappingSchedule(evt)} checked={this.state.isOverlappingSchedule} />
                <div className="slider"></div>
              </label>
              <span className={this.state.isOverlappingSchedule ? "state_label acLabel" : "state_label" }>Yes</span>
            </div>
            <div className="clearfix"></div>
          </form>
          {/*<div className="form-group">
          <div className="ml_btn" style={{'textAlign':'center'}}>
            <button onClick={()=>this.updateCalendarSetting()} className="save_btn" >Save</button>
          </div>
        </div>*/}
        </ScrollArea>
        <MlAccordion accordionOptions={genericPortfolioAccordionConfig} {...this.props} />
      </div>
    )
  }
};

export default MlAppSetCalendarPrimarySettings = formHandler()(MlAppCalendarPrimarySettings);
