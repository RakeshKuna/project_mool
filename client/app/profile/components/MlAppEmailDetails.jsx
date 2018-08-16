/**
 * Created by viswadeep on 2/5/17.
 */
import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import {createUserGeneralInfoDetails} from '../actions/updateAddressBookInfo'
import {updateUserGeneralInfoDetails} from '../actions/updateAddressBookInfo'
import {findAddressBookActionHandler} from '../actions/findAddressBookAction'
import {findCountryCode} from '../../registrations/actions/findRegistration'
import {mlFieldValidations, validatedEmailId} from "../../../commons/validations/mlfieldValidation";
import Moolyaselect from  '../../commons/components/MlAppSelectWrapper'
var FontAwesome = require('react-fontawesome');
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import _underscore from "underscore";
import update from "immutability-helper";
import { initalizeFloatLabel } from '../../../commons/utils/formElemUtil';

export default class AppEmailDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      details:this.props.emailInfoDetails || [],
      selectedEmailTab: null,
      selectedEmailTypeLabel: null,
      selectedEmailTypeValue: null,
      emailDetailsObject: {"emailIdType": " ", "emailIdTypeName": " ", 'emailId': ''},
      activeTab: "active",
    }
    return this;
  }


  componentDidMount() {
    this.findRegistration.bind(this);
    initalizeFloatLabel();
  }

  componentWillUpdate() {
    //initalizeFloatLabel();
  }

  async findRegistration() {
    let registrationId = this.props.registerId;

    const response = await findAddressBookActionHandler(registrationId);

    this.setState({loading: false, details: response.emailInfo});
    //this.setState({'isMoolyaChecked':this.state.data&&this.state.data.isMoolya})
    //return response;
  }

  emailTabSelected() {
    this.setState({selectedEmailTab: true});
    this.findRegistration();
    this.setState({activeTab: ""});
  }

  async onSavingEmailDetails(index, value) {
    let detailsType = "EMAILTYPE";
    let registerid = this.props.registerId;
    let profileid = this.props.profileId;
    let ret = mlFieldValidations(this.refs)
    var emailId=this.refs["emailId"].value
    let isValidEmail = validatedEmailId(emailId);
    if (ret) {
      toastr.error(ret);
    } else if (emailId && !isValidEmail) {
      toastr.error('Please enter a valid EmailId');
    }else {

      let emailList = this.state.emailDetailsObject;
      emailList.emailIdType = this.state.selectedEmailTypeValue,
        emailList.emailIdTypeName = this.state.selectedEmailTypeLabel,
        emailList.emailId = this.refs["emailId"].value;
      const response = await createUserGeneralInfoDetails(emailList, detailsType, registerid, profileid);
      if (response) {
        if (!response.success) {
          toastr.error(response.result);
          this.findRegistration();
          this.props.registrationDetails();
        } else {
          this.findRegistration()
          this.props.registrationDetails();
          this.refs["emailId"].value = "";
          this.setState({selectedEmailTypeValue: "", selectedEmailTypeLabel: ""});
          toastr.success("Email-Id added successfully");
        }

      }
    }

    //this.findRegistration.bind(this);
  }

  async onUpdatingEmailDetails(index, value) {
    let detailsType = "EMAILTYPE";
    let registerid = this.props.registerId;
    let profileid = this.props.profileId;
    if (index !== -1) {
      // do your stuff here
      let registrationDetails = this.props.emailInfoDetails
      let dbData = _underscore.pluck(registrationDetails, 'emailIdType') || [];
      let contactExist = null;
      if (this.state.selectedEmailTypeValue) {
        contactExist = _underscore.contains(dbData, this.state.selectedEmailTypeValue);
      }

      if (contactExist) {
        toastr.error("Email Type Already Exists!!!!!");
        this.findRegistration();
      } else {
        let refs = []
        refs.push(this.refs["emailIdType" + index])
        refs.push(this.refs["emailId" + index])
        let ret = mlFieldValidations(refs)
        var emailId=this.refs["emailId" + index].value
        let isValidEmail = validatedEmailId(emailId);
        if (ret) {
          toastr.error(ret);
        }else if (emailId && !isValidEmail) {
          toastr.error('Please enter a valid EmailId');
        } else {
          let labelValue = this.state.selectedEmailTypeLabel ? this.state.selectedEmailTypeLabel : this.state.details[index].emailIdTypeName;
          let valueSelected = this.state.selectedEmailTypeValue ? this.state.selectedEmailTypeValue : this.state.details[index].emailIdType;
          let updatedComment = update(this.state.details[index],
            {
              emailIdTypeName: {$set: labelValue},
              emailIdType: {$set: valueSelected},
              emailId: {$set: this.refs["emailId" + index].value}
            }
          );

          let newData = update(this.state.details, {
            $splice: [[index, 1, updatedComment]]
          });


          const response = await updateUserGeneralInfoDetails(newData, detailsType, registerid,profileid);
          if (response) {
            if (!response.success) {
              toastr.error(response.result);
            } else {
              toastr.success("Email-Id updated successfully");
            }
            this.findRegistration();
            this.props.registrationDetails();

          }
        }
      }
    }
  }

  optionsBySelectEmailType(selectedIndex, handler, selectedObj) {

    this.setState({selectedEmailTypeValue: selectedIndex, selectedEmailTypeLabel: selectedObj.label});
  }

  updateEmailOptions(index, did, selectedValue, selObject, callback) {
    /* let selectedSocialLinkArray =  this.state.socialLinkArray || []
     let selectedArrayObject = selectedSocialLinkArray[index] || {};
     selectedArrayObject =  JSON.parse(JSON.stringify(selectedArrayObject));*/
    if (index !== -1) {
      // do your stuff here
      let updatedComment = update(this.state.details[index], {
        emailIdTypeName: {$set: selObject.label},
        emailIdType: {$set: did},
        emailId: {$set: this.refs["emailId" + index].value}
      });

      let newData = update(this.state.details, {
        $splice: [[index, 1, updatedComment]]
      });
      this.setState({details: newData, selectedEmailTypeValue: did, selectedEmailTypeLabel: selObject.label});

    }

  }

  async onClear(index, selectedTabValue, value) {
    if(index == null)
      this.refs["emailId"].value = "";
    else
      this.refs["emailId" + index].value = "";
  }

  async onDeleteEmail(index, value) {

    let listArray = update(this.state.details, {
      $splice: [[index, 1]]
    });

    let detailsType = "EMAILTYPE";
    let registerid = this.props.registerId;
    let profileid = this.props.profileId;
    const response = await updateUserGeneralInfoDetails(listArray, detailsType, registerid, profileid);
    if (response) {
      this.setState({loading: false, details: response.emailInfo});
      this.findRegistration();
      this.props.registrationDetails();
      this.setState({activeTab: "active"});
      toastr.success("Email-Id removed successfully");
    }
  }

  optionsBySelectEmailType(selectedIndex,handler,selectedObj){
    this.setState({selectedEmailTypeValue : selectedIndex,selectedEmailTypeLabel:selectedObj.label});
  }

  render(){
    let details=this.state.details;
    let that=this;
    let emailTypeQuery=gql`query($type:String,$hierarchyRefId:String){
     data: fetchMasterSettingsForPlatFormAdmin(type:$type,hierarchyRefId:$hierarchyRefId) {
       label
       value
       }
     }
     `;
    let emailTypeOption={options: { variables: {type : "EMAILTYPE",hierarchyRefId:this.props.clusterId}}};

    return (<div className="panel-body">
        <div className="ml_tabs">
          <ul  className="nav nav-pills">
            <li className={this.state.activeTab}>
              <a  href="#emailA" data-toggle="tab"><b><FontAwesome name='plus-square' /></b></a>
            </li>
            {details && (details.map(function(options,key){
              return(
                <li key={key} onClick={that.emailTabSelected.bind(that,key)}>
                  <a data-toggle="pill" href={'#emailIdType'+key} className="add-contact">
                    <FontAwesome name='minus-square' onClick={that.onDeleteEmail.bind(that, key)}/>{options.emailIdTypeName}</a>
                </li>)
            }))}
          </ul>
          <div className="tab-content clearfix">
            <div className={"tab-pane"+this.state.activeTab} id="emailA">
              <div className="form-group">
                <Moolyaselect multiSelect={false} ref={'emailType'}
                              placeholder="Select Email Type" mandatory={true}
                              className="form-control float-label" selectedValue={this.state.selectedEmailTypeValue}
                              valueKey={'value'} labelKey={'label'} queryType={"graphql"} query={emailTypeQuery}
                              queryOptions={emailTypeOption} onSelect={this.optionsBySelectEmailType.bind(this)}
                              isDynamic={true} data-required={true} data-errMsg="Email Type is required"/>
              </div>
              <div className="form-group mandatory">
                <input type="text" placeholder="Enter Email Id" ref={'emailId'} className="form-control float-label"
                       id="" data-required={true} data-errMsg="Email Id is required"/>
              </div>
              <div className="ml_icon_btn">
                <a href="" className="save_btn" onClick={this.onSavingEmailDetails.bind(this)}><span
                  className="ml ml-save"></span></a>
                <a href="" className="cancel_btn" onClick={this.onClear.bind(this,null)}>
                  <span className="ml ml-delete"></span></a>
              </div>
            </div>
            {details && (details.map(function(options,key) {
              return(<div className="tab-pane" id={'emailIdType'+key} key={key}>
                <div className="form-group">
                  <Moolyaselect multiSelect={false} ref={'emailIdType' + key}
                                placeholder="Select Email Type" mandatory={true}
                                className="form-control float-label" selectedValue={options.emailIdType}
                                valueKey={'value'} labelKey={'label'} queryType={"graphql"} query={emailTypeQuery}
                                queryOptions={emailTypeOption} onSelect={that.updateEmailOptions.bind(that, key)}
                                isDynamic={true} data-required={true} data-errMsg="Email Type is required"/>
                </div>
                <div className="form-group mandatory">
                  <input type="text" ref={'emailId' + key} placeholder="Enter URL" valueKey={options.emailId}
                         className="form-control float-label" defaultValue={options.emailId} data-required={true}
                         data-errMsg="Email Id is required"/>
                </div>
                <div className="ml_icon_btn">
                  <a href="" className="save_btn" onClick={that.onUpdatingEmailDetails.bind(that, key)}><span
                    className="ml ml-save"></span></a>
                  <a href="" className="cancel_btn" onClick={that.onClear.bind(that, key, options.emailIdType)}><span
                    className="ml ml-delete"></span></a>
                </div>
              </div>)
            }))}
          </div>
        </div>
      </div>
    )}
}
