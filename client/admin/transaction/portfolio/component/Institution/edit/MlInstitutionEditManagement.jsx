import React, { Component, PropTypes }  from "react";
import gql from 'graphql-tag'
import moment from "moment";
import _ from 'lodash';
import Datetime from "react-datetime";
var Select = require('react-select');
var FontAwesome = require('react-fontawesome');
import {dataVisibilityHandler, OnLockSwitch,initalizeFloatLabel} from '../../../../../utils/formElemUtil';
import {putDataIntoTheLibrary} from '../../../../../../commons/actions/mlLibraryActionHandler'
import {fetchInstitutionDetailsHandler} from '../../../actions/findPortfolioInstitutionDetails'
import {multipartASyncFormHandler} from '../../../../../../commons/MlMultipartFormAction'
import MlLoader from '../../../../../../commons/components/loader/loader'
import Moolyaselect from  '../../../../../commons/components/MlAdminSelectWrapper'
import {fetchPortfolioActionHandler} from '../../../actions/findClusterIdForPortfolio'
import {mlFieldValidations} from "../../../../../../commons/validations/mlfieldValidation";
import generateAbsolutePath from '../../../../../../../lib/mlGenerateAbsolutePath';
import Confirm from '../../../../../../commons/utils/confirm';

const KEY = 'management';
export default class MlInstitutionEditManagement extends Component{
  constructor(props, context){
    super(props);
    this.state={
      loading: true,
      data:{},
      privateKey:{},
      institutionManagement:[],
      institutionManagementList:[],
      selectedIndex:-1,
      title:'',
      clusterId:'',
      managementIndex:"",
      responseImage:"",
      gender:null,
    };
    this.curSelectLogo = {}
    this.tabName = this.props.tabName || ""
    this.onSaveAction = this.onSaveAction.bind(this);
    this.onClick.bind(this);
    this.handleBlur.bind(this);
    this.addManagement.bind(this);
    this.onSelectUser.bind(this);
    this.fetchPortfolioDetails.bind(this);
    this.libraryAction.bind(this);
    return this;
  }

  componentDidMount()
  {
    OnLockSwitch();
    dataVisibilityHandler();
    $('#testing').click(function(){
      $('#management-form').slideDown();
    });


  }
  componentDidUpdate()
  {
    initalizeFloatLabel();
    OnLockSwitch();
    dataVisibilityHandler();

    var className = this.props.isAdmin?"admin_header":"app_header"
    var WinWidth = $(window).width();
    var WinHeight = $(window).height();
    // $('.main_wrap_scroll').height(WinHeight-($('.admin_header').outerHeight(true)+120));
    $('.main_wrap_scroll').height(WinHeight-($('.'+className).outerHeight(true)+120));
    if(WinWidth > 768){
      $(".main_wrap_scroll").mCustomScrollbar({theme:"minimal-dark"});}
  }
  componentWillMount(){
    this.fetchPortfolioDetails();
    this.fetchClusterId();
  }
  addManagement(){
    this.setState({loading:true})
    if(this.state.institutionManagement){
      this.setState({selectedIndex:this.state.institutionManagement.length})
    }else{
      this.setState({selectedIndex:0})
    }
    this.setState({data:{}}, function () {
      this.setState({loading:false}, function () {
        $('#management-form').slideDown();
      })
    })
    // this.setState({data:{}})
    // $('#management-form').slideDown();
  }
  onSelectUser(index, uiIndex, e) {
    this.setState({loading:true})
    //let managmentDetails = this.state.institutionManagement[index]
    let managmentDetails = _.find(this.state.institutionManagement,{index:index});
    managmentDetails = _.omit(managmentDetails, "__typename");
    // this.setState({selectedIndex:index});
    this.setState({selectedIndex:index, data:managmentDetails}, function () {
      this.setState({loading:false}, function () {
        $('#management-form').slideDown();
        this.lockPrivateKeys(index);
      })
    })
    // setTimeout(function () {
    //   _.each(managmentDetails.privateFields, function (pf) {
    //     $("#"+pf.booleanKey).removeClass('un_lock fa-unlock').addClass('fa-lock')
    //   })
    // }, 10)
    this.curSelectLogo = managmentDetails.logo
  }
  optionsBySelectTitle(val){
    let data = _.cloneDeep(this.state.data);
    data.title=val;
    this.setState({data:data}, function () {
      // this.sendDataToParent();
    })
  }
  async fetchClusterId() {
    const response = await fetchPortfolioActionHandler(this.props.portfolioDetailsId);
    if (response) {
      this.setState({loading: false, clusterId: response.clusterId});
    }
  }

  onClick(fieldName, field, e) {
    var isPrivate = false
    let className = e.target.className;
    if (className.indexOf("fa-lock") != -1) {
      isPrivate = true;
    }
    var privateKey = {
      keyName: fieldName,
      booleanKey: field,
      isPrivate: isPrivate,
      index: this.state.selectedIndex,
      tabName: KEY
    }
    this.setState({privateKey: privateKey}, function () {
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
          // this.sendDataToParent()
        })
      }
    } else {
      details = _.omit(details, [name]);
      details = _.extend(details, {[name]: e.target.value});
      this.setState({data: details}, function () {
        // this.sendDataToParent()
      })
    }
  }

  async fetchPortfolioDetails() {
    let that = this;
    let portfoliodetailsId=that.props.portfolioDetailsId;
    let empty = _.isEmpty(that.context.institutionPortfolio && that.context.institutionPortfolio.management)
    const response = await fetchInstitutionDetailsHandler(portfoliodetailsId, KEY);
    if(empty){
      if (response && response.management) {
        this.setState({loading: false, institutionManagement: response.management, institutionManagementList: response.management});
        // this.fetchOnlyImages()
      }else{
        this.setState({loading:false})
      }
    }else{
      this.setState({loading: false, institutionManagement: that.context.institutionPortfolio.management, institutionManagementList:that.context.institutionPortfolio.management});
    }
    this.institutionManagementServer = response && response.management ? response.management : [];
  }

  onDateChange(name, event) {
    if (event._d) {
      let value = moment(event._d).format('DD-MM-YYYY');
      let details =this.state.data;
      details=_.omit(details,[name]);
      details=_.extend(details,{[name]:value});
      this.setState({data:details}, function () {
        // this.sendDataToParent()
      })
    }
  }

  //todo:// context data connection first time is not coming have to fix
  lockPrivateKeys(selIndex) {
    var privateValues = this.institutionManagementServer && this.institutionManagementServer[selIndex] ? this.institutionManagementServer[selIndex].privateFields : []
    var filterPrivateKeys = _.filter(this.context.portfolioKeys && this.context.portfolioKeys.privateKeys, { tabName: this.props.tabName, index: selIndex })
    var filterRemovePrivateKeys = _.filter(this.context.portfolioKeys && this.context.portfolioKeys.removePrivateKeys, { tabName: this.props.tabName, index: selIndex })
    var finalKeys = _.unionBy(filterPrivateKeys, privateValues, 'booleanKey')
    var keys = _.differenceBy(finalKeys, filterRemovePrivateKeys, 'booleanKey')
    console.log('keysssssssssssssss', keys)
    _.each(keys, function (pf) {
      $("#" + pf.booleanKey).removeClass('un_lock fa-unlock').addClass('fa-lock')
    })
  }

  onSaveAction() {
    const requiredFields = this.getFieldValidations();
    if (requiredFields && !requiredFields.errorMessage) {
      this.sendDataToParent(true)
    }else {
      toastr.error(requiredFields.errorMessage);
      return
    }
    var setObject = this.state.institutionManagementList
    if (this.context && this.context.institutionPortfolio && this.context.institutionPortfolio.management) {
      setObject = this.context.institutionPortfolio.management
    }
    this.setState({institutionManagementList: setObject}, () => {
      $('#management-form').slideUp();
    })
    this.curSelectLogo = {}
  }

  getFieldValidations() {
    const ret = mlFieldValidations(this.refs);
    return {tabName: this.tabName, errorMessage: ret, index: this.state.selectedIndex}
  }
  getActualIndex(dataArray, checkIndex){
    var response = _.findIndex(dataArray, {index: checkIndex});
    response = response >= 0 ? response : checkIndex;
    return response;
  }
  sendDataToParent(isSaveClicked){
    let data = this.state.data;
    let institutionManagement1 = this.state.institutionManagement;
    let institutionManagement = _.cloneDeep(institutionManagement1);
    data.index = this.state.selectedIndex;
    data.logo = this.curSelectLogo;
    if(isSaveClicked){
      const actualIndex = this.getActualIndex(institutionManagement, this.state.selectedIndex);
      institutionManagement[actualIndex] = data;
    }
    let managementArr = [];
    _.each(institutionManagement, function (item) {
      for (var propName in item) {
        if (item[propName] === null || item[propName] === undefined || propName === 'privateFields') {
          delete item[propName];
        }
      }
      item = _.omit(item, "__typename");
      let newItem = _.omit(item, 'privateFields');
      // if(item && item.logo){
      //   newItem = _.omit(item, 'logo')
      // }
      managementArr.push(newItem)
    })
    institutionManagement = managementArr;
    this.setState({institutionManagement:institutionManagement})
    this.props.getManagementDetails(institutionManagement, this.state.privateKey)
  }

  onLogoFileUpload(e){
    if(e.target.files[0].length ==  0)
      return;
    let file = e.target.files[0];
    let name = e.target.name;
    let fileName = e.target.files[0].name;
    let data ={moduleName: "PORTFOLIO", actionName: "UPLOAD", portfolioDetailsId:this.props.portfolioDetailsId, portfolio:{management:[{logo:{fileUrl:'', fileName : fileName}, index:this.state.selectedIndex}]}};
    let response = multipartASyncFormHandler(data,file,'registration',this.onFileUploadCallBack.bind(this, name, file));
  }
  onFileUploadCallBack(name,file, resp){
    let that = this;
    let details =this.state.data;
    if(resp){
      let result = JSON.parse(resp)
      Confirm('', "Do you want to add this file to your library?", 'Yes', 'No',(ifConfirm)=>{
        if(ifConfirm){
          let fileObjectStructure = {
            fileName: file.name,
            fileType: file.type,
            fileUrl: result.result,
            libraryType: "image"
          }
          this.libraryAction(fileObjectStructure)
        }
      });

      this.curSelectLogo = {
        fileName: file && file.name ? file.name : "",
        fileUrl: result.result
      }
      var temp = $.parseJSON(resp).result;
      details=_.omit(details,[name]);
      details=_.extend(details,{[name]:{fileName: file.fileName,fileUrl: temp}});
      that.setState({data: details,responseImage: temp}, function () {
        that.sendDataToParent()
      })
      // if(result.success){
      //   that.setState({loading:true})
      //   that.fetchOnlyImages();
      // }
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


  // async fetchOnlyImages(){
  //   const response = await fetchInstitutionDetailsHandler(this.props.portfolioDetailsId, KEY);
  //   if (response) {
  //     this.setState({loading:false})
  //     let thisState=this.state.selectedIndex;
  //     let dataDetails =this.state.institutionManagement
  //     let cloneBackUp = _.cloneDeep(dataDetails);
  //     let specificData = cloneBackUp[thisState];
  //     if(specificData){
  //       let curUpload=response[thisState]
  //       specificData['logo']= curUpload['logo']?curUpload['logo']: " "
  //       this.setState({loading: false, institutionManagement:cloneBackUp, data: specificData}, function () {
  //         $('#management-form').slideDown();
  //       });
  //     }else {
  //       this.setState({loading: false})
  //     }
  //   }
  // }
  optionsBySelectGender(val){
    this.setState({gender:val.value})
  }

  render(){
    let titlequery=gql`query($type:String,$hierarchyRefId:String){
     data: fetchMasterSettingsForPlatFormAdmin(type:$type,hierarchyRefId:$hierarchyRefId) {
     label
     value
     }
     }
     `;
    let titleOption={options: { variables: {type : "TITLE",hierarchyRefId:this.state.clusterId}}};

    let genderValues = [
      {value: 'male', label: 'Male'},
      {value: 'female', label: 'Female'},
      {value: 'others', label: 'Others'}
    ];

    var yesterday = Datetime.moment().subtract(0,'day');
    var valid = function( current ){
      return current.isBefore( yesterday );
    };
    let that = this;
    const showLoader = that.state.loading;
    let managementArr = that.state.institutionManagementList || [];
    return (
      <div>
        {showLoader === true ? (<MlLoader/>) : (
          <div>
            <h2>Management</h2>
            <div className="main_wrap_scroll">

              <div className="col-lg-12">
                <div className="row">
                  <div className="col-lg-2 col-md-3 col-sm-3">
                    <a href="" id="testing">
                      <div className="list_block notrans" onClick={this.addManagement.bind(this)}>
                        <div className="hex_outer"><span className="ml ml-plus "></span></div>
                        <h3>Add New</h3>
                      </div>
                    </a>
                  </div>
                  {managementArr.map(function (user, index) {
                    return (
                      <div className="col-lg-2 col-md-3 col-sm-3" key={index}>
                        <div className="list_block notrans" onClick={that.onSelectUser.bind(that,user.index, index)}>
                          <div className="hex_outer"><img src={user.logo ? generateAbsolutePath(user.logo.fileUrl) : "/images/def_profile.png"}/></div>
                          <h3>{user.firstName?user.firstName:""}</h3>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div id="management-form" className=" management-form-wrap" style={{'display':'none'}}>
                <div className="col-md-6 nopadding-left">
                  <div className="form_bg">
                    <form>
                      <div className="form-group">
                        <Moolyaselect multiSelect={false} placeholder="Title" className="form-control float-label" valueKey={'value'} labelKey={'label'}
                                      selectedValue={this.state.data.title} queryType={"graphql"} query={titlequery}  queryOptions={titleOption}
                                      onSelect={that.optionsBySelectTitle.bind(this)} isDynamic={true}/>

                      </div>
                      <div className="form-group mandatory">
                        <input type="text" placeholder="First Name" name="firstName"
                               defaultValue={this.state.data.firstName} className="form-control float-label"
                               onBlur={this.handleBlur.bind(this)} ref={"firstName"} data-required={true} data-errMsg="First Name is required"/>
                        <FontAwesome name='unlock' className="input_icon un_lock" id="isFirstNamePrivate" onClick={this.onClick.bind(this, "firstName", "isFirstNamePrivate")}/>
                      </div>

                      <div className="form-group">
                        <input type="text" placeholder="Middle Name" name="middleName" defaultValue={this.state.data.middleName} className="form-control float-label"   onBlur={this.handleBlur.bind(this)}/>
                        <FontAwesome name='unlock' className="input_icon un_lock" id="isMiddleNamePrivate" onClick={this.onClick.bind(this, "middleName", "isMiddleNamePrivate")}/>
                      </div>

                      <div className="form-group mandatory">
                        <input type="text" placeholder="Last Name" name="lastName"
                               defaultValue={this.state.data.lastName} className="form-control float-label"
                               onBlur={this.handleBlur.bind(this)} ref={"lastName"} data-required={true}
                               data-errMsg="Last Name is required"/>
                        <FontAwesome name='unlock' className="input_icon un_lock" id="isLastNamePrivate" onClick={this.onClick.bind(this, "lastName", "isLastNamePrivate")}/>
                      </div>
                      <div className="form-group mandatory">
                        <Select name="form-field-name" ref={"gender"} placeholder="Select Gender"
                                value={this.state.gender} options={genderValues}
                                onChange={this.optionsBySelectGender.bind(this)} className="float-label"
                                data-required={true} data-errMsg="Gender is required"/>
                        <FontAwesome name='unlock' className="input_icon un_lock" id="isGenderPrivate" onClick={this.onClick.bind(this, "gender", "isGenderPrivate")}/><input type="checkbox" className="lock_input" id="makePrivate" checked={this.state.data.isGenderPrivate}/>

                      </div>

                      <div className="form-group mandatory">
                        <input type="text" placeholder="Designation" name="designation"
                               defaultValue={this.state.data.designation} className="form-control float-label"
                               onBlur={this.handleBlur.bind(this)} ref={"designation"} data-required={true}
                               data-errMsg="Designation is required"/>
                        <FontAwesome name='unlock' className="input_icon un_lock" id="isDesignationPrivate" onClick={this.onClick.bind(this, "designation", "isDesignationPrivate")}/>
                      </div>

                      <div className="form-group mandatory">
                        <input type="text" placeholder="Year of Experience" name="yearsOfExperience"
                               defaultValue={this.state.data.yearsOfExperience} className="form-control float-label"
                               onBlur={this.handleBlur.bind(this)} ref={"yearsOfExperience"} data-required={true}
                               data-errMsg="Year of Experience is required"/>
                        <FontAwesome name='unlock' className="input_icon un_lock" id="isYOFPrivate" onClick={this.onClick.bind(this, "yearsOfExperience", "isYOFPrivate")}/>
                      </div>

                      <div className="form-group date-pick-wrap">
                        {/*<input type="text" placeholder="Joining Date to this Company" name="joiningDate" defaultValue={this.state.data.joiningDate} className="form-control float-label"  onBlur={this.handleBlur.bind(this)}/>*/}
                        <Datetime dateFormat="DD-MM-YYYY" timeFormat={false}
                                  inputProps={{placeholder: "Joining Date to this Company",readOnly:true}}
                                  closeOnSelect={true} value={this.state.data.joiningDate}
                                  onChange={this.onDateChange.bind(this, "joiningDate")}  isValidDate={ valid }/>
                        <FontAwesome name='unlock' className="input_icon un_lock" id="isJoiningDatePrivate" onClick={this.onClick.bind(this, "joiningDate", "isJoiningDatePrivate")}/>
                      </div>

                      <div className="form-group date-pick-wrap">
                        {/*<input type="text" placeholder="First Job Joining Date" name="firstJobJoiningDate" defaultValue={this.state.data.firstJobJoiningDate} className="form-control float-label"  onBlur={this.handleBlur.bind(this)}/>*/}
                        <Datetime dateFormat="DD-MM-YYYY" timeFormat={false}
                                  inputProps={{placeholder: "First Job Joining Date",readOnly:true}}
                                  closeOnSelect={true} value={this.state.data.firstJobJoiningDate}
                                  onChange={this.onDateChange.bind(this, "firstJobJoiningDate")}  isValidDate={ valid }/>
                        <FontAwesome name='unlock' className="input_icon un_lock" id="isFJJDPrivate" onClick={this.onClick.bind(this, "firstJobJoiningDate", "isFJJDPrivate")}/>
                      </div>
                    </form>
                  </div>
                </div>
                <div className="col-md-6 nopadding-right">
                  <div className="form_bg">
                    <form>
                      <div className="form-group">
                        <div className="fileUpload mlUpload_btn">
                          <span>Upload Icon</span>
                          <input type="file" name="logo" id="logo" className="upload"  accept="image/*" onChange={this.onLogoFileUpload.bind(this)}  />
                        </div>
                        <div className="previewImg ProfileImg">
                          <img src={this.state.data && this.state.data.logo?generateAbsolutePath(this.state.data.logo.fileUrl):this.state.responseImage?generateAbsolutePath(this.state.responseImage):" "}/>
                        </div>
                      </div>
                      <br className="brclear"/>
                      <div className="form-group">
                        <input type="text" placeholder="Qualification" name="qualification" defaultValue={this.state.data.qualification} className="form-control float-label"  onBlur={this.handleBlur.bind(this)}/>
                        <FontAwesome name='unlock' className="input_icon un_lock" id="isQualificationPrivate" onClick={this.onClick.bind(this, "qualification", "isQualificationPrivate")}/>
                      </div>

                      <div className="form-group">
                        <input type="text" placeholder="Certification" name="certification" defaultValue={this.state.data.certification} className="form-control float-label"  onBlur={this.handleBlur.bind(this)}/>
                        <FontAwesome name='unlock' className="input_icon un_lock" id="isCertificationPrivate" onClick={this.onClick.bind(this, "certification", "isCertificationPrivate")}/>
                      </div>

                      <div className="form-group">
                        <input type="text" placeholder="Universities" name="universities" defaultValue={this.state.data.universities} className="form-control float-label"  onBlur={this.handleBlur.bind(this)}/>
                        <FontAwesome name='unlock' className="input_icon un_lock" id="isUniversitiesPrivate" onClick={this.onClick.bind(this, "universities", "isUniversitiesPrivate")}/>
                      </div>

                      <div className="form-group">
                        <input type="text" placeholder="Awards" name="awards" defaultValue={this.state.data.awards} className="form-control float-label"  onBlur={this.handleBlur.bind(this)}/>
                        <FontAwesome name='unlock' className="input_icon un_lock" id="isAwardsPrivate" onClick={this.onClick.bind(this, "awards", "isAwardsPrivate")}/>
                      </div>

                      <div className="form-group">
                        <input type="text" placeholder="LinkedIn URL" name="linkedInUrl" defaultValue={this.state.data.linkedInUrl} className="form-control float-label"  onBlur={this.handleBlur.bind(this)}/>
                        <FontAwesome name='unlock' className="input_icon un_lock" id="isLinkedInUrlPrivate" onClick={this.onClick.bind(this, "linkedInUrl", "isLinkedInUrlPrivate")}/>
                      </div>

                      <div className="form-group">
                        <input type="text" placeholder="About" name="managmentAbout" defaultValue={this.state.data.managmentAbout} className="form-control float-label"  onBlur={this.handleBlur.bind(this)}/>
                        <FontAwesome name='unlock' className="input_icon un_lock" id="isAboutPrivate" onClick={this.onClick.bind(this, "managmentAbout", "isAboutPrivate")}/>
                      </div>
                    </form>
                  </div>
                </div>
                <br className="brclear"/>
                <div className="ml_btn text-center" style={{'textAlign':'center'}}>
                  <a className="save_btn" onClick={this.onSaveAction}>Save</a>
                </div>
              </div>
            </div>
          </div>)}
      </div>
    )
  }
};
MlInstitutionEditManagement.contextTypes = {
  institutionPortfolio: PropTypes.object,
  portfolioKeys :PropTypes.object
};
