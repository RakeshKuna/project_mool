import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import Calendar from "./infiniteCalendar";
var FontAwesome = require('react-fontawesome');

export default class inlineCalender extends React.Component{
  componentDidMount()
  {
    setTimeout(function(){
      var WinHeight = $(window).height();
      $('#calendar').height(WinHeight-$('.app_header').outerHeight(true));
    },1000);
    $('.calender_switch').click(function(){
      $(this).toggleClass('cH');
      $('#calendar').toggleClass('calHide');
    });
  }
  handleDateSelect(date) {
    console.log(date.toLocaleString());
  }
  render(){
    return (
      <div>
        <span className="calender_switch"><FontAwesome name="calendar"/></span>
        <Calendar startDate={new Date()}
                  width={this.props.width}
                  handleDateSelect={this.handleDateSelect} />

      </div>
    )
  }
};
