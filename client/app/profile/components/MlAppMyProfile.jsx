import React, {Component, PropTypes} from "react";
import ScrollArea from 'react-scrollbar'
var FontAwesome = require('react-fontawesome');
import {multipartASyncFormHandler} from '../../../../client/commons/MlMultipartFormAction'
import MlLoader from '../../../commons/components/loader/loader'
import passwordSAS_validate from '../../../../lib/common/validations/passwordSASValidator';
import {resetPasswordActionHandler} from "../../../admin/settings/backendUsers/actions/resetPasswordAction";
import {passwordVerification} from '../../../admin/profile/actions/addProfilePicAction'
import {updateDataEntry} from '../actions/updateProfile';
import {mlFieldValidations} from '../../../commons/validations/mlfieldValidation';
import {fetchUserDetails} from '../actions/findAddressBookAction'
import MlAppActionComponent from "../../commons/components/MlAppActionComponent";
import moment from "moment";
import Datetime from "react-datetime";
import formHandler from "../../../commons/containers/MlFormHandler";
import MlAccordion from "../../commons/components/MlAccordion";
import CropperModal from '../../../commons/components/cropperModal';
import {appClient} from '../../core/appConnection';
import {smsUserOtpHandler, verifyUserMobileNumberHandler, resendUserSmsOtpHandler} from '../../../commons/verificationActionHandler';
import _ from "lodash";
import generateAbsolutePath from '../../../../lib/mlGenerateAbsolutePath'
let Select = require('react-select');

class MlAppMyProfile extends Component {
  constructor(props) {
    super(props)
    this.state = {loading: true,
      data: {},
      password: '',
      confirmPassword: '',
      showPasswordFields: true,
      passwordState: " ",
      passwordValidation: false,
      PasswordReset:false,
      showChangePassword:true,
      showProfileModal: false,
      uploadingAvatar: false,
      getOTPClicked:false,
      mobileNumber : "",
      selectOptions : [
      { value: 'Never', label: 'Never' },
      { value: 'Once a day', label: 'Once a day' },
      { value: 'Alternate Days', label: 'Alternate Days' },
      { value: 'Once a Week', label: 'Once a Week' }
    ],
      frequency: "Once a day"
    };
    this.checkExistingPassword.bind(this);
    this.passwordCheck.bind(this);
    this.findUserDetails.bind(this);
    this.onfoundationDateSelection.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.handleUploadAvatar = this.handleUploadAvatar.bind(this);
    this.onImageFileUpload = this.onImageFileUpload.bind(this);
    this.verifyMobileNumber.bind(this);
    this.resendSmsOtp.bind(this);
    this.sendSmsOtp.bind(this);
  }
  componentDidMount() {
  setTimeout(function(){
  $('.float-label').jvFloat();
  },1000);
}
  componentDidUpdate() {
    /*$(function () {
      $('.float-label').jvFloat();
    });*/
    // this.initializeSwiper();
  }
  // componentDidUpdate(){
  genderSelect(){
    if (this.state.gender === "others") {
      this.setState({genderStateMale: false, genderStateFemale: false, genderStateOthers: "checked"})
    }
    else if (this.state.gender=== "female") {
      this.setState({genderStateFemale: "checked", genderStateMale: false, genderStateOthers: false})
    }
    else if( this.state.gender=== "male"){
      this.setState({genderStateOthers: false, genderStateFemale: false, genderStateMale: "checked"})
    }
  }
  componentWillMount(){
    const resp = this.findUserDetails();
    return resp
  }

  async findUserDetails() {
    const response = await fetchUserDetails();
    if (response) {
      if(response.profile && response.profile.externalUserProfiles && response.profile.externalUserProfiles.length>0){
        var externalProfile = _.find(response.profile.externalUserProfiles, {isDefault:true});
        if(!externalProfile){
          externalProfile = response.profile.externalUserProfiles[0]
        }
      }
      this.setState({
        loading: false,
        userDetails: response,
        firstName:response.profile.firstName,
        lastName:response.profile.lastName,
        username:response.profile.email,
        dateOfBirth:response.profile.dateOfBirth?moment(response.profile.dateOfBirth).format(Meteor.settings.public.dateFormat):"",
        profileImage:response.profile.profileImage,
        gender:response.profile.genderType,
        userId:response._id,
        mobileNumber:externalProfile&&externalProfile.mobileNumber?externalProfile.mobileNumber:"",
        frequency: response.profile.firebaseInfo?response.profile.firebaseInfo.frequency:"Once a day"
      });
      this.genderSelect()
    }else {
      this.setState({loading:false});
    }
  }


  async checkExistingPassword() {
    let pwd = this.refs.existingPassword.value;
    var digest = CryptoJS.SHA256(pwd).toString()
    console.log(digest);
    this.passwordCheck(digest);
  }

  async saveTaskDetails() {
    let Details = {
      profileImage: this.state.profileImage,
      firstName: this.state.firstName,
      middleName: this.state.middleName,
      lastName: this.state.lastName,
      // userName: this.state.username,
      genderType: this.state.gender,
      dateOfBirth: this.state.dateOfBirth?this.state.dateOfBirth : null,
      frequency: this.state.frequency
    }
    const dataresponse = await updateDataEntry(Details);
    console.log('--dataresponse--',dataresponse);
    if(dataresponse){
      toastr.success("Details updated successfully")
    }
  }

  async handleError(response) {
    console.log('error')
    console.log(response)
  };

  async handleSuccess(response) {
    console.log(response)
    if (response && response.success) {
      if (this.state.saveType == 'taskCreate')
        FlowRouter.setQueryParams({id: response.result})
      toastr.success("Saved successfully. Proceed to next step");
    } else if (response && !response.success) {
      toastr.error(response.result);
    }
  }

  async resetPassword() {
    let ret = mlFieldValidations(this.refs)
    if (ret) {
      toastr.error(ret);
    } else {
      if (this.state.showPasswordFields) {
        let userDetails = {
          userId:this.state.userId,
          password: this.refs.confirmPassword.value
        }
        if(this.state.passwordState === 'Passwords match!') {
          this.onCheckPassword();
          if (this.state.pwdErrorMsg)
            toastr.error("Confirm Password does not match with Password");
          else if(this.state.newpwdErrorMsg){
            toastr.error("Existing password and New Password should not match");
          }else if(this.state.pwdValidationMsg){
            return toastr.error("Password "+this.state.pwdValidationMsg);
          }
          else{
            const response = await resetPasswordActionHandler(userDetails);
            // this.refs.id.value='';
            this.refs.confirmPassword.value = '';
            this.refs.password.value = '';
            this.setState({"pwdErrorMsg": 'Password reset complete'})
            this.setState({"newpwdErrorMsg": 'Password reset complete'})
            toastr.success(response.result);
            $('#password').val("");
            this.setState({PasswordReset: false, showChangePassword: true})
          }
        }else {
          toastr.error("Enter correct Existing Password")
        }
      } else {
        this.setState({
          showPasswordFields: true
        })
      }
      const resp = this.onFileUpload();
      return resp;
    }
  }

  onfoundationDateSelection(event) {
    var ageDifMs = Date.now() - event._d.getTime();
    var ageDate = new Date(ageDifMs);
    if (event._d) {
      let value = moment(event._d).format(Meteor.settings.public.dateOnlyFormat);
      this.setState({loading: false, dateOfBirth: value});
    }
    if((Math.abs(ageDate.getUTCFullYear() - 1970)>=18)){
    }
    else{
      toastr.error("Age limit exceeded")
    }
  }

  openDatePickerDateOfBirth() {
    $('#date-of-birth').toggleClass('rdtOpen')
  }

  notificationHandler(event) {
    this.setState({
      frequency: event.value
    })
  }

  onCheckPassword() {
    let existingPassword = this.refs.existingPassword.value;
    let password = this.refs.password.value;
    let confirmPassword = this.refs.confirmPassword.value;
    if (confirmPassword != password) {
      this.setState({"pwdErrorMsg": 'Confirm Password does not match with Password'})
    } else{
      this.setState({"pwdErrorMsg": ''})
    }
    if(existingPassword===password||existingPassword===confirmPassword){
      this.setState({"newpwdErrorMsg": 'Existing password and New Password should not match'})
    }else{
      this.setState({"newpwdErrorMsg": ''})
    }
  }

  async passwordCheck(digest){
    const resp = await passwordVerification(digest)
    console.log(resp);
    if(resp.success){
      this.setState({passwordState: 'Passwords match!'})
      /**comment of one state*/// this.setState({passwordState: 'Passwords match!'})
    }else{
      this.setState({passwordState: 'Passwords do not match'})
    }
    return resp;
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

  async onImageFileUpload(file){
    // if(e.target.files[0].length ==  0)
    //   return;
    // let file = e.target.files[0];
    let user = {profile: {profileImage:" "}}
    if(file) {
      let data = {moduleName: "PROFILE", actionName: "UPDATE", userId:this.state.userId, user: user}
      let response = await multipartASyncFormHandler(data, file, 'registration', this.onFileUploadCallBack.bind(this));
      return response;
    }else{
      this.setState({
        uploadingAvatar: false,
      });
    }
  }

  onFileUploadCallBack(resp){
    this.setState({
      uploadingAvatar: false,
      showProfileModal: false
    });
    if(resp){
      let result = JSON.parse(resp)
      if(result.success){
        this.setState({profileImage : result.result})
        toastr.success("Photo updated successfully");
      }
    }
  }

  OnChangePassword(){
    this.setState({PasswordReset:true,showChangePassword:false})
  }
  cancelResetPassword(){
    $('#password').val("");
    this.setState({PasswordReset:false,showChangePassword:true})
  }
  toggleModal() {
    const that = this;
    this.setState({
      showProfileModal: !that.state.showProfileModal
    });
  }
  handleUploadAvatar(image) {
    this.setState({
      //uploadingAvatar: true,,
    });
    this.onImageFileUpload(image);
  }
  async resendSmsOtp(){
    this.setState({getOTPClicked:true});
    if(this.state.canResend){
      const resp = await resendUserSmsOtpHandler(appClient);
      if(resp.success){
        toastr.success("OTP sent successfully");
        this.setState({canResend:false})
        setTimeout(function(){
          this.setState({canResend:true})
        }.bind(this),30000)
      }else {
        toastr.error("OTP resend failed");
      }
      return resp
    }
  }

  async sendSmsOtp(){
    this.setState({getOTPClicked:true});
    setTimeout(function(){
      this.setState({canResend:true})
    }.bind(this),30000)
    let mobileNumber=this.state.mobileNumber;
    const response=await smsUserOtpHandler(appClient);
    if(response.success){
      toastr.success("OTP sent successfully");
    }
    return response;
  }

  async verifyMobileNumber(){
    let mobileNumber=this.state.mobileNumber;
    let isTermsChecked= this.refs.isTermsChecked.checked;
    this.setState({loading:true});
    let otp=this.refs.enteredOTP.value;
    let response = null;
    if(otp && isTermsChecked){
      response=await verifyUserMobileNumberHandler(mobileNumber,otp,appClient);
      let resp=null;
      if(response.success){
        resp = JSON.parse(response.result);
        this.setState({mobileNumberVerified:resp.mobileNumberVerified});
        toastr.success("Mobile number verified successfully");
        this.setState({getOTPClicked:false});
        this.findUserDetails();
      }else{
        toastr.error(response.result);
        this.setState({loading:false,mobileNumberVerified:false});
      }
    }else{
      if(!otp){
        toastr.error("Please enter the OTP as received in your sms");
      }
      if(!isTermsChecked){
        toastr.error("Please agree to 'Terms and Conditions' and 'Privacy Policy'");
      }
      this.setState({loading:false,mobileNumberVerified:false});
    }
    return response;
  }
  cancelOtpRequest(){
    this.setState({getOTPClicked:false});
  }

  showPassword(){
    // $("#showPasswordText").toggleClass('fa-eye-slash', 'fa-eye');
    var x = document.getElementById("password");
    if (x.type === "password") {
      x.type = "text";
      $("#showPasswordText").removeClass("fa-eye-slash").addClass("fa-eye")
    } else {
      x.type = "password";
      $("#showPasswordText").removeClass("fa-eye").addClass("fa-eye-slash")
    }
  }

  showConfirmPassword() {
    var x = document.getElementById("confirmPassword");
    if (x.type === "password") {
      $("#showConfirmPasswordText").removeClass("fa-eye-slash").addClass("fa-eye")
      x.type = "text";
    } else {
      x.type = "password";
      $("#showConfirmPasswordText").removeClass("fa-eye").addClass("fa-eye-slash")
    }
  }

  render(){
    const _this = this;
  const showLoader=this.state.loading;
  var yesterday = Datetime.moment().subtract(0,'day');
  var valid = function( current ){
    return current.isBefore( yesterday );
  };
  let appActionConfig = [
    {
      showAction: true,
      actionName: 'save',
      handler: async(event) => _this.props.handler(this.saveTaskDetails.bind(this), this.handleSuccess.bind(this), this.handleError.bind(this))
    },
    {
      showAction: true,
      actionName: 'cancel',
      handler: async(event) => {
        FlowRouter.go('/app/dashboard')
      }
    }
  ];
  export const genericPortfolioAccordionConfig = {
    id: 'portfolioAccordion',
    panelItems: [
      {
        'title': 'Actions',
        isText: false,
        style: {'background': '#ef4647'},
        contentComponent: <MlAppActionComponent
          resourceDetails={{resourceId: 'sacsdvdsv', resourceType: 'task'}}   //resource id need to be given
          actionOptions={appActionConfig}/>
      }]
  };
    let gImg = this.state.gender==='female'?"/images/female.jpg":"/images/def_profile.png";
    let genderImage = (!this.state.profileImage || this.state.profileImage==" ")?gImg:generateAbsolutePath(this.state.profileImage);

    let isMobileVerified = false;
    if(this.state.userDetails&&this.state.userDetails.mobileNumbers){
      obj = _.find(this.state.userDetails.mobileNumbers, {mobileNumber:this.state.mobileNumber, verified:true});
      if(obj)
        isMobileVerified = obj.verified;
    }

    return (
    <div className="admin_main_wrap">
      {showLoader === true ? (<MlLoader/>) : (
        <div className="admin_padding_wrap">
          <h2>My Profile Info</h2>
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
                    <div className="form-group mandatory">
                      <input type="text" id="first_name" placeholder="First Name" className="form-control float-label" readOnly="readOnly"
                             defaultValue={this.state.firstName}/>
                    </div>
                    {/*<div className="form-group">*/}
                      {/*<input type="text" placeholder="Middle Name" className="form-control float-label"*/}
                             {/*defaultValue={this.state.middleName}/>*/}
                    {/*</div>*/}
                    <div className="form-group mandatory">
                      <input type="text" placeholder="Last Name" className="form-control float-label" readOnly="readOnly"
                             defaultValue={this.state.lastName}/>
                    </div>

                    <div className="form-group mandatory">
                      <input type="text" placeholder="User Name / Registered Email Id" className="form-control float-label" readOnly="readOnly"
                             defaultValue={this.state.username}/>
                    </div>
                    <div className="form-group">
                      <div className="input_types">
                        <label>Gender : </label>
                      </div>
                      <div className="input_types">
                        <input id="radio1" type="radio" name="radio" value="male" checked={this.state.genderStateMale}/><label
                        htmlFor="radio1"><span><span></span></span>Male</label>
                      </div>
                      <div className="input_types">
                        <input id="radio2" type="radio" name="radio" value="female"
                               checked={this.state.genderStateFemale}/><label
                        htmlFor="radio2"><span><span></span></span>Female</label>
                      </div>
                      <div className="input_types">
                        <input id="radio3" type="radio" name="radio" value="others"
                               checked={this.state.genderStateOthers}/><label
                        htmlFor="radio3"><span><span></span></span>Others</label>
                      </div>
                    </div>
                    <br className="brclear" /><br/>
                    <div className="form-group mandatory">
                      <input type="text" placeholder="Mobile Number" className="form-control float-label" readOnly="readOnly"
                             defaultValue={this.state.mobileNumber}/>

                      {isMobileVerified?

                        <div className="email_notify">
                          <div className="input_types">
                            <input ref="isEmailNotified" type="checkbox" name="checkbox" checked={true}/>
                            <label htmlFor="checkbox1"><span> </span>Verified</label>
                          </div>
                        </div>
                        :<div></div>}

                    </div>
                    {
                      isMobileVerified||(this.state.mobileNumber=="")?<div></div>:
                        <div className="form-group">
                          <a href="" className="mlUpload_btn" onClick={this.sendSmsOtp.bind(this)}>Verify Now</a>
                        </div>
                    }
                    {
                      this.state.getOTPClicked?
                        <div>
                          <div className="form-group">
                            <input type="text" placeholder="Enter OTP" ref="enteredOTP" className="form-control float-label" />
                          </div>
                          <div className="terms">
                            <label><input type="checkbox" ref="isTermsChecked"/>&nbsp; I have read and agree to the <a data-toggle="modal" data-target=".termsConditionsPop">Terms and Conditions</a> and <a data-toggle="modal" data-target=".privacyPop"> 'Privacy Policy'</a></label>
                          </div>
                          <div className="ml_btn">
                            <a href="" className="cancel_btn" onClick={this.verifyMobileNumber.bind(this)}>Validate</a>
                            <a href="" className="cancel_btn" onClick={this.resendSmsOtp.bind(this)}>Resend OTP</a>
                            <a href="" className="save_btn" onClick={this.cancelOtpRequest.bind(this)}>Cancel</a>
                          </div>
                        </div>
                        :
                        <div></div>
                    }

                  </form>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form_bg">
                  <form>

                    <div className="form-group">
                      <div className="fileUpload mlUpload_btn">

                        <span onClick={this.toggleModal.bind(this)}>Profile Pic</span>
                        {/*<input type="file" className="upload" id="profilePic" name="profileImage" accept="image/*" onChange={this.onImageFileUpload.bind(this)}/>*/}
                      </div>
                      <div className="previewImg ProfileImg">
                        <img src={genderImage}/>
                      </div>
                    </div>
                    <br className="brclear"/>
                    {/*<div className="form-group">*/}
                      {/*<input type="text" ref="dob" placeholder="Date Of Birth" className="form-control float-label"*/}
                             {/*defaultValue={this.state.dateOfBirth}/>*/}
                      {/*<FontAwesome name='calendar' className="password_icon"/>*/}

                    {/*</div>*/}

                    <div className="form-group mandatory" id="date-of-birth">
                      <input placeholder="Date of Birth" type="text" value={this.state.dateOfBirth?moment(this.state.dateOfBirth, "DD-MMM-YYYY").format(Meteor.settings.public.dateOnlyFormat): ""} className="form-control float-label" readOnly="true" disabled="disabled" />
                      <FontAwesome name="calendar" placeholder="Date of Birth" className="password_icon" readOnly="true" onClick={this.openDatePickerDateOfBirth.bind(this)}/>
                    </div>

                    {/* <div className="form-group mandatory" id="notification-frequency">
                    <Select
                      name="form-field-name"
                      value={this.state.frequency}
                      options={this.state.selectOptions}
                      onChange={this.notificationHandler.bind(this)}
                    />
                    </div> */}

                    {this.state.showChangePassword?(<div className="form-group"> <a href="" className="mlUpload_btn" onClick={this.OnChangePassword.bind(this)}>Change Password</a></div>):""}
                    {this.state.PasswordReset?(
                      <div>
                        {this.state.showPasswordFields ?
                          <div className="form-group mandatory">
                            <text style={{float:'right',color:'#ef1012',"fontSize":'12px',"marginTop":'-12px',"fontWeight":'bold'}}>{this.state.passwordState}</text>
                            <input type="Password" ref="existingPassword"  placeholder="Existing Password" className="form-control float-label" onBlur={this.checkExistingPassword.bind(this)}id="password" data-required={true} data-errMsg="Existing password is required"/>

                          </div> : <div></div>}
                      <div className="form-group mandatory">
                        <text style={{float:'right',color:'#ef1012',"fontSize":'12px',"marginTop":'-12px',"fontWeight":'bold'}}>{this.state.pwdValidationMsg}</text>
                        <input type="Password" ref="password" defaultValue={this.state.password} onBlur={this.passwordValidation.bind(this)} placeholder="New Password" className="form-control float-label" id="password" data-required={true} data-errMsg="New Password is required"/>
                        <FontAwesome name='eye-slash' id="showPasswordText" className="input_icon" onClick={this.showPassword.bind(this)}/>
                      </div>
                      <div className="form-group mandatory">
                        <text style={{float:'right',color:'#ef1012',"fontSize":'12px',"marginTop":'-12px',"fontWeight":'bold'}}>{this.state.pwdErrorMsg}</text>
                        <input type="Password" ref="confirmPassword" defaultValue={this.state.confirmPassword} placeholder="Confirm New Password" className="form-control float-label" onBlur={this.onCheckPassword.bind(this)} id="confirmPassword" data-errMsg="Confirm Password is required"/>
                        <FontAwesome name='eye-slash' id="showConfirmPasswordText" className="input_icon" onClick={this.showConfirmPassword.bind(this)}/>
                      </div>
                        <div className="form-group"> <a href="" className="mlUpload_btn" onClick={this.resetPassword.bind(this)}>Save</a> <a href="" className="mlUpload_btn" onClick={this.cancelResetPassword.bind(this)}>Cancel</a> </div></div>):""}
                  </form>
                </div>
              </div>
              <CropperModal
                uploadingImage={this.state.uploadingAvatar}
                handleImageUpload={this.handleUploadAvatar}
                cropperStyle="square"
                show={this.state.showProfileModal}
                toggleShow={this.toggleModal}
              />
            </ScrollArea>
          </div>
          <MlAccordion accordionOptions={genericPortfolioAccordionConfig} {...this.props} />
        </div>)}
      <div className="modal fade bs-example-modal-sm library-popup termsConditionsPop"
           onContextMenu={(e) => e.preventDefault()} tabIndex="-1" role="dialog"
           aria-labelledby="mySmallModalLabel">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              Terms & Conditions
              <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span
                aria-hidden="true">&times;</span></button>
            </div>
            <div className="modal-body">

              <div className="blank_content" style={{'height':'400px','overflow':'auto','padding':'0px 5px'}}>
                <h5>Introduction</h5>


                <p>


                  These Standard Terms and Conditions (hereinafter referred to as “Terms and Conditions”) written on
                  this webpage shall manage your (hereinafter referred to as “the User” or “you” or your”) use of this
                  website and the related mobility applications (hereby jointly called as ‘Website’ for the entire
                  course of the document). These Terms and Conditions will be applied fully and affect your use of this
                  Website.</p>

                <p>


                  By using this Website, you agree to abide by all terms and conditions written in here as well as the
                  ones which are updated from time to time. You MUST NOT use this Website if you disagree with any of
                  these Website Terms and Conditions. The Website is owned and operated by moolya Business Services
                  Private Limited, Hyderabad, India (hereinafter referred to as “moolya” or “we” or “our” or “us”). This
                  document is an electronic record generated by a computer system and does not require any physical or
                  digital signatures.</p>

                <p>


                  This ‘Terms and Conditions’ document also includes the ‘Disclaimer’ document. Please read and accept
                  the points completely, before you proceed further.</p>


                <h5>Eligibility</h5>


                <p>


                  User Registrations and Transactions on the application are allowed for persons who have attained the
                  age of majority as per the laws of the country to which they are subject to. The age for being a major
                  may vary from country/state to country/state. The User represents and warrants that he/she is fully
                  able and competent to enter into a contract and understands and agrees to the terms, conditions,
                  obligations, affirmations, representations, and warranties set forth in these Terms and Conditions.
                  Your use of the Website shall be treated as your representation of being competent to enter a
                  contract.

                  The User is responsible for complying with all laws and regulations while accessing and using the
                  Website. The User agrees to use the Website only in compliance with these Terms and Conditions in a
                  manner that does not violate moolya’s legal rights or those of any third party(ies).


                </p>

                <h5>Amendments</h5>


                <p>


                  Amendments to this agreement can be made and effected by us from time to time at our sole discretion
                  without specific notice to your end. Updates to the ‘Terms and Conditions’ may be updated, added or
                  modified from time to time and this reflects the latest agreement and all users should carefully
                  review and agree to them, before you register with the Website and/or continue using the Website. The
                  User is responsible for reviewing the Website from time to time and your continued use of the Website
                  after such changes signifies your acceptance of such changes.


                </p>


                <h5>Intellectual Property Rights </h5>


                <p>


                  Other than the content you own, under these Terms, moolya) and/or its partners and/or affiliates are
                  entitled to use the intellectual property rights and materials posted on this Website. Users are
                  requested not to post or upload any content or information which you would not want to be shared with
                  the rest of the users at any point of time. You are being granted time-bound usage rights to the
                  services, based on your selected subscription or category of your registration. Such rights are meant
                  only for the purposes of viewing the material and information on the Website and for engaging with the
                  users on this Website. All Users are bound to strictly adhere to the prescribed terms and conditions
                  at all times. </p>


                <p>


                  moolya owns the copyright and proprietary right in all text, graphics, user interfaces, visual
                  interfaces, photographs, trademarks, logos, sounds, music, artwork and computer code (hereinafter
                  collectively referred to as “Material”), including but not limited to the design, structure,
                  selection, coordination, expression, “look and feel” and arrangement of such Material, contained on
                  the Website. The Material should not be copied, reproduced, republished, uploaded, posted,
                  transmitted, distributed, or used for the creation of derivative works except that moolya hereby
                  grants you a non-exclusive, non-transferable, limited permission to access the Website during the
                  validity of your subscription. </p>


                <p>


                  Access or use to the Website does not confer and shall not be considered as conferring upon anyone any
                  license to moolya’s or any third party's Intellectual Property Rights. </p>


                <p>


                  You shall have no rights to use, receive or copy any source code and look and feel of the Website and
                  shall not reverse engineer, disassemble or decompile, or otherwise attempt to derive source code for
                  the Website for any purpose. </p>


                <h5>Specific Restrictions: </h5>


                <p>

                  The User agrees and acknowledges that he/she is prohibited from carrying out the following activities


                </p>


                <ul>


                  <li>publishing any Website or application material in any other media;</li>


                  <li>selling, sublicensing and/or otherwise commercializing any Website material;</li>


                  <li>publicly performing and/or showing any Website material;</li>


                  <li>using this Website in any way that is or may be damaging to this Website or detrimental to the
                    best interst of moolya;
                  </li>


                  <li>using this Website in any way that impacts user access to this Website;</li>


                  <li>using this Website contrary to applicable laws and regulations, or in any way may cause harm to
                    the Website, or to any person or business entity;
                  </li>


                  <li>engaging in any data mining, data harvesting, data extracting or any other similar activity in
                    relation to this Website;
                  </li>


                  <li>using this Website to engage in any advertising or marketing.</li>


                  <li>using the Website after the validity of the subscription has expired.</li>


                </ul>


                <p>Certain areas of this Website are restricted from being accessed by you. ‘moolya Business Services
                  Private Limited, Hyderabad, India’ may further restrict access to you to any areas or sections of this
                  Website, at any time, at its own absolute discretion. Any user ID and/or password you may have for
                  this Website are confidential and you must always maintain confidentiality.</p>


                <h5>Registration to Use the Website </h5>


                <p>You shall be entitled to use the Website by registering as a User on the Website after furnishing all
                  relevant information as sought on the Website in the following respective categories:</p>


                <ul>


                  <li>Investors</li>

                  <li>Startups and their Founders</li>

                  <li>Service Providers</li>

                  <li>Students</li>

                  <li>Institutions and Colleges</li>


                </ul>


                <p>If you choose to register on the Website, and provide your registration data in the respective
                  category, you shall be solely responsible for maintaining the confidentiality of your user id and
                  password.

                  You shall also be responsible for all activities that occur under your User ID and Password. Further,
                  you agree, inter alia, to: </p>


                <ul>


                  <li>Provide true, accurate, current and complete information about yourself as prompted by the
                    Website’s registration form while registering (such information being the "Registration Data");
                  </li>

                  <li>Maintain and promptly update the Registration Data to keep it true, accurate, current and complete
                    at all times;
                  </li>

                  <li>You must immediately notify moolya of any unauthorized use of your password or account or any
                    other breach of security; and
                  </li>

                  <li>ensure that you exit from your account at the end of each session</li>


                </ul>

                <p>


                  As a part of the registration process, moolya may require you to provide the following Personally
                  Identifiable Information about you including without limitation:</p>


                <ul>


                  <li>Name</li>

                  <li>Address</li>

                  <li>E-mail address</li>

                  <li>Mobile number</li>

                  <li>KYC Documents including but not limited to ID proof, address proof, company proof</li>

                  <li>Intended category of registration</li>

                  <li>Service card/information indicating your requirements/services being offered by you and the
                    applicable fees
                  </li>


                </ul>


                <p>


                  During the course of use of the Website, moolya may also require you to give other information
                  including but not limited to transactions with other users online, collaboration with others on the
                  Website, payments made by one user to another user through moolya.</p>


                <p>Such information collected shall be subject to the Privacy Policy.

                  Each User may register once only and create only one user profile. Each User may create several
                  company profiles. </p>


                <p>You shall be solely responsible for the accuracy and correctness of all such details/information
                  given by you during registration on and use of the Website. If moolya has reason to doubt the
                  correctness of any details/information furnished by you or in case any information furnished by you is
                  found incorrect, false or misleading or otherwise not in accordance with these Terms and Conditions,
                  then moolya shall be entitled to cancel or indefinitely suspend or block access to the Website and
                  refuse to provide access permanently or for such period as moolya deems fit.</p>


                <p>You agree that moolya cannot technically determine whether a registered User of moolya de factor
                  represents the person/company that person/company purports to be, and therefore, moolya shall not
                  assume any liability whatsoever for the actual identity of a user. You are solely responsible for
                  personally verifying the authenticity of other Users.

                  moolya shall not be liable for any loss or damage arising from your failure to comply with this
                  Clause. moolya disclaims any liability for any unauthorized hacking of the Website leading to leakage
                  or any misuse of your PII.</p>


                <h5>Your Content</h5>


                <p>


                  In these Terms and Conditions, “Your Content” shall mean any audio, video text, images or other
                  material including your service card, your requirements etc. you choose to display on this Website or
                  the related applications. By displaying Your Content, you grant ‘moolya’, a non-exclusive, worldwide
                  irrevocable, sub licensable license to use, reproduce, adapt, publish, translate and distribute it in
                  any and all media.</p>


                <p>


                  In order for us to provide services to you, we require that you grant us certain rights with respect
                  to your Content. For example, we need to be able to transmit, store and copy your Content in order to
                  display it to you, to make backups to prevent data loss, and so on. Your acceptance of this Terms and
                  Conditions gives us the permission to do so and grants us any such rights necessary to provide the
                  service to you, only for the purpose of providing the service (and for no other purpose). This
                  permission includes allowing us to use third-party service providers (for example Amazon Web Services)
                  in the operation and administration of the Website and the rights granted to us are extended to these
                  third parties to the degree necessary in order for the Website to be provided. Depending on the
                  service, this may involve moving your data across jurisdictional lines, or across country borders.
                  Your Content must be your own and must not be invading or infringing any third-party’s rights at any
                  time. In the event that any claim is brought against moolya by any such third party, then you shall
                  indemnify moolya and its affiliates, offices and businesses, from and against any and/or all
                  liabilities, costs, demands, causes of action, damages and expenses arising from such claim of third
                  party, including reasonable attorney fees.</p>


                <p>moolya reserves the right to remove any of Your Content from this Website at any time without
                  notice.</p>


                <h5>Use of the Website:</h5>


                <p>moolya grants you the right to use the Website through various operating systems including but not
                  limited to Android, Apple iOS, and Microsoft Windows, and as permitted by the terms of services of the
                  respective operating systems.</p>


                <p>moolya will make commercially reasonable efforts to ensure that all facilities used to store and
                  process Your Content meet a high standard for security.</p>


                <h5>Services on moolya:</h5>


                <p>You agree that if services are discovered by Users on moolya, then moolya reserves the right to
                  facilitate such provision of services through moolya.</p>


                <p>Users who are providing services (hereinafter referred to as “Service Providers”) to other Users on
                  moolya shall charge to service seekers such fees which are charged by them in the ordinary course of
                  their respective businesses as per applicable industry standard.</p>


                <p>moolya reserves the right to contact Service Providers on the basis of information, contact details,
                  business cards which are provided by them on moolya.</p>


                <p>You agree and acknowledge that moolya is a self-discovery platform for Users to find and/or seek
                  services, and that moolya is not responsible for the quality, validity, accuracy, completeness or
                  correctness of services and data exchanged on moolya. Under no circumstances will moolya be
                  responsible for any loss or damage resulting from any User’s reliance on any services provided by
                  Service Providers on moolya. moolya does not control, determine or advice or in any way is involved in
                  offering or acceptance of contractual terms between the Users. All contractual terms are offered by
                  you and agreed upon between you and other Users alone. Contractual Terms means and includes, not
                  limited to, price, shipping costs, warranties and services. moolya does not guarantee fulfilment of
                  contractual obligations by between Users. The onus of independently verifying the particulars of any
                  particular User is not on moolya.</p>


                <p>Any dispute which may arise between Users with respect to the services facilitated by them on moolya
                  shall be mutually discussed and resolved between the Users, without the involvement of moolya. </p>


                <p>You shall release and indemnify moolya and or any of its officers and representatives from any cost,
                  damage, liability or any other consequence arising from contract between you and other Users or
                  Service providers.</p>


                <h5>Claims against Objectionable Content:</h5>


                <p>If you believe that any content on the website is illegal, offensive, abusive, indecent, harassing,
                  blasphemous, or is otherwise injurious to third parties; or impersonates another person; or
                  objectionable or otherwise unlawful in any manner whatsoever; or infringes your or any third-party
                  rights or which consists of or contains software viruses, ("Objectionable Content"), please notify us
                  immediately using the contact details at our contact page.</p>


                <p>moolya will take whatever action, in its sole discretion, it deems appropriate, including removal of
                  such Objectionable Content from the website.</p>


                <h5>Disclaimer of warranties:</h5>


                <p>


                  You acknowledge and agree that this Website is provided “as is” and “as available”, and moolya
                  expresses no representations or warranties, of any kind related to this Website or the materials
                  contained on this Website. You acknowledge and agree that the use of the Website shall be at your sole
                  risk to the fullest extent permitted by applicable law. moolya, its affiliates and their respective
                  officers, directors, employees, agents, affiliates, branches, subsidiaries, and licensors disclaim all
                  warranties, express or implied, in connection with the Website to the fullest extent permitted by
                  applicable law. Also, nothing contained on this Website shall be interpreted as advising you or any of
                  your related contacts at any point of time. All actions conducted by you on the website shall be
                  deemed as being carried out solely by you under your own wise discretion. moolya make no warranties or
                  representations that the Website has been and will be provided with due skill, care and diligence or
                  about the accuracy or completeness of the content and assume no responsibility for any (I) errors,
                  mistakes, or inaccuracies of content, (II) personal injury or property damage, of any nature
                  whatsoever, resulting from your access to and use of the Website (III) any unauthorized access to or
                  use of any and all personal information stored therein, (IV) any interruption or cessation of
                  transmission to or from the services of Website, (V) any bugs, viruses, trojan horses, or the like
                  which may be transmitted to or through the services through the actions of any third party, (VI) any
                  loss of your data or content from the services and/or (VII) any errors or omissions in any content or
                  for any loss or damage of any kind incurred as a result of the use of any content posted, emailed,
                  transmitted, or otherwise made available via the services. any material downloaded or otherwise
                  obtained through the use of the services is done at your own discretion and risk and you will be
                  solely responsible for any damage to your computer system or other device or loss of data that results
                  from the download of any such material. </p>


                <h5>Limitation of liability:</h5>


                <p>


                  To the fullest extent permitted by applicable law, in no event shall moolya, nor any of its officers,
                  directors and employees, shall be held liable for anything arising out of or in any way connected with
                  your use of this website, whether such liability is under contract. moolya, including its officers,
                  directors and employees shall not be held liable for any indirect, consequential or special liability
                  arising out of or in any way related to your use of this Website. </p>


                <p>In no event shall moolya be liable to you for any indirect, incidental, special, punitive, exemplary
                  or consequential damages whatsoever, however caused and under any theory of liability, including but
                  not limited to, any loss of profit (whether incurred directly or indirectly), any loss of goodwill or
                  business reputation, any loss of data suffered, cost of procurement of substitute goods or services,
                  or other intangible loss.</p>


                <h5>Breach: </h5>


                <p>

                  Without limiting other remedies, moolya may, at moolya’s sole discretion, limit your activity,
                  immediately remove your information, warn other users of your actions, immediately
                  temporarily/indefinitely suspend or terminate or block your membership, and/or refuse to provide you
                  with access to the Website in the event, but not limited to: </p>


                <ul>


                  <li>a. If you breach the Terms and Conditions or Privacy Policy or any other rules and policies as
                    displayed on the Website;
                  </li>

                  <li>b. If moolya is unable to verify or authenticate any information you provide;</li>


                </ul>


                <p>You also agree that any breach by you of these Terms and Conditions or any other rules or policy as
                  displayed on the Website will constitute an unlawful and unfair business practice, and will cause
                  irreparable harm to moolya, for which monetary damages would be inadequate and you consent to pay the
                  same to moolya, which shall not forestall the obtaining of any injunctive or equitable relief that
                  moolya deems necessary or appropriate in such circumstances. These remedies shall be in addition to
                  any other remedies moolya may have in law or in equity.</p>


                <p>If moolya initiates any legal action against you as a result of your violation of these Terms and
                  Conditions or any other rules or policy as displayed over the Website, moolya shall be entitled to
                  recover from you, and you agree to pay, all reasonable attorneys’ fees and costs of such action, in
                  addition to any other relief granted to us.</p>


                <h5>Indemnification:</h5>


                <p>You hereby indemnify to the fullest extent moolya and its other offices and businesses, from and
                  against any and/or all liabilities, costs, demands, causes of action, damages and expenses arising in
                  any way related to your breach of any of the provisions of these Terms.</p>


                <h5> Severability </h5>


                <p>If any provision of these Terms is found to be invalid under any applicable law, such provisions
                  shall be deleted without affecting the remaining provisions herein.</p>


                <h5> Payment: </h5>


                <p>moolya may decide at its own discretion, to either make any of its services, products or
                  subscriptions (hereby referred to as ‘services’ for the entire course of this document) complimentary
                  or chargeable at any point of time without any notice. For users who have already paid for the
                  services or the products on the website, the charged amount will continue to be under effect till the
                  completion of the duration of the said contract or otherwise. After the completion of the contract the
                  new rates will become applicable for further availment of services/products on the website.</p>


                <p>You understand and agree that moolya reserves the right to advertise and rank Service Providers on
                  the basis of the subscription availed by them or at the sole discretion of moolya.

                </p>


                <p>You agree and acknowledge that Users who have availed services of Service Providers on moolya shall
                  make online payment within __ days of receipt of services to moolya and moolya shall, thereafter,
                  remit payment to the concerned Service Provider after deducting service charge of moolya within 7 days
                  from receipt of payment. </p>


                <p>


                  The amount paid by the User who has sought services of a Service Provider will be remitted to such
                  Service Provider contingent upon the following events:</p>


                <ul>


                  <li>a. User confirms receipt of services</li>

                  <li>b. User does not claim refund of the amount paid within a period of 7days from the date of
                    delivery of service
                  </li>


                </ul>


                <p>You agree and acknowledge that the User is responsible for deduction and payment of applicable taxes
                  to the concerned authority. </p>


                <p>You understand, accept and agree that the payment facility provided by moolya is neither a banking
                  nor financial service but is merely a facilitator providing an electronic, automated online electronic
                  payment, receiving payment on delivery, collection and remittance facility for the transactions on the
                  Website using the existing authorized banking infrastructure and payment gateway networks. Further, by
                  providing payment facility, moolya is neither acting as trustees nor acting in a fiduciary capacity
                  with respect to the transaction or the transaction price.</p>


                <h5>Refund Policy:</h5>


                <p>We do not provide any refunds of fees related to services availed on moolya by Users, unless agreed
                  by both Service Provider and User who has availed service from such Service Provider.</p>


                <p>In the event that a refund is made to User, then moolya reserves the right to withhold service charge
                  of moolya, on case to case basis.</p>


                <h5>User Testimonial</h5>


                <p>Users can transmit to moolya a testimonial statement depicting your review of using any moolya
                  service or subscription.</p>


                <p>By sending any testimonials of your review, you represent that the testimonial statement is true, and
                  that the testimonial accurately depicts your experience of using the moolya or service provided on
                  moolya.</p>


                <p>moolya reserves the right to post or not to post such testimonials based on the Terms and Conditions
                  of moolya from time to time.</p>


                <p>moolya has the right, but not the obligation to monitor and edit or remove any testimonial or Content
                  posted by you. moolya cannot review all communications made on and through any of the mediums of
                  moolya. However, moolya reserves the right, but has no obligation, to monitor and edit, modify or
                  delete any communications (or portions thereof) which moolya in its sole discretion deems
                  inappropriate, offensive or contrary to any moolya policy, or that violate these Terms and
                  Conditions.</p>


                <h5>Assignment:</h5>


                <p>moolya is allowed to assign, transfer, and subcontract its rights and/or obligations under these
                  Terms and Conditions without any notification. However, you are not allowed to assign, transfer, or
                  subcontract any of your rights and/or obligations under these Terms and Conditions.</p>


                <h5>Entire Agreement:</h5>


                <p>These Terms constitute the entire agreement between ‘moolya Business Services Private Limited,
                  Hyderabad, India and/or its other global offices, and you in relation to your use of this Website, and
                  supersede all prior agreements and understandings. Any new terms and conditions prescribed from time
                  to time, will be shared with the existing users for them to read, understand and accept before they
                  continue the use of the services on the website.</p>


                <p>Even though you may or may not be registered with some form of DND (‘DO NOT DISTURB’ or ‘DO NOT CALL’
                  registry or similar in various countries and jurisdictions) or other similar records maintained by
                  various governmental, public or private entities, you expressly and continuously permit moolya
                  authorized representatives/staff members to contact you over email, phone, mobile and other modes of
                  communication for setting up your account, seeking clarifications on any actions carried out on your
                  account and for any updates that may be required. Verbal and email communication is important for many
                  activities to be carried out on moolya and you expressly agree to be contacted at appropriate times
                  for the same.</p>


                <h5>Governing Law & Jurisdiction:</h5>


                <p>These Terms will be governed by and interpreted in accordance with the laws of the State of
                  Telangana, India. The High-court of ‘Hyderabad, Telangana, India’ or only the appropriate courts of
                  ‘Hyderabad, Telangana, India’, will have exclusive jurisdiction to adjudicate any dispute arising
                  under or in connection with this Agreement and ‘Terms and Conditions’ document.</p>


                <p>‘moolya’ confirms to the Information Technology Act, 2000 of India and users are alerted to read,
                  understand and abide by the laws listed in the act. ‘moolya’ also conforms to the ‘Information
                  Technology (Intermediaries guidelines) Rules, 2011’. Users are encouraged to understand and abide by
                  the rules and regulations of this act and other accompanying acts in their entirety, before using
                  ‘moolya’. More details of the ‘Information Technology Rules, 2000’ can be found here:
                  http://www.dot.gov.in/sites/default/files/itbill2000_0.pdf</p>


                <h5>Mediation and Arbitration:</h5>


                <p>In the event of a dispute arising out of or relating to this contract, including any question
                  regarding its existence, validity or termination, the parties shall first seek settlement of that
                  dispute by mediation in accordance with ‘The Arbitration and Conciliation Act, 1996’, which Rules are
                  deemed to be incorporated by reference into this clause.</p>


                <p>If the dispute is not settled by mediation within 30 days of the appointment of the mediator, or such
                  further period as the parties shall agree in writing, the dispute shall be referred to and finally
                  resolved by arbitration under the ‘The Arbitration and Conciliation Act, 1996’, which Rules are deemed
                  to be incorporated by reference into this clause.</p>


                <p>The language to be used in the mediation and in the arbitration, shall be ‘English’.

                  The governing law of the contract shall be the substantive law of INDIA. In any arbitration commenced
                  pursuant to this clause,</p>


                <ul>


                  <li>a. the number of arbitrators shall be three; and</li>

                  <li>b. the seat, or legal place, of the arbitration shall be ‘Hyderabad, Telangana, India’</li>


                </ul>


                <h5>Conformance to Consumer Protection Acts: </h5>


                <p>‘moolya’ seeks to be a self-discovery platform and hence services may be rendered by users for other
                  users on the platform as well as in offline mode. Out of the various laws that have been enforced to
                  protect the consumer rights in India, the most important is the Consumer Protection Act, 1986. Each of
                  the user who wishes to operate on ‘moolya’ for rendering any services, expressly agrees to abide by
                  the guidelines mentioned in the ‘Consumer Protection Act, 1986, India’ at all times. According to this
                  law, everybody, including individuals, a firm, a Hindu undivided family and a company, have the right
                  to exercise their consumer rights for the purchase of goods and services made by them. It is
                  significant that, as consumer, one knows the basic rights as well as about the courts and procedures
                  that follow with the infringement of one’s rights. Users are encouraged to understand the rules and
                  regulations of this act and other accompanying acts in their entirety, before using ‘moolya’ for
                  rendering or consuming any services or making any purchases.</p>


                <h5>Exceptions: </h5>


                <p>Nothing in this website disclaimer will exclude or limit any warranty implied by law that it would be
                  unlawful to exclude or limit; and nothing in this website disclaimer will exclude or limit moolya’s
                  liability in respect of any:</p>


                <ul>


                  <li> death or personal injury caused by moolya’s negligence;</li>

                  <li> fraud or fraudulent misrepresentation on the part of ‘moolya’; or</li>

                  <li> matter which it would be illegal or unlawful for ‘moolya’ to exclude or limit, or to attempt or
                    purport to exclude or limit, its liability
                  </li>


                </ul>


                <h5>Other parties: </h5>


                <p>You accept that, as a limited liability entity, moolya has an interest in limiting the personal
                  liability of its officers and employees. You agree that you will not bring any claim personally
                  against moolya’s officers or employees in respect of any losses you suffer in connection with the
                  website.</p>


                <p>Without prejudice to the foregoing paragraph, you agree that the limitations of warranties and
                  liability set out in this website disclaimer will protect moolya’s officers, employees, agents,
                  subsidiaries, successors, assigns and sub-contractors as well as ‘moolya’, at all times.</p>


                <h5>Reasonableness:</h5>


                <p>By using this website, you agree that the exclusions and limitations of liability set out in this
                  website disclaimer are reasonable. If you do not think they are reasonable, you must not use this
                  website.</p>


                <h5>Force Majeure:</h5>


                <p>In no event shall ‘moolya’ or any of its agents, staff or officers, be responsible or liable for any
                  failure or delay in the performance of its obligations here under arising out of or caused by,
                  directly or indirectly, forces beyond its control, including, without limitation, strikes, work
                  stoppages, accidents, acts of war or terrorism, civil or military disturbances, nuclear or natural
                  catastrophes or acts of God, and interruptions, loss or malfunctions of utilities, communications or
                  computer (software and hardware) services; it being understood that ‘moolya’ shall use reasonable
                  efforts which are consistent with accepted practices in the Information Technology industry to resume
                  performance as soon as practicable under the circumstances.</p>


                <h5>Guidance on transferring personal data to external organisations:</h5>


                <p>Personal Data is defined under the Data Protection Acts or similar ones for various countries. It is
                  generally defined as data which relates to a living individual who can either be identified from that
                  data; or identified from that data and other data which may be in the possession of or likely to come
                  into the possession of the data controller. This will include any expression of opinion about that
                  person. Personal Data will include ‘Name, Date of Birth, Address, Telephone numbers and “sensitive
                  personal data” eg. Financial History, racial or ethnic origin. ‘moolya’ collects a wide range of
                  personal data relating to the users of the platform/website, for its own purposes, and to meet
                  external obligations. This may result in the eventual transfer of personal data to an outside third
                  party, however any such transfers must be permitted under the acts permitted as per India’s law of the
                  land. Personal data must not be disclosed to unauthorised third parties. Unauthorised third parties
                  include another individual or organisation, family members, friends, local authorities, government
                  bodies, and the police where the individual has not consented to the transfer unless disclosure is
                  exempted appropriate Acts, or by other legislation. There is no general legal requirement to disclose
                  information to the police unless specified in a proper and legitimate form. However, data can
                  sometimes be disclosed without consent, where, for example, it is required for:</p>


                <ul>


                  <li> Protecting the vital interests of the data subject (i.e. release of medical data in emergency),
                    or
                  </li>

                  <li> The prevention or detection of crime</li>


                </ul>


                <p>Personal Data can be transferred to another third party if the data subject has given their consent.
                  ‘moolya’ maybe/is frequently required to disclose information in accordance with legislation which it
                  is subject to. Legal services can be availed by the prospective users of ‘moolya’ for advice on
                  whether India offers adequate protection and to assist with any risk assessments which may be
                  necessary.</p>


                <h5>e-Commerce compliances:</h5>


                <p>‘moolya’ endeavours to host the application, website and all related systems on vendors of adequate
                  repute at all times, which ensures adequate security or user data and transactions. Some of the
                  security checks which are put in place by the hosting service provider, include:</p>


                <ul>


                  <li>Use a firewall and keep the firewall updated</li>


                  <li>Non-storage of cardholder data in any form</li>


                  <li>Use sufficient encryption to protect all transmission of cardholder data over any public network
                  </li>


                  <li>Use antivirus software on all machines in the cardholder data environment and ensure that the
                    software is regularly updated
                  </li>


                  <li>Ensure only reputed Card processing systems are utilized to process payments</li>


                  <li>Limit access to cardholder data to as few people as possible</li>


                  <li>Assign a unique ID number to each user so that everyone is accountable for his own actions</li>


                  <li>Restrict physical access to the cardholder data environment</li>


                  <li>Monitor all access to the network and cardholder data environment</li>


                  <li>Regularly test security systems and network environment</li>


                  <li>Maintain a security policy and ensure that all personnel are aware of it</li>


                </ul>


                <p>moolya shall endeavour to use the best efforts to preserve the sanctity and security of data provided
                  by Users. However, you agree and acknowledge that we have no control over, and assume no
                  responsibility for the privacy policies or practices of any third party third-party service providers
                  engaged for the operation and administration of the Website.</p>


                <p>moolya undertakes to adhere to and comply with legal obligations of the country in which moolya
                  operates.</p>


                <p>If you have any questions regarding these Terms and Conditions or if you wish to discuss the terms of
                  service contained herein please contact moolya using the contact details at our contact page.</p>


              </div>

            </div>
          </div>
        </div>
      </div>

      <div className="modal fade bs-example-modal-sm library-popup privacyPop"
           onContextMenu={(e) => e.preventDefault()} tabIndex="-1" role="dialog"
           aria-labelledby="mySmallModalLabel">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              Privacy Policy
              <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span
                aria-hidden="true">&times;</span></button>
            </div>
            <div className="modal-body">

              <div className="blank_content" style={{'height':'400px','overflow':'auto','padding':'0px 5px'}}>
                <h5>Welcome to our Privacy Policy.</h5>


                <p>Your privacy is critically important to us.</p>


                <p>moolya’s office is located at:<br/> #1002, 10th Floor, The Platina, Gachibowli Road, Gachibowli,
                  Hyderabad, Telangana, IN - 500032<br/> Mobile: 91-99664 08213</p>


                <p>It is moolya’s (hereinafter referred to as “we” or “our” or “us”) policy to respect the user’s
                  (hereinafter referred to as “you” or “your” or “user”) privacy regarding any information we may
                  collect while operating our website. This Privacy Policy applies to all domains, applications and
                  pages hosted and made available for ‘moolya.global’ and other related domains and pages (hereafter
                  referred interchangeably as ‘moolya’ and ‘website’ for this complete document). We respect your
                  privacy and are committed to protecting personally identifiable information you may provide us
                  through the Website. We have adopted this privacy policy to explain what information may be
                  collected on our Website, how we use this information, and under what circumstances we may disclose
                  the information to third parties. This Privacy Policy applies only to information we collect through
                  the Website and does not apply to our collection of information from other sources.</p>


                <p>This Privacy Policy, together with the Terms and conditions posted on our Website, set forth the
                  general rules and policies governing your use of our Website. Depending on your activities when
                  visiting our Website, you may be required to agree to additional terms and conditions.</p>


                <p>This Privacy Policy is embedded in an electronic format formed under the Information Technology
                  Act, 2000 and the Rules made thereunder and the amendments regarding electronic documents as amended
                  by the said Act. There is no requirement of any physical, electronic or digital signature on this
                  Privacy Policy.</p>


                <h5>- Website Visitors:</h5>


                <p>Like most website operators, ‘moolya’ collects non-personally-identifying information of the sort
                  that web browsers and servers typically make available, such as the browser type, language
                  preference, referring site, and the date and time of each visitor request. ‘moolya’s purpose in
                  collecting non-personally identifying information is to better understand how ‘moolya’s visitors use
                  its website. From time to time, ‘moolya’ may release non-personally-identifying information in the
                  aggregate, e.g., by publishing a report on trends in the usage of its website.</p>


                <p>‘moolya’ also collects potentially personally-identifying information like Internet Protocol (IP)
                  addresses for logged in users and for users leaving comments on http://moolya.global blog posts.
                  ‘moolya’ only discloses logged in user and commenter IP addresses under the same circumstances that
                  it uses and discloses personally-identifying information as described below:</p>


                <h5>- Gathering of Personally-Identifying Information:</h5>


                <p>Certain visitors to ‘moolya’s websites choose to interact with ‘moolya’ in ways that require
                  ‘moolya’ to gather personally-identifying information. The amount and type of information that
                  ‘moolya’ gathers depends on the nature of the interaction. For example, we ask visitors who sign up
                  for a blog at http://’moolya.global to provide a username and email address.</p>


                <h5>- Security</h5>


                <p>We strive to ensure the security, integrity and privacy of your Personal Information and to protect
                  your Personal Information against unauthorized access or unauthorized alteration, disclosure or
                  destruction.</p>


                <p>The security of your Personal Information is important to us, but remember that no method of
                  transmission over the Internet, or method of electronic storage is 100% secure. While we strive to
                  use commercially acceptable means to protect your Personal Information and all information gathered
                  on the website is stored and maintained in secure facilities that limit and restrict access to
                  authorized personnel only, we cannot guarantee its absolute security. We are not responsible for any
                  breach of security or for any actions of any Third Parties that receive your Personal Information.
                  WE DISCLAIM LIABILITY FOR ANY THEFT, LOSS, OR INTERCEPTION OF OR ANY UNAUTHORIZED ACCESS OR DAMAGE
                  TO ANY DATA OR COMMUNICATIONS. BY USING OUR WEBSITE, YOU ACKNOWLEDGE THAT YOU UNDERSTAND AND AGREE
                  TO ASSUME THESE RISKS.</p>


                <p>You are responsible for all uses of our website by any person using your password. Please contact
                  us immediately if you believe your password has been misused.</p>


                <h5>- Advertisements</h5>


                <p>Ads appearing on our website may be delivered to users by advertising partners, who may set
                  cookies. These cookies allow the ad server to recognize your computer each time they send you an
                  online advertisement to compile information about you or others who use your computer. This
                  information allows ad networks to, among other things, deliver targeted advertisements that they
                  believe will be of most interest to you. This Privacy Policy covers the use of cookies by ‘moolya’
                  and does not cover the use of cookies by any advertisers.</p>


                <p>Advertisers may use technology to send the advertisements directly to your browser. In such cases,
                  the advertisers automatically receive your IP address. They may also use cookies and other
                  technologies to measure the effectiveness of their advertisements and to personalize advertising
                  content. We do not have access to or control over cookies or other features that such advertisers
                  may use, and the information practices of these advertisers are not covered by this Privacy
                  Policy. </p>


                <p>We do not make any representations concerning the privacy practices or policies of such third
                  parties or terms of use of such websites or apps, nor do we control or guarantee the accuracy,
                  integrity, or quality of the information, data, text, software, music, sound, photographs, graphics,
                  videos, messages or other materials available on such websites or apps.</p>


                <h5>- Links To External Sites</h5>


                <p>Our Service may contain links to external sites that are not operated by us. If you click on a
                  third party link, you will be directed to that third party's site. We strongly advise you to review
                  the Privacy Policy and terms and conditions of every site you visit.</p>


                <p>We have no control over, and assume no responsibility for the content, privacy policies or
                  practices of any third-party sites, products or services.

                  - ‘moolya.global uses Google AdWords and other tools for remarketing: ‘moolya.global’ uses the
                  remarketing services to advertise on third party websites (including Google) to previous visitors to
                  our site. It could mean that we advertise to previous visitors who haven’t completed a task on our
                  site, for example using the contact form to make an enquiry. This could be in the form of an
                  advertisement on the Google search results page, or a site in the Google Display Network.
                  Third-party vendors, including Google, use cookies to serve ads based on someone’s past visits. Of
                  course, any data collected will be used in accordance with our own privacy policy and Google’s
                  privacy policy.</p>


                <p>You can set preferences for how Google advertises to you using the Google Ad Preferences page, and
                  if you want to you can opt out of interest-based advertising entirely by cookie settings or
                  permanently using a browser plugin.</p>


                <h5>- Protection of Certain Personally-Identifying Information:</h5>


                <p>moolya discloses potentially personally-identifying and personally-identifying information only to
                  those of its employees, contractors and affiliated organizations that (i) need to know that
                  information in order to process it on moolya’s behalf or to provide services available at moolya’s
                  website, and (ii) that have agreed not to disclose it to others. Some of those employees,
                  contractors and affiliated organizations may be located outside of your home country; by using
                  moolya’s website, you consent to the transfer of such information to them. moolya will not rent or
                  sell potentially personally-identifying and personally-identifying information to anyone. Other than
                  to its employees, contractors and affiliated organizations, as described above, moolya discloses
                  potentially personally-identifying and personally-identifying information only in response to a
                  subpoena, court order or other governmental request, or when moolya believes in good faith that
                  disclosure is reasonably necessary to protect the property or rights of moolya, third parties or the
                  public at large.</p>


                <p>If you are a registered user of http://moolya.global and have supplied your email address, moolya
                  may occasionally send you an email to tell you about new features, solicit your feedback, or just
                  keep you up to date with what’s going on with moolya and our products. We primarily use our blog to
                  communicate this type of information, so we expect to keep this type of email to a minimum. If you
                  send us a request (for example via a support email or via one of our feedback mechanisms), we
                  reserve the right to publish it in order to help us clarify or respond to your request or to help us
                  support other users. moolya takes all measures reasonably necessary to protect against the
                  unauthorized access, use, alteration or destruction of potentially personally-identifying and
                  personally-identifying information.</p>


                <p>moolya requests the Users to abstain from sending private communication to moolya by email as email
                  is not recognised as a secure medium of communication. Users must be aware that there are inherent
                  risks associated with the transmissions of Personal Information via the Internet.</p>


                <h5>- Aggregated Statistics</h5>


                <p>moolya may collect statistics about the behavior of visitors to its website. moolya may display
                  this information publicly or provide it to others. However, moolya does not disclose your
                  personally-identifying information.</p>


                <h5>- Affiliate Disclosure</h5>


                <p>This site uses affiliate links and does earn a commission from certain links. This does not affect
                  your purchases or the price you may pay.</p>


                <h5>- Cookies</h5>


                <p>To enrich and perfect your online experience, ‘moolya’ uses "Cookies", similar technologies and
                  services provided by others to display personalized content, appropriate advertising and store your
                  preferences on your computer. A cookie is a string of information that a website stores on a
                  visitor’s computer, and that the visitor’s browser provides to the website each time the visitor
                  returns. ‘moolya’ uses cookies to help ‘moolya’ identify and track visitors, their usage of
                  http://moolya.global, and their website access preferences. moolya’s visitors who do not wish to
                  have cookies placed on their computers should set their browsers to refuse cookies before using
                  moolya’s websites, with the drawback that certain features of moolya’s websites may not function
                  properly without the aid of cookies.</p>


                <p>By continuing to navigate our website without changing your cookie settings, you hereby acknowledge
                  and agree to moolya's use of cookies.</p>


                <p>The information we collect with cookies is not sold, rented, or shared with any outside parties. We
                  use both session ID cookies and persistent cookies. A session ID cookie expires when you close your
                  browser. A persistent cookie remains on your hard drive for an extended period of time. You can
                  remove persistent cookies by following directions provided in your Internet browser’s “help” file.
                  Persistent cookies enable us to track and target the interests of our users to enhance the
                  experience on our site .</p>


                <h5>- E-commerce</h5>


                <p>Those who engage in transactions with moolya – by purchasing moolya's services or products, are
                  asked to provide additional information, including as necessary the personal and financial
                  information required to process those transactions. In each case, moolya collects such information
                  only insofar as is necessary or appropriate to fulfill the purpose of the visitor’s interaction with
                  moolya. moolya does not disclose personally-identifying information other than as described below.
                  And visitors can always refuse to supply personally-identifying information, with the caveat that it
                  may prevent them from engaging in certain website-related activities.</p>


                <h5>- Business Transfers</h5>


                <p>If moolya, or substantially all of its assets, were acquired, or in the unlikely event that moolya
                  goes out of business or enters bankruptcy, user information would be one of the assets that is
                  transferred or acquired by a third party. You acknowledge that such transfers may occur, and that
                  any acquirer of moolya may continue to use your personal information as set forth in this
                  policy.</p>


                <h5>- Privacy Policy Changes:</h5>


                <p>Although most changes are likely to be minor, moolya may change its Privacy Policy from time to
                  time, and in moolya’s sole discretion. moolya encourages visitors to frequently check this page for
                  any changes to its Privacy Policy. Your continued use of this site after any change in this Privacy
                  Policy will constitute your acceptance of such change.</p>


                <h5>- Violation of Privacy Policy: </h5>


                <p>Upon becoming aware of an alleged violation of this Privacy Policy or Terms and Conditions moolya
                  may initiate an investigation. During the investigation, the User's access to the website may be
                  restricted or limited in order to prevent further unauthorized activities. Depending on the severity
                  of the violation, moolya may, at its sole discretion, restrict, suspend, or terminate User’s account
                  and pursue other civil remedies.</p>


                <h5>- Retention of Information </h5>


                <p>Personal information of users and activities saved and archived in moolya will be kept by moolya
                  for as long as they are registered subscribers or users of our services, and for a reasonable time
                  thereafter subject to the applicable law of the country of the user. </p>


                <p>If you have any questions regarding this Privacy Policy or if you wish to discuss the terms
                  contained herein please contact moolya using the contact details at our contact page.</p>


                <h5>- Credit & Contact Information:</h5>


                <p>This privacy policy was created at privacygen.com. If you have any questions about this Privacy
                  Policy, please contact us via email or phone (details in CONTACT US of www.moolya.global)</p>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
}

export default MlAppMyProfile = formHandler()(MlAppMyProfile);
