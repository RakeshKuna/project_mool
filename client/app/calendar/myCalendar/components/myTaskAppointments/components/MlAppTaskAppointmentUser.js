// import NPM module(s)
import React, { Component } from 'react';
import  Select from 'react-select';
import ScrollArea from 'react-scrollbar';
import FontAwesome from 'react-fontawesome';
import generateAbsolutePath from '../../../../../../../lib/mlGenerateAbsolutePath';
export default class MlAppTaskAppointmentUser extends Component {
  constructor(props) {
    super(props);
  }

  getUserList(team, activityIdx, teamIdx) {
    const that = this;
    let userList = [];
    team.users ? team.users.map((user, userIndex) => {
      userList.push(
        <li key={user.userId}>
          <a href="">
            <img src={user.profileImage ? generateAbsolutePath(user.profileImage) : "/images/def_profile.png"} /><br />
            <div className="tooltiprefer">
              <span>{user.name}</span>
            </div>
            <span className="member_status" onClick={() => that.props.addUser(activityIdx, teamIdx, userIndex)}>
              { user.isAdded ? <FontAwesome name="check" /> : <FontAwesome name="plus" /> }
            </span>
          </a>
          <div className="input_types">
            <br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <input id={"mandatory"+teamIdx+userIndex} disabled checked={ user.isMandatory ? true : false } name="Mandatory" type="checkbox" value="Mandatory" onChange={(evt)=>that.updateIsMandatory(evt, index, userIndex)} />
            <label htmlFor={"mandatory"+teamIdx+userIndex}>
              <span><span></span></span>
              Mandatory
            </label>
          </div>
        </li>
      )
    }) : [];
    return userList;
  }

  /**
   * Method :: getSessionList
   * Desc :: List of task session
   * @return XML
   */
  render() {
    const {activities, index, isExternal, isInternal, offices, duration} = this.props;
    const that = this;
    return (
      <ScrollArea speed={0.8} className="step_form_wrap" smoothScrolling={true} default={true}>
        <div className="col-md-5 nopadding-left">
          <div className="form_bg">
            <form>
              <div className="form-group">
                <label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  {`Session ${index + 1}`}</label>
              </div>
            </form>
          </div>
        </div>
        <div className="col-md-6">
          <div className="form_bg">
            <form>
              <div className="form-group">
                &nbsp;&nbsp;<label>Time: &nbsp;
                  <input type="text"
                         className="form-control inline_input"
                         disabled={true}
                         value={duration && duration.hours}  /> Hours
                  <input type="text"
                         className="form-control inline_input"
                         disabled={true}
                         value={duration && duration.minutes}  /> Mins
                </label>
              </div>
            </form>
          </div>
        </div>
        <div className="col-md-12 nopadding-right">
          <div className="form_bg">
            <form>
              {activities && activities.map((activity, activityIndex) => {
                return (
                  <div key={activityIndex}>
                    <div className="col-md-5">
                      <div className="form-group">
                        <label>Activity Name</label>
                        <input type="text"
                               placeholder="Activity Name"
                               className="form-control float-label"
                               id="name"
                               defaultValue={activity.name} />
                      </div>
                    </div>
                    <br/><br/>
                    <div className="form-group col-md-7">
                      <label>Time: &nbsp;
                        <input type="text"
                               className="form-control inline_input"
                               disabled={true}
                               defaultValue={activity.duration && activity.duration.hours} /> Hours
                        <input type="text"
                               className="form-control inline_input"
                               disabled={true}
                               defaultValue={activity.duration && activity.duration.minutes} /> Mins
                      </label>
                    </div>
                    <br className="brclear" /><span></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Attendees<br className="brclear" /><br className="brclear" />
                    {
                      activity.teams && activity.teams.map(function (team, indexAct) {
                        return (
                          <div className="col-md-12 pull-left" key={indexAct}>
                            <div className="panel panel-default library-wrap">
                              <div className="panel-body nopadding">
                                <br className="brclear" />
                                <div className="col-md-4">
                                  <br className="brclear" />
                                  <div className="form-group">
                                    <span className="placeHolder active">Select team</span>
                                    <select disabled defaultValue="chooseTeam" value={ team.resourceType == 'office' && team.resourceId ? team.resourceId : team.resourceType } className="form-control" onChange={(evt)=>that.props.chooseTeamType(evt, activityIndex, indexAct)}>
                                      <option value="chooseTeam" disabled="disabled">Choose team Type</option>
                                      <option value="connections">My Connections</option>
                                      <option hidden={!isExternal} disabled={!isExternal} value="moolyaAdmins">Moolya Admins</option>
                                      {offices.map(function (office , index) {
                                        return <option key={index} hidden={!isInternal} disabled={!isInternal} value={office._id}>{ office.officeName + " - " + office.branchType }</option>
                                      })}
                                    </select>
                                  </div>
                                </div>
                                <div className="col-md-8 att_members">
                                  <ul className="users_list">
                                    {that.getUserList(team, activityIndex, indexAct)}
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      })
                    }
                  </div>
                )
              })
              }
            </form>
          </div>
        </div>
        <br className="brclear"/>
      </ScrollArea>
    )
  }
};

