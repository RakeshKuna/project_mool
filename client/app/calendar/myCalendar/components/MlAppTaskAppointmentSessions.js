// import NPM module(s)
import React, { Component } from 'react';
import  Select from 'react-select';
import FontAwesome from 'react-fontawesome';
import Datetime from "react-datetime";
import Moment from "moment";
import ScrollArea from 'react-scrollbar';
import generateAbsolutePath from '../../../../../lib/mlGenerateAbsolutePath';

export default class MlAppTaskAppointmentSessions extends Component{

  constructor(props) {
    super(props);
    this.state = {
      isSessionExpand: true
    };
    this.options = [
      {value: 'Weekly', label: 'Weekly'},
      {value: 'Daily', label: 'Daily'},
      {value: 'Monthly', label: 'Monthly'}
    ];
    this.setSession = this.setSession.bind(this);
    this.getSessionDetails = this.getSessionDetails.bind(this);
  }

  componentWillMount() {
  }

  componentDidMount() {
    let mySwiper = new Swiper('.manage_tasks', {
      speed: 400,
      spaceBetween:15,
      slidesPerView:5,
      pagination: '.swiper-pagination',
      paginationClickable: true
    });
  }

  /**
   * Method :: setSession
   * Desc :: expand the session for appointment
   */
  setSession(index) {
    const {isSessionExpand} = this.state;
    this.setState({isSessionExpand: !isSessionExpand, index: index})
  }

  getSessionDetails() {
    return (
      <ScrollArea speed={0.8} className="step_form_wrap" smoothScrolling={true} default={true}>
        <div className="col-md-6 nopadding-left">
          <div className="form_bg">
            <form>
              <div className="form-group">
                <label>{`Session ${this.state.index + 1}`}</label>
              </div>
              <div className="form-group">
                <label>Activity Name</label>
                <input type="text"
                       placeholder="Activity Name"
                       className="form-control float-label"
                       id="name"
                       value={'Demonstration'} />
              </div>
            </form>
          </div>
        </div>
        <div className="col-md-6 nopadding-right">
          <div className="form_bg">
            <form>
              <div className="form-group">
                <label>Time: &nbsp;
                  <input type="text"
                         className="form-control inline_input"
                         disabled={true}
                         value={1}  /> Hours
                  <input type="text"
                         className="form-control inline_input"
                         disabled={true}
                         value={2}  /> Mins
                </label>
              </div>
              <br className="brclear" />
              <div className="form-group">
                <label>Time: &nbsp;
                  <input type="text"
                         className="form-control inline_input"
                         disabled={true}
                         value={1}  /> Hours
                  <input type="text"
                         className="form-control inline_input"
                         disabled={true}
                         value={2}  /> Mins
                </label>
              </div>
            </form>
            {/* Attandees*/}
          </div>
        </div>
        <br className="brclear"/>
        <div className="col-md-12 pull-left">
          <div className="panel panel-default library-wrap">
            <div className="panel-heading"> Attendees <span className="pull-right"><input type="text"/> </span></div>
            <div className="panel-body nopadding">
              <div className="col-md-4">
                <form>
                  <div className="form-group">
                    <Select name="form-field-name"
                            options={this.options}
                            value={'1'}
                            placeholder="Select office" />
                  </div>
                  <div className="form-group">
                    <Select name="form-field-name"
                            options={this.options}
                            value={'1'}
                            placeholder="Select Branch" />
                  </div>
                  <div className="form-group">
                    <Select name="form-field-name"
                            options={this.options}
                            value={'1'}
                            placeholder="Select Team" />
                  </div>
                </form>
              </div>
              <div className="col-md-8 att_members">
                <br className="brclear" />
                <br className="brclear" />
                <br className="brclear" />
                <ul className="users_list">
                  <li>
                    <a href="">
                      <img src="/images/p_3.jpg" /><br />
                      <div className="tooltiprefer">
                        <span>Venu</span>
                      </div>
                    </a>
                  </li>
                  <li>
                    <a href="">
                      <img src="/images/p_34.jpg" /><br />
                      <div className="tooltiprefer">
                        <span>Ramya</span>
                      </div>
                    </a>
                  </li>
                  <li>
                    <a href="">
                      <img src="/images/p_13.jpg" /><br />
                      <div className="tooltiprefer">
                        <span>Sameer</span>
                      </div>
                    </a>
                  </li>
                  <li>
                    <a href="">
                      <img src="/images/p_1.jpg" /><br />
                      <div className="tooltiprefer">
                        <span>Usha</span>
                      </div>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    )
  }

  /**
   * Method :: getSessionList
   * Desc :: List of task session
   * @return XML
   */

  getSessionList() {
    let session = [{
      duration: {
        hours: 3,
        minutes: 8
      },
      activities: [{
        duration: {
          hours: 3,
          minutes: 8
        },
        mode: 'Online',
        displayName: 'Activity 1'
      }]
    }
    ];
    const sessionsList = session ? session.map((data, index) => {
      if(data) {
        return(
          <div onClick={() => this.setSession(index)} className="panel panel-info" key={index}>
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
                           onClick={''} checked />
                    <label htmlFor="slottime"><span><span></span></span></label>
                  </div>
                  <label style={{'marginTop':'5px'}} htmlFor="fancy-checkbox-default">
                    22nd May 2017 11:16:30
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
            <div>{this.getSessionDetails()}</div>
          }
        </ScrollArea>
      </div>
    )
  }
};

