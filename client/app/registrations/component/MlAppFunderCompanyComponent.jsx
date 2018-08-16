import React from "react";
import {render} from "react-dom";
import ScrollArea from "react-scrollbar";
import { Scrollbars } from 'react-custom-scrollbars';
import gql from "graphql-tag";
import Moolyaselect from "../../commons/components/MlAppSelectWrapper";
import {updateRegistrationActionHandler} from "../actions/updateRegistration";
import Datetime from "react-datetime";
import moment from "moment";
import MlLoader from "../../../commons/components/loader/loader";
import {initalizeFloatLabel} from "../../../commons/utils/formElemUtil";
import MlAccordion from "../../../app/commons/components/MlAccordion";
import MlAppActionComponent from "../../../app/commons/components/MlAppActionComponent";
// import MlActionComponent from "../../../commons/components/actions/ActionComponent";
var FontAwesome = require('react-fontawesome');
var Select = require('react-select');
var diff = require('deep-diff').diff;
import _underscore from 'underscore'
import {mlFieldValidations} from '../../../commons/validations/mlfieldValidation';


export default class MlAppFunderCompanyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedUserType: null,
      selectedHeadquarter: null,
      selectedBranches: null,
      selectedLookingFor: null,
      selectedTypeOfCompany: null,
      selectedTypeOfEntity: null,
      selectedTypeOfBusiness: null,
      selectedTypeOfIndustry: null,
      selectedSubDomain: null,
      selectedStageOfCompany: null,
      selectedSubsidaryComapny: null,
      registrationId: '',
      registrationDetails: '',
      foundationDate: null,
      investingFrom: null,
      investmentAmount: '',
      currency: null
    };
    return this;
  }

  componentWillMount() {
    let details = this.props.registrationDetails;
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
        foundationDate: details.foundationDate,
        investingFrom: details.investingFrom,
        currency: details.currency,
        investmentAmout: details.investmentAmout
      })
    }
  }

  componentDidMount() {
    initalizeFloatLabel();
    var WinHeight = $(window).height();
    $('.step_form_wrap').height(WinHeight - (210 + $('.app_header').outerHeight(true)));
  }

  optionsBySelectUserType(value) {
    this.setState({selectedUserType: value})
  }

  optionsBySelectHeadquarter(value) {
    this.setState({selectedHeadquarter: value})
  }

  optionsBySelectBranch(value) {
    this.setState({selectedBranches: value})
  }

  optionsBySelectLookingFor(value) {
    this.setState({selectedLookingFor: value})
  }

  optionsBySelectTypeOfCompany(value) {
    this.setState({selectedTypeOfCompany: value})
  }

  optionsBySelectTypeOfEntity(value) {
    this.setState({selectedTypeOfEntity: value})
  }

  optionsBySelectTypeOfBusiness(value) {
    this.setState({selectedTypeOfBusiness: value})
  }

  optionsBySelectTypeOfIndustry(value) {
    this.setState({selectedTypeOfIndustry: value})
  }

  optionsBySelectSubDomain(value) {
    this.setState({selectedSubDomain: value})
  }

  optionsBySelectStageOfCompany(value) {
    this.setState({selectedStageOfCompany: value})
  }

  optionsBySelectSubsidaryComapny(val) {
    this.setState({selectedSubsidaryComapny: val.value})
  }

  onFoundationDateSelection(event) {
    if (event._d) {
      let value = moment(event._d).format('DD-MM-YYYY');
      this.setState({loading: false, foundationDate: value});
    }
  }

  optionsBySelectCurrency(value) {
    this.setState({currency: value})
  }

  optionsBySelectInvestingFrom(val) {
    this.setState({investingFrom: val.value})
  }

  openDatePickerEmploymentDate() {
    $('#date-time').toggleClass('rdtOpen')
  }

  openDatePickerDateOfBirth() {
    $('#date-of-birth').toggleClass('rdtOpen')
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
      userType              :   existingObject.userType?existingObject.userType:null,
      companyName           :   existingObject.companyName?existingObject.companyName:null,
      groupName             :   existingObject.groupName?existingObject.groupName:null,
      companyWebsite        :   existingObject.companyWebsite?existingObject.companyWebsite:null,
      companyEmail          :   existingObject.companyEmail?existingObject.companyEmail:null,
      foundationDate        :   existingObject.foundationDate?existingObject.foundationDate:null,
      headQuarterLocation   :   existingObject.headQuarterLocation?existingObject.headQuarterLocation:null,
      branchLocations       :   existingObject.branchLocations?existingObject.branchLocations:null,
      companytyp            :   existingObject.companytyp?existingObject.companytyp:null,
      entityType            :   existingObject.entityType?existingObject.entityType:null,
      businessType          :   existingObject.businessType?existingObject.businessType:null,
      industry              :   existingObject.industry?existingObject.industry:null,
      subDomain             :   existingObject.subDomain?existingObject.subDomain:null,
      stageOfCompany        :   existingObject.stageOfCompany?existingObject.stageOfCompany:null,
      subsidaryCompany      :   existingObject.subsidaryCompany?existingObject.subsidaryCompany:null,
      registrationNumber    :   existingObject.registrationNumber?existingObject.registrationNumber:null,
      isoAccrediationNumber :   existingObject.isoAccrediationNumber?existingObject.isoAccrediationNumber:null,
      companyTurnOver       :   existingObject.companyTurnOver?existingObject.companyTurnOver:null,
      partnerCompanies      :   existingObject.partnerCompanies?existingObject.partnerCompanies:null,
      investors             :   existingObject.investors?existingObject.investors:null,
      lookingFor            :   existingObject.lookingFor?existingObject.lookingFor:null,
      companyCEOName        :   existingObject.companyCEOName?existingObject.companyCEOName:null,
      //parentCompany         :   this.refs.parentCompany.value?this.refs.parentCompany.value:null,
      companyManagement     :   existingObject.companyManagement?existingObject.companyManagement:null,
      toatalEmployeeCount   :   existingObject.toatalEmployeeCount?existingObject.toatalEmployeeCount:null,
      associatedCompanies   :   existingObject.associatedCompanies?existingObject.associatedCompanies:null,
      investingFrom         :   existingObject.investingFrom?existingObject.investingFrom:null,
      currency              :   existingObject.currency?existingObject.currency:null,
      investmentAmount      :   existingObject.investmentAmount?existingObject.investmentAmount:null
    }

    let newObject = {
      userType              :   this.state.selectedUserType?this.state.selectedUserType:null,
      companyName           :   this.refs.companyName.value||null,
      groupName             :   this.refs.groupName.value||null,
      companyWebsite        :   this.refs.companyWebsite.value?this.refs.companyWebsite.value:null,
      companyEmail          :   this.refs.companyEmail.value?this.refs.companyEmail.value:null,
      foundationDate        :   this.state.foundationDate?this.state.foundationDate:null,
      headQuarterLocation   :   this.state.selectedHeadquarter?this.state.selectedHeadquarter:null,
      branchLocations       :   this.state.selectedBranches?this.state.selectedBranches:null,
      companytyp            :   this.state.selectedTypeOfCompany?this.state.selectedTypeOfCompany:null,
      entityType            :   this.state.selectedTypeOfEntity?this.state.selectedTypeOfEntity:null,
      businessType          :   this.state.selectedTypeOfBusiness?this.state.selectedTypeOfBusiness:null,
      industry              :   this.state.selectedTypeOfIndustry?this.state.selectedTypeOfIndustry:null,
      subDomain             :   this.state.selectedSubDomain?this.state.selectedSubDomain:null,
      stageOfCompany        :   this.state.selectedStageOfCompany?this.state.selectedStageOfCompany:null,
      subsidaryCompany      :   this.state.selectedSubsidaryComapny?this.state.selectedSubsidaryComapny:null,
      registrationNumber    :   this.refs.registrationNumber.value?this.refs.registrationNumber.value:null,
      isoAccrediationNumber :   this.refs.isoAccrediationNumber.value?this.refs.isoAccrediationNumber.value:null,
      companyTurnOver       :   this.refs.companyTurnOver.value?this.refs.companyTurnOver.value:null,
      partnerCompanies      :   this.refs.partnerCompanies.value?this.refs.partnerCompanies.value:null,
      investors             :   this.refs.investors.value?this.refs.investors.value:null,
      lookingFor            :   this.state.selectedLookingFor?this.state.selectedLookingFor:null,
      companyCEOName        :   this.refs.companyCEOName.value?this.refs.companyCEOName.value:null,
      //parentCompany         :   this.refs.parentCompany.value?this.refs.parentCompany.value:null,
      companyManagement     :   this.refs.companyManagement.value?this.refs.companyManagement.value:null,
      toatalEmployeeCount   :   this.refs.toatalEmployeeCount.value?this.refs.toatalEmployeeCount.value:null,
      associatedCompanies   :   this.refs.associatedCompanies.value?this.refs.associatedCompanies.value:null,
      investingFrom         :   this.state.investingFrom?this.state.investingFrom:null,
      currency              :   this.state.currency?this.state.currency:null,
      investmentAmount      :   this.refs.investmentAmount.value?this.refs.investmentAmount.value:null
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
    let ret = mlFieldValidations(this.refs)
    console.log(ret);
    if (ret) {
      toastr.error(ret);
    }else{
    let Details = {
      registrationId: this.props.registrationId,
      details: {
        userType              :   this.state.selectedUserType?this.state.selectedUserType:null,
        companyName           :   this.refs.companyName.value||null,
        groupName             :   this.refs.groupName.value||null,
        companyWebsite        :   this.refs.companyWebsite.value?this.refs.companyWebsite.value:null,
        companyEmail          :   this.refs.companyEmail.value?this.refs.companyEmail.value:null,
        foundationDate        :   this.state.foundationDate?this.state.foundationDate:null,
        headQuarterLocation   :   this.state.selectedHeadquarter?this.state.selectedHeadquarter:null,
        branchLocations       :   this.state.selectedBranches?this.state.selectedBranches:null,
        companytyp            :   this.state.selectedTypeOfCompany?this.state.selectedTypeOfCompany:null,
        entityType            :   this.state.selectedTypeOfEntity?this.state.selectedTypeOfEntity:null,
        businessType          :   this.state.selectedTypeOfBusiness?this.state.selectedTypeOfBusiness:null,
        industry              :   this.state.selectedTypeOfIndustry?this.state.selectedTypeOfIndustry:null,
        subDomain             :   this.state.selectedSubDomain?this.state.selectedSubDomain:null,
        stageOfCompany        :   this.state.selectedStageOfCompany?this.state.selectedStageOfCompany:null,
        subsidaryCompany      :   this.state.selectedSubsidaryComapny?this.state.selectedSubsidaryComapny:null,
        registrationNumber    :   this.refs.registrationNumber.value?this.refs.registrationNumber.value:null,
        isoAccrediationNumber :   this.refs.isoAccrediationNumber.value?this.refs.isoAccrediationNumber.value:null,
        companyTurnOver       :   this.refs.companyTurnOver.value?this.refs.companyTurnOver.value:null,
        partnerCompanies      :   this.refs.partnerCompanies.value?this.refs.partnerCompanies.value:null,
        investors             :   this.refs.investors.value?this.refs.investors.value:null,
        lookingFor            :   this.state.selectedLookingFor?this.state.selectedLookingFor:null,
        companyCEOName        :   this.refs.companyCEOName.value?this.refs.companyCEOName.value:null,
        companyManagement     :   this.refs.companyManagement.value?this.refs.companyManagement.value:null,
        toatalEmployeeCount   :   this.refs.toatalEmployeeCount.value?this.refs.toatalEmployeeCount.value:null,
        associatedCompanies   :   this.refs.associatedCompanies.value?this.refs.associatedCompanies.value:null,
        investingFrom         :   this.state.investingFrom?this.state.investingFrom:null,
        currency              :   this.state.currency?this.state.currency:null,
        investmentAmount      :   this.refs.investmentAmount.value?this.refs.investmentAmount.value:null
      }
    }
    //this.props.getRegistrationDetails(Details);
    const response = await updateRegistrationActionHandler(Details);
    if (response.success) {
      this.props.getRegistrationDetails();
      toastr.success("Registration details saved successfully");
    } else {
      toastr.error(response.result);
    }
    // toastr.success("Saved Successfully");
    return response;
  }
  }

  updateRegistration() {
    const resp = this.updateregistration();
    return resp;
  }

  render() {
    var yesterday = Datetime.moment().subtract(0, 'day');
    var valid = function (current) {
      return current.isBefore(yesterday);
    };
    let userType = this.props.userType;

    /**
     * action handlers
     * */
    let appActionConfig = [
      {
        showAction: true,
        actionName: 'save',
        handler: this.updateRegistration.bind(this),
      },
      {
        showAction: true,
        actionName: 'cancel',
        handler: async(event) => {
          FlowRouter.go("/app/dashboard")
        }
      }
    ]

    export const genericPortfolioAccordionConfig = {
      id: 'registrationAccordion',
      panelItems: [
        {
          'title': 'Actions',
          isText: false,
          style: {'background': '#ef4647'},
          contentComponent: <MlAppActionComponent
            resourceDetails={{
              resourceId: 'registrationId',
              resourceType: 'registration'
            }}
            actionOptions={appActionConfig}/>
        }]
    }
    {/**need to pass generic regId*/
    }

    let subsidary = [
      {value: 'Yes', label: 'Yes'},
      {value: 'No', label: 'No'}
    ];
    let investingFrom = [
      {value: 'Personal Fund', label: 'Personal Fund'},
      {value: 'Family Fund', label: 'Family Fund'}
    ];

    let companytypesquery = gql`query($type:String,$hierarchyRefId:String){
     data: fetchMasterSettingsForPlatFormAdmin(type:$type,hierarchyRefId:$hierarchyRefId) {
     label
     value
     }
     }
     `;
    let companytypesOption = {
      options: {
        variables: {
          type: "COMPANYTYPE",
          hierarchyRefId: this.props.registrationInfo.clusterId
        }
      }
    };

    let businesstypesquery = gql` query{
    data:fetchBusinessTypes{label:businessTypeName,value:_id}
    }
    `;


    let userTypequery = gql` query($communityCode:String){  
    data:FetchUserType(communityCode:$communityCode) {
      value:_id
      label:userTypeName
  }  }
    `;
    let userTypeOption = {options: {variables: {communityCode: this.props.registrationInfo.registrationType}}};
    /* let citiesquery = gql`query($countryId:String){
     data:fetchCitiesPerCountry(countryId:$countryId){label:name,value:_id}
     }
     `;*/
    let entitiesquery = gql`query{
    data:fetchEntities {label:entityName,value:_id  }
    }
    `;
    let industriesquery = gql` query{
    data:fetchIndustries{label:industryName,value:_id}
    }
    `;
    let lookinforquery = gql`query($communityCode:String){
  data:fetchLookingFor(communityCode:$communityCode) {
    label:lookingForName
  	value:_id
  }
  
}
    `;
    let currencyquery = gql `query{  
      data:fetchCurrency{
        value:_id
        label:currencyName
      }  
    }`;
    let lookingOption = {options: {variables: {communityCode: this.props.registrationInfo.registrationType}}};
    let stageofcompquery = gql` query{
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

    let subDomainQuery = gql`query($industryId: String){
      data:fetchIndustryDomain(industryId:$industryId){label:name,value:_id}
    }
    `;

    let countryOption = {options: { variables: {countryId:this.state&&this.state.selectedHeadquarter?this.state.selectedHeadquarter:""}}};
    let branchesOption = {options: { variables: {countryId:this.state&&this.state.selectedBranches?this.state.selectedBranches:null}}};
    let subDomainOption={options: { variables: {industryId:this.props.registrationInfo&&this.props.registrationInfo.industry?this.props.registrationInfo.industry:null}}};

    let that = this;
    const showLoader = this.state.loading;
    return (
      <div>
        {showLoader === true ? (<MlLoader/>) : (
          <div className="step_form_wrap step2">
            <Scrollbars speed={0.8} className="step_form_wrap" smoothScrolling={true} default={true}>
            <div className="col-md-6 nopadding-left">

                <div className="form_bg">
                  <form>
                    <div className="form-group">
                      <input type="text" placeholder="Date & Time" className="form-control float-label" id=""
                             defaultValue={moment(this.props.registrationInfo.registrationDate).format(Meteor.settings.public.dateFormat)}
                             disabled="true"/>
                    </div>
                    <div className="form-group">
                      <input type="text" placeholder="Request Id" className="form-control float-label" id=""
                             defaultValue={this.props.registrationInfo.registrationId} disabled="true"/>
                    </div>
                    {/*<div className="form-group">
                     <Moolyaselect multiSelect={false} placeholder="Select User Category" className="form-control float-label" valueKey={'value'} labelKey={'label'}  selectedValue={this.state.selectedUserType} queryType={"graphql"} query={userTypequery} reExecuteQuery={true} queryOptions={userTypeOption} onSelect={that.optionsBySelectUserType.bind(this)} isDynamic={true}/>
                     </div>*/}
                    <div className="form-group">
                      <input type="text" ref="companyName"
                             defaultValue={that.state.registrationDetails && that.state.registrationDetails.companyName}
                             placeholder="Company Name" className="form-control float-label" id=""/>
                    </div>
                    <div className="form-group">
                      <input type="text" ref="groupName"
                             defaultValue={that.state.registrationDetails && that.state.registrationDetails.groupName}
                             placeholder="Group Name" className="form-control float-label" id=""/>
                    </div>
                    <div className="form-group">
                      <input type="text" ref="companyWebsite"
                             defaultValue={that.state.registrationDetails && that.state.registrationDetails.companyWebsite}
                             placeholder="Company Website" className="form-control float-label" id=""/>
                    </div>
                    <div className="form-group">
                      <input type="text" ref="companyEmail"
                             defaultValue={that.state.registrationDetails && that.state.registrationDetails.companyEmail}
                             placeholder="Company Email" className="form-control float-label" id=""/>
                    </div>
                    <div className="form-group" id="date-of-birth">
                      <Datetime dateFormat="DD-MM-YYYY" timeFormat={false} inputProps={{placeholder: "Foundation Year",readOnly:true}}
                                closeOnSelect={true} value={that.state.foundationDate}
                                onChange={that.onFoundationDateSelection.bind(that)} isValidDate={ valid }/>
                      <FontAwesome name="calendar" className="password_icon"
                                   onClick={that.openDatePickerDateOfBirth.bind(that)}/>
                    </div>
                    <div className="form-group">
                      <Moolyaselect multiSelect={false} placeholder="Headquarter Location" className="form-control float-label"
                                    valueKey={'value'} labelKey={'label'}  selectedValue={this.state.selectedHeadquarter}
                                    queryType={"graphql"}  query={citiesquery} queryOptions={countryOption}
                                    onSelect={that.optionsBySelectHeadquarter.bind(this)} isDynamic={true}/>
                    </div>
                    <div className="form-group">
                      <Moolyaselect multiSelect={true} placeholder="Branch Location" className="form-control float-label"
                                    valueKey={'value'} labelKey={'label'}  selectedValue={this.state.selectedBranches}
                                    queryType={"graphql"}  query={branchesQuery} queryOptions={branchesOption}
                                    onSelect={that.optionsBySelectBranch.bind(this)} isDynamic={true}/>
                    </div>
                    <div className="form-group">
                      <input type="text" ref="isoAccrediationNumber"
                             defaultValue={that.state.registrationDetails && that.state.registrationDetails.isoAccrediationNumber}
                             placeholder="ISO certification number" className="form-control float-label" id=""/>
                    </div>
                    <div className="form-group">
                      <input type="text" ref="companyTurnOver"
                             defaultValue={that.state.registrationDetails && that.state.registrationDetails.companyTurnOver}
                             placeholder="Company Turnover" className="form-control float-label" id=""/>
                    </div>
                    <div className="form-group">
                      <input type="text" ref="partnerCompanies"
                             defaultValue={that.state.registrationDetails && that.state.registrationDetails.partnerCompanies}
                             placeholder="Partners" className="form-control float-label" id=""/>
                    </div>
                    <div className="form-group">
                      <input type="text" ref="investors"
                             defaultValue={that.state.registrationDetails && that.state.registrationDetails.investors}
                             placeholder="Investors" className="form-control float-label" id=""/>
                    </div>
                    <div className="form-group">
                      <Moolyaselect multiSelect={false} placeholder="Looking For" className="form-control float-label"
                                    valueKey={'value'} labelKey={'label'} selectedValue={this.state.selectedLookingFor}
                                    queryType={"graphql"} query={lookinforquery} queryOptions={lookingOption}
                                    onSelect={that.optionsBySelectLookingFor.bind(that)} isDynamic={true}/>
                    </div>
                    <div className="panel panel-default">
                      <div className="panel-heading">Investment Per Year</div>
                      <div className="panel-body">
                        <div className="form-group">
                          <Moolyaselect multiSelect={false} placeholder="Select Currency"
                                        className="form-control float-label" valueKey={'value'} labelKey={'label'}
                                        selectedValue={this.state.currency} queryType={"graphql"} query={currencyquery}
                                        queryOptions={lookingOption} onSelect={that.optionsBySelectCurrency.bind(that)}
                                        isDynamic={true}/>
                        </div>
                        <div className="form-group">
                          <input type="text" ref="investmentAmount"
                                 defaultValue={that.state.registrationDetails && that.state.registrationDetails.investmentAmount}
                                 placeholder="Enter Amount" className="form-control float-label" id=""/>
                        </div>
                        <br/><br/><br/><br/><br/><br/><br/>
                      </div>
                    </div>
                  </form>
                </div>

            </div>
            <div className="col-md-6 nopadding-right">

                <div className="form_bg">
                  <form>
                    <div className="form-group">
                      <Moolyaselect multiSelect={false} placeholder="Select Type Of Company"
                                    className="form-control float-label" valueKey={'value'} labelKey={'label'}
                                    selectedValue={this.state.selectedTypeOfCompany} queryType={"graphql"}
                                    query={companytypesquery} queryOptions={companytypesOption}
                                    onSelect={that.optionsBySelectTypeOfCompany.bind(this)} isDynamic={true}/>
                    </div>
                    <div className="form-group">
                      <Moolyaselect multiSelect={false} placeholder="Select Type Of Entity"
                                    className="form-control float-label" valueKey={'value'} labelKey={'label'}
                                    selectedValue={this.state.selectedTypeOfEntity} queryType={"graphql"}
                                    query={entitiesquery} onSelect={that.optionsBySelectTypeOfEntity.bind(this)}
                                    isDynamic={true}/>
                    </div>
                    <div className="form-group">
                      <Moolyaselect multiSelect={false} placeholder="Select Type Of Business"
                                    className="form-control float-label" valueKey={'value'} labelKey={'label'}
                                    selectedValue={this.state.selectedTypeOfBusiness} queryType={"graphql"}
                                    query={businesstypesquery} onSelect={that.optionsBySelectTypeOfBusiness.bind(this)}
                                    isDynamic={true}/>
                    </div>
                    {/* <div className="form-group">
                     <Moolyaselect multiSelect={false} placeholder="Select Type Of Industry" className="form-control float-label" valueKey={'value'} labelKey={'label'}  selectedValue={this.state.selectedTypeOfIndustry} queryType={"graphql"} query={industriesquery} onSelect={that.optionsBySelectTypeOfIndustry.bind(this)} isDynamic={true}/>
                     </div>
                     <div className="form-group">
                     <Moolyaselect multiSelect={false} placeholder="Select Subdomain" className="form-control float-label" valueKey={'value'} labelKey={'label'}  selectedValue={this.state.selectedSubDomain} queryType={"graphql"} query={industriesquery} onSelect={that.optionsBySelectStageOfCompany.bind(this)} isDynamic={true}/>
                     </div>*/}
                       <div className="form-group">
                        <Moolyaselect multiSelect={true} mandatory={true} ref="subDomain" placeholder="Select Subdomain" 
                        className="form-control float-label" valueKey={'value'} labelKey={'label'}  
                        selectedValue={this.state.selectedSubDomain} queryType={"graphql"} 
                        queryOptions={subDomainOption} query={subDomainQuery} onSelect={that.optionsBySelectSubDomain.bind(this)} 
                        isDynamic={true} data-required={true} data-errMsg="SubDomain is required"/>
                    </div>
                    <div className="form-group">
                      <Moolyaselect multiSelect={false} placeholder="Select Stage Of Company"
                                    className="form-control float-label" valueKey={'value'} labelKey={'label'}
                                    selectedValue={this.state.selectedStageOfCompany} queryType={"graphql"}
                                    query={stageofcompquery} onSelect={that.optionsBySelectStageOfCompany.bind(this)}
                                    isDynamic={true}/>
                    </div>
                    <div className="form-group">
                      <Select name="form-field-name" placeholder="Select Subsidary Company" options={subsidary}
                              value={this.state.selectedSubsidaryComapny}
                              onChange={this.optionsBySelectSubsidaryComapny.bind(this)} className="float-label"/>
                    </div>
                    {this.state.selectedSubsidaryComapny == 'Yes' ?
                      <div className="form-group">
                        <input type="text" ref="parentCompany"
                               defaultValue={that.state.registrationDetails && that.state.registrationDetails.parentCompany}
                               placeholder="Enter Holding/Group/Owner Company Name" className="form-control float-label"
                               id=""/>
                      </div> : <div></div>}
                    <div className="form-group">
                      <input type="text" ref="registrationNumber"
                             defaultValue={that.state.registrationDetails && that.state.registrationDetails.registrationNumber}
                             placeholder="Registration Number" className="form-control float-label" id=""/>
                    </div>
                    <div className="form-group">
                      <input type="text" ref="companyCEOName"
                             defaultValue={that.state.registrationDetails && that.state.registrationDetails.companyCEOName}
                             placeholder="CEO Name" className="form-control float-label" id=""/>
                    </div>
                    <div className="form-group">
                      <input type="text" ref="companyManagement"
                             defaultValue={that.state.registrationDetails && that.state.registrationDetails.companyManagement}
                             placeholder="Total Number Of Management People" className="form-control float-label"
                             id=""/>
                    </div>
                    <div className="form-group">
                      <input type="text" ref="toatalEmployeeCount"
                             defaultValue={that.state.registrationDetails && that.state.registrationDetails.toatalEmployeeCount}
                             placeholder="Total Number Of Employee" className="form-control float-label" id=""/>
                    </div>
                    <div className="form-group">
                      <input type="text" ref="associatedCompanies"
                             defaultValue={that.state.registrationDetails && that.state.registrationDetails.associatedCompanies}
                             placeholder="Associate Company" className="form-control float-label" id=""/>
                    </div>
                    <div className="form-group">
                      <Select name="form-field-name" placeholder="Investing From" options={investingFrom}
                              value={this.state.investingFrom} onChange={this.optionsBySelectInvestingFrom.bind(this)}
                              className="float-label"/>
                      <br className="clearfix"/> <br className="clearfix"/>

                    </div>

                  </form>
                </div>
            </div>
            {/*<MlActionComponent ActionOptions={MlActionConfig} showAction='showAction' actionName="actionName"/>*/}
            </Scrollbars>
            <MlAccordion accordionOptions={genericPortfolioAccordionConfig} {...this.props} />
          </div> )}
      </div>
    )
  }
};
