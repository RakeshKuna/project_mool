// import NPM module(s)
import React, { Component } from 'react';
import  Select from 'react-select';
import FontAwesome from 'react-fontawesome';
import Datetime from "react-datetime";
import Moment from "moment";
import ScrollArea from 'react-scrollbar';
import MlAppTaskAppointmentUser from './MlAppTaskAppointmentUser';
import {
  fetchActivitiesTeamsActionHandler,
  getTeamUsersActionHandler,
  fetchOfficeActionHandler,
  fetchMyConnectionActionHandler} from '../actions/MlAppointmentActionHandler';

export default class MlTaskAppointmentSessions extends Component{

  constructor(props) {
    super(props);
    this.state = {
      isSessionExpand: true,
      activities: [],
      selectedSessionId: '',
      isExternal: props.selectedTask.isExternal || false,
      isInternal: props.selectedTask.isInternal || false,
      offices : []
    };
    this.options = [
      {value: 'Weekly', label: 'Weekly'},
      {value: 'Daily', label: 'Daily'},
      {value: 'Monthly', label: 'Monthly'}
    ];
    this.setSession = this.setSession.bind(this);
    this.chooseTeamType = this.chooseTeamType.bind(this);
    this.addUser = this.addUser.bind(this);
  }

  componentWillMount() {
    const {isSessionExpand} = this.state;
    this.getOffices();
    this.props.setSessionStep(true, false);
    if (isSessionExpand) {
      // this.props.saveDetails('session', '');
    }
  }

  componentDidMount() {
    // $('.float-label').jvFloat();
    let mySwiper = new Swiper('.manage_tasks', {
      speed: 400,
      spaceBetween:15,
      slidesPerView:5,
    });
    var WinHeight = $(window).height();
    $('.step_form_wrap').height(WinHeight-(310+$('.app_header').outerHeight(true)));
  }
  /**
   * Method :: getUsers
   * Desc   :: fetch the users of current team
   * @returns Void
   */
  async getUsers(resp, index, duration){
    let {isSessionExpand} = this.state;
    const that = this;
    let activities = resp || [];

    let activityTeams = activities.map((activity) => {
      activity.teams = activity.teams ? activity.teams : [];
      let teams = activity.teams.map(async function (team) {
        let response ;
          if(team.resourceType == "office") {
            response = await getTeamUsersActionHandler(team.resourceId);
          } else if (team.resourceType == "connections") {
            response = await fetchMyConnectionActionHandler(team.resourceId);
          }
          return response;
      });
      return teams;
    });

    Promise.all(activityTeams.map(Promise.all, Promise)).then(values => {
      console.log(values);
      values.forEach(function (teams, index) {
        let teamsInfo = teams.map(function (users, userIndex) {
          let team = activities[index].teams[userIndex];
          let usersInfo = (users && users.length > 0) ? users.map(function (user) {
            let userInfo = {
              name: user.name,
              profileId: user.profileId,
              profileImage: user.profileImage,
              userId: user.userId
            };
            let isFind = team.users.find(function (teamUser){ return teamUser.profileId == user.profileId && teamUser.userId == user.userId });
            if(isFind) {
              userInfo.isAdded = true;
              userInfo.isMandatory = isFind.isMandatory;
            }
            return userInfo;
          }): [];
          activities[index].teams[userIndex].users = usersInfo;
          return usersInfo;
        });
      });
      console.log(activities);
      that.setState({
        activities : activities,
        isSessionExpand: !isSessionExpand,
        index: index,
        duration: duration
      });
    });


    // console.log('activityTeams', activityTeams);

    //activities = activities.map(async (activity) => {
    //   let teams = await activity.teams && activity.teams.map(async function (team) {
    //     if(team.resourceType == "office") {
    //       const resp = await getTeamUsersActionHandler(team.resourceId);
    //       let users = resp.map(function (user) {
    //         let userInfo = {
    //           name: user.name,
    //           profileId: user.profileId,
    //           profileImage: user.profileImage,
    //           userId: user.userId
    //         };
    //         let isFind = team.users.find(function (teamUser){ return teamUser.profileId == user.profileId && teamUser.userId == user.userId });
    //         if(isFind) {
    //           userInfo.isAdded = true;
    //           userInfo.isMandatory = isFind.isMandatory;
    //         }
    //         return userInfo;
    //       });
    //       team.users = users;
    //       return team;
    //     } else {
    //       return team;
    //     }
    //   });
    //  return activity;
    //});

    /**
     * Resolve the promise
     */
    // Promise.all(activities).then(function(value) {
    //   console.log('----promise--', index);
    //   that.setState({
    //     activities : value,
    //     isSessionExpand: !isSessionExpand,
    //     index: index
    //   });
    // });

  }

  /**
   * Method :: chooseTeamType
   * Desc   :: update team type in specific team
   * @param evt   :: Object  :: javascript event object
   * @param index :: Integer :: Index of specific team
   * @returns Void
   */
  async chooseTeamType(evt, activityIdx, teamIdx){
    let activities = this.state.activities;
    if(evt.target.value == "connections") {
      activities[activityIdx].teams[teamIdx].resourceType="connections";
      delete activities[activityIdx].teams[teamIdx].resourceId;
      activities[activityIdx].teams[teamIdx].users = [];
      const resp = await fetchMyConnectionActionHandler();
      if(resp){
        activities[activityIdx].teams[teamIdx].users = resp.map(function (user) {
          return {
            name: user.name,
            profileId: user.profileId,
            profileImage: user.profileImage,
            userId: user.userId
          }
        });
      }
    } else if (evt.target.value == "moolyaAdmins") {
      activities[activityIdx].teams[teamIdx].resourceType="moolyaAdmins";
      delete activities[activityIdx].teams[teamIdx].resourceId;
      activities[activityIdx].teams[teamIdx].users = [];
    } else {
      let officeId = evt.target.value;
      activities[activityIdx].teams[teamIdx].resourceType="office";
      activities[activityIdx].teams[teamIdx].resourceId=evt.target.value;
      const resp = await getTeamUsersActionHandler(officeId);
      if(resp){
        activities[activityIdx].teams[teamIdx].users = resp.map(function (user) {
          return {
            name: user.name,
            profileId: user.profileId,
            profileImage: user.profileImage,
            userId: user.userId
          }
        });

      }
    }
    this.setState({
      activities: activities
    });
  }

  /**
   * Method :: addUser
   * Desc   :: add user in team
   * @param teamIndex :: Integer :: Index of specific team
   * @param userIndex :: Integer :: Index of specific user
   * @returns Void
   */
  addUser(activityIdx, teamIdx, userIdx){
    let {activities, extraUsers} = this.state;
    activities[activityIdx].teams[teamIdx].users[userIdx].isAdded = true;
    let userId = activities[activityIdx].teams[teamIdx].users[userIdx].userId;
    let profileId = activities[activityIdx].teams[teamIdx].users[userIdx].profileId;
    this.setState({
      activities: activities
    });
    this.props.saveDetails('user', {userId: userId, profileId: profileId});
  }
  /**
   * Method :: getOffices
   * Desc   :: fetch the offices of user
   * @returns Void
   */
  async getOffices () {
    let response = await fetchOfficeActionHandler();
    if(response){
      this.setState({
        offices:response
      });
    }
  }

  /**
   * Method :: setSession
   * Desc :: expand the session for appointment
   */
  async setSession(index, sessionId, duration) {
    const {isSessionExpand} = this.state;
    let {selectedTaskId} = this.props;
    const resp = await fetchActivitiesTeamsActionHandler(selectedTaskId, sessionId);
    if(resp){
      await this.getUsers(resp, index, duration);
    }
    this.props.saveDetails('session', sessionId);
  }

  /**
   * Method :: getSessionList
   * Desc :: List of task session
   * @return XML
   */

  getSessionList() {
    let session = this.props.selectedTask.session;
    const sessionsList = session ? session.map((data, index) => {
      if(data) {
        return(
          <div onClick={() => this.setSession(index, data.sessionId, data.duration)} className="panel panel-info" key={index}>
            <div className="panel-heading" style={{'paddingBottom': '30px'}}>
              <div className="col-md-2 nopadding-left">Session {index+1}</div>
              <div className="col-md-4">
                <div  style={{'marginTop':'-4px'}}>
                  <label>Duration: &nbsp;
                    <input type="text"
                           className="form-control inline_input"
                           value={data.duration.hours || 0}/> Hours
                    <input type="text"
                           className="form-control inline_input"
                           value={data.duration.minutes || 0}/> Mins
                  </label>
                </div>
              </div>
              <div className="col-md-4 col-lg-4 pull-right">
                <div  style={{'marginTop':'-4px'}}>
                  <div className="input_types">
                    <input id="slottime" type="checkbox" slottime="clone" value="1"
                           checked={false} />
                    <label htmlFor="slottime"><span><span></span></span></label>
                  </div>
                  <label style={{'marginTop':'5px'}} htmlFor="fancy-checkbox-default">
                    Yet To Start
                    {/*22nd May 2017 11:16:30*/}
                  </label>
                </div>
              </div>
            </div>
            <div className="panel-body">
              <div className="swiper-container manage_tasks">
                <div className="swiper-wrapper">
                  { data.activities && data.activities.map((activity, index) => {
                    return (
                      <div className="col-lg-2 col-md-4 col-sm-4 swiper-slide" key={index}>
                        <div className="card_block"><h3>{activity.displayName}</h3>
                          <div className={activity.isActive ? 'active' : 'inactive'}></div>
                          <div className="clearfix"></div>
                          <div className="list_icon mart0">
                            <span className="price">Rs. {(activity.payment && activity.payment.derivedAmount) ? activity.payment.derivedAmount.toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") : '0.00'}</span>
                            <span className="price pull-right">{(activity.isExternal && !activity.isInternal? 'EXT' : (activity.isInternal && !activity.isExternal ? 'INT' : (activity.isExternal && activity.isInternal ? 'INT + EXT' : '')))}</span>
                            <div className="clearfix"></div>
                            {activity.imageLink ?
                              <img className="c_image" src={activity.imageLink ? generateAbsolutePath(activity.imageLink) : "/images/activity_1.jpg"}/>
                              : <i className="c_image ml my-ml-Ideator"></i>
                            }
                            <div className="clearfix"></div>
                            <span className="price">{activity.duration ? `${activity.duration.hours ? activity.duration.hours : 0} Hrs ${activity.duration.minutes ? activity.duration.minutes : 0} Mins` : ''}</span>
                            <button className={`btn ${activity.mode === 'online' ? 'btn-danger' : 'btn-success'} pull-right`}>{activity.mode}</button>
                          </div><div className="block_footer"><span>{activity.isServiceCardEligible ? 'Service Cardeable' : 'Non-Service Cardeable'}</span></div></div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        )
      }
    }) : [];
    return sessionsList;
  }
  /**
   * Method :: React render
   * Desc :: Showing html page
   * @returns {XML}
   */
  render() {
    let isSessionExpand = this.state.isSessionExpand;
    const {activities, index, isExternal, isInternal, offices, duration} = this.state;
    return (
      <div className="step_form_wrap step1">
        <ScrollArea speed={0.8} className="step_form_wrap" smoothScrolling={true} default={true}>
          <br/>
          {isSessionExpand ?
            <div className="panel panel-default">
              <div className="panel-body">
                {this.getSessionList()}
              </div>
            </div>
            :
            <MlAppTaskAppointmentUser activities={activities}
                                      index={index}
                                      isExternal={isExternal}
                                      isInternal={isInternal}
                                      duration={duration}
                                      addUser={this.addUser}
                                      setSessionStep={this.props.setSessionStep.bind(this)}
                                      chooseTeamType={this.chooseTeamType}
                                      offices={offices}/>
          }
        </ScrollArea>
      </div>
    )
  }
};

