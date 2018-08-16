/**
 * Created by pankaj on 5/7/17.
 */

import React, { Component } from 'react';
import FontAwesome from 'react-fontawesome';
import ScrollArea from 'react-scrollbar';
import Datetime from "react-datetime";
import Moment from 'moment';
import { isEmpty } from 'lodash';
import { updateCalendarVacationActionHandler, updateCalendarVacationByIdActionHandler } from '../actions/updateCalendarVacationSettings';
import MlAccordion from "../../../../commons/components/MlAccordion";
import formHandler from "../../../../../commons/containers/MlFormHandler";
import MlAppActionComponent from "../../../../commons/components/MlAppActionComponent";

class MlAppSetCalendarVacation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      vacations: props.vacations,
      selectedVacation: '',
      vacationData: {
        startTime: '',
        startDate: '',
        endTime: '',
        endDate: '',
        note: '',
        type: 'holiday',
        isAllowBooking: false,
        isAutoCancelAppointment: false
      }
    };
    this.errorMessages = {
      startTime: 'Start Time',
      startDate: 'Start Date',
      endTime: 'End Time',
      endDate: 'End Date',
      note: 'Vacation Name',
      type: 'Break Type'
    };
    this.breakTypes = [
      {name: 'holiday'},
      {name: 'travel'}
    ];
  }

  componentDidMount() {
    $('.float-label').jvFloat();
    var WinHeight = $(window).height();
    $('.step_form_wrap').height(WinHeight-(290+$('.app_header').outerHeight(true)));
  }
  componentWillUpdate() {
    $('.float-label').jvFloat();
  }

  componentWillReceiveProps(newProps) {
    // console.log('props', newProps);
    // let vacationData = {
    //   startTime: '',
    //   startDate: '',
    //   endTime: '',
    //   endDate: '',
    //   note: '',
    //   type: 'holiday',
    //   isAllowBooking: false,
    //   isAutoCancelAppointment: false
    // };
    this.setState({vacations: newProps.vacations, selectedVacation: ''
      // , vacationData: vacationData
    });
  }

  /**
   * selectDate() --> set the selected date
   * @param dateValue --> current changed value
   * @param isStartDate --> checked for start or end
   */
  selectDate(dateValue, isStartDate) {
    let vacationData = this.state.vacationData;
    if (dateValue) {
      if (isStartDate) {
        vacationData.startDate = new Moment(dateValue, 'DD-MM-YYYY').format('DD-MM-YYYY');
      } else {
        vacationData.endDate = new Moment(dateValue, 'DD-MM-YYYY').format('DD-MM-YYYY');
      }
    }
    this.setState({ vacationData: vacationData })
  }

  /**
   * selectTime() --> set the selected time
   * @param timeValue --> current changed value
   * @param isStartTime --> checked for start or end
   */
  selectTime(timeValue, isStartTime) {
    let vacationData = this.state.vacationData;
    if (timeValue) {
      if (isStartTime) {
        vacationData.startTime = new Moment(timeValue).format('HH:mm:ss');
      } else {
        vacationData.endTime = new Moment(timeValue).format('HH:mm:ss');
      }
    }
    this.setState({ vacationData: vacationData })
  }

  /**
   * showResponseMsg() --> error(s) or success(es) msg(s) to show
   * @param response --> error(s) or success(es) msg(s), getting from server or client
   */
  showResponseMsg(response) {
    if(response.success){
      toastr.success(response.result);
      this.props.fetchCalendarSettings();
    } else {
      toastr.error(response.result);
    }
  }

  /**
   * loadBreakTypes() --> load break types
   * @returns {Array} --> list of load break types
   */
  loadBreakTypes() {
    let breakTypesOption = [];
    this.breakTypes.map((breakType, index) => {
      return (
        breakTypesOption.push(
          <option key={index} value={breakType.name}>
            {breakType.name}
          </option>
        )
      )
    });
    return breakTypesOption;
  }

  /**
   * onChangeFieldValue() --> set current changed values in form
   * @param event --> get the changed value
   */
  onChangeFieldValue(event) {
    const { id, value } = event.target;
    let { vacationData } = this.state;
    if (id === 'note') {
      vacationData.note = value;
    } else {
      vacationData.type = value;
    }
    this.setState({ vacationData: vacationData });
  }

  /**
   * validateFormFields() --> validate input and datetime fields
   */
  validateFormFields() {
    let { vacationData } = this.state;
    this.isValidTime = true;
    let errorFields = [];
    Object.keys(vacationData).forEach((field) => {
      if (field !== 'isAllowBooking' && field !== 'isAutoCancelAppointment' && !vacationData[field] && isEmpty(vacationData[field])) {
        errorFields.push(this.errorMessages[field]);
        this.isValid = false;
      }
    });
    let errorMsg = errorFields[0];
    if (errorFields && errorFields.length > 1) {
      errorFields.forEach((errorField, index) => {
        if (index !== 0) {
          errorMsg += ', ' + errorField;
        }
      });
      toastr.error(`${errorMsg} are required`);
      return;
    } else if (errorMsg) {
      toastr.error(`${errorMsg} is required`);
      return;
    }
    if (this.isValid) {
      if (this.state.selectedVacation) {
        vacationData.startDate = (typeof vacationData.startDate === 'object') ? new Moment(vacationData.startDate).format('DD-MM-YYYY') : vacationData.startDate;
        vacationData.startTime = (typeof vacationData.startTime === 'object') ? new Moment(vacationData.startTime).format('HH:mm:ss') : vacationData.startTime;
        vacationData.endDate = (typeof vacationData.endDate === 'object') ? new Moment(vacationData.endDate).format('DD-MM-YYYY') : vacationData.endDate;
        vacationData.endTime = (typeof vacationData.endTime === 'object') ? new Moment(vacationData.endTime).format('HH:mm:ss') : vacationData.endTime;
      }
      let start = new Moment(vacationData.startDate + ' ' + vacationData.startTime, Meteor.settings.public.dateFormat);
      let end = new Moment(vacationData.endDate + ' ' + vacationData.endTime, Meteor.settings.public.dateFormat);
      this.isValidTime = new Moment(end, Meteor.settings.public.dateFormat).isSameOrAfter(new Moment(start, Meteor.settings.public.dateFormat));
      if (!this.isValidTime) {
        toastr.error('Start datetime must be less than end datetime');
        this.isValid = false;
        return;
      } else if (vacationData.startTime === vacationData.endTime) {
        toastr.error(`Start time and End time must be different `);
        this.isValid = false;
        return;
      } else {
        this.validVacationData.start = start;
        this.validVacationData.end = end;
        this.validVacationData.isActive = true;
        this.validVacationData.type = vacationData.type;
        this.validVacationData.note = vacationData.note;
        this.validVacationData.isAllowBooking = vacationData.isAllowBooking;
        this.validVacationData.isAutoCancelAppointment = vacationData.isAutoCancelAppointment;
      }
    }

  }

  /**
   * updateCalendarVacation() --> updated data to save in db
   * @param event --> control the form data in view layer
   * @returns {Promise.<void>}
   */
  async updateCalendarVacation(event) {
    // event.preventDefault();
    this.isValid = true;
    this.validVacationData = {};
    this.validateFormFields();
    if (this.isValid) {
      let response = '';
      let profileId = FlowRouter.getParam('profileId');
      if (this.state.selectedVacation) {
        response = await updateCalendarVacationByIdActionHandler(profileId, this.validVacationData, this.state.selectedVacation,
          this.state.vacationData.isAutoCancelAppointment);
        this.props.updateVacationList();
        this.showResponseMsg(response);
      } else {
        response = await updateCalendarVacationActionHandler(profileId, this.validVacationData,this.state.vacationData.isAutoCancelAppointment);
        this.props.updateVacationList();
        this.showResponseMsg(response);
      }
    }
  }

  validDate(current) {
    let yesterday = Datetime.moment().subtract(1, 'day');
    return current.isAfter(yesterday);
  }

  selectVacation(vacationData){
    let vacation = vacationData ? vacationData : {};
    let data ={
      startTime: vacation.start ? new Date(vacation.start) : '',
      startDate: vacation.start ? new Date(vacation.start) : '',
      endTime: vacation.end ? new Date(vacation.end) : '',
      endDate: vacation.end ? new Date(vacation.end) : '',
      note: vacation.note ? vacation.note : '',
      type: vacation.type ? vacation.type : 'holiday',
      isAllowBooking: vacation.isAllowBooking,
      isAutoCancelAppointment: vacation.isAutoCancelAppointment
    };
    this.setState({
      vacationData: data,
      selectedVacation: vacation.vacationId
    });
  }

  onChangeCheckboxFields(event) {
    const vacationData = this.state.vacationData;
    const name = event.target.name;
    const value = event.target.checked;
    vacationData[name] = value;
    this.setState({vacationData: vacationData});
  }

  render(){
    const { vacationData } = this.state;
    const that = this;
    /**
     * Setting up action handler for activity different event
     */
    let appActionConfig = [
      {
        showAction: true,
        actionName: 'save',
        handler: async(event) => that.props.handler(that.updateCalendarVacation.bind(this))
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
            resourceDetails={{resourceId: 'calendarpriming', resourceType: 'calendarpriming'}}   //resource id need to be given
            actionOptions={appActionConfig}/>
        }]
    };
    return (
      <div className="step_form_wrap step3">
        <ScrollArea speed={0.8} className="step_form_wrap" smoothScrolling={true} default={true} >
          <div className="wrap_left" style={{"height":"365px"}}>
            <div className="col-md-6 nopadding-left">
            <form>
              <div className="form-group">
                <span className="placeHolder active">Choose break type</span>
                <select id="breaktype" className="form-control" onChange={(event) => this.onChangeFieldValue(event)} value={that.state.vacationData.type}>
                  {this.breakTypes && this.loadBreakTypes()}
                </select>
              </div>
              <div className="form-group">
                <Datetime dateFormat={'DD-MM-YYYY'} timeFormat={false}
                          value={vacationData.startDate}
                          isValidDate={(current) => this.validDate(current)}
                          onChange={(event) => this.selectDate(event, true)}
                          inputProps={{ placeholder: 'Start date', className:"form-control float-label",readOnly:true}}/>
              </div>
              <div className="form-group">
                <Datetime dateFormat={false} timeFormat={'HH:mm:ss'}
                          value={vacationData.startTime}
                          onChange={(event) => this.selectTime(event, true)}
                          inputProps={{ placeholder: 'Start time in HH:mm:ss', className:"form-control float-label",readOnly:true}}/>
              </div>
              <div className="form-group">
                <div className="input_types">
                  <input id="isAllowBooking" type="checkbox" name="isAllowBooking"
                         checked={vacationData.isAllowBooking}
                         onChange={(event) => this.onChangeCheckboxFields(event)}/>
                  <label htmlFor="isAllowBooking"><span><span></span></span>Allow booking on start date & end date</label>
                </div>
                <br className="brclear"/>
              </div>
            </form>
          </div>
            <div className="col-md-6 nopadding-right">
            <form>
              <div className="form-group">
                <input className="form-control float-label"
                       id="note"
                       placeholder="Vacation name"
                       value={vacationData.note}
                       onChange={(event) => this.onChangeFieldValue(event)}/>
              </div>
              <div className="form-group">
                <Datetime dateFormat={'DD-MM-YYYY'} timeFormat={false}
                          value={vacationData.endDate}
                          isValidDate={(current) => this.validDate(current)}
                          onChange={(event) => this.selectDate(event, false)}
                          inputProps={{ placeholder: 'End date', className:"form-control float-label",readOnly:true}}/>
              </div>
              <div className="form-group">
                <Datetime dateFormat={false} timeFormat={'HH:mm:ss'}
                          value={vacationData.endTime}
                          onChange={(event) => this.selectTime(event, false)}
                          inputProps={{ placeholder: 'end time in HH:mm:ss', className:"form-control float-label",readOnly:true}}/>
              </div>
              <div className="form-group">
                <div className="input_types">
                  <input id="isAutoCancelAppointment" type="checkbox" name="isAutoCancelAppointment"
                         checked={vacationData.isAutoCancelAppointment}
                         onChange={(event) => this.onChangeCheckboxFields(event)}/>
                  <label htmlFor="isAutoCancelAppointment"><span><span></span></span>Auto cancel all the appointments</label>
                </div>
                <br className="brclear"/>
              </div>
            </form>
          </div>
          </div>
          <div className="wrap_right">
            <ul className="list_with_icon">
              <li className={ this.state.selectedVacation ? '' : "active" } onClick={() => that.selectVacation()} >
                <FontAwesome name='plus-circle' /><b>Add</b>
              </li>
              {this.state.vacations.map(function (vacation, index) {
                return (
                  <li className={ that.state.selectedVacation == vacation.vacationId ? 'active' : '' } key={index} onClick={() => that.selectVacation(vacation)}>
                    <span className={ vacation.type === "holiday" ?  'fa my-ml-holiday' : "fa my-ml-travel"}></span><b>{vacation.note}</b>
                  </li>
                )
              })}
            </ul>
          </div>
        </ScrollArea>
        {/*<div className="form-group">
          <div className="ml_btn" style={{'textAlign':'center'}}>
            <button onClick={(event)=>this.updateCalendarVacation(event)} className="save_btn" >Save</button>
          </div>
        </div>*/}
        <MlAccordion accordionOptions={genericPortfolioAccordionConfig} {...this.props} />
      </div>
    )
  }
};

export default MlAppSetCalendarVacation = formHandler()(MlAppSetCalendarVacation);
