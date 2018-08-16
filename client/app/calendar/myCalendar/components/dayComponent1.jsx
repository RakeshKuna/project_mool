/**
 * Created by pankaj on 21/7/17.
 */

import React, {Component} from "react";

export default class MlAppMyCalendarDayComponent extends Component {

  constructor(props){
    super(props);
    this.state ={
      status:''
    }
  }

  componentWillMount(){
    let that = this;
    let calendarInfo = this.props.dayData.days;
    let dayDate = new Date(this.props.calendar.value);
    if(calendarInfo && calendarInfo.length>0) {
      calendarInfo.map(function(info){
        let start = new Date(info.start);
        let end = new Date(info.end);
        if( start.getDate() <= dayDate.getDate() && start.getMonth() <= dayDate.getMonth() &&
            end.getDate() >= dayDate.getDate() && end.getMonth() >= dayDate.getMonth() ){
          that.setState({status: info.type});
        }
      })
    }
  }

  dayClick(){
    // let date = this.props && this.props.calendar && this.props.calendar.value ? this.props.calendar.value : new Date();
    // console.log(this.props);
    // this.props.componentToLoad('calendarDayView', date)
  }

  render(){
    const that = this;
    // console.log('MLDay',this.props);
    return (
      this.state.status=== 'holiday'?<div className="rbc-slot-holiday-status" onClick={()=>that.dayClick()}></div>:
        this.state.status=== 'travel'?<div className="rbc-slot-travel-status" onClick={()=>that.dayClick()}></div>:
          <div style={{width: "100%", height: "100%"}} onClick={()=>that.dayClick()}></div>
    )
  }
}
