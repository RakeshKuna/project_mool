/**
 * Created by pankaj on 28/6/17.
 */

import React from 'react';
import MlAppScheduleHead from "../../commons/components/MlAppScheduleHead";
import {fetchCalendarSettingsActionHandler} from '../actions/fetchCalendarSettings';
import StepZilla from "../../../../../commons/components/stepzilla/StepZilla";
import MlAppSetCalendarPrimarySettings from './MlAppSetCalendarPrimarySettings';
import MlAppSetCalendarTimmingSettings from './MlAppSetCalendarTimmingSettings';
import MlAppSetCalendarVacation from './MlAppSetCalendarVacation';

export default class MlAppSetCalendarSettings extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      primarySettings:{
        duration:{}
      },
      timingInfo : {
        lunch:[],
        slots:[]
      },
      vacations:[]
    }
    this.fetchCalendarSettings = this.fetchCalendarSettings.bind(this);
  }

  componentDidMount() {
    $('.float-label').jvFloat();
    var WinHeight = $(window).height();
    $('.step_form_wrap').height(WinHeight - (290 + $('.admin_header').outerHeight(true)));
    this.fetchCalendarSettings();
  }

  async fetchCalendarSettings() {
    let profileId = FlowRouter.getParam('profileId');
    let response = await fetchCalendarSettingsActionHandler(profileId);
    console.log('response: ',response);
    if(response){
      response.workingDays = response.workingDays ? response.workingDays : [];
      let primarySettings = {
        slotDuration: response.slotDuration,
        appointmentCountPerSlots: response.appointmentCountPerSlots,
        slotBreakTime: response.slotBreakTime,
        isOverlappingSchedule: response.isOverlappingSchedule
      };
      let timingInfo = response.workingDays;
      let vacations = response.vacations ? response.vacations : [];
      console.log(vacations);
      this.setState({
        primarySettings : primarySettings,
        timingInfo      : timingInfo,
        vacations       : vacations,
        hasAppointment  : response.hasAppointment
      });

    }
  }

  updateVacationList(){
    this.fetchCalendarSettings();
  }

  render(){
    const steps = [
        {name: 'Primary', component: <MlAppSetCalendarPrimarySettings fetchCalendarSettings={this.fetchCalendarSettings} hasAppointment={this.state.hasAppointment} primarySettings={this.state.primarySettings} />,icon:<span className="ml fa fa-file-text-o "></span>},
        {name: 'Manage', component: <MlAppSetCalendarTimmingSettings timingInfo={this.state.timingInfo} hasAppointment={this.state.hasAppointment} fetchCalendarSettings={this.fetchCalendarSettings}/>,icon:<span className="ml fa fa-calendar-plus-o"></span>},
        {name: 'Vacation', component: <MlAppSetCalendarVacation vacations={this.state.vacations} hasAppointment={this.state.hasAppointment} fetchCalendarSettings={this.fetchCalendarSettings} updateVacationList={this.updateVacationList.bind(this)}/>,icon:<span className="ml fa fa-plane"></span>},
      ]
    return (
      <div className="app_main_wrap">
        <div className="app_padding_wrap">
          <MlAppScheduleHead type="calendar"/>
          <div className="col-md-12">
            <div className='step-progress' >
              <div id="root" >
                <StepZilla steps={steps} stepsNavigation={true} showNavigation={false} prevBtnOnLastStep={false} />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
