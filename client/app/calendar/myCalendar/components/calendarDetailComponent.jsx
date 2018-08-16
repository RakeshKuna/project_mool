
let FontAwesome = require('react-fontawesome');
import React, { Component } from 'react';
import InlineCalender from './inlineCalendar';
import {fetchMyAppointmentActionHandler} from './../actions/fetchMyAppointment';

export default class AppCalendarDayView extends React.Component{


  constructor(props){
  super(props);
  this.state={
    showCreateComponent: false,
    slots:[]
  };
  this.showCreateComponent=this.showCreateComponent.bind(this);
  this.showSlotDetails = this.showSlotDetails.bind(this)
}


  componentDidMount() {
    let WinWidth = $(window).width();
    if(WinWidth > 768){
      $(".app_main_wrap").mCustomScrollbar({theme:"minimal-dark"});
    }
    this.getMyAppointment();
  }

  async getMyAppointment() {
    let date = new Date(this.props.appointmentDate);
    let day = date.getDate();
    let month = date.getMonth();
    let year = date.getFullYear();
    let profile = this.props.profileId;
    let response = await fetchMyAppointmentActionHandler(profile, day, month, year);
    if (response) {
      this.setState({
        slots: response
      });
    }
  }

  showSlotDetails(type, slotDetails) {
    this.props.slotInfo(slotDetails)
    // this.props.componentToLoad(type)
  }

  showCreateComponent(type, slot){
    let date = new Date(this.props.appointmentDate);
    let startDate = slot.split('-')[0];
    let hours = startDate.split(':')[0];
    let minutes = startDate.split(':')[1];
    date.setHours(hours);
    date.setMinutes(minutes);
    this.props.componentToLoad(type, date)
  }

  render(){
    const that = this;
    return (
      <div className="app_main_wrap">
        <div className="app_padding_wrap">
        <InlineCalender/>
          <div className="col-md-12">
            {/*<ul className="cal_tabs act_tab">*/}
              {/*<li className="col-md-4 nopadding-left">*/}
                {/*<span><img src="/images/mor_icon.png"/> Morning</span>*/}
              {/*</li>*/}
              {/*<li className="col-md-4 nopadding">*/}
                {/*<span className="act_tab"><img src="/images/aft_icon.png"/> Afternoon</span>*/}
              {/*</li>*/}
              {/*<li className="col-md-4 nopadding-right">*/}
                {/*<span><img src="/images/eve_icon.png"/> Evening</span>*/}
              {/*</li>*/}
            {/*</ul>*/}
            <br className="brclear"/>
            <div className="row day_tab_content">
              {
                that.state.slots.map(function (data, index) {
                  let appointments = data.appointments;
                  return (
                    <div className="col-md-3" key={index}>
                      <div className="day_app_list">
                        <div className="app_list_head">
                          {data.slot}
                          <span className="pull-right">
                            <a href=""><FontAwesome name='plus' onClick={that.showCreateComponent.bind(this, 'createTask', data.slot)}/></a>
                            <a href=""><FontAwesome name='ellipsis-h' onClick={that.showSlotDetails.bind(this, 'slotDetailView', data)}/></a>
                          </span>
                        </div>
                        <ul className="list-group">
                          {
                            appointments.map(function (appointments, aptIndex) {
                              appointments = appointments ? appointments : {};
                              return (
                                <li key={aptIndex} className="list-group-item">
                                  <span className="task_with">
                                    <span className="ml my-ml-Investors">
                                    </span>
                                  </span> { appointments.name } <span className="task_status act_task">
                                  <FontAwesome name='check'/>
                                </span>
                                </li>
                              )
                            })
                          }
                        </ul>
                      </div>
                    </div>
                  )
                })

              }
            </div>
          </div>
        </div>
      </div>
    )
  }
}

