import React, {Component} from "react";
import {render} from "react-dom";
import {graphql} from "react-apollo";
import gql from "graphql-tag";
import Moolyaselect from "../../commons/components/MlAppSelectWrapper";
import ScrollArea from "react-scrollbar";
import {
  emailVerificationActionHandler,
  smsVerificationActionHandler
} from "../../../admin/transaction/requested/actions/updateRegistration";
import {initalizeFloatLabel} from "../../../commons/utils/formElemUtil";
import {fetchIdentityTypes} from "../actions/findRegistration";
import _ from "lodash";
import MlLoader from "../../../commons/components/loader/loader";
import moment from "moment";
import {fetchSubChapterDetails} from "../actions/findRegistration"
// import MlActionComponent from "../../../commons/components/actions/ActionComponent";
var Select = require('react-select');
// import {fetchIdentityTypes} from "../../../admin/transaction/requested/actions/findRegistration";
var options3 = [
  {value: 'Yes', label: 'Yes'},
  {value: 'No', label: 'No'}
];
var i = 1;

/**
 * This file will be in the view mode for the external user, have to remove all the handlers
 * */
export default class MlAppStep1ExternalUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      country: '',
      cluster: '',
      chapter: '',
      subChapter: '',
      selectedCity: '',
      registrationId: '',
      registrationDetails: '',
      subscription: '',
      registrationType: '',
      refered: '',
      institutionAssociation: '',
      coummunityName: '',
      identityType: '',
      userType: null,
      identityTypesData: [],
      selectedTypeOfIndustry: '',
      profession: null,
      defaultIdentityIndividual: false,
      defaultIdentityCompany: false,
      transactionId: '',
      selectedAccountsType: " "
    }

    this.fetchIdentityTypesMaster.bind(this);
    return this;
  }

  async fetchIdentityTypesMaster() {
    const response = await fetchIdentityTypes(this.props.config);
    this.setState({identityTypesData: response});
    return response;
  }

  componentWillMount() {
    this.fetchIdentityTypesMaster();

    let details = this.props.registrationInfo || {}
    this.setState({
      loading: false,
      registrationDetails: details,
      registrationId: details.registrationId,
      country: details.countryId,
      selectedCity: details.cityId,
      registrationType: details.registrationType,
      subscription: details.accountType,
      institutionAssociation: details.institutionAssociation,
      refered: details.referralType,
      cluster: details.clusterId,
      chapter: details.chapterId,
      subChapter: details.subChapterId,
      identityType: details.identityType,
      userType: details.userType,
      selectedTypeOfIndustry: details.industry,
      profession: details.profession,
      transactionId: this.props.registrationData.transactionId,
      selectedAccountsType: details.accountType
    });
  }

  componentDidMount() {
    var WinHeight = $(window).height();
    $('.step_form_wrap').height(WinHeight - (150 + $('.app_header').outerHeight(true)));
    initalizeFloatLabel();
    if (this.state.defaultIdentityIndividual == true) {
      $('#companyId').hide();

    }
    if (this.state.defaultIdentityCompany == true) {
      $('#individualId').hide();

    }
    this.fetchSubChapterDetails()

    //this.props.getRegistrationDetails(this.state)
  }

  optionsBySelectCountry(value) {
    this.setState({country: value})
  }

  optionsBySelectCluster(value) {
    this.setState({cluster: value})
  }

  optionsBySelectChapter(value) {
    this.setState({chapter: value})
  }

  optionsBySelectSubChapter(value) {
    this.setState({subChapter:value},function () {
      this.fetchSubChapterDetails()
    })
  }

  optionsBySelectCity(value) {
    this.setState({selectedCity: value})
  }

  optionBySelectRegistrationType(value, calback, selObject) {
    this.setState({registrationType: value});
    this.setState({identityType: null});
    this.setState({coummunityName: selObject.label})
  }

  optionBySelectSubscription(val) {
    this.setState({subscription: val.value})
  }

  optionBySelectRefered(val) {
    this.setState({refered: val.value})
  }

  optionBySelectinstitutionAssociation(val) {
    this.setState({institutionAssociation: val.value})
    return resp;
  }

  optionsBySelectTypeOfIndustry(value) {
    this.setState({selectedTypeOfIndustry: value})
  }

  optionsBySelectTypeOfAccounts(value) {
    this.setState({selectedAccountsType: value})
    console.log(value);
  }

  optionsBySelectProfession(val) {
    this.setState({profession: val})
  }

  checkIdentityIndividual(event) {
    this.setState({identityType: event.target.name});
    i++;
    if (event.target.name == "Individual") {
      $('#companyId').hide();
      this.setState({defaultIdentityIndividual: true, defaultIdentityCompany: false})

      if (i > 1) {
        i = 0;
        // this.setState({identityType: " "});
        $('#individualId').show();
        $('#companyId').show();
      }
    } else if (event.target.name == "Company") {
      this.setState({defaultIdentityCompany: true, defaultIdentityIndividual: false})
      $('#individualId').hide();
      if (i > 1) {
        i = 0;
        // this.setState({identityType: " "});
        $('#individualId').show();
        $('#companyId').show();
      }
    }
  }

  optionsBySelectUserType(value) {
    this.setState({userType: value})
  }
  async fetchSubChapterDetails(){
    let result = await fetchSubChapterDetails(this.state.subChapter)
    if(result && result.isDefaultSubChapter){
      this.setState({"isEcoSystem" : true})
    }else if(result && !result.isDefaultSubChapter){
      this.setState({"isEcoSystem" : false})
    }
  }

  async sendEmailVerification() {
    const response = await emailVerificationActionHandler(this.props.registrationId);
    if (response.success) {
      toastr.success("Email-Id verification link sent successfully");
    } else {
      // toastr.error(response.result);
    }
    return response;

  }


  async sendSmsVerification() {
    const response = await smsVerificationActionHandler(this.props.registrationId);
    if (response.success) {
      toastr.success("OTP verification code sent successfully");
    } else {
      // toastr.error(response.result);
    }
    return response;

  }

  isValidated(){
    return true
  }

  render() {

    let countryQuery = gql`query{
 data:fetchCountries {
    value:_id
    label:country
  }
}`
    let clusterQuery = gql`query{data:fetchClustersForMap{label:displayName,value:_id}}
    `;
    let chapterQuery = gql`query($id:String){  
  data:fetchChaptersWithoutAll(id:$id) {
    value:_id
    label:chapterName
  }  
}`;
    let subChapterQuery = gql`query($id:String,$displayAllOption:Boolean){  
      data:fetchSubChaptersSelect(id:$id,displayAllOption:$displayAllOption) {
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
      label:userTypeName
  }  }
    `;
    let industriesquery = gql` query{
    data:fetchIndustries{label:industryName,value:_id}
    }
    `;

    let accountsquery = gql `query{
    data: FetchAccount {label:accountName,value: _id}
}
`;
    let professionQuery = gql` query($industryId:String){
      data:fetchIndustryBasedProfession(industryId:$industryId) {
        label:professionName
        value:_id
      }
    }`;
    let professionQueryOptions = {options: {variables: {industryId: this.state.selectedTypeOfIndustry}}};
    let userTypeOption = {options: {variables: {communityCode: this.state.registrationType}}};
    let chapterOption = {options: {variables: {id: this.state.cluster}}};
    let subChapterOption = {options: {variables: {id: this.state.chapter, displayAllOption: false}}}
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
    let referedOption = [
      {value: '0', label: 'friends/collegues reference'},
      {value: '1', label: 'google/searching'},
      {value: '2', label: 'newspaper'},
      {value: '3', label: 'hoarding'},
      {value: '4', label: 'event'},
      {value: '5', label: 'radio'},
      {value: '6', label: 'i over heard it'},
    ]

    const showLoader = this.state.loading;
    let that = this;

    let identityTypez = _.filter(that.state.identityTypesData, function (i) {
        return _.indexOf(i.communities, that.state.registrationType) >= 0 ? true : false;
      }) || [];
    let canSelectIdentity = identityTypez && identityTypez.length > 0 ? true : false;
    let countryOption = {options: {variables: {countryId: this.state.country}}};
    let referedActive = '', institutionAssociationActive = ''
    if (this.state.refered) {
      referedActive = 'active'
    }
    if (this.state.institutionAssociation) {
      institutionAssociationActive = 'active'
    }
    return (

      <div>
        {showLoader === true ? (<MlLoader/>) : (
          <div className="step_form_wrap step1">

            <ScrollArea speed={0.8} className="step_form_wrap" smoothScrolling={true} default={true}>
            <div className="col-md-6">


                <div className="form_bg">
                  <form>
                    <div className="form-group">
                      <input type="text" ref="datetime" placeholder="Date & Time"
                             defaultValue={moment(that.state.registrationDetails && that.state.registrationDetails.registrationDate).format(Meteor.settings.public.dateFormat)}
                             className="form-control float-label"  disabled="true"/>
                    </div>
                    <div className="form-group">
                      <input type="text" placeholder="Request ID" defaultValue={that.state.registrationId}
                             className="form-control float-label"  disabled="true"/>
                    </div>
                    <div className="form-group mandatory">
                      <input type="text" ref="firstName" placeholder="First Name"
                             defaultValue={that.state.registrationDetails && that.state.registrationDetails.firstName}
                             className="form-control float-label" data-required={true}
                             data-errMsg="First Name is required" disabled="true"/>
                    </div>
                    <div className="form-group mandatory">
                      <input type="text" ref="lastName" placeholder="Last Name"
                             defaultValue={that.state.registrationDetails && that.state.registrationDetails.lastName}
                             className="form-control float-label"  data-required={true}
                             data-errMsg="Last Name is required" disabled="true"/>
                    </div>
                    <div className="form-group">
                      <Moolyaselect multiSelect={false} className="form-control float-label" valueKey={'value'}
                                    labelKey={'label'} placeholder="Your Country" selectedValue={this.state.country}
                                    queryType={"graphql"} query={countryQuery} isDynamic={true}
                                    onSelect={this.optionsBySelectCountry.bind(this)} disabled={true}/>
                    </div>
                    <div className="form-group mandatory">
                      <input type="text" ref="contactNumber"
                             defaultValue={that.state.registrationDetails && that.state.registrationDetails.contactNumber}
                             placeholder="Contact number" className="form-control float-label"
                             data-required={true} data-errMsg="Contact Number is required" disabled="true"/>
                    </div>
                    <div className="form-group mandatory">
                      <input type="text" ref="email"
                             defaultValue={that.state.registrationDetails && that.state.registrationDetails.email}
                             placeholder="Email Id" className="form-control float-label"  disabled="true"
                             data-required={true} data-errMsg="Email Id is required"/>
                    </div>
                    <div className="form-group">
                      <Moolyaselect multiSelect={false} placeholder="Registration Type"
                                    className="form-control float-label" valueKey={'value'} labelKey={'label'}
                                    selectedValue={this.state.registrationType} queryType={"graphql"}
                                    query={fetchcommunities} onSelect={that.optionBySelectRegistrationType.bind(this)}
                                    isDynamic={true} disabled={true}/>
                    </div>
                    {/*<div className="form-group">*/}
                    {/*<Moolyaselect multiSelect={false} placeholder="Headquarter Location" className="form-control float-label" valueKey={'value'} labelKey={'label'}  selectedValue={this.state.selectedCity} queryType={"graphql"} queryOptions={countryOption} query={citiesquery} onSelect={that.optionsBySelectCity.bind(this)} isDynamic={true}/>*/}
                    {/*</div>*/}
                    <div className="panel panel-default">
                      <div className="panel-heading">Operation Area</div>
                      <div className="panel-body">
                        <Moolyaselect multiSelect={false} placeholder="Select Cluster"
                                      className="form-control float-label" valueKey={'value'} labelKey={'label'}
                                      selectedValue={this.state.cluster} queryType={"graphql"} query={clusterQuery}
                                      isDynamic={true} onSelect={this.optionsBySelectCluster.bind(this)}
                                      disabled={true}/>
                        <Moolyaselect multiSelect={false} placeholder="Select Chapter"
                                      className="form-control float-label" valueKey={'value'} labelKey={'label'}
                                      selectedValue={this.state.chapter} queryType={"graphql"} query={chapterQuery}
                                      reExecuteQuery={true} queryOptions={chapterOption} isDynamic={true}
                                      onSelect={this.optionsBySelectChapter.bind(this)} disabled={true}/>
                        <Moolyaselect multiSelect={false} placeholder="Select Sub Chapter"
                                      className="form-control float-label" valueKey={'value'} labelKey={'label'}
                                      selectedValue={this.state.subChapter} queryType={"graphql"}
                                      query={subChapterQuery} reExecuteQuery={true} queryOptions={subChapterOption}
                                      isDynamic={true} onSelect={this.optionsBySelectSubChapter.bind(this)}
                                      disabled={true}/>
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
                            let checked = null, showRadioChecked = false
                            let identity = this.state.identityType
                            if (identity == "Individual" && i._id == 'individual') {
                              showRadioChecked = true
                              checked = true
                            } else if (identity == "Company" && i._id == 'company') {
                              showRadioChecked = true
                              checked = true
                            } else {
                              showRadioChecked = true
                              checked = false
                            }
                            return (
                              <div key={idx}>{showRadioChecked && <div>
                                <div id={`${i._id}Id`} className="input_types">

                                  <input type="checkbox" name={i.identityTypeName} value={i._id}
                                         onChange={that.checkIdentityIndividual.bind(that) }
                                         checked={checked} id={i._id}/><label
                                  htmlFor={i._id}><span><span></span></span>{i.identityTypeName}</label>
                                </div>
                              </div>}</div>)
                          })
                          }
                          <br className="brclear"/>
                        </div>
                        }
                        <div className="clearfix"></div>
                        <div className="form-group mart20">
                          <Moolyaselect multiSelect={false} placeholder="Select User Category"
                                        className="form-control float-label" valueKey={'value'} labelKey={'label'}
                                        selectedValue={this.state.userType} queryType={"graphql"} query={userTypequery}
                                        reExecuteQuery={true} queryOptions={userTypeOption}
                                        onSelect={that.optionsBySelectUserType.bind(this)} isDynamic={true}
                                        disabled={true}/>
                        </div>
                        <div className="form-group">
                          <Moolyaselect multiSelect={false} placeholder="Select Type Of Industry"
                                        className="form-control float-label" valueKey={'value'} labelKey={'label'}
                                        selectedValue={this.state.selectedTypeOfIndustry} queryType={"graphql"}
                                        query={industriesquery} onSelect={that.optionsBySelectTypeOfIndustry.bind(this)}
                                        isDynamic={true} disabled={true}/>
                        </div>
                        <div className="form-group">
                          <Moolyaselect multiSelect={false} placeholder="Select Profession"
                                        className="form-control float-label" valueKey={'value'} labelKey={'label'}
                                        selectedValue={this.state.profession} queryType={"graphql"}
                                        query={professionQuery} queryOptions={professionQueryOptions}
                                        onSelect={that.optionsBySelectProfession.bind(this)} isDynamic={true}
                                        disabled={true}/>

                        </div>

                        <div className="form-group">
                          <input type="text" placeholder="Source"
                                 defaultValue={that.state.registrationDetails && that.state.registrationDetails.source}
                                 className="form-control float-label"  disabled="true"/>
                        </div>
                        <div className="form-group">
                          <input type="text" placeholder="Device Name"
                                 defaultValue={that.state.registrationDetails && that.state.registrationDetails.deviceName}
                                 className="form-control float-label"  disabled="true"/>
                        </div>
                        <div className="form-group">
                          <input type="text" placeholder="Device Number"
                                 defaultValue={that.state.registrationDetails && that.state.registrationDetails.deviceNumber}
                                 className="form-control float-label"  disabled="true"/>
                        </div>
                        <div className="form-group">
                          <input type="text" placeholder="IP Address"
                                 defaultValue={that.state.registrationDetails && that.state.registrationDetails.ipAddress}
                                 className="form-control float-label"  disabled="true"/>
                        </div>
                        <div className="form-group">
                          <input type="text" placeholder="IP Location"
                                 defaultValue={that.state.registrationDetails && that.state.registrationDetails.ipLocation}
                                 className="form-control float-label"  disabled="true"/>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>

            </div>
            <div className="col-md-6">
                <div className="form_bg">
                  <form>
                    <div className="form-group">
                      <input type="text" placeholder="User Name" ref="userName"
                             defaultValue={that.state.registrationDetails && that.state.registrationDetails.userName}
                             className="form-control float-label"  disabled="true"/>
                    </div>
                    <div className="form-group">
                      <input type="Password" placeholder="Password" ref="password"
                        defaultValue={"passwordUnSeen"} className="form-control float-label" disabled="true" />
                    </div>
                    <div className="form-group">
                      {/*<span className="placeHolder active">Account Type</span>*/}
                      <Moolyaselect multiSelect={false} placeholder="Account Type" className="form-control float-label"
                                    valueKey={'value'} labelKey={'label'}
                                    selectedValue={this.state.selectedAccountsType} queryType={"graphql"}
                                    query={accountsquery} onSelect={that.optionsBySelectTypeOfAccounts.bind(this)}
                                    isDynamic={true} disabled={true}/>

                      {/*<Select name="form-field-name" placeholder="Account Type" value={this.state.subscription} options={subscriptionOptions} className="float-label" onChange={this.optionBySelectSubscription.bind(this)} />*/}
                    </div>
                    <div className="form-group">
                      {/*<span className={`placeHolder ${institutionAssociationActive}`}>Do You Want To Associate To Any Of The Sub Chapter</span>*/}
                      <span className='placeHolder active'>Do You Want To Associate With Any Of The Sub Chapters</span>
                      {that.state.isEcoSystem?<div><Select name="form-field-name"  placeholder="Do you want to associate to any of the Sub Chapter" value="No" options={options3} onChange={this.optionBySelectinstitutionAssociation.bind(this)} className="float-label" disabled={true}/></div>:<div><Select name="form-field-name"  placeholder="Do you want to associate to any of the Sub Chapter" value="Yes"  options={options3} onChange={this.optionBySelectinstitutionAssociation.bind(this)} className="float-label" disabled={true}/></div>}
                    </div>
                    <div className="form-group">
                      <input type="text" ref="companyName" placeholder="Company Name"
                             defaultValue={that.state.registrationDetails && that.state.registrationDetails.companyname}
                             className="form-control float-label"  disabled="true"/>
                    </div>
                    <div className="form-group">
                      <input type="text" ref="companyUrl" placeholder="Company URL"
                             defaultValue={that.state.registrationDetails && that.state.registrationDetails.companyUrl}
                             className="form-control float-label"  disabled="true"/>
                    </div>
                    <div className="form-group">
                      <input type="text" ref="remarks" placeholder="Remarks"
                             defaultValue={that.state.registrationDetails && that.state.registrationDetails.remarks}
                             className="form-control float-label"  disabled="true"/>
                    </div>
                    <div className="form-group">
                      <span className={`placeHolder ${referedActive}`}>How Did You Know About Us</span>
                      <Select name="form-field-name" ref="refered" placeholder="How Did You Know About Us"
                              value={this.state.refered} options={referedOption} className="float-label"
                              onChange={this.optionBySelectRefered.bind(this)} overflow="scroll" disabled={true}/>
                    </div>

                  </form>
                </div>

            </div>
            </ScrollArea>
            {/*<MlActionComponent ActionOptions={MlActionConfig} showAction='showAction' actionName="actionName"/>*/}
          </div>
        )}
      </div>
    )
  }
};
