/** ************************************************************
 * Date: 19 Jun, 2017
 * Programmer: Mukhil <mukhil.padnamanabhan@raksan.in>
 * Description : This is the list view
 * JavaScript XML file MlserviceCardsList.jsx
 * *************************************************************** */

/**
 * Imports libs and components
 */
import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
var FontAwesome = require('react-fontawesome');
import Datetime from "react-datetime";
import moment from "moment";
import ScrollArea from 'react-scrollbar';
import gql from 'graphql-tag'
var Select = require('react-select');
import Moolyaselect from '../../../commons/components/MlAdminSelectWrapper';


/**
 * options
 * Description :: Used in <Select/> tag to select the frequency
 */

var options = [
  { value: 'Weekly', label: 'Weekly' },
  { value: 'Daily', label: 'Daily' },
  { value: 'Monthly', label: 'Monthly' },
  { value: 'Quarterly', label: 'Quarterly' },
  { value: 'Onetime', label: 'One Time' },
];

export default class MlServiceCardStep1 extends React.Component{
  /**
   * Constructor
   * @param props :: Object - Parents data
   */

  constructor(props){
    super(props);
  }

  /**
   * ComponentDidMount
   * Desc :: Initializing the float labels
   */


  componentDidMount()
  {
    $('.float-label').jvFloat();
    var WinHeight = $(window).height();
    $('.step_form_wrap').height(WinHeight-(310+$('.admin_header').outerHeight(true)));
  }

  /**
   * Render
   * Desc   :: Render the HTML for this component
   * @returns {HTML}
   */

  render(){
    const {serviceBasicInfo, userDetails, daysRemaining } = this.props.data;
    const stateOptions = serviceBasicInfo.state && serviceBasicInfo.state.reduce((result, data) => {
                           return result.concat({ value: data.id, label: data.name });
                         }, []);
    const cityOptions = serviceBasicInfo.city && serviceBasicInfo.city.reduce((result, data) => {
                           return result.concat({ value: data.id, label: data.name });
                         }, []);
    const communityOptions = serviceBasicInfo.community && serviceBasicInfo.community.reduce((result, data) => {
                           return result.concat({ value: data.id, label: data.name });
                         }, []);
    return (
      <div className="step_form_wrap step1">
        <ScrollArea speed={0.8} className="step_form_wrap"smoothScrolling={true} default={true} >
          <div className="col-md-6 nopadding-left">
            <div className="form_bg">
              <form>
                <div className="form-group">
                  <input type="text" placeholder="Service Name" className="form-control float-label" id="" value={serviceBasicInfo.name} disabled/>
                </div>
                <div className="form-group">
                  <label>Total number of Sessions Rs. <input type="text"className="form-control inline_input" value={serviceBasicInfo.noOfSession} disabled /> </label>
                </div>
                <div className="form-group">
                  <label>Duration: &nbsp; <input type="text" className="form-control inline_input" value={serviceBasicInfo.duration.hours} disabled /> Hours <input type="text" className="form-control inline_input"  value={serviceBasicInfo.duration.minutes} disabled /> Mins </label>
                </div>
                <div className="form-group" id="date-time">
                  <Datetime dateFormat="DD-MM-YYYY" timeFormat={false}  inputProps={{placeholder: "Valid Till",readOnly:true}}  value={serviceBasicInfo.validTill ? moment(serviceBasicInfo.validTill).format(Meteor.settings.public.dateOnlyFormat) : ''} />
                  <FontAwesome name="calendar" className="password_icon" />
                </div>
              </form>
            </div>
          </div>
          <div className="col-md-6 nopadding-right">
            <div className="form_bg">
              <form>
                <div className="form-group">
                  <input type="text" placeholder="Display Name" className="form-control float-label" value={serviceBasicInfo.displayName} disabled id=""/>
                </div>
                <span className="placeHolder active">Frequency type</span>
                <div className="form-group">
                  <Select name="form-field-name" options={options} value={serviceBasicInfo.sessionFrequency} placeholder='Frequency Type' disabled />
                </div>
                <div className="form-group">
                  <input type="text" placeholder="Cluster" className="form-control float-label" value={userDetails.clusterName} disabled/>
                </div>
                <div className="form-group">
                  <Select multi={true}
                          placeholder="States"
                          className="form-control float-label"
                          options={stateOptions}
                          value={stateOptions} disabled />
                </div>
                <div className="form-group">
                  <Select multi={true}
                          type="text"
                          placeholder="Cities"
                          className="form-control float-label"
                          options={cityOptions}
                          value={cityOptions} disabled />
                </div>
                <div className="form-group">
                  <Select multi={true}
                          type="text"
                          placeholder="Communities"
                          className="form-control float-label"
                          options={communityOptions}
                          value={communityOptions} disabled />
                </div>
                <div className="form-group switch_wrap inline_switch">
                  <label>Status</label>
                  <label className="switch">
                    <input type="checkbox" checked={serviceBasicInfo.status} />
                    <div className="slider"></div>
                  </label>
                </div>
                <br className="brclear"/>
                <div className="form-group">
                  <label>Service expires &nbsp; <input type="text" className="form-control inline_input" value={daysRemaining || ''} disabled /> days from the date of purchase</label>
                </div>
              </form>
            </div>
          </div>
        </ScrollArea>
      </div>
    )
  }
};
