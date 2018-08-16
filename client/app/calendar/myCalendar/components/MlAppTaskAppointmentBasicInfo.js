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
// import Calendar from "../infinite-calendar/Calendar";

export default class MlAppTaskAppointmentBasicInfo extends Component {

  constructor(props) {
    super(props);
    // this.getTask = this.getTask.bind(this);
    this.options = [
      {value: 'Weekly', label: 'Weekly'},
      {value: 'Daily', label: 'Daily'},
      {value: 'Monthly', label: 'Monthly'}
    ];
  }

  componentWillMount() {
    // this.getTask();
  }
  componentDidMount() {
    $('.float-label').jvFloat();
    var WinHeight = $(window).height();
    $('.step_form_wrap').height(WinHeight-(310+$('.admin_header').outerHeight(true)));
    setTimeout(function(){
      var WinHeight = $(window).height();
      $('#calendar').height(WinHeight-$('.app_header').outerHeight(true));
    },1000);
    $('.calender_switch').click(function(){
      $(this).toggleClass('cH');
      $('#calendar').toggleClass('calHide');
    });
  }

  /**
   * Method :: React render
   * Desc :: Showing html page
   * @returns {XML}
   */
  render(){
    const {onChangeSteps, isTaskComponent} = this.props;
    return (
      <div className="step_form_wrap step1">
        <ScrollArea speed={0.8} className="step_form_wrap" smoothScrolling={true} default={true}>
          {/*<span className="calender_switch"><FontAwesome name="calendar"/></span>
            <Calendar startDate={new Date()}
                      width={this.props.width}
                      handleDateSelect={''} />*/}
          <div className="col-md-6 nopadding-left">
            <div className="form_bg">
              <form>
                <div className="form-group switch_wrap switch_names">
                  <span className={isTaskComponent ? 'state_label' : 'state_label acLabel'}>Service Card</span>
                  <label className="switch nocolor-switch">
                    <input type="checkbox"
                           value="1"
                           checked={isTaskComponent}
                           onChange={() => onChangeSteps()} />
                    <div className="slider"></div>
                  </label>
                  <span className={isTaskComponent ? 'state_label acLabel' : 'state_label'}>Task</span>
                </div><br className="brclear"/>
                <div className="form-group">
                  <Select name="form-field-name"
                          options={this.options}
                          value={'1'}
                          placeholder="Choose Task" />
                </div>
                <label>Task Type</label><br/>
                <div className="form-group">
                  <div className="input_types">
                    <input id="isInternal" type="checkbox" value={true} name="isInternal"
                           defaultChecked={'1'}
                           onChange={''}/><label
                    htmlFor="isInternal"><span><span></span></span>Internal</label>
                  </div>
                  <div className="input_types">
                    <input id="isExternal" type="checkbox" name="isExternal" value={true}
                           defaultChecked={''}
                           onChange={''}/><label
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
                           value={1} />
                  </label>
                  {/*<input type="number" className="form-control "/>*/}
                </div>
              </form>
                {/* Mapping for slot*/}
                <div className="row funders_list">
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
                </div>
                <form>
                <div className="form-group">
                  <label>Duration: &nbsp;
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
                <div className="form-group switch_wrap switch_names inline_switch">
                  <label>Status</label>
                  <label className="switch">
                    <input type="checkbox" checked={'e'} value="isActive" />
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
                  <input type="text"
                         placeholder="Note"
                         className="form-control float-label"
                         id="note"
                         value={'Note'} />
                </div>
                <span className="placeHolder active">Frequency</span>
                <div className="form-group">
                  <Select name="form-field-name"
                          options={this.options}
                          value={'1'}
                          placeholder='Frequency Type' />
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
