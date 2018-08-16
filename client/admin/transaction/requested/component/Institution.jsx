import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
var FontAwesome = require('react-fontawesome');
var Select = require('react-select');
import ScrollArea from 'react-scrollbar';
import { Scrollbars } from 'react-custom-scrollbars';
import gql from 'graphql-tag'
import Moolyaselect from  '../../../commons/components/MlAdminSelectWrapper'
import MlActionComponent from '../../../../commons/components/actions/ActionComponent'
import {updateRegistrationActionHandler} from '../actions/updateRegistration'
import Datetime from "react-datetime";
import moment from "moment";
import MlLoader from '../../../../commons/components/loader/loader'
import {initalizeFloatLabel} from '../../../utils/formElemUtil';
var diff = require('deep-diff').diff;
import _underscore from 'underscore'
import {mlFieldValidations} from '../../../../commons/validations/mlfieldValidation';


export default class institution extends React.Component{
  constructor(props){
    super(props);
    this.state={
      selectedUserType:null,
      selectedHeadquarter:null,
      selectedBranches:null,
      selectedInstitutionType:null,
      registrationDetails:null,
      foundationDate:null
    };
    return this;
  }

  componentWillMount() {
    let details=this.props.registrationDetails;
    if (details) {
      this.setState({
        loading: false,
        registrationDetails: details,
        registrationId: this.props.registrationId,
        selectedUserType: details.userType,
        selectedHeadquarter: details.headQuarterLocation,
        selectedBranches: details.branchLocations,
        selectedInstitutionType: details.institutionType,
        foundationDate:details.foundationYear
      })
    }
  }

  componentDidMount()
  {
    initalizeFloatLabel();
    var WinHeight = $(window).height();
    $('.step_form_wrap').height(WinHeight-(160+$('.admin_header').outerHeight(true)));
  }
  optionsBySelectUserType(value){
    this.setState({selectedUserType:value})
  }
  optionsBySelectHeadquarter(value){
    this.setState({selectedHeadquarter:value})
  }
  optionsBySelectBranch(value){
    this.setState({selectedBranches:value})
  }
  optionsBySelectInstitutionType(val){
    this.setState({selectedInstitutionType:val.value})
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
    let existingObject = this.props.registrationDetails || {}
    let oldObject = {
      userType        : existingObject.userType?existingObject.userType:null,
      institutionType     : existingObject.institutionType?existingObject.institutionType:null,
      instituteName       : existingObject.instituteName?existingObject.instituteName:null,
      instituteGroupName  : existingObject.instituteGroupName?existingObject.instituteGroupName:null,
      foundationYear      : existingObject.foundationYear?existingObject.foundationYear:null,
      website             : existingObject.website?existingObject.website:null,
      registrationNumber  : existingObject.registrationNumber?existingObject.registrationNumber:null,
      isoAccrediationNumber: existingObject.isoAccrediationNumber?existingObject.isoAccrediationNumber:null,
      curriculamProvider  : existingObject.curriculamProvider?existingObject.curriculamProvider:null,
      associatedUniversity: existingObject.associatedUniversity?existingObject.associatedUniversity:null,
      studentCount        : existingObject.studentCount?existingObject.studentCount:null,
      staffCount          : existingObject.staffCount?existingObject.staffCount:null,
      chairman            : existingObject.chairman?existingObject.chairman:null,
      dean                : existingObject.dean?existingObject.dean:null,
      headQuarterLocation:  existingObject.headQuarterLocation?existingObject.headQuarterLocation:null,
      branchLocations:  existingObject.branchLocations?existingObject.branchLocations:null
    }
    let newObject = {
      userType        : this.state.selectedUserType?this.state.selectedUserType:null,
      institutionType     : this.state.selectedInstitutionType?this.state.selectedInstitutionType:null,
      instituteName       : this.refs.instituteName.value?this.refs.instituteName.value:null,
      instituteGroupName  : this.refs.instituteGroupName.value?this.refs.instituteGroupName.value:null,
      foundationYear      : this.state.foundationDate?this.state.foundationDate:null,
      website             : this.refs.website.value?this.refs.website.value:null,
      registrationNumber  : this.refs.registrationNumber.value?this.refs.registrationNumber.value:null,
      isoAccrediationNumber: this.refs.isoAccrediationNumber.value?this.refs.isoAccrediationNumber.value:null,
      curriculamProvider  : this.refs.curriculamProvider.value?this.refs.curriculamProvider.value:null,
      associatedUniversity: this.refs.associatedUniversity.value?this.refs.associatedUniversity.value:null,
      studentCount        : this.refs.studentCount.value?this.refs.studentCount.value:null,
      staffCount          : this.refs.staffCount.value?this.refs.staffCount.value:null,
      chairman            : this.refs.chairman.value?this.refs.chairman.value:null,
      dean                : this.refs.dean.value?this.refs.dean.value:null,
      headQuarterLocation:  this.state.selectedHeadquarter?this.state.selectedHeadquarter:null,
      branchLocations:  this.state.selectedBranches?this.state.selectedBranches:null
    }
    var differences = diff(oldObject, newObject);
    var filteredObject = _underscore.where(differences, {kind: "E"});
    if(filteredObject && filteredObject.length>0){
      return false
    }else{
      return true
    }
  }

  async  updateregistration() {
    let Details = {
      registrationId      : this.props.registrationId,
      details:{
               userType        : this.state.selectedUserType,
              institutionType     : this.state.selectedInstitutionType,
              instituteName       : this.refs.instituteName.value,
              instituteGroupName  : this.refs.instituteGroupName.value,
              foundationYear      : this.state.foundationDate,
              website             : this.refs.website.value,
              registrationNumber  : this.refs.registrationNumber.value,
              isoAccrediationNumber: this.refs.isoAccrediationNumber.value,
              curriculamProvider  : this.refs.curriculamProvider.value,
              associatedUniversity: this.refs.associatedUniversity.value,
              studentCount        : this.refs.studentCount.value,
              staffCount          : this.refs.staffCount.value,
              chairman            : this.refs.chairman.value,
              dean                : this.refs.dean.value,
              headQuarterLocation:  this.state.selectedHeadquarter,
              branchLocations:  this.state.selectedBranches
             }
    }
    //this.props.getRegistrationDetails();
    const response = await updateRegistrationActionHandler(Details);
    if(response.success){
      this.props.getRegistrationDetails();
      toastr.success("Saved successfully");
    }else{
      toastr.error(response.result);
    }
    return response;
  }
  updateRegistration(){
    const resp=this.updateregistration();
    return resp;
  }
  onFoundationDateSelection(event) {
    if (event._d) {
      let value = moment(event._d).format('DD-MM-YYYY');
      this.setState({loading: false, foundationDate: value});
    }
  }


  render(){
    let MlActionConfig
    let userType=this.props.userType;
    if(userType=='external'){
      MlActionConfig=[
        {
          showAction: true,
          actionName: 'save',
          handler:  this.updateRegistration.bind(this),
        },
        {
          showAction: true,
          actionName: 'cancel',
          handler: null
        },
      ]
    }else {
      MlActionConfig = [
        {
          actionName: 'save',
          showAction: true,
          handler: this.updateRegistration.bind(this)
        },
        // {
        //   actionName: 'comment',
        //   showAction: true,
        //   handler: null
        // },
        {
          showAction: true,
          actionName: 'cancel',
          handler: async(event) => {
            FlowRouter.go("/admin/transactions/requestedList")
          }
        }
      ]
    }
    let that=this;
    let foundationActive ='',institutionTypesActive = ''
    if(that.state.foundationDate){
      foundationActive='active'
    }
    if(this.state.selectedInstitutionType){
      institutionTypesActive = 'active'
    }
    let institutionTypes = [
      {value: 'SubChapter', label: 'SubChapter'},
      {value: 'Institution', label: 'Institution'}
    ];

    let businesstypesquery=gql` query{
    data:fetchBusinessTypes{label:businessTypeName,value:_id}
    }
    `;
    let companytypesquery=gql` query{
    data:fetchCompanyTypes{label:companyName,value:_id}
    }
    `;

    let userTypequery = gql` query($communityCode:String){  
    data:FetchUserType(communityCode:$communityCode) {
      value:_id
      label:userTypeName
  }  }
    `;
    let userTypeOption={options: { variables: {communityCode:this.props.registrationInfo.registrationType}}};
   /* let citiesquery = gql`query($countryId:String){
      data:fetchCitiesPerCountry(countryId:$countryId){label:name,value:_id}
    }
    `;*/
    let entitiesquery = gql`query{
    data:fetchEntities {label:entityName,value:_id  }
    }
    `;
    let industriesquery=gql` query{
    data:fetchIndustries{label:industryName,value:_id}
    }
    `;
    let lookinforquery=gql` query{
    data:fetchStageOfCompany{label:lookingForName,value:_id}
    }
    `;
    let stageofcompquery=gql` query{
    data:fetchStageOfCompany{label:stageOfCompanyName,value:_id}
    }
    `;
    let citiesquery = gql`query($searchQuery:String,$countryId: String){
      data:fetchHeadQuarterOfRegisteredCommunity(searchQuery:$searchQuery,countryId:$countryId){label:name,value:_id}
    }
    `;

    let branchesQuery = gql`query($searchQuery:String,$countryId: [String]){
      data:fetchBrachesOfRegisteredCommunity(searchQuery:$searchQuery,countryId:$countryId){label:name,value:_id}
    }
    `;

    let countryOption = {options: { variables: {countryId:this.state&&this.state.selectedHeadquarter?this.state.selectedHeadquarter:""}}};
    let branchesOption = {options: { variables: {countryId:this.state&&this.state.selectedBranches?this.state.selectedBranches:null}}};

    const showLoader=this.state.loading;

    return (
      <div>
        {showLoader===true?(<MlLoader/>):(
      <div className="step_form_wrap step2">

      <Scrollbars speed={0.8} className="step_form_wrap"smoothScrolling={true} default={true} >
      <div className="col-md-6 nopadding-left">
          <div className="form_bg">
              <form>
                <div className="form-group">
                  <Moolyaselect multiSelect={false} placeholder="Select User Category" className="form-control float-label" valueKey={'value'} labelKey={'label'}  selectedValue={this.state.selectedUserType} queryType={"graphql"} query={userTypequery} reExecuteQuery={true} queryOptions={userTypeOption} onSelect={that.optionsBySelectUserType.bind(this)} isDynamic={true}/>
                </div>
                <div className="form-group">
                  <span className={`placeHolder ${institutionTypesActive}`}>Select Institution Type</span>
                  <Select name="form-field-name" placeholder="Select Institution Type" options={institutionTypes} value={this.state.selectedInstitutionType}  onChange={this.optionsBySelectInstitutionType.bind(this)}  className="float-label"/>
                </div>
                <div className="form-group">
                  <input type="text" ref="instituteName" placeholder="Institute Name " defaultValue={that.state.registrationDetails&&that.state.registrationDetails.instituteName} className="form-control float-label" id=""/>
                </div>
                <div className="form-group">
                  <input type="text" ref="instituteGroupName" placeholder="Institute Group Name" defaultValue={that.state.registrationDetails&&that.state.registrationDetails.instituteGroupName} className="form-control float-label" id=""/>
                </div>
                <div className="form-group mandatory">
                  <span className={`placeHolder ${foundationActive}`}>Foundation Year</span>
                  <Datetime dateFormat="DD-MM-YYYY" timeFormat={false} ref={"foundationDate"} inputProps={{placeholder: "Foundation Year",readOnly:true}}   closeOnSelect={true} value={that.state.foundationDate} onChange={that.onFoundationDateSelection.bind(that)} data-required={true} data-errMsg="Foundation Date is required"/>
                  <FontAwesome name="calendar" className="password_icon"/>
                </div>
                <div className="form-group">
                  <input type="text" ref="website" placeholder="Website" defaultValue={that.state.registrationDetails&&that.state.registrationDetails.website} className="form-control float-label" id=""/>
                </div>
                <div className="form-group">
                  <input type="text" ref="registrationNumber" placeholder="Registration Number" defaultValue={that.state.registrationDetails&&that.state.registrationDetails.registrationNumber} className="form-control float-label" id=""/>
                </div>
                <div className="form-group">
                  <input type="text"  ref="isoAccrediationNumber" placeholder="ISO Accrediation Number" defaultValue={that.state.registrationDetails&&that.state.registrationDetails.isoAccrediationNumber} className="form-control float-label" id=""/>
                </div>
          </form>
          </div>
    </div>
    <div className="col-md-6 nopadding-right">
    <div className="form_bg">
    <form>
            <div className="form-group">
              <input type="text" ref="curriculamProvider" placeholder="Curriculam Provider" defaultValue={that.state.registrationDetails&&that.state.registrationDetails.curriculamProvider} className="form-control float-label" id=""/>
            </div>
            <div className="form-group">
              <input type="text" ref="associatedUniversity" placeholder="Associated University" defaultValue={that.state.registrationDetails&&that.state.registrationDetails.associatedUniversity} className="form-control float-label" id=""/>
            </div>
            <div className="form-group">
              <input type="text" ref="studentCount" placeholder="Total Number Of Students" defaultValue={that.state.registrationDetails&&that.state.registrationDetails.studentCount} className="form-control float-label" id=""/>
            </div>
            <div className="form-group">
              <input type="text" ref="staffCount" placeholder="Total Number Of Staff" defaultValue={that.state.registrationDetails&&that.state.registrationDetails.staffCount} className="form-control float-label" id=""/>
            </div>
            <div className="form-group">
              <input type="text" ref="chairman" placeholder="Chairman Name" defaultValue={that.state.registrationDetails&&that.state.registrationDetails.chairman} className="form-control float-label" id=""/>
            </div>
            <div className="form-group">
              <input type="text" ref="dean" placeholder="Dean Name" defaultValue={that.state.registrationDetails&&that.state.registrationDetails.dean} className="form-control float-label" id=""/>
            </div>
           {/* <div className="form-group">
              <Moolyaselect multiSelect={false} placeholder="Headquarter Location" className="form-control float-label" valueKey={'value'} labelKey={'label'}  selectedValue={this.state.selectedHeadquarter} queryType={"graphql"}  query={citiesquery} onSelect={that.optionsBySelectHeadquarter.bind(this)} isDynamic={true}/>
            </div>
            <div className="form-group">
              <Moolyaselect multiSelect={true} placeholder="Branch Location" className="form-control float-label" valueKey={'value'} labelKey={'label'}  selectedValue={this.state.selectedBranches} queryType={"graphql"}  query={citiesquery} onSelect={that.optionsBySelectBranch.bind(this)} isDynamic={true}/>
              <br/><br/><br/><br/><br/><br/><br/>
            </div>*/}

            <div className="form-group">
              <Moolyaselect multiSelect={false} placeholder="Headquarter Location" className="form-control float-label" valueKey={'value'} labelKey={'label'}  selectedValue={this.state.selectedHeadquarter} queryType={"graphql"}  query={citiesquery} queryOptions={countryOption} onSelect={that.optionsBySelectHeadquarter.bind(this)} isDynamic={true}/>
            </div>
            <div className="form-group">
              <Moolyaselect multiSelect={true} placeholder="Branch Location" className="form-control float-label" valueKey={'value'} labelKey={'label'}  selectedValue={this.state.selectedBranches} queryType={"graphql"}  query={branchesQuery} queryOptions={branchesOption} onSelect={that.optionsBySelectBranch.bind(this)} isDynamic={true}/>
              <br/><br/><br/><br/><br/><br/><br/>
            </div>

    </form>
    </div>
    </div>
      </Scrollbars>
        <MlActionComponent ActionOptions={MlActionConfig} showAction='showAction' actionName="actionName"/>
      </div> )}
      </div>
    )
  }
};
