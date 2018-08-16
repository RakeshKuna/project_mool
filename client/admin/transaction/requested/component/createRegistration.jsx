import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import { graphql } from 'react-apollo';
import Select from 'react-select';
import Datetime from "react-datetime";
import moment from "moment";
import ScrollArea from "react-scrollbar";
import { Scrollbars } from 'react-custom-scrollbars';
var FontAwesome = require('react-fontawesome');
import gql from 'graphql-tag';
import Moolyaselect from '../../../commons/components/MlAdminSelectWrapper'
import MlActionComponent from '../../../../commons/components/actions/ActionComponent'
import {createRegistrationInfo} from '../actions/createRegistrationInfo'
import {initalizeFloatLabel} from '../../../utils/formElemUtil';
import formHandler from '../../../../commons/containers/MlFormHandler'
import {mlFieldValidations, validatedPhoneNumber,validatedEmailId} from '../../../../commons/validations/mlfieldValidation';
import {fetchSubChapterDetails} from "../../requested/actions/findRegistration"
import passwordSAS_validate from '../../../../../lib/common/validations/passwordSASValidator';
export default class MlCreateRegistration extends React.Component{

  constructor(props){
    super(props);
    this.state={
      loading:true,
      country:'',
      cluster:'',
      chapter:'',
      subChapter:'',
      selectedCity:'',
      registrationId:'',
      registrationDetails:'',
      subscription:'',
      registrationType:'',
      refered:'',
      institutionAssociation:'',
      coummunityName:'',
      userName : '',
      selectedAccountsType:" ",
      countryCode: '',
      passwordValidation:false
    };
    this.isSubmitDetails = false;
    this.createRegistration.bind(this);
    return this;
  }

  componentDidMount(){
    var WinHeight = $(window).height();
    $('.main_wrap_scroll ').height(WinHeight-(68+$('.admin_header').outerHeight(true)));
    initalizeFloatLabel();
    this.fetchSubChapterDetails()
  }

  async  createRegistration() {
    let ret = mlFieldValidations(this.refs);
    let {countryCode} = this.state;
    let contactNumber = this.refs.contactNumber && this.refs.contactNumber.value;
    let isValidPhoneNumber = validatedPhoneNumber(countryCode, contactNumber);
    var emailId=this.refs.email.value;
    const isValidEmail = validatedEmailId(emailId);
    if (ret) {
      toastr.error(ret);
    } else if (!isValidPhoneNumber) {
      toastr.error('Please enter a valid contact number');
    }else if (!isValidEmail) {
      return toastr.error('Please enter a valid email-Id');
    }else if(this.state.pwdValidationMsg){
      return toastr.error("Password "+this.state.pwdValidationMsg);
    } else {
      let Details = {
        firstName: this.refs.firstName.value,
        lastName: this.refs.lastName.value,
        countryId: this.state.country,
        contactNumber: this.refs.contactNumber.value,
        email: this.refs.email.value,
        cityId: this.state.selectedCity,
        registrationType: this.state.registrationType,
        userName: this.refs.userName.value,
        password: this.refs.password.value,
        accountType: this.state.selectedAccountsType,
        institutionAssociation: this.state.institutionAssociation,
        companyname: this.refs.companyName.value,
        companyUrl: this.refs.companyUrl.value,
        remarks: this.refs.remarks.value,
        referralType: this.state.refered,
        clusterId: this.state.cluster,
        chapterId: this.state.chapter,
        subChapterId: this.state.subChapter,
        communityName: this.state.coummunityName
        //source          :  this.refs.source.value
      };
      if (!this.isSubmitDetails) {
        this.isSubmitDetails = true;
        const response = await createRegistrationInfo(Details);
        if (response.success) {
          toastr.success("User created successfully")
          FlowRouter.go("/admin/transactions/registrationRequested");
        } else if (response.code == 401 && !response.success) {
          this.isSubmitDetails = false;
          toastr.error(response.result);
          FlowRouter.go("/admin/transactions/registrationRequested");
        } else {
          this.isSubmitDetails = false;
          toastr.error(response.result);
        }
      }
    }
  }

  optionsBySelectTypeOfAccounts(value){
    this.setState({selectedAccountsType:value})
  }

  optionsBySelectCountry(value,callback, label){
    this.setState({
      country:value,
      countryCode: label.code
    });
  }

  optionsBySelectCity(value){
    this.setState({selectedCity:value})
  }

  optionsBySelectSubChapter(value){
    this.setState({subChapter:value},function () {
      this.fetchSubChapterDetails()
    })
  }

  optionsBySelectCluster(value){
    this.setState({cluster:value})
  }
  optionsBySelectChapter(value){
    this.setState({chapter:value})
  }
  optionBySelectRegistrationType(value, calback, selObject){
    /**mering the states*/
    // this.setState({registrationType:value});
    // this.setState({identityType:null});
    this.setState({registrationType:value,identityType:null, coummunityName:selObject.label})
  }
  optionBySelectSubscription(val){
    if(val){
      this.setState({subscription:val.value});
    }else{
      this.setState({subscription:null});
    }
  }
  optionBySelectRefered(val){
    if(val){
      this.setState({refered:val.value})
    }else{
      this.setState({refered:null})
    }
  }
  optionBySelectinstitutionAssociation(val){
    if(val){
      this.setState({institutionAssociation:val.value})
    }else{
      this.setState({institutionAssociation:null});
    }
  }

  async fetchSubChapterDetails(){
    let result = await fetchSubChapterDetails(this.state.subChapter)
    if(result && result.isDefaultSubChapter){
      this.setState({"isEcoSystem" : true})
    }else if(result && !result.isDefaultSubChapter){
      this.setState({"isEcoSystem" : false})
    }
  }
  passwordValidation() {
    let password = this.refs.password.value;
    if (!password) {
      this.setState({"pwdValidationMsg": ''})
    } else {
      let validate = passwordSAS_validate(password)
      if (validate.isValid) {
        this.setState({"pwdValidationMsg": '', passwordValidation: true})
      }else if (typeof (validate) == 'object') {
        this.setState({"pwdValidationMsg": validate.errorMsg})
      }
    }
  }


  /**
   * changing all emailId to the Lowercase only
   * */
  enteredUserName(e){
    let lowerCase = e.target.value.toLowerCase()
    this.refs.email.value = lowerCase.trim()
     this.setState({"userName" : lowerCase});
  }

  render(){
    let MlActionConfig = [
      {
        showAction: true,
        actionName: 'save',
        handler: this.createRegistration.bind(this)
      },
      {
        showAction: true,
        actionName: 'cancel',
        handler: async(event) => {
          FlowRouter.go("/admin/transactions/registrationRequested")
        }
      }
    ]

    let countryQuery=gql`query{
     data:fetchCountries {
        value:_id
        label:country
        code: countryCode
      }
    }`

    let citiesquery = gql`query($searchQuery:String){
      data:searchCities(searchQuery:$searchQuery){label:name,value:_id}
    }
    `;

    let clusterQuery = gql`query{
     data:fetchContextClusters {
        value:_id
        label:countryName
      }
    }
    `;
        let chapterQuery = gql`query($id:String){  
      data:fetchContextChapters(id:$id) {
        value:_id
        label:chapterName
      }  
    }`;

    let subChapterQuery= gql`query($id:String){  
      data:fetchContextSubChapters(id:$id) {
        value:_id
        label:subChapterName
      }  
    }`;


    let fetchcommunities = gql` query{
      data:fetchCommunityDefinitionForRegistration{label:name,value:code}
    }
    `;

    let chapterOption={options: { variables: {id:this.state.cluster}}};
    let subChapterOption={options: { variables: {id:this.state.chapter}}}

    let accountsquery=gql `query{
    data: FetchAccount {label:accountName,value: _id}
    }`;

    let referedOption=[
      { value: '0', label: 'friends/collegues reference' },
      { value: '1', label: 'google/searching' },
      { value: '2', label: 'newspaper' },
      { value: '3', label: 'hoarding' },
      { value: '4', label: 'event' },
      { value: '5', label: 'radio' },
      { value: '6', label: 'i over heard it' },
    ]

    let genderValues = [
      {value: 'male', label: 'Male'},
      {value: 'female', label: 'Female'},
      {value: 'others', label: 'Others'}
    ];

    let options3 = [
      {value: 'Yes', label: 'Yes'},
      {value: 'No', label: 'No'}
    ];
    let institutionAssociationActive='',subscriptionActive
      if(this.state.institutionAssociation){
      institutionAssociationActive='active'
      }
      if(this.state.subscription){
        subscriptionActive='active'
      }

    return (
        <div className="admin_main_wrap">
          <div className="col-md-12">

            <h2>Fill Registration Details</h2>
          <div className="col-md-6 nopadding-left">
            <div className="form_bg left_wrap">
              <Scrollbars
                speed={0.8}
                className="left_wrap"
                smoothScrolling={true}
                default={true}
              >
              <form>
                <div className="form-group mandatory">
                  <input type="text" ref="firstName" placeholder="First Name"  className="form-control float-label" data-required={true} data-errMsg="FirstName is required" />
                </div>
                <div className="form-group mandatory">
                  <input type="text" ref="lastName" placeholder="Last Name" className="form-control float-label" id="" data-required={true} data-errMsg="LastName is required"/>
                </div>
                <div className="form-group">
                  <Moolyaselect multiSelect={false} ref="country" mandatory={true} className="form-control float-label" valueKey={'value'} labelKey={'label'} placeholder="Your Country"  selectedValue={this.state.country} queryType={"graphql"} query={countryQuery} isDynamic={true}  onSelect={this.optionsBySelectCountry.bind(this)} data-required={true} data-errMsg="Country is required" />
                </div>
                <div className="form-group mandatory">
                  <input type="text" ref="contactNumber"   placeholder="Contact number" className="form-control float-label" id="" data-required={true} data-errMsg="Contact Number is required"/>
                </div>
                <div className="form-group mandatory">
                  <input type="text" ref="email" placeholder="Email Id" className="form-control float-label" onChange={this.enteredUserName.bind(this)} data-required={true} data-errMsg="Email Id is required"/>
                </div>
                <div className="form-group">
                  <Moolyaselect multiSelect={false} mandatory={true} ref="registrationType" placeholder="Registration Type" className="form-control float-label" valueKey={'value'} labelKey={'label'}  selectedValue={this.state.registrationType} queryType={"graphql"} query={fetchcommunities} onSelect={this.optionBySelectRegistrationType.bind(this)} isDynamic={true} data-required={true} data-errMsg="Registration Type is required"/>
                </div>

              <div className="panel panel-default">
                  <div className="panel-heading">Operation Area</div>
                  <div className="panel-body">
                    <Moolyaselect multiSelect={false} mandatory={true} ref="cluster" placeholder="Select Cluster" className="form-control float-label" valueKey={'value'} labelKey={'label'} selectedValue={this.state.cluster} queryType={"graphql"} query={clusterQuery}  isDynamic={true}  onSelect={this.optionsBySelectCluster.bind(this)} data-required={true} data-errMsg="Cluster is required"/>
                    <Moolyaselect multiSelect={false} mandatory={true} ref="chapter" placeholder="Select Chapter" className="form-control float-label" valueKey={'value'} labelKey={'label'} selectedValue={this.state.chapter} queryType={"graphql"} query={chapterQuery} reExecuteQuery={true} queryOptions={chapterOption}  isDynamic={true}  onSelect={this.optionsBySelectChapter.bind(this)} data-required={true} data-errMsg="Chapter is required"/>
                    <Moolyaselect multiSelect={false}  mandatory={true} ref="subchapter" placeholder="Select Sub Chapter" className="form-control float-label" valueKey={'value'} labelKey={'label'} selectedValue={this.state.subChapter} queryType={"graphql"} query={subChapterQuery} reExecuteQuery={true} queryOptions={subChapterOption}  isDynamic={true}  onSelect={this.optionsBySelectSubChapter.bind(this)} data-required={true} data-errMsg="SubChapter is required"/>
                    <br/><br/><br/><br/><br/>
                  </div>
                </div>
              </form>
              </Scrollbars>
            </div>
          </div>
          <div className="col-md-6 nopadding-right">
            <div className="form_bg left_wrap">
              <Scrollbars
                speed={0.8}
                className="left_wrap"
                smoothScrolling={true}
                default={true}
              >
              <form>
                <div className="form-group mandatory">
                  <input type="text" placeholder="User name" ref="userName"  value={this.state.userName} className="form-control float-label" id="" disabled="disabled" data-required={true} data-errMsg="UserName is required"/>
                </div>
                {/*<div className="form-group mandatory">*/}
                  {/*<input type="Password" placeholder="Password" ref="password"  className="form-control float-label" id="" data-required={true} data-errMsg="Password is required"/>*/}
                {/*</div>*/} <div className="form-group mandatory">
                <text style={{float:'right',color:'#ef1012',"fontSize":'12px',"marginTop":'-12px',"fontWeight":'bold'}}>{this.state.pwdValidationMsg}</text>
                <input type="Password" ref="password"  onBlur={this.passwordValidation.bind(this)} placeholder="Password" className="form-control float-label" id="" data-required={true} data-errMsg="Password is required"/>

              </div>
                <div className="form-group">
                  <Moolyaselect  placeholder="Account Type" className="form-control float-label" valueKey={'value'} labelKey={'label'}  selectedValue={this.state.selectedAccountsType} queryType={"graphql"} query={accountsquery} onSelect={this.optionsBySelectTypeOfAccounts.bind(this)} isDynamic={true}/>
                </div>
                <div className="form-group">

                  <span className='placeHolder active'>Do You Want To Associate To Any Of The Sub Chapter</span>
                  {/*<Select name="form-field-name"  placeholder="Do you want to associate to any of the sub chapter" value={this.state.institutionAssociation}  options={options3} onChange={this.optionBySelectinstitutionAssociation.bind(this)} className="float-label"/>*/}
                  {this.state.isEcoSystem?<div><Select name="form-field-name"  placeholder="Do you want to associate to any of the Sub Chapter" value="No" options={options3} onChange={this.optionBySelectinstitutionAssociation.bind(this)} className="form-control float-label" disabled={true}/></div>:<div><Select name="form-field-name"  placeholder="Do you want to associate to any of the Sub Chapter" value="Yes"  options={options3} onChange={this.optionBySelectinstitutionAssociation.bind(this)} className="form-control float-label" disabled={true}/></div>}
                </div>
                <div className="form-group">
                  <input type="text" ref="companyName" placeholder="Company Name"    className="form-control float-label" id=""/>
                </div>
                <div className="form-group">
                  <input type="text" ref="companyUrl" placeholder="Company URL"   className="form-control float-label" id=""/>
                </div>
                <div className="form-group">
                  <input type="text" ref="remarks" placeholder="Remarks"    className="form-control float-label" id=""/>
                </div>
                <div className="form-group">
                  <Select name="form-field-name" ref="How did you know about us" placeholder="How did you know about us" value={this.state.refered} options={referedOption} className="float-label" onChange={this.optionBySelectRefered.bind(this)}/>

                  <br className="brclear"/>
                  <br className="brclear"/>
                  <br className="brclear"/>
                  <br className="brclear"/>
                  <br className="brclear"/>
                  <br className="brclear"/>
                </div>
              </form>
              </Scrollbars>
            </div>
          </div>
          </div>
          <MlActionComponent ActionOptions={MlActionConfig} showAction='showAction' actionName="actionName"/>
        </div>
    )
  }
}



