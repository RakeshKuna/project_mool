/**
 * Appointment basic info component
 * @Author :: Birendra Kumar
 * @Dated :: 25/07/2017
 */

// import NPM module(s)
import React, { Component } from 'react';
import FontAwesome from 'react-fontawesome';
import Datetime from "react-datetime";
import Moment from "moment";
import ScrollArea from 'react-scrollbar';
import { cloneDeep } from 'lodash';
import {findTaskActionHandler} from '../../actions/fetchOngoingAppointments';
import {initalizeFloatLabel} from "../../../../../commons/utils/formElemUtil";



export default class MlAppOngoingMyAppointmentServiceBasicInfo extends Component {

  constructor(props) {
    super(props);
    this.getTask = this.getTask.bind(this);
  }

  componentWillMount() {
    this.getTask();
  }
  componentDidMount() {
    $('.float-label').jvFloat();
    var WinHeight = $(window).height();
    $('.step_form_wrap').height(WinHeight-(290+$('.app_header').outerHeight(true)));
  }

  async getTask() {

  }
  /**
   * Method :: React render
   * Desc :: Showing html page
   * @returns {XML}
   */
  render(){
    setTimeout(()=>{
      initalizeFloatLabel();
    });
    const {service, daysRemaining} = this.props;
    return (
      <div className="step_form_wrap step1">
        <ScrollArea speed={0.8} className="step_form_wrap" smoothScrolling={true} default={true}>
          <div className="col-md-6 nopadding-left">
            <div className="form_bg">
              <form>
                <div className="form-group">
                  <input type="text"
                         placeholder="Service Name"
                         className="form-control float-label"
                         id="name"
                         value={service.name}
                         disabled />
                </div>
                <div className="form-group">
                  <label>
                    Total number of Sessions
                    <input type="text"
                           className="form-control inline_input"
                           disabled
                           value={service.noOfSession} />
                  </label>
                  {/*<input type="number" className="form-control "/>*/}
                </div>
                <div className="form-group">
                  <label>Duration: &nbsp;
                    <input type="text"
                           className="form-control inline_input"
                           disabled={true}
                           value={service.duration && service.duration.hours}  /> Hours
                    <input type="text"
                           className="form-control inline_input"
                           disabled={true}
                           value={service.duration && service.duration.minutes}  /> Mins
                  </label>
                </div>
                <div className="form-group" id="date-time">
                  {/*<Datetime dateFormat="DD-MM-YYYY"*/}
                            {/*timeFormat={false}*/}
                            {/*inputProps={{placeholder: "Valid Till",readOnly:true}}*/}
                            {/*closeOnSelect={true}*/}
                            {/*value={service.validTill? new Moment(service.validTill).format(Meteor.settings.public.dateOnlyFormat) : null}*/}
                            {/*disabled />*/}
                  <input type="text" placeholder="Valid Till" defaultValue={service.validTill? new Moment(service.validTill).format(Meteor.settings.public.dateOnlyFormat) : null} value={service.validTill? new Moment(service.validTill).format(Meteor.settings.public.dateOnlyFormat) : null} className="form-control float-label" id="" disabled/>
                  <FontAwesome name="calendar"
                               className="password_icon"
                               disabled />
                </div>
              </form>
            </div>
          </div>
          <div className="col-md-6 nopadding-right">
            <div className="form_bg">
              <form>
                <div className="form-group">
                  <input type="text"
                         placeholder="Note"
                         className="form-control float-label"
                         id="note"
                         value={service.note}
                         disabled />
                </div>
                <span className="placeHolder active">Frequency</span>
                <div className="form-group">
                  <input type="text"
                         placeholder="Frequency"
                         className="form-control float-label"
                         id="frequency"
                         value={service.sessionFrequency}
                         disabled />
                </div>
                <br className="brclear"/>
                <div className="form-group">
                  <label>
                    Task expires &nbsp;
                    <input type="text"
                           className="form-control inline_input"
                           disabled value={daysRemaining}  />
                    days from the date of purchase
                  </label>
                </div>
              </form>
            </div>
          </div>
        </ScrollArea>
      </div>
    )
  }
};
