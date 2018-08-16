import React, { Component, PropTypes } from "react";
import ScrollArea from "react-scrollbar";
var FontAwesome = require('react-fontawesome');
var Select = require('react-select');
import _ from 'lodash';
import { dataVisibilityHandler, OnLockSwitch, initalizeFloatLabel } from '../../../../../utils/formElemUtil';
import { fetchfunderPortfolioAbout } from '../../../actions/findPortfolioFunderDetails'
import { multipartASyncFormHandler } from '../../../../../../commons/MlMultipartFormAction'
import { putDataIntoTheLibrary } from '../../../../../../commons/actions/mlLibraryActionHandler'
import {mlFieldValidations} from "../../../../../../commons/validations/mlfieldValidation";
import MlLoader from '../../../../../../commons/components/loader/loader';
import CropperModal from '../../../../../../commons/components/cropperModal';
import generateAbsolutePath from '../../../../../../../lib/mlGenerateAbsolutePath';
import Confirm from '../../../../../../commons/utils/confirm';
import { fetchCurrencyTypeActionHandler } from '../../../../../../commons/actions/mlCurrencySymbolHandler'

const genderValues = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'others', label: 'Others' }
];
export default class MlFunderAbout extends React.Component {
  constructor(props, context) {
    super(props);
    this.state = {
      loading: true,
      profilePic: " ",
      defaultProfilePic: "/images/def_profile.png",
      data: {},
      fileName:"",
      uploadingAvatar: false,
      privateKey: {},
      showProfileModal: false,currencySymbol:"USD"
    }
    this.tabName = this.props.tabName || ""
    this.onClick.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.fetchPortfolioDetails.bind(this);
    this.libraryAction.bind(this);
    this.handleUploadAvatar = this.handleUploadAvatar.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.optionsBySelectGender = this.optionsBySelectGender.bind(this);
    return this;
  }

  componentWillMount() {
    const resp = this.fetchPortfolioDetails();
    this.getCurrencyType()
    return resp
  }

  componentDidMount() {
    OnLockSwitch();
    dataVisibilityHandler();
  }

  componentDidUpdate() {
    var className = this.props.isAdmin ? "admin_header" : "app_header"
    var WinWidth = $(window).width();
    var WinHeight = $(window).height();
    // $('.main_wrap_scroll').height(WinHeight-($('.admin_header').outerHeight(true)+120));
    $('.main_wrap_scroll').height(WinHeight - ($('.' + className).outerHeight(true) + 120));
    if (WinWidth > 768) {
      $(".main_wrap_scroll").mCustomScrollbar({ theme: "minimal-dark" });
    }
    OnLockSwitch();
    dataVisibilityHandler();
    initalizeFloatLabel();
  }

  onClick(fieldName, field, e) {
    let details = this.state.data || {};
    let key = e.target.id;
    var isPrivate = false;
    details = _.omit(details, [key]);
    let className = e.target.className;
    if (className.indexOf("fa-lock") != -1) {
      details = _.extend(details, { [key]: true });
      isPrivate = true;
    } else {
      details = _.extend(details, { [key]: false });
    }
    var privateKey = { keyName: fieldName, booleanKey: field, isPrivate: isPrivate, tabName: this.props.tabName }
    // this.setState({privateKey:privateKey})
    this.setState({ data: details, privateKey: privateKey }, function () {
      this.sendDataToParent()
    })

  }
  onBudgetClick(fieldName, field, e) {
    var isPrivate = false;
    let details = this.state.data.investmentBudget || {};
    let key = e.target.id;
    details = _.omit(details, [key]);
    let className = e.target.className;
    if (className.indexOf("fa-lock") != -1) {
      details = _.extend(details, { [key]: true });
      isPrivate = true;
    } else {
      details = _.extend(details, { [key]: false });
    }
    const privateKey = { keyName: fieldName, booleanKey: field, isPrivate: isPrivate, objectName: "investmentBudget", tabName: "funderAbout" }
    let data = this.state.data;
    data['investmentBudget'] = details
    this.setState({ privateKey: privateKey, data: data }, () => {
      this.sendDataToParent()
    })
  }

  handleYearsOfExperience(value) {
    let blankSpace = value.indexOf(' ') >= 0;
    let experience = parseInt(value);
    let valuesArray = value.split(".");
    let decimalExperience = valuesArray.length > 0 ? valuesArray[0] : "";
    if (decimalExperience) {
      experience = parseInt(decimalExperience);
      if (experience > 75) {
        toastr.error('Experience cannot be more than 75 years')
        return false;
      }
    }
    if (blankSpace) {
      toastr.error('Blank spaces are not allowed')
      return false;
    } else if (experience > 75) {
      toastr.error('Experience cannot be more than 75 years')
      return false;
    } else if (!experience) {
      toastr.error('Experience not valid')
      return false
    } else { return true }
  }

  handleBlur(e) {
    let details = this.state.data;
    let name = e.target.name;
    let validExperience;
    if (name === "yearsOfExperience") {
      validExperience = this.handleYearsOfExperience(e.target.value)
      if (validExperience) {
        details = _.omit(details, [name]);
        details = _.extend(details, { [name]: e.target.value });
        this.setState({ data: details }, function () {
          this.sendDataToParent()
        })
      }
    } else {
      details = _.omit(details, [name]);
      details = _.extend(details, { [name]: e.target.value });
      this.setState({ data: details }, function () {
        this.sendDataToParent()
      })
    }
  }
  handleBudgetBlur(e) {
    let details = this.state.data.investmentBudget;
    let name = e.target.name;
    details = _.omit(details, [name]);
    details = _.extend(details, { [name]: e.target.value });
    let data = this.state.data;
    data['investmentBudget'] = details
    this.setState({ data: data }, function () {
      this.sendDataToParent()
    })
  }

  onSelectInvestmentFrom(type, e) {
    let details = this.state.data;
    details = _.omit(details, 'investmentFrom');
    details = _.extend(details, { 'investmentFrom': type });
    this.setState({ data: details }, function () {
      this.sendDataToParent()
    })
  }

  async deleteProfilePic() {
    let that = this;
    this.setState({ profilePic: '' })
    const response = await fetchfunderPortfolioAbout(that.props.portfolioDetailsId);
    if (response) {
      let dataDetails = response
      let cloneBackUp = _.cloneDeep(dataDetails);
      if (cloneBackUp) {
        cloneBackUp.profilePic = that.state.defaultProfilePic;
        this.setState({ data: cloneBackUp }, function () {
          that.sendDataToParent()
        });
      }
    }
  }

  async fetchPortfolioDetails() {
    let that = this;
    let portfoliodetailsId = that.props.portfolioDetailsId;
    const response = await fetchfunderPortfolioAbout(portfoliodetailsId);
    let empty = _.isEmpty(that.context.funderPortfolio && that.context.funderPortfolio.funderAbout)
    if (empty) {
      if (response) {
        this.setState({ profilePic: response.profilePic, loading: false, data: response });
        _.each(response.privateFields, function (pf) {
          $("#" + pf.booleanKey).removeClass('un_lock fa-unlock').addClass('fa-lock')
        })
      }
    } else {
      this.setState({ loading: false, data: that.context.funderPortfolio.funderAbout, privateValues: response.privateFields, profilePic: response ? response.profilePic : "" }, () => {
        this.lockPrivateKeys()
      });
    }
  }

  /**
   * UI creating lock function
   * */
  lockPrivateKeys() {
    var filterPrivateKeys = _.filter(this.context.portfolioKeys.privateKeys, { tabName: this.props.tabName })
    var filterRemovePrivateKeys = _.filter(this.context.portfolioKeys.removePrivateKeys, { tabName: this.props.tabName })
    var finalKeys = _.unionBy(filterPrivateKeys, this.state.privateValues, 'booleanKey')
    var keys = _.differenceBy(finalKeys, filterRemovePrivateKeys, 'booleanKey')
    console.log('keysssssssssssssssss', keys)
    _.each(keys, function (pf) {
      $("#" + pf.booleanKey).removeClass('un_lock fa-unlock').addClass('fa-lock')
    })
  }

  sendDataToParent() {
    const requiredFields = this.getFieldValidations();
    let data = this.state.data;
    for (var propName in data) {
      if (data[propName] === null || data[propName] === undefined) {
        delete data[propName];
      }
    }
    for (var propName in data.investmentBudget) {
      if (data['investmentBudget'][propName] === null || data['investmentBudget'][propName] === undefined) {
        delete data['investmentBudget'][propName];
      }
    }
    data = _.omit(data, ["privateFields"]);
    this.props.getAboutus(data, this.state.privateKey, requiredFields)
  }

  getFieldValidations() {
    const ret = mlFieldValidations(this.refs);
    return {tabName: this.tabName, errorMessage: ret, index: 0}
  }

  onLogoFileUpload(image) {
    let file = image;
    let data = { moduleName: "PORTFOLIO", actionName: "UPLOAD", portfolioDetailsId: this.props.portfolioDetailsId, portfolio: { funderAbout: { profilePic: "" } } };
    let response = multipartASyncFormHandler(data, file, 'registration', this.onFileUploadCallBack.bind(this, file));
  }
  onFileUploadCallBack(file, resp) {
    if (resp) {
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

      if (result.success) {
        this.setState({ profilePic: result.result })
        this.setState({ loading: true, uploadingAvatar: false })
        this.fetchOnlyImages();
      }
      this.toggleModal();
      this.setState({ uploadingAvatar: false })
    }
  }

  async libraryAction(file) {
    let portfolioDetailsId = this.props.portfolioDetailsId;
    const resp = await putDataIntoTheLibrary(portfolioDetailsId, file, this.props.client)
    if(resp.code === 404) {
      toastr.error(resp.result)
    } else {
      toastr.success(resp.result)
      return resp;
    }
  }

  async fetchOnlyImages() {
    let that = this;
    const response = await fetchfunderPortfolioAbout(that.props.portfolioDetailsId);
    if (response) {
      let dataDetails = response
      let cloneBackUp = _.cloneDeep(dataDetails);
      if (cloneBackUp) {
        // let curUpload = dataDetails
        // console.log(curUpload)
        cloneBackUp.profilePic = that.state.profilePic;
        this.setState({ data: cloneBackUp }, function () {
          that.sendDataToParent()
        });
        this.setState({ loading: false, funderAbout: cloneBackUp })
      } else {
        this.setState({ loading: false })
      }
    }
  }
  optionsBySelectGender(val) {
    var dataDetails = this.state.data
    dataDetails['gender'] = val.value
    this.setState({ data: dataDetails }, function () {
      this.sendDataToParent();
    })
  }

  handleUploadAvatar(image, file) {
    this.setState({
      //uploadingAvatar: true,,
    });
    this.setState({ fileName: file.name })
    this.onLogoFileUpload(image);
  }

  toggleModal() {
    const that = this;
    this.setState({
      showProfileModal: !that.state.showProfileModal
    });
  }

  async getCurrencyType() {
    const response = await fetchCurrencyTypeActionHandler(this.props.client, null, this.props.portfolioDetailsId);
    this.setState({currencySymbol: response.symbol})
    return response;
  }


  render() {
    let genderActive =''
    if(this.state.data.gender){
      genderActive='active'
    }
    const showLoader = this.state.loading;
    let genderImage = this.state.data && this.state.data.gender === 'female' ? "/images/female.jpg" : this.state.defaultProfilePic;
    let investmentFrom = this.state.data && this.state.data.investmentFrom ? this.state.data.investmentFrom : "";
    let personal = null, familyFund = null;
    // temp fix need to remove string compare

    if (investmentFrom == "PERSONAL") {
      personal = true;
      familyFund = false;
    } else if (investmentFrom == "FAMILY FUND") {
      familyFund = true;
      personal = false;
    }
    return (
      <div>
        {showLoader === true ? (<MlLoader />) : (
          <div>
            <h2>About Us</h2>
            <div className="main_wrap_scroll">

                <div className="col-md-6 nopadding-left">

                  <div className="form_bg">
                    <form>

                      <div className="form-group mandatory">
                        <input type="text" placeholder="First Name" name="firstName" ref="firstName"
                               defaultValue={this.state.data.firstName} className="form-control float-label"
                               onBlur={this.handleBlur} data-required={true}
                               data-errMsg="First Name is required"/>
                        {/*<FontAwesome name='unlock' className="input_icon un_lock" id="isFirstNamePrivate" onClick={this.onClick.bind(this, "firstName", "isFirstNamePrivate")} />*/}
                      </div>

                      <div className="form-group mandatory">
                        <input type="text" placeholder="Last Name" name="lastName" ref="lastName"
                               defaultValue={this.state.data.lastName} className="form-control float-label"
                               onBlur={this.handleBlur} data-required={true}
                               data-errMsg="Last Name is required"/>
                        {/*<FontAwesome name='unlock' className="input_icon un_lock" id="isLastNamePrivate" onClick={this.onClick.bind(this, "lastName", "isLastNamePrivate")} />*/}
                      </div>

                      {/*<div className="form-group">*/}
                      {/*<input type="text" placeholder="Gender" name="gender" defaultValue={this.state.data.gender} className="form-control float-label"  onBlur={this.handleBlur}/>*/}
                      {/*<FontAwesome name='unlock' className="input_icon un_lock" id="isGenderPrivate" onClick={this.onClick.bind(this, "gender","isGenderPrivate")}/>*/}
                      {/*</div>*/}
                      <div className="form-group">
                        <span className={`placeHolder ${genderActive}`}>Gender</span>
                        <Select name="form-field-name" placeholder="Select Gender" value={this.state.data.gender} options={genderValues} onChange={this.optionsBySelectGender} className="float-label" />
                        <FontAwesome name='unlock' className="input_icon un_lock" id="isGenderPrivate" onClick={this.onClick.bind(this, "gender", "isGenderPrivate")} />
                      </div>

                      <div className="form-group">
                        <input type="text" placeholder="User Category" name="category" defaultValue={this.state.data.category} className="form-control float-label"  onBlur={this.handleBlur} disabled="disabled" />
                        <FontAwesome name='unlock' className="input_icon un_lock" id="isCategoryPrivate" onClick={this.onClick.bind(this, "category", "isCategoryPrivate")} />
                      </div>

                      <div className="form-group">
                        <input type="text" placeholder="Qualification" name="qualification" defaultValue={this.state.data.qualification} className="form-control float-label"  onBlur={this.handleBlur} />
                        <FontAwesome name='unlock' className="input_icon un_lock" id="isQualificationPrivate" onClick={this.onClick.bind(this, "qualification", "isQualificationPrivate")} />
                      </div>

                      <div className="form-group">
                        <input type="text" placeholder="Employment Status" name="employmentStatus" defaultValue={this.state.data.employmentStatus} className="form-control float-label"  onBlur={this.handleBlur} />
                        <FontAwesome name='unlock' className="input_icon un_lock" id="isEmploymentStatusPrivate" onClick={this.onClick.bind(this, "employmentStatus", "isEmploymentStatusPrivate")} />
                      </div>

                      <div className="form-group">
                        <input type="text" placeholder="Professional Tag" name="professionalTag" defaultValue={this.state.data.professionalTag} className="form-control float-label"  onBlur={this.handleBlur} />
                        <FontAwesome name='unlock' className="input_icon un_lock" id="isProfessionalTagPrivate" onClick={this.onClick.bind(this, "professionalTag", "isProfessionalTagPrivate")} />
                      </div>

                      <div className="form-group">
                        <input type="text" placeholder="Years of Experience" name="yearsOfExperience" defaultValue={this.state.data.yearsOfExperience} className="form-control float-label"  onBlur={this.handleBlur} />
                        <FontAwesome name='unlock' className="input_icon un_lock" id="isYearsOfExperiencePrivate" onClick={this.onClick.bind(this, "yearsOfExperience", "isYearsOfExperiencePrivate")} />
                      </div>

                      <div className="form-group">
                        <input type="text" placeholder="Industry" name="industry" defaultValue={this.state.data.industry} className="form-control float-label"  onBlur={this.handleBlur} disabled="disabled" />
                        <FontAwesome name='unlock' className="input_icon un_lock" id="isIndustryPrivate" onClick={this.onClick.bind(this, "industry", "isIndustryPrivate")} />
                      </div>

                      <div className="form-group">
                        <input type="text" placeholder="Profession" name="profession" defaultValue={this.state.data.profession} className="form-control float-label"  onBlur={this.handleBlur} disabled="disabled" />
                        <FontAwesome name='unlock' className="input_icon un_lock" id="isProfessionPrivate" onClick={this.onClick.bind(this, "profession", "isProfessionPrivate")} />
                      </div>
                    </form>
                  </div>


                </div>
                <CropperModal
                  uploadingImage={this.state.uploadingAvatar}
                  handleImageUpload={this.handleUploadAvatar}
                  cropperStyle="circle"
                  show={this.state.showProfileModal}
                  toggleShow={this.toggleModal}
                />
                <div className="col-md-6 nopadding-right">
                  <div className="form_bg">
                    <form>
                      <div className="previewImg ProfileImg">
                        <img src={this.state.profilePic ? generateAbsolutePath(this.state.profilePic) : genderImage} />
                        {this.state.profilePic ? <span className="triangle-topright"><FontAwesome name='minus-square' onClick={this.deleteProfilePic.bind(this)} /></span> : " "}
                      </div>
                      <div className="form-group" onClick={this.toggleModal.bind(this)}>
                        <div className="fileUpload mlUpload_btn">
                          <span>Profile Pic</span>
                          {/* <input type="file" name="logo" id="logo" className="upload"  accept="image/*" onChange={this.onLogoFileUpload.bind(this)}  /> */}
                        </div>
                        {/*<div className="previewImg ProfileImg">*/}
                        {/*<img src="/images/def_profile.png"/>*/}
                        {/*</div>*/}
                      </div>
                      <br className="brclear" />
                      <div className="panel panel-default mart20">
                        <div className="panel-heading"> Investment Budget Per Year (in {this.state.currencySymbol}): </div>

                        <div className="panel-body">
                          <div className="form-group">
                            <input type="text" placeholder="From" name="from" defaultValue={this.state.data.investmentBudget && this.state.data.investmentBudget.from ? this.state.data.investmentBudget.from : ""} className="form-control float-label"  onBlur={this.handleBudgetBlur.bind(this)} />
                            <FontAwesome name='unlock' className="input_icon un_lock" id="isFromPrivate" onClick={this.onBudgetClick.bind(this, "from", "isFromPrivate")} />
                          </div>
                          <div className="form-group">
                            <input type="text" placeholder="To" name="to" defaultValue={this.state.data.investmentBudget && this.state.data.investmentBudget.to ? this.state.data.investmentBudget.to : ""} className="form-control float-label"  onBlur={this.handleBudgetBlur.bind(this)} />
                            <FontAwesome name='unlock' className="input_icon un_lock" id="isToPrivate" onClick={this.onBudgetClick.bind(this, "to", "isToPrivate")} />
                          </div>
                        </div>
                      </div>


                      <div className="clearfix"></div>
                      <div className="panel panel-default">
                        <div className="panel-heading"> Source of Investment:</div>

                        <div className="panel-body">
                          <div className="input_types">
                            <input id="radio1" type="radio" name="radio" value="1" defaultChecked={personal} onChange={this.onSelectInvestmentFrom.bind(this, 'PERSONAL')} /><label
                              htmlFor="radio1"><span><span></span></span>Personal</label>
                          </div>
                          <div className="input_types">
                            <input id="radio2" type="radio" name="radio" value="2" defaultChecked={familyFund} onChange={this.onSelectInvestmentFrom.bind(this, 'FAMILY FUND')} /><label
                              htmlFor="radio2"><span><span></span></span>Family Fund</label>
                          </div>
                        </div>
                      </div>
                      <div className="clearfix"></div>
                      <div className="form-group">
                        <input type="text" placeholder="Number of Investments" name="investmentCount" defaultValue={this.state.data.investmentCount} className="form-control float-label"  onBlur={this.handleBlur} />
                        <FontAwesome name='unlock' className="input_icon un_lock" id="isInvestmentCountPrivate" onClick={this.onClick.bind(this, "investmentCount", "isInvestmentCountPrivate")} />
                      </div>
                      <div className="form-group mandatory">
                        <input type="text" placeholder="Phone No" name="mobileNumber" defaultValue={this.state.data.mobileNumber} className="form-control float-label"  onBlur={this.handleBlur} disabled="disabled" />
                        <FontAwesome name='unlock' className="input_icon un_lock" id="isMobileNumberPrivate" onClick={this.onClick.bind(this, "mobileNumber", "isMobileNumberPrivate")} />
                      </div>

                      <div className="form-group mandatory">
                        <input type="text" placeholder="Email Id" name="emailId" defaultValue={this.state.data.emailId} className="form-control float-label"  onBlur={this.handleBlur} disabled="disabled" />
                        <FontAwesome name='unlock' className="input_icon un_lock" id="isEmailIdPrivate" onClick={this.onClick.bind(this, "emailId", "isEmailIdPrivate")} />
                      </div>

                      <div className="form-group">
                        <input type="text" placeholder="Facebook Id" name="facebookUrl" defaultValue={this.state.data.facebookUrl} className="form-control float-label"  onBlur={this.handleBlur} />
                        <FontAwesome name='unlock' className="input_icon un_lock" id="isFacebookUrlPrivate" onClick={this.onClick.bind(this, "facebookUrl", "isFacebookUrlPrivate")} />
                      </div>

                      <div className="form-group">
                        <input type="text" placeholder="LinkedIn URL" name="linkedinUrl" defaultValue={this.state.data.linkedinUrl} className="form-control float-label"  onBlur={this.handleBlur} />
                        <FontAwesome name='unlock' className="input_icon un_lock" id="isLinkedinUrlPrivate" onClick={this.onClick.bind(this, "linkedinUrl", "isLinkedinUrlPrivate")} />
                      </div>

                      {/*<div className="form-group">*/}
                      {/*<input type="text" placeholder="Twitter Id" className="form-control float-label"*/}
                      {/*/>*/}
                      {/*<input type="text" placeholder="Gender" name="gender" defaultValue={this.state.data.gender} className="form-control float-label"  onBlur={this.handleBlur}/>*/}
                      {/*<FontAwesome name='unlock' className="input_icon un_lock" id="isGenderPrivate" onClick={this.onClick.bind(this, "isGenderPrivate")}/><input type="checkbox" className="lock_input" id="makePrivate" checked={this.state.data.isGenderPrivate}/>*/}
                      {/*</div>*/}

                      {/*<div className="form-group">*/}
                      {/*<input type="text" placeholder="Googleplus Id" className="form-control float-label"*/}
                      {/*/>*/}
                      {/*<input type="text" placeholder="Gender" name="gender" defaultValue={this.state.data.gender} className="form-control float-label"  onBlur={this.handleBlur}/>*/}
                      {/*<FontAwesome name='unlock' className="input_icon un_lock" id="isGenderPrivate" onClick={this.onClick.bind(this, "isGenderPrivate")}/><input type="checkbox" className="lock_input" id="makePrivate" checked={this.state.data.isGenderPrivate}/>*/}
                      {/*</div>*/}
                    </form>
                  </div>

                </div>
                <br className="brclear" />

            </div>
          </div>
        )}
      </div>
    )
  }
};
MlFunderAbout.contextTypes = {
  funderPortfolio: PropTypes.object,
  portfolioKeys: PropTypes.object,
};
