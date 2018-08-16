/**
 * Created by Mukhil on 19/6/17.
 */
import React, {Component} from "react";
import Calender from '../../../../commons/calendar/calendar'
import { fetchAllProfileAppointmentCountsHandler, fetchProfileAppointmentCountsHandler, fetchSlotDetailsHandler, fetchMyAppointmentBetweenTwoDates } from '../actions/appointmentCount';
import MlCalendarHeader from './calendarHeader'
import CalCreateTask from './calCreateTask'
import CalCreateAppointmentView from './calAppointmentDetails'
import MlAppServiceManageSchedule from './createServiceCard'
import CalendarSlotDetail from './calCreateTask'
var _ = require('lodash');
import MlAppCalendarHeader from './../../common/components/MlAppCalendarHeader';
import MlAppDayAppointmentInfo from "./../../common/components/MlAppDayAppointmentInfo";
import MlAppDayBackground from "./../../common/components/MlAppDayBackground";
import MlAppEventComponent from "./../../common/components/MlAppEventComponent";
import MlAppInfiniteCalendarSidebar from "./../../common/components/MlAppInfiniteCalendarSidebar";
import MlAppSlotAppointmentDetails from "./../../common/components/MlAppSlotAppointmentDetails";
import {getUserActiveProfileDetails} from "../../manageScheduler/activity/actions/activityActionHandler";
import MlAppCalenderAppointmentInfo from "./../../common/components/MlAppCalenderAppointmentInfo";
import MlAppMyCalendarIdeator from "./myTaskAppointments/components/MlAppMyCalendarIdeator";

export default class MLAppMyCalendar extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: [],
      date: new Date(),
      appointmentDate: new Date(),
      showCalendar: false,
      componentToLoad: 'calendar',
      events: [],
      communityName:"",
      profile:[],
      slotDetailInfo: [{}],
      indexValue:0,
      exploreAppointmentIds: [],
      calendarView:'month'
    };
    this.onNavigate = this.onNavigate.bind(this);
    this.onViewChange = this.onViewChange.bind(this);
    this.componentToLoad.bind(this);
    this.eventsData.bind(this);
    this.getAllAppointments.bind(this);
    this.getAppointmentCounts = this.getAppointmentCounts.bind(this);
    this.appointmentView = this.appointmentView.bind(this);
    this.getSessionNumber.bind(this);
    this.onViewOrNagivationChange = this.onViewOrNagivationChange.bind(this);
  }

  async onViewOrNagivationChange(view, currentDate){
    let startDay,startMonth,startYear, endDay, endMonth, endYear;
    let date = currentDate || new Date();
    if(view === 'day'){
      startDay = date.getDate();
      startMonth = date.getMonth();
      startYear = date.getFullYear();

      endDay =startDay;
      endMonth = startMonth;
      endYear =startYear;
    }else if(view === 'week'){
      startDay = date.getDate() - date.getDay(); // First day is the day of the month - the day of the week
      startMonth = date.getMonth();
      startYear = date.getFullYear();

      endDay = startDay + 6; // last day is the first day + 6
      endMonth = startMonth;
      endYear =startYear;
    }
    // else if(view === 'month'){
    //   startDay = date.getDate();
    //   startMonth = date.getMonth();
    //   startYear = date.getFullYear();
    //
    //   endDay =new Date(date.setMonth(date.getMonth() + 1, 0)).getDate();
    //   endMonth = startMonth;
    //   endYear =startYear;
    // }

    let profileId = this.state.profileId;
    let userId = Meteor.userId();
    if(profileId && (view === 'day' || view === 'week')) {
      let resp = await fetchMyAppointmentBetweenTwoDates(profileId,userId,startDay,startMonth,startYear,
        endDay, endMonth, endYear);
      resp = _.map(resp, _.partialRight(_.pick, ['title','start','end']));
      resp = resp.map(data=>{
        data.start = new Date(data.start);
        data.end = new Date(data.end);
        return data;
      });
      this.setState({events:resp});
    } else {

    }
  }

  onNavigate(date) {
    this.setState({
      date: new Date(date)
    }, function () {
      let profileId = this.state.profileId;
      if(profileId){
        let view = this.state.calendarView;
        if(view === 'day' ||view === 'week' ){
          this.onViewOrNagivationChange(view,new Date(date));
        }else
          this.getProfileBasedAppointments(profileId);
      } else {
        this.getAppointmentCounts()
      }
    }.bind(this));
  }

  onViewChange (view) {
    this.setState({calendarView:view});
    let profileId = this.state.profileId;
    if(profileId){
      if(view === 'day' ||view === 'week' ){
        this.onViewOrNagivationChange(view);
      }else
        this.getProfileBasedAppointments(profileId);
    } else {
      this.getAppointmentCounts()
    }
  }

  componentWillUpdate(nextProps, nextState){
    if(nextState.componentToLoad === 'calendar' && this.state.componentToLoad !== "calendar") {
      let profileId = this.state.profileId;
      if(profileId) {
        this.getProfileBasedAppointments(profileId);
      } else {
        this.getAppointmentCounts()
      }
    }
  }

  componentWillMount() {
    this.getUserProfiles(),
    this.getAppointmentCounts();
    // this.setState({componentToLoad:'calendar'})
  }

  getAllAppointments(response) {
    if(response) {
      this.getAppointmentCounts();
    }
  }

  async getAppointmentCounts() {
    let date = this.state.date ? new Date(this.state.date) : new Date();
    let month = date.getMonth();
    let year = date.getFullYear();
    const resp = await fetchAllProfileAppointmentCountsHandler(month, year);
    let params = 'events' in resp ? resp.events : [];
    if(_.isEmpty(params)) {
      this.setState({
        events: params
      });
    } else {
      this.eventsData(params)
    }
    return resp;
  }

  eventsData(events){
    let that =  this;
    let profileInfo  = that.state.profile|| []
    let details = [];
    if(events){
       events.map(function(info){
        let event = Object.assign({}, info);
        profileInfo.map(function(data){
          if(event.profileId === data.profileId) {
            event.communityName = data.communityName
            let temp = {
              title: info.count + " " + event.communityName,
              className: "ml my-ml-Investors",
              start: new Date(info.date),
              end: new Date(info.date)
            };
            details.push(temp);
          }
        })
      })
    }
    this.setState({
      events: details
    });
    return ( details );
  }

  async getUserProfiles() {
    const resp = await getUserActiveProfileDetails();
    console.log("profile", resp);
    this.setState({profile: resp});
    return resp;
  }

  getSessionNumber(index) {
    this.setState({indexValue:index})
  }


  componentToLoad(response, date){
   if(this.state.profileId) {
     this.setState({
       componentToLoad: response,
       appointmentDate: date
     });
   }
  }

  headerManagement(profileId, profileName) {
    this.setState({ profileId: profileId, communityName: profileName, componentToLoad:'calendar'})
    this.getProfileBasedAppointments(profileId);
  }

  async getProfileBasedAppointments(profileId) {
    let date = this.state.date ? new Date(this.state.date) : new Date();
    let month = date.getMonth();
    let year = date.getFullYear();
    const resp = await fetchProfileAppointmentCountsHandler(profileId,month, year)
    let that = this;
    let details = [];
    let events = 'events' in resp ? resp.events : [];
    let data = 'days' in resp ? resp.days : [];
    if(_.isEmpty(events)) {
      this.setState({
        events: [],
        data: data
      });
    } else {
      events.map( function( data ) {
        if( profileId === data.profileId ) {
          let temp = {
            title: data.count+" " +that.state.communityName,
            className: "ml my-ml-Investors",
            start: new Date( data.date ),
            end: new Date( data.date )
          };
          details.push( temp )
        }
      });
      that.setState({
        events: details,
        data: data
      });
    }
      return resp;
  }

  userDetails(response) {
    this.setState({userInfo: response})
  }

  slotInfo(resp) {
    let appointmentIds = [];
    resp.appointments.map(function(data) {
      appointmentIds.push(data.id)
    });
    this.setState({
      exploreAppointmentIds: appointmentIds,
      componentToLoad: 'slotDetailView'
    })
    //this.getSlotInfo( appointmentIds )
  }

  async getSlotInfo(appointmentId) {
    let that = this;
    const resp = await fetchSlotDetailsHandler(appointmentId)
    if(resp){
      this.setState({slotDetailInfo: resp}, function(){
        that.setState({componentToLoad: 'slotDetailView'})
      })
      return resp;
    }
  }

  dayAppointmentInfoAddEvent(currentSlot){
    let slot = currentSlot.slot;
    let date = new Date(this.state.appointmentDate);
    let startDate = slot.split('-')[0];
    let hours = startDate.split(':')[0];
    let minutes = startDate.split(':')[1];
    date.setHours(hours);
    date.setMinutes(minutes);
    let profiles = this.state.profile || [];
    let profileId = FlowRouter.getQueryParam("profile");
    let profile = profiles.find( (user) => {
      return user.profileId === profileId;
    });
    if( profile && profile.isHasManageSchedule ){
      this.setState({
        componentToLoad: "createTask",
        appointmentDate: date
      });
    } else {
      this.setState({
        componentToLoad: "selfAppointment",
        appointmentDate: date
      });
    }
  }

  appointmentView(appointment){

    let data = {
      _id: appointment._id,
      appointmentType: appointment.appointmentType,
      appointmentId: appointment.appointmentId,
      seeker: appointment.client,
      provider: appointment.provider,
      resourceId: appointment.appointmentInfo.resourceId,
      serviceName: appointment.appointmentInfo.serviceName,
      sessionId: appointment.appointmentInfo.sessionId,
      startDate: appointment.startDate,
      endDate: appointment.endDate
    };
    this.setState({
      selectedAppointment: data,
      componentToLoad: "bookAppointmentDetails"
    });
  }

  render() {
    const {appointmentDate} = this.state;
    const that = this;
    let yesterday = new Date();
    yesterday.setDate(yesterday.getDate()-1);
    // let eventsData = [{ title: '3', 'start': new Date(2017, 7, 7), 'end': new Date(2017, 7, 10) }];
    switch(that.state.componentToLoad) {
      case 'calendar':
        return (
          <div className="app_main_wrap" style={{'overflow': 'auto'}}>
            <div className="app_padding_wrap">
              <MlCalendarHeader getAllAppointments={this.getAllAppointments} getAppointmentCounts={this.getAppointmentCounts}  headerManagement={that.headerManagement.bind(that)} userDetails={that.userDetails.bind(that)} componentToLoad={that.componentToLoad.bind(that)} />
              <Calender
                events={ that.state.events }
                dayBackgroundComponent={<MlAppDayBackground dayClickEvent={that.componentToLoad.bind(that, 'calendarDayView')}/> }
                eventComponent={<MlAppEventComponent />}
                dayData={{days:that.state.data}}
                dateHeaderEvent={that.componentToLoad.bind(that, 'calendarDayView')}
                onNavigate={that.onNavigate}
                onViewChange={that.onViewChange}
                date={that.state.date}
              />
            </div>
          </div>
        )
        break;
      case 'calendarDayView':
        return (
          <div className="app_main_wrap" style={{'overflow': 'auto'}}>
            <div className="app_padding_wrap">
              <MlCalendarHeader getAllAppointments={this.getAllAppointments} getAppointmentCounts={this.getAppointmentCounts}  headerManagement={that.headerManagement.bind(that)} componentToLoad={that.componentToLoad.bind(that)} userDetails={that.userDetails.bind(that)}/>
              <div className="app_main_wrap">
                <div className="app_padding_wrap">
                  <MlAppInfiniteCalendarSidebar
                    startDate={that.state.appointmentDate}
                    onDateClick={that.componentToLoad.bind(that, 'calendarDayView')}
                  />
                  <MlAppDayAppointmentInfo
                    appointmentDate={that.state.appointmentDate}
                    profileId={ that.state.profileId ? that.state.profileId : ''}
                    canAdd= { yesterday.getTime() <  that.state.appointmentDate.getTime()}
                    canExplore= {true}
                    addEvent={this.dayAppointmentInfoAddEvent.bind(this)}
                    exploreEvent={this.slotInfo.bind(this)}
                  />
                </div>
              </div>
              {/*<AppCalendarDayView slotInfo={this.slotInfo.bind(this)} profileId={this.state.profileId} componentToLoad={this.componentToLoad.bind(this)} appointmentDate={this.state.appointmentDate} />*/}
            </div>
          </div>
        )
        break;
      case 'createTask':
        return(
        <div className="app_main_wrap" style={{'overflow': 'auto'}}>
          <div className="app_padding_wrap">
            <MlCalendarHeader getAllAppointments={this.getAllAppointments} getAppointmentCounts={this.getAppointmentCounts}  headerManagement={that.headerManagement.bind(that)} componentToLoad={that.componentToLoad.bind(that)} userDetails={that.userDetails.bind(that)}/>
            <div className="app_main_wrap">
              <div className="app_padding_wrap">
                <MlAppInfiniteCalendarSidebar
                  startDate={that.state.appointmentDate}
                  onDateClick={that.componentToLoad.bind(that, 'calendarDayView')}
                />
                <MlAppServiceManageSchedule profileId={this.state.profileId} getSessionNumber={this.getSessionNumber.bind(this)} appointmentDate={appointmentDate} componentToLoad={this.componentToLoad.bind(this)}/>
              </div>
            </div>
          </div>
        </div>
        )
      break;
      case 'viewTask':
        return(
          <div className="app_main_wrap" style={{'overflow': 'auto'}}>
            <div className="app_padding_wrap">
              <MlCalendarHeader getAppointmentCounts={this.getAppointmentCounts}  headerManagement={that.headerManagement.bind(that)} componentToLoad={that.componentToLoad.bind(that)} userDetails={that.userDetails.bind(that)}/>
              <CalCreateTask componentToLoad={this.componentToLoad.bind(this)} />
            </div>
          </div>
        );
        break;
      case 'appointmentDetails':
        return(
          <div className="app_main_wrap" style={{'overflow': 'auto'}}>
            <div className="app_padding_wrap">
              <MlCalendarHeader getAllAppointments={this.getAllAppointments} getAppointmentCounts={this.getAppointmentCounts} headerManagement={that.headerManagement.bind(that)} componentToLoad={that.componentToLoad.bind(that)} userDetails={that.userDetails.bind(that)}/>
              <CalCreateAppointmentView/>
            </div>
          </div>
        );
        break;

      case 'selfAppointment':
        return(
          <div className="app_main_wrap" style={{'overflow': 'auto'}}>
            <div className="app_padding_wrap">
              <MlCalendarHeader getAppointmentCounts={this.getAppointmentCounts} headerManagement={that.headerManagement.bind(that)} componentToLoad={that.componentToLoad.bind(that)} userDetails={that.userDetails.bind(that)}/>
              <MlAppMyCalendarIdeator appointmentDate={that.state.appointmentDate} componentToLoad={that.componentToLoad.bind(that)}/>
              {/*<CalCreateAppointmentView/>*/}
            </div>
          </div>
        )
        break;

      case 'slotDetailView':
        return(
          <div className="app_main_wrap" style={{'overflow': 'auto'}}>
            <div className="app_padding_wrap">
              <MlCalendarHeader getAppointmentCounts={this.getAppointmentCounts} headerManagement={that.headerManagement.bind(that)} componentToLoad={that.componentToLoad.bind(that)} userDetails={that.userDetails.bind(that)}/>
              <div className="app_main_wrap">
                <div className="app_padding_wrap">
                  <MlAppInfiniteCalendarSidebar
                    startDate={that.state.appointmentDate}
                    onDateClick={that.componentToLoad.bind(that, 'calendarDayView')}
                  />
                  <MlAppSlotAppointmentDetails
                    sessionNumber={this.state.indexValue}
                    appointmentIds={ this.state.exploreAppointmentIds }
                    isView={true}
                    viewEvent = {this.appointmentView}
                  />
                </div>
              </div>
            </div>
          </div>
        )
      break;
      case "bookAppointmentDetails":
        return (
          <div className="app_main_wrap" style={{'overflow': 'auto'}}>
            <div className="app_padding_wrap">
              <MlCalendarHeader getAppointmentCounts={this.getAppointmentCounts} headerManagement={that.headerManagement.bind(that)} componentToLoad={that.componentToLoad.bind(that)} userDetails={that.userDetails.bind(that)}/>
              <div className="app_main_wrap">
                <div className="app_padding_wrap">
                  <MlAppInfiniteCalendarSidebar
                    startDate={that.state.appointmentDate}
                    onDateClick={that.componentToLoad.bind(that, 'calendarDayView')}
                  />
                  <div className="app_main_wrap" style={{'overflow': 'auto'}}>
                    <div className="app_padding_wrap">
                      <MlAppCalenderAppointmentInfo selectedAppointment={that.state.selectedAppointment} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      break;
    }
  }
}
