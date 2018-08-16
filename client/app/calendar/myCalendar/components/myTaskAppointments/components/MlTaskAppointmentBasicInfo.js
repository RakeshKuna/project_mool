/**
 * Task Appointment basic info component
 * @Author :: Birendra Kumar
 * @Dated :: 28/07/2017
 */

// import NPM module(s)
import React, { Component } from 'react';
import FontAwesome from 'react-fontawesome';
import Datetime from "react-datetime";
import Moment from "moment";
import ScrollArea from 'react-scrollbar';
import Select from 'react-select';
import { cloneDeep } from 'lodash';

export default class MlTaskAppointmentBasicInfo extends Component {

  constructor(props) {
    super(props);
    // this.getTask = this.getTask.bind(this);
    this.options = [
      {value: 'weekly', label: 'Weekly'},
      {value: 'daily', label: 'Daily'},
      {value: 'monthly', label: 'Monthly'}
    ];
    this.loadTaskOptions = this.loadTaskOptions.bind(this);
  }

  componentWillMount() {
    this.props.setSessionStep(false, false);
  }

  componentDidMount() {
    // $('.float-label').jvFloat();
    var WinHeight = $(window).height();
    $('.step_form_wrap').height(WinHeight-(310+$('.app_header').outerHeight(true)));
  }
  /**
   * Method :: loadTaskOptions
   * Desc :: Load the task options
   * @return {Array} :: Tasks array object
   */
  loadTaskOptions() {
    const {tasks, selectedTaskId} = this.props;
    let options = [];
    if (tasks && tasks.length > 0) {
      tasks.map((task) => {
        task.isActive ? options.push({value: task.taskId, label: task.displayName}) : '';
      });
    }
    return options;
  }
  /**
   * Method :: React render
   * Desc :: Showing html page
   * @returns {XML}
   */
  render(){
    const {
      selectedTaskId,
      isTaskComponent,
      onChangeTask,
      onChangeType,
      selectedTask } = this.props;
    return (
      <div className="step_form_wrap step1">
        <ScrollArea speed={0.8} className="step_form_wrap" smoothScrolling={true} default={true}>
          <div className="col-md-6 nopadding-left">
            <div className="form_bg">
              <form>
                <div className="form-group switch_wrap switch_names">
                  <span className={isTaskComponent ? 'state_label' : 'state_label acLabel'}>Service Card</span>
                  <label className="switch nocolor-switch">
                    <input type="checkbox"
                           value="1"
                           checked={isTaskComponent}
                           onChange={() => onChangeType()} />
                    <div className="slider"></div>
                  </label>
                  <span className={isTaskComponent ? 'state_label acLabel' : 'state_label'}>Task</span>
                </div><br className="brclear"/>
                <div className="form-group">
                  <Select name="form-field-name"
                          options={this.loadTaskOptions()}
                          value={selectedTaskId}
                          placeholder="Choose Task"
                          onChange={onChangeTask}/>
                </div>
                <label>Task Type</label><br/>
                <div className="form-group">
                  <div className="input_types">
                    <input id="isInternal" type="checkbox"
                           value={selectedTask.isInternal}
                           name="isInternal"
                           checked={selectedTask.isInternal} disabled /><label
                    htmlFor="isInternal"><span><span></span></span>Internal</label>
                  </div>
                  <div className="input_types">
                    <input id="isExternal" type="checkbox"
                           name="isExternal"
                           value={selectedTask.isExternal}
                           checked={selectedTask.isExternal} disabled /><label
                    htmlFor="isExternal"><span><span></span></span>External</label>
                  </div>
                  <br className="brclear"/>
                </div>
                <div className="form-group">
                  <label>
                    Total number of Sessions
                    <input type="text"
                           className="form-control inline_input"
                           disabled
                           value={selectedTask.noOfSession} />
                  </label>
                  {/*<input type="number" className="form-control "/>*/}
                </div>
              </form>
                {/* Mapping for slot*/}
                {/*<div className="row funders_list">
                  <div className="col-md-6 col-sm-6 col-lg-5" >
                    <a href="">
                      <div className="funders_list_block" onClick={''}>
                        <h3>{'23rd May'}</h3>
                        <div className="list_icon"><span className="ml ml-moolya-symbol"></span></div>
                        <div className="block_footer">
                          <span>{"8:00 AM - 9:00AM"}</span>
                        </div>
                      </div>
                    </a>
                  </div>
                </div>*/}
                <form>
                <div className="form-group">
                  <label>Duration: &nbsp;
                    <input type="text"
                           className="form-control inline_input"
                           disabled={true}
                           value={selectedTask.duration && selectedTask.duration.hours}  /> Hours
                    <input type="text"
                           className="form-control inline_input"
                           disabled={true}
                           value={selectedTask.duration && selectedTask.duration.minutes}  /> Mins
                  </label>
                </div>
                <div className="form-group switch_wrap switch_names inline_switch">
                  <label>Status</label>
                  <label className="switch">
                    <input type="checkbox"
                           checked={selectedTask.isActive}
                           id="isActive"
                           value="isActive" disabled />
                    <div className="slider"></div>
                  </label>
                </div>
              </form>
            </div>
          </div>
          <div className="col-md-6 nopadding-right">
            <div className="form_bg">
              <form>
                <div className="form-group switch_wrap switch_names">
                  <span className={isTaskComponent ? 'state_label' : 'state_label acLabel'}>New</span>
                  <label className="switch nocolor-switch">
                    <input type="checkbox"
                           value="1"
                           checked={isTaskComponent}
                           onChange={() => onChangeSteps()} />
                    <div className="slider"></div>
                  </label>
                  <span className={isTaskComponent ? 'state_label acLabel' : 'state_label'}>Ongoing</span>
                </div><br className="brclear"/><br className="brclear"/><br className="brclear"/><br className="brclear"/>
                <div className="form-group">
                  <textarea placeholder="Notes"
                            disabled
                            defaultValue={selectedTask.note}
                            className="form-control float-label" id="">
                  </textarea>
                </div>
                <span className="placeHolder active">Frequency</span>
                <div className="form-group">
                  <Select name="form-field-name"
                          options={this.options}
                          value={selectedTask.sessionFrequency}
                          placeholder='Frequency Type'
                          disabled />
                </div>
                <br className="brclear"/>
                <div className="form-group">
                  <div className="input_types">
                    <label>Set Priority</label>
                    <input id="radio3" type="radio" name="radio2" value="1"/><label htmlFor="radio3"><span><span></span></span>Low</label>
                  </div>
                  <div className="input_types">
                    <input id="radio4" type="radio" name="radio2" value="2"/><label htmlFor="radio4"><span><span></span></span>Medium</label>
                  </div>
                  <div className="input_types">
                    <input id="radio5" type="radio" name="radio2" value="2"/><label htmlFor="radio5"><span><span></span></span>High</label>
                  </div>
                  <br className="brclear"/>
                </div>
              </form>
            </div>
          </div>
        </ScrollArea>
      </div>
    )
  }
};
