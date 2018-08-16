/**
 * Service select task component
 * @Author :: Mukhil P
 * @Dated :: 19/06/2017
 */

// import NPM module(s)
import React, { Component } from 'react';
import ScrollArea from 'react-scrollbar';
import SessionDetails from './sessionDetails'
import {
  fetchActivitiesTeamsActionHandler,
  getTeamUsersActionHandler,
  fetchMyConnectionActionHandler,
  fetchOfficeActionHandler,
  getMoolyaAdminsActionHandler } from './myTaskAppointments/actions/MlAppointmentActionHandler';
import gql from 'graphql-tag'
import moment from "moment";

// import custom method(s) and component(s)


const statusClasses = {
  Pending :"my-ml-info",
  Reject :"my-ml-cancel",
  Rejected :"my-ml-cancel",
  Accept :"my-ml-save",
  Accepted :"my-ml-save",
  Start :"ml-active",
  Started :"ml-active"
};

class MlAppServiceSelectTask extends Component{

  constructor(props) {
    super(props);
    this.state={task:{},
      sessionExpanded: false,
      activities: [],
      selectedSessionId: '',
      offices : [],
      isExternal:"",
      isInternal:""
    }
    this.sendTaskId.bind(this);
    this.setSession = this.setSession.bind(this);
    this.chooseTeamType = this.chooseTeamType.bind(this);
    this.addUser = this.addUser.bind(this);
  }


  componentWillMount() {
    this.props.activeComponent('SessionDetails');
    // this.props.setSessionId('');
    // console.log(this.props.task)
    this.getOffices();
  }

  // componentWillReceiveProps(newProps) {
  //   console.log(newProps.task)
  // }

  componentDidMount() {
    // if(this.props.viewMode && this.props.serviceTask.tasks[0] ){
    // if(this.props.taskDetails[0]) {
    //   let taskId = this.props.taskDetails[0]._id;
    //   this.props.selectService(taskId);
    // }
    // }
    // this.initilizeSwiper()
    let WinHeight = $(window).height();
    $('.step_form_wrap').height(WinHeight-(310+$('.app_header').outerHeight(true)));

    console.log(this.props.taskDetails);
    if(this.props && this.props.taskDetails && this.props.taskDetails[0] ){
      let tab = this.props.taskDetails[0];
      this.sendTaskId(tab.id, tab.isExternal, tab.isInternal);
    }
  }

  componentWillUpdate() {
    setTimeout(function () {
      let mySwiper = new Swiper('.manage_tasks', {
        speed: 400,
        spaceBetween:20,
        slidesPerView:'auto',
        pagination: '.swiper-pagination',
        paginationClickable: true
      });
    }, 100);
  }

  componentWillReceiveProps(newProps) {
    console.log('newProps', newProps);
    this.setState({task: newProps.task})
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
   * Method :: getSelectTaskOptions
   * Desc :: List out the task for service
   * @return {Array} :: list of task
   */
  getSelectTaskOptions() {
    const { serviceOptionTasks } = this.props.serviceTask;
    let options = [];
    if (serviceOptionTasks && serviceOptionTasks.length > 0) {
      serviceOptionTasks.map((data) => {
        options.push({value: data.id, label: data.name});
      });
    }
    return options;
  }

  addUser(activityIdx, teamIdx, userIdx){
    let {activities, extraUsers} = this.state;
    activities[activityIdx].teams[teamIdx].users[userIdx].isAdded = true;
    let userId = activities[activityIdx].teams[teamIdx].users[userIdx].userId;
    let profileId = activities[activityIdx].teams[teamIdx].users[userIdx].profileId;
    let extraUser = activities[activityIdx].teams[teamIdx].users[userIdx];
    extraUser = {
      userId: extraUser.userId,
      profileId: extraUser.profileId
    };
    this.props.addExtraUsers(extraUser);
    this.setState({
      activities: activities,
      extraUsers: extraUsers,
    });
    // this.props.saveDetails('user', {userId: userId, profileId: profileId});
  }

  // optionsBySelectService(id) {
  //   this.props.optionsBySelectService(id)
  // }

  /**
   * Method :: getTabs
   * Desc :: Get the tab for task
   * @return XML
   */

  sendTaskId(taskId, external, internal) {
    console.log(taskId)
    this.setState({
      selectedTaskId: taskId,
      isExternal: external,
      isInternal: internal
    });
    this.props.selectService(taskId)
  }

  getTabs() {
    let that = this;
    const { taskDetails, selectedTab } = that.props;
    const {selectedTaskId} = this.state;
    const tabs = taskDetails ? taskDetails.map((tab, index) => {
      return (
        <li className={selectedTaskId === tab.id ? 'active' : ''} key={tab.id}>
          <a href="" data-toggle="tab"
             onClick={ that.sendTaskId.bind(that,tab.id, tab.isExternal, tab.isInternal)}>
            {tab.displayName}
          </a>
        </li>
      )
    }) : [];
    return tabs;
  }


  async setSession(index, sessionId, duration) {
    const {selectedTaskId} = this.state;
    this.props.getSessionNumber(index+1)
    this.setState({sessionId: sessionId});
    const resp = await fetchActivitiesTeamsActionHandler(selectedTaskId, sessionId);
    if(resp){
      await this.getUsers(resp, index, duration);
    }

    // this.props.saveDetails('session', sessionId);
  }

  async getUsers(resp, index, duration) {
    let {isSessionExpand} = this.state;
    const that = this;
    let activities = resp || [];
    let activityTeams = activities.map((activity) => {
      activity.teams = activity.teams ? activity.teams : [];
      let teams = activity.teams.map(async function (team) {
        let response;
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
            let isFind = team.users.find(function (teamUser) {
              return teamUser.profileId == user.profileId && teamUser.userId == user.userId
            });
            if (isFind) {
              userInfo.isAdded = true;
              userInfo.isMandatory = isFind.isMandatory;
            }
            return userInfo;
          }) : [];
          activities[index].teams[userIndex].users = usersInfo;
          return usersInfo;
        });
      });
      that.setState({
        activities: activities,
        fetchActivities: JSON.parse(JSON.stringify(activities)),
        index: index,
        duration: duration,
        sessionExpanded: true
      });
    });
  }

  /**
   * Method :: getSessionList
   * Desc :: List of task session
   * @return XML
   */

  getSessionList() {
    let { session } = this.state.task;
    console.log( session );
    if( session ) {
      const sessionsList = session ? session.map((data, index) => {
        console.log('data Session',data);
        if(data) {
          return(
            <div onClick={() => this.setSession(index, data.sessionId, data.duration )}  className="panel panel-default" key={index}>
              <div className="panel-heading">
                <div className="col-lg-2 col-md-2 nopadding-left">Session {index+1}</div>
                <div className="col-lg-4 col-md-6">
                  <div  style={{'marginTop':'-4px'}}>
                    <label>Duration: &nbsp;
                      <input type="text"
                             className="form-control inline_input"
                             value={data.duration ? data.duration.hours: 0}/> Hours
                      <input type="text"
                             className="form-control inline_input"
                             value={data.duration ? data.duration.minutes: 0}/> Mins
                    </label>
                  </div>
                </div>

                <div className="col-md-4 col-lg-4 pull-right">
                  <div  style={{'marginTop':'-4px'}}>
                    <div className="input_types">

                      {
                        data.isRescheduled ?
                          <span className="task_status act_task">
                            <span className='my-ml-history'/>
                          </span>
                        :''
                      }
                      { data.startDate
                        ?
                          <span className="task_status act_task">
                            <span className={statusClasses[data.status]}> </span>
                          </span>
                        :
                        <span>
                          <input id="slottime" type="checkbox" slottime="clone" value="1"
                               checked={false} />
                          <label htmlFor="slottime"><span><span></span></span></label>
                        </span>
                      }
                    </div>
                    <label style={{'marginTop':'5px'}} htmlFor="fancy-checkbox-default">
                      { data.startDate ? moment(data.startDate).format(Meteor.settings.public.dateFormat) : 'Yet To Start' }
                    </label>
                  </div>
                </div>

                <div className="col-lg-offset-2 col-lg-3 col-md-offset-1 col-md-3">
                  <div  style={{'marginTop':'-4px'}}>
                    {/*<label>*/}
                    {/*Sequence: &nbsp;*/}
                    {/*<input className="form-control inline_input"*/}
                    {/*type="number"*/}
                    {/*min="0"*/}
                    {/*value={data.sequence}*/}
                    {/*onChange={(event)=> updateSessionSequence(event, data.sessionId)} />*/}
                    {/*</label>*/}
                  </div>
                </div>
                &nbsp;
              </div>
              <div className="panel-body">
                <div className="swiper-container manage_tasks">
                  <div className="swiper-wrapper">
                    { data.activities && data.activities.map((activity, index) => {
                      return (
                        <div className="card_block swiper-slide" key={index}>
                          <div className="">
                            <h3>{activity.displayName}</h3>
                            <div className="clearfix"></div>
                            <div className="list_icon mart0">
                              <span className="price">Rs. {activity.payment&&activity.payment.derivedAmount ? activity.payment.derivedAmount.toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") : '0.00'}</span>
                              <span className="price pull-right">{(activity.isExternal && !activity.isInternal? 'EXT' : (activity.isInternal && !activity.isExternal ? 'INT' : (activity.isExternal && activity.isInternal ? 'INT + EXT' : '')))}</span>
                              <div className="clearfix"></div>
                              <i className="c_image ml my-ml-Ideator"></i>
                              <div className="clearfix"></div>
                              <span className="price"><div className="form-group">
                                        <label>
                                          <span key={activity.duration ? 'notLoadedYetHrs' : 'loadedHrs'} disabled="true" className="inline_input">{(activity.duration && activity.duration.hours) ? activity.duration.hours : 0}</span> Hours
                                      <span key={activity.duration ? 'notLoadedYetMin' : 'loadedMin'} disabled="true"
                                            className="inline_input"> {(activity.duration && activity.duration.minutes) ? activity.duration.minutes : 0}</span>
                                          Mins
                                        </label>
                                      </div></span>
                              <button className="btn btn-danger pull-right">{activity.mode}</button>
                            </div>
                            <div className="block_footer"><span> {activity.isServiceCardEligible ? 'Service Cardeable' : 'Non-Service Cardeable'} </span></div>
                          </div>
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
    // const { updateSessionSequence } = this.props;
  }

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
    }else if (evt.target.value == "moolyaAdmins") {
      activities[activityIdx].teams[teamIdx].resourceType="moolyaAdmins";
      delete activities[activityIdx].teams[teamIdx].resourceId;
      activities[activityIdx].teams[teamIdx].users = [];

      const resp = await getMoolyaAdminsActionHandler();
      if(resp) {
        activities[activityIdx].teams[teamIdx].users = resp.map(function (user) {
          return {
            name: user.displayName,
            profileImage: user.profileImage?user.profileImage:'/images/def_profile.png',
            userId: user._id
          }
        });
      }
    }else {
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
      activities:activities,
      // fetchedActivities:activities
      // isDataChanged:true
    }, () => {
      // this.saveDetails()
    });
  }


  /**
   * Method :: React render
   * Desc :: Showing html page
   * @returns {XML}
   */
  render() {
    let that = this;
    console.log('This Props:',this.props);
    let serviceTask = this.props.serviceTask ? this.props.serviceTask : [];
    let currentTask = serviceTask.find(function (data) {
      return data.id == that.props.selectedTab;
    });
    const {activities, index, isExternal, isInternal, offices, duration} = this.state;
    return (!this.state.sessionExpanded?
      <div className="step_form_wrap step1">
        <ScrollArea speed={0.8} className="step_form_wrap" smoothScrolling={true} default={true}>
          <br/>
          <div className="panel panel-default new_profile_tabs">
            <div className="panel-heading">
              Add Tasks
            </div>
            <div className="panel-body">
              <div className="ml_tabs ml_tabs_large">
                <ul  className="nav nav-pills">
                      {/*<li className={'active'} key={-1}>*/}
                        {/*<a href="#newTask" data-toggle="tab"*/}
                           {/*className="add-contact"*/}
                           {/*>*/}
                          {/*/!*onClick={() => optionsBySelectService()}*!/*/}
                          {/*/!*<FontAwesome name='plus-square'/> Add new task*!/*/}
                        {/*</a>*/}
                      {/*</li>*/}
                  {that.getTabs()}
                </ul>
              </div>
              <div className="tab-content clearfix">
                <div className="tab-pane active" id="newTask">
                  <div className="col-md-6 nopadding-left">
                    <form>
                      <div className="form-group">
                        <input type="text" className="form-control" placeholder="Select Tasks" value={this.props.task.name} disabled/>
                      </div>
                      <div className="form-group">
                        <label>Total number of Sessions <input className="form-control inline_input" value={ this.props.task ? this.props.task.noOfSession : ""} disabled /> </label>
                      </div>
                      <div className="form-group">
                        <label>Duration: &nbsp;
                          <input type="text" className="form-control inline_input" value={ this.props.task && this.props.task.duration ? this.props.task.duration.hours : '' } disabled /> Hours
                          <input type="text" className="form-control inline_input" value={ this.props.task && this.props.task.minutes ? this.props.task.duration.hours : '' } disabled /> Mins </label>
                      </div>
                    </form>
                  </div>
                  <div className="col-md-6 nopadding-right">
                    <form>
                      <div className="form-group">
                        <input type="text" className="form-control" placeholder="Display Name" value={this.state.task.displayName} disabled />
                      </div>
                      <div className="form-group">
                        <span className="placeHolder active">Frequency</span>
                        <input className="form-control" value={this.props.task ? this.props.task.sessionFrequency : ''} disabled></input>
                      </div>
                      <div className="form-group">
                        <label>
                          Sequence
                          <input className="form-control inline_input"
                                 type="number"
                                 min="0"
                                 id="tasksequence"
                                 value={ currentTask ? currentTask.sequence : '' }
                                 disabled
                                />
                        </label>
                      </div>
                    </form>
                  </div>
                  <br className="brclear"/>
                  {'session' in that.props.task?that.getSessionList():""}
                   {/*<div className="ml_icon_btn">*/}
                    {/*<div className="save_btn" ><span className="ml ml-save"></span></div>*/}
                    {/*<div className="cancel_btn" ><span className="ml ml-delete"></span></div>*/}
                  {/*</div>*/}
                </div>
                <div className="tab-pane" id="2a">
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>:<SessionDetails  activities={activities}
                              fetchActivities ={this.state.fetchActivities}
                              index={index}
                              isExternal={isExternal}
                              isInternal={isInternal}
                              duration={duration}
                              addUser={this.addUser}
                              setSessionId={this.props.setSessionId}
                              chooseTeamType={this.chooseTeamType}
                              offices={offices}
                              sessionId={this.state.sessionId}
                              details={this.props.details}
                              saveAction={this.props.saveAction}
                              redirectWithCalendar={this.props.redirectWithCalendar}

        />
    )
  }
};

export default MlAppServiceSelectTask;

