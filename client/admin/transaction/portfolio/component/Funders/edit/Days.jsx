/**
 * Created by pankaj on 31/7/17.
 */
import React, { Component } from "react";
import $ from "jquery";

export default class Days extends Component {
  constructor(props) {
    super(props);
    var days = [];
    this.state = {
      startDate: props.startDate,
      days: days,
      selectedDate: ""
    }

    for (var i = -6; i < 6; i++) {
      var day = this.getDate(props.startDate, i)
      days.push(this.getDateBlock(day));
    }

    this.handleScroll = this.handleScroll.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.getDateBlock = this.getDateBlock.bind(this);
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
        var refDate = days[days.length - 1].key;
        for (var i = 1; i <= 7; i++) {
          var day = componentInstance.getDate(refDate, i);
          days.push(componentInstance.getDateBlock(day));
        }
        if (days.length > 100) {
          days = days.slice(days.length - 100, 100);
        }
        componentInstance.setState({ days: days });
      }
      if ($(this).scrollTop() === 0) {
        var days = componentInstance.state.days;
        var refDate = days[0].key;
        $(this).scrollTop($(".date").height());
        for (var i = -1; i >= -7; i--) {
          var day = componentInstance.getDate(refDate, i);
          days.unshift(componentInstance.getDateBlock(day));
        }
        if (days.length > 100) {
          days = days.slice(0, 100);
        }
        componentInstance.setState({ days: days });
      }
    });
  }

  componentDidMount() {

    // componentDidMount() {
    //   setTimeout(function(){
        var WinHeight = $(window).height();
        $('#calendar').height(WinHeight-$('.app_header').outerHeight(true));
      // },1000);
      $('.calender_switch').click(function(){
        $(this).toggleClass('cH');
        $('#calendar').toggleClass('calHide');
      });
    // }

    $("#calendar").scrollTop($(".date").height());
    $(document).click((event) => {
      $('.date').removeClass('selected');
      $(event.target).addClass('selected');
    });
  }

  handleClick(date) {
    this.setState({ selectedDate: date.toISOString() });
    this.props.onDateSelect(date);
  }

  getDateBlock(day) {
    let selectedDate = this.props.startDate;
    console.log(selectedDate, day);
    return <div className={ selectedDate.getTime() === day.getTime() ? 'date selected' : 'date'} key={day} onClick={this.handleClick.bind(this, day)}>{day.toDateString()}</div>;
  }


  render() {
    return (<div id="calendar" style={{ width: this.props.width }} onScroll={this.handleScroll}>
      {this.state.days}
    </div>);
  }
}
