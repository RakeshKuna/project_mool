/**
 * Created by mukhil on 13/9/17.
 */

import React, {Component} from "react";
import {fetchSessionDayActionHandler } from '../actions/fetchSessionDayActionHandler';

export default class MlFunderDayComponent extends Component {

  constructor(props){
    super(props)
    this.state={
      status: null
    }
  }

  componentWillMount(){
    let that = this;
    let calendarInfo = this.props.dayData ? this.props.dayData : [];
    let expiry = this.props.dayData ?  this.props.dayData.expiryDate : ''
    let dayDate = new Date(this.props.calendar.value);
    if(calendarInfo && calendarInfo.length>0){
      calendarInfo.map(function(info){
        let date = new Date(info.date);
        if( date.getDate() == dayDate.getDate() && date.getMonth() == dayDate.getMonth() ){
          if(expiry){
            let expiryDate = new Date(expiry);
            if( date.getTime() < expiryDate.getTime() ) {
              that.setState({status: info.status});
            }
          } else {
            console.log('info.status', info.status)
            that.setState({status: info.status});
          }

        }
      })
    }
  }

  // componentWillReceiveProps(newProps) {
  //   console.log('newProps', newProps)
  //   let that = this;
  //   let calendarInfo = newProps.dayData ? newProps.dayData : [];
  //   if(calendarInfo && calendarInfo.length>0){
  //     calendarInfo.map(function(info) {
  //       that.setState({status: info.status});
  //     })
  //     }
  // }



  render() {
    const {status} = this.state;
    return (
      status === 0? <div className="rbc-slot-filling-fast-status" ></div>:
        status > 0 && status < 4 ? <div className="rbc-slot-available-status" ></div>:
          status >= 4?<div className="rbc-slot-full-status" ></div>:
                <div></div>
    )
  }
}



