/** ************************************************************
 * Date: 22 Jun, 2017
 * Programmer: Pankaj <mukhil.padnamanabhan@raksan.in>
 * Description : This will manage the task basic info
 * JavaScript XML file MlAppTaskCreate.jsx
 * *************************************************************** */

/**
 * Imports libs and components
 */
import React, { Component } from "react";
import ScrollArea from "react-scrollbar";
import { findTaskActionHandler } from "../actions/saveCalanderTask";
import MlLoader from "../../../../../commons/components/loader/loader";
import _ from "lodash";
let Select = require('react-select');
var diff = require('deep-diff').diff;
import { initalizeFloatLabel } from '../../../../../commons/utils/formElemUtil';

export default class MlAppTaskCreate extends Component {

  /**
   * Constructor
   * @param props :: Object - Parents data
   */
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      data: {},
      oldData: {},
      dataChanged:false,
    };
    return this;
  }

  isUpdated() {
    var differences = diff(this.state.oldData, this.state.data);
    return !this.state.dataChanged;
    // if (this.state.dataChanged) {
    //   return false
    // } else {
    //   return true
    // }
  }

  /**
   * Component Did Mount
   * Desc :: Initialize js float
   */
  componentDidMount() {
    $('.float-label').jvFloat();
    var WinHeight = $(window).height()
    this.setState({dataChanged:false});
    $('.step_form_wrap').height(WinHeight - (300 + $('.app_header').outerHeight(true)));
  }

  /**
   * Component Wil Mount
   * Desc :: Initialize js float
   */
  componentWillMount() {
    const resp = this.findTaskDetails();
    this.props.activeComponent(0);
    return resp;
  }

  componentWillReceiveProps(nextProps){
    if(this.props.saved){
      this.props.resetSaved();
      this.setState({dataChanged:false});
    }
  }

  componentDidUpdate() {
    initalizeFloatLabel();
  }

  async findTaskDetails() {
    let taskId = this.props.taskId
    if (taskId) {
      var response = await findTaskActionHandler(taskId);
      if (!_.isEmpty(response)) {
        this.setState({ loading: false, data: response, oldData: response,dataChanged:false }, this.sendTaskDataToParent);
      }
      return response
    } else {
      this.setState({ loading: false ,dataChanged:false });
    }
  }

  onFrequencySelect(val) {
    let details = this.state.data;
    let name = "sessionFrequency";
    details = _.omit(details, [name]);
    if (val) {
      details = _.extend(details, { [name]: val.value });
      this.setState({ data: details,dataChanged:true }, function () {
        this.sendTaskDataToParent()
      })
    } else {
      this.setState({ data: details ,dataChanged:true}, function () {
        this.sendTaskDataToParent()
      })
    }
  }

  handleBlur(e) {
    let details = this.state.data;
    let name = e.target.name;
    let value = e.target.value;
    if (name === "noOfSession" && value < 1) {
      toastr.error("'Number of sessions' cannot be less than 1");
      return false;
    }
    if (e.target.value == 'true') {
      value = e.target.checked
    }
    details = _.omit(details, [name]);
    details = _.extend(details, { [name]: value });
    this.setState({ data: details,dataChanged:true }, function () {
      this.sendTaskDataToParent()
    })
  }

  onStatusChange(e) {
    let details = this.state.data;
    let name = 'isActive';
    details = _.omit(details, [name]);
    details = _.extend(details, { [name]: e.currentTarget.checked });
    this.setState({ data: details,dataChanged:true }, function () {
      this.sendTaskDataToParent()
    })
  }

  sendTaskDataToParent() {
    let data = this.state.data;
    data.isServiceCardEligible = data.isExternal ? data.isServiceCardEligible : false;
    this.props.getCreateDetails(data);
  }

  render() {
    let sessionFrequencyOptions = [
      { value: 'weekly', label: 'Weekly' },
      { value: 'monthly', label: 'Monthly' },
      { value: 'daily', label: 'Daily' }
    ]
    let sessionFrequencyActive = ''
    if (this.state.data.sessionFrequency) {
      sessionFrequencyActive = 'active'
    }
    const showLoader = this.state.loading;
    return (
      <div className="step_form_wrap step1">
        {showLoader === true ? (<MlLoader />) : (
          <ScrollArea speed={0.8} className="step_form_wrap" smoothScrolling={true} default={true}>
            <div className="col-md-6 nopadding-left">
              <div className="form_bg">
                <form>
                  <div className="form-group mandatory">
                    <input type="text" placeholder="Task Name" name="name" defaultValue={this.state.data.name}
                      className="form-control float-label" onBlur={this.handleBlur.bind(this)} />
                  </div>
                  <label>Task Type</label><br />
                  <div className="form-group">
                    <div className="input_types">
                      <input id="isInternal" type="checkbox" value={true} name="isInternal"
                        defaultChecked={this.state.data.isInternal}
                        onChange={this.handleBlur.bind(this)} /><label
                          htmlFor="isInternal"><span><span></span></span>Internal</label>
                    </div>
                    <div className="input_types">
                      <input id="isExternal" type="checkbox" name="isExternal" value={true}
                        defaultChecked={this.state.data.isExternal}
                        onChange={this.handleBlur.bind(this)} /><label
                          htmlFor="isExternal"><span><span></span></span>External</label>
                    </div>
                    <br className="brclear" />
                  </div>
                  <div className="form-group">
                    <label>Total number of Sessions <input className="form-control inline_input medium_in"
                      type="Number" min="1"
                      defaultValue={this.state.data.noOfSession || 1}
                      name="noOfSession" onBlur={this.handleBlur.bind(this)} />
                    </label>
                  </div>
                  <div className="form-group">
                    <label>Duration: &nbsp; <input className="form-control inline_input" type="Number" disabled="true"
                      defaultValue={this.state.data.duration && this.state.data.duration.hours}
                    /> Hours <input
                        className="form-control inline_input" disabled="true" type="Number" min="0"
                        defaultValue={this.state.data.duration && this.state.data.duration.minutes} />
                      Mins </label>
                  </div>
                </form>
              </div>
            </div>
            <div className="col-md-6 nopadding-right">
              <div className="form_bg">
                <form>
                  <div className="form-group mandatory">
                    <input type="text" placeholder="Display Name" className="form-control float-label"
                      name="displayName"
                      defaultValue={this.state.data.displayName} onBlur={this.handleBlur.bind(this)} />
                  </div>
                  <div className="form-group">
                    <textarea placeholder="Notes" className="form-control float-label" defaultValue={this.state.data.note}
                      name="note" id="cl_about" onBlur={this.handleBlur.bind(this)}>
                    </textarea>
                  </div>
                  <div className="form-group">
                    {/*<span className="placeHolder active">Frequency</span>*/}
                    <span className={`placeHolder ${sessionFrequencyActive}`}>Frequency</span>
                    <Select className="form-field-name" options={sessionFrequencyOptions} placeholder="Frequency"
                      value={this.state.data.sessionFrequency} onChange={this.onFrequencySelect.bind(this)} />
                    <br className="clear-fix" /><br className="clear-fix" />
                  </div>
                  <div className="form-group">
                    <div className="input_types">
                      <input id="isServiceCardEligible" type="checkbox" name="isServiceCardEligible" value={true}
                        checked={this.state.data.isServiceCardEligible && this.state.data.isExternal}
                        disabled={!this.state.data.isExternal}
                        onChange={this.handleBlur.bind(this)} />
                      <label htmlFor="isServiceCardEligible"><span><span></span></span>Eligible
                        for service card</label>
                    </div>
                  </div>
                  <div className="form-group switch_wrap inline_switch">
                    <label className="">Status</label>
                    <label className="switch">
                      <input type="checkbox" ref="isActive" checked={this.state.data.isActive}
                        onChange={this.onStatusChange.bind(this)} />
                      <div className="slider"></div>
                    </label>
                  </div>
                  <br className="brclear" />
                </form>
              </div>
            </div>
          </ScrollArea>)}
      </div>
    )
  }
};
// onBlur={this.taskDuration.bind(this)}
