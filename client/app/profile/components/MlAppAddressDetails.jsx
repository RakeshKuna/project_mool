/**
 * Created by viswadeep on 2/5/17.
 */

import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
var FontAwesome = require('react-fontawesome');
import Moolyaselect from  '../../commons/components/MlAppSelectWrapper'
import {mlFieldValidations, validatedPhoneNumber} from "../../../commons/validations/mlfieldValidation";
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import {createUserGeneralInfoDetails} from '../actions/updateAddressBookInfo'
import {updateUserGeneralInfoDetails} from '../actions/updateAddressBookInfo'
import {findAddressBookActionHandler} from '../actions/findAddressBookAction'
import update from 'immutability-helper';
import _underscore from 'underscore'
import { initalizeFloatLabel } from '../../../commons/utils/formElemUtil';
import {findCountryActionHandler} from '../../../admin/settings/countries/actions/findCountryAction';
import {OnToggleSwitch} from "../../../commons/utils/formElemUtil";

export default class AppAddressDetails extends React.Component {
  constructor(props) {
    super(props);
    let addressInfoObject = {
      "addressType": " ", "addressTypeName": "Add New", 'name': '', 'addressFlat': '',
      'addressLocality': '', 'addressLandmark': '', 'addressArea': '',
      'addressCity': '', 'addressState': '', 'addressCountry': '', 'addressPinCode': ''
    }
    this.state = {
      loading: false,
      activeTab : "active",
      details:this.props.addressInfoDetails,
      selectedValue: null,
      selectedTab: null,
      selectedAddressLabel: null,
      addressInformation: addressInfoObject,
      activeTab: "active",
      isDefaultAddress: null,
      countrySelectedValue:null,
      countryId:null,
      countryCode:null,
      selectedStateValue:null,
      stateId:null,

    }
    return this;
  }

  componentDidMount() {
    initalizeFloatLabel();
  }

  componentDidUpdate(){
    OnToggleSwitch(true,true);
 }

  optionsBySelectAddressType(selectedIndex, handler, selectedObj) {
    this.setState({selectedValue: selectedIndex, selectedAddressLabel: selectedObj.label});
  }

  /**
   * Method :: optionsBySelectCountry,optionsBySelectState
   * Desc   :: Set state on change of drop down
   * @param selectedIndex  :: String - Selected dropdown value
   * @param selectedObj  :: String -  Selected dropdown label

   * @returns set New State
   */
  optionsBySelectCountry(selectedIndex,handler,selectedObj){
    this.setState({countrySelectedValue:selectedObj.label,countryId:selectedIndex,countryCode:selectedObj.code})
  }

  optionsBySelectState(selectedIndex,handler,selectedObj){
    this.setState({selectedStateValue:selectedObj.label,stateId:selectedIndex})
  }

  async onSavingAddress(index, value) {
    const detailsType = "ADDRESSTYPE";
    const registerid = this.props.registerId;
    const profileid = this.props.profileId;
    let refs = []
    refs.push(this.refs["address"])
    refs.push(this.refs["name"])
    refs.push(this.refs["addressFlat"])
    refs.push(this.refs["addressLocality"])
    refs.push(this.refs["addressCountry"])
    refs.push(this.refs["addressState"])
    refs.push(this.refs["addressCity"])
   // refs.push(this.refs["phoneNumber"])
    refs.push(this.refs["addressPinCode"])
    let ret = mlFieldValidations(refs)


  /*  let clusterDetails = await findClusterTypeActionHandler(this.props.clusterId)
    let clusterCountry = clusterDetails && clusterDetails.countryName ? clusterDetails.countryName : null;
    let addressSelectedCountry = this.state.countrySelectedValue ? this.state.countrySelectedValue : null;*/
    let isDeafaultChecked = this.refs["defaultAddress"].checked;
    // let countrycode=this.state.countryCode?this.state.countryCode:null;
    // let contactNumber = this.refs["phoneNumber"] && this.refs["phoneNumber"].value;
    // let isValidPhoneNumber = validatedPhoneNumber(countrycode, contactNumber);
    if (ret) {
      toastr.error(ret);
    }
    // }else if (countrycode && !isValidPhoneNumber) {
    //   toastr.error('Please enter a valid contact number');
    // }
    /*else if (clusterCountry && addressSelectedCountry && isDeafaultChecked && clusterCountry != addressSelectedCountry) {
      toastr.error("Selected cluster and default address country should be same");
    } */
    else {
      let addressDetailsObject = this.state.addressInformation;
      addressDetailsObject.addressType = this.state.selectedValue,
        addressDetailsObject.addressTypeName = this.state.selectedAddressLabel,
        addressDetailsObject.name = this.refs["name"].value,
      //  addressDetailsObject.phoneNumber = this.refs["phoneNumber"].value,
        addressDetailsObject.addressFlat = this.refs["addressFlat"].value,
        addressDetailsObject.addressLocality = this.refs["addressLocality"].value,
        addressDetailsObject.addressLandmark = this.refs["addressLandmark"].value,
        addressDetailsObject.addressArea = this.refs["addressArea"].value,
        addressDetailsObject.addressCity = this.refs["addressCity"].value,
        addressDetailsObject.addressState = this.state.selectedStateValue,
        addressDetailsObject.addressStateId = this.state.stateId,
        //addressDetailsObject.addressCountry = this.refs["addressCountry"].value,
        addressDetailsObject.addressCountry = this.state.countrySelectedValue,
        addressDetailsObject.addressCountryId = this.state.countryId,
        addressDetailsObject.addressPinCode = this.refs["addressPinCode"].value,
        addressDetailsObject.isDefaultAddress = this.refs["defaultAddress"].checked
      const response = await createUserGeneralInfoDetails(addressDetailsObject, detailsType, registerid,profileid);
      if (response) {
        //this.props.getRegistrationContactInfo();
        if (!response.success) {
          toastr.error(response.result);
          this.props.registrationDetails();
        } else {
          this.findRegistration()
          this.props.registrationDetails();
          this.refs["name"].value = ""
         // this.refs["phoneNumber"].value = "";
          this.refs["addressFlat"].value = "";
          this.refs["addressLocality"].value = "";
          this.refs["addressLandmark"].value = "";
          this.refs["addressArea"].value = "";
          this.refs["addressCity"].value = "";
          //this.refs["addressState"].value = "";
          //this.refs["addressCountry"].value = "";
          this.refs["addressPinCode"].value = "";
          this.refs["defaultAddress"].checked = false
          this.setState({
            selectedValue: "",
            selectedAddressLabel: "",
            countrySelectedValue: "",
            selectedStateValue: "",
            countryId: "",
            stateId: ""
          });
          toastr.success("Address added successfully");

        }

      }
    }

  }

  async findRegistration(){
    let registrationId=this.props.registerId;

    const response = await findAddressBookActionHandler(registrationId);

    this.setState({loading:false,details:response.addressInfo});
    //this.setState({'isMoolyaChecked':this.state.data&&this.state.data.isMoolya})
    //return response;
  }


  async onDeleteAddress(index,value){

    let listArray = update(this.state.details, {
      $splice: [[index, 1]]
    });
    let detailsType = "ADDRESSTYPE";
    let registerid = this.props.registerId;
    /*const response = await updateUserContactInfoDetails(listArray,detailsType,registerid);
    if(response){
      this.setState({loading:false,addressDetails:response.addressInfo});
      this.findRegistration();
      this.props.registrationDetails();
      this.setState({activeTab : "active"});
      toastr.success("Address removed successfully");
    }*/
  }

  updateOptions(index, did, selectedValue, selObject,callback){
    /* let selectedSocialLinkArray =  this.state.socialLinkArray || []
     let selectedArrayObject = selectedSocialLinkArray[index] || {};
     selectedArrayObject =  JSON.parse(JSON.stringify(selectedArrayObject));*/
    if (index !== -1) {
      // do your stuff here

      let updatedComment = update(this.state.details[index], {
        addressTypeName : {$set: selObject.label},
        addressType : {$set: did},
        name : {$set: this.refs["name"+index].value},
        //phoneNumber : {$set: this.refs["phoneNumber"+index].value},
        addressFlat : {$set: this.refs["addressFlat"+index].value},
        addressLocality : {$set: this.refs["addressLocality"+index].value},
        addressLandmark : {$set: this.refs["addressLandmark"+index].value},
        addressArea : {$set: this.refs["addressArea"+index].value},
        addressCountry : {$set: this.refs["addressCountry"+index].value},
        addressState : {$set: this.refs["addressState"+index].value},
        addressCity : {$set: this.refs["addressCity"+index].value},
        addressPinCode : {$set: this.refs["addressPinCode"+index].value}
      });

      let newData = update(this.state.details, {
        $splice: [[index, 1, updatedComment]]
      });

      this.setState({details : newData,selectedValue : did,selectedAddressLabel : selObject.label});

    }

  }


  /**
   * Method :: countryUpdateOptions,stateUpdateOptions
   * Desc   :: Set state on change of drop down
   * @param selObject  :: Object - Contains Selected dropdown label
   * @param selectedValue  :: String -  Selected dropdown value

   * @returns set New State of address details
   */

  countryUpdateOptions(index, did, selectedValue, selObject,callback){

    if (index !== -1) {
      // do your stuff here

      let updatedComment = update(this.state.details[index], {
        addressTypeName : {$set: this.state.details[index].addressTypeName},
        addressType : {$set: this.state.details[index].addressType},
        name : {$set: this.refs["name"+index].value},
      //  phoneNumber : {$set: this.refs["phoneNumber"+index].value},
        addressFlat : {$set: this.refs["addressFlat"+index].value},
        addressLocality : {$set: this.refs["addressLocality"+index].value},
        addressLandmark : {$set: this.refs["addressLandmark"+index].value},
        addressArea : {$set: this.refs["addressArea"+index].value},
        addressCity : {$set: this.refs["addressCity"+index].value},
        addressState :  {$set: this.state.details[index].addressState},
        addressStateId :  {$set: this.state.details[index].addressStateId},
        addressCountry : {$set: selObject.label},
        addressCountryId :  {$set: did},
        addressPinCode : {$set: this.refs["addressPinCode"+index].value}
      });

      let newData = update(this.state.details, {
        $splice: [[index, 1, updatedComment]]
      });

      this.setState({details : newData,countrySelectedValue : selObject.label,countryId:did,countryCode:selObject.code});

    }


  }

  componentWillUpdate() {
    //initalizeFloatLabel();
  }

  stateUpdateOptions(index, did, selectedValue, selObject,callback){

    if (index !== -1) {
      // do your stuff here

      let updatedComment = update(this.state.details[index], {
        addressTypeName : {$set: this.state.details[index].addressTypeName},
        addressType : {$set: this.state.details[index].addressType},
        name : {$set: this.refs["name"+index].value},
       // phoneNumber : {$set: this.refs["phoneNumber"+index].value},
        addressFlat : {$set: this.refs["addressFlat"+index].value},
        addressLocality : {$set: this.refs["addressLocality"+index].value},
        addressLandmark : {$set: this.refs["addressLandmark"+index].value},
        addressArea : {$set: this.refs["addressArea"+index].value},
        addressCity : {$set: this.refs["addressCity"+index].value},
        addressState : {$set: selObject.label},
        addressStateId : {$set: did},
        addressCountry :  {$set: this.state.details[index].addressCountry},
        addressCountryId :  {$set: this.state.details[index].addressCountryId},
        addressPinCode : {$set: this.refs["addressPinCode"+index].value}
      });

      let newData = update(this.state.details, {
        $splice: [[index, 1, updatedComment]]
      });

      this.setState({details : newData,selectedStateValue : selObject.label,stateId:did});

    }


  }

  async onEditAddress(index,value) {
    const detailsType = "ADDRESSTYPE";
    const registerid = this.props.registerId;
    const profileid = this.props.profileId;

    if (index !== -1) {
      // do your stuff here
      let registrationDetails = this.props.addressInfoDetails
      let dbData = _underscore.pluck(registrationDetails, 'addressType') || [];
      let contactExist = null;
      if (this.state.selectedValue) {
        contactExist = _underscore.contains(dbData, this.state.selectedValue);
      }
   /*   let clusterDetails = await findClusterTypeActionHandler(this.props.clusterId)
      let clusterCountry = clusterDetails&&clusterDetails.countryName?clusterDetails.countryName:null;
      let addressSelectedCountry = this.state.countrySelectedValue?this.state.countrySelectedValue:this.state.addressDetails[index].addressCountry;
*/
      let isDeafaultChecked = this.refs["defaultAddress"+index].checked;

      if (contactExist) {
        toastr.error("Address Type Already Exists!!!!!");
        this.findRegistration();
        this.props.registrationDetails();
      } else {
        let refs = []
        refs.push(this.refs["address" + index])
        refs.push(this.refs["name" + index])
        refs.push(this.refs["addressFlat" + index])
        refs.push(this.refs["addressLocality" + index])
        refs.push(this.refs["addressCountry" + index])
        refs.push(this.refs["addressState" + index])
        refs.push(this.refs["addressCity" + index])
      //  refs.push(this.refs["phoneNumber" + index])
        refs.push(this.refs["addressPinCode" + index])
        let ret = mlFieldValidations(refs)
        // let countrycode=this.state.countryCode?this.state.countryCode:null;
        // let contactNumber = this.refs["phoneNumber" + index] && this.refs["phoneNumber" + index].value;
        // let isValidPhoneNumber = validatedPhoneNumber(countrycode, contactNumber);
        if (ret) {
          toastr.error(ret);
        }
        // else if (countrycode && !isValidPhoneNumber) {
        //   toastr.error('Please enter a valid contact number');
        // }
        /*else if(clusterCountry && addressSelectedCountry && isDeafaultChecked && clusterCountry != addressSelectedCountry) {
          toastr.error("Selected cluster and default address country should be same");
        }*/ else {
          let labelValue = this.state.selectedAddressLabel ? this.state.selectedAddressLabel : this.state.details[index].addressTypeName;
          let valueSelected = this.state.selectedValue ? this.state.selectedValue : this.state.details[index].addressType;
          let countryLabelValue = this.state.countrySelectedValue ? this.state.countrySelectedValue : this.state.details[index].addressCountry;
          let countryIDValue = this.state.countryId ? this.state.countryId : this.state.details[index].addressCountryId;
          let stateLabelValue = this.state.selectedStateValue ? this.state.selectedStateValue : this.state.details[index].addressState;
          let stateIDValue = this.state.stateId ? this.state.stateId : this.state.details[index].addressStateId;
          let updatedComment = update(this.state.details[index], {
            addressTypeName: {$set: labelValue},
            addressType: {$set: valueSelected},
            name: {$set: this.refs["name" + index].value},
          //  phoneNumber: {$set: this.refs["phoneNumber" + index].value},
            addressFlat: {$set: this.refs["addressFlat" + index].value},
            addressLocality: {$set: this.refs["addressLocality" + index].value},
            addressLandmark: {$set: this.refs["addressLandmark" + index].value},
            addressArea: {$set: this.refs["addressArea" + index].value},
            addressCity: {$set: this.refs["addressCity" + index].value},
            addressState: {$set: stateLabelValue},
            addressStateId: {$set: stateIDValue},
            addressCountry: {$set: countryLabelValue},
            addressCountryId: {$set: countryIDValue},
            addressPinCode: {$set: this.refs["addressPinCode" + index].value},
            isDefaultAddress : {$set:this.refs["defaultAddress"+index].checked}
          });

          let newData = update(this.state.details, {
            $splice: [[index, 1, updatedComment]]
          });

          const response = await updateUserGeneralInfoDetails(newData, detailsType, registerid,profileid);
          if (response) {
            if (!response.success) {
              toastr.error(response.result);
            } else {
              toastr.success("Address updated successfully");
            }
            this.findRegistration();
            this.props.registrationDetails();
          }
        }
      }
    }
  }

  async addressTabSelected(index,value){
    this.setState({selectedTab : true,activeTab : ""});
    let countryValue = this.state.countryId?this.state.countryId:this.state.details[index].addressCountryId;
    const response = await findCountryActionHandler(countryValue);
    this.setState({countryId:countryValue,countryCode:response.countryCode})
  }

  async onDeleteAddress(index,value){

    let listArray = update(this.state.details, {
      $splice: [[index, 1]]
    });
    let detailsType = "ADDRESSTYPE";
    let registerid = this.props.registerId;
    let profileid = this.props.profileId;
    const response = await updateUserGeneralInfoDetails(listArray,detailsType,registerid,profileid);
    if(response){
      this.setState({loading:false,details:response.addressInfo});
      this.findRegistration();
      this.props.registrationDetails();
      this.setState({activeTab : "active"});
      toastr.success("Address removed successfully");
    }
  }

  async onClear(index,value){
    if(index == null){
      this.refs["name"].value = "";
    //  this.refs["phoneNumber"].value = "";
      this.refs["addressFlat"].value = "";
      this.refs["addressLocality"].value = "";
      this.refs["addressLandmark"].value = "";
      this.refs["addressArea"].value = "";
      this.refs["addressCountry"].value = "";
      this.refs["addressState"].value = "";
      this.refs["addressCity"].value = "";
      this.refs["addressPinCode"].value = "";

    }else{
      this.refs["name"+index].value = "";
      //this.refs["phoneNumber"+index].value = "";
      this.refs["addressFlat"+index].value = "";
      this.refs["addressLocality"+index].value = "";
      this.refs["addressLandmark"+index].value = "";
      this.refs["addressArea"+index].value = "";
      this.refs["addressCountry"+index].value = "";
      this.refs["addressState"+index].value = "";
      this.refs["addressCity"+index].value = "";
      this.refs["addressPinCode"+index].value = "";

    }

  }


  onMakeDefaultChange(index){
    let addressInfo = this.props&&this.props.addressInfoDetails?this.props.addressInfoDetails:[];
    let presentObject = addressInfo&&addressInfo[index]?addressInfo[index]:{}
    let presentObjIsDefault = presentObject&&presentObject.isDefaultAddress?presentObject.isDefaultAddress:null
    if(!presentObjIsDefault){
      let dbData = _underscore.pluck(addressInfo, 'isDefaultAddress') || [];
      let defaultAdrsExist = null;
      defaultAdrsExist = _underscore.contains(dbData,true );

      if(defaultAdrsExist){
        toastr.error("Default Address Already Exists!!!!!");
        if(index<0){
          this.refs["defaultAddress"].checked = false
        }else{
          this.refs["defaultAddress"+index].checked = false
        }

      }
    }


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
          label:country,
          code: countryCode
        }
      }`

      let statesQuery=gql`query ($countryId: String,$activeCheck : Boolean) {
        data: fetchStatesPerCountry(countryId: $countryId, activeCheck : $activeCheck) {
        value: _id
        label: name
      }
    }`;

     let addressTypeOption={options: { variables: {type : "ADDRESSTYPE",hierarchyRefId:clusterId}}};
    let statesOption={options: { variables: {countryId:this.state.countryId,activeCheck:false}}};

    return (
      <div className="panel-body">
        <div className="ml_tabs">
          <ul  className="nav nav-pills">
            <li className={this.state.activeTab}>
              <a  href="#1a" data-toggle="tab"><b><FontAwesome name='plus-square' /></b></a>
            </li>
            {details && (details.map(function(options,key){
              return(
                <li onClick={that.addressTabSelected.bind(that,key)} key={key}>
                  <a data-toggle="pill" href={'#adressType'+key} className="add-contact">
                    <FontAwesome name='minus-square' onClick={that.onDeleteAddress.bind(that,key)}/>{options.addressTypeName}</a>
                </li>)
            }))}
          </ul>
          <div className="tab-content clearfix">
            <div className={"tab-pane"+this.state.activeTab} id="1a">
              <div className="form-group">
                <Moolyaselect multiSelect={false} ref={'address'}
                              placeholder="Select Address Type" query={addressTypeQuery} queryOptions={addressTypeOption}
                              className="form-control float-label" selectedValue={this.state.selectedValue}
                              valueKey={'value'} labelKey={'label'} queryType={"graphql"} mandatory={true}
                              isDynamic={true} onSelect={this.optionsBySelectAddressType.bind(this)}
                              data-required={true} data-errMsg="Address Type is required"/>
                {/*<input type="text"  ref={'name'} placeholder="Name" className="form-control float-label" />*/}
              </div>
              <div className="form-group mandatory">
                <input type="text"  ref={'name'} placeholder="Name" className="form-control float-label" data-required={true} data-errMsg="Name is required"/>
              </div>
              <div className="form-group mandatory">
                <input type="text" ref={'addressFlat'} placeholder="Flat/House/Floor/Building No" className="form-control float-label"  data-required={true} data-errMsg="Flat/House/Floor/Bulding No is required"/>
              </div>
              <div className="form-group mandatory">
                <input type="text" ref={'addressLocality'} placeholder="Colony/Street/Locality" className="form-control float-label" data-required={true} data-errMsg="Colony/Street/Locality is required"/>
              </div>
              <div className="form-group">
                <input type="text" ref={'addressLandmark'} placeholder="Landmark" className="form-control float-label" />
              </div>
              <div className="form-group">
                <input type="text" ref={'addressArea'} placeholder="Area" className="form-control float-label"/>
              </div>
              <div className="form-group">
                <Moolyaselect multiSelect={false} ref={'addressCountry'}
                              placeholder="Select Country" mandatory={true}
                              className="form-control float-label" selectedValue={this.state.countryId}
                              valueKey={'value'} labelKey={'label'} queryType={"graphql"} query={countryQuery}
                              onSelect={this.optionsBySelectCountry.bind(this)}
                              isDynamic={true} data-required={true} data-errMsg="Country is required"/>
              </div>
              <Moolyaselect multiSelect={false} ref={'addressState'}
                            placeholder="Select State" mandatory={true}
                            className="form-control float-label" selectedValue={this.state.stateId}
                            valueKey={'value'} labelKey={'label'} queryType={"graphql"} query={statesQuery}
                            onSelect={this.optionsBySelectState.bind(this)} queryOptions={statesOption}
                            isDynamic={true} data-required={true} data-errMsg="State is required"/>
              <div className="form-group mandatory">
                <input type="text" ref={'addressCity'} placeholder="Town/City" className="form-control float-label" data-required={true} data-errMsg="Town/City is required"/>
              </div>
              {/*<div className="form-group mandatory">*/}
                {/*<input type="text" ref={'phoneNumber'} placeholder="Phone Number" className="form-control float-label" data-required={true} data-errMsg="Phone Number is required" />*/}
              {/*</div>*/}
              <div className="form-group mandatory">
                <input type="text" ref={'addressPinCode'} placeholder="Pincode" name ={'addressPinCode'}
                       className="form-control float-label" data-required={true} data-errMsg="PinCode is required" />
              </div>
              <div className="form-group switch_wrap inline_switch">
                <label>Is Default Address</label>
                <label className="switch">
                  <input type="checkbox" ref={'defaultAddress'}  onChange={this.onMakeDefaultChange.bind(this,-1)}/>
                  <div className="slider"></div>
                </label>
              </div>
              <div className="ml_icon_btn">
                <a href="" className="save_btn"  onClick={this.onSavingAddress.bind(this)}>
                  <span className="ml ml-save"></span>
                </a>
                <a href="" className="cancel_btn"  onClick={this.onClear.bind(this,null)}>
                  <span className="ml ml-delete"></span></a>
              </div>
            </div>
            {details && (details.map(function(options,key) {
            return(
                <div className="tab-pane" id={'adressType' + key} key={key}>
                  <div className="form-group">
                    <Moolyaselect multiSelect={false} ref={'address' + key}
                                  placeholder="Select NumberType" mandatory={true}
                                  className="form-control float-label" selectedValue={options.addressType}
                                  valueKey={'value'} labelKey={'label'} queryType={"graphql"} query={addressTypeQuery}
                                  queryOptions={addressTypeOption}
                                  isDynamic={true} data-required={true} data-errMsg="Address Type is required"/>
                    {/*<input type="text"  ref={'name'} placeholder="Name" className="form-control float-label" defaultValue="addressType" />*/}
                  </div>
                  <div className="form-group mandatory">
                    <input type="text" name ={'name'} ref={'name' + key} placeholder="Name"
                           className="form-control float-label" defaultValue={options.name}
                           data-required={true} data-errMsg="Name is required"/>
                  </div>
                  <div className="form-group mandatory">
                    <input type="text" ref={'addressFlat' + key} name ={'addressFlat'} className="form-control float-label"
                           placeholder="Flat/House/Floor/Bulding No" defaultValue={options.addressFlat}
                           data-required={true} data-errMsg="Flat/House/Floor/Bulding No is required"/>
                  </div>
                  <div className="form-group mandatory">
                    <input type="text" ref={'addressLocality' + key} name ={'addressLocality'}
                           placeholder="Colony/Street/Locality" className="form-control float-label"
                           defaultValue={options.addressLocality}
                           data-required={true} data-errMsg="Colony/Street/Locality is required"/>
                  </div>
                  <div className="form-group">
                    <input type="text" ref={'addressLandmark' + key} placeholder="Landmark" name ={'addressLandmark'}
                           className="form-control float-label" defaultValue={options.addressLandmark}
                           />
                  </div>
                  <div className="form-group">
                    <input type="text" ref={'addressArea' + key} placeholder="Area" name ={'addressArea'}
                           className="form-control float-label" defaultValue={options.addressArea}
                           />
                  </div>
                  <div className="form-group mandatory">
                    <input type="text" ref={'addressCity' + key} placeholder="Town/City" name ={'addressCity'}
                           className="form-control float-label" defaultValue={options.addressCity}
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
                                  selectedValue={options.addressCountryId} queryType={"graphql"} query={countryQuery} isDynamic={true}  onSelect={that.countryUpdateOptions.bind(that,key)}
                                  disabled={false}  data-required={true} data-errMsg="Country is required"/>
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
                                onSelect={that.stateUpdateOptions.bind(that,key)} queryOptions={statesOption}
                                isDynamic={true} data-required={true} data-errMsg="State is required"/>
                  {/*<div className="form-group mandatory">*/}
                    {/*<input type="text" name ={'phoneNumber'} ref={'phoneNumber' + key} placeholder="Phone Number"*/}
                           {/*className="form-control float-label" defaultValue={options.phoneNumber}*/}
                           {/*data-required={true} data-errMsg="Phone Number is required" />*/}
                  {/*</div>*/}
                  <div className="form-group mandatory">
                    <input type="text" ref={'addressPinCode' + key} placeholder="Pincode" name ={'addressPinCode'}
                           className="form-control float-label" defaultValue={options.addressPinCode}
                           data-required={true} data-errMsg="PinCode is required"/>
                  </div>
                  <div className="form-group switch_wrap inline_switch">
                    <label>Is Default Address</label>
                    <label className="switch">
                      <input type="checkbox" ref={'defaultAddress'+key} defaultChecked={options.isDefaultAddress} onChange={that.onMakeDefaultChange.bind(that,key)}/>
                      <div className="slider"></div>
                    </label>
                  </div>

                  <div className="ml_icon_btn">
                    {/*<a href="" className="save_btn">Save</a>*/}
                    <a href="" onClick={that.onEditAddress.bind(that,key)}
                       className="save_btn"><span
                      className="ml ml-save"></span></a>
                    <a href="" className="cancel_btn" onClick={that.onClear.bind(that,key)}><span className="ml ml-delete"></span></a>
                  </div>
                </div>)
            }))}
          </div>
        </div>
      </div>
    )}
}
