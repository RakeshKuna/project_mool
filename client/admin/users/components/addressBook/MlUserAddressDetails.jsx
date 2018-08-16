/**
 * Created by Rajat
 */

import React from 'react';
import { render } from 'react-dom';
var FontAwesome = require('react-fontawesome');
import Moolyaselect from  '../../../commons/components/MlAdminSelectWrapper'
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import {findAddressBookActionHandler} from '../../actions/findUserAddressBookHandler'
export default class MlUserAddressDetails extends React.Component {
  constructor(props) {
    super(props);
    let addressInfoObject = {
      "addressType": " ", "addressTypeName": "Add New", 'name': '', 'phoneNumber': '', 'addressFlat': '',
      'addressLocality': '', 'addressLandmark': '', 'addressArea': '',
      'addressCity': '', 'addressState': '', 'addressCountry': '', 'addressPinCode': ''
    }
    this.state = {
      loading: false,
      details:this.props.addressInfoDetails,
      selectedValue: null,
      selectedTab: null,
      selectedAddressLabel: null,
      addressInformation: addressInfoObject,
      activeTab: "active",
      isDefaultAddress: null,
      countrySelectedValue:null,
      countryId:null,
      selectedStateValue:null,
      stateId:null,

    }
    return this;
  }

  componentDidMount(){
    $('#addressTab0').addClass('active');
    $('#adressType0').addClass('active');
  }

  async findRegistration(){
    let registrationId=this.props.registerId;

    const response = await findAddressBookActionHandler(registrationId);

    this.setState({loading:false,details:response.addressInfo});

  }

  addressTabSelected(index,value){
    this.setState({selectedTab : true,activeTab : ""});
    let countryValue = this.state.countryId?this.state.countryId:this.state.details[index].addressCountryId;
    this.setState({countryId:countryValue})
  }

  render(){
    let clusterId = this.props.clusterId || ""
    let details=this.state.details;
    let that=this;
    let addressTypeQuery=gql`query($type:String,$hierarchyRefId:String){
      data: fetchMasterSettingsForPlatFormAdmin(type:$type,hierarchyRefId:$hierarchyRefId) {
      label
      value
      }
      }
      `;


    let countryQuery = gql`query{
       data:fetchCountries {
          value:_id
          label:country
        }
      }`

    let statesQuery=gql`query ($countryId: String) {
        data: fetchStatesPerCountry(countryId: $countryId) {
        value: _id
        label: name
      }
    }`;

     let addressTypeOption={options: { variables: {type : "ADDRESSTYPE",hierarchyRefId:clusterId}}};
    let statesOption={options: { variables: {countryId:this.state.countryId}}};

    return (
      <div className="panel-body">
        <div className="ml_tabs">
          <ul  className="nav nav-pills">
            {details && (details.map(function(options,key){
              return(
                <li onClick={that.addressTabSelected.bind(that,key)} key={key} id={"addressTab"+key}>
                  <a data-toggle="pill" href={'#adressType'+key} className="add-contact">
                    {options.addressTypeName}</a>
                </li>)
            }))}
          </ul>
          <div className="tab-content clearfix">
            {details && (details.map(function(options,key) {
            return(
                <div className="tab-pane" id={'adressType' + key} key={key}>
                  {/*<div className="form-group">*/}
                    {/*<Moolyaselect multiSelect={false} ref={'address' + key}*/}
                                  {/*placeholder="Select NumberType" mandatory={true}*/}
                                  {/*className="form-control float-label" selectedValue={options.addressType}*/}
                                  {/*valueKey={'value'} labelKey={'label'} queryType={"graphql"} query={addressTypeQuery}*/}
                                  {/*queryOptions={addressTypeOption}*/}
                                  {/*isDynamic={true} data-required={true} data-errMsg="Address Type is required"/>*/}
                    {/*<input type="text"  ref={'name'} placeholder="Name" className="form-control float-label" defaultValue="addressType" />*/}
                  {/*</div>*/}
                  <div className="form-group mandatory">
                    <input type="text" name ={'name'} ref={'name' + key} placeholder="Name"
                           className="form-control float-label" defaultValue={options.name}
                           data-required={true} data-errMsg="Name is required" disabled={true}/>
                  </div>

                  <div className="form-group mandatory">
                    <input type="text" name ={'phoneNumber'} ref={'phoneNumber' + key} placeholder="Phone Number"
                           className="form-control float-label" defaultValue={options.phoneNumber}
                           data-required={true} data-errMsg="Phone Number is required" disabled={true}/>
                  </div>
                  <div className="form-group mandatory">
                    <input type="text" ref={'addressFlat' + key} name ={'addressFlat'} className="form-control float-label"
                           placeholder="Flat/House/Floor/Bulding No" defaultValue={options.addressFlat}
                           data-required={true} data-errMsg="Flat/House/Floor/Bulding No is required" disabled={true}/>
                  </div>
                  <div className="form-group mandatory">
                    <input type="text" ref={'addressLocality' + key} name ={'addressLocality'}
                           placeholder="Colony/Street/Locality" className="form-control float-label"
                           defaultValue={options.addressLocality}
                           data-required={true} data-errMsg="Colony/Street/Locality is required" disabled={true}/>
                  </div>
                  <div className="form-group">
                    <input type="text" ref={'addressLandmark' + key} placeholder="Landmark" name ={'addressLandmark'}
                           className="form-control float-label" defaultValue={options.addressLandmark} disabled={true}
                           />
                  </div>
                  <div className="form-group">
                    <input type="text" ref={'addressArea' + key} placeholder="Area" name ={'addressArea'}
                           className="form-control float-label" defaultValue={options.addressArea} disabled={true}
                           />
                  </div>
                  <div className="form-group mandatory">
                    <input type="text" ref={'addressCity' + key} placeholder="Town/City" name ={'addressCity'}
                           className="form-control float-label" defaultValue={options.addressCity} disabled={true}
                           data-required={true} data-errMsg="Town/City is required"/>
                  </div>
                 {/* <div className="form-group">
                    <input type="text" ref={'addressState' + key} placeholder="State" name ={'addressState'}
                           className="form-control float-label" defaultValue={options.addressState} />
                  </div>
                  <div className="form-group">
                    <input type="text" ref={'addressCountry' + key} placeholder="Country" name ={'addressCountry'}
                           className="form-control float-label" defaultValue={options.addressCountry}/>
                  </div>*/}
                  <div className="form-group">
                    <Moolyaselect multiSelect={false} ref={'addressCountry' + key} className="form-control float-label"
                                  valueKey={'value'} labelKey={'label'} placeholder="Your Country"
                                  selectedValue={options.addressCountryId} queryType={"graphql"} query={countryQuery} isDynamic={true}
                                  data-required={true} data-errMsg="Country is required" disabled={true}/>
                  </div>
                  {/* <div className="form-group">
                   <Moolyaselect multiSelect={false} ref={'addressState' + key} className="form-control float-label" valueKey={'value'}
                   labelKey={'label'} placeholder="Your State"  selectedValue={options.addressStateId} queryType={"graphql"}
                   query={statesQuery} isDynamic={true}  onSelect={that.stateUpdateOptions.bind(that,key)}
                   disabled={false}  data-errMsg="State is required"/>
                   </div>*/}
                  <Moolyaselect multiSelect={false} ref={'addressState'+ key}
                                placeholder="Select State" mandatory={true}
                                className="form-control float-label" selectedValue={options.addressStateId}
                                valueKey={'value'} labelKey={'label'} queryType={"graphql"} query={statesQuery}
                                queryOptions={statesOption}
                                isDynamic={true} data-required={true} data-errMsg="State is required" disabled={true}/>
                  <div className="form-group mandatory">
                    <input type="text" ref={'addressPinCode' + key} placeholder="Pincode" name ={'addressPinCode'}
                           className="form-control float-label" defaultValue={options.addressPinCode} disabled={true}
                           data-required={true} data-errMsg="PinCode is required"/>
                  </div>
                  <div className="form-group switch_wrap inline_switch">
                    <label>Set as default</label>
                    <label className="switch">
                      <input type="checkbox" ref={'defaultAddress'+key} defaultChecked={options.isDefaultAddress} disabled={true}/>
                      <div className="slider"></div>
                    </label>
                  </div>
                </div>)
            }))}
          </div>
        </div>
      </div>
    )}
}
