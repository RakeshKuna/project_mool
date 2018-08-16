/**
 * Created by pankaj on 29/8/17.
 */
import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
var FontAwesome = require('react-fontawesome');

export default class MlAppInfiniteCalendarSidebar extends React.Component{

  constructor(props){
    super(props);
    var days = [];
    this.state = {
      startDate: props.startDate,
      days: days,
      selectedDate: props.startDate
    };

    for (let i = -5; i < 6; i++) {
      let day = this.getDate(props.startDate, i);
      days.push(day);
    }

    this.handleScroll = this.handleScroll.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.getDateBlock = this.getDateBlock.bind(this);
  }

  componentDidMount() {

    $("#calendar").scrollTop($(".date").height());
    // $(document).click((event) => {
    //   $('.date').removeClass('selected');
    //   $(event.target).addClass('selected');
    // });
    //
    setTimeout(function(){
      var WinHeight = $(window).height();
      $('#calendar').height(WinHeight-$('.app_header').outerHeight(true));
    },1000);
    $('.calender_switch').click(function(){
      $(this).toggleClass('cH');
      $('#calendar').toggleClass('calHide');
    });

  }

  componentWillReceiveProps(nextProps) {
    this.handleScroll();
  }

  getDate(referenceDate, index) {
    var day = new Date(referenceDate);
    day.setDate(day.getDate() + index)
    return day;
  }

  handleScroll() {
    var componentInstance = this;
    $('#calendar').on('scroll', function () {
      if ($(this).scrollTop() + $(this).innerHeight() >= $(this)[0].scrollHeight) {
        var days = componentInstance.state.days;
        var refDate = days[days.length - 1];
        for (var i = 1; i <= 7; i++) {
          var day = componentInstance.getDate(refDate, i);
          // days.push(componentInstance.getDateBlock(day));
          days.push(day);
        }
        if (days.length > 100) {
          days = days.slice(days.length - 100, 100);
        }
        componentInstance.setState({ days: days });
      }
      if ($(this).scrollTop() === 0) {
        var days = componentInstance.state.days;
        var refDate = days[0];
        $(this).scrollTop($(".date").height());
        for (var i = -1; i >= -7; i--) {
          var day = componentInstance.getDate(refDate, i);
          days.unshift(day);
          // days.unshift(componentInstance.getDateBlock(day));
        }
        if (days.length > 100) {
          days = days.slice(0, 100);
        }
        componentInstance.setState({ days: days });
      }
    });
  }

  handleClick(date) {
    this.setState({
      selectedDate: date
    });
    this.props.onDateClick(date);
  }

  getDateBlock(day) {
    // console.log('this.state', this.state);
    let startDate = this.state.selectedDate;
    // console.log(startDate.getTime(), day.getTime());
    startDate.setSeconds(0,0);
    day.setSeconds(0,0);
    return <div className={startDate.getTime() === day.getTime() ? "date selected" : "date"} key={day} onClick={this.handleClick.bind(this, day)}>{day.toDateString()}</div>;
  }

  render(){
    const that = this;
    let startDate = that.state.selectedDate;
    startDate.setHours(0,0,0,0);
    return (
      <div>
        <span className="calender_switch"><FontAwesome name="calendar"/></span>
        {/*<div>*/}
          <div id="calendar" style={{ width: this.props.width }} onScroll={this.handleScroll}>
            {/*{this.state.days}*/}
            {this.state.days.map(function (day) {
              day.setHours(0,0,0,0);
              return (
                <div className={startDate.getTime() === day.getTime() ? "date selected" : "date"} key={day} onClick={that.handleClick.bind(that, day)}>
                  {day.toDateString()}
                </div>
              );
            })}
          </div>
        {/*</div>*/}
      </div>
    )
  }
};
