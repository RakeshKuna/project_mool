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
import {mlFieldValidations} from '../../../../commons/validations/mlfieldValidation';

export default class Individual extends React.Component{
  constructor(props){
    super(props);
    this.state={
     // selectedUserType:null,
      selectedHeadquarter:null,
      selectedBranches:null,
      selectedLookingFor:null,
      selectedTypeOfCompany:null,
      selectedTypeOfEntity:null,
      selectedTypeOfBusiness:null,
      selectedTypeOfIndustry:null,
      selectedSubDomain:null,
      selectedStageOfCompany:null,
      employmentStatus:null,
      registrationId:'',
      registrationDetails:'',
      foundationDate:'',
      dateOfBirth:'',
      employmentDate:'',
      //identity:'',
      title:'',
      gender:'',
      citizenships:''
     // profession:''

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
        //selectedUserType: details.userType,
        selectedHeadquarter: details.headQuarterLocation,
        selectedBranches: details.branchLocations,
        selectedLookingFor: details.lookingFor,
        selectedTypeOfCompany: details.companytyp,
        selectedTypeOfEntity: details.entityType,
        selectedTypeOfBusiness: details.businessType,
        selectedTypeOfIndustry: details.industry,
        selectedSubDomain: details.subDomain,
        selectedStageOfCompany: details.stageOfCompany,
        employmentStatus: details.employmentStatus,
        foundationDate:details.foundationDate,
        dateOfBirth:details.dateOfBirth,
        employmentDate:details.employmentDate,
        title:details.title,
        gender:details.gender,
        citizenships:details.citizenships,
       // profession:details.profession
      })
    }else{
      this.setState({
        loading: false
       // identity : 'Company'
      })
    }
  }

  componentDidMount()
  {
    initalizeFloatLabel();
    var WinHeight = $(window).height();
    $('.step_form_wrap').height(WinHeight-(160+$('.admin_header').outerHeight(true)));
  }
 /* optionsBySelectUserType(value){
    this.setState({selectedUserType:value})
  }*/
  optionsBySelectTypeOfIndustry(value){
    this.setState({selectedTypeOfIndustry:value})
  }

  optionsBySelectSubsidaryComapny(val){
    this.setState({employmentStatus:val})
  }
  checkIdentity(event){
    console.log(event.target.name)
   // this.setState({identity:event.target.name})
  }

  optionsBySelectGender(val){
    this.setState({gender:val})
  }
  optionsBySelectTitle(val){
    this.setState({title:val})
  }
  optionsBySelectCitizenships(val){
    this.setState({citizenships:val.value})
  }
 /* optionsBySelectProfession(val){
    this.setState({profession:val})
  }
*/
  async  updateregistration() {
    let ret = mlFieldValidations(this.refs)
    if (ret) {
      toastr.error(ret);
    } else {

      let Details = null;
      Details = {
        registrationId: this.props.registrationId,
        details: {
          //identityType      : this.state.identity,
          // userType          : this.state.selectedUserType,
          title: this.state.title,
          firstName: this.refs.firstName.value,
          middleName: this.refs.middleName.value,
          lastName: this.refs.lastName.value,
          displayName: this.refs.displayName.value,
          dateOfBirth: this.state.dateOfBirth,
          gender: this.state.gender,
          citizenships: this.state.citizenships,
          qualification: this.refs.qualification.value,
          employmentStatus: this.state.employmentStatus,
          professionalTag: this.refs.professionalTag.value,
          industry: this.state.selectedTypeOfIndustry,
          profession: this.state.profession,
          employerName: this.refs.employerName.value,
          employerWebsite: this.refs.employerWebsite.value,
          employmentDate: this.state.employmentDate
        }
      }
        //this.props.getRegistrationDetails();
        const response = await updateRegistrationActionHandler(Details);
      this.props.getRegistrationDetails();
      toastr.success("Saved Successfully");
      return response;
    }
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
      let value = moment(event._d).format('MM/DD/YYYY');
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
            FlowRouter.go("/admin/transactions/registrationRequested")
          }
        }
      ]
    }
    let subsidary = [
      {value: 'Yes', label: 'Yes'},
      {value: 'No', label: 'No'}
    ];

    let genderquery=gql`query($type:String,$hierarchyRefId:String){
     data: fetchMasterSettingsForPlatFormAdmin(type:$type,hierarchyRefId:$hierarchyRefId) {
     label
     value
     }
     }
     `;
    let employementquery=gql`query($type:String,$hierarchyRefId:String){
     data: fetchMasterSettingsForPlatFormAdmin(type:$type,hierarchyRefId:$hierarchyRefId) {
     label
     value
     }
     }
     `;
    let employmentOption={options: { variables: {type : "EMPLOYMENTTYPE",hierarchyRefId:this.props.clusterId}}};
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
    let industriesquery=gql` query{
    data:fetchIndustries{label:industryName,value:_id}
    }
    `;

    let professionQuery=gql` query($industryId:String){
      data:fetchIndustryBasedProfession(industryId:$industryId) {
        label:professionName
        value:_id
      }
    }`;
    let professionQueryOptions = {options: {variables: {industryId:this.state.selectedTypeOfIndustry}}};

    let that=this;
    const showLoader=this.state.loading;
    return (

              <div>
                <ScrollArea speed={0.8} className="step_form_wrap"smoothScrolling={true} default={true} >
              <div className="col-md-6 nopadding-left">
                <div className="form_bg">
                  <form>
                    <div>
                        <div className="form-group">
                          <input type="text" placeholder="Date & Time" className="form-control float-label" id="" defaultValue={moment(this.props.registrationInfo.registrationDate).format(Meteor.settings.public.dateFormat)} disabled="true"/>
                        </div>
                        <div className="form-group">
                          <input type="text" placeholder="Request Id" className="form-control float-label" id=""  defaultValue={this.props.registrationInfo.registrationId} disabled="true"/>
                        </div>
                        {/*<div className="form-group">
                          <Moolyaselect multiSelect={false} placeholder="select user category" className="form-control float-label" valueKey={'value'} labelKey={'label'}  selectedValue={this.state.selectedUserType} queryType={"graphql"} query={userTypequery} onSelect={that.optionsBySelectUserType.bind(this)} isDynamic={true}/>
                        </div>*/}
                        <div className="form-group">
                          <Moolyaselect multiSelect={false} placeholder="Title" className="form-control float-label" valueKey={'value'} labelKey={'label'}  selectedValue={this.state.title} queryType={"graphql"} query={titlequery}  queryOptions={titleOption} onSelect={that.optionsBySelectTitle.bind(this)} isDynamic={true} data-required={true} data-errMsg="Title is required"/>

                        </div>
                        <div className="form-group mandatory">
                          <input type="text" ref="firstName" defaultValue={that.state.registrationDetails&&that.state.registrationDetails.firstName} placeholder="First Name" className="form-control float-label" id="" data-required={true} data-errMsg="First Name is required"/>
                        </div>
                        <div className="form-group">
                          <input type="text" ref="middleName" defaultValue={that.state.registrationDetails&&that.state.registrationDetails.middleName} placeholder="Middle Name" className="form-control float-label" id=""/>
                        </div>
                        <div className="form-group mandatory">
                          <input type="text" ref="lastName" defaultValue={that.state.registrationDetails&&that.state.registrationDetails.lastName} placeholder="Last Name" className="form-control float-label" id="" data-required={true} data-errMsg="Last Name is required"/>
                        </div>
                        <div className="form-group mandatory">
                          <input type="text" ref="displayName" defaultValue={that.state.registrationDetails&&that.state.registrationDetails.displayName} placeholder="Display Name" className="form-control float-label" id="" data-required={true} data-errMsg="Display Name is required"/>
                        </div>
                        <div className="form-group mandatory">
                          <Datetime dateFormat="DD-MM-YYYY" timeFormat={false} ref={"dob"} inputProps={{placeholder: "Date Of Birth",readOnly:true}}   closeOnSelect={true} value={that.state.dateOfBirth} onChange={that.ondateOfBirthSelection.bind(that)} data-required={true} data-errMsg="Date Of Birth is required"/>
                          <FontAwesome name="calendar" className="password_icon"/>
                          <br className="brclear"/>  <br className="brclear"/>  <br className="brclear"/>
                        </div>
                        <div className="form-group mandatory">
                          <Moolyaselect multiSelect={false}  ref={"gender"} placeholder="Select Gender" className="form-control float-label" valueKey={'value'} labelKey={'label'}  selectedValue={this.state.gender} queryType={"graphql"} query={genderquery}  queryOptions={genderOption} onSelect={that.optionsBySelectGender.bind(this)} isDynamic={true} data-required={true} data-errMsg="Gender is required"/>
                        </div>
                      <br className="brclear"/>  <br className="brclear"/>  <br className="brclear"/>

                      </div>

                  </form>
                </div>
              </div>
              <div className="col-md-6 nopadding-right">
                <div className="form_bg">
                  <form>
                    <div className="form-group">
                      <input type="text" ref="qualification" defaultValue={that.state.registrationDetails&&that.state.registrationDetails.qualification}  placeholder="Qualification" className="form-control float-label" id=""/>
                    </div>
                    <div className="form-group">
                     {/* <Select name="form-field-name" placeholder="Employment Status" options={subsidary} value={this.state.employmentStatus} onChange={this.optionsBySelectSubsidaryComapny.bind(this)}  className="float-label"/>*/}
                      <Moolyaselect multiSelect={false} placeholder="Employment Status" className="form-control float-label" valueKey={'value'} labelKey={'label'}  selectedValue={this.state.employmentStatus} queryType={"graphql"} query={employementquery}  queryOptions={employmentOption} onSelect={that.optionsBySelectSubsidaryComapny.bind(this)} isDynamic={true}/>
                    </div>
                    <div className="form-group">
                      <input type="text" ref="professionalTag" defaultValue={that.state.registrationDetails&&that.state.registrationDetails.professionalTag}  placeholder="Professional Tag" className="form-control float-label" id=""/>
                    </div>
                   {/* <div className="form-group">
                      <Moolyaselect multiSelect={false} placeholder="Select Type Of Industry" className="form-control float-label" valueKey={'value'} labelKey={'label'}  selectedValue={this.state.selectedTypeOfIndustry} queryType={"graphql"} query={industriesquery} onSelect={that.optionsBySelectTypeOfIndustry.bind(this)} isDynamic={true}/>
                    </div>
                    <div className="form-group">
                      <Moolyaselect multiSelect={false} placeholder="Select Profession" className="form-control float-label" valueKey={'value'} labelKey={'label'}  selectedValue={this.state.profession} queryType={"graphql"} query={professionQuery} queryOptions={professionQueryOptions}  onSelect={that.optionsBySelectProfession.bind(this)} isDynamic={true}/>

                    </div>*/}
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
                  </form>
                </div>
              </div>
                </ScrollArea>
                <MlActionComponent ActionOptions={MlActionConfig} showAction='showAction' actionName="actionName"/>
          </div>
    )
  }
}
