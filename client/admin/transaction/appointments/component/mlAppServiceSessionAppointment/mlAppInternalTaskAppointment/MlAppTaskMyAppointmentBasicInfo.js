/**
 * Task Appointment basic info component
 * @Author :: Birendra Kumar
 * @Dated :: 17/08/2017
 */

// import NPM module(s)
import React, { Component } from 'react';
import FontAwesome from 'react-fontawesome';
import ScrollArea from 'react-scrollbar';
import Select from 'react-select';
import { cloneDeep } from 'lodash';
import {initalizeFloatLabel} from "../../../../../../commons/utils/formElemUtil";

export default class MlAppTaskMyAppointmentBasicInfo extends Component {

  constructor(props) {
    super(props);
    this.options = [
      {value: 'weekly', label: 'Weekly'},
      {value: 'daily', label: 'Daily'},
      {value: 'monthly', label: 'Monthly'}
    ];
  }

  componentDidMount() {
    initalizeFloatLabel();
    // $('.float-label').jvFloat();
    var WinHeight = $(window).height();
    $('.step_form_wrap').height(WinHeight-(290+$('.app_header').outerHeight(true)));
  }

  /**
   * Method :: React render
   * Desc :: Showing html page
   * @returns {XML}
   */
  render(){
    const { task } = this.props;
    return (
      <div className="step_form_wrap step1">
        <ScrollArea speed={0.8} className="step_form_wrap" smoothScrolling={true} default={true}>
          <div className="col-md-6 nopadding-left">
            <div className="form_bg">
              <form>
                <div className="form-group">
                  <input type="text" placeholder="Task Name" name="name" value={task.name}
                         className="form-control float-label" />
                </div>
                <label>Task Type</label><br/>
                <div className="form-group">
                  <div className="input_types">
                    <input id="isInternal" type="checkbox"
                           value={task.isInternal}
                           name="isInternal"
                           checked={task.isInternal} disabled /><label
                    htmlFor="isInternal"><span><span></span></span>Internal</label>
                  </div>
                  <div className="input_types">
                    <input id="isExternal" type="checkbox"
                           name="isExternal"
                           value={task.isExternal}
                           checked={task.isExternal} disabled /><label
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
                           value={task.noOfSession} />
                  </label>
                  {/*<input type="number" className="form-control "/>*/}
                </div>
              </form>
              <form>
                <div className="form-group">
                  <label>Duration: &nbsp;
                    <input type="text"
                           className="form-control inline_input"
                           disabled={true}
                           value={task.duration && task.duration.hours}  /> Hours
                    <input type="text"
                           className="form-control inline_input"
                           disabled={true}
                           value={task.duration && task.duration.minutes}  /> Mins
                  </label>
                </div>
                <div className="form-group switch_wrap switch_names inline_switch">
                  <label>Status</label>
                  <label className="switch">
                    <input type="checkbox"
                           checked={task.isActive}
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
              <form><br className="brclear"/>
                <div className="form-group">
                  <textarea placeholder="Notes"
                            disabled
                            defaultValue={task.note ? task.note : ''}
                            className="form-control float-label" id="">
                  </textarea>
                </div>
                <span className="placeHolder active">Frequency</span>
                <div className="form-group">
                  <Select name="form-field-name"
                          options={this.options}
                          value={task.sessionFrequency}
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
