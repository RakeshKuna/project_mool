/**
 * Service basic info component
 * @Author :: Mukhil P
 * @Dated :: 20/06/2017
 */

// import NPM module(s)
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import FontAwesome from 'react-fontawesome';
import Datetime from "react-datetime";
import Moment from "moment";
import ScrollArea from 'react-scrollbar';
import gql from 'graphql-tag';
import Select from 'react-select';
import { cloneDeep } from 'lodash';


// import custom method(s) and component(s)
import {
  createServiceActionHandler,
  fetchServiceActionHandler,
  updateServiceActionHandler } from '../actions/MlServiceActionHandler';
import Moolyaselect from '../../../../commons/components/MlAppSelectWrapper';

class MlAppServiceBasicInfo extends Component {

  constructor(props) {
    super(props);
    this.state={
      serviceExpiry:(props.data &&props.data.serviceExpiry) ? props.data.serviceExpiry : "",
      currentFrequency:(this.props.data&&this.props.data.sessionFrequency)? this.props.data.sessionFrequency :'Onetime',
    }
    this.changeServiceExpireTime=this.changeServiceExpireTime.bind(this);
    this.setSessionFrequency=this.setSessionFrequency.bind(this);
  }


  componentDidMount() {
    this.props.getServiceDetails();
    this.props.getRedirectServiceList(false);
    let viewMode = this.props.viewMode;
    const hight = viewMode ? 320 : 300;
    $('.float-label').jvFloat();
    var WinHeight = $(window).height();
    $('.step_form_wrap').height(WinHeight-(hight+$('.app_header').outerHeight(true)));
    this.props.activateComponent(0);
  }

  /**
   * Method :: validTillToggle
   * Desc :: set the toggle date time picker
   */
  validTillToggle(){
    if(!this.props.viewMode)
      $('#date-time').toggleClass('rdtOpen');
  }

  validDate(current) {
    let yesterday = Datetime.moment().subtract(1, 'day');
    return current.isAfter(yesterday);
  }
  /**
   * Method :: React render
   * Desc :: Showing html page
   * @returns {XML}
   */

  changeServiceExpireTime(e){
    let value = e.target.value;
    this.setState({serviceExpiry:value});
    this.props.setServiceExpiry(value)
  }

  setSessionFrequency(value){
    let days=1;
    if(value === 'Weekly'){
      days=7;
    }else if(value === 'Monthly'){
      days=30;
    }else if(value === 'Quarterly'){
      days=90;
    }else if(value === 'Yearly'){
      days=365;
    }
    this.setState({currentFrequency:value,serviceExpiry:days});
    this.props.setServiceExpiry(days)
    this.props.setSessionFrequency(value);
  }
  render(){
    const {
      data,
      clusterCode,
      clusters,
      clusterName,
      daysRemaining,
      onChangeFormField,
      validTill,
      optionsBySelectChapters,
      optionsBySelectstates,
      optionsBySelectCommunities,
      checkBoxHandler,
      options,
      setServiceExpiry,
      setSessionFrequency,
      clusterData } = this.props;

    console.log(this.props);
    // fetch states graphql query
    let statesQuery = gql`query ($countryId: String) {
      data: fetchStatesPerCountryWithAll(countryId: $countryId) {
        value: _id
        label: name
      }
    }`;

    let citiesQuery = gql`query($stateIds:[String],$countryId: String){data:fetchCitiesPerStates(stateIds:$stateIds,countryId: $countryId) {
     value:_id
     label:name
     }
   }`;

    // fetch cities graphql query
   // let citiesQuery = gql`query($countryId:String){data:fetchCitiesPerCountry(countryId:$countryId) {
   //   value:_id
   //   label:name
   //   }
   // }`;



    // fetch communities graphql query
    let fetchcommunities = gql` query{
      data:fetchCommunityDefinitionForSelect{label:name,value:code}
    }
    `;

    console.log('clusterData.state',clusterData.state);
    let states = clusterData.state ? clusterData.state : [];
    console.log(states);
    let statesOption={options: { variables: {countryId: clusterCode}}};
    let citiesOption={options: { variables: {stateIds: states,countryId: clusterCode}}};
    //let citiesOption={options: { variables: {countryId: clusterCode}}};
    return (
      <div className="step_form_wrap step1">
        <ScrollArea speed={0.8} className="step_form_wrap"smoothScrolling={true} default={true}>
          <div className="col-md-6 nopadding-left">
            <div className="form_bg">
              <form>
                <div className="form-group">
                  <input type="text"
                         placeholder="Service Name"
                         className="form-control float-label"
                         id="name"
                         value={data.name}
                         onChange={(event) => onChangeFormField(event)}
                         disabled={this.props.viewMode} />
                </div>
                <div className="form-group">
                  <label>
                    Total number of Sessions
                    <input type="text"
                           className="form-control inline_input"
                           disabled={true}
                           value={data.noOfSession} />
                  </label>
                  {/*<input type="number" className="form-control "/>*/}
                </div>
                <div className="form-group">
                  <label>Duration: &nbsp;
                    <input type="text"
                           className="form-control inline_input"
                           disabled={true}
                           value={data.duration && data.duration.hours}  /> Hours
                    <input type="text"
                           className="form-control inline_input"
                           disabled={true}
                           value={data.duration && data.duration.minutes}  /> Mins
                  </label>
                </div>
                <div className="form-group" id="date-time">
                  <span className={`placeHolder ${data.validTill ? 'active' : ''}`}>Valid Till</span>
                  <Datetime dateFormat={"DD-MM-YYYY"}
                            timeFormat={false}
                            inputProps={{placeholder: "Valid Till", disabled: this.props.viewMode,readOnly:true}}
                            closeOnSelect={true}
                            isValidDate={(current) => this.validDate(current)}
                            value={data.validTill? new Moment(data.validTill).format(Meteor.settings.public.dateOnlyFormat) : null}
                            onChange={(event) => validTill(event)}
                            disabled={this.props.viewMode}/>
                  <FontAwesome name="calendar"
                               className="password_icon"
                               onClick={this.validTillToggle.bind(this)}
                               disabled={this.props.viewMode}/>
                </div>
              </form>
            </div>
          </div>
          <div className="col-md-6 nopadding-right">
            <div className="form_bg">
              <form>
                <div className="form-group">
                  <input type="text"
                         placeholder="Display Name"
                         className="form-control float-label"
                         id="displayName"
                         value={data.displayName}
                         onChange={(event) => onChangeFormField(event)}
                         disabled={this.props.viewMode}/>
                </div>
                <div className="form-group">
                  <span className={`placeHolder ${data.sessionFrequency ? 'active' : ''}`}>Renewal Frequency</span>
                  <Select name="form-field-name"
                          options={options}
                          value={data.sessionFrequency}
                          placeholder='Renewal Frequency'
                          onChange={(value) => this.setSessionFrequency(value.value)}
                          disabled={this.props.viewMode}/>
                </div>
                <div className="form-group">
                  <input type="text"
                         placeholder="Cluster"
                         className="form-control float-label"
                         value={clusterName} disabled />
                </div>
                {/*<div className="form-group">*/}
                  {/*<Moolyaselect multiSelect={false}  placeholder={"Cluster"}  className="form-control float-label" valueKey={'value'} labelKey={'label'} value={this.state.clusters} isDynamic={true} id={'clusterquery'}  />*/}
                {/*</div>*/}
                <div className="form-group">
                  <Moolyaselect multiSelect={true}
                                placeholder={"States"}
                                className="form-control float-label"
                                valueKey={'value'}
                                labelKey={'label'}
                                selectedValue={clusterData.state}
                                value={data.state}
                                queryType={"graphql"}
                                query={statesQuery}
                                queryOptions={statesOption}
                                isDynamic={true} id={'query'}
                                onSelect={(value, calback, selObject) => optionsBySelectstates(value, calback, selObject)}
                                disabled={this.props.viewMode}/>
                </div>
                <div className="form-group">
                  <Moolyaselect multiSelect={true}
                                placeholder={"Cities"}
                                className="form-control float-label"
                                valueKey={'value'} labelKey={'label'}
                                selectedValue={clusterData.chapters}
                                value={data.chapters}
                                queryType={"graphql"}
                                query={citiesQuery}
                                queryOptions={citiesOption}
                                isDynamic={true} id={'query'}
                                onSelect={(value, calback, selObject) => optionsBySelectChapters(value, calback, selObject)}
                                disabled={this.props.viewMode}/>
                </div>
                <div className="form-group">
                  <Moolyaselect multiSelect={true}
                                placeholder={"Communities"}
                                className="form-control float-label"
                                valueKey={'value'} labelKey={'label'}
                                selectedValue={clusterData.community}
                                value={data.community}
                                queryType={"graphql"} query={fetchcommunities}
                                isDynamic={true}
                                id={'fetchcommunities'}
                                onSelect={(value, calback, selObject) => optionsBySelectCommunities(value, calback, selObject)}
                                disabled={this.props.viewMode}/>
                </div>
                <div className="form-group switch_wrap inline_switch">
                  <label>Status</label>
                  <label className="switch">
                    <input type="checkbox" checked={data.isActive} onChange={(event) => checkBoxHandler(event)}  disabled={this.props.viewMode && !this.props.canStatusChange }/>
                    <div className="slider"></div>
                  </label>
                </div>
                <br className="brclear"/>
                <div className="form-group">
                  <label>
                    Service expires &nbsp;
                    <input type="number"
                           className="form-control inline_input" onChange={(event)=>setServiceExpiry(event)}
                           disabled={(this.state.currentFrequency !== 'Onetime' || this.props.viewMode )}  value={data.serviceExpiry}  />
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
MlAppServiceBasicInfo.propTypes = {
  data: PropTypes.PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array ]),
  daysRemaining: PropTypes.oneOfType([
                  PropTypes.string,
                  PropTypes.number ]),
  getServiceDetails: PropTypes.func,
  checkBoxHandler: PropTypes.func,
  onChangeFormField: PropTypes.func
};
export default MlAppServiceBasicInfo;
