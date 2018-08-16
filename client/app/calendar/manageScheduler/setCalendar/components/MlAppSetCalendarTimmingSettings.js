/**
 * Created by pankaj on 29/6/17.
 */
import React, { Component } from 'react';
import _ from 'lodash';
import FontAwesome from 'react-fontawesome';
import ScrollArea from 'react-scrollbar';
import Moment from 'moment';
import { isEmpty, filter, cloneDeep, sortBy } from 'lodash';
import Datetime from "react-datetime";
import { initalizeFloatLabel } from '../../../../../commons/utils/formElemUtil';
import {
  updateCalendarWorkingDayActionHandler,
  updateCalendarWorkingDaysActionHandler } from '../actions/updateCalendarTimingSettings';
import MlAccordion from "../../../../commons/components/MlAccordion";
import formHandler from "../../../../../commons/containers/MlFormHandler";
import MlAppActionComponent from "../../../../commons/components/MlAppActionComponent";
import PopoverActionIcon from '../../../../../app/appActions/components/PopoverActionIcon';
import CalendarPopOver from './CalendarPopOver';

class MlAppCalendarTimmingSettings extends Component {

  constructor(props) {
    super(props);
    props.timingInfo = props.timingInfo ? props.timingInfo : {};
    this.state = {
      dayName: 1,
      isActive: ( props.timingInfo && typeof props.timingInfo.isActive == undefined) ? props.timingInfo.isActive : true,
      isCloneDisabled: false,
      slots: [],
      cloningMessage:'',
      lunch: [],
      weeksName: [{
        name: 'Mon', daysNumber: 1, isActiveWeekDay: false
      }, {
        name: 'Tue', daysNumber: 2, isActiveWeekDay: false
      }, {
        name: 'Wed', daysNumber: 3, isActiveWeekDay: false
      }, {
        name: 'Thu', daysNumber: 4, isActiveWeekDay: false
      }, {
        name: 'Fri', daysNumber: 5, isActiveWeekDay: false
      }, {
        name: 'Sat', daysNumber: 6, isActiveWeekDay: false
      }, {
        name: 'Sun', daysNumber: 0, isActiveWeekDay: false
      }],
      weekDays: {
        monday: false,
        tuesday: false,
        wednesday: false,
        thursday: false,
        friday: false,
        saturday: false,
        sunday: false,
        all: false
      }
    };
    this.getCloningMessage =this.getCloningMessage.bind(this);
    this.updateCalendarSetting = this.updateCalendarSetting.bind(this);
  }

  componentWillMount() {
    let { slots, lunch, dayName } = this.state;
    if (this.props.timingInfo && this.props.timingInfo.length > 0) {
      const timingInfo = this.props.timingInfo[0];
      slots = timingInfo.slots;
      lunch = timingInfo.lunch;
    }
    this.setLunchValues(lunch);
    this.setSlotsValues(slots);
    this.setWeekDays(dayName);
  }

  componentDidMount() {
    this.getCloningMessage();
    initalizeFloatLabel();
    var WinHeight = $(window).height();
    $('.step_form_wrap').height(WinHeight-(300+$('.app_header').outerHeight(true)));
  }

  /**
   * setLunchValues() --> set the break time duration in state object
   * @param lunch --> lunch array of object(s)
   */
  setLunchValues(lunch) {
    if(!isEmpty(lunch) && lunch && lunch.length > 0) {
      lunch = lunch.map((data) => {
        let start = data.start ? new Moment(data.start, 'HH:mm').format('HH:mm') : '';
        let end = data.end ?  new Moment(data.end, 'HH:mm').format('HH:mm') : '';
        return {
          isActive: data.isActive,
          start: start,
          end: end
        };
      });
    } else {
      lunch = [{}];
    }
    this.setState({ lunch: lunch });
  }

  /**
   * setSlotsValues() --> set the working time duration in state object
   * @param slots --> slots array of object(s)
   */
  setSlotsValues(slots) {
    if(!isEmpty(slots) && slots && slots.length > 0) {
      slots = slots.map((data) => {
        let start = data.start ? new Moment(data.start, 'HH:mm').format('HH:mm') : '';
        let end = data.end ?  new Moment(data.end, 'HH:mm').format('HH:mm') : '';
        return {
          isActive: data.isActive,
          start: start,
          end: end
        };
      });
    } else {
      slots = [{}];
    }
    this.setState({
      slots: slots,
      workEndTime: slots[slots.length -1].end
    });
  }

  /**
   * addBreak() --> add break time box
   * @param index --> index for lunch and slots array of object(s)
   */
  addBreak(index){
    let lunch = this.state.lunch;
    let slots = this.state.slots;
    lunch.splice(index+1, 0, {});
    slots.splice(index+2, 0, {});
    this.setState({
      lunch: lunch,
      slots: slots
    });
  }

  formatName(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  getCloningMessage(){
    let {weekDays,dayName}=this.state;

    let weekDaysKeys= Object.keys(weekDays);
    if(dayName===0) dayName=7;
    let currentDay = weekDaysKeys[dayName-1];
    let message = "Cloning from ";
    let prefix='';
    if(weekDays['all']){
      prefix = 'All';
    }else
      weekDaysKeys.map(day=>{
        if(weekDays[day] && currentDay !==day){
          if(prefix) prefix+=', ';
          prefix+=this.formatName(day);
        }
      });

    message += this.formatName(currentDay);
    if(prefix) {
      message += ' to ' + prefix;
    }
    this.setState({cloningMessage:message});
  }

  /**
   * updateBreakIsActive() --> update active for given break time duration
   * @param event --> set checked value or not
   * @param index --> index for lunch array of object(s)
   */
  updateBreakIsActive(event, index){
    let lunch = this.state.lunch;
    lunch[index]['isActive'] = event.target.checked;
    this.setState({
      lunch: lunch
    });
  }

  /**
   * updateBreakStartTime() --> update the current start time in break time object
   * @param value --> current changed start time
   * @param index --> index for lunch array of object(s)
   */
  updateBreakStartTime(value, index) {
    let { lunch } = this.state;
    lunch[index]['start'] = typeof value === 'object' ? new Moment(value).format('HH:mm') : value;
    this.setState({
      lunch: lunch
    });
  };

  /**
   * updateBreakEndTime() --> update the current end time in break time object
   * @param value --> current changed end time
   * @param index --> index for lunch array of object(s)
   */
  updateBreakEndTime(value, index) {
    let { lunch } = this.state;
    lunch[index]['end'] = typeof value === 'object' ? new Moment(value).format('HH:mm') : value;
    this.setState({
      lunch: lunch
    });
  };

  /**
   * updateSlotStartTime() --> update the current start time in slots time object
   * @param value --> current changed start time
   * @param index --> index for slots array of object(s)
   */
  updateSlotStartTime(value, index) {
    let { slots } = this.state;
    slots[index]['start'] = typeof value === 'object' ? new Moment(value).format('HH:mm') : value;
    this.setState({
      slots: slots
    });
  };

  /**
   * updateSlotEndTime() --> update the current end time in slots time object
   * @param value --> current changed end time
   * @param index --> index for slots array of object(s)
   */
  updateSlotEndTime(value, index) {
    let { slots, lunch } = this.state;
    let indexToUpdate = slots.length == 1 ? index - 1 : index;
    if (!lunch[0].end) {
      index -= 1;
      slots[0].isActive = true;
    }

    slots[indexToUpdate]['end'] = typeof value === 'object' ? new Moment(value).format('HH:mm') : value;

    this.setState({
      slots: slots,
      workEndTime: slots[indexToUpdate]['end']
    });
  };

  /**
   * validateBreakTime() --> add vlidation for breaktime duration
   */
  validateBreakTime() {
    let { slots, lunch, workEndTime } = this.state;
    let isRepeat = true;
    lunch.forEach((data) => {
      if (!new Moment(data.start, 'HH:mm').isValid()) {
        toastr.error('Please select valid break start time');
        this.isValidBreakTime = false;
        return
      } else if (!new Moment(data.end, 'HH:mm').isValid()) {
        toastr.error('Please select valid break end time');
        this.isValidBreakTime = false;
        return
      } else {
        this.isValidBreakTime = true;
      }
    });
    if (this.isValidBreakTime) {
      let breakStartTime, breakEndTime;
      let slotStartTime = slots[0].start ? new Moment(slots[0].start, 'HH:mm').format('HH:mm') : '';
      let slotEndTime = workEndTime ? new Moment(workEndTime, 'HH:mm').format('HH:mm') : '';
      this.isValidStartTime = new Moment(breakStartTime, 'HH:mm').isBefore(new Moment(slotStartTime, 'HH:mm'));
      this.isValidEndTime = new Moment(breakStartTime, 'HH:mm').isAfter(new Moment(slotEndTime, 'HH:mm'));
      lunch.forEach((data, index) => {
        this.isValidStartTime = new Moment(slotStartTime, 'HH:mm').isBefore(new Moment(data.start, 'HH:mm')) &&
          new Moment(slotEndTime, 'HH:mm').isAfter(new Moment(data.start, 'HH:mm'));
        this.isValidEndTime = new Moment(slotStartTime, 'HH:mm').isBefore(new Moment(data.end, 'HH:mm')) &&
          new Moment(slotEndTime, 'HH:mm').isAfter(new Moment(data.end, 'HH:mm'));
        if (!this.isValidStartTime || !this.isValidEndTime) {
          toastr.error('Please select valid time between working time');
          this.isValidBreakTime = false;
          return;
        }
        this.isValidTime = new Moment(data.start, 'HH:mm').isBefore(new Moment(data.end, 'HH:mm'));
        if (!this.isValidTime) {
          toastr.error('Start time must be less than end time');
          this.isValidBreakTime = false;
          return;
        }
        let isSame = false;
        if (isRepeat) {
          lunch.forEach((value, childIndex) => {
            if (childIndex !== index) {
              isSame = new Moment(data.start, 'HH:mm').isSame(new Moment(value.start, 'HH:mm')) &&
                new Moment(data.end, 'HH:mm').isSame(new Moment(value.end, 'HH:mm'));
              if(isSame) {
                isRepeat = false;toastr.error('Please select different break time');
                this.isValidBreakTime = false;
                isSame = false;
                return;
              }
            }
          });
        }
      });
    }
  }

  /**
   * validateSlotsTime() --> add vlidation for slots duration
   */
  validateSlotsTime() {
    const { slots, workEndTime } = this.state;
    if (!new Moment(slots[0].start, 'HH:mm').isValid()) {
      toastr.error('Please select valid slot start time');
      this.isValidSlotsTime = false;
      return
    } else if (!new Moment(workEndTime, 'HH:mm').isValid()) {
      toastr.error('Please select valid slot end time');
      this.isValidSlotsTime = false;
      return
    } else {
      this.isValidSlotsTime = new Moment(slots[0].start, 'HH:mm').isBefore(new Moment(workEndTime, 'HH:mm'));
      if (!this.isValidSlotsTime) {
        toastr.error('Start time must be less than end time');
      }
    }
  }

  /**
   * setWeekDays() --> set the selected day for view working time duration
   * @param daysNumber --> current day selected
   */
  setWeekDays(daysNumber) {
    let { weeksName ,weekDays } = this.state;

    let keys= Object.keys(weekDays); //setting all weekDays false
    keys.map((day)=>{
      weekDays[day]=false;

    });

    let currentDayIndex=0;
    weeksName.forEach((week,index) => {
      if(week.daysNumber === daysNumber) {
        week.isActiveWeekDay = true;
        currentDayIndex=index;
      } else {
        week.isActiveWeekDay = false;
      }
    });

    weekDays[keys[currentDayIndex]]=true;

    const workingTime = filter(this.props.timingInfo, {'dayName': daysNumber});
    let slots = [];
    let lunch = [];
    if (workingTime.length > 0) {
      slots = workingTime[0].slots;
      lunch = workingTime[0].lunch;
    }
    this.setState({
      weeksName: weeksName,
      weekDays:weekDays,
      dayName: daysNumber,
    }, () => {
      this.setLunchValues(lunch);
      this.setSlotsValues(slots);
      this.getCloningMessage();
    });
  }

  /**
   * setWeeksLayout() --> set the week days layout in view layer
   * @returns {XML} --> set of layout
   */
  setWeeksLayout() {
    const { weeksName, dayName } = this.state;
    const timingInfo = this.props.timingInfo;


    let currentIndex = _.findIndex(timingInfo, {dayName: dayName});
    let currentSlot={};
    if(currentIndex>-1) currentSlot=this.getStartAndEnd(timingInfo[currentIndex]);

    const listWeeks = weeksName.map((week) => {
      let mclassName='';

      let index = _.findIndex(timingInfo, {dayName: week.daysNumber});

      let mSlot = {};
      if(index>-1) mSlot = timingInfo[index];

      if(week.daysNumber ===  dayName){
        mclassName ='active sameWorkTime';
      }else if(currentSlot.start && currentSlot.end &&_.isEqual(currentSlot,  this.getStartAndEnd(mSlot))){
        mclassName='sameWorkTime';
      }
      return (
        <li key={week.daysNumber}
            className={mclassName}
            onClick={() => this.setWeekDays(week.daysNumber)}>
          {week.name}
        </li>
      )
    });
      return (
        <ul>{listWeeks}</ul>
      );
  }

  getStartAndEnd(slot){
    if(!slot || !slot.slots)
      return {};
    slot=slot.slots;
    if(slot && slot.length){
      let object={};
      object.start = slot[0].start;
      object.end = slot[slot.length-1].end;
      return object;
    }else{
      return {start:"",end:""}
    }
  }

  /**
   * setCloneActive() --> set the selected active day(s) for clone
   */
  setCloneActive() {
    const isCloneDisabled = this.state.isCloneDisabled;
    this.setState({
      isCloneDisabled: !isCloneDisabled
    });
  }

  /**
   * constructData() --> construct the updated data to save
   * @param timingInfo --> updated working time array of object(s)
   * @returns {Promise.<Array>} --> filter data
   */
  async constructData(timingInfo) {
    const workEndTime = this.state.workEndTime;
    let workingTimes = [];
    timingInfo.forEach((worktime) => {
      let lunch = filter(worktime.lunch, {'isActive': true});
      let slots = [{start: worktime.slots[0].start}];
      lunch = sortBy(lunch, ['start']);
      lunch.forEach((data, index) => {
        slots[index].end = data.start;
        slots[index].isActive = true;
        slots.push({});
        slots[index + 1].start = data.end;
      });
      slots[lunch.length].end = workEndTime;
      slots[lunch.length].isActive = true;
      worktime.slots = cloneDeep(slots);
      workingTimes.push(worktime);
    });
    return workingTimes;
  }

  /**
   * updateCalendarSetting() --> updated data to save in db
   * @param event --> control the form data in view layer
   * @returns {Promise.<void>}
   */
  async updateCalendarSetting(event) {
    //event.preventDefault();
    const { lunch, slots, isActive, dayName, weekDays } = this.state;
    this.isValidSlotsTime = true;
    this.isValidBreakTime = true;
    if (isEmpty(slots[0])) {
      toastr.error('Please set the working time');
    } else {
      this.validateSlotsTime();
      if(this.isValidSlotsTime && !isEmpty(lunch[0].end)) {
        this.validateBreakTime();
      }
      if (this.isValidSlotsTime && this.isValidBreakTime) {
        let workingTimeInfo = [];
        if (weekDays.all) {
          [0, 1, 2, 3, 4, 5, 6].forEach((field, index) => {
            let timingInfo = {};
            timingInfo.dayName = index;
            timingInfo.isActive = true;
            timingInfo.lunch = cloneDeep(lunch);
            timingInfo.slots = cloneDeep(slots);
            workingTimeInfo.push(timingInfo);
          });

        } else {
          Object.keys(weekDays).forEach((field) => {
            let timingInfo = {};
            if (weekDays[field] && field !== 'all') {
              switch(field) {
                case 'monday':
                  timingInfo.dayName = 1;
                  break;
                case 'tuesday':
                  timingInfo.dayName = 2;
                  break;
                case 'wednesday':
                  timingInfo.dayName = 3;
                  break;
                case 'thursday':
                  timingInfo.dayName = 4;
                  break;
                case 'friday':
                  timingInfo.dayName = 5;
                  break;
                case 'saturday':
                  timingInfo.dayName = 6;
                  break;
                case 'sunday':
                  timingInfo.dayName = 0;
                  break;
                default:
                // do nothing
              }
              timingInfo.isActive = true;
              timingInfo.lunch = cloneDeep(lunch);
              timingInfo.slots = cloneDeep(slots);
              workingTimeInfo.push(timingInfo);
            }
          });
        }
        let response;
        if (workingTimeInfo && workingTimeInfo.length === 0) {
          let workingDays = {
            isActive: isActive,
            dayName: dayName,
            slots: slots && slots.length > 0 ? slots : [],
            lunch: lunch && lunch.length > 0 ? lunch : []
          }
          workingTimeInfo.push(workingDays);
        }
        workingTimeInfo = await this.constructData(workingTimeInfo);
        let profileId = FlowRouter.getParam('profileId');
        if (workingTimeInfo.length > 1) {
          response = await updateCalendarWorkingDaysActionHandler(profileId, workingTimeInfo);
          this.showResponseMsg(response);
        } else {
          response = await updateCalendarWorkingDayActionHandler(profileId, workingTimeInfo[0]);
          this.showResponseMsg(response);
        }
        this.props.fetchCalendarSettings();
      }
    }
  }

  /**
   * showResponseMsg() --> error(s) or success(es) msg(s) to show
   * @param response --> error(s) or success(es) msg(s), getting from server or client
   */
  showResponseMsg(response) {
    if(response.success){
      // this.resetEnabledClone();
      toastr.success(response.result);
    } else {
      toastr.error(response.result);
    }
  }

  /**
   * Reset the selected clone days after cloning
   */
  resetEnabledClone() {
    let {isCloneDisabled, weekDays} = this.state;
    Object.keys(weekDays).forEach((field) => {
      if (weekDays[field]) {
        weekDays[field] = false;
      }
    });
    this.setState({
      isCloneDisabled: true,
      weekDays: weekDays
    });
  }
  /**
   * selectWeekDays() --> set the week days to show working and break time duration
   * @param event --> set the checked w.r.t id
   */
  selectWeekDays(event,isActiveWeekDay) {
    let {weekDays,weeksName,dayName} = this.state;
    const { id, checked } = event.target;
    if(!isActiveWeekDay){
      if(id==='all'){
        let keys = Object.keys(weekDays);
        keys.map((day,index)=>{
          if((index+1)!==dayName || dayName===8)
            weekDays[day]=checked;
        });
      }else if(!weekDays.all){
        weekDays[id] = checked;
      }
      this.setState({weekDays: weekDays},()=>{this.getCloningMessage();});
    }
  }

  portfolioShareHandler(actionConfig, handlerCallback) {
    if (handlerCallback) {//to handle the popover
      handlerCallback({});
    }
  }

  render(){
    const that = this;
    const { slots, lunch, isCloneDisabled, workEndTime, weekDays } = this.state;
    /**
     * Setting up action handler for activity different event
     */

    let appActionConfig = [];
    if( !that.props.hasAppointment ) {
      appActionConfig.push({
        showAction: true,
        actionName: 'save',
        handler: async(event) => that.props.handler(that.updateCalendarSetting.bind(this))
      });
    } else {
      appActionConfig.push({
        showAction: true,
        actionName: 'save',
        hasPopOver: true,
        popOverTitle: 'Are you sure ?',
        placement: 'top',
        target: 'sharedLibrary',
        popOverComponent: <CalendarPopOver  save={this.updateCalendarSetting.bind(this)} />,
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
          style: {'background': '#ef4647'},
          contentComponent: <MlAppActionComponent
            resourceDetails={{resourceId: 'calendartiming', resourceType: 'calendartiming'}}   //resource id need to be given
            actionOptions={appActionConfig}/>
        }]
    };
     let weeksName =this.state.weeksName;
    return (
      <div className="step_form_wrap step1">
        <ScrollArea speed={0.8} className="step_form_wrap" smoothScrolling={true} default={true} >
          <br/>
          <form>
            <div className="wrap_left">
              { lunch && lunch.map((data, index) => {
                return (
                  <div key={index}>
                    {index === 0 ?
                      <div className="col-md-6 nopadding-left">
                        <div className="panel panel-default">
                          <div className="panel-heading">Selected work timings</div>
                          <div className="panel-body">
                            <div className="form-group col-md-6 nopadding-left">
                              <Datetime dateFormat={false} timeFormat={"HH:mm"}
                                        input={true}
                                        value={ slots[index] && slots[index].start ? ( index == 0 ? slots[index].start : slots[index].end ) : '' }
                                        onChange={(evt)=>that.updateSlotStartTime(evt, index)}
                                        inputProps={{ placeholder: 'Start time in HH:mm', className:"form-control float-label",readOnly:true}}/>
                            </div>
                            <div className="form-group col-md-6 nopadding-right">
                              <Datetime dateFormat={false} timeFormat={"HH:mm"}
                                        input={true}
                                        value={ slots && workEndTime ? workEndTime : '' }
                                        onChange={(evt)=>that.updateSlotEndTime(evt, index+1)}
                                        inputProps={{ placeholder: 'End time in HH:mm', className:"form-control float-label",readOnly:true}}/>
                            </div>
                          </div>
                        </div>
                      </div>
                      : <div className="col-md-6 nopadding-left"></div> }
                    <div className="col-md-6 nopadding-right">
                      <div className="panel panel-default input_head">
                        <div className="panel-heading">
                          <div className="form-group pull-left nomargin-bottom">
                            <div className="input_types">
                              <input onChange={(evt)=>that.updateBreakIsActive(evt, index)} type="checkbox" name="check1" value="1" checked={data.isActive || false}/>
                              <label htmlFor="check1">
                          <span>
                            <span></span>
                          </span>
                                Set break time
                              </label>
                            </div>
                            <br className="brclear"/>
                          </div>
                          <span className="see-more pull-right"><a href="" onClick={()=>that.addBreak(index)}><FontAwesome name='plus'/></a></span>
                        </div>
                        <div className="panel-body">
                          <div className="form-group col-md-6 nopadding-left">
                            <Datetime dateFormat={false} timeFormat={"HH:mm"} value={data.start ? data.start : ''}
                                      input={true} onChange={(evt)=>that.updateBreakStartTime(evt, index)}
                                      inputProps={{ placeholder: 'Start time in HH:mm', className:"form-control float-label",readOnly:true}}/>
                          </div>
                          <div className="form-group col-md-6 nopadding-right">
                            <Datetime dateFormat={false} timeFormat={"HH:mm"} value={data.end ? data.end : ''}
                                      input={true} onChange={(evt, value)=>that.updateBreakEndTime(evt, index)}
                                      inputProps={{ placeholder: 'End time in HH:mm', className:"form-control float-label",readOnly:true}}/>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            <br className="brclear"/>
            <div className="panel panel-default input_head">
              <div className="panel-heading">
                <div className="form-group pull-left nomargin-bottom">
                  <div className="input_types">
                    <input id="clone" type="checkbox" name="clone" value="1"
                           checked={!isCloneDisabled}
                           onClick={() => this.setCloneActive()}/>
                    <label htmlFor="clone"><span><span></span></span>Clone the work timings</label>
                  </div>
                  <br className="brclear"/>
                </div>
              </div>
              <div className="panel-body checkbox_group">
                <div className="form-group">
                  <div className={(weekDays.monday)?'btn-group selectedDay':'btn-group'}>
                    <label htmlFor="fancy-checkbox-default" className="btn btn-default cus_btn">
                      <div className="input_types">
                        <input id="monday" type="checkbox" name="monday" value="1" disabled={isCloneDisabled}
                               checked={weekDays.monday}
                               onClick={(event) => this.selectWeekDays(event,weeksName[0].isActiveWeekDay)}/>
                        <label htmlFor="monday"><span><span></span></span></label>
                      </div>
                    </label>
                    <label htmlFor="fancy-checkbox-default" className={(this.state.dayName === 1)?"btn btn-danger active":"btn btn-primary active"}>
                      Monday
                    </label>
                  </div>
                </div>
                <div className="form-group">
                  <div className={(weekDays.tuesday)?'btn-group selectedDay':'btn-group'}>
                    <label htmlFor="fancy-checkbox-default" className="btn btn-default cus_btn">
                      <div className="input_types">
                        <input id="tuesday" type="checkbox" name="tuesday" value="1" disabled={isCloneDisabled}
                               checked={weekDays.tuesday}
                               onClick={(event) => this.selectWeekDays(event,weeksName[1].isActiveWeekDay)}/>
                        <label htmlFor="tuesday"><span><span></span></span></label>
                      </div>
                    </label>
                    <label htmlFor="fancy-checkbox-default" className={(this.state.dayName === 2)?"btn btn-danger active":"btn btn-success active"}>
                      Tuesday
                    </label>
                  </div>
                </div>
                <div className="form-group">
                  <div className={(weekDays.wednesday)?'btn-group selectedDay':'btn-group'}>
                    <label htmlFor="fancy-checkbox-default" className="btn btn-default cus_btn">
                      <div className="input_types">
                        <input id="wednesday" type="checkbox" name="wednesday" value="1" disabled={isCloneDisabled}
                               checked={weekDays.wednesday}
                               onClick={(event) => this.selectWeekDays(event,weeksName[2].isActiveWeekDay)}/>
                        <label htmlFor="wednesday"><span><span></span></span></label>
                      </div>
                    </label>
                    <label htmlFor="fancy-checkbox-default" className={(this.state.dayName === 3)?"btn btn-danger active":"btn btn-info active"}>
                      Wednesday
                    </label>
                  </div>
                </div>
                <div className="form-group">
                  <div className={(weekDays.thursday)?'btn-group selectedDay':'btn-group'}>
                    <label htmlFor="fancy-checkbox-default" className="btn btn-default cus_btn">
                      <div className="input_types">
                        <input id="thursday" type="checkbox" name="thursday" value="1" disabled={isCloneDisabled}
                               checked={weekDays.thursday}
                               onClick={(event) => this.selectWeekDays(event,weeksName[3].isActiveWeekDay)}/>
                        <label htmlFor="thursday"><span><span></span></span></label>
                      </div>
                    </label>
                    <label htmlFor="fancy-checkbox-default" className={(this.state.dayName === 4)?"btn btn-danger active":"btn btn-warning active"}>
                      Thursday
                    </label>
                  </div>
                </div>
                <div className="form-group">
                  <div className={(weekDays.friday)?'btn-group selectedDay':'btn-group'}>
                    <label htmlFor="fancy-checkbox-default" className="btn btn-default cus_btn">
                      <div className="input_types">
                        <input id="friday" type="checkbox" name="friday" value="1" disabled={isCloneDisabled}
                               checked={weekDays.friday}
                               onClick={(event) => this.selectWeekDays(event,weeksName[4].isActiveWeekDay)}/>
                        <label htmlFor="friday"><span><span></span></span></label>
                      </div>
                    </label>
                    <label htmlFor="fancy-checkbox-default" className={(this.state.dayName === 5)?"btn btn-danger active":"btn btn-primary active"}>
                      Friday
                    </label>
                  </div>
                </div>
                <div className="form-group">
                  <div className={(weekDays.saturday)?'btn-group selectedDay':'btn-group'}>
                    <label htmlFor="fancy-checkbox-default" className="btn btn-default cus_btn">
                      <div className="input_types">
                        <input id="saturday" type="checkbox" name="saturday" value="1" disabled={isCloneDisabled}
                               checked={weekDays.saturday}
                               onClick={(event) => this.selectWeekDays(event,weeksName[5].isActiveWeekDay)}/>
                        <label htmlFor="saturday"><span><span></span></span></label>
                      </div>
                    </label>
                    <label htmlFor="fancy-checkbox-default" className={(this.state.dayName === 6)?"btn btn-danger active":"btn btn-success active"}>
                      Saturday
                    </label>
                  </div>
                </div>
                <div className="form-group">
                  <div className={(weekDays.sunday)?'btn-group selectedDay':'btn-group'}>
                    <label htmlFor="fancy-checkbox-default" className="btn btn-default cus_btn">
                      <div className="input_types">
                        <input id="sunday" type="checkbox" name="sunday" value="1" disabled={isCloneDisabled}
                               checked={weekDays.sunday}
                               onClick={(event) => this.selectWeekDays(event,weeksName[6].isActiveWeekDay)}/>
                        <label htmlFor="sunday"><span><span></span></span></label>
                      </div>
                    </label>
                    <label htmlFor="fancy-checkbox-default" className={(this.state.dayName === 0)?"btn btn-danger active":"btn btn-info active"}>
                      Sunday
                    </label>
                  </div>
                </div>
                <div className="form-group">
                  <div className="btn-group">
                    <label htmlFor="fancy-checkbox-default" className="btn btn-default cus_btn">
                      <div className="input_types">
                        <input id="all" type="checkbox" name="all" value="1" disabled={isCloneDisabled}
                               checked={weekDays.all}
                               onClick={(event) => this.selectWeekDays(event)}/>
                        <label htmlFor="all"><span><span></span></span></label>
                      </div>
                    </label>
                    <label htmlFor="fancy-checkbox-default" className="btn btn-default active">
                      All Days
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div>{this.state.cloningMessage}</div>
            </div>
          </form>

          <div className="wrap_right">
            {this.setWeeksLayout()}
          </div>
        </ScrollArea>
        {/*<div className="form-group">
          <div className="ml_btn" style={{'textAlign':'center'}}>
            <button onClick={(event)=>this.updateCalendarSetting(event)} className="save_btn" >Save</button>
          </div>
        </div>*/}
        <MlAccordion accordionOptions={genericPortfolioAccordionConfig} {...this.props} />
      </div>
    )
  }
};

export default MlAppSetCalendarTimmingSettings = formHandler()(MlAppCalendarTimmingSettings);
