/**
 * Created by vishwadeep on 26/7/17.
 */
import React, {Component} from "react";
import ScrollArea from "react-scrollbar";
import MlLoader from "../../../commons/components/loader/loader";
import {initalizeFloatLabel} from "../../utils/formElemUtil";
import {findUserRegistrationActionHandler, findUserPortfolioActionHandler} from "../actions/findUsersHandlers";
import {deActivateUser, deActivateUserProfileByContextHandler, showOnMapActionHandler} from "../actions/updateUsersHandlers";
import {getAdminUserContext} from '../../../commons/getAdminUserContext'
import Moolyaselect from "../../commons/components/MlAdminSelectWrapper";
import gql from "graphql-tag";
import {pick} from 'lodash'
import generateAbsolutePath from '../../../../lib/mlGenerateAbsolutePath';

export default class MlUsersAbout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true, data: {}
    }
    this.findRegistration.bind(this)
    this.initializeSwiper.bind(this);
    return this;
  }

  componentWillMount() {
    this.loggedUserDetails = getAdminUserContext();
    const resp = this.findRegistration();
    return resp
  }

  async findRegistration() {
    let registrationId = this.props.config ? this.props.config.registrationId : '';
    const response = await findUserRegistrationActionHandler(registrationId);
    this.setState({loading: false, data: response});
  }

  handleSwiperClick(event, registrationId) {
    console.log(registrationId);
    const resp = this.changeUrl(registrationId)
    return resp
  }

  async changeUrl(registrationId) {
    const response = await findUserPortfolioActionHandler(registrationId);
    if (response && response.portfolioId) {
      toastr.success('Portfolio selected successfully')
      FlowRouter.setParams({registrationId: registrationId, portfolioId: response.portfolioId})
    } else {
      toastr.info('Portfolio not available')
    }
    return response
  }

  /**
   * handler to change the status of user's specific profile
   * @autosave
   * */
  async onStatusChange(e, userprofile) {
    console.log(e.currentTarget.checked)
    userprofile = pick(userprofile, ['profileId', 'clusterId', 'chapterId', 'subChapterId', 'communityId'])
    userprofile.isActive = e.currentTarget.checked
    const response = await deActivateUserProfileByContextHandler(userprofile)
    if (response && response.result && response.success)
      toastr.success(response.result)
    else if (response && response.result && !response.success)
      toastr.error(response.result)
  }

  /**
   * handler to change the status of overall user
   * @autosave
   * */
  async overUserStatus(e) {
    let status = e.currentTarget.checked
    status = status?false:true;
    let regInfo = this.state.data && this.state.data.registrationInfo ? this.state.data.registrationInfo : {}
    var userId = regInfo.userId
    const response = await deActivateUser(userId, status);
    if (response && response.success)
      toastr.success(response.result);
    else if (response && !response.success)
      toastr.error(response.result);
    return response
  }

  async overMapStatusChange(e) {
    var status = e.currentTarget.checked
    let regInfo = this.state.data && this.state.data.registrationInfo ? this.state.data.registrationInfo : {}
    var userId = regInfo.userId
    const response = await showOnMapActionHandler(userId, status)
    if (response && response.success)
      toastr.success(response.result);
    else if (response && !response.success)
      toastr.error(response.result);
    return response
  }
  componentDidMount() {
    initalizeFloatLabel();
    this.initializeSwiper();
  }

  initializeSwiper() {
    setTimeout(function () {
      var mySwiper = new Swiper('.blocks_in_form', {
        speed: 400,
        spaceBetween: 25,
        slidesPerView: 2,
        pagination: '.swiper-pagination',
        paginationClickable: true
      });
    }, 100)
  }

  componentDidUpdate() {
    initalizeFloatLabel();
    var WinHeight = $(window).height();
    $('.left_wrap').height(WinHeight - (90 + $('.admin_header').outerHeight(true)));
    this.initializeSwiper();
    let logedAdmin = this.loggedUserDetails
    if (logedAdmin.hierarchyLevel < 4) {
      $('#overAllStatus').attr('disabled', true)
    }
  }

  render() {
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
    let countryQuery = gql`query{
     data:fetchCountries {
        value:_id
        label:country
        code: countryCode
      }
    }`
    let userTypequery = gql` query($communityCode:String){  
    data:FetchUserType(communityCode:$communityCode) {
      value:_id
      label:userTypeName
  }  }
    `;
    let professionQuery = gql` query($industryId:String){
      data:fetchIndustryBasedProfession(industryId:$industryId) {
        label:professionName
        value:_id
      }
    }`;
    let citizenshipsquery = gql`query{
        data:FetchCitizenship {
          label:citizenshipTypeName
          value:_id
        
        }
        }
     `;
    let employementquery = gql`query($type:String,$hierarchyRefId:String){
     data: fetchMasterSettingsForPlatFormAdmin(type:$type,hierarchyRefId:$hierarchyRefId) {
     label
     value
     }
     }
     `;
    let titlequery=gql`query($type:String,$hierarchyRefId:String){
     data: fetchMasterSettingsForPlatFormAdmin(type:$type,hierarchyRefId:$hierarchyRefId) {
     label
     value
     }
     }
     `;
      let citiesquery = gql`query{
            data:fetchCities {label:name,value:_id
          }
      }`;

      let accountsquery=gql `query{
        data: FetchAccount {label:accountDisplayName,value: _id}
    }
    `;

    let that = this;
    let regInfo = this.state.data && this.state.data.registrationInfo ? this.state.data.registrationInfo : {}
    let regDetail = this.state.data && this.state.data.registrationDetails ? this.state.data.registrationDetails : {}
    let alsoRegisterAs = this.state.data && this.state.data.externalUserProfiles && this.state.data.externalUserProfiles.length > 0 ? this.state.data.externalUserProfiles : ['0']
    const showLoader = this.state.loading;
    let userTypeOption = {options: {variables: {communityCode: regInfo.registrationType}}};
    let professionQueryOptions = {options: {variables: {industryId: regInfo.industry}}};
    let employmentOption = {options: {variables: {type: "EMPLOYMENTTYPE", hierarchyRefId: regInfo.clusterId}}};
    let titleOption={options: { variables: {type : "TITLE",hierarchyRefId:regInfo.clusterId}}};
    let chapterOption = {options: {variables: {id: regInfo.clusterId}}};
    let genderImage = regDetail.gender==='female'?"/images/female.jpg":"/images/ideator_01.png";
    const {userProfileImage} = this.state.data;
    const profileImage = userProfileImage ? userProfileImage : regInfo.profileImage;
    return (
      <div className="admin_main_wrap">
        {showLoader === true ? ( <MlLoader/>) : (
          <div className="admin_padding_wrap">
            <h2>About</h2>
            <div className="col-md-6 nopadding-left">
              <div className="left_wrap">
                <ScrollArea
                  speed={0.8}
                  className="left_wrap"
                  smoothScrolling={true}
                  default={true}
                >
                  <div className="form_bg">
                    <form>

                      <div className="form-group">
                        <input type="text" placeholder="Moolya Id" name="moolyaId"
                               className="form-control float-label" defaultValue={regInfo.registrationId}
                               disabled="disabled"/>
                      </div>
                      <div className="form-group">
                        <Moolyaselect multiSelect={false} placeholder="Title" className="form-control float-label"
                                      valueKey={'value'} labelKey={'label'}  selectedValue={regDetail.title}
                                      queryType={"graphql"} query={titlequery}  queryOptions={titleOption}
                                      isDynamic={true} disabled={true}/>

                      </div>
                      {/*<div className="form-group">*/}
                        {/*<input type="text" placeholder="Title" name="Title"  defaultValue={regDetail.title}*/}
                               {/*className="form-control float-label" disabled="disabled"/>*/}
                      {/*</div>*/}

                      <div className="form-group">
                        <input type="text" placeholder="First Name" name="firstName" defaultValue={regInfo.firstName}
                               className="form-control float-label" disabled="disabled"/>
                      </div>

                      <div className="form-group">
                        <input type="text" placeholder="Last Name" name="lastName" defaultValue={regInfo.lastName}
                               className="form-control float-label"
                               disabled="disabled"/>
                      </div>

                      {/*<div className="form-group">*/}
                      {/*<input type="text" placeholder="Display Name" name="displayName"*/}
                      {/*className="form-control float-label"*/}
                      {/*disabled="disabled"/>*/}
                      {/*</div>*/}

                      <div className="form-group">
                        <input type="text" placeholder="Username" name="username" defaultValue={regInfo.userName}
                               className="form-control float-label"
                               disabled="disabled"/>
                      </div>

                      <div className="form-group">
                        <input type="password" placeholder="Password" name="password" defaultValue={"passwordUnSeen"}
                               className="form-control float-label"
                               disabled="disabled"/>
                      </div>
                      <div className="form-group">
                        <input type="text" placeholder="Date of Birth" name="dob" defaultValue={regDetail.dateOfBirth}
                               className="form-control float-label"
                               disabled="disabled"/>
                      </div>
                      <div className="form-group">
                        <input type="text" placeholder="Gender" name="gender" defaultValue={regDetail.gender}
                               className="form-control float-label"
                               disabled="disabled"/>
                      </div>


                      <div className="form-group">
                        {/*<input type="text" placeholder="Profession" defaultValue={regInfo.profession}*/}
                        {/*className="form-control float-label"*/}
                        {/*disabled="disabled"/>*/}
                        <Moolyaselect multiSelect={false} placeholder="Select Profession"
                                      className="form-control float-label" valueKey={'value'} labelKey={'label'}
                                      selectedValue={regInfo.profession} queryType={"graphql"} query={professionQuery}
                                      queryOptions={professionQueryOptions} isDynamic={true} disabled={true}/>
                      </div>
                      <div className="form-group">
                        {/*<input type="text" placeholder="Employer Status" defaultValue={regDetail.employmentStatus}*/}
                        {/*className="form-control float-label"*/}
                        {/*disabled="disabled"/>*/}
                        <Moolyaselect multiSelect={false} placeholder="Employment Status"
                                      className="form-control float-label" valueKey={'value'} labelKey={'label'}
                                      selectedValue={regDetail.employmentStatus} queryType={"graphql"}
                                      query={employementquery} queryOptions={employmentOption} isDynamic={true}
                                      disabled={true}/>
                      </div>
                      <div className="form-group">
                        <input type="text" placeholder="Employer Name" defaultValue={regDetail.employerName}
                               className="form-control float-label"
                               disabled="disabled"/>
                      </div>
                      <div className="form-group">
                        <input type="text" placeholder="Employer URL" defaultValue={regDetail.employerWebsite}
                               className="form-control float-label"
                               disabled="disabled"/>
                      </div>
                      <div className="form-group">
                        <input type="text" placeholder="Employment Date" defaultValue={regDetail.employmentDate}
                               className="form-control float-label"
                               disabled="disabled"/>
                      </div>
                      {/*<div className="form-group">*/}
                      {/*<input type="text" placeholder="Years of Experience" name="gender"*/}
                      {/*className="form-control float-label"*/}
                      {/*disabled="disabled"/>*/}
                      {/*</div>*/}
                      <div className="form-group">
                        <input type="text" placeholder="Profession Tag" defaultValue={regDetail.professionalTag}
                               className="form-control float-label"
                               disabled="disabled"/>
                      </div>
                      <div className="form-group">
                        <input type="text" placeholder="Identity" defaultValue={regInfo.identityType}
                               className="form-control float-label"
                               disabled="disabled"/>
                      </div>
                      <div className="form-group">
                        {/*<input type="text" placeholder="User Type" defaultValue={regInfo.userType}*/}
                        {/*className="form-control float-label"*/}
                        {/*disabled="disabled"/>*/}
                        <Moolyaselect multiSelect={false} placeholder="Select User Category"
                                      className="form-control float-label" valueKey={'value'} labelKey={'label'}
                                      selectedValue={regInfo.userType} queryType={"graphql"} query={userTypequery}
                                      reExecuteQuery={true} queryOptions={userTypeOption} isDynamic={true}
                                      disabled={true}/>
                      </div>
                      <br className="clearfix"/> <br className="clearfix"/> <br className="clearfix"/>
                    </form>
                  </div>
                </ScrollArea>
              </div>
            </div>

            <div className="col-md-6 nopadding-right">
              <div className="left_wrap">
                <ScrollArea
                  speed={0.8}
                  className="left_wrap"
                  smoothScrolling={true}
                  default={true}
                >
                  <div className="form_bg">
                    <form>

                      <div className="form-group steps_pic_upload">
                        <div className="previewImg ProfileImg">
                          <img src={profileImage ? generateAbsolutePath(profileImage) : genderImage}/>
                        </div>
                      </div>
                      <br className="brclear"/>

                      <div className="form-group">
                        {/*<input type="text" placeholder="Your Country" defaultValue={regInfo.countryId}*/}
                        {/*className="form-control float-label" disabled="disabled"/>*/}
                        <Moolyaselect multiSelect={false} className="form-control float-label" valueKey={'value'}
                                      labelKey={'label'} placeholder="Your Country" selectedValue={regInfo.countryId}
                                      queryType={"graphql"} query={countryQuery} isDynamic={true} disabled={true}/>
                      </div>

                      <Moolyaselect type="text" placeholder="Your City" className="form-control float-label"
                                    valueKey={'value'} labelKey={'label'} queryType={"graphql"} query={citiesquery}
                                    selectedValue={regInfo.cityId}
                                    isDynamic={true} disabled={true}/>

                      <div className="form-group">
                        <input type="text" placeholder="Email Id" defaultValue={regInfo.email}
                               className="form-control float-label"
                               disabled="disabled"/>
                      </div>

                      <div className="form-group">
                        <input type="text" placeholder="Phone Number" defaultValue={regInfo.contactNumber}
                               className="form-control float-label"
                               disabled="disabled"/>
                      </div>

                      <div className="form-group">
                      <Moolyaselect multiSelect={false} placeholder="Subscription Type" className="form-control float-label"
                                   valueKey={'value'} labelKey={'label'}  
                                  selectedValue={regInfo.accountType} queryType={"graphql"} 
                                  query={accountsquery} disabled={true} isDynamic={true}/>
                        {/* <input type="text" placeholder="Subscription Type" defaultValue={regInfo.accountType}
                               className="form-control float-label"
                               disabled="disabled"/> */}
                      </div>

                      <div className="form-group">
                        <input type="text" placeholder="Do you want to associate"
                               defaultValue={regInfo.institutionAssociation}
                               className="form-control float-label" disabled="disabled"/>
                      </div>

                      <div className="form-group">
                        {/*<input type="text" placeholder="Citizenship" defaultValue={regDetail.citizenships}*/}
                        {/*className="form-control float-label" disabled="disabled"/>*/}
                        <Moolyaselect multiSelect={true} placeholder="Select Citizenship"
                                      className="form-control float-label" valueKey={'value'} labelKey={'label'}
                                      selectedValue={regDetail.citizenships} queryType={"graphql"}
                                      query={citizenshipsquery} isDynamic={true} disabled={true}/>
                      </div>

                      <div className="form-group">
                        <input type="text" placeholder="Qualification" defaultValue={regDetail.qualification}
                               className="form-control float-label" disabled="disabled"/>
                      </div>

                      <div className="form-group">
                        <label>Operation Area</label>
                        <br className="brclear"/> <br className="brclear"/> <br className="brclear"/>
                        {/*<input type="text" placeholder="Cluster" defaultValue={regInfo.clusterId}*/}
                        {/*className="form-control float-label" disabled="disabled"/>*/}
                        <Moolyaselect multiSelect={false} placeholder="Select Cluster"
                                      className="form-control float-label" valueKey={'value'} labelKey={'label'}
                                      selectedValue={regInfo.clusterId} queryType={"graphql"} query={clusterQuery}
                                      isDynamic={true} disabled={true}/>
                      </div>

                      <div className="form-group">
                        {/*<input type="text" placeholder="Chapter" defaultValue={regInfo.chapterId}*/}
                        {/*className="form-control float-label" disabled="disabled"/>*/}
                        <Moolyaselect multiSelect={false} placeholder="Select Chapter"
                                      className="form-control float-label" valueKey={'value'} labelKey={'label'}
                                      selectedValue={regInfo.chapterId} queryType={"graphql"} query={chapterQuery}
                                      reExecuteQuery={true} queryOptions={chapterOption} isDynamic={true}
                                      disabled={true}/>
                      </div>

                      <div className="swiper-container blocks_in_form">
                        <label>Also Register As : </label>
                        <div className="swiper-wrapper">
                          {alsoRegisterAs.map(function (userProfile, id) {
                            return (
                              <div className="form_inner_block swiper-slide" key={id}>
                                <div onClick={(e) => that.handleSwiperClick(e, userProfile.registrationId)}>
                                  <div className="form-group">
                                    <input type="text" placeholder="Community" defaultValue={userProfile.communityName}
                                           className="form-control float-label" disabled="disabled"/>
                                  </div>
                                  <div className="form-group left_al">
                                    <input type="text" placeholder="Identity" defaultValue={userProfile.identityType}
                                           className="form-control float-label" disabled="disabled"/>
                                  </div>
                                  <div className="form-group right_al">
                                    <input type="text" placeholder="Type" className="form-control float-label"
                                           disabled="disabled"/>
                                  </div>
                                  <div className="form-group left_al">
                                    <input type="text" placeholder="Cluster" className="form-control float-label"
                                           defaultValue={userProfile.clusterName} disabled="disabled"/>
                                  </div>
                                  <div className="form-group right_al">
                                    <input type="text" placeholder="Chapter" className="form-control float-label"
                                           defaultValue={userProfile.chapterName} disabled="disabled"/>
                                  </div>
                                  <div className="form-group left_al">
                                    <input type="text" placeholder="Sub-Chapter" className="form-control float-label"
                                           defaultValue={userProfile.subChapterName} disabled="disabled"/>
                                  </div>
                                  <div className="form-group right_al">
                                  <Moolyaselect multiSelect={false} placeholder="Subscription Type" className="form-control float-label"
                                   valueKey={'value'} labelKey={'label'}  
                                  selectedValue={userProfile.accountType} queryType={"graphql"} 
                                  query={accountsquery} disabled={true} isDynamic={true}/>
                                    {/* <input type="text" placeholder="Subscription Type"
                                           className="form-control float-label"
                                           defaultValue={userProfile.accountType}
                                           disabled="disabled"/> */}
                                  </div>
                                </div>
                                <div className="form-group switch_wrap">
                                  <label>Status : </label>
                                  <label className="switch">
                                    <input type="checkbox" onChange={(e) => that.onStatusChange(e, userProfile)}
                                           defaultChecked={userProfile.isActive}/>
                                    <div className="slider"></div>
                                  </label>
                                </div>

                                <br className="brclear"/>
                              </div>
                            )
                          })}
                        </div>
                        <br className="brclear"/>
                        <div className="swiper-pagination"></div>
                      </div>
                      <div className="form-group switch_wrap inline_switch">
                        <label>Overall Deactivate User</label>
                        <label className="switch">
                          <input type="checkbox" id="overAllStatus" onChange={(e) => that.overUserStatus(e)}
                                 defaultChecked={this.state.data&& this.state.data.isActive ? false: true}/>
                          <div className="slider"></div>
                        </label>
                      </div>
                      <div className="form-group switch_wrap">
                        <label>Show On Map</label>
                        <label className="switch">
                          <input type="checkbox" onChange={(e) => that.overMapStatusChange(e)}
                                 defaultChecked={this.state.data && this.state.data.isShowOnMap ? this.state.data.isShowOnMap : false}/>
                          <div className="slider"></div>
                        </label>
                      </div>
                    </form>
                  </div>
                </ScrollArea>
              </div>
            </div>
          </div>)}
      </div>
    )
  }
}
