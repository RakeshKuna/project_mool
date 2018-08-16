import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag'
import {fetchSubChapterDetails} from "../actions/findRegistration"
var Select = require('react-select');
import Moolyaselect from '../../../commons/components/MlAdminSelectWrapper'
import ScrollArea from 'react-scrollbar';
import { Scrollbars } from 'react-custom-scrollbars';
import MlActionComponent from '../../../../commons/components/actions/ActionComponent'
import {updateRegistrationActionHandler,emailVerificationActionHandler,smsVerificationActionHandler} from '../actions/updateRegistration'
import {initalizeFloatLabel} from '../../../utils/formElemUtil';
import {fetchIdentityTypes} from "../actions/findRegistration";
import {findRegistrationActionHandler} from "../actions/findRegistration";
import _ from 'lodash';
import {mlFieldValidations, validatedPhoneNumber} from '../../../../commons/validations/mlfieldValidation';
import MlLoader from '../../../../commons/components/loader/loader'
import {findAccountTypeActionHandler} from '../../../settings/accountType/actions/findAccountTypeAction'
import moment from 'moment'
import {rejectStatusForUser} from '../actions/rejectUser'
import _underscore from 'underscore'
var FontAwesome = require('react-fontawesome');
var diff = require('deep-diff').diff;
var options3 = [
  {value: 'Yes', label: 'Yes'},
  {value: 'No', label: 'No'}
];
var i = 1;

export default class step1 extends React.Component{
  constructor(props){
    super(props);
    this.state={
      loading:true,
      country:null,
      cluster:null,
      chapter:null,
      subChapter:null,
      selectedCity:"",
      registrationId:'',
      registrationDetails:'',
      subscription:null,
      registrationType:null,
      refered:"",
      institutionAssociation:"",
      coummunityName:null,
      identityType:null,
      userType:null,
      identityTypesData:[],
      selectedTypeOfIndustry:null,
      profession:null,
      defaultIdentityIndividual: false,
      defaultIdentityCompany:false,
      transactionId:null,
      selectedAccountsType: "",
      registrationDate:'',
      emailVerified:false,
      isOfficeBearer :false,
    }

    this.fetchIdentityTypesMaster.bind(this);
    this.updateregistrationInfo.bind(this);
    //this.settingIdentity.bind(this);

    return this;
  }
  /*async settingIdentity(identity){

    if(identity == "Individual"){
      this.setState({defaultIdentityIndividual:true, defaultIdentityCompany: false})
      $('#companyId').hide();
    }
    if(identity == "Company"){
      this.setState({defaultIdentityCompany: true, defaultIdentityIndividual:false})
      $('#individualId').hide();
    }
    if(identity === null){
      this.setState({defaultIdentityCompany: false, defaultIdentityIndividual:false})
      i = 0;
    }
  }

*/
  async fetchIdentityTypesMaster() {
    const response = await fetchIdentityTypes(this.props.config);
    this.setState({identityTypesData: response});
    return response;
  }

  /**
   * getting all the data from parent any displaying in child
   * Note: if [registration from office] "disabling" change in registrationType == "OFB"
   * */
  componentWillMount() {
    this.fetchIdentityTypesMaster();
    let details=this.props.registrationInfo;
    var isOFB = _.isMatch(details, { registrationType: 'OFB' });
    this.setState({loading:false,
      registrationDetails:details,
      registrationId:details.registrationId,
      country :details.countryId,
      countryCode: details.countryCode,
      selectedCity : details.cityId,
      registrationType : details.registrationType,
      subscription: details.accountType,
      institutionAssociation :details.institutionAssociation,
      refered: details.referralType,
      cluster : details.clusterId,
      chapter :details.chapterId,
      subChapter: details.subChapterId,
      identityType:details.identityType,
      userType:details.userType,
      selectedTypeOfIndustry:details.industry,
      profession:details.profession,
      transactionId : this.props.registrationData.transactionId,
      selectedAccountsType:details.accountType,
      registrationDate:details.registrationDate,
      isOfficeBearer : isOFB
          });
    //this.settingIdentity(details.identityType);

  }

  componentDidMount()
  {
    var WinHeight = $(window).height();
    $('.step_form_wrap').height(WinHeight-(160+$('.admin_header').outerHeight(true)));
    initalizeFloatLabel();
    if(this.state.defaultIdentityIndividual == true){
      $('#companyId').hide();

    }
    if(this.state.defaultIdentityCompany == true){
      $('#individualId').hide();

    }
    this.fetchSubChapterDetails()
    let isVerifiedUser = _.find(this.props.emailDetails, {verified : true})
    if(isVerifiedUser&&isVerifiedUser.verified){
      this.setState({"emailVerified" : true})
    }else{
      this.setState({"emailVerified" : false})
    }

  }
  optionsBySelectCountry(value, callback, label){
    this.setState({
      country: value,
      countryCode: label.code
    })
  }
  optionsBySelectCluster(value){
    this.setState({cluster:value})
  }
  optionsBySelectChapter(value){
    this.setState({chapter:value})
  }
  optionsBySelectSubChapter(value){
    this.setState({subChapter:value},function () {
      this.fetchSubChapterDetails()
    })
  }
  optionsBySelectCity(value){
    this.setState({selectedCity:value})
  }
  optionBySelectRegistrationType(value, calback, selObject){
    /**merging all states in one*/
    // this.setState({registrationType:value});
    // this.setState({identityType:null});
    // this.setState({coummunityName:selObject.label})
    // this.setState({cluster:null});
    // this.setState({chapter:null});
    // this.setState({subchapter:null});
    this.setState({registrationType:value,identityType:null,coummunityName:selObject.label,cluster:null, chapter:null, subchapter:null, userType:null});
  }
  optionBySelectSubscription(val){
    this.setState({subscription:val.value})
  }
  optionBySelectRefered(val){
    this.setState({refered:val.value})
  }
  optionBySelectinstitutionAssociation(val){
    this.setState({institutionAssociation:val.value})
  }
  optionsBySelectTypeOfIndustry(value){
    this.setState({selectedTypeOfIndustry:value})
  }
  optionsBySelectTypeOfAccounts(value){
    this.setState({selectedAccountsType:value})
  }

  optionsBySelectProfession(val){
    this.setState({profession:val})
  }

  checkIdentityIndividual(event) {
    this.setState({identityType: event.target.name});
    i++;
    if(event.target.name=="Individual"){
      // this.settingIdentity(event.target.name);
      $('#companyId').hide();
      this.setState({defaultIdentityIndividual: true, defaultIdentityCompany:false})

      if (i>1){
        i = 0;
        // this.setState({identityType: " "});
        $('#individualId').show();
        $('#companyId').show();
      }
    }else if(event.target.name=="Company"){
      //this.settingIdentity(event.target.name);
      this.setState({defaultIdentityCompany: true, defaultIdentityIndividual:false})
      $('#individualId').hide();
      if (i>1){
        i = 0;
        // this.setState({identityType: " "});
        $('#individualId').show();
        $('#companyId').show();
      }
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
  /* checkIdentityCompany(event) {
   this.setState({identityType: event.target.name});
   i++;
   $('#indi').hide();
   if (i > 1){
   i = 0;
   this.setState({identityType: " "});
   $('#indi').show();
   $('#comp').show();
   }
   }


   */
  optionsBySelectUserType(value){
    this.setState({userType:value})
  }


  async updateregistrationInfo() {
    let ret = mlFieldValidations(this.refs)
    let {countryCode} = this.state;
    let contactNumber = this.refs.contactNumber && this.refs.contactNumber.value;
    let isValidPhoneNumber = validatedPhoneNumber(countryCode, contactNumber);
    if (ret) {
      toastr.error(ret);
    } else if (countryCode && !isValidPhoneNumber) {
      toastr.error('Please enter a valid contact number');
    } else {

      let Details = {
        registrationId: this.props.registrationId,
        registrationDetail: {
        //  registrationDate :this.refs.datetime.value,
          registrationId: this.state.registrationId,
          firstName: this.refs.firstName.value,
          lastName: this.refs.lastName.value,
          countryId: this.state.country,
          contactNumber: this.refs.contactNumber.value,
          email: this.refs.email.value,
          cityId: this.state.selectedCity,
          registrationType: this.state.registrationType,
          userName: this.refs.userName.value,
          // password: this.refs.password.value,
          accountType: this.state.selectedAccountsType,
          institutionAssociation: this.state.institutionAssociation,
          companyname: this.refs.companyName.value,
          companyUrl: this.refs.companyUrl.value,
          remarks: this.refs.remarks.value,
          referralType: this.state.refered?this.state.refered:"",
          clusterId: this.state.cluster,
          chapterId: this.state.chapter,
          subChapterId: this.state.subChapter,
          communityName: this.state.coummunityName,
          identityType: this.state.identityType,
          userType: this.state.userType,
          industry: this.state.selectedTypeOfIndustry,
          profession: this.state.profession,
          source          :   this.state.source,
          deviceName      :   this.state.deviceName,
          deviceNumber    :   this.state.deviceNumber,
          ipAddress       :   this.state.ipAddress,
          ipLocation      :   this.state.ipLocation
          // transactionId:this.state.transactionId,
        }
      }
      const response = await updateRegistrationActionHandler(Details);
      return response;
    }
  }

  async updateRegistration(){
    const response= await this.updateregistrationInfo();
    /**response should be there for success*/
    if(response){
      if(response.success){
        this.props.refetchRegistrationAndTemplates();
        toastr.success("Saved successfully")
      }else{
        toastr.error(response.result);
      }
    }
    return response;
  }

  async sendEmailVerification(){
    const response= await emailVerificationActionHandler(this.props.registrationId);
    if(response && response.success){
      toastr.success("Email-Id verification link sent successfully");
    }else{
      // toastr.error(response.result);
    }
    return response;

  }


  async sendSmsVerification(){
    const response= await smsVerificationActionHandler(this.props.registrationId);
    if(response.success){
      toastr.success("OTP verification code sent successfully");
    }else{
      // toastr.error(response.result);
    }
    return response;

  }

  async updateRejectUser(){
    if(!_.find(this.props.emailDetails, {verified : true})){
      let registrationId = this.props.registrationData._id
      const response = await rejectStatusForUser(registrationId,'0');
      if (response && response.success) {
        toastr.success(response.result)
      }else if (response && !response.success){
        toastr.error(response.result)
      }
    }else {
      toastr.error("User cannot be rejected since email-Id is already verified")
    }

  }

  rejectUser(){
    const resp = this.updateRejectUser();
    return resp;
  }

  isValidated(){
    let ret = mlFieldValidations(this.refs)
    if (ret) {
     return false
    }else{
      return true
    }
  }
  isUpdated(){
    let existingObject = this.props.registrationInfo || {}
    let oldObject = {
      registrationId: existingObject.registrationId?existingObject.registrationId:null,
      firstName: existingObject.firstName?existingObject.firstName:null,
      lastName: existingObject.lastName?existingObject.lastName:null,
      countryId:existingObject.countryId?existingObject.countryId:null,
      contactNumber: existingObject.contactNumber?existingObject.contactNumber:null,
      email: existingObject.email?existingObject.email.value:null,
      //cityId: existingObject.cityId?existingObject.cityId:null,
      registrationType: existingObject.registrationType?existingObject.registrationType:null,
      userName: existingObject.userName?existingObject.userName:null,
      //accountType: this.state.selectedAccountsType?this.state.selectedAccountsType:"",
      //institutionAssociation: existingObject.institutionAssociation?existingObject.institutionAssociation:null,
      companyname: existingObject.companyname?existingObject.companyname:"",
      companyUrl: existingObject.companyUrl?existingObject.companyUrl:"",
      remarks: existingObject.remarks?existingObject.remarks:"",
      referralType: existingObject.referralType?existingObject.referralType:"",
      clusterId: existingObject.clusterId?existingObject.clusterId:null,
      chapterId: existingObject.chapterId?existingObject.chapterId:null,
      subChapterId: existingObject.subChapterId?existingObject.subChapterId:null,
      //communityName: this.state.coummunityName?this.state.coummunityName:"",
      identityType: existingObject.identityType?existingObject.identityType:null,
      userType: existingObject.userType?existingObject.userType:null,
      industry: existingObject.industry?existingObject.industry:null,
      profession: existingObject.profession?existingObject.profession:null,
    }
    let newObject = {
      registrationId: this.state.registrationId?this.state.registrationId:null,
      firstName: this.refs.firstName.value?this.refs.firstName.value:null,
      lastName: this.refs.lastName.value?this.refs.lastName.value:null,
      countryId: this.state.country?this.state.country:null,
      contactNumber: this.refs.contactNumber.value?this.refs.contactNumber.value:null,
      email: this.refs.email.value?this.refs.email.value:null,
      //cityId: this.state.selectedCity?this.state.selectedCity:null,
      registrationType: this.state.registrationType?this.state.registrationType:null,
      userName: this.refs.userName.value?this.refs.userName.value:null,
      //accountType: this.state.selectedAccountsType?this.state.selectedAccountsType:"",
      //institutionAssociation: this.state.institutionAssociation?this.state.institutionAssociation:null,
      companyname: this.refs.companyName.value?this.refs.companyName.value: "",
      companyUrl: this.refs.companyUrl.value?this.refs.companyUrl.value:"",
      remarks: this.refs.remarks.value?this.refs.remarks.value:"",
      referralType: this.state.refered?this.state.refered:"",
      clusterId: this.state.cluster?this.state.cluster:null,
      chapterId: this.state.chapter?this.state.chapter:null,
      subChapterId: this.state.subChapter?this.state.subChapter:null,
      //communityName: this.state.coummunityName?this.state.coummunityName:"",
      identityType: this.state.identityType?this.state.identityType:null,
      userType: this.state.userType?this.state.userType:null,
      industry: this.state.selectedTypeOfIndustry?this.state.selectedTypeOfIndustry:null,
      profession: this.state.profession?this.state.profession:null,
    }
    var differences = diff(existingObject, newObject);
    var filteredObject = _underscore.where(differences, {kind: "E"});
    if(filteredObject && filteredObject.length>0){
      return false
    }else{
      return true
    }


  }

  render(){
    let MlActionConfig
    let registrationDate = this.state.registrationDate
    let hours = moment().diff(registrationDate, 'hours')

    let showReject = (this.props.emailDetails && this.props.emailDetails.length>0 && !this.props.emailDetails[0].verified)?true:false
    // if(hours>=72 && this.state.emailVerified === false) {
    if(hours>=72 && this.props.emailDetails && this.props.emailDetails.length>0 && !this.props.emailDetails[0].verified) {
      MlActionConfig = [
        {
          actionName: 'rejectUser',
          showAction: true,
          handler: this.rejectUser.bind(this)
        }
      ];
    }else{
      MlActionConfig = [
        {
          actionName: 'rejectUser',
          showAction: showReject,
          handler: this.rejectUser.bind(this)
        },
        {
          actionName: 'save',
          showAction: true,
          handler: this.updateRegistration.bind(this)
        },
        {
          showAction: true,
          actionName: 'cancel',
          handler: async(event) => {
            let routeName=FlowRouter.getRouteName();
            if(routeName==="transaction_registration_approved_edit"){
              FlowRouter.go("/admin/transactions/registrationApprovedList")
            }else if(routeName==="transaction_registration_requested_edit"){
              FlowRouter.go("/admin/transactions/registrationRequested")
            }
          }
        }
      ];
    }


    let countryQuery = gql`query{
 data:fetchCountries {
    value:_id
    label:country
    code: countryCode
  }
}`

    let clusterQuery=gql`query{
     data:fetchContextClusters {
        value:_id
        label:countryName
      }
    }
    `;
    let chapterQuery =gql`query($id:String){  
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

    /*    let citiesquery = gql`query{
     data:fetchCities {label:name,value:_id
     }
     }
     `;*/
    let citiesquery = gql`query($countryId:String){
      data:fetchCitiesPerCountry(countryId:$countryId){label:name,value:_id}
    }
    `;
    let fetchcommunities = gql` query{
  data:fetchCommunityDefinition{label:name,value:code}
} 
`;
    let userTypequery = gql` query($communityCode:String){  
    data:FetchUserType(communityCode:$communityCode) {
      value:_id
      label:displayName
  }  }
    `;
    let industriesquery=gql` query{
    data:fetchIndustries{label:industryDisplayName,value:_id}
    }
    `;

    let accountsquery=gql `query{
    data: FetchAccount {label:accountDisplayName,value: _id}
}
`;
    let professionQuery=gql` query($industryId:String){
      data:fetchIndustryBasedProfession(industryId:$industryId) {
        label:professionDisplayName
        value:_id
      }
    }`;
    let professionQueryOptions = {options: {variables: {industryId:this.state.selectedTypeOfIndustry}}};
    let userTypeOption={options: { variables: {communityCode:this.state.registrationType}}};
    let chapterOption={options: { variables: {id:this.state.cluster}}};
    let subChapterOption={options: { variables: {id:this.state.chapter}}}
    /*let registrationOptions = [
     { value: '0', label: 'simplybrowsing' },
     { value: '1', label: 'ideator' },
     { value: '2', label: 'startup' },
     { value: '3', label: 'company' },
     { value: '4', label: 'funder/investor' },
     { value: '5', label: 'institution' },
     { value: '6', label: 'service provider' },
     { value: '7', label: 'iam not sure' },
     ];*/

    let subscriptionOptions = [
      {value: 'Starter', label: 'Starter'},
      {value: 'Premier', label: 'Premier'}
    ];
    let referedOption=[
      { value: '0', label: 'friends/collegues reference' },
      { value: '1', label: 'google/searching' },
      { value: '2', label: 'newspaper' },
      { value: '3', label: 'hoarding' },
      { value: '4', label: 'event' },
      { value: '5', label: 'radio' },
      { value: '6', label: 'i over heard it' },
    ]

    const showLoader=this.state.loading;
    let that=this;

    let identityTypez=_.filter(that.state.identityTypesData, function(i) { return _.indexOf(i.communities,that.state.registrationType)>=0?true:false;})||[];
    let canSelectIdentity=identityTypez&&identityTypez.length>0?true:false;
    let countryOption = {options: { variables: {countryId:this.state.country}}};
    let referedActive='',institutionAssociationActive='',isVerified=''
    if(this.state.refered){
      referedActive='active'
    }
    if(this.state.institutionAssociation){
      institutionAssociationActive='active'
    }

    return (

      <div>
        {showLoader===true?(<MlLoader/>):(
          <div className="step_form_wrap step1">

            {/*<ScrollArea speed={0.8} className="step_form_wrap"smoothScrolling={true} default={true} >*/}
              <div className="col-md-6 nopadding-left">
                <Scrollbars speed={0.8} className="step_form_wrap"smoothScrolling={true} default={true} >

                <div className="form_bg">
                  <form>
                    <div className="form-group">
                      <input type="text" ref="datetime" placeholder="Date & Time" defaultValue={moment(that.state.registrationDetails&&that.state.registrationDetails.registrationDate).format(Meteor.settings.public.dateFormat)} className="form-control float-label" disabled="true"/>
                    </div>
                    <div className="form-group">
                      <input type="text" placeholder="Request ID"  defaultValue={that.state.registrationId} className="form-control float-label" disabled="true"/>
                    </div>
                    <div className="form-group mandatory">
                      <input type="text" ref="firstName" placeholder="First Name" defaultValue={that.state.registrationDetails&&that.state.registrationDetails.firstName} className="form-control float-label" data-required={true} data-errMsg="First Name is required" />
                    </div>
                    <div className="form-group mandatory">
                      <input type="text" ref="lastName" placeholder="Last Name" defaultValue={that.state.registrationDetails&&that.state.registrationDetails.lastName} className="form-control float-label" data-required={true} data-errMsg="Last Name is required" />
                    </div>
                    <div className="form-group">
                      <Moolyaselect multiSelect={false} mandatory={true} ref="country" className="form-control float-label" valueKey={'value'} labelKey={'label'} placeholder="Your Country"  selectedValue={this.state.country} queryType={"graphql"} query={countryQuery} isDynamic={true}  onSelect={this.optionsBySelectCountry.bind(this)} data-required={true} data-errMsg="Country is required"  />
                    </div>
                    <div className="form-group mandatory">
                      <input type="text" ref="contactNumber" defaultValue={that.state.registrationDetails&&that.state.registrationDetails.contactNumber}  placeholder="Contact number" className="form-control float-label"  data-required={true} data-errMsg="Contact Number is required" />
                    </div>
                    <div className="form-group mandatory">
                      <input type="text" ref="email" defaultValue={that.state.registrationDetails&&that.state.registrationDetails.email}  placeholder="Email Id" className="form-control float-label"   disabled="true" data-required={true} data-errMsg="Email Id is required"/>
                    </div>
                    <div className="form-group">
                      <Moolyaselect multiSelect={false} placeholder="Registration Type" disabled={this.state.isOfficeBearer} className="form-control float-label" valueKey={'value'} labelKey={'label'}  selectedValue={this.state.registrationType} queryType={"graphql"} query={fetchcommunities} onSelect={that.optionBySelectRegistrationType.bind(this)} isDynamic={true} />
                    </div>
                    {/*<div className="form-group">*/}
                    {/*<Moolyaselect multiSelect={false} placeholder="Headquarter Location" className="form-control float-label" valueKey={'value'} labelKey={'label'}  selectedValue={this.state.selectedCity} queryType={"graphql"} queryOptions={countryOption} query={citiesquery} onSelect={that.optionsBySelectCity.bind(this)} isDynamic={true}/>*/}
                    {/*</div>*/}
                    <div className="panel panel-default">
                      <div className="panel-heading">Operation Area</div>
                      <div className="panel-body">
                        <Moolyaselect multiSelect={false} mandatory={true} ref="cluster" placeholder="Select Cluster" className="form-control float-label" valueKey={'value'} labelKey={'label'} selectedValue={this.state.cluster} queryType={"graphql"} query={clusterQuery}  isDynamic={true}  onSelect={this.optionsBySelectCluster.bind(this)} data-required={true} data-errMsg="Cluster is required"/>
                        <Moolyaselect multiSelect={false} mandatory={true} ref="chapter" placeholder="Select Chapter" className="form-control float-label" valueKey={'value'} labelKey={'label'} selectedValue={this.state.chapter} queryType={"graphql"} query={chapterQuery} reExecuteQuery={true} queryOptions={chapterOption}  isDynamic={true}  onSelect={this.optionsBySelectChapter.bind(this)} data-required={true} data-errMsg="Chapter is required"/>
                        <Moolyaselect multiSelect={false} mandatory={true} ref="subChapter" placeholder="Select Sub Chapter" className="form-control float-label" valueKey={'value'} labelKey={'label'} selectedValue={this.state.subChapter} queryType={"graphql"} query={subChapterQuery} reExecuteQuery={true} queryOptions={subChapterOption}  isDynamic={true}  onSelect={this.optionsBySelectSubChapter.bind(this)} data-required={true} data-errMsg="SubChapter is required"/>
                        {/* {canSelectIdentity&&
                         <div className="ml_tabs">
                         <ul  className="nav nav-pills">

                         {identityTypez.map((i)=>{

                         return (<li key={i.identityTypeName} className={that.state.identityType===i.identityTypeName?"active":""}>
                         <a href={i.identityTypeName==="Individual?"?"#3a":"#4a"} data-toggle="tab" name={i.identityTypeName} onClick={that.checkIdentity.bind(that)}>{i.identityTypeName}&nbsp;</a>
                         </li>);
                         })}
                         /!* <li className={this.state.identityType==="Individual"?"active":""}>
                         <a  href="#3a" data-toggle="tab" name="Individual" onClick={this.checkIdentity.bind(this)}>Individual&nbsp;</a>
                         </li>
                         <li className={this.state.identityType==="Company"?"active":""}>
                         <a href="#4a" data-toggle="tab" name="Company" onClick={this.checkIdentity.bind(this)}>Company&nbsp;</a>
                         </li>*!/
                         </ul>
                         </div>
                         }*/}
                        {canSelectIdentity &&
                        <div className="form-group nomarginbot">
                          {identityTypez.map((i, idx) => {
                            let checked=null,showRadioChecked=false
                            let identity=this.state.identityType
                            if(identity=="Individual"&&i._id=='individual'){
                              showRadioChecked=true
                              checked=true
                            }else if(identity=="Company"&&i._id=='company'){
                              showRadioChecked=true
                              checked=true
                            }else{
                              showRadioChecked=true
                              checked=false
                            }
                            return (
                              <div>{showRadioChecked&&<div key={idx}>
                                <div id={`${i._id}Id`}  className="input_types">

                                  <input type="checkbox" name={i.identityTypeName} value={i._id}
                                         onChange={that.checkIdentityIndividual.bind(that) }
                                         checked ={checked} id={i._id}/><label
                                  htmlFor={i._id}><span><span></span></span>{i.identityTypeName}</label>
                                </div>
                                {/* <div id="comp" className="input_types">
                                 <input type="checkbox" name="Company" value="Company"
                                 onChange={that.checkIdentityCompany.bind(that)}
                                 defaultChecked={this.state.defaultIdentityCompany}/><label
                                 htmlFor="radio2"><span><span></span></span>Company</label>
                                 </div>*/}
                              </div>}</div>)
                          })
                          }
                          <br className="brclear"/>
                        </div>
                        }
                        <div className="clearfix"></div>
                        <div className="form-group mart20">
                          <Moolyaselect multiSelect={false} placeholder="Select User Category"  mandatory={true} ref="userCategory" className="form-control float-label" valueKey={'value'} labelKey={'label'}  selectedValue={this.state.userType} queryType={"graphql"} query={userTypequery} reExecuteQuery={true} queryOptions={userTypeOption}   onSelect={that.optionsBySelectUserType.bind(this)} isDynamic={true} data-required={true} data-errMsg="User Category is required"/>
                        </div>
                        <div className="form-group">
                          <Moolyaselect multiSelect={false} placeholder="Select Type Of Industry"  mandatory={true} ref="industry" className="form-control float-label" valueKey={'value'} labelKey={'label'}  selectedValue={this.state.selectedTypeOfIndustry} queryType={"graphql"} query={industriesquery} onSelect={that.optionsBySelectTypeOfIndustry.bind(this)} isDynamic={true} data-required={true} data-errMsg="Industry is required"/>
                        </div>
                        <div className="form-group">
                          <Moolyaselect multiSelect={false} placeholder="Select Profession"  mandatory={true} ref="profession" className="form-control float-label" valueKey={'value'} labelKey={'label'}  selectedValue={this.state.profession} queryType={"graphql"} query={professionQuery} queryOptions={professionQueryOptions}  onSelect={that.optionsBySelectProfession.bind(this)} isDynamic={true} data-required={true} data-errMsg="Profession is required"/>

                        </div>

                        <div className="form-group">
                          <input type="text" placeholder="Source" defaultValue={that.state.registrationDetails&&that.state.registrationDetails.source}  className="form-control float-label"   disabled="true" />
                        </div>
                        <div className="form-group">
                          <input type="text" placeholder="Device Name" defaultValue={that.state.registrationDetails&&that.state.registrationDetails.deviceName} className="form-control float-label"   disabled="true"/>
                        </div>
                        <div className="form-group">
                          <input type="text" placeholder="Device Number" defaultValue={that.state.registrationDetails&&that.state.registrationDetails.deviceNumber} className="form-control float-label"  disabled="true"/>
                        </div>
                        <div className="form-group">
                          <input type="text" placeholder="IP Address" defaultValue={that.state.registrationDetails&&that.state.registrationDetails.ipAddress} className="form-control float-label"  disabled="true"/>
                        </div>
                        <div className="form-group">
                          <input type="text" placeholder="IP Location" defaultValue={that.state.registrationDetails&&that.state.registrationDetails.ipLocation} className="form-control float-label"  disabled="true"/>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
                </Scrollbars>
              </div>
              <div className="col-md-6 nopadding-right">
                 <Scrollbars speed={0.8} className="step_form_wrap"smoothScrolling={true} default={true} >

                <div className="form_bg">
                  <form>

                    <div className="form-group">
                      <input type="text" placeholder="User Name" ref="userName" defaultValue={that.state.registrationDetails&&that.state.registrationDetails.userName}  className="form-control float-label"  disabled="true"/>
                    </div>
                    <div className="form-group">

                      <input type="Password" placeholder="Password" ref="password" defaultValue={"passwordUnseen"} className="form-control float-label" disabled="true"/>
                      {/* that.state.registrationDetails&&that.state.registrationDetails.password */}
                    </div>
                    <div className="form-group">
                      {/*<span className="placeHolder active">Account Type</span>*/}
                      <Moolyaselect multiSelect={false} placeholder="Account Type" className="form-control float-label" valueKey={'value'} labelKey={'label'}  selectedValue={this.state.selectedAccountsType} queryType={"graphql"} query={accountsquery}  onSelect={that.optionsBySelectTypeOfAccounts.bind(this)} isDynamic={true}/>

                      {/*<Select name="form-field-name" placeholder="Account Type" value={this.state.subscription} options={subscriptionOptions} className="float-label" onChange={this.optionBySelectSubscription.bind(this)} />*/}
                    </div>
                    <div className="form-group">
                      {/*<span className={`placeHolder ${institutionAssociationActive}`}>Do you want to associate to any of the Sub Chapter</span>*/}
                      <span className='placeHolder active'>Do You Want To Associate With Any Of The Sub Chapters</span>
                      {that.state.isEcoSystem?<div><Select name="form-field-name"  placeholder="Do you want to associate to any of the Sub Chapter" value="No" options={options3} onChange={this.optionBySelectinstitutionAssociation.bind(this)} className="float-label" disabled={true}/></div>:<div><Select name="form-field-name"  placeholder="Do you want to associate to any of the Sub Chapter" value="Yes"  options={options3} onChange={this.optionBySelectinstitutionAssociation.bind(this)} className="float-label" disabled={true}/></div>}
                    </div>
                    <div className="form-group">
                      <input type="text" ref="companyName" placeholder="Company Name"  defaultValue={that.state.registrationDetails&&that.state.registrationDetails.companyname}  className="form-control float-label"  />
                    </div>
                    <div className="form-group">
                      <input type="text" ref="companyUrl" placeholder="Company URL"  defaultValue={that.state.registrationDetails&&that.state.registrationDetails.companyUrl}  className="form-control float-label"  />
                    </div>
                    <div className="form-group">
                      <input type="text" ref="remarks" placeholder="Remarks"  defaultValue={that.state.registrationDetails&&that.state.registrationDetails.remarks}  className="form-control float-label"  />
                    </div>
                    <div className="form-group">
                      <span className={`placeHolder ${referedActive}`}>How Did You Know About Us</span>
                      <Select name="form-field-name" ref="refered" placeholder="How Did You Know About Us" value={this.state.refered} options={referedOption} className="float-label" onChange={this.optionBySelectRefered.bind(this)}  />
                     <br className="clearfix"/>                      <br className="clearfix"/>

                    </div>

                     <div className="panel panel-default">
                     <div className="panel-heading">Process Status</div>
                     <div className="panel-body button-with-icon">
                     <button type="button" className="btn btn-labeled btn-success"  onClick={this.sendSmsVerification.bind(this)} >
                     <span className="btn-label"><FontAwesome name='key'/></span>Re Send OTP</button>
                     <button type="button" className={`btn btn-labeled btn-success ${this.state.emailVerified?"post_verify":"pre_verify"}`} onClick={this.sendEmailVerification.bind(this)}>
                     <span className="btn-label"><span className="ml ml-email"></span></span>Re Send Email</button>
                    {/* <button type="button" className="btn btn-labeled btn-success" >
                     <span className="btn-label"><FontAwesome name='bullhorn'/></span>Send Ann.Temp</button>*/}
                     </div>
                     </div>

                  </form>
                </div>
                </Scrollbars>
              </div>

            <MlActionComponent ActionOptions={MlActionConfig} showAction='showAction' actionName="actionName"/>
          </div>
        )}
      </div>
    )
  }
};
/*export default Step1 = formHandler()(Step1);*/
