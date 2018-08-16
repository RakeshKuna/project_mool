/**
 * Created by pankaj on 31/7/17.
 */
import React, {Component} from "react";
import { fetchSessionDayActionHandler, bookUserServiceCardAppointmentActionHandler } from '../../../../../../app/calendar/myCalendar/actions/fetchMyCalendar';
let FontAwesome = require('react-fontawesome');
import Days from "./Days.jsx";
import {  Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

export default class MlAppFunderCalendarSlots extends Component {

  constructor(props) {
    super(props);
    this.state = {
      shift:'morning',
      modalOpen: false,
      slotDetails:[],
      date: props.date ? props.date : new Date()
    };
    this.handleDateSelect = this.handleDateSelect.bind(this);
  }

  bookSlot(timeSlot, index){
    let orderId=this.props.orderId;
    let sessionId=this.props.sessionId[0];
    let time = timeSlot.split('-');
    let firstHour = time[1].split(':')
    let secondHour = time[0].split(':')
    let hours = secondHour[0]
    let minutes = secondHour[1];
    let tempObject={
      orderId: orderId,
      sessionId: sessionId,
      hours: hours,
      minutes: minutes,
      day: this.state.date.getDate(),
      month: this.state.date.getMonth(),
      year: this.state.date.getFullYear()
    };
   this.setState({
     tempObject,
     modalOpen:true
   })

  }
  onCancelAppointment(){
    this.setState({tempObject:{},modalOpen:false});
  }

  onConfirmAppointment(){
    let tempObject= this.state.tempObject;
    this.setState({tempObject:{},modalOpen:false});
    this.bookAppointment(tempObject).bind(this);
  }

  async bookAppointment(userServiceCardAppointmentInfo){
    const resp = await bookUserServiceCardAppointmentActionHandler(userServiceCardAppointmentInfo)
    if(resp && resp.success){
      toastr.success('Appointment Booked Successfully')
      this.props.componentToView('landingPage')
    } else {
      toastr.error(resp.result);
    }
    return resp;
  }

  componentDidMount() {
    this.getSessionDetails(this.state.date);
  }

  async getSessionDetails(currentDate){
    let dates =new Date(currentDate);
    let errorHandler = false;
    let orderId= this.props.orderId;
    let sessionId= this.props.sessionId[0];
    let date = dates.getDate();
    let month= dates.getMonth();
    let year=  dates.getFullYear();
    var response = await fetchSessionDayActionHandler(orderId,sessionId, date, month, year)
    if(response.length === 1) {
      response.map(function(data){
        if(data.status === 400) errorHandler = true;
      })
    }
    if(errorHandler) {
      toastr.error(response[0]['shift']);
      response = [];
    }
    if(response){
      this.setState({
        slotDetails: response
      })
    }
  }

  handleDateSelect(date) {
    this.setState({
      date: date
    }, function () {
      this.getSessionDetails(date);
    }.bind(this));
  }

  updateShift(shift){
    this.setState({
      shift: shift
    })
  }

  render() {
    const that = this;
    // const slots = this.state.slotDetails;
    let slots = that.state.slotDetails.filter( (slot) => {
      return slot.shift === that.state.shift;
    });
    const slotTimings = slots.map(function(slot, index){
      let date = new Date();
      if(slot && slot.slotTime){
        date = new Date(that.state.date);
        let startDate =  slot.slotTime.split('-')[0];
        let hours = startDate.split(':')[0];
        let minutes = startDate.split(':')[1];
        date.setHours(hours);
        date.setMinutes(minutes);
      }

      if(date.getTime() >(new Date).getTime()) {
        return (
          <div className="col-md-4 col-sm-4 col-lg-3" key={index}>
            <a href="">
              <div className="funders_list_block" onClick={that.bookSlot.bind(that, slot.slotTime, index)}>
                <h3>{slot.slotTime}</h3>
                <div className="list_icon"><span className="ml ml-moolya-symbol"></span></div>
                <div className="block_footer">
                  <span>{slot.status === 0 ? "Available" : slot.status === 1 ? "Filling Fast" : slot.status === 2 ? "Busy" : ""}</span>
                </div>
              </div>
            </a>
          </div>
        )
      } else {
        return (
          <div className="col-md-4 col-sm-4 col-lg-3" key={index}>
            <a href="">
              <div className="funders_list_block" onClick={() => toastr.error("Slot not available") }>
                <h3>{slot.slotTime}</h3>
                <div className="list_icon"><span className="ml ml-moolya-symbol"></span></div>
                <div className="block_footer">
                  <span> Not Available </span>
                </div>
              </div>
            </a>
          </div>
        );
      }
    });

    return (
      <div className="main_wrap_scroll" style={{"overflow": "hidden"}}>
        <div>
          <Modal isOpen={this.state.modalOpen} onHide={this.onClose}>
            <ModalHeader>Title</ModalHeader>
            <ModalBody>
              <div>Do you want to fix this Appintment?</div>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onClick={this.onConfirmAppointment.bind(this)}>Ok</Button>{' '}
              <Button color="secondary" onClick={this.onCancelAppointment.bind(this)}>Cancel</Button>
            </ModalFooter>
          </Modal>

        </div>
        <div className="row funders_list">
          <ul className="cal_tabs act_tab">
            <li className="col-md-4 nopadding-left" onClick={() => that.updateShift('morning') } style={{cursor: "pointer"}} >
                  <span className={ that.state.shift === "morning" ? "act_tab" : ''} >
                    <img src="/images/mor_icon.png"/> Morning
                  </span>
            </li>
            <li className="col-md-4 nopadding" onClick={() => that.updateShift('afternoon') } style={{cursor: "pointer"}} >
                  <span className={ that.state.shift === "afternoon" ? "act_tab" : ''} >
                    <img src="/images/aft_icon.png"/> Afternoon
                  </span>
            </li>
            <li className="col-md-4 nopadding-right"  onClick={() => that.updateShift('evening') } style={{cursor: "pointer"}} >
                  <span className={ that.state.shift === "evening" ? "act_tab" : ''} >
                    <img src="/images/eve_icon.png"/> Evening
                  </span>
            </li>
          </ul>
          <br className="brclear"/>
          <div className="row day_tab_content">
            {slotTimings}
          </div>
          <span className="calender_switch"><FontAwesome name="calendar"/></span>
          <div>
            <Days
              width = {that.state.width}
              onDateSelect = {that.handleDateSelect}
              startDate = { that.state.date } />
          </div>
        </div>
      </div>
    )
  }
}
