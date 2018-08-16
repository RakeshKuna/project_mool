/**
 * Created by pankaj on 28/8/17.
 */

import React, {Component} from "react";

export default class MlAppDayBackground extends Component {

  constructor(props) {
    super(props);
    this.state ={
      status:''
    }
  }

  componentWillMount() {
    let that = this;
    let calendarInfo = this.props.dayData ? this.props.dayData.days : '';
    let dayDate = new Date(this.props.calendar.value);
    if(calendarInfo && calendarInfo.length>0) {
      calendarInfo.map(function(info){
        let start = new Date(info.start);
        let end = new Date(info.end);
        if( (start.getDate() <= dayDate.getDate() && start.getMonth() === dayDate.getMonth() || start.getMonth() < dayDate.getMonth() )&&
          ( (end.getDate() >= dayDate.getDate() && end.getMonth() === dayDate.getMonth()) || end.getMonth() > dayDate.getMonth() ) ) {
          that.setState({
            status: info.type
          });
        }
      })
    }
  }

  render(){
    const that = this;
    let date = that.props && that.props.calendar && that.props.calendar.value ? that.props.calendar.value : new Date();
    const {dayClickEvent} = that.props;
    return (
      this.state.status=== 'holiday'?
        <div className="rbc-slot-holiday-status" style={{cursor: "pointer"}} onClick={()=>dayClickEvent(date)}></div> :
          this.state.status=== 'travel'?
            <div className="rbc-slot-travel-status" style={{cursor: "pointer"}} onClick={()=>dayClickEvent(date)}></div> :
              <div style={{width: "100%", height: "100%", cursor: "pointer"}} onClick={()=>dayClickEvent(date)}></div>
    )
  }
}

