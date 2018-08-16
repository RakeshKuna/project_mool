/**
 * Created by Mukhil on 19/6/17.
 */
import React, {Component} from "react";
import Calender from '../../../../commons/calendar/calendar'
import { fetchServiceCalendarActionHandler } from './../actions/fetchServiceCalendarActionHandler';
import MlFunderDayComponent from './MlFunderDayComponent';
import MlCalendarHead from './calendarHeader'
import CalendarSharePopOver from './calendarSharePopOver'
import PopoverActionIcon from '../../../../app/appActions/components/PopoverActionIcon';
import MlAppActionComponent from '../../../../app/commons/components/MlAppActionComponent';
import MlAccordion from "../../../../app/commons/components/MlAccordion";
import MlAppEventComponent from "./../../common/components/MlAppEventComponent";
import { fetchMyCalendarActionHandler } from '../../myCalendar/actions/fetchMyCalendar';
import {getUserProfileActionHandler} from "../../manageScheduler/activity/actions/activityActionHandler";
import { getSharedCalendarHandler } from '../actions/fetchConnectionsForCalendar'
import { fetchAllProfileAppointmentCountsHandler, fetchProfileAppointmentCountsHandler, fetchSlotDetailsHandler } from '../../myCalendar/actions/appointmentCount';
// import _ from "lodash";
// import MlAppFunderCalendarSlots from './MlAppFunderCalendarSlots';

export default class ShareCalendar extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data:[],
      date: new Date(),
      showDetailView: false,
      sessionIds: [],
      profile:[],
      status:[],
      day:0,month:0,year:0
    };
    this.getMyCalendar();
    this.toggle = this.toggle.bind(this)
    this.onNavigate = this.onNavigate.bind(this);
    this.dayDetail.bind(this);
  }

  componentWillMount() {
    this.getUserProfiles();
    this.getAppointmentCounts();
  }
  //   let sessionIds = []
  //   let serviceInfo = this.props.serviceDetails? this.props.serviceDetails : [];
  //   serviceInfo.tasks.map(function(session){
  //     session.sessions.map(function(sessionId){
  //       sessionIds.push(sessionId.id)
  //     })
  //   })
  //   this.setState({sessionIds: sessionIds})
  // }
  //
  // async getMyCalendar(){
  //   let date = new Date(this.state.date);
  //   let orderId = this.props.orderId;
  //   let portfolioId = FlowRouter.getParam('portfolioId');
  //   const data = await fetchServiceCalendarActionHandler(portfolioId, date.getMonth(), date.getFullYear(), orderId);
  //   if(data) {
  //     this.setState({
  //       data: data
  //     });
  //   }
  // }


  async getUserProfiles() {
    const resp = await getUserProfileActionHandler();
    this.setState({profile: resp})
    return resp;
  }


  async getMyCalendar(){
    let date = new Date(this.state.date);
    let data = await fetchMyCalendarActionHandler(date.getMonth(), date.getFullYear());
    if(data) {
      this.setState({
        data: data.days
      })
    }
    console.log(data.days);
  }

  toggle() {
    this.setState({
      modal: !this.state.modal
    });
  }


  getAllAppointments(response) {
    if(response) {
      this.getAppointmentCounts();
    }
  }

  async getAppointmentCounts(userId) {
    let date = this.state.date ? new Date(this.state.date) : new Date();
    let month = date.getMonth();
    let year = date.getFullYear();
    date = date.getDate()
    let id = userId? userId :""
    const resp = await getSharedCalendarHandler(id,month, year, date);
    console.log('resp from calendar', resp)
    let days = resp.days;
    // let status = [];
    // days.map(function(data){
    //   status.push(data.status)
    // })
    this.setState({
      // status: status,
      data: days
    });
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

  onNavigate(date){
    this.setState({
      date: new Date(date)
    }, function () {
      this.getMyCalendar();
    }.bind(this));
  }

  dayDetail(response){
    this.setState({showDetailView:response})
  }

  slots(response, date){
    this.setState({
      slotDate: date
    });
    //console.log('--date--', date)
    // let temp = _.clone(response);
    // let x = temp.map(function(addDate){
    //   delete addDate['__typename'];
    //   addDate.currentDate = date;
    //   return addDate;
    // });
    // //console.log('--slotTimings--', x);
    // this.setState({slotDetails:x})
  }

  cellValue(Details){
    let dates =new Date(Details);
    let day = dates.getDate();
    let month= dates.getMonth();
    let year=  dates.getFullYear();
    this.setState({day: day, month: month, year: year})
  }

  portfolioShareHandler(actionConfig,handlerCallback){
    if(handlerCallback) {//to handle the popover
      handlerCallback({ });
    }
  }

  calendarHeaderManagement(userId) {
    console.log('headerManagement',userId)
    // this.setState({ profileId: profileId, communityName: profileName, componentToLoad:'calendar'})
    this.getAppointmentCounts(userId);
    // this.getProfileBasedAppointments(profileId);
  }

  userDetails(response) {
    this.setState({userInfo: response})
  }

  render() {

    let _this = this;
    let appActionConfig = [
      {
        showAction: true,
        actionName: 'share',
        hasPopOver:true,
        popOverTitle:'Shared Calendar',
        placement:'top',
        target:'sharedCalendar',
        popOverComponent: <CalendarSharePopOver />,
        actionComponent: PopoverActionIcon,
        handler: this.portfolioShareHandler.bind(this),
      },
      {
        showAction: true,
        actionName: 'exit',
        handler: async (event) => _this.props.handler(_this.props.redirectWithCalendar.bind(this, 'calendar'))
      }
    ];


    export const genericPortfolioAccordionConfig = {
      id: 'portfolioAccordion',
      panelItems: [
        {
          'title': 'Actions',
          isText: false,
          style: {'background': '#ef4647'},
          contentComponent: <MlAppActionComponent
            resourceDetails={{resourceId: 'share', resourceType: 'share'}}   //resource id need to be given
            actionOptions={appActionConfig}/>
        }]
    };

    const that = this;
    return (
      <div className="app_main_wrap" style={{'overflow':'auto'}}>
        <MlCalendarHead getAllAppointments={this.getAllAppointments} getAppointmentCounts={this.getAppointmentCounts.bind(this)}  calendarHeaderManagement={that.calendarHeaderManagement.bind(that)} userDetails={that.userDetails.bind(that)} />
        <div className="app_padding_wrap">
          <Calender
            events={ that.state.events }
            dayBackgroundComponent={<MlFunderDayComponent cellValue={this.cellValue.bind(this)} slots={this.slots.bind(this)}  sessionId={this.state.sessionIds} dayDetailView={this.dayDetail.bind(this)}/> }
            dayData={this.state.data}
            onNavigate={that.onNavigate}
            date={that.state.date}
          />
        </div>
        <MlAccordion accordionOptions={genericPortfolioAccordionConfig} {...this.props} />
      </div>
    )
  }
}
