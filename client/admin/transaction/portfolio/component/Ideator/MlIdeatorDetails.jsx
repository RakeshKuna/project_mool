import React, { Component, PropTypes }  from "react";
import ScrollArea from 'react-scrollbar';
var FontAwesome = require('react-fontawesome');
var Select = require('react-select')
import _ from 'lodash';
import {dataVisibilityHandler, OnLockSwitch,initalizeFloatLabel} from '../../../../utils/formElemUtil';
import {findIdeatorDetailsActionHandler} from '../../actions/findPortfolioIdeatorDetails'
import MlLoader from '../../../../../commons/components/loader/loader'
import {multipartASyncFormHandler} from '../../../../../commons/MlMultipartFormAction'
import {removePortfolioProfilePic} from '../../actions/removeIdatorPortfolioProficPic'
import {putDataIntoTheLibrary} from '../../../../../commons/actions/mlLibraryActionHandler'
import CropperModal from '../../../../../commons/components/cropperModal';
import {mlFieldValidations} from "../../../../../commons/validations/mlfieldValidation";
import generateAbsolutePath from '../../../../../../lib/mlGenerateAbsolutePath';
import Confirm from '../../../../../commons/utils/confirm';

const genderValues = [
  {value: 'male', label: 'Male'},
  {value: 'female', label: 'Female'},
  {value: 'others', label: 'Others'}
];

export default class MlIdeatorDetails extends Component{
  constructor(props, context){
    super(props);
    this.state = {
      loading: true,
      data: {},
      profilePic: " ",
      privateKey: {},
      defaultProfilePic: "/images/def_profile.png",
      privateValues: [],
      fileName:"",
      showProfileModal: false,
      uploadingAvatar: false
    }
    this.tabName = this.props.tabName || ''
    this.onClick.bind(this);
    this.handleBlur.bind(this);
    this.fetchPortfolioDetails.bind(this);
    this.libraryAction.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.handleUploadAvatar = this.handleUploadAvatar.bind(this);
    this.onFileUpload = this.onFileUpload.bind(this);
    return this;
  }

  componentDidMount()
  {
    OnLockSwitch();
    dataVisibilityHandler();
    initalizeFloatLabel();
  }
  componentDidUpdate()
  {
    var className = this.props.isAdmin?"admin_header":"app_header"
    OnLockSwitch();
    initalizeFloatLabel();
    dataVisibilityHandler();
    var WinHeight = $(window).height();
    // $('.main_wrap_scroll').height(WinHeight-(90+$('.admin_header').outerHeight(true)));
    $('.main_wrap_scroll').height(WinHeight-(90+$('.'+className).outerHeight(true)));
  }
  componentWillMount(){
    const resp = this.fetchPortfolioDetails();
    return resp
  }

  onClick(fieldName,field,e){
      let details = this.state.data||{};
      let key = e.target.id;
      var isPrivate = false;
      details=_.omit(details,[key]);
      let className = e.target.className;
      if(className.indexOf("fa-lock") != -1){
        details=_.extend(details,{[key]:true});
        isPrivate = true
      }else{
        details=_.extend(details,{[key]:false});
      }
    var privateKey = {keyName: fieldName, booleanKey: field, isPrivate: isPrivate, tabName: this.props.tabName}
    this.setState({data: details, privateKey: privateKey}, function () {
      this.sendDataToParent()
    })
  }

  handleYearsOfExperience(value) {
    let blankSpace = value.indexOf(' ') >= 0;
    let experience = parseInt(value);
    let valuesArray = value.split(".");
    let decimalExperience = valuesArray.length > 0 ?  valuesArray[0] : "";
    if(decimalExperience) {
      experience = parseInt(decimalExperience);
      if(experience > 75){
        toastr.error('Experience cannot be more than 75 years')
        return false;
      }
    }
    if(blankSpace) {
      toastr.error('Blank spaces are not allowed')
      return false;
    } else if(experience > 75 ) {
      toastr.error('Experience cannot be more than 75 years')
      return false;
    } else if (!experience) {
      toastr.error('Experience not valid')
      return false
    } else {return true}
  }

  handleBlur(e){
    let details =this.state.data;
    let name  = e.target.name;
    let validExperience;
    if(name === "yearsOfExperience") {
      validExperience = this.handleYearsOfExperience(e.target.value)
      if(validExperience) {
        details = _.omit(details, [name]);
        details = _.extend(details, {[name]: e.target.value});
        this.setState({data: details}, function () {
          this.sendDataToParent()
        })
      }
    } else {
      details = _.omit(details, [name]);
      details = _.extend(details, {[name]: e.target.value});
      this.setState({data: details}, function () {
        this.sendDataToParent()
      })
    }
  }

  optionsBySelectGender(val) {
    var dataDetails = this.state.data
    dataDetails['gender'] = val.value
    this.setState({data: dataDetails}, function () {
      this.sendDataToParent();
    })
  }

  async fetchPortfolioDetails() {
    let that = this;
    let portfoliodetailsId=that.props.portfolioDetailsId;
    const response = await findIdeatorDetailsActionHandler(portfoliodetailsId);
    let empty = _.isEmpty(that.context.ideatorPortfolio && that.context.ideatorPortfolio.portfolioIdeatorDetails)
    if(empty){
      if (response) {
        this.setState({loading: false, data: response,profilePic:response.profilePic});
      }
        _.each(response.privateFields, function (pf) {
            $("#"+pf.booleanKey).removeClass('un_lock fa-unlock').addClass('fa-lock')
        })

    }else{
      this.setState({loading: false, data: that.context.ideatorPortfolio.portfolioIdeatorDetails, privateValues: response.privateFields}, () => {
        this.lockPrivateKeys()
      });
    }
  }

  /**
   * UI creating lock function
   * */
  lockPrivateKeys() {
    var filterPrivateKeys = _.filter(this.context.portfolioKeys.privateKeys, {tabName: this.props.tabName})
    var filterRemovePrivateKeys = _.filter(this.context.portfolioKeys.removePrivateKeys, {tabName: this.props.tabName})
    var finalKeys = _.unionBy(filterPrivateKeys, this.state.privateValues, 'booleanKey')
    var keys = _.differenceBy(finalKeys, filterRemovePrivateKeys, 'booleanKey')
    console.log('keysssssssssssssssss', keys)
    _.each(keys, function (pf) {
      $("#" + pf.booleanKey).removeClass('un_lock fa-unlock').addClass('fa-lock')
    })
  }


  sendDataToParent(){
    const requiredFields = this.getFieldValidations();
    let data = this.state.data;
      for (var propName in data) {
        if (data[propName] === null || data[propName] === undefined) {
          delete data[propName];
        }
      }
      data=_.omit(data,["privateFields"]);
      this.props.getIdeatorDetails(data, this.state.privateKey, requiredFields)
  }

  getFieldValidations() {
    const ret = mlFieldValidations(this.refs);
    return {tabName: this.tabName, errorMessage: ret, index: 0}
  }
  onFileUpload(file){
    if(file){
      let data ={moduleName: "PORTFOLIO_PROFILE_IMG", actionName: "UPDATE", portfolioId:this.props.portfolioDetailsId,communityType:"IDE", portfolio:{portfolioIdeatorDetails:{profilePic:" "}}};
      let response = multipartASyncFormHandler(data,file,'registration',this.onFileUploadCallBack.bind(this, file));
    } this.setState({
      uploadingAvatar: false,
    });
  }
  onFileUploadCallBack(file,resp){
    this.setState({
      uploadingAvatar: false,
      showProfileModal: false
    });
    if(resp){
      let result = JSON.parse(resp);
      Confirm('', "Do you want to add this file to your library?", 'Yes', 'No',(ifConfirm)=>{
        if(ifConfirm){
          let fileObjectStructure = {
            fileName: this.state.fileName,
            fileType: file.type,
            fileUrl: result.result,
            libraryType: "image"
          }
          this.libraryAction(fileObjectStructure)
        }
      });

      if(result.success){
        this.setState({profilePic:result.result})
        this.setState({loading:true})
        this.fetchPortfolioDetails();
      }
    }
  }

  async libraryAction(file) {
    let portfolioDetailsId = this.props.portfolioDetailsId;
    const resp = await putDataIntoTheLibrary(portfolioDetailsId ,file, this.props.client)
    if(resp.code === 404) {
      toastr.error(resp.result)
    } else {
      toastr.success(resp.result)
      return resp;
    }
  }

  async deleteProfilePic() {
    const response = await removePortfolioProfilePic(this.props.portfolioDetailsId);
    if(response){
      this.fetchPortfolioDetails();
      this.setState({profilePic:''});
    }else{
      toastr.error("Error in deleting picture")
    }
  }
  toggleModal() {
    const that = this;
    this.setState({
      showProfileModal: !that.state.showProfileModal
    });
  }
  handleUploadAvatar(image, file) {
    this.setState({
      //uploadingAvatar: true,,
    });
    this.setState({ fileName: file.name })
    this.onFileUpload(image);
  }
  render(){
    let genderActive =''
    if(this.state.gender){
      genderActive='active'
    }
    const showLoader = this.state.loading;
    let genderImage = this.state.data && this.state.data.gender==='female'?"/images/female.jpg":this.state.defaultProfilePic;

    return (
      <div>
        {showLoader === true ? (<MlLoader/>) : (

        <div>
          <h2>Ideator</h2>
          <div className="main_wrap_scroll">
            <ScrollArea
              speed={0.8}
              className="main_wrap_scroll"
              smoothScrolling={true}
              default={true}
            >
          <div className="col-md-6 nopadding-left">

                <div className="form_bg">
                  <form id="ideatorDetails">
                    <div className="form-group mandatory">
                      <input type="text" placeholder="First Name" name="firstName" ref="firstName"
                             defaultValue={this.state.data.firstName} className="form-control float-label" disabled/>
                      {/*<FontAwesome htmlFor="firstName" name='unlock' className="input_icon un_lock" id="isfirstNamePrivate" onClick={this.onClick.bind(this, "firstName", "isfirstNamePrivate")}/>*/}
                    </div>
                    <div className="form-group mandatory">
                      <input type="text" placeholder="Last Name" name="lastName" defaultValue={this.state.data.lastName}
                             ref="lastName"
                             className="form-control float-label" disabled/>
                      {/*<FontAwesome htmlFor="lastName" name='unlock' className="input_icon un_lock" id="islastNamePrivate" onClick={this.onClick.bind(this, "lastName", "islastNamePrivate")}/>*/}
                    </div>

                    {/*<div className="form-group">
                      <input type="text" placeholder="Gender" name="gender" defaultValue={this.state.data.gender} className="form-control float-label" disabled="true" onBlur={this.handleBlur.bind(this)}/>
                      <FontAwesome htmlFor="gender" name='unlock' className="input_icon un_lock" id="isGenderPrivate" onClick={this.onClick.bind(this, "gender", "isGenderPrivate")}/>
                    </div>*/}
                    <div className="form-group">
                      <span className={`placeHolder ${genderActive}`}>Gender</span>
                      <Select name="form-field-name" placeholder="Select Gender" value={this.state.data.gender}  options={genderValues} onChange={this.optionsBySelectGender.bind(this)} disabled className="float-label" />
                      <FontAwesome name='unlock' className="input_icon un_lock" id="isGenderPrivate" onClick={this.onClick.bind(this, "gender", "isGenderPrivate")}/><input type="checkbox" className="lock_input" id="makePrivate" checked={this.state.data.isGenderPrivate}/>
                    </div>

                    <div className="form-group">
                      <input type="text" placeholder="Qualification" name="qualification" defaultValue={this.state.data.qualification} className="form-control float-label" id="cluster_name" onBlur={this.handleBlur.bind(this)}/>
                      <FontAwesome htmlFor="qualification" name='unlock' className="input_icon un_lock" id="isQualificationPrivate" onClick={this.onClick.bind(this, "qualification", "isQualificationPrivate")}/>
                    </div>

                    <div className="form-group">
                      <input type="text" placeholder="Employment Status" name="employmentStatus" defaultValue={this.state.data.employmentStatus} className="form-control float-label" disabled="true" onBlur={this.handleBlur.bind(this)}/>
                      <FontAwesome htmlFor="employmentStatus" name='unlock' className="input_icon un_lock" id="isEmploymentStatusPrivate" onClick={this.onClick.bind(this, "employmentStatus", "isEmploymentStatusPrivate")}/>
                    </div>

                    <div className="form-group">
                      <input type="text" placeholder="Professional Tag" name="professionalTag" defaultValue={this.state.data.professionalTag} className="form-control float-label" id="cluster_name" onBlur={this.handleBlur.bind(this)}/>
                      <FontAwesome htmlFor="professionalTag" name='unlock' className="input_icon un_lock" id="isProfessionalTagPrivate" onClick={this.onClick.bind(this, "professionalTag", "isProfessionalTagPrivate")}/>
                    </div>

                    <div className="form-group">
                      <input type="text" placeholder="Years of Experience" name="yearsofExperience" defaultValue={this.state.data.yearsofExperience} className="form-control float-label" id="cluster_name" onBlur={this.handleBlur.bind(this)}/>
                      <FontAwesome htmlFor="yearsofExperience" name='unlock' className="input_icon un_lock" id="isYoePrivate" onClick={this.onClick.bind(this, "yearsofExperience", "isYoePrivate")}/>
                    </div>
                  </form>
                </div>
          </div>

          <div className="col-md-6 nopadding-right">

                <div className="form_bg">
                  <form>

                    <div className="form-group steps_pic_upload">
                      <div className="previewImg ProfileImg">
                        <span className="triangle-topright"><FontAwesome name='minus-square' onClick={this.deleteProfilePic.bind(this)}/></span>
                        <img src={this.state.profilePic?generateAbsolutePath(this.state.profilePic):genderImage}/>

                      </div>
                      <div className="fileUpload mlUpload_btn">
                          <span onClick={this.toggleModal.bind(this)}>Profile Pic</span>

                        {/*<input type="file" className="upload" id="profilePic" onChange={this.onFileUpload.bind(this)}/>*/}
                      </div>

                    </div>
                    <br className="brclear"/>
                    <div className="form-group">
                      <input type="text" placeholder="Industry" name="industry" defaultValue={this.state.data.industry} className="form-control float-label" disabled="true" onBlur={this.handleBlur.bind(this)}/>
                      <FontAwesome htmlFor="industry" name='unlock' className="input_icon un_lock" id="isIndustryPrivate" onClick={this.onClick.bind(this, "industry","isIndustryPrivate")}/><input type="checkbox" className="lock_input" id="makePrivate" checked={this.state.data.isIndustryPrivate}/>
                    </div>

                    <div className="form-group">
                      <input type="text" placeholder="Profession" name="profession" defaultValue={this.state.data.profession} className="form-control float-label" disabled="true" onBlur={this.handleBlur.bind(this)}/>
                      <FontAwesome htmlFor="profession" name='unlock' className="input_icon un_lock" id="isProfessionPrivate" onClick={this.onClick.bind(this, "profession", "isProfessionPrivate")}/><input type="checkbox" className="lock_input" id="makePrivate" checked={this.state.data.isProfessionPrivate}/>
                    </div>

                    <div className="form-group">
                      <input type="text" placeholder="Employer Name" ref="employerName" defaultValue={this.state.data.employerName} disabled="true" className="form-control float-label"/>
                      <FontAwesome htmlFor="employerName" name='unlock' className="input_icon un_lock" id="isEmployerNamePrivate" onClick={this.onClick.bind(this, "employerName", "isEmployerNamePrivate")}/>
                    </div>

                    <div className="form-group mandatory">
                      <input type="text" placeholder="Phone No" name="mobileNumber" defaultValue={this.state.data.mobileNumber} disabled="true" className="form-control float-label"/>
                      <FontAwesome htmlFor="mobileNumber" name='unlock' className="input_icon un_lock" id="isMobileNumberPrivate" onClick={this.onClick.bind(this, "mobileNumber", "isMobileNumberPrivate")}/><input type="checkbox" className="lock_input" id="makePrivate" checked={this.state.data.isMobileNumberPrivate}/>
                    </div>

                    <div className="form-group mandatory">
                      <input type="text" placeholder="Email Id" name="emailId" defaultValue={this.state.data.emailId} disabled="true" className="form-control float-label"/>
                      <FontAwesome htmlFor="emailId" name='unlock' className="input_icon un_lock" id="isEmailIdPrivate" onClick={this.onClick.bind(this, "emailId", "isEmailIdPrivate")}/><input type="checkbox" className="lock_input" id="makePrivate" checked={this.state.data.isEmailIdPrivate}/>
                    </div>

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
      </div>)}
      </div>
    )
  }
};
MlIdeatorDetails.contextTypes = {
  ideatorPortfolio: PropTypes.object,
  portfolioKeys: PropTypes.object,
};
