/**
 * Created by pankaj on 27/8/17.
 */
let FontAwesome = require('react-fontawesome');
import React, { Component } from 'react';
import {fetctOfficeDayAppointmentActionHandler} from './../actions/fetchDayAppointmenstInfo';
import ScrollArea from 'react-scrollbar';

export default class MlAppDayAppointmentInfo extends Component {

  constructor(props) {
    super(props);
    this.state= {
      showCreateComponent: false,
      shift:'morning',
      slots:[]
    };
    this.showCreateComponent=this.showCreateComponent.bind(this);
  }

  componentDidMount() {
    let WinWidth = $(window).width();
    let WinHeight = $(window).height();
    $('.main_wrap_scroll').height(WinHeight-($('.app_header').outerHeight(true)+120));
    if(WinWidth > 768){
      $(".app_main_wrap").mCustomScrollbar({theme:"minimal-dark"});
    }
    this.getMyAppointment(this.props.appointmentDate);
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.appointmentDate){
      this.getMyAppointment(nextProps.appointmentDate);
    }
  }

  async getMyAppointment(selectedDate) {
    let date = new Date(selectedDate);
    let day = date.getDate();
    let month = date.getMonth();
    let year = date.getFullYear();
    let profileId = this.props.profileId;
    let userId = this.props.userId;
    let response = await fetctOfficeDayAppointmentActionHandler(userId, profileId, day, month, year);
    if (response) {
      this.setState({
        slots: response
      });
    }
  }

  showCreateComponent(type, slot){
    let date = new Date(this.props.appointmentDate);
    let startDate = slot.split('-')[0];
    let hours = startDate.split(':')[0];
    let minutes = startDate.split(':')[1];
    date.setHours(hours);
    date.setMinutes(minutes);
    console.log(date);
    this.props.componentToLoad(type, date)
  }

  updateShift(shift){
    this.setState({
      shift: shift
    })
  }

  render(){
    //console.log('This Slots', this.state.slots)
    const that = this;
    const {canAdd, canExplore, addEvent, exploreEvent} = this.props;
    let slots = that.state.slots.filter( (slot) => {
      return slot.shift === that.state.shift;
    });

    const statusClasses = {
      Pending :"my-ml-info",
      Reject :"my-ml-cancel",
      Rejected :"my-ml-cancel",
      Accept :"my-ml-save",
      Accepted :"my-ml-save",
      Start :"ml-active",
      Started :"ml-active"
    };

    return (
      <div className="main_wrap_scroll">
        <ScrollArea
          speed={0.8}
          className="main_wrap_scroll"
          smoothScrolling={true}
          default={true}
        >
          <div className="col-md-12">
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
              {
                slots.map(function (data, index) {
                  console.log(data);
                  let date = new Date();
                  let isHoliday = data.isHoliday;
                  if(data && data.slot){
                    date = new Date(that.props.appointmentDate);
                    let startDate =  data.slot.split('-')[0];
                    let hours = startDate.split(':')[0];
                    let minutes = startDate.split(':')[1];
                    date.setHours(hours);
                    date.setMinutes(minutes);
                  }

                  let appointments = data.appointments ? data.appointments : [];
                  return (
                    <div className="col-lg-3 col-md-4" key={index}>
                      <div className="day_app_list">
                        <div className="app_list_head">
                          {data.slot}
                          <span className="pull-right">
                            { canAdd && !isHoliday && ( date.getTime() >(new Date).getTime() ) ? <a href=""><FontAwesome name='plus' onClick={() => addEvent(data, slots)}/></a> : '' }
                            { appointments.length && canExplore ? <a href=""><FontAwesome name='ellipsis-h' onClick={ () => exploreEvent(data, slots)}/></a> : '' }
                          </span>
                        </div>
                        <ul className="list-group" style={{height:'160', overflowY:'scroll'}}>
                          {
                            appointments.map(function (appointment, aptIndex) {
                              appointment = appointment ? appointment : {};
                              return (
                                <li key={aptIndex} className="list-group-item">
                                  <span className="task_with">
                                    <span className="ml my-ml-Investors">
                                    </span>
                                  </span> { appointment.name }
                                  {
                                    appointment.isRescheduled ?
                                    <span className="task_status act_task">
                                      <span className='my-ml-history'/>
                                    </span>
                                    :''
                                  }
                                  <span className="task_status act_task">
                                    <span className={statusClasses[appointment.status]}> </span>
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
          {/*</div>*/}
        {/*</div>*/}
      </div>
        </ScrollArea>
      </div>
    )
  }
}
