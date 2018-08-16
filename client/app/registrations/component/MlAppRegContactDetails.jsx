import React from "react";
import {render} from "react-dom";
import {graphql} from "react-apollo";
import gql from "graphql-tag";
import Moolyaselect from "../../commons/components/MlAppSelectWrapper";
import {addRegistrationStep3Details} from "../actions/addRegistrationStep3DetailsAction";
import {findRegistrationActionHandler, findCountryCode} from "../actions/findRegistration";
import {updateRegistrationInfoDetails} from "../actions/updateRegistration";
import update from "immutability-helper";
import MlLoader from "../../../commons/components/loader/loader";
import {initalizeFloatLabel} from "../../../commons/utils/formElemUtil";
import {mlFieldValidations,validatedPhoneNumber} from "../../../commons/validations/mlfieldValidation";
import _underscore from "underscore";
var FontAwesome = require('react-fontawesome');
var diff = require('deep-diff').diff;

export default class MlAppRegContactDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedNumberTypeValue: null,
      selectedContactTab: null,
      selectedNumberTypeLabel: null,
      contactNumberObject: {numberType: "", numberTypeName: "", countryCode: "", contactNumber: ""},
      contactNumberArray: this.props.registrationInfo.contactInfo || [],
      activeTab: "active",
      countryDetails: null,
      loading: true
    }

    this.findRegistration.bind(this);
    this.fetchCountryCode.bind(this);
    return this;
  }

  componentDidMount() {
    this.findRegistration.bind(this);
    this.fetchCountryCode();
  }

  componentDidUpdate() {
    initalizeFloatLabel();
  }

  componentWillUpdate(nextProps, nextState) {

  }
  isValidate(){
    if(this.refs["contactNumber"].value){
      return false
    }else if(this.state.selectedNumberTypeLabel){
      return false
    }else{
      let newArray = this.state.contactNumberArray || []
      for (var i = 0, len = newArray.length; i < len; i++) {
        let newObject = {
          contactNumber : this.refs["contactNumber" + i].value,
        }
        let oldObject = {
          contactNumber : newArray[i]&&newArray[i].contactNumber,
        }
        var differences = diff(oldObject, newObject);
        var filteredObject = _underscore.where(differences, {kind: "E"});
        if(filteredObject && filteredObject.length>0){
          return false
        }
      }
    }
    return true
  }

  updateContactOptions(index, did, selectedValue, selObject, callback) {
    if (index !== -1) {
      // do your stuff here
      let updatedComment = update(this.state.contactNumberArray[index], {
        numberTypeName: {$set: selObject.label},
        numberType: {$set: did},
        countryCode: {$set: this.refs["countryCode" + index].value},
        contactNumber: {$set: this.refs["contactNumber" + index].value}
      });

      let newData = update(this.state.contactNumberArray, {
        $splice: [[index, 1, updatedComment]]
      });
      this.setState({
        contactNumberArray: newData,
        selectedNumberTypeValue: did,
        selectedNumberTypeLabel: selObject.label
      });

    }

  }

  async onSavingContact(index, value) {
    let detailsType = "CONTACTTYPE";
    let registerid = this.props.registerId;

    let refs = []
    refs.push(this.refs["numberType"])
    refs.push(this.refs["contactNumber"])
    let ret = mlFieldValidations(refs)
    let countrycode=this.state.countryDetails.countryCode;
    let contactNumber = this.refs["contactNumber"] && this.refs["contactNumber"].value;
    let isValidPhoneNumber = validatedPhoneNumber(countrycode, contactNumber);
    if (ret) {
      toastr.error(ret);
    } else if (countrycode && !isValidPhoneNumber) {
      toastr.error('Please enter a valid contact number');
    }else {

      let contactList = this.state.contactNumberObject;
      contactList.numberType = this.state.selectedNumberTypeValue,
        contactList.numberTypeName = this.state.selectedNumberTypeLabel,
        contactList.countryCode = this.refs["countryCode"].value,
        contactList.contactNumber = this.refs["contactNumber"].value;


      const response = await addRegistrationStep3Details(contactList, detailsType, registerid);
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
          toastr.success("Contact is created successfully");
        }

      }
    }

  }

  async onEditingContact(index, value) {
    let detailsType = "CONTACTTYPE";
    let registerid = this.props.registerId;

    let registrationDetails = this.props.registrationInfo.contactInfo
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
      let contactNumber = this.refs["numberType" + index] && this.refs["numberType" + index].value;
      let isValidPhoneNumber = validatedPhoneNumber(countrycode, contactNumber);
      if (ret) {
        toastr.error(ret);
      } else if (countrycode && !isValidPhoneNumber) {
        toastr.error('Please enter a valid contact number');
      }else {
        let labelValue = this.state.selectedNumberTypeLabel ? this.state.selectedNumberTypeLabel : this.state.contactNumberArray[index].numberTypeName;
        let valueSelected = this.state.selectedNumberTypeValue ? this.state.selectedNumberTypeValue : this.state.contactNumberArray[index].numberType;
        let updatedComment = update(this.state.contactNumberArray[index], {
          numberTypeName: {$set: labelValue},
          numberType: {$set: valueSelected},
          countryCode: {$set: this.refs["countryCode" + index].value},
          contactNumber: {$set: this.refs["contactNumber" + index].value}
        });

        let newData = update(this.state.contactNumberArray, {
          $splice: [[index, 1, updatedComment]]
        });
        const response = await updateRegistrationInfoDetails(newData, detailsType, registerid);
        if (response) {
          if (!response.success) {
            toastr.error(response.result);
          } else {
            toastr.success("Contact is updated successfully");
          }
          this.findRegistration();
          this.props.registrationDetails();
        }
      }
    }
  }

  async findRegistration() {
    let registrationId = this.props.registerId;
    const response = await findRegistrationActionHandler(registrationId);
    this.setState({loading: false, contactNumberArray: response.contactInfo});
    //this.setState({'isMoolyaChecked':this.state.data&&this.state.data.isMoolya})
    //return response;
  }

  tabSelected(index, value) {
    this.setState({selectedContactTab: true});
    this.setState({activeTab: ""});
    this.findRegistration();
    this.props.registrationDetails();
  }

  async fetchCountryCode() {
    const response = await findCountryCode(this.props.clusterId);
    this.setState({"countryDetails": response, loading: false});
  }


  optionsBySelectNumberType(selectedIndex, handler, selectedObj) {
    this.setState({selectedNumberTypeValue: selectedIndex, selectedNumberTypeLabel: selectedObj.label});
  }

  async onDeleteContact(index, value) {

    let listArray = update(this.state.contactNumberArray, {
      $splice: [[index, 1]]
    });

    let detailsType = "CONTACTTYPE";
    let registerid = this.props.registerId;
    const response = await updateRegistrationInfoDetails(listArray, detailsType, registerid);
    if (response) {
      this.setState({loading: false, contactNumberArray: response.contactInfo});
      this.findRegistration();
      this.props.registrationDetails();
      this.setState({activeTab: "active"});
      toastr.success("Contact removed successfully");
    }
  }

  async onClear(index, value) {

    this.refs["contactNumber" + index].value = "";
    /*
     let updatedComment = update(this.state.contactNumberArray[index], {
     numberType :   {$set: ""}
     });

     let newData = update(this.state.contactNumberArray, {
     $splice: [[index, 1, updatedComment]]
     });
     this.setState({contactNumberArray : newData});
     let registrationDetails = _.cloneDeep(this.state.defaultData);
     let omitData = _.omit(registrationDetails["contactInfo"][index], 'numberType') || [];
     registrationDetails["contactInfo"][index] = omitData
     this.setState({defaultData : registrationDetails});*/

  }


  render() {
    let that = this;
    let numberTypeQuery = gql`query($type:String,$hierarchyRefId:String){
     data: fetchMasterSettingsForPlatFormAdmin(type:$type,hierarchyRefId:$hierarchyRefId) {
     label
     value
     }
     }
     `;

    let numberTypeOption = {options: {variables: {type: "CONTACTTYPE", hierarchyRefId: this.props.clusterId}}};
    let countryPhoneCode = that.state.countryDetails && that.state.countryDetails.phoneNumberCode ? that.state.countryDetails.phoneNumberCode : "";
    let defaultCountryCode = this.state.countryDetails && this.state.countryDetails.phoneNumberCode ? this.state.countryDetails.phoneNumberCode : "";
    const showLoader = this.state.loading;

    return (

      <div className="panel-body">
        {showLoader === true ? (<MlLoader/>) : (
          <div className="ml_tabs">
            <ul className="nav nav-pills">
              <li className={this.state.activeTab}>
                <a href="#contactA" data-toggle="tab">Add New&nbsp;<b><FontAwesome name='plus-square'/></b></a>
              </li>

              {that.state.contactNumberArray && (that.state.contactNumberArray.map(function (options, key) {

                return (
                  <li key={key} onClick={that.tabSelected.bind(that, key)}>
                    <a data-toggle="pill" href={'#numberType' + key} className="add-contact">
                      <FontAwesome name='minus-square'
                                   onClick={that.onDeleteContact.bind(that, key)}/>{options.numberTypeName}</a>
                  </li>)
              }))}
            </ul>

            <div className="tab-content clearfix">
              <div className={"tab-pane" + this.state.activeTab} id="contactA">
                <div className="form-group">
                  <Moolyaselect multiSelect={false} ref="numberType" placeholder="Select NumberType" mandatory={true}
                                className="form-control float-label" selectedValue={this.state.selectedNumberTypeValue}
                                valueKey={'value'} labelKey={'label'} queryType={"graphql"} query={numberTypeQuery}
                                queryOptions={numberTypeOption} onSelect={this.optionsBySelectNumberType.bind(this)}
                                isDynamic={true} data-required={true} data-errMsg="Number Type is required"/>
                </div>
                <div className="form-group">
                  <input type="text" placeholder="Enter Country Code" defaultValue={defaultCountryCode}
                         ref={'countryCode'} className="form-control float-label" id="" disabled={true}/>
                </div>
                <div className="form-group mandatory">
                  <input type="text" ref={"contactNumber"} placeholder="Enter Number" id="phoneNumber"
                         className="form-control float-label" data-required={true}
                         data-errMsg="Phone Number is required"/>
                </div>
                <div className="ml_icon_btn">
                  <a href="" onClick={this.onSavingContact.bind(this)} className="save_btn"><span
                    className="ml ml-save"></span></a>
                  {/*<a href="" id="cancel_contact" className="cancel_btn"><span className="ml ml-delete"></span></a>*/}
                </div>
              </div>
              {that.state.contactNumberArray && (that.state.contactNumberArray.map(function (options, key) {
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
                           defaultValue={countryPhoneCode} valueKey={countryPhoneCode}
                           className="form-control float-label" id="" disabled={true}/>
                  </div>
                  <div className="form-group mandatory">
                    <input type="text" ref={'contactNumber' + key} placeholder="Enter Number" id="phoneNumber"
                           defaultValue={options.contactNumber}
                           className="form-control float-label" data-required={true} data-errMsg="Number is required"/>
                  </div>
                  <div className="ml_icon_btn">
                    <a href="" onClick={that.onEditingContact.bind(that, key)} className="save_btn"><span
                      className="ml ml-save"></span></a>
                    <a href="" id="cancel_contact" className="cancel_btn" onClick={that.onClear.bind(that, key)}><span
                      className="ml ml-delete"></span></a>
                  </div>
                </div>)
              }))}
            </div>
          </div>
        )}
      </div>
    )
  }
}
