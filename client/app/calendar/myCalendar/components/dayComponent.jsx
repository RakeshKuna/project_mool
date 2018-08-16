/**
 * Created by pankaj on 21/7/17.
 */

import React, {Component} from "react";
import moment from "moment";
import {fetchSessionDayActionHandler } from '../../../../app/calendar/myCalendar/actions/fetchMyCalendar';

export default class MlAppMyCalendarDayComponent extends Component {

  constructor(props){
    super(props)
    this.state={
      status: null
    }
  }

  componentWillMount(){
    console.log(this.props)
    let that = this;
    let calendarInfo = this.props.dayData.days;
    let dayDate = new Date(this.props.calendar.value);
    if(calendarInfo.length>0){
      calendarInfo.map(function(info){
        let date = new Date(info.date);
        if( date.getDate() == dayDate.getDate() && date.getMonth() == dayDate.getMonth() ){
          that.setState({status: info.status});
        }
        // if(info.date === this.props.calendar.value){
        //   let status = info.status
        //
        // }
      })
    }
  }

  dayClick(){
    let portfolioId = FlowRouter.getParam('portfolioId')
    console.log(this.props)
    this.props.slots('', this.props.calendar.value);
    this.props.dayDetailView(true);
    this.props.cellValue(this.props.calendar.value)
    // this.getSessionDetails(this.props.calendar.value)
  }

  async getSessionDetails(currentDate){
    let dates =new Date(currentDate);
    let orderId= this.props.orderId;
    let sessionId= this.props.sessionId[0];
    let date = dates.getDate();
    let month= dates.getMonth();
    let year=  dates.getFullYear();
    const response = await fetchSessionDayActionHandler(orderId,sessionId, date, month, year)
    console.log(response)
    this.props.slots(response, date)
    return response

  }

  render(){
    const that = this;
    return (
      that.state.status=== 0? <div className="rbc-slot-available-status" onClick={()=>that.dayClick()}></div>:
        that.state.status=== 1?<div className="rbc-slot-filling-fast-status" onClick={()=>that.dayClick()}></div>:
          that.state.status=== 2?<div className="rbc-slot-full-status" onClick={()=>that.dayClick()}></div>:
            that.state.status=== 3?<div className="rbc-slot-holiday-status" onClick={()=>that.dayClick()}></div>:
              that.state.status=== 4?<div className="rbc-slot-travel-status" onClick={()=>that.dayClick()}></div>:
                <div></div>
    )
  }
}
