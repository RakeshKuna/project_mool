/**
 * Created by Rajat
 */

import React from 'react';
import {render} from 'react-dom';
var FontAwesome = require('react-fontawesome');
import gql from 'graphql-tag';
import {findAddressBookActionHandler} from '../../actions/findUserAddressBookHandler'
import {findCountryCode} from '../../actions/findUserAddressBookHandler'
// import MlLoader from '../../../../commons/components/loader/loader'

export default class MlUserContactDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      details: this.props.contactInfoDetails,
      selectedNumberTypeValue: null,
      selectedContactTab: null,
      selectedNumberTypeLabel: null,
      contactNumberObject: {numberType: "", numberTypeName: "", countryCode: "", contactNumber: ""},
      activeTab: "active",
      countryDetails: null,
    }
    // this.onSelectAddress.bind(this)
    this.fetchCountryCode.bind(this);
    return this;
  }

  componentDidMount() {
    this.fetchCountryCode();
    $('#numberTab0').addClass('active');
    $('#numberType0').addClass('active');
  }

  componentWillMount(){
    this.fetchCountryCode();
  }


  tabSelected(index, value) {
    this.setState({selectedContactTab: true});
    this.setState({activeTab: ""});
    this.findRegistration();
    this.props.registrationDetails();
  }

  optionsBySelectNumberType(selectedIndex, handler, selectedObj) {
  }

  async fetchCountryCode() {
    const response = await findCountryCode(this.props.clusterId);
    this.setState({"countryDetails": response, loading: false});
  }

  async findRegistration(){
    let registrationId=this.props.registerId;

    const response = await findAddressBookActionHandler(registrationId);

    this.setState({loading:false,details:response.contactInfo});
  }

  render() {
    let that = this;
    let details = that.state.details
    let clusterId = this.props.clusterId || ""
    let numberTypeQuery = gql`query($type:String,$hierarchyRefId:String){
     data: fetchMasterSettingsForPlatFormAdmin(type:$type,hierarchyRefId:$hierarchyRefId) {
     label
     value
     }
     }
     `;

    let numberTypeOption = {options: {variables: {type: "CONTACTTYPE", hierarchyRefId: clusterId}}};
    let countryPhoneCode = that.state.countryDetails && that.state.countryDetails.phoneNumberCode ? that.state.countryDetails.phoneNumberCode : "";
    let defaultCountryCode = this.state.countryDetails && this.state.countryDetails.phoneNumberCode ? this.state.countryDetails.phoneNumberCode : "";
    const showLoader = this.state.loading;

    return (
      <div className="panel-body">
        {/*{showLoader===true?(<MlLoader/>):(*/}
        <div className="ml_tabs">
          <ul className="nav nav-pills">
            {details && (details.map(function (options, key) {
              return (
                <li key={key} onClick={that.tabSelected.bind(that, key)} id={"numberTab"+key}>
                  <a data-toggle="pill" href={'#numberType' + key} className="add-contact">
                    {options.numberTypeName}</a>
                </li>)
            }))}
          </ul>

          <div className="tab-content clearfix">
            {details && (details.map(function (options, key) {

              return (<div className="tab-pane" id={'numberType' + key} key={key}>
                {/*<div className="form-group">*/}
                  {/*<Moolyaselect multiSelect={false} ref={"numberType" + key} placeholder="Select NumberType"*/}
                                {/*mandatory={true}*/}
                                {/*className="form-control float-label" selectedValue={options.numberType}*/}
                                {/*valueKey={'value'} labelKey={'label'} queryType={"graphql"} query={numberTypeQuery}*/}
                                {/*queryOptions={numberTypeOption}*/}
                                {/*isDynamic={true} data-required={true} data-errMsg="Number Type is required"/>*/}
                {/*</div>*/}
                <div className="form-group">
                  <input type="text" placeholder="Enter Country Code" ref={'countryCode' + key}
                         defaultValue={countryPhoneCode} valueKey={countryPhoneCode}
                         className="form-control float-label" id="" disabled={true}/>
                </div>
                <div className="form-group mandatory">
                  <input type="text" ref={'contactNumber' + key} placeholder="Enter Number" id="phoneNumber"
                         defaultValue={options.contactNumber}
                         className="form-control float-label" data-required={true} data-errMsg="Number is required" disabled={true}/>
                </div>
              </div>)
             }))}

          </div>
        </div>
        {/*)}*/}
      </div>
    )
  }
}
