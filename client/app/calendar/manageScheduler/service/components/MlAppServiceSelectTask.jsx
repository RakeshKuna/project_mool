/**
 * Service select task component
 * @Author :: Mukhil P
 * @Dated :: 19/06/2017
 */

// import NPM module(s)
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import  Select from 'react-select';
import FontAwesome from 'react-fontawesome';
import ScrollArea from 'react-scrollbar';
import generateAbsolutePath from '../../../../../../lib/mlGenerateAbsolutePath';
import gql from 'graphql-tag'

// import custom method(s) and component(s)
import Moolyaselect from "../../../../commons/components/MlAppSelectWrapper";

class MlAppServiceSelectTask extends Component{

  constructor(props) {
    super(props);
  }

  async componentDidMount() {
    this.props.activateComponent(1);
    await this.props.getServiceDetails();
    this.props.getRedirectServiceList(false);
    if(this.props.viewMode && this.props.serviceTask.tasks[0] ){
      let taskId =this.props.serviceTask.tasks[0].id;
      this.props.optionsBySelectService(taskId);
    }
    // this.initilizeSwiper()
    let viewMode = this.props.viewMode;
    const hight = viewMode ? 320 : 300;
    let WinHeight = $(window).height();
    $('.step_form_wrap').height(WinHeight-(hight+$('.app_header').outerHeight(true)));
  }

  componentWillUpdate() {
    setTimeout(function () {
      let mySwiper = new Swiper('.manage_tasks', {
        speed: 400,
        spaceBetween:15,
        slidesPerView:5,
        pagination: '.swiper-pagination',
        paginationClickable: true
      });
    }, 100);
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

  /**
   * Method :: getTabs
   * Desc :: Get the tab for task
   * @return XML
   */

  getTabs() {
    const { serviceTask, optionsBySelectService, deleteSelectedTask, viewMode } = this.props;
    const tabs = serviceTask.tasks ? serviceTask.tasks.map((tab, index) => {
      return (
        <li className={serviceTask.selectedTaskId === tab.id ? 'active' : ''} key={index}>
          <a href="#newTask" data-toggle="tab"
             onClick={() => optionsBySelectService(tab.id)}>
            {viewMode ? '' : <FontAwesome onClick={() => deleteSelectedTask(tab.id)} name='minus-square'/>} {tab.displayName}
          </a>
        </li>
      )
    }) : [];
    return tabs;
  }

  /**
   * Method :: getSessionList
   * Desc :: List of task session
   * @return XML
   */

  getSessionList() {
    let { session } = this.props.serviceTask.selectedTaskDetails;
    const { updateSessionSequence } = this.props;
    const sessionsList = session ? session.map((data, index) => {
      console.log('sessionsList', data);
      if(data) {
        return(
          <div className="panel panel-info" key={index}>
            <div className="panel-heading">
              <div className="col-md-2 nopadding-left">Session {index+1} {data.isOffline ? '(Offline)' : ''}</div>
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
              <div className="col-md-offset-2 col-md-3">
                <div  style={{'marginTop':'-4px'}}>
                  <label>
                    Sequence: &nbsp;
                    <input className="form-control inline_input"
                           type="number"
                           min="0"
                           value={data.sequence}
                           onChange={(event)=> updateSessionSequence(event, data.sessionId)} />
                  </label>
                </div>
              </div>
              &nbsp;
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
                            <span className="price">Rss. {(activity.payment && activity.payment.derivedAmount) ? activity.payment.derivedAmount.toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") : '0.00'}</span>
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
    let that = this;
    const {
      profileId,
      serviceId,
      optionsBySelectService,
      updateSessionSequence,
      respectiveTab,
      saveService,
      selectedTaskId,
      deleteSelectedTask,
      serviceTask} = this.props;
    const tasks = serviceTask.selectedTaskDetails || {};
    return (
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
                  {
                    this.props.viewMode ? '' :
                      <li className={serviceTask.selectedTaskId ? '' : 'active'} key={-1}>
                        <a href="#newTask" data-toggle="tab"
                           className="add-contact"
                           onClick={() => optionsBySelectService()}>
                           <FontAwesome name='plus-square'/> Add new task
                        </a>
                      </li>
                  }
                  {this.getTabs()}
                </ul>
              </div>

                <div className="tab-content clearfix">
                  <div className="tab-pane active" id="newTask">
                    <div className="col-md-6 nopadding-left">
                      <form>
                        <div className="form-group">
                          {/*<select className="form-control"><option>Select task</option></select>*/}
                          { this.props.viewMode ? '' : <Select name="form-field-name"
                                  options={this.getSelectTaskOptions()}
                                  value={serviceTask.selectedTaskId}
                                  placeholder="Select Tasks"
                                  onChange={(option) => optionsBySelectService(option.value)} /> }
                          {/*<Moolyaselect multiSelect={false}
                                        placeholder="Select Tasks"
                                        className="form-control float-label"
                                        valueKey={'value'} labelKey={'label'}
                                        selectedValue={serviceTask.selectedTask}
                                        queryType={"graphql"}
                                        query={serviceQuery}
                                        reExecuteQuery={true}
                                        queryOptions={serviceOption}
                                        isDynamic={true}
                                        onSelect={(value) => optionsBySelectService(value)} />*/}
                        </div>
                        <div className="form-group">
                          <label>Total number of Sessions <input className="form-control inline_input"  value={tasks.noOfSession || ''} disabled /> </label>
                        </div>
                        <div className="form-group">
                          <label>Duration: &nbsp; <input type="text" className="form-control inline_input"  value={tasks.duration.hours || 0} disabled /> Hours <input type="text" className="form-control inline_input" value={tasks.duration.minutes || 0} disabled /> Mins </label>
                        </div>
                      </form>
                    </div>
                    <div className="col-md-6 nopadding-right">
                      <form>
                        <div className="form-group">
                          <input type="text" className="form-control" placeholder="Display Name" value={tasks.displayName || ''}/>
                        </div>
                        <div className="form-group">
                          <span className="placeHolder active">Frequency</span>
                          <input className="form-control" value={tasks.sessionFrequency || ''}></input>
                        </div>
                        <div className="form-group">
                          <label>
                            Sequence
                            <input className="form-control inline_input"
                                   type="number"
                                   min="0"
                                   id="tasksequence"
                                   value={tasks.sequence || ''}
                                   onChange={(event) => updateSessionSequence(event)}/>
                          </label>
                        </div>
                      </form>
                    </div>
                    <br className="brclear"/>
                      {this.getSessionList()}
                    {!this.props.viewMode? <div className="ml_icon_btn">
                      <div className="save_btn" onClick={() => saveService()}><span className="ml ml-save"></span></div>
                      <div className="cancel_btn" onClick={() => deleteSelectedTask(selectedTaskId)}><span className="ml ml-delete"></span></div>
                    </div>:""}
                  </div>
                  <div className="tab-pane" id="2a">
                    2
                  </div>
                </div>

              </div>
            </div>
        </ScrollArea>
      </div>
    )
  }
};

MlAppServiceSelectTask.propTypes = {
  serviceTask: PropTypes.PropTypes.oneOfType([
    React.PropTypes.object,
    React.PropTypes.array ]),
  getServiceDetails: PropTypes.func,
  saveService: PropTypes.func,
  optionsBySelectService: PropTypes.func,
  respectiveTab: PropTypes.func,
  updateSessionSequence: PropTypes.func
};
export default MlAppServiceSelectTask;

{ /* <div className="swiper-slide funding_list list_block notrans" key={index}>
 <p className="online">{activity.mode}</p>
 <span>Duration:</span><br />
 <div className="form-group">
 <label><input type="text" className="form-control inline_input"
 value={activity.duration.hours || 0} disabled /> Hours
 <input type="text" className="form-control inline_input"
 value={activity.duration.minutes || 0} disabled /> Mins
 </label>
 </div>
 <h3>{activity.displayName}</h3>
 </div>*/}
