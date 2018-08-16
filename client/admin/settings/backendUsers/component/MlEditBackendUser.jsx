import React from "react";
import {render} from "react-dom";
import ScrollArea from "react-scrollbar";
import {graphql} from "react-apollo";
import gql from "graphql-tag";
import formHandler from "../../../../commons/containers/MlFormHandler";
import MlActionComponent from "../../../../commons/components/actions/ActionComponent";
import Moolyaselect from "../../../commons/components/MlAdminSelectWrapper";
import MlAssignDepartmentComponent from "./MlAssignDepartmentComponent";
import MlContactFormComponent from "./MlContactFormComponent";
import {findBackendUserActionHandler} from "../actions/findBackendUserAction";
import {updateBackendUserActionHandler} from "../actions/updateBackendUserAction";
import {resetPasswordActionHandler} from "../actions/resetPasswordAction";
import {getAdminUserContext} from "../../../../commons/getAdminUserContext";
// import passwordSAS_validate from "../../../../../lib/common/validations/passwordSASValidator";
import {OnToggleSwitch, initalizeFloatLabel, passwordVisibilityHandler} from "../../../utils/formElemUtil";
import moment from "moment";
import {first, pick, isEmpty} from 'lodash'
import Datetime from "react-datetime";
let FontAwesome = require('react-fontawesome');
let Select = require('react-select');


class MlEditBackendUser extends React.Component{
  constructor(props){
    super(props);
    this.state={
      loading:true,
      data:{},
      //userProfiles:[{isDefault:null,clusterId:'',userRoles:[{roleId:'',clusterId:'',chapterId:'',validFrom:'',validTo:'',subChapterId:'',communityId:'',isActive:'',hierarchyLevel:'',hierarchyCode:''}]}],
      userProfiles:[],
      mlAssignDepartmentDetails:[],
      mlAssignContactDetails:[],
      password:'',
      confirmPassword:'',
      selectedBackendUserType:'',
      selectedBackendUser:'Internal User',
      clusterId:'',
      chapterId:'',
      communityId:'',
      subChapterId:'',
      roleId:'',
      isDefault:null,
      deActive:false,
      isActive:null,
      globalStatus:null,
      selectedSubChapter:'',
      showPasswordFields:false,
      pageLable:"Edit Backend User",
      foundationDate:" ",
      genderSelect:" ",
      dateOfBirth: null,
      genderStateMale: " ",
      genderStateFemale: " ",
      genderStateOthers: " ",
      profilePic:" "
    }
    this.addEventHandler.bind(this);
    this.updateBackendUser.bind(this);
    this.onBackendUserTypeSelect.bind(this);
    this.onBackendUserSelect.bind(this);
    this.onBirthDateSelection.bind(this);
    this.onGlobalStatusChanged = this.onGlobalStatusChanged.bind(this);
    this.onisActiveChanged= this.onisActiveChanged.bind(this);
    this.onMakeDefultChange=this.onMakeDefultChange.bind(this);
    this.genderSelect = this.genderSelect.bind(this);
    this.getGender.bind(this);
    return this;
  }

  componentDidUpdate(){
    OnToggleSwitch(true,true);
    passwordVisibilityHandler();

    //$('.main_wrap_scroll ').height(WinHeight-(68+$('.admin_header').outerHeight(true)));
    let url = window.location.href;
    if(url.indexOf("dashboard") != -1){
      $('input').attr('disabled', 'disabled');
    }
  }
  componentDidMount(){
    setTimeout(function(){
    initalizeFloatLabel();
    var WinHeight = $(window).height();
    $('.main_wrap_scroll').height(WinHeight-(90+$('.admin_header').outerHeight(true)));
    },1000);
  }

    genderSelect(e){
    this.setState({genderSelect: e.target.value})
      this.getGender();
  }

  onBirthDateSelection(event) {
    if (event._d) {
      let value = moment(event._d).format(Meteor.settings.public.dateFormat);
      this.setState({loading: false, dateOfBirth: value});
    }
  }

 //  async updateBackend(){
 //    let Details = {
 //      userId: ,
 //      gender:this.state.genderSelect,
 //      dateofbirth: this.state.dateofbirth
 //    }
 //    const response = await updateDataEntry(Details);
 //    return response;
 // }


  async addEventHandler() {
    const resp=await this.createBackendUser();
    return resp;
  }

  async handleError(response) {
    console.log("response error", response)
  };

  async handleSuccess(response) {
    if (response && response.success) {
      toastr.success(response.result);
      FlowRouter.go("/admin/settings/backendUserList");
    }
    else
      toastr.error(response.result);
  }

  componentWillMount() {
    let url = window.location.href;
    if(url.indexOf("dashboard") != -1){
      this.setState({pageLable:"Backend User Details"})
    }
    const resp=this.findBackendUser();
    return resp;
  }

  async getGender() {
    if(this.state.genderSelect === "others"){
      this.setState({genderStateMale: false, genderStateFemale: false, genderStateOthers:true})
    }
    else if(this.state.genderSelect === "female"){
      this.setState({genderStateFemale: true, genderStateMale: false, genderStateOthers:false})
    }
    else{
      this.setState({genderStateOthers: false, genderStateFemale: false, genderStateMale: true})
    }
  }


  // passwordValidation() {
  //   let password = this.refs.password.value;
  //   if (!password) {
  //     this.setState({"pwdValidationMsg": ''})
  //   } else {
  //     let validate = passwordSAS_validate(password)
  //     if (validate.isValid) {
  //       this.setState({"pwdValidationMsg": ''})
  //       // this.setState({passwordValidation: true})
  //     }
  //     else if (typeof (validate) == 'object') {
  //       this.setState({"pwdValidationMsg": validate.errorMsg})
  //     }
  //   }
  // }

  async  findBackendUser() {
    const loggedInUser = getAdminUserContext();
    let userTypeId = this.props.config;
    const response = await findBackendUserActionHandler(userTypeId);
    let userProfiles = (response && response.profile && response.profile.InternalUprofile && response.profile.InternalUprofile.moolyaProfile
                    && response.profile.InternalUprofile.moolyaProfile.userProfiles)?
      response.profile.InternalUprofile.moolyaProfile.userProfiles : [];

    let clusterId='';
    for(let i=0;i<userProfiles.length;i++){
      if(userProfiles[i].isDefault){
        clusterId = userProfiles[i].clusterId;
      }
    }

    this.setState({loading: false, data: response, clusterId: clusterId});

    if (response) {
      let dateOfBirth=response.profile.dateOfBirth;
      if(dateOfBirth&&dateOfBirth!= "Invalid Date"){
        dateOfBirth=moment(response.profile.dateOfBirth).format(Meteor.settings.public.dateFormat)
      }else{
        dateOfBirth = null
      }
      this.setState({
        loginUserDetails: loggedInUser,
        selectedBackendUserType: this.state.data.profile.InternalUprofile.moolyaProfile.userType,
        selectedSubChapter: this.state.data.profile.InternalUprofile.moolyaProfile.subChapter,
        selectedBackendUser: this.state.data.profile.InternalUprofile.moolyaProfile.roleType,
        deActive: this.state.data.profile.isActive,
        isActive: this.state.data.profile.InternalUprofile.moolyaProfile.isActive,
        globalStatus: this.state.data.profile.InternalUprofile.moolyaProfile.globalAssignment,
        genderSelect: response.profile.genderType, dateOfBirth: dateOfBirth, about: response.profile.about,
        profilePic: response.profile.profileImage
      })
      let dataDetails = this.state.data
      if (dataDetails["profile"]["InternalUprofile"]["moolyaProfile"]["userProfiles"][0]) {
        let userProfiles = dataDetails["profile"]["InternalUprofile"]["moolyaProfile"]["userProfiles"]
        let userProfilesDetails = []
          ;
        for (let i = 0; i < userProfiles.length; i++) {
          let userRolesDetails = []
          let userRole = userProfiles[i].userRoles
          for (let j = 0; j < userRole.length; j++) {
            let json = {
              roleId: userRole[j].roleId,
              roleName: userRole[j].roleName,
              clusterId: userRole[j].clusterId,
              chapterId: userRole[j].chapterId,
              validFrom: userRole[j].validFrom,
              validTo: userRole[j].validTo,
              subChapterId: userRole[j].subChapterId,
              isActive: userRole[j].isActive,
              hierarchyLevel: userRole[j].hierarchyLevel,
              hierarchyCode: userRole[j].hierarchyCode,
              departmentId: userRole[j].departmentId,
              departmentName: userRole[j].departmentName,
              subDepartmentId: userRole[j].subDepartmentId,
              subDepartmentName: userRole[j].subDepartmentName,
              chapterName: userRole[j].chapterName,
              subChapterName: userRole[j].subChapterName,
              communityName: userRole[j].communityName,
              communityId: userRole[j].communityId,
              communityCode : userRole[j].communityCode,
              communityHierarchyLevel : userRole[j].communityHierarchyLevel,
              isAnchor : userRole[j].isAnchor
            }
            userRolesDetails.push(json)
          }
          let json = {
            isDefault: userProfiles[i].isDefault,
            clusterId: userProfiles[i].clusterId,
            clusterName: userProfiles[i].clusterName,
            userRoles: userRolesDetails
          }
          userProfilesDetails.push(json)
        }
        this.setState({'userProfiles': userProfilesDetails});
      }
      this.getGender();
    }else {
      window.history.back()
      toastr.error('You are not authorised for this action. Please contact your admin, if required');
    }
  }

  onGlobalStatusChanged(e){
    if(e.currentTarget.checked){
      this.setState({"globalStatus":true})
    }else{
      this.setState({"globalStatus":false})
    }
  }

  onisActiveChanged(event){
    let dataDetails=this.state.data;
    if(event.currentTarget.checked){
      this.setState({"deActive":true})
    }else{
      this.setState({"deActive":false})
    }
  }

  onMakeDefultChange(id,event) {
    let that = this;
    let userProfilesDetails=this.state.userProfiles;
    let userRoles = userProfilesDetails[id].userRoles;
    let currentState = event.currentTarget.checked;
    let anyActiveRoles = false;
    if ( currentState ) {
      userProfilesDetails.map((cluster)=> {
        if(cluster.isDefault) {
          toastr.error("Only one default profile can be chosen");
          currentState = !currentState;
        }
        else {
          userRoles.map((roleInfo)=>{
            if(roleInfo.isActive) anyActiveRoles = true;
          })
        }
      })
      if( anyActiveRoles ) {
        userProfilesDetails[id]['isDefault'] = currentState;
        this.setState({userProfiles: userProfilesDetails})
      } else {
        toastr.error("'Make default' is not possible as none of the roles are active")
      }
    } else {
      userProfilesDetails.map((cluster)=> {
        if( cluster.isDefault ) {
          userProfilesDetails[id]['isDefault'] = currentState;
          this.setState({userProfiles: userProfilesDetails})
        } else {
          toastr.error("Please select atleast one default profile")
        }
      })
    }
  }

  async  updateBackendUser() {
    let dataDetails=this.state.data
    let userprofiles=[]
    if(dataDetails["profile"]["InternalUprofile"]["moolyaProfile"]["userProfiles"][0]){
      let userProfilesDetails=this.state.userProfiles;
      for(let i=0;i<userProfilesDetails.length;i++){
        let userRolesDetails=[]
        let userRole=userProfilesDetails[i].userRoles
        for(let j=0;j<userRole.length;j++){
          let json={
            roleId:userRole[j].roleId,
            clusterId:userRole[j].clusterId,
            chapterId:userRole[j].chapterId,
            validFrom:userRole[j].validFrom,
            validTo:userRole[j].validTo,
            subChapterId:userRole[j].subChapterId,
            isActive:userRole[j].isActive,
            hierarchyLevel:userRole[j].hierarchyLevel,
            hierarchyCode:userRole[j].hierarchyCode,
            roleName:userRole[j].roleName,
            departmentId:userRole[j].departmentId,
            departmentName:userRole[j].departmentName,
            subDepartmentId:userRole[j].subDepartmentId,
            subDepartmentName:userRole[j].subDepartmentName,
            communityId:userRole[j].communityId,
            communityCode : userRole[j].communityCode,
            communityHierarchyLevel : userRole[j].communityHierarchyLevel,
            isAnchor : userRole[j].isAnchor
          }
          userRolesDetails.push(json)
        }
        let json={
          isDefault:userProfilesDetails[i].isDefault,
          clusterId:userProfilesDetails[i].clusterId,
          userRoles:userRolesDetails
        }
        userprofiles.push(json)
      }
    }


    let moolyaProfile = {
      firstName: this.refs.firstName.value,
      middleName: this.refs.middleName.value,
      lastName: this.refs.lastName.value,
      userType: this.state.selectedBackendUserType,
      subChapter:this.state.selectedSubChapter,
      roleType:this.state.selectedBackendUser,
      assignedDepartment:this.state.mlAssignDepartmentDetails,
      displayName:this.refs.displayName.value,
      email:this.refs.email.value,
      contact:this.state.mlAssignContactDetails,
      globalAssignment:this.refs.globalAssignment.checked,
      isActive:true,
      userProfiles:userprofiles
    }
    let InternalUprofile={
      moolyaProfile: moolyaProfile
    }
    let profile={
      firstName: this.refs.firstName.value,
      middleName: this.refs.middleName.value,
      lastName: this.refs.lastName.value,
      isInternaluser: true,
      isExternaluser: false,
      email: this.refs.email.value,
      isMoolya: moolyaProfile.userType && moolyaProfile.userType == 'moolya' ? true : false,
      isActive:this.refs.deActive.checked,
      InternalUprofile: InternalUprofile,
      genderType:this.state.genderSelect,
      dateOfBirth: this.state.dateOfBirth,
      about: this.state.about,
      profileImage: this.state.profilePic
    }
    let userObject={
      username: moolyaProfile.email,
      // password:this.refs.password.value,
      profile:profile
    }

    let updateUserObject={
      userId:this.refs.id.value,
      userObject:userObject
    }
    var head = first(userprofiles) || {}
    let headRole = head.userRoles
    var headProfile = first(headRole)
    var updateDetails = pick(headProfile, ['clusterId', 'chapterId', 'subChapterId', 'communityId'])
    /**If user with no profile giving login user profile*/
    if (isEmpty(updateDetails)){
      updateDetails = this.state.loginUserDetails
    }
    const response = await updateBackendUserActionHandler(updateUserObject, updateDetails)
    return response;
  }

  async resetPassword() {
    /*if(this.state.showPasswordFields){
      let userDetails={
        userId:this.refs.id.value,
        password:this.refs.confirmPassword.value
      }
      this.onCheckPassword();
      if(this.state.pwdErrorMsg)
        toastr.error("Confirm Password does not match with Password");
      else{*/
        const response = await resetPasswordActionHandler(userDetails);
       /* this.refs.id.value='';
        this.refs.confirmPassword.value = '';
        this.refs.password.value = '';*/
        this.setState({"pwdErrorMsg":'Password reset complete'})
     /*   toastr.success(response.result);
      }
    } else {
      this.setState({
        showPasswordFields:true
      })
    }*/
  }

  async resetPassword(){
      let email = this.refs.email.value
      let data={email:email};
      var header={ apiKey: "741432fd-8c10-404b-b65c-a4c4e9928d32"};
      $.ajax({
        type: 'POST',
        dataType: 'json',
        url: Meteor.absoluteUrl('forgotPassword'),
        data :JSON.stringify(data),
        headers: header,
        contentType: "application/json; charset=utf-8",
        success:function(response){
          if(response.success){
            toastr.success(response.result)
          } else {
            toastr.error(response.result);
          }
        }
      });
  }

  getAssignedDepartments(departments){
    this.setState({'mlAssignDepartmentDetails':departments})
  }
  getAssignedContacts(contacts){
    this.setState({'mlAssignContactDetails':contacts})
  }

  onBackendUserTypeSelect(val){
    this.setState({selectedBackendUserType:val.value})
  }
  onBackendUserSelect(val){
    this.setState({selectedBackendUser:val.value})
  }
  optionsBySelectSubChapter(val){
    this.setState({selectedSubChapter:val})
  }
  onCheckPassword(){
    let password=this.refs.password.value;
    let confirmPassword=this.refs.confirmPassword.value;
    if(confirmPassword!=password){
      this.setState({"pwdErrorMsg":'Confirm Password does not match with Password'})
    }else{
      this.setState({"pwdErrorMsg":''})
    }
  }

  render(){
    var yesterday = Datetime.moment().subtract(0,'day');
    var valid = function( current ){
      return current.isBefore( yesterday );
    };
    let MlActionConfig = [
      {
        actionName: 'save',
        showAction: true,
        handler: async(event) => this.props.handler(this.updateBackendUser.bind(this), this.handleSuccess.bind(this), this.handleError.bind(this))
      },
      {
        showAction: true,
        actionName: 'cancel',
        handler: async(event) => {
          if(FlowRouter.getRouteName() == "settings_EditBackendUser") {
            FlowRouter.go("/admin/settings/backendUserList");
          } else if(FlowRouter.getRouteName() == "dashboard_backendUserDetails") {
            FlowRouter.go("/admin/dashboard/communities");
          }
        }
      }
    ];

    let UserTypeOptions = (this.state.loginUserDetails && this.state.loginUserDetails.isMoolya) ? [
      {value: 'moolya', label: 'EcoSystem', clearableValue: true},
      {value: 'non-moolya', label: 'SubChapter', clearableValue: true}
    ] : [{value: 'non-moolya', label: 'SubChapter', clearableValue: true}]

    let BackendUserOptions=[
      {value: 'Internal User', label: 'Internal User'},
      {value: 'External User', label: 'External User'}
    ];

    let query=gql` query{
  data:fetchCountriesSearch{label:country,value:countryCode}
}
`;
    let rolequery=gql` query{
    data:fetchActiveRoles{label:displayName,value:_id}
    }
`;
    let subChapterQuery=gql` query{
  data:fetchActiveSubChapters{label:subChapterName,value:_id}
}
`;
    let loggedInUser = getAdminUserContext();
    let dobDisabled = "";
    let genderDisabled = "";
    if(loggedInUser.hierarchyLevel < 4){
      dobDisabled = "disabled"
      genderDisabled = "disabled"
    }
    const showLoader=this.state.loading;
    let that=this;
    let Dob=that.state.dateOfBirth
    if(Dob&&Dob!="Invalid date"){
      Dob=moment(Dob).format('DD-MM-YYYY')
    }else{
      Dob=null
    }
    return (
      <div className="admin_main_wrap">
        {showLoader===true?( <div className="loader_container"><div className="loader_wrap"></div></div>):(

        <div className="admin_padding_wrap">
          <h2>{that.state.pageLable}</h2>
          <div className="main_wrap_scroll">
            <ScrollArea
              speed={0.8}
              className="main_wrap_scroll"
              smoothScrolling={true}
              default={true}
            >
          <div className="col-md-6 nopadding-left">

                <div className="form_bg">
                  <form>
                  <div className="form-group">
                    <input type="text" ref="id" defaultValue={that.state.data&&that.state.data._id} hidden="true"/>
                    <input type="text" ref="firstName" placeholder="First Name" defaultValue={that.state.data&&that.state.data.profile.InternalUprofile.moolyaProfile.firstName} className="form-control float-label" id=""/>
                  </div>
                  <div className="form-group">
                    <input type="text" ref="middleName" placeholder="Middle Name" defaultValue={that.state.data&&that.state.data.profile.InternalUprofile.moolyaProfile.middleName} className="form-control float-label" id=""/>
                  </div>
                  <div className="form-group">
                    <input type="text" ref="lastName" placeholder="Last Name" defaultValue={that.state.data&&that.state.data.profile.InternalUprofile.moolyaProfile.lastName} className="form-control float-label" id=""/>
                  </div>
                  <div className="form-group">
                    <Select name="form-field-name" placeholder="Backend User Type"   className="float-label"  options={UserTypeOptions}  value={that.state.selectedBackendUserType}  onChange={that.onBackendUserTypeSelect.bind(that)} disabled={true}
                    />
                  </div>
                    {that.state.selectedBackendUserType == 'non-moolya' && (
                      <Moolyaselect multiSelect={false} className="form-control float-label" valueKey={'value'}
                                    labelKey={'label'} placeholder="Select Subchapter"
                                    selectedValue={that.state.selectedSubChapter} queryType={"graphql"}
                                    query={subChapterQuery} isDynamic={true}
                                    onSelect={that.optionsBySelectSubChapter.bind(that)}
                                    disabled={true}/>
                    )}
                    <div className="form-group">
                      <Select name="form-field-name" placeholder="Select Role" className="float-label"
                              options={BackendUserOptions} value={that.state.selectedBackendUser}
                              onChange={that.onBackendUserSelect.bind(that)} disabled={true} />
                    </div>
               {/* {that.state.showPasswordFields ?
                  <div className="form-group">
                    <text style={{float:'right',color:'#ef1012',"fontSize":'12px',"marginTop":'-12px',"fontWeight":'bold'}}>{that.state.pwdValidationMsg}</text>
                    <input type="Password" ref="password" defaultValue={that.state.password} placeholder="Create Password"  onBlur={that.passwordValidation.bind(that)}  className="form-control float-label" id="password"/>
                    <FontAwesome name='eye-slash' className="password_icon Password hide_p"/>
                  </div> : <div></div>}
                {that.state.showPasswordFields ?
                  <div className="form-group">
                    <text style={{float:'right',color:'#ef1012',"fontSize":'12px',"marginTop":'-12px',"fontWeight":'bold'}}>{that.state.pwdErrorMsg}</text>
                    <input type="Password" ref="confirmPassword" defaultValue={that.state.confirmPassword} placeholder="Confirm Password" className="form-control float-label" onBlur={that.onCheckPassword.bind(that)} id="confirmPassword"/>
                    <FontAwesome name='eye-slash' className="password_icon ConfirmPassword hide_p"/>
                  </div> : <div></div>}*/}

                  <div className="form-group"> <a href="" className="mlUpload_btn" onClick={this.resetPassword.bind(this)}>Reset Password</a> <a href="#" className="mlUpload_btn">Send Notification</a> </div>

                  <MlAssignDepartmentComponent getAssignedDepartments={that.getAssignedDepartments.bind(that)} selectedBackendUserType={that.state.selectedBackendUserType} selectedSubChapter={that.state.selectedSubChapter} departments={that.state.data&&that.state.data.profile.InternalUprofile.moolyaProfile.assignedDepartment} />
                  </form>
                </div>
          </div>
          <div className="col-md-6 nopadding-right">


                  <div className="form_bg">
                  <form>
                  <div className="form-group">
                    <input type="text" ref="displayName" placeholder="Display Name" defaultValue={that.state.data&&that.state.data.profile.InternalUprofile.moolyaProfile.displayName} className="form-control float-label" id=""/>
                  </div>
                  <div className="form-group">
                    <input type="email" ref="email" placeholder="Email id" defaultValue={that.state.data&&that.state.data.profile.InternalUprofile.moolyaProfile.email} className="form-control float-label" id="" disabled="disabled"/>
                  </div>

                    <div className="form-group">
                      <Datetime dateFormat="DD-MM-YYYY" timeFormat={false}  inputProps={{placeholder: "Date Of Birth",readOnly:true}}   closeOnSelect={true} value={Dob} onChange={this.onBirthDateSelection.bind(this)} isValidDate={ valid } disabled={dobDisabled} />
                      {/*<input type="text" ref="dob"  placeholder="Date Of Birth" className="form-control float-label " defaultValue={Dob} disabled="disabled" />*/}
                      <FontAwesome name="calendar" className="password_icon"/>

                    </div>
                    <div className="form-group">
                      <div className="input_types">
                        <label>Gender : </label>
                      </div>
                      <div className="input_types">
                        <input id="radio1" type="radio" name="radio" value="male" onChange={this.genderSelect.bind(this)} checked={this.state.genderStateMale} disabled={genderDisabled} /><label htmlFor="radio1" ><span><span></span></span>Male</label>
                      </div>
                      <div className="input_types">
                          <input id="radio2" type="radio" name="radio" value="female" onChange={this.genderSelect.bind(this)} checked={this.state.genderStateFemale} disabled={genderDisabled} /><label htmlFor="radio2" ><span><span></span></span>Female</label>
                      </div>
                      <div className="input_types">
                        <input id="radio3" type="radio" name="radio" value="others" onChange={this.genderSelect.bind(this)} checked={this.state.genderStateOthers} disabled={genderDisabled} /><label htmlFor="radio3" ><span><span></span></span>Others</label>
                      </div>
                    </div>
                    <div className="clearfix"></div>
                  <MlContactFormComponent clusterId={that.state.clusterId} getAssignedContacts={that.getAssignedContacts.bind(that)} contacts={that.state.data && that.state.data.profile.InternalUprofile.moolyaProfile.contact}/>

                  <div className="form-group switch_wrap inline_switch">
                    <label>Global Assignment Availability</label>
                    {(that.state.selectedBackendUserType == 'non-moolya') ? <label className="switch">
                      <input type="checkbox" ref="globalAssignment" checked={that.state.globalStatus}
                             disabled="disabled"/>
                      <div className="slider"></div>
                    </label> : <label className="switch">
                      <input type="checkbox" ref="globalAssignment" checked={that.state.globalStatus}
                             onChange={that.onGlobalStatusChanged.bind(that)}/>
                      <div className="slider"></div>
                    </label>}

                  </div>
                  <br className="brclear"/>
                  <div className="form-group switch_wrap inline_switch">
                    <label>Status</label>
                    <label className="switch">
                      <input type="checkbox" ref="deActive" checked={that.state.deActive}  onChange={that.onisActiveChanged.bind(that)} />
                      <div className="slider"></div>
                    </label>
                  </div>
                  <br className="brclear"/>
                  {that.state.userProfiles.map(function (userProfiles, idx) {
                    return(
                    <div key={idx}>
                      {userProfiles.userRoles.map(function (userRoles, RId) {
                        return (
                          <div key={RId} className="panel panel-default">
                            <div className="panel-heading">Assigned Cluster Details</div>
                            <div className="panel-body">

                              <div className="form-group">
                                <input type="text" ref="cluster"  placeholder="Cluster" defaultValue={userProfiles.clusterName}  className="form-control float-label" id="" disabled="true"/>
                              </div>
                            <div className="form-group">
                              <input type="text" ref="chapter" defaultValue={(userRoles.chapterId=='all')?userRoles.chapterId:userRoles.chapterName} placeholder="Chapter"
                                     className="form-control float-label" id="" disabled="true"/>
                            </div>
                            <div className="form-group">
                              <input type="text" ref="Department" defaultValue={(userRoles.subChapterId=='all')?userRoles.subChapterId:userRoles.subChapterName}  placeholder="Sub Chapter" className="form-control float-label" id="" disabled="true"/>
                            </div>
                            <div className="form-group">
                              <input type="text" ref="subDepartment" defaultValue={(userRoles.communityCode=='all')?userRoles.communityCode:userRoles.communityName}  placeholder="Community" className="form-control float-label" id="" disabled="true"/>
                            </div>
                            <div className="form-group">
                              <input type="text" ref="role" defaultValue={userRoles.roleName}   placeholder="Role" className="form-control float-label" id="" disabled="true"/>
                            </div>
                              <div className="form-group">
                                <div className="input_types"><input  ref="isDefault" checked={userProfiles.isDefault} onChange={that.onMakeDefultChange.bind(that,idx)}  id="checkbox1" type="checkbox" name="isDefault" value="1" /><label htmlFor="checkbox1"><span></span>Make Default</label></div>
                              </div>
                            </div>
                          </div>

                        )
                      })
                      }
                    </div>

                    )
                  })
                  }
                  </form>
                  </div>
            </div>
            </ScrollArea>
          </div>

        <MlActionComponent ActionOptions={MlActionConfig} showAction='showAction' actionName="actionName"
        />
      </div>
        )}
      </div>

    )
  }
};
export default MlEditBackendUser = formHandler()(MlEditBackendUser);
