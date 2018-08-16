/**
 * Created by vishwadeep on 2/5/17.
 */

import React from 'react';
import {Meteor} from 'meteor/meteor';
import {render} from 'react-dom';
var FontAwesome = require('react-fontawesome');
import {graphql} from 'react-apollo';
import gql from 'graphql-tag';
import Moolyaselect from  '../../commons/components/MlAppSelectWrapper'
import {createUserGeneralInfoDetails} from '../actions/updateAddressBookInfo'
import {updateUserGeneralInfoDetails} from '../actions/updateAddressBookInfo'
import {findAddressBookActionHandler} from '../actions/findAddressBookAction'
import {findCountryCode} from '../../registrations/actions/findRegistration'
import {mlFieldValidations, validatedPhoneNumber} from "../../../commons/validations/mlfieldValidation";
import _ from "lodash";
import _underscore from 'underscore'
import update from "immutability-helper";
import MlLoader from '../../../commons/components/loader/loader'
import { initalizeFloatLabel } from '../../../commons/utils/formElemUtil';

export default class AppContactDetails extends React.Component {
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
  }

  componentWillMount(){
    this.fetchCountryCode();
  }

  componentDidUpdate() {
    initalizeFloatLabel();
  }

  tabSelected(index, value) {
    this.setState({selectedContactTab: true});
    this.setState({activeTab: ""});
    this.findRegistration();
    this.props.registrationDetails();
  }

  optionsBySelectNumberType(selectedIndex, handler, selectedObj) {
    this.setState({selectedNumberTypeValue: selectedIndex, selectedNumberTypeLabel: selectedObj.label});
  }

  updateContactOptions(index, did, selectedValue, selObject, callback) {
    if (index !== -1) {
      // do your stuff here
      let updatedComment = update(this.state.details[index], {
        numberTypeName: {$set: selObject.label},
        numberType: {$set: did},
        countryCode: {$set: this.refs["countryCode" + index].value},
        contactNumber: {$set: this.refs["contactNumber" + index].value}
      });

      let newData = update(this.state.details, {
        $splice: [[index, 1, updatedComment]]
      });
      this.setState({
        details: newData,
        selectedNumberTypeValue: did,
        selectedNumberTypeLabel: selObject.label
      });

    }

  }


  async onSavingContact(index, value) {
    let detailsType = "CONTACTTYPE";
    let registerid = this.props.registerId;
    let profileid = this.props.profileId;

    let refs = []
    refs.push(this.refs["numberType"])
    refs.push(this.refs["contactNumber"])
    let ret = mlFieldValidations(refs)
    let countrycode=this.state.countryDetails.countryCode;
    let contactNumber = this.refs["contactNumber"] && this.refs["contactNumber"].value;
    let isValidPhoneNumber = validatedPhoneNumber(countrycode, contactNumber);
    if (ret) {
      toastr.error(ret);
    }else if (countrycode && !isValidPhoneNumber) {
      toastr.error('Please enter a valid contact number');
    } else {

      let contactList = this.state.contactNumberObject;
      contactList.numberType = this.state.selectedNumberTypeValue,
        contactList.numberTypeName = this.state.selectedNumberTypeLabel,
        contactList.countryCode = this.refs["countryCode"].value,
        contactList.contactNumber = this.refs["contactNumber"].value;


      const response = await createUserGeneralInfoDetails(contactList, detailsType, registerid,profileid);
      if (response) {
        if (!response.success) {
          toastr.error(response.result);
          this.findRegistration();
          this.props.registrationDetails();
        } else {
          this.findRegistration();
          this.props.registrationDetails();
          this.refs.countryCode.value = "";
          this.refs["contactNumber"].value = "";
          this.setState({selectedNumberTypeValue: "", selectedNumberTypeLabel: ""});
          toastr.success("Contact added successfully");
        }

      }
    }

  }

  async onEditingContact(index, value) {
    let detailsType = "CONTACTTYPE";
    let registerid = this.props.registerId;
    let profileid = this.props.profileId;

    let registrationDetails = this.props.contactInfoDetails
    let dbData = _underscore.pluck(registrationDetails, 'numberType') || [];
    let contactExist = null;
    if (this.state.selectedNumberTypeValue) {
      contactExist = _underscore.contains(dbData, this.state.selectedNumberTypeValue);
    }

    if (contactExist) {
      toastr.error("Contact TypeAlready Exists!!!!!");
      this.findRegistration();
      this.props.registrationDetails();
    } else {
      let refs = []
      refs.push(this.refs["contactNumber" + index])
      refs.push(this.refs["numberType" + index])
      let ret = mlFieldValidations(refs)
      let countrycode=this.state.countryDetails.countryCode;
      let contactNumber = this.refs["contactNumber" + index] && this.refs["contactNumber" + index].value;
      let isValidPhoneNumber = validatedPhoneNumber(countrycode, contactNumber);
      if (ret) {
        toastr.error(ret);
      }else if (countrycode && !isValidPhoneNumber) {
        toastr.error('Please enter a valid contact number');
      } else {
        let labelValue = this.state.selectedNumberTypeLabel ? this.state.selectedNumberTypeLabel : this.state.details[index].numberTypeName;
        let valueSelected = this.state.selectedNumberTypeValue ? this.state.selectedNumberTypeValue : this.state.details[index].numberType;
        let updatedComment = update(this.state.details[index], {
          numberTypeName: {$set: labelValue},
          numberType: {$set: valueSelected},
          countryCode: {$set: this.refs["countryCode" + index].value},
          contactNumber: {$set: this.refs["contactNumber" + index].value}
        });

        let newData = update(this.state.details, {
          $splice: [[index, 1, updatedComment]]
        });
        const response = await updateUserGeneralInfoDetails(newData, detailsType, registerid, profileid);
        if (response) {
          if (!response.success) {
            toastr.error(response.result);
          } else {
            toastr.success("Contact updated successfully");
          }
          this.findRegistration();
          this.props.registrationDetails();
        }
      }
    }
  }

  async fetchCountryCode() {
    const response = await findCountryCode(this.props.clusterId);
    this.setState({"countryDetails": response, loading: false});
  }



  async onDeleteContact(index, value) {

    let listArray = update(this.state.details, {
      $splice: [[index, 1]]
    });

    let detailsType = "CONTACTTYPE";
    let registerid = this.props.registerId;
    let profileid = this.props.profileId;
    const response = await updateUserGeneralInfoDetails(listArray, detailsType, registerid, profileid);
    if (response) {
      this.setState({loading: false, details: response.contactInfo});
      this.findRegistration();
      this.props.registrationDetails();
      this.setState({activeTab: "active"});
      toastr.success("Contact removed successfully");
    }
  }

  async onClear(index, value) {
    if(index == null){
      this.refs["contactNumber"].value = ""
      this.refs["countryCode"].value = ""
    }else{
      this.refs["contactNumber" + index].value = "";
      this.refs["countryCode"+ index].value = ""
    }
  }

  async findRegistration(){
    let registrationId=this.props.registerId;

    const response = await findAddressBookActionHandler(registrationId);

    this.setState({loading:false,details:response.contactInfo});
    //this.setState({'isMoolyaChecked':this.state.data&&this.state.data.isMoolya})
    //return response;
  }

  render() {
    let that = this;
    let details = that.state.details;
    let verifiedMobileNumbers = this.props.verifiedMobileNumbers?this.props.verifiedMobileNumbers:[];
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
    // let numberTypeQuery=gql`query($type:String,$hierarchyRefId:String){
    //  data: fetchMasterSettingsForPlatFormAdmin(type:$type,hierarchyRefId:$hierarchyRefId) {
    //  label
    //  value
    //  }
    //  }
    //  `;
    // let numberTypeOption={options: { variables: {type : "CONTACTTYPE",hierarchyRefId:"svcasvsdvdsvdsv"}}};

    return (
      <div className="panel-body">
        {showLoader===true?(<MlLoader/>):(
        <div className="ml_tabs">
          <ul className="nav nav-pills">
            <li className={this.state.activeTab}>
              <a href="#contactA" data-toggle="tab"><b><FontAwesome name='plus-square'/></b></a>
            </li>
            {/* FOR VIERIFIED MOBILE NUMBERS */}
            {verifiedMobileNumbers && (verifiedMobileNumbers.map(function (options, key) {
              return (
                <li key={key} onClick={that.tabSelected.bind(that, key)}>
                  <a data-toggle="pill" href={'#Official' + key} className="add-contact">{options.numberType}</a>
                </li>
              )
            }))}
            {details && (details.map(function (options, key) {
              return (
                <li key={key} onClick={that.tabSelected.bind(that, key)}>
                  <a data-toggle="pill" href={'#numberType' + key} className="add-contact">
                    <FontAwesome name='minus-square'  onClick={that.onDeleteContact.bind(that, key)}/>{options.numberTypeName}</a>
                </li>)
            }))}
          </ul>

          <div className="tab-content clearfix">

            <div className={"tab-pane" + this.state.activeTab} id="contactA">
              <div className="form-group">
                <Moolyaselect multiSelect={false} ref="numberType" placeholder="Select Number Type" mandatory={true}
                              className="form-control float-label" selectedValue={this.state.selectedNumberTypeValue}
                              valueKey={'value'} labelKey={'label'} queryType={"graphql"} query={numberTypeQuery}
                              queryOptions={numberTypeOption} onSelect={this.optionsBySelectNumberType.bind(this)}
                              isDynamic={true} data-required={true} data-errMsg="Number Type is required"/>
              </div>
              <div className="form-group">
                <input type="text" placeholder="Enter Country Code"
                       ref={'countryCode'} className="form-control float-label"/>
              </div>
              {/*defaultValue={defaultCountryCode}*/}
              <div className="form-group mandatory">
                <input type="text" ref={"contactNumber"} placeholder="Enter Number" id="phoneNumber"
                       className="form-control float-label" data-required={true}
                       data-errMsg="Phone Number is required"/>
              </div>
              <div className="ml_icon_btn">
                <a href="" onClick={this.onSavingContact.bind(this)} className="save_btn"><span
                  className="ml ml-save"></span></a>
                <a href="" id="cancel_contact" className="cancel_btn" onClick={this.onClear.bind(this,null)}>
                  <span className="ml ml-delete"></span></a>
              </div>
            </div>


            {/* FOR VIERIFIED MOBILE NUMBERS */}
            {verifiedMobileNumbers && (verifiedMobileNumbers.map(function (options, key) {

              return (<div className="tab-pane" id={'Official' + key} key={key}>
                <div className="form-group mandatory">
                  <input type="text" placeholder="Select Number Type" value={options.numberType}
                         className="form-control float-label" readOnly={true}/>
                </div>
                <div className="form-group">
                  <input type="text" placeholder="Enter Country Code" value={options.phoneNumberCode}
                         className="form-control float-label" readOnly={true}/>
                </div>
                {/*defaultValue={countryPhoneCode} valueKey={countryPhoneCode}*/}
                <div className="form-group mandatory">
                  <input type="text" placeholder="Enter Number" id="phoneNumber" value={options.mobileNumber}
                         className="form-control float-label" readOnly={true}/>
                </div>
              </div>)
            }))}



            {details && (details.map(function (options, key) {

              return (<div className="tab-pane" id={'numberType' + key} key={key}>
                <div className="form-group">
                  <Moolyaselect multiSelect={false} ref={"numberType" + key} placeholder="Select NumberType"
                                mandatory={true}
                                className="form-control float-label" selectedValue={options.numberType}
                                valueKey={'value'} labelKey={'label'} queryType={"graphql"} query={numberTypeQuery}
                                queryOptions={numberTypeOption} onSelect={that.updateContactOptions.bind(that, key)}
                                isDynamic={true} data-required={true} data-errMsg="Number Type is required"/>
                </div>
                <div className="form-group">
                  <input type="text" placeholder="Enter Country Code" ref={'countryCode' + key}
                        className="form-control float-label"/>
                </div>
                {/*defaultValue={countryPhoneCode} valueKey={countryPhoneCode}*/}
                <div className="form-group mandatory">
                  <input type="text" ref={'contactNumber' + key} placeholder="Enter Number" id="phoneNumber"
                         defaultValue={options.contactNumber}
                         className="form-control float-label" data-required={true} data-errMsg="Number is required"/>
                </div>
                <div className="ml_icon_btn">
                  <a href="" onClick={that.onEditingContact.bind(that, key)} className="save_btn">
                    <span className="ml ml-save"></span>
                  </a>
                  <a href="" id="cancel_contact" className="cancel_btn" onClick={that.onClear.bind(that, key)}>
                    <span className="ml ml-delete"></span>
                  </a>
                </div>
              </div>)
             }))}

          </div>
        </div>)}
      </div>
    )
  }
}
