import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
var FontAwesome = require('react-fontawesome');
var Select = require('react-select');
import ScrollArea from 'react-scrollbar';
import gql from 'graphql-tag'
import Moolyaselect from  '../../../commons/components/MlAdminSelectWrapper'
import MlActionComponent from '../../../../commons/components/actions/ActionComponent'
import {updateRegistrationActionHandler} from '../actions/updateRegistration'
import Datetime from "react-datetime";
import moment from "moment";
import {initalizeFloatLabel} from '../../../utils/formElemUtil';
import MlLoader from '../../../../commons/components/loader/loader'


export default class Ideator extends React.Component{
  constructor(props){
    super(props);
    this.state={
      selectedUserType:null,
      selectedHeadquarter:null,
      selectedBranches:null,
      selectedLookingFor:null,
      selectedTypeOfCompany:null,
      selectedTypeOfEntity:null,
      selectedTypeOfBusiness:null,
      selectedTypeOfIndustry:null,
      selectedSubDomain:null,
      selectedStageOfCompany:null,
      selectedSubsidaryComapny:null,
      registrationId:'',
      registrationDetails:'',
      foundationDate:'',
      dateOfBirth:'',
      employmentDate:'',
      identity:'',
      title:'',
      gender:'',
      citizenships:'',
      profession:''

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
        selectedLookingFor: details.lookingFor,
        selectedTypeOfCompany: details.companytyp,
        selectedTypeOfEntity: details.entityType,
        selectedTypeOfBusiness: details.businessType,
        selectedTypeOfIndustry: details.industry,
        selectedSubDomain: details.subDomain,
        selectedStageOfCompany: details.stageOfCompany,
        selectedSubsidaryComapny: details.subsidaryCompany,
        foundationDate:details.foundationDate,
        dateOfBirth:details.dateOfBirth,
        employmentDate:details.employmentDate,
        title:details.title,
        gender:details.gender,
        citizenships:details.citizenships,
        profession:details.profession
      })
    }else{
      this.setState({
        loading: false,
        identity : 'Company'
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
  optionsBySelectLookingFor(value){
    this.setState({selectedLookingFor:value})
  }
  optionsBySelectTypeOfCompany(value){
    this.setState({selectedTypeOfCompany:value})
  }
  optionsBySelectTypeOfEntity(value){
    this.setState({selectedTypeOfEntity:value})
  }
  optionsBySelectTypeOfBusiness(value){
    this.setState({selectedTypeOfBusiness:value})
  }
  optionsBySelectTypeOfIndustry(value){
    this.setState({selectedTypeOfIndustry:value})
  }
  optionsBySelectSubDomain(value){
    this.setState({selectedSubDomain:value})
  }
  optionsBySelectStageOfCompany(value){
    this.setState({selectedStageOfCompany:value})
  }
  optionsBySelectSubsidaryComapny(val){
    this.setState({selectedSubsidaryComapny:val.value})
  }
  checkIdentity(event){
    console.log(event.target.name)
    this.setState({identity:event.target.name})
  }
  optionsBySelectGender(val){
    this.setState({gender:val.value})
  }
  optionsBySelectTitle(val){
    this.setState({title:val.value})
  }
  optionsBySelectCitizenships(val){
    this.setState({citizenships:val.value})
  }
  optionsBySelectProfession(val){
    this.setState({profession:val.value})
  }


  async  updateregistration() {
    let Details=null;
    if(this.state.identity=='Company'){
      Details = {
        registrationId      : this.props.registrationId,
        details:{
          identityType          :   this.state.identity,
          userType              :   this.state.selectedUserType,
          companyName           :   this.refs.companyName.value,
          groupName             :   this.refs.groupName.value,
          companyWebsite        :   this.refs.companyWebsite.value,
          companyEmail          :   this.refs.companyEmail.value,
          foundationDate        :   this.state.foundationDate,
          headQuarterLocation   :   this.state.selectedHeadquarter,
          branchLocations       :   this.state.selectedBranches,
          companytyp            :   this.state.selectedTypeOfCompany,
          entityType            :   this.state.selectedTypeOfEntity,
          businessType          :   this.state.selectedTypeOfBusiness,
          industry              :   this.state.selectedTypeOfIndustry,
          subDomain             :   this.state.selectedSubDomain,
          stageOfCompany        :   this.state.selectedStageOfCompany,
          subsidaryCompany      :   this.state.selectedSubsidaryComapny,
          registrationNumber    :   this.refs.registrationNumber.value,
          isoAccrediationNumber :   this.refs.isoAccrediationNumber.value,
          companyTurnOver       :   this.refs.companyTurnOver.value,
          partnerCompanies      :   this.refs.partnerCompanies.value,
          investors             :   this.refs.investors.value,
          lookingFor            :   this.state.selectedLookingFor,
          companyCEOName        :   this.refs.companyCEOName.value,
          companyManagement     :   this.refs.companyManagement.value,
          toatalEmployeeCount   :   this.refs.toatalEmployeeCount.value,
          associatedCompanies   :   this.refs.associatedCompanies.value
        }
      }
    }else{
      Details = {
        registrationId      : this.props.registrationId,
        details:{
          identityType      : this.state.identity,
          userType          : this.state.selectedUserType,
          title             : this.state.title,
          firstName         : this.refs.firstName.value,
          middleName        : this.refs.middleName.value,
          lastName          : this.refs.lastName.value,
          displayName       : this.refs.displayName.value,
          dateOfBirth       : this.state.dateOfBirth,
          gender            : this.state.gender,
          citizenships      : this.state.citizenships,
          qualification     : this.refs.qualification.value,
          employmentStatus  : this.state.employmentStatus,
          professionalTag   : this.refs.professionalTag.value,
          industry          : this.state.selectedTypeOfIndustry,
          profession        : this.state.profession,
          employerName      : this.refs.employerName.value,
          employerWebsite   : this.refs.employerWebsite.value,
          employmentDate    : this.state.employmentDate
        }
      }
    }
    //this.props.getRegistrationDetails();
    const response = await updateRegistrationActionHandler(Details);
    return response;
  }
  updateRegistration(){
    const resp=this.updateregistration();
    return resp;
  }

  onfoundationDateSelection(event) {
    if (event._d) {
      let value = moment(event._d).format('DD-MM-YYYY');
      this.setState({loading: false, foundationDate: value});
    }
  }
  ondateOfBirthSelection(event) {
    if (event._d) {
      let value = moment(event._d).format('DD-MM-YYYY');
      this.setState({loading: false, dateOfBirth: value});
    }
  }
  onemploymentDateSelection(event) {
    if (event._d) {
      let value = moment(event._d).format('DD-MM-YYYY');
      this.setState({loading: false, employmentDate: value});
    }
  }

  render(){
    let MlActionConfig = [
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

    let subsidary = [
      {value: 'Yes', label: 'Yes'},
      {value: 'No', label: 'No'}
    ];


    let businesstypesquery=gql` query{
    data:fetchBusinessTypes{label:businessTypeName,value:_id}
    }
    `;
    let companytypesquery=gql`query($type:String,$hierarchyRefId:String){
     data: fetchMasterSettingsForPlatFormAdmin(type:$type,hierarchyRefId:$hierarchyRefId) {
     label
     value
     }
     }
     `;
    let companytypesOption={options: { variables: {type : "COMPANYTYPE",hierarchyRefId:this.props.clusterId}}};
    let genderquery=gql`query($type:String,$hierarchyRefId:String){
     data: fetchMasterSettingsForPlatFormAdmin(type:$type,hierarchyRefId:$hierarchyRefId) {
     label
     value
     }
     }
     `;
    let genderOption={options: { variables: {type : "GENDER",hierarchyRefId:this.props.clusterId}}};
    let titlequery=gql`query($type:String,$hierarchyRefId:String){
     data: fetchMasterSettingsForPlatFormAdmin(type:$type,hierarchyRefId:$hierarchyRefId) {
     label
     value
     }
     }
     `;
    let titleOption={options: { variables: {type : "TITLE",hierarchyRefId:this.props.clusterId}}};
    /*let citizenshipsquery=gql`query($type:String,$hierarchyRefId:String){
     data: fetchMasterSettingsForPlatFormAdmin(type:$type,hierarchyRefId:$hierarchyRefId) {
     label
     value
     }
     }
     `;
    let citizenshipsOption={options: { variables: {type : "CITIZENSHIPS",hierarchyRefId:this.props.clusterId}}};
*/
    let userTypequery = gql`query{
    data:FetchUserType {label:userTypeName,value:_id}
    }
    `;
 /*   let citiesquery = gql`query($countryId:String){
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
    let lookinforquery=gql`  query{
    data:fetchLookingFor{label:lookingForName,value:_id}
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
    let that=this;
    const showLoader=this.state.loading;
    return (
      <div className="admin_main_wrap">
        {showLoader===true?(<MlLoader/>):(
            <div className="step_form_wrap step2">

              <ScrollArea speed={0.8} className="step_form_wrap"smoothScrolling={true} default={true} >
                <div className="col-md-6 nopadding-left">
                  <div className="form_bg">
                    <form>
                      <div className="form-group">
                        <input type="text" placeholder="Date & Time" className="form-control float-label" id=""  defaultValue={this.props.registrationInfo.registrationId}/>
                      </div>
                      <div className="form-group">
                        <input type="text" placeholder="Request Id" className="form-control float-label" id=""/>
                      </div>
                      <div className="ml_tabs">
                        <ul  className="nav nav-pills">
                          <li className="active">
                            <a  href="#3a" data-toggle="tab" name="Individual" onClick={this.checkIdentity.bind(this)}>Individual&nbsp;</a>
                          </li>
                          <li>
                            <a href="#4a" data-toggle="tab" name="Company" onClick={this.checkIdentity.bind(this)}>Company&nbsp;</a>
                          </li>
                        </ul>
                      </div>
                      <div className="form-group">
                        <Moolyaselect multiSelect={false} placeholder="Select User Category" className="form-control float-label" valueKey={'value'} labelKey={'label'}  selectedValue={this.state.selectedUserType} queryType={"graphql"} query={userTypequery} onSelect={that.optionsBySelectUserType.bind(this)} isDynamic={true}/>
                      </div>
                      {(this.state.identity=='Company'||this.state.identity=='')?
                        <div>
                          <div className="form-group">
                            <input type="text" ref="companyName" defaultValue={that.state.registrationDetails&&that.state.registrationDetails.companyName} placeholder="Company Name" className="form-control float-label" id=""/>
                          </div>
                          <div className="form-group">
                            <input type="text" ref="groupName" defaultValue={that.state.registrationDetails&&that.state.registrationDetails.groupName} placeholder="Group Name" className="form-control float-label" id=""/>
                          </div>
                          <div className="form-group">
                            <input type="text" ref="companyWebsite" defaultValue={that.state.registrationDetails&&that.state.registrationDetails.companyWebsite} placeholder="Company Website" className="form-control float-label" id=""/>
                          </div>
                          <div className="form-group">
                            <input type="text" ref="companyEmail" defaultValue={that.state.registrationDetails&&that.state.registrationDetails.companyEmail} placeholder="Company Email" className="form-control float-label" id=""/>
                          </div>
                          <div className="form-group">
                            <Datetime dateFormat="DD-MM-YYYY" timeFormat={false}  inputProps={{placeholder: "foundation Date",readOnly:true}}   closeOnSelect={true} value={that.state.foundationDate} onChange={that.onfoundationDateSelection.bind(that)}/>
                            <FontAwesome name="calendar" className="password_icon"/>
                          </div>
                          {/*<div className="form-group">
                            <Moolyaselect multiSelect={false} placeholder="Headquarter Location" className="form-control float-label" valueKey={'value'} labelKey={'label'}  selectedValue={this.state.selectedHeadquarter} queryType={"graphql"}  query={citiesquery} onSelect={that.optionsBySelectHeadquarter.bind(this)} isDynamic={true}/>
                          </div>
                          <div className="form-group">
                            <Moolyaselect multiSelect={true} placeholder="Branch Location" className="form-control float-label" valueKey={'value'} labelKey={'label'}  selectedValue={this.state.selectedBranches} queryType={"graphql"} query={citiesquery} onSelect={that.optionsBySelectBranch.bind(this)} isDynamic={true}/>
                          </div>*/}
                          <div className="form-group">
                            <Moolyaselect multiSelect={false} placeholder="Headquarter Location" className="form-control float-label" valueKey={'value'} labelKey={'label'}  selectedValue={this.state.selectedHeadquarter} queryType={"graphql"}  query={citiesquery} queryOptions={countryOption} onSelect={that.optionsBySelectHeadquarter.bind(this)} isDynamic={true}/>
                          </div>
                          <div className="form-group">
                            <Moolyaselect multiSelect={true} placeholder="Branch Location" className="form-control float-label" valueKey={'value'} labelKey={'label'}  selectedValue={this.state.selectedBranches} queryType={"graphql"}  query={branchesQuery} queryOptions={branchesOption} onSelect={that.optionsBySelectBranch.bind(this)} isDynamic={true}/>
                          </div>
                          <div className="form-group">
                            <input type="text" ref="isoAccrediationNumber" defaultValue={that.state.registrationDetails&&that.state.registrationDetails.isoAccrediationNumber} placeholder="ISO Certification Number" className="form-control float-label" id=""/>
                          </div>
                          <div className="form-group">
                            <input type="text" ref="companyTurnOver" defaultValue={that.state.registrationDetails&&that.state.registrationDetails.companyTurnOver} placeholder="Company Turnover" className="form-control float-label" id=""/>
                          </div>
                          <div className="form-group">
                            <input type="text" ref="partnerCompanies" defaultValue={that.state.registrationDetails&&that.state.registrationDetails.partnerCompanies} placeholder="Partners" className="form-control float-label" id=""/>
                          </div>
                          <div className="form-group">
                            <input type="text" ref="investors" defaultValue={that.state.registrationDetails&&that.state.registrationDetails.investors} placeholder="Investors" className="form-control float-label" id=""/>
                          </div>
                          <div className="form-group">
                            <Moolyaselect multiSelect={false} placeholder="Looking For" className="form-control float-label" valueKey={'value'} labelKey={'label'}  selectedValue={this.state.selectedLookingFor} queryType={"graphql"} query={lookinforquery} onSelect={that.optionsBySelectLookingFor.bind(this)} isDynamic={true}/>
                          </div>
                        </div>
                        :
                        <div>
                          <div className="form-group">
                            <Moolyaselect multiSelect={false} placeholder="Title" className="form-control float-label" valueKey={'value'} labelKey={'label'}  selectedValue={this.state.ti} queryType={"graphql"} query={titlequery}  queryOptions={titleOption} onSelect={that.optionsBySelectTitle.bind(this)} isDynamic={true}/>

                          </div>
                          <div className="form-group">
                            <input type="text" ref="firstName" defaultValue={that.state.registrationDetails&&that.state.registrationDetails.firstName} placeholder="First Name" className="form-control float-label" id=""/>
                          </div>
                          <div className="form-group">
                            <input type="text" ref="middleName" defaultValue={that.state.registrationDetails&&that.state.registrationDetails.middleName} placeholder="Middle Name" className="form-control float-label" id=""/>
                          </div>
                          <div className="form-group">
                            <input type="text" ref="lastName" defaultValue={that.state.registrationDetails&&that.state.registrationDetails.lastName} placeholder="Last Name" className="form-control float-label" id=""/>
                          </div>
                          <div className="form-group">
                            <input type="text" ref="displayName" defaultValue={that.state.registrationDetails&&that.state.registrationDetails.displayName} placeholder="Display Name" className="form-control float-label" id=""/>
                          </div>
                          <div className="form-group">
                            <Datetime dateFormat="DD-MM-YYYY" timeFormat={false}  inputProps={{placeholder: "Date of Birth",readOnly:true}}   closeOnSelect={true} value={that.state.dateOfBirth} onChange={that.ondateOfBirthSelection.bind(that)}/>
                            <FontAwesome name="calendar" className="password_icon"/>
                          </div>
                          <div className="form-group">
                            <Moolyaselect multiSelect={false} placeholder="Select Gender" className="form-control float-label" valueKey={'value'} labelKey={'label'}  selectedValue={this.state.gender} queryType={"graphql"} query={genderquery}  queryOptions={genderOption} onSelect={that.optionsBySelectGender().bind(this)} isDynamic={true}/>
                          </div>
                        </div>
                      }
                    </form>
                  </div>
                </div>
                <div className="col-md-6 nopadding-right">
                  <div className="form_bg">
                    <form>
                      {(this.state.identity=='Company'||this.state.identity=='')?
                        <div>
                          <div className="form-group">
                            <Moolyaselect multiSelect={false} placeholder="Select Type of Company" className="form-control float-label" valueKey={'value'} labelKey={'label'}  selectedValue={this.state.selectedTypeOfCompany} queryType={"graphql"} query={companytypesquery}  queryOptions={companytypesquery} onSelect={that.optionsBySelectTypeOfCompany.bind(this)} isDynamic={true}/>
                          </div>
                          <div className="form-group">
                            <Moolyaselect multiSelect={false} placeholder="Select Type of Entity" className="form-control float-label" valueKey={'value'} labelKey={'label'}  selectedValue={this.state.selectedTypeOfEntity} queryType={"graphql"} query={entitiesquery} onSelect={that.optionsBySelectTypeOfEntity.bind(this)} isDynamic={true}/>
                          </div>
                          <div className="form-group">
                            <Moolyaselect multiSelect={false} placeholder="Select Type of Business" className="form-control float-label" valueKey={'value'} labelKey={'label'}  selectedValue={this.state.selectedTypeOfBusiness} queryType={"graphql"} query={businesstypesquery} onSelect={that.optionsBySelectTypeOfBusiness.bind(this)} isDynamic={true}/>
                          </div>
                          <div className="form-group">
                            <Moolyaselect multiSelect={false} placeholder="Select Type Of Industry" className="form-control float-label" valueKey={'value'} labelKey={'label'}  selectedValue={this.state.selectedTypeOfIndustry} queryType={"graphql"} query={industriesquery} onSelect={that.optionsBySelectTypeOfIndustry.bind(this)} isDynamic={true}/>
                          </div>
                          <div className="form-group">
                            <Moolyaselect multiSelect={false} placeholder="Select Subdomain" className="form-control float-label" valueKey={'value'} labelKey={'label'}  selectedValue={this.state.selectedSubDomain} queryType={"graphql"} query={industriesquery} onSelect={that.optionsBySelectStageOfCompany.bind(this)} isDynamic={true}/>
                          </div>
                          <div className="form-group">
                            <Moolyaselect multiSelect={false} placeholder="Select Stage Of Company" className="form-control float-label" valueKey={'value'} labelKey={'label'}  selectedValue={this.state.selectedStageOfCompany} queryType={"graphql"} query={stageofcompquery} onSelect={that.optionsBySelectStageOfCompany.bind(this)} isDynamic={true}/>
                          </div>
                          <div className="form-group">
                            <Select name="form-field-name" placeholder="Select Subsidary Company" options={subsidary} selectedValue={this.state.selectedSubsidaryComapny} onSelect={this.optionsBySelectSubsidaryComapny.bind(this)}  className="float-label"/>
                          </div>
                          {this.state.selectedSubsidaryComapny=='Yes'?
                            <div className="form-group">
                              <input type="text" ref="parentCompany" defaultValue={that.state.registrationDetails&&that.state.registrationDetails.parentCompany} placeholder="Enter Holding/Group/Owner Company Name" className="form-control float-label" id=""/>
                            </div>:<div></div>}
                          <div className="form-group">
                            <input type="text" ref="registrationNumber" defaultValue={that.state.registrationDetails&&that.state.registrationDetails.registrationNumber} placeholder="Registration Number" className="form-control float-label" id=""/>
                          </div>
                          <div className="form-group">
                            <input type="text" ref="companyCEOName" defaultValue={that.state.registrationDetails&&that.state.registrationDetails.companyCEOName} placeholder="CEO Name" className="form-control float-label" id=""/>
                          </div>
                          <div className="form-group">
                            <input type="text" ref="companyManagement" defaultValue={that.state.registrationDetails&&that.state.registrationDetails.companyManagement} placeholder="Total Number Of Management People" className="form-control float-label" id=""/>
                          </div>
                          <div className="form-group">
                            <input type="text" ref="toatalEmployeeCount" defaultValue={that.state.registrationDetails&&that.state.registrationDetails.toatalEmployeeCount} placeholder="Total Number Of Employee" className="form-control float-label" id=""/>
                          </div>
                          <div className="form-group">
                            <input type="text" ref="associatedCompanies" defaultValue={that.state.registrationDetails&&that.state.registrationDetails.associatedCompanies} placeholder="Associate Company" className="form-control float-label" id=""/>
                          </div>
                        </div> :<div>

                          <div className="form-group">
                            <input type="text" ref="qualification" defaultValue={that.state.registrationDetails&&that.state.registrationDetails.qualification}  placeholder="Qualification" className="form-control float-label" id=""/>
                          </div>
                          <div className="form-group">
                            <Select name="form-field-name" placeholder="Employment Status" options={subsidary} selectedValue={this.state.selectedSubsidaryComapny} onSelect={this.optionsBySelectSubsidaryComapny.bind(this)}  className="float-label"/>
                          </div>
                          <div className="form-group">
                            <input type="text" ref="professionalTag" defaultValue={that.state.registrationDetails&&that.state.registrationDetails.professionalTag}  placeholder="Professional Tag" className="form-control float-label" id=""/>
                          </div>
                          <div className="form-group">
                            <Moolyaselect multiSelect={false} placeholder="Select Type Of Industry" className="form-control float-label" valueKey={'value'} labelKey={'label'}  selectedValue={this.state.selectedTypeOfIndustry} queryType={"graphql"} query={industriesquery} onSelect={that.optionsBySelectTypeOfIndustry.bind(this)} isDynamic={true}/>
                          </div>
                          <div className="form-group">
                            <Select name="form-field-name" placeholder="Profession" options={subsidary} selectedValue={this.state.selectedSubsidaryComapny} onSelect={this.optionsBySelectSubsidaryComapny.bind(this)}  className="float-label"/>
                          </div>
                          <div className="form-group">
                            <input type="text" ref="employerName" defaultValue={that.state.registrationDetails&&that.state.registrationDetails.employerName}  placeholder="Employer Name" className="form-control float-label" id=""/>
                          </div>
                          <div className="form-group">
                            <input type="text" ref="employerWebsite" defaultValue={that.state.registrationDetails&&that.state.registrationDetails.employerWebsite}  placeholder="Employer Website" className="form-control float-label" id=""/>
                          </div>
                          <div className="form-group">
                            <Datetime dateFormat="DD-MM-YYYY" timeFormat={false}  inputProps={{placeholder: "Employment Date",readOnly:true}}   closeOnSelect={true} value={that.state.employmentDate} onChange={that.onemploymentDateSelection.bind(that)}/>
                            <FontAwesome name="calendar" className="password_icon"/>
                          </div>

                        </div>}

                    </form>
                  </div>
                </div>
              </ScrollArea>
              <MlActionComponent ActionOptions={MlActionConfig} showAction='showAction' actionName="actionName"/>
            </div> )}
      </div>
    )
  }
};
