/**
 * Service basic info component
 * @Author :: Mukhil P
 * @Dated :: 20/06/2017
 */

// import NPM module(s)
import React, { Component } from 'react';
import Moolyaselect from "../../../commons/components/MlAppSelectWrapper";
import FontAwesome from 'react-fontawesome';
import ScrollArea from 'react-scrollbar';
import { Scrollbars } from 'react-custom-scrollbars';
import gql from 'graphql-tag';
import moment from "moment";
var Select = require('react-select');
import { graphql } from 'react-apollo';
 import { fetchServiceSeekerHandler } from '../../../calendar/myCalendar/actions/appointmentCount'
import { bookUserServiceCardAppointmentActionHandler } from '../../../calendar/myCalendar/actions/fetchMyCalendar'



// import custom method(s) and component(s)
// import {
//   createServiceActionHandler,
//   fetchServiceActionHandler,
//   updateServiceActionHandler } from '../actions/MlServiceActionHandler';
// import Moolyaselect from '../../../../commons/components/MlAppSelectWrapper';

class Step1 extends Component {

  constructor(props) {
    super(props);
    this.state={service:"", serviceSeeker:[], seeker: this.props.seviceSeeker, orderId:""};
    this.testQuery.bind(this);
    this.saveData.bind(this);
  }

  componentWillMount() {
    this.props.activeComponent('BasicInfo');
  }
  //
  // componentWillUpdate() {
  //   if(this.state.orderId)
  //   let date = this.props.appointmentDate;
  //   let day = date.getDate();
  //   let month = date.getMonth();
  //   let year = date.getFullYear();
  //   let hours = date.getHours();
  //   let minutes = date.getMinutes();
  //   let data = {
  //     orderId: this.state.orderId?this.state.orderId:"dd ",
  //     sessionId: "ddd ",
  //     hours: hours,
  //     minutes: minutes,
  //     day: day,
  //     month: month,
  //     year: year
  //   }
  //   this.bookDetails(data)
  // }

  componentDidMount() {
    $('.float-label').jvFloat();
    var WinHeight = $(window).height();
    $('.step_form_wrap').height(WinHeight-(310+$('.app_header').outerHeight(true)));
    this.testQuery();
  }

  saveData() {
    let date = this.props.appointmentDate;
    let day = date.getDate();
    let month = date.getMonth();
    let year = date.getFullYear();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let data = {
        orderId: this.state.orderId,
        sessionId: "ddd ",
        hours: hours,
        minutes: minutes,
        day: day,
        month: month,
        year: year
}
this.bookDetails(data)

  }

   bookDetails(data) {
    this.props.bookDetails(data)


    // const resp = await bookUserServiceCardAppointmentActionHandler(data);
    // console.log(resp)
  }


  /**
   * Method :: validTillToggle
   * Desc :: set the toggle date time picker
   */
  // validTillToggle(){
  //   $('#date-time').toggleClass('rdtOpen');
  // }
  //
  // validDate(current) {
  //   let yesterday = Datetime.moment().subtract(1, 'day');
  //   return current.isAfter(yesterday);
  // }
  /**
   * Method :: React render
   * Desc :: Showing html page
   * @returns {XML}`
   */

  componentWillReceiveProps(newProps) {
    this.setState({serviceId: newProps.serviceId})
    if(newProps.serviceId) {
      this.testQuery()
    }
  }

 async testQuery() {
    if(this.props.serviceId) {
      const resp = await fetchServiceSeekerHandler(this.props.profileId, this.props.serviceId);
      this.setState({ serviceSeeker: resp})
    } else {
      const resp = await fetchServiceSeekerHandler(this.props.profileId);
      this.setState({ serviceSeeker: resp})
    }
  }

  serviceSeeker() {
    let seekers =  this.state.serviceSeeker || []
    let seekerList = [];
    seekers.map(function(data){
      seekerList.push({value: data.orderId, label: data.name + ' ' + data.transId })
      })
    return seekerList;
  }

  onSelectSeeker (selectedSeeker) {
    let that = this;
    let seekers =  this.state.serviceSeeker || [];
    let currentSeeker = seekers.find(function (data) {
      return data.orderId == selectedSeeker.value;
    });
    // seekers.map(function(data, index) {
    //   if(selectedSeeker.value === data.transId){

      // }
    // })
    that.setState({
      orderId:  selectedSeeker.value,
      seeker: selectedSeeker,
      service: currentSeeker ? currentSeeker.serviceId : ''
    }, function () {
      let date = this.props.appointmentDate;
      let day = date.getDate();
      let month = date.getMonth();
      let year = date.getFullYear();
      let hours = date.getHours();
      let minutes = date.getMinutes();
      let data = {
        orderId: this.state.orderId,
        sessionId: "",
        hours: hours,
        minutes: minutes,
        day: day,
        month: month,
        year: year
      };
      console.log('Data :',data);
      this.bookDetails(data);
      this.props.selectedServiceSeeker(selectedSeeker);
      this.props.setSessionId('');
      if(currentSeeker.serviceId){
        this.props.selectedService(currentSeeker.serviceId);
      }
    }.bind(this));

    // this.saveData()
  }

  selectedService(value) {
    this.setState({
      service: value,
      seeker:''
    });
    this.props.selectedService(value)
  }


  render(){
    let getServiceQuery = gql`
      query($profileId:String) {
        data:fetchServicesForAppointments(profileId: $profileId) {
          value:_id
          label:name
        }
      }
    `;
    let serviceOption = {
      options: {
        variables: {
          profileId: this.props.profileId
        }
      }
    };

    const {onChangeSteps, isTaskComponent} = this.props;
    return (
      <div className="step_form_wrap step1">
        <Scrollbars
          speed={0.8}
          className="step_form_wrap"
        >
          <br/><div className="col-lg-12">
            <div className="app_padding_wrap">
              <div className="col-md-12">
                <div className="col-md-6 nopadding-left">
                  <div className="form-group switch_wrap switch_names">
                    <span className="state_label">Service Card</span>
                    <label className="switch nocolor-switch">
                      <input type="checkbox"
                             value="1"
                             checked={isTaskComponent}
                             onChange={() => onChangeSteps()} />
                      <div className="slider"></div>
                    </label>
                    <span className="state_label acLabel">Task</span>
                  </div><br className="brclear"/>

                  <div className="form-group">
                    <Select name="form-field-name" className="float-label" options={this.serviceSeeker()} placeholder="Choose Service Seeker" onChange={this.onSelectSeeker.bind(this)} value={this.state.seeker}/>
                  </div>
                  <div className="form-group">
                    <label>Total number of Sessions
                      <input className="form-control inline_input" value={this.props.serviceBasicInfo.noOfSession}/>
                    </label>
                  </div>
                  <div className="form-group" id="date-time">
                    <input  type="text" className="form-control" placeholder= "Valid Till" value={moment(this.props.serviceBasicInfo.validTill).format('DD-MM-YYYY')}/>
                    <FontAwesome name="calendar" className="password_icon"/>
                  </div>
                  <div className="form-group">
                    <label>Duration: &nbsp;
                      <input type="text"
                             className="form-control inline_input" value={this.props.serviceBasicInfo.duration.hours}
                             disabled={true}/> Hours
                      <input type="text"
                             className="form-control inline_input" value={this.props.serviceBasicInfo.duration.minutes}
                             disabled={true}/> Mins
                    </label>
                  </div>

                  {/*<div className="form-group">*/}
                    {/*<input className="form-control float-label" placeholder="Task name"/>*/}
                  {/*</div>*/}
                  {/*<div className="form-group">*/}
                    {/*<select className="form-control"><option>Select the task to be done</option></select>*/}
                  {/*</div>*/}
                  {/*<div className="form-group">*/}
                    {/*<div className="input_types">*/}
                      {/*<input id="radio1" type="radio" name="radio" value="1"/><label htmlFor="radio1"><span><span></span></span>Offline</label>*/}
                    {/*</div>*/}
                    {/*<div className="input_types">*/}
                      {/*<input id="radio2" type="radio" name="radio" value="2"/><label htmlFor="radio2"><span><span></span></span>Online</label>*/}
                    {/*</div>*/}
                    {/*<br className="brclear"/>*/}
                  {/*</div>*/}


                </div>
                <div className="col-md-6 nopadding-right">
                  <div className="form-group switch_wrap inline_switch">
                    <label>Recurring</label>
                    <label className="switch">
                      <input type="checkbox" />
                      <div className="slider"></div>
                    </label>
                    <label>New</label>
                  </div>
                  <div className="form-group">
                    <Moolyaselect
                      multiSelect={false}
                      placeholder="Select Service"
                      className="form-control float-label"
                      valueKey={'value'} labelKey={'label'}
                      selectedValue={this.state.service}
                      disabled={true}
                      isDynamic={true}
                      queryType={'graphql'}
                      queryOptions={serviceOption}
                      query={getServiceQuery}
                      onSelect={this.selectedService.bind(this)}
                    />
                  </div>
                  <div className="form-group">
                    <input type="text" className="form-control"  placeholder= "Frequency" value={this.props.serviceBasicInfo.sessionFrequency} />
                  </div>
                  {/*<div className="form-group">*/}
                    {/*<div className="input_types">*/}
                      {/*<label>Set Priority</label>*/}
                      {/*<input id="radio3" type="radio" name="radio2" value="1"/><label htmlFor="radio3"><span><span></span></span>Low</label>*/}
                    {/*</div>*/}
                    {/*<div className="input_types">*/}
                      {/*<input id="radio4" type="radio" name="radio2" value="2"/><label htmlFor="radio4"><span><span></span></span>Medium</label>*/}
                    {/*</div>*/}
                    {/*<div className="input_types">*/}
                      {/*<input id="radio5" type="radio" name="radio2" value="2"/><label htmlFor="radio5"><span><span></span></span>High</label>*/}
                    {/*</div>*/}
                    {/*<br className="brclear"/>*/}
                  {/*</div>*/}
                  <div className="form-group">
                    <label>
                      Service expires &nbsp;
                      <input type="text" className="form-control inline_input" value={this.props.serviceBasicInfo.daysToExpire}/>
                      days from the date of purchase
                    </label>
                  </div>
                </div>
                <br className="brclear"/>
                {/*<div className="panel panel-default library-wrap">*/}
                  {/*<div className="panel-heading"> Attendees <span className="pull-right"><input type="text"/> </span></div>*/}
                  {/*<div className="panel-body nopadding">*/}
                    {/*<div className="col-md-4 att_groups nopadding">*/}
                    {/*</div>*/}
                    {/*<div className="col-md-8 att_members">*/}
                      {/*<ul className="users_list">*/}
                        {/*<li>*/}
                          {/*<a href="">*/}
                            {/*<img src="/images/p_3.jpg" /><br />*/}
                            {/*<div className="tooltiprefer">*/}
                              {/*<span>Venu<br/>Rs.3000</span>*/}
                            {/*</div>*/}
                          {/*</a>*/}
                        {/*</li>*/}
                        {/*<li>*/}
                          {/*<a href="">*/}
                            {/*<img src="/images/p_34.jpg" /><br />*/}
                            {/*<div className="tooltiprefer">*/}
                              {/*<span>Ramya<br/>Rs.5000</span>*/}
                            {/*</div>*/}
                          {/*</a>*/}
                        {/*</li>*/}
                        {/*<li>*/}
                          {/*<a href="">*/}
                            {/*<img src="/images/p_13.jpg" /><br />*/}
                            {/*<div className="tooltiprefer">*/}
                              {/*<span>Sameer<br/>Rs.8000</span>*/}
                            {/*</div>*/}
                          {/*</a>*/}
                        {/*</li>*/}
                        {/*<li>*/}
                          {/*<a href="">*/}
                            {/*<img src="/images/p_1.jpg" /><br />*/}
                            {/*<div className="tooltiprefer">*/}
                              {/*<span>Usha<br/>Rs.6000</span>*/}
                            {/*</div>*/}
                          {/*</a>*/}
                        {/*</li>*/}
                      {/*</ul>*/}
                    {/*</div>*/}
                  {/*</div>*/}
                {/*</div>*/}
                {/*<div className="form-group pull-left">*/}
                  {/*<div className="input_types">*/}
                    {/*<input id="radio6" type="radio" name="radio3" value="1"/><label htmlFor="radio6"><span><span></span></span>Make Public</label>*/}
                  {/*</div>*/}
                  {/*<div className="input_types">*/}
                    {/*<input id="radio7" type="radio" name="radio3" value="2"/><label htmlFor="radio7"><span><span></span></span>Make Private</label>*/}
                  {/*</div>*/}
                  {/*<br className="brclear"/>*/}
                {/*</div>*/}
                <div className="pull-right">
                  <div className="ml_btn large_btn">
                    <a href="" className="save_btn" style={{'width': 'auto'}}>Total Amount {this.props.serviceBasicInfo.payment && this.props.serviceBasicInfo.payment.currencyType ? this.props.serviceBasicInfo.payment.currencyType: "Rs."}{this.props.serviceBasicInfo.totalAmount}/-</a>
                  </div>
                </div>
                <br className="brclear"/><br className="brclear"/>
                {/*<div className="ml_btn btn_wrap">*/}
                  {/*<div href="" className="save_btn" onClick={this.saveData.bind(this)}>Save</div> <a href="" className="cancel_btn">Cancel</a>*/}
                {/*</div>*/}
              </div>
            </div>
          </div>
        </Scrollbars>
      </div>
    )
  }
};

export default Step1;
