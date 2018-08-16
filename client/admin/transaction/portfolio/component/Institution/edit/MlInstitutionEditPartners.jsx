import React, {Component, PropTypes} from "react";
import ScrollArea from "react-scrollbar";
import {Popover, PopoverContent, PopoverTitle} from "reactstrap";
import {dataVisibilityHandler, OnLockSwitch, initalizeFloatLabel} from "../../../../../../../client/admin/utils/formElemUtil";
import _ from "lodash";
import {multipartASyncFormHandler} from "../../../../../../../client/commons/MlMultipartFormAction";
import {fetchInstitutionDetailsHandler} from "../../../actions/findPortfolioInstitutionDetails";
import {fetchPortfolioActionHandler} from '../../../actions/findClusterIdForPortfolio'
import {putDataIntoTheLibrary} from '../../../../../../commons/actions/mlLibraryActionHandler';
var FontAwesome = require('react-fontawesome');
var Select = require('react-select');
import MlLoader from '../../../../../../commons/components/loader/loader'
import gql from 'graphql-tag'
import Moolyaselect from  '../../../../../commons/components/MlAdminSelectWrapper'
import generateAbsolutePath from '../../../../../../../lib/mlGenerateAbsolutePath';
import Confirm from '../../../../../../commons/utils/confirm';
const KEY = "partners"

export default class MlInstitutionEditPartners extends React.Component {
  constructor(props, context) {
    super(props);
    this.state = {
      loading: false,
      data: {},
      partners: [],
      partnersList: [],
      popoverOpenP: false,
      selectedIndex: -1,
      selectedVal: null,
      selectedObject: "default",
      title:'',
      clusterId:'',
      privateKeys:[],
      privateKey:{},
      fileName:""
    }
    this.curSelectLogo = {};
    this.handleBlur.bind(this);
    this.onSavePartnerAction.bind(this);
    this.libraryAction.bind(this);
    return this;
  }

  componentDidUpdate() {
    OnLockSwitch();
    dataVisibilityHandler();
    initalizeFloatLabel();
  }

  componentDidMount() {
    OnLockSwitch();
    dataVisibilityHandler();
    var WinWidth = $(window).width();
    var WinHeight = $(window).height();
    var className = this.props.isAdmin?"admin_header":"app_header"
    setTimeout (function(){
      $('.main_wrap_scroll').height(WinHeight-($('.'+className).outerHeight(true)+120));
      if(WinWidth > 768){
        $(".main_wrap_scroll").mCustomScrollbar({theme:"minimal-dark"});
      }
    },200);
  }

  componentWillMount() {
    this.fetchClusterId();
    const resp= this.fetchPortfolioDetails();
    return resp;
  }
  async fetchClusterId() {
    const response = await fetchPortfolioActionHandler(this.props.portfolioDetailsId);
    if (response) {
      this.setState({loading: false, clusterId: response.clusterId});
    }
  }
  async fetchPortfolioDetails() {
    let that = this;
    let portfolioDetailsId=that.props.portfolioDetailsId;
    let empty = _.isEmpty(that.context.institutionPortfolio && that.context.institutionPortfolio.partners)
    const response = await fetchInstitutionDetailsHandler(portfolioDetailsId, KEY);
    if(empty){
      if (response && response.partners && response.partners.length>0) {
        this.setState({loading: false, partners: response.partners, partnersList: response.partners});
      }else{
        this.setState({loading:false})
      }
    }else{
      this.setState({loading: false, partners: that.context.institutionPortfolio.partners, partnersList: that.context.institutionPortfolio.partners});
    }
    this.institutionPartnerServer = response && response.partners?response.partners:[]
  }

  onLockChange(fieldName, field, e) {
    let details = this.state.data || {};
    let key = e.target.id;
    var isPrivate = false;
    details = _.omit(details, [key]);
    let className = e.target.className;
    if (className.indexOf("fa-lock") != -1) {
      details = _.extend(details, {[key]: true});
      isPrivate = true;
    } else {
      details = _.extend(details, {[key]: false});
    }

    /*var privateKey = {keyName:fieldName, booleanKey:field, isPrivate:isPrivate, index:this.state.selectedIndex, tabName:this.state.selectedTab}
    this.setState({privateKey:privateKey})
    this.setState({data: details}, function () {
      this.sendDataToParent()
    })*/
    var privateKey = {keyName:fieldName, booleanKey:field, isPrivate:isPrivate, index:this.state.selectedIndex, tabName: this.props.tabName}
    // this.setState({privateKey:privateKey})
    this.setState({data: details, privateKey:privateKey}, function () {
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

  handleBlur(e) {
    let details = this.state.data;
    let name = e.target.name;
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
  onSavePartnerAction(e) {
    this.sendDataToParent(true)
    var setObject =  this.state.partners
    if(this.context && this.context.institutionPortfolio && this.context.institutionPortfolio.partners ){
      setObject = this.context.institutionPortfolio.partners
    }
    this.setState({partnersList:setObject, popoverOpenP: false})
    this.curSelectLogo = {}
  }

  addPartner() {
    this.setState({selectedObject: "default", popoverOpenP: !(this.state.popoverOpenP), data: {}})
    if (this.state.partners) {
      this.setState({selectedIndex: this.state.partners.length})
    } else {
      this.setState({selectedIndex: 0})
    }
  }

  optionsBySelectTitle(val){
    let data = _.cloneDeep(this.state.data);
    data.title=val;
    this.setState({data:data}, function () {
      // this.sendDataToParent();
    })
  }

  onStatusChangeNotify(e) {
    let updatedData = this.state.data || {};
    let key = e.target.id;
    updatedData = _.omit(updatedData, [key]);
    if (e.currentTarget.checked) {
      updatedData = _.extend(updatedData, {[key]: true});
    } else {
      updatedData = _.extend(updatedData, {[key]: false});
    }
    this.setState({data: updatedData}, function () {
      // this.sendDataToParent()
    })
  }

  onPartnerTileClick(index, uiIndex, e) {
    let cloneArray = _.cloneDeep(this.state.partners);
    //let details = cloneArray[index]
    let details = _.find(cloneArray,{index:index});
    details = _.omit(details, "__typename");
    this.curSelectLogo = details.logo
    this.setState({
      selectedIndex: index,
      data: details,
      selectedObject: uiIndex,
      // "selectedVal": details.typeOfFundingId
      popoverOpenP: !(this.state.popoverOpenP)},()=>{
      this.lockPrivateKeys(index)
    });

   /* setTimeout(function () {
      _.each(details.privateFields, function (pf) {
        $("#"+pf.booleanKey).removeClass('un_lock fa-unlock').addClass('fa-lock')
      })
    }, 10)*/


  }
  //todo:// context data connection first time is not coming have to fix
  lockPrivateKeys(selIndex) {
    var privateValues = this.institutionPartnerServer && this.institutionPartnerServer[selIndex] ? this.institutionPartnerServer[selIndex].privateFields : []
    var filterPrivateKeys = _.filter(this.context.portfolioKeys && this.context.portfolioKeys.privateKeys, {
      tabName: this.props.tabName,
      index: selIndex
    })
    var filterRemovePrivateKeys = _.filter(this.context.portfolioKeys && this.context.portfolioKeys.removePrivateKeys, {
      tabName: this.props.tabName,
      index: selIndex
    })
    var finalKeys = _.unionBy(filterPrivateKeys, privateValues, 'booleanKey')
    var keys = _.differenceBy(finalKeys, filterRemovePrivateKeys, 'booleanKey')
    _.each(keys, function (pf) {
      $("#" + pf.booleanKey).removeClass('un_lock fa-unlock').addClass('fa-lock')
    })
  }

  getActualIndex(dataArray, checkIndex){
    var response = _.findIndex(dataArray, {index: checkIndex});
    response = response >= 0 ? response : checkIndex;
    return response;
  }

  sendDataToParent(isSaveClicked) {
    let data = this.state.data;
    selectedTab = this.state.selectedTab;

    let fun = this.state.partners;
    let partners = _.cloneDeep(fun);
    data.index = this.state.selectedIndex;
    data.logo = this.curSelectLogo;
    if(isSaveClicked){
      const actualIndex = this.getActualIndex(partners, this.state.selectedIndex);
      partners[actualIndex] = data;
    }
    let arr = [];
    _.each(partners, function (item) {
      for (var propName in item) {
        if (item[propName] === null || item[propName] === undefined) {
          delete item[propName];
        }
      }
      let newItem = _.omit(item, "__typename");
      newItem =_.omit(newItem,"privateFields");
      // let updateItem = _.omit(newItem, 'logo');
      arr.push(newItem)
    })
    partners = arr;
    // funderPartner=_.omit(funderPartner,["privateFields"]);
    console.log('partners', partners)
    this.setState({partners: partners})
    this.props.getPartnersDetails(partners, this.state.privateKey);


  }

  onPartnerLogoFileUpload(e) {
    if (e.target.files[0].length == 0)
      return;
    let file = e.target.files[0];
    let fileName = e.target.files[0].name;
    this.setState({fileName: fileName})
    let data = {
      moduleName: "PORTFOLIO",
      actionName: "UPLOAD",
      portfolioDetailsId: this.props.portfolioDetailsId,
      portfolio: {partners: [{logo: {fileUrl: '', fileName: fileName}, index: this.state.selectedIndex}]}
    };
    let response = multipartASyncFormHandler(data, file, 'registration', this.onFileUploadCallBack.bind(this,file));
  }

  onFileUploadCallBack(file,resp) {
    if (resp) {
      let result = JSON.parse(resp)

      Confirm('', "Do you want to add this file to your library?", 'Yes', 'No',(ifConfirm)=>{
        if(ifConfirm){
          let fileObjectStructure = {
            fileName: this.state.fileName,
            fileType: file&&file.type?file.type:"",
            fileUrl: result.result,
            libraryType: "image"
          }
          this.libraryAction(fileObjectStructure)
        }
      });

      if (result.success) {
        this.curSelectLogo = {
          fileName: file && file.name ? file.name : "",
          fileUrl: result.result
        };
        toastr.success("Photo Updated Successfully");
        // this.setState({loading: true})
        // this.fetchOnlyImages();
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

  async fetchOnlyImages() {
    let portfolioDetailsId = this.props.portfolioDetailsId;
    const response = await fetchInstitutionDetailsHandler(portfolioDetailsId, KEY);
    if (response && response.partners && !_.isEmpty(response.partners)) {
      let thisState = this.state.selectedIndex;
      let dataDetails = this.state.partners
      let cloneBackUp = _.cloneDeep(dataDetails);
      let specificData = cloneBackUp[thisState];
      if (specificData) {
        let curUpload = response.partners[thisState]
        specificData['logo'] = curUpload['logo']
        this.setState({loading: false, partners: cloneBackUp, principalContext:"active", teamContext:""});
      } else {
        this.setState({loading: false, principalContext:"active", teamContext:""})
      }
    }
  }

  render() {
    let titlequery=gql`query($type:String,$hierarchyRefId:String){
     data: fetchMasterSettingsForPlatFormAdmin(type:$type,hierarchyRefId:$hierarchyRefId) {
     label
     value
     }
     }
     `;
    let titleOption={options: { variables: {type : "TITLE",hierarchyRefId:this.state.clusterId}}};
    let that = this;
    const showLoader = that.state.loading;

    return (
      <div>
        {showLoader === true ? (<MlLoader/>) : (
          <div className="portfolio-main-wrap">
          <h2>Partners</h2>
            <div className="main_wrap_scroll">
              
                <div className="col-lg-12">
                  <div className="row">
                    <div className="col-lg-2 col-md-4 col-sm-4" onClick={this.addPartner.bind(this)}>
                      <a href="" id="create_clientPdefault" data-placement="top" data-class="large_popover">
                        <div className="list_block notrans">
                          <div className="hex_outer"><span className="ml ml-plus "></span></div>
                          <h3>Add New Partner</h3>
                        </div>
                      </a>
                    </div>
                    {that.state.partnersList.map(function (principal, idx) {
                      return (
                        <div className="col-lg-2 col-md-4 col-sm-4" key={idx}>
                          <div href="" id={"create_clientP" + idx}>
                            <div className="list_block notrans funding_list"
                                 onClick={that.onPartnerTileClick.bind(that,principal.index, idx)}>
                              <FontAwesome name='unlock'  id="makePrivate" defaultValue={principal.makePrivate}/><input type="checkbox" className="lock_input" id="isAssetTypePrivate" checked={principal.makePrivate}/>
                              <div className="cluster_status inactive_cl"><FontAwesome name='trash-o'/></div>
                              <img src={principal.logo ? generateAbsolutePath(principal.logo.fileUrl) : "/images/def_profile.png"}/>
                              <div>
                                <p>{principal.firstName}</p><p className="small">{principal.designation}</p></div>
                              <div className="ml_icon_btn">
                                <a href="" className="save_btn"><FontAwesome name='facebook'/></a>
                                <a href="" className="save_btn"><FontAwesome name='twitter'/></a>
                                <a href="" className="save_btn"><FontAwesome name='linkedin'/></a>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}

                  </div>
                </div>
              

              <Popover placement="right" isOpen={this.state.popoverOpenP}
                       target={"create_clientP" + this.state.selectedObject} toggle={this.toggle}>
                <PopoverTitle> Add New Partner </PopoverTitle>
                <PopoverContent>
                  <div className="ml_create_client">
                    <div className="medium-popover">
                      <div className="row">
                        <div className="col-md-12">
                          {this.state.selectedObject != "default"?
                            <div className="form-group">
                              <div className="fileUpload mlUpload_btn">
                                <span>Upload Pic</span>
                                <input type="file" className="upload" onChange={this.onPartnerLogoFileUpload.bind(this)}/>
                              </div>
                              <div className="previewImg ProfileImg">
                                <img src={this.state.data.logo ? generateAbsolutePath(this.state.data.logo.fileUrl) : "/images/def_profile.png"}/>
                              </div>
                            </div>:<div></div>
                          }
                          <br className="brclear" />
                          <div className="form-group">
                            <Moolyaselect multiSelect={false} placeholder="Title" className="form-control float-label" valueKey={'value'} labelKey={'label'}  selectedValue={this.state.data.title} queryType={"graphql"} query={titlequery}  queryOptions={titleOption} onSelect={that.optionsBySelectTitle.bind(this)} isDynamic={true}/>
                          </div>
                          <div className="form-group">
                            <input type="text" placeholder="First Name" name="firstName"
                                   defaultValue={this.state.data.firstName} className="form-control float-label"
                                   id="cluster_name" onBlur={this.handleBlur.bind(this)}/>
                            <FontAwesome name='unlock' className="input_icon un_lock" id="isFirstNamePrivate"
                                         onClick={this.onLockChange.bind(this, "firstName","isFirstNamePrivate")}/>
                          </div>

                          <div className="form-group">
                            <input type="text" placeholder="Last Name" name="lastName"
                                   defaultValue={this.state.data.lastName} className="form-control float-label"
                                   id="cluster_name" onBlur={this.handleBlur.bind(this)}/>
                            <FontAwesome name='unlock' className="input_icon un_lock" id="isLastNamePrivate"
                                         onClick={this.onLockChange.bind(this, "lastName","isLastNamePrivate")}/>
                          </div>
                          <div className="form-group">
                            <input type="text" placeholder="Designation" name="designation"
                                   defaultValue={this.state.data.designation}
                                   className="form-control float-label" onBlur={this.handleBlur.bind(this)}/>
                            <FontAwesome name='unlock' className="input_icon un_lock" id="isDesignationPrivate"
                                         onClick={this.onLockChange.bind(this, "designation", "isDesignationPrivate")}/>
                          </div>
                          <div className="form-group">
                            <input type="text" placeholder="Company Name" name="partnerCompanyName"
                                   defaultValue={this.state.data.partnerCompanyName}
                                   className="form-control float-label" onBlur={this.handleBlur.bind(this)}/>
                            <FontAwesome name='unlock' className="input_icon un_lock" id="isCompanyNamePrivate"
                                         onClick={this.onLockChange.bind(this,"partnerCompanyName", "isCompanyNamePrivate")}/>

                          </div>

                          <div className="form-group">
                            <input type="text" placeholder="Duration in years" name="duration"
                                   defaultValue={this.state.data.duration}
                                   className="form-control float-label" onBlur={this.handleBlur.bind(this)}/>
                            <FontAwesome name='unlock' className="input_icon" id="isDurationPrivate"
                                         onClick={this.onLockChange.bind(this, "duration", "isDurationPrivate")}/>

                          </div>
                          <div className="form-group">
                            <input type="text" placeholder="Years of Experience" name="yearsOfExperience"
                                   defaultValue={this.state.data.yearsOfExperience}
                                   className="form-control float-label" onBlur={this.handleBlur.bind(this)}/>
                            <FontAwesome name='unlock' className="input_icon un_lock" id="isYearsOfExperiencePrivate"
                                         onClick={this.onLockChange.bind(this,"yearsOfExperience", "isYearsOfExperiencePrivate")}/>

                          </div>
                          <div className="form-group">
                            <input type="text" placeholder="Qualification" name="qualification"
                                   defaultValue={this.state.data.qualification}
                                   className="form-control float-label" onBlur={this.handleBlur.bind(this)}/>
                            <FontAwesome name='unlock' className="input_icon un_lock" id="isQualificationPrivate"
                                         onClick={this.onLockChange.bind(this, "qualification", "isQualificationPrivate")}/>

                          </div>
                          <div className="form-group">
                            <input type="text" placeholder="About" name="aboutPartner"
                                   defaultValue={this.state.data.aboutPartner}
                                   className="form-control float-label" onBlur={this.handleBlur.bind(this)}/>
                            <FontAwesome name='unlock' className="input_icon un_lock" id="isAboutPartnerPrivate"
                                         onClick={this.onLockChange.bind(this,"aboutPartner", "isAboutPartnerPrivate")}/>

                          </div>
                          <div className="form-group">
                            <input type="text" placeholder="LinkedIn" className="form-control float-label"/>
                            <FontAwesome name="linkedin-square" className="password_icon"/>
                          </div>
                          <div className="clearfix"></div>
                          <div className="form-group">
                            <div className="input_types"><input id="makePrivate" type="checkbox" checked={this.state.data.makePrivate&&this.state.data.makePrivate}  name="checkbox" onChange={this.onStatusChangeNotify.bind(this)}/><label htmlFor="checkbox1"><span></span>Make Private</label></div>
                          </div>
                          {/*<div className="form-group">*/}
                          {/*<input type="text" placeholder="Facebook" className="form-control float-label"  />*/}
                          {/*<FontAwesome name="facebook-square" className="password_icon"/>*/}
                          {/*</div>*/}
                          {/*<div className="form-group">*/}
                          {/*<input type="text" placeholder="twitter" className="form-control float-label"  />*/}
                          {/*<FontAwesome name="twitter-square" className="password_icon"/>*/}
                          {/*</div>*/}
                          {/*<div className="form-group">*/}
                          {/*<input type="text" placeholder="Youtube" className="form-control float-label"  />*/}
                          {/*<FontAwesome name="youtube-square" className="password_icon"/>*/}
                          {/*</div>*/}
                          {/*<div className="form-group">*/}
                          {/*<input type="text" placeholder="Google plus" className="form-control float-label"  />*/}
                          {/*<FontAwesome name="google-plus-square" className="password_icon"/>*/}
                          {/*</div>*/}
                          <div className="ml_btn" style={{'textAlign': 'center'}}>
                            <a className="save_btn" onClick={this.onSavePartnerAction.bind(this)}>Save</a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>)}
      </div>
    )
  }
};
MlInstitutionEditPartners.contextTypes = {
  institutionPortfolio: PropTypes.object,
  portfolioKeys :PropTypes.object
};
