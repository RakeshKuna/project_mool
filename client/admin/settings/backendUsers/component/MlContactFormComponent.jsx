import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag'
import Moolyaselect from  '../../../commons/components/MlAdminSelectWrapper';
import {findCountryCode, findCountryCodeForDisplayName} from "../actions/findCountryCode";
import { fetchMasterNumberType } from '../actions/fetchMasterNumberType';
import { validatedPhoneNumber_strict } from "../../../../commons/validations/mlfieldValidation";
var FontAwesome = require('react-fontawesome');

export default class MlContactFormComponent extends React.Component {
  constructor(props){
    super(props);
    this.state={
      newContactForm:{contactNumberType: null,countryCode:'',number:null,isOTPValidated:false},
      isWorkEnble:true,
      isOfficeEnable:false,
      activeTab:0,
      contactForm:[],
      displayCountryCode:''
    }
    this.onChangeNumberType =  this.onChangeNumberType.bind(this);
    this.onChangeCountryCode =  this.onChangeCountryCode.bind(this);
    this.onNumberChange =  this.onNumberChange.bind(this);
    this.tabSelected = this.tabSelected.bind(this);
    this.onDeleteContact = this.onDeleteContact.bind(this);
    this.fetchNumberTypeLabel = this.fetchNumberTypeLabel.bind(this);
    this.getCountryCode = this.getCountryCode.bind(this);
  }

  componentDidMount() {
    this.props.getAssignedContacts(this.state.contactForm);
    let defaultCountryCode = this.state.countryDetails && this.state.countryDetails.phoneNumberCode ? this.state.countryDetails.phoneNumberCode : "";
    this.setState({defaultCountryCode});

    this.fetchCountryCode();
  }

  async getCountryCode(code){
    const response = await findCountryCodeForDisplayName(code);
    if(response && response.displayName && response.phoneNumberCode){
      code = `${response.displayName} (${response.phoneNumberCode})`;
    }
    this.setState({xcountryCode:code});
    return code;
  }

  componentWillMount(){
    let assignContactForm = this.props.contacts;
    if (assignContactForm && assignContactForm.length>0) {
      let contactForm=[];
      for(let i=0;i<assignContactForm.length;i++){
        let json={
          contactNumberType:assignContactForm[i].contactNumberType,
          countryCode:assignContactForm[i].countryCode,
          number:assignContactForm[i].number,
          isOTPValidated:assignContactForm[i].isOTPValidated
        }
        contactForm.push(json)
      }
      this.setState({contactForm});
    }

    this.findMasterNumberType();
  }

  fetchNumberTypeLabel(value){
    let { masterNumberType } = this.state;
    let result = 'New';
    if(masterNumberType && masterNumberType.length){
      masterNumberType.map((obj,index)=>{
        if(obj.value === value){
          result = obj.label;
        }
      });
    }

    return result;
  }

  async findMasterNumberType() {
    let variable = {type: "CONTACTTYPE2"};
    const response = await fetchMasterNumberType(variable);
    if(response && response.length)
      this.setState({"masterNumberType": response});
  }

  async fetchCountryCode() {
    let clusterId = this.props.clusterId;
    if(clusterId){
      const response = await findCountryCode(clusterId);
      let displayCountryCode='';
      let phoneNumberCode = response && response.phoneNumberCode ? response.phoneNumberCode : "";
      let countryCode = response && response.countryCode ? response.countryCode : "";
      if(response && response.displayName){
        displayCountryCode = `${response.displayName} (${phoneNumberCode})`;
      }
      this.setState({displayCountryCode, countryCode});
    }
  }

  addNewTab(){
    let {contactForm, newContactForm, countryCode} = this.state;
    let code = countryCode;
    if(!newContactForm.countryCode && !countryCode){
      toastr.error('Please enter a valid Country Code');
    } else if(!newContactForm.countryCode){
      newContactForm.countryCode = countryCode;
    }else{
      code = newContactForm.countryCode;
    }
    let isValidPhoneNumber = validatedPhoneNumber_strict(code, newContactForm.number);

    if(!isValidPhoneNumber){
      toastr.error('Please enter a valid contact number');
    }else if(!newContactForm.contactNumberType){
      toastr.error('Please enter a valid Number Type');
    }else if(!newContactForm.countryCode){
      toastr.error('Please enter a valid County Code');
    }else{
      contactForm.push(newContactForm);
      newContactForm = {contactNumberType: null,countryCode:'',number:'',isOTPValidated:false};
      this.setState({contactForm,newContactForm});
      this.props.getAssignedContacts(contactForm);
    }
  }

  tabSelected(index){
    let {contactForm,activeTab} = this.state;
    if(index<=contactForm.length);
      this.setState({activeTab:index});

    let xcontactForm ={};
    let countryCode = this.state.displayCountryCode;

    if(index>0){
      xcontactForm = contactForm[index-1];
      if(xcontactForm.countryCode){
        countryCode = this.getCountryCode(xcontactForm.countryCode);
      }else
      this.setState({xcountryCode:countryCode});
    }else{
      contactForm = this.state.newContactForm;
    }
  }

  onDeleteContact(index){
    let {contactForm,activeTab} = this.state;
    contactForm.splice(index,1);
    this.setState({contactForm,activeTab:0});
    this.props.getAssignedContacts(contactForm);
  }

  onChangeCountryCode(value,handler,selectedObj){
    let { contactForm, newContactForm } = this.state;
    if(this.state.activeTab>0){
      contactForm[this.state.activeTab-1].countryCode = value;
      this.setState({contactForm});
      this.props.getAssignedContacts(contactForm);
    }else{
      newContactForm.countryCode = value;
      this.setState({newContactForm});
    }
  }

  onChangeNumberType(value,handler,selectedObj){
    let { contactForm, newContactForm } = this.state;
    if(this.state.activeTab>0){
      contactForm[this.state.activeTab-1].contactNumberType = value;
      this.setState({contactForm});
      this.props.getAssignedContacts(contactForm);
    }else{
      newContactForm.contactNumberType = value;
      this.setState({newContactForm});
    }
  }

  onNumberChange(value){
    let { contactForm, newContactForm } = this.state;
    if(this.state.activeTab>0){
      contactForm[this.state.activeTab-1].number = value;
      this.setState({contactForm});
      this.props.getAssignedContacts(contactForm);
    }else{
      newContactForm.number = value;
      this.setState({newContactForm});
    }
  }

  onChangeOPTValidation(value){
    let { contactForm, newContactForm } = this.state;
    if(this.state.activeTab>0){
      contactForm[this.state.activeTab-1].isOTPValidated = value;
      this.setState({contactForm});
      this.props.getAssignedContacts(contactForm);
    }else{
      newContactForm.isOTPValidated = value;
      this.setState({newContactForm});
    }
  }

  render() {
    let query=gql`query{
        data:fetchCountriesForCountryCode {
          value:countryCode
          label:displayName
        }
      }
    `;

    let that = this;
    let contactForm ={};
    let displayCountryCode = that.state.displayCountryCode;
    // let countryCode =displayCountryCode;
    if(this.state.activeTab>0){
      contactForm = this.state.contactForm[this.state.activeTab-1];

      if(!contactForm || contactForm.length===0){
        contactForm={};
      }
    }else{
      contactForm = this.state.newContactForm;
    }

    let numberTypeQuery = gql`query($type:String,$hierarchyRefId:String){
     data: fetchMasterSettingsForPlatFormAdmin(type:$type,hierarchyRefId:$hierarchyRefId) {
        label
        value
      }
     }
     `;

    let numberTypeOption = {options: {variables: {type: "CONTACTTYPE2"}}};
    let clusterId = this.props.clusterId;
    if(clusterId){
      numberTypeOption.options.variables.hierarchyRefId = clusterId;
    }

    return(
      <div>
        <div className="panel panel-default">
          <div className="panel-heading"> Contact Number Details</div>
          <div className="panel-body">
            <ul className="nav nav-pills">
              <li className={that.state.activeTab ===0?'active':''}>
                <a><span onClick={e=>that.tabSelected(0)}>Add New&nbsp;</span><b>
                  <FontAwesome onClick={that.addNewTab.bind(that)} name='plus-square'/></b></a>
              </li>

              {that.state.contactForm && that.state.contactForm.length? (that.state.contactForm.map(function (options, key) {
                return (
                  <li key={key+1} className={that.state.activeTab ===key+1?'active':''}>
                    <a  className="add-contact"><FontAwesome name='minus-square' onClick={e=>that.onDeleteContact(key)}
                      /><span onClick={e=>that.tabSelected(key+1)}>{that.fetchNumberTypeLabel(options.contactNumberType) || 'New'}</span></a>
                  </li>)
              })):null}
            </ul><br/>
            {<Moolyaselect multiSelect={false} valueKey={'value'} className="form-control float-label"
                          placeholder="Select NumberType" selectedValue = {contactForm.contactNumberType}
                          queryType={"graphql"} query={numberTypeQuery} isDynamic={true} labelKey={'label'}
                          queryOptions={numberTypeOption} onSelect={that.onChangeNumberType}
                          data-required={true} data-errMsg="Number Type is required"  mandatory={true}
            />}


            {(displayCountryCode) &&<div className="form-group">
              <input type="text" placeholder="Enter Country Code"
                     value={that.state.xcountryCode || displayCountryCode}
                     className="form-control float-label" disabled={true} />
            </div>}
            {!displayCountryCode &&  <Moolyaselect multiSelect={false} valueKey={'value'}
              className="form-control float-label" placeholder="Enter Country Code" selectedValue={contactForm.countryCode}
              queryType={"graphql"} query={query} isDynamic={true} labelKey={'label'} data-required={true}
              onSelect={that.onChangeCountryCode} mandatory={true}
              data-errMsg="Number Type is required"
            />}

            <div className="form-group mandatory">
              <input type="text" placeholder="Enter Number" id="phoneNumber"
                     value={contactForm.number||""}
                     onChange={e=>that.onNumberChange(e.target.value)}
                     className="form-control float-label" data-required={true} data-errMsg="Number is required"/>
            </div>

            <div className="form-group switch_wrap inline_switch">
              <label>OTP Validation</label>
              <label className="switch">
                <input type="checkbox"  checked={ (contactForm.isOTPValidated || false)}
                       onChange={e=>that.onChangeOPTValidation(e.target.checked)}
                />
                <div className="slider"></div>
              </label>
            </div>
          </div>
        </div>
      </div>

    )
  }
};

