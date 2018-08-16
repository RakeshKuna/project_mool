/** ************************************************************
 * Date: 19 Jun, 2017
 * Programmer: Mukhil <mukhil.padnamanabhan@raksan.in>
 * Description : This will manage the team information
 * JavaScript XML file MlAppChooseTeam.jsx
 * *************************************************************** */

/**
 * Import libs and components
 */
import React from 'react';
import ScrollArea from 'react-scrollbar';
import {getTeamUsersActionHandler } from '../actions/activityActionHandler';
import { fetchOfficeActionHandler, fetchMyConnectionActionHandler, getMoolyaAdminsActionHandler } from '../actions/fetchOffices';
let FontAwesome = require('react-fontawesome');
import generateAbsolutePath from '../../../../../../lib/mlGenerateAbsolutePath'


export default class MlAppChooseTeam extends React.Component{

  /**
   * Constructor
   * @param props :: Object - Parents data
   */
  constructor(props){
    super(props);
    this.state = {
      teamData: props.data ? props.data : [{users: []}],
      isExternal: props.isExternal ? props.isExternal : false,
      isInternal: props.isInternal ? props.isInternal : false,
      isDataChanged:false,
      offices : []
    };
  }
  isUpdated() {
    return !this.state.isDataChanged;
  }
  /**
   * Component Will Receive Props
   * Desc :: Set basic date in steps from props
   * @param props :: Object - Parents data
   */
  componentWillReceiveProps(props){
    let id = FlowRouter.getQueryParam('id');
    if(id) {
      this.setState({
        teamData: props.data ? props.data : [{users: []}],
        isExternal: props.isExternal ? props.isExternal : false,
        isInternal: props.isInternal ? props.isInternal : false,
        isDataChanged:false,
      }, function(){
        this.getUsers();
      }.bind(this));
    }
  }

  /**
   * Component Will Mount
   * Desc :: call offices and users fetch functions
   */
  componentWillMount(){
    this.getOffices();
    this.getUsers();
    this.props.activeComponent(2);
  }

  /**
   * Method :: getUsers
   * Desc   :: fetch the users of current team
   * @returns Void
   */
  async getUsers(){
    const that = this;

    let teamData = this.state.teamData;
    teamData = await teamData.map(async function (team) {
      if(team.resourceType == "office") {
        const resp = await getTeamUsersActionHandler(team.resourceId);
        let users = resp.map(function (user) {
          let userInfo = {
            name: user.name,
            profileId: user.profileId,
            profileImage:user.profileImage,
            userId: user.userId
          };
          let isFind = team.users.find(function (teamUser){ return teamUser.profileId == user.profileId && teamUser.userId == user.userId });
          if(isFind) {
            userInfo.isAdded = true;
            userInfo.isMandatory = isFind.isMandatory;
          }
          return userInfo;
        });
        team.users = users;
      } else if (team.resourceType == "connections") {
        const resp = await fetchMyConnectionActionHandler();
        let users = resp.map(function (user) {
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
        });
        team.users = users;
      } else if(team.resourceType == 'moolyaAdmins'){
        const resp = await getMoolyaAdminsActionHandler("","");
        let users = resp.map(function (user) {
          let userInfo = {
            name: user.displayName,
            profileImage: user.profileImage,
            userId: user._id
          };
          let isFind = team.users.find(function (teamUser){ return teamUser.userId == user._id });
          if(isFind) {
            userInfo.isAdded = true;
            userInfo.isMandatory = isFind.isMandatory;
          }
          return userInfo;
        });
        team.users = users;
      }
      return team;
    });

    /**
     * Resolve the promise
     */
    Promise.all(teamData).then(function(value) {
      that.setState({
        teamData : value
      }, () => {
        that.saveDetails();
      });
    });

  }

  /**
   * Method :: getOffices
   * Desc   :: fetch the offices of user
   * @returns Void
   */
  async getOffices () {
    let profileId = FlowRouter.getParam('profileId') ? FlowRouter.getParam('profileId') : '';
    let response = await fetchOfficeActionHandler(profileId);
    if(response){
      this.setState({
        offices:response
      })
    }
  }

  /**
   * Component Did Mount
   * Desc :: Initialize the js float
   */
  componentDidMount() {
    $('.float-label').jvFloat();
    var WinHeight = $(window).height();
    $('.step_form_wrap').height(WinHeight-(260+$('.app_header').outerHeight(true)));
    this.props.getActivityDetails();
  }

  /**
   * Method :: saveDetails
   * Desc   :: save team details in activity
   * @returns Void
   */
  saveDetails() {
    let data = this.state.teamData;
    this.props.setActivityDetails({teams: data}, false);
  }

  /**
   * Method :: addTeam
   * Desc   :: add new team in activity
   * @returns Void
   */
  addTeam() {
    let teamData = this.state.teamData;
    teamData.push({users:[]});
    this.setState({
      teamData : teamData,isDataChanged:true
    }, () => {
      this.saveDetails()
    });
  }

  /**
   * Method :: addTeam
   * Desc   :: remove new team in activity
   * @returns Void
   */
  removeTeam(index) {
    let teamData = this.state.teamData;
    teamData.splice(index , 1);
    this.setState({
      teamData : teamData,isDataChanged:true
    }, () => {
      this.saveDetails()
    });
  }

  /**
   * Method :: chooseTeamType
   * Desc   :: update team type in specific team
   * @param evt   :: Object  :: javascript event object
   * @param index :: Integer :: Index of specific team
   * @returns Void
   */
  async chooseTeamType(evt, index){

    let teamData = this.state.teamData;
    if(evt.target.value == "connections") {
      teamData[index].resourceType="connections";
      delete teamData[index].resourceId;
      const resp = await fetchMyConnectionActionHandler();
      teamData[index].users = [];
      if(resp){
        teamData[index].users = resp.map(function (user) {
          return {
            name: user.name,
            profileId: user.profileId,
            profileImage: user.profileImage,
            userId: user.userId
          }
        });

      }
    } else if (evt.target.value == "moolyaAdmins") {
      teamData[index].resourceType="moolyaAdmins";
      delete teamData[index].resourceId;
      const resp = await getMoolyaAdminsActionHandler();
      teamData[index].users = [];
      if(resp) {
        teamData[index].users = resp.map(function (user) {
          return {
            name: user.displayName,
            profileImage: user.profileImage,
            userId: user._id
          }
        });
      }
      // teamData[index].resourceType="moolyaAdmins";
      // delete teamData[index].resourceId;
      // teamData[index].users = [];
    } else {
      let officeId = evt.target.value;
      teamData[index].resourceType="office";
      teamData[index].resourceId=evt.target.value;
      const resp = await getTeamUsersActionHandler(officeId);
      if(resp){
        teamData[index].users = resp.map(function (user) {
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
      teamData:teamData,isDataChanged:true
    }, () => {
      this.saveDetails()
    });
  }

  /**
   * Method :: addUser
   * Desc   :: add user in team
   * @param teamIndex :: Integer :: Index of specific team
   * @param userIndex :: Integer :: Index of specific user
   * @returns Void
   */
  addUser(teamIndex, userIndex){
    let teamData = this.state.teamData;
    teamData[teamIndex].users[userIndex].isAdded = teamData[teamIndex].users[userIndex].isAdded ? false : true;
    if(!teamData[teamIndex].users[userIndex].isAdded) {
      teamData[teamIndex].users[userIndex].isMandatory = false;
    }
    this.setState({
      teamData: teamData,isDataChanged:true
    }, () => {
      this.saveDetails()
    });
  }

  /**
   * Method :: updateIsMandatory
   * Desc   :: Make user mandatory
   * @param evt       :: Object  :: javascript event object
   * @param teamIndex :: Integer :: Index of specific team
   * @param userIndex :: Integer :: Index of specific user
   * @returns Void
   */
  updateIsMandatory(evt, teamIndex, userIndex) {
    let teamData = this.state.teamData;
    teamData[teamIndex].users[userIndex].isAdded = true;
    teamData[teamIndex].users[userIndex].isMandatory = evt.target.checked;
    this.setState({
      teamData: teamData,isDataChanged:true
    }, () => {
      this.saveDetails()
    });
  }

  /**
   * Render
   * Desc   :: Render the HTML for this component
   * @returns {HTML}
   */
  render(){
  const that =  this;
    /**
     * Return the HTML
     */
    return (
      <div className="step_form_wrap step1">
      <ScrollArea speed={0.8} className="step_form_wrap" smoothScrolling={true} default={true} >
        <br/>
        {that.state.teamData.map(function (team, index) {
          return (
            <div className="col-md-12 nopadding-left" key={index}>
              <div className="panel panel-default cal_view_task">
                <div className="panel-heading">
                  Suggested teams
                  <span className="see-more pull-right">
                    { index == 0
                      ?
                      <a href="" onClick={()=>that.addTeam()}>
                        <FontAwesome name='plus'/>
                      </a>
                      :
                      <a href="" onClick={()=>that.removeTeam(index)}>
                        <FontAwesome name='minus'/>
                      </a>
                    }

                  </span>
                </div>
                <div className="panel-body sug_teams">
                  <div className="col-md-12 nopadding">
                    <div className="col-md-6 nopadding-right">
                      <form>
                        <div className="form-group">
                          <span className="placeHolder active">Choose team Type</span>
                          <select defaultValue="chooseTeam" value={ team.resourceType == 'office' && team.resourceId ? team.resourceId : team.resourceType } className="form-control" onChange={(evt)=>that.chooseTeamType(evt, index)}>
                            <option value="chooseTeam" disabled="disabled">Choose team Type</option>
                            <option value="connections" hidden={!that.state.isExternal} >My Connections</option>
                            <option   value="moolyaAdmins">Moolya Admins</option>
                            {that.state.offices.map(function (office , index) {
                              return <option key={index} hidden={!that.state.isInternal} disabled={!that.state.isInternal} value={office._id}>{ office.officeName + " - " + office.branchType }</option>
                            })}
                          </select>
                        </div>
                      </form>
                    </div>
                  </div>
                  <div className="col-md-12">
                    <input type="text" name="search" className="search_field" placeholder="Search.."/>
                  </div>
                  <div className="col-md-12 nopadding att_members" >
                    <ul className="users_list">
                      {team.users.map(function (user, userIndex) {
                        return (
                         <li className={ user.isAdded ? "checkedClass" : "" }   key={userIndex} onClick={() => that.addUser(index, userIndex)}>
                            <a href="">
                              <img src={user.profileImage ? generateAbsolutePath(user.profileImage) : "/images/def_profile.png"} /><br />
                              <div className="tooltiprefer">
                                <span>{user.name}</span>
                              </div>
                              <span className="member_status">
                                { user.isAdded ? <FontAwesome name="check" /> : <FontAwesome name="plus" /> }
                              </span>
                            </a>
                            <div className="input_types">
                              <br />
                              <input id={"mandatory"+index+userIndex} checked={ user.isMandatory ? true : false } name="Mandatory" type="checkbox" value="Mandatory" onChange={(evt)=>that.updateIsMandatory(evt, index, userIndex)} />
                              <label htmlFor={"mandatory"+index+userIndex}>
                                <span><span></span></span>
                                Mandatory
                              </label>
                            </div>
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </ScrollArea>
    </div>
    )
  }
};
