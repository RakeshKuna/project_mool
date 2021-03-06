import React, {Component, PropTypes} from "react";
import gql from "graphql-tag";
import _ from "lodash";
import Datetime from "react-datetime";
import ScrollArea from "react-scrollbar";
import {Popover, PopoverTitle, PopoverContent} from "reactstrap";
var FontAwesome = require('react-fontawesome');
import {dataVisibilityHandler, OnLockSwitch, initalizeFloatLabel} from "../../../../../utils/formElemUtil";
import Moolyaselect from "../../../../../commons/components/MlAdminSelectWrapper";
import {multipartASyncFormHandler} from "../../../../../../commons/MlMultipartFormAction";
import {fetchServiceProviderPortfolioAwards} from "../../../actions/findPortfolioServiceProviderDetails";
import {putDataIntoTheLibrary} from '../../../../../../commons/actions/mlLibraryActionHandler'
import MlLoader from "../../../../../../commons/components/loader/loader";
import CropperModal from '../../../../../../commons/components/cropperModal';
import {mlFieldValidations} from "../../../../../../commons/validations/mlfieldValidation";
import generateAbsolutePath from '../../../../../../../lib/mlGenerateAbsolutePath';
import Confirm from '../../../../../../commons/utils/confirm';

export default class MlServiceProviderAwards extends Component {
  constructor(props, context) {
    super(props);
    this.state = {
      loading: false,
      data: {},
      fileName:"",
      serviceProviderAwards: [],
      popoverOpen: false,
      selectedIndex: -1,
      serviceProviderAwardsList: [],
      selectedVal: null,
      selectedObject: "default",
      privateKey:{},
      showProfileModal: false,
      uploadingAvatar: false
    };
    this.curSelectLogo = {};
    this.tabName = this.props.tabName || ""
    this.handleBlur = this.handleBlur.bind(this);
    this.handleYearChange.bind(this);
    this.fetchPortfolioDetails.bind(this);
    this.onSaveAction.bind(this);
    this.libraryAction.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.handleUploadAvatar = this.handleUploadAvatar.bind(this);
    this.onLogoFileUpload = this.onLogoFileUpload.bind(this);
    return this;
  }

  componentDidUpdate() {
    OnLockSwitch();
    dataVisibilityHandler()
    initalizeFloatLabel();
  }

  componentDidMount() {
    OnLockSwitch();
    dataVisibilityHandler();
    //initalizeFloatLabel();
    var WinHeight = $(window).height();
    var WinWidth = $(window).width();
    var className = this.props.isAdmin?"admin_header":"app_header"
    setTimeout (function(){
    $('.main_wrap_scroll').height(WinHeight-($('.'+className).outerHeight(true)+120));
    if(WinWidth > 768){
      $(".main_wrap_scroll").mCustomScrollbar({theme:"minimal-dark"});
    }
  },200);
  }

  componentWillMount() {
    const resp = this.fetchPortfolioDetails();
    return resp
  }

  async fetchPortfolioDetails() {
    let that = this;
    let portfolioDetailsId = that.props.portfolioDetailsId;
    let empty = _.isEmpty(that.context.serviceProviderPortfolio && that.context.serviceProviderPortfolio.awardsRecognition)
    const response = await fetchServiceProviderPortfolioAwards(portfolioDetailsId);
    if (empty) {
      if (response && response.length) {
        this.setState({loading: false, serviceProviderAwards: response, serviceProviderAwardsList: response});
      }
      else{
        this.setState({loading:false})
      }
    } else {
      this.setState({
        loading: false,
        serviceProviderAwards: that.context.serviceProviderPortfolio.awardsRecognition,
        serviceProviderAwardsList: that.context.serviceProviderPortfolio.awardsRecognition
      });
    }
    this.serviceProviderAwardServer = response && response.length ? response : [];
  }

  addAward() {
    this.setState({selectedObject: "default", popoverOpen: !(this.state.popoverOpen), data: {}, selectedVal: null})
    if (this.state.serviceProviderAwards) {
      this.setState({selectedIndex: this.state.serviceProviderAwards.length})
    } else {
      this.setState({selectedIndex: 0})
    }
  }

  onSaveAction(e) {
    const requiredFields = this.getFieldValidations();
    if (requiredFields && !requiredFields.errorMessage) {
      this.sendDataToParent(true)
    }else {
      toastr.error(requiredFields.errorMessage);
      return
    }
    var setObject =  this.state.serviceProviderAwards
    if(this.context && this.context.serviceProviderPortfolio && this.context.serviceProviderPortfolio.awardsRecognition ){
      setObject = this.context.serviceProviderPortfolio.awardsRecognition
    }
    this.setState({serviceProviderAwardsList: setObject, popoverOpen: false})
    this.curSelectLogo = {}
  }

  onTileClick(index, uiIndex, e) {
    let cloneArray = _.cloneDeep(this.state.serviceProviderAwards);
    // let details = cloneArray[index]
    var details = _.find(cloneArray, {index: index});
    details = _.omit(details, "__typename");
    this.curSelectLogo = details.logo;
    this.setState({
      selectedIndex: index,
      data: details,
      selectedObject: uiIndex,
      "selectedVal": details.awardId,
      popoverOpen: !(this.state.popoverOpen)},() =>{
      this.lockPrivateKeys(index)
    });
    // setTimeout(function () {
    //   _.each(details.privateFields, function (pf) {
    //     $("#"+pf.booleanKey).removeClass('un_lock fa-unlock').addClass('fa-lock')
    //   })
    // }, 10)
  }

  //todo:// context data connection first time is not coming have to fix
  lockPrivateKeys(selIndex) {
    var privateValues = this.serviceProviderAwardServer && this.serviceProviderAwardServer[selIndex]?this.serviceProviderAwardServer[selIndex].privateFields : []
    var filterPrivateKeys = _.filter(this.context.portfolioKeys && this.context.portfolioKeys.privateKeys, {tabName: this.props.tabName, index:selIndex})
    var filterRemovePrivateKeys = _.filter(this.context.portfolioKeys&&this.context.portfolioKeys.removePrivateKeys, {tabName: this.props.tabName, index:selIndex})
    var finalKeys = _.unionBy(filterPrivateKeys, privateValues, 'booleanKey')
    var keys = _.differenceBy(finalKeys, filterRemovePrivateKeys, 'booleanKey')
    console.log('keysssssssssssssss', keys)
    _.each(keys, function (pf) {
      $("#" + pf.booleanKey).removeClass('un_lock fa-unlock').addClass('fa-lock')
    })
  }

  onLockChange(fieldName, field, e) {
    var isPrivate = false;
    let className = e.target.className;
    if (className.indexOf("fa-lock") != -1) {
      isPrivate = true;
    }
    var privateKey = {keyName:fieldName, booleanKey:field, isPrivate:isPrivate, index:this.state.selectedIndex, tabName: this.props.tabName}
    this.setState({privateKey:privateKey}, function () {
      this.sendDataToParent()
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

  onOptionSelected(selectedAward, callback, selObject) {
    let details = this.state.data;
    details = _.omit(details, ["awardId"]);
    details = _.omit(details, ["awardName"]);
    if (selectedAward) {
      details = _.extend(details, {["awardId"]: selectedAward, "awardName": selObject.label});
      this.setState({data: details, "selectedVal": selectedAward, awardName: selObject.label}, function () {
        this.sendDataToParent()
      })
    } else {
      details = _.extend(details, {["awardId"]: '', "awardName": ''});
      this.setState({data: details, "selectedVal": '', awardName: ''}, function () {
        // this.sendDataToParent()
      })
    }

  }

  handleBlur(e) {
    let details = this.state.data;
    let name = e.target.name;
    details = _.omit(details, [name]);
    details = _.extend(details, {[name]: e.target.value});
    this.setState({data: details}, function () {
      // this.sendDataToParent()
    })
  }

  handleYearChange(e) {
    let details = this.state.data;
    let name = 'year';
    details = _.omit(details, [name]);
    details = _.extend(details, {[name]: this.refs.year.state.inputValue});
    this.setState({data: details}, function () {
      // this.sendDataToParent()
    })
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

  sendDataToParent(isSaveClicked) {
    let data = this.state.data;
    let awards = this.state.serviceProviderAwards;
    let serviceProviderAwards = _.cloneDeep(awards);
    data.index = this.state.selectedIndex;
    data.logo = this.curSelectLogo;
    if(isSaveClicked){
      const actualIndex = this.getActualIndex(serviceProviderAwards, this.state.selectedIndex);
      serviceProviderAwards[actualIndex] = data;
    }
    let arr = [];
    _.each(serviceProviderAwards, function (item) {
      for (var propName in item) {
        if (item[propName] === null || item[propName] === undefined) {
          delete item[propName];
        }
      }
      let newItem = _.omit(item, "__typename");
      newItem =_.omit(newItem,"privateFields");
      arr.push(newItem)
    })
    serviceProviderAwards = arr;
    this.setState({serviceProviderAwards: serviceProviderAwards})
    this.props.getAwardsDetails(serviceProviderAwards, this.state.privateKey);
  }

  onLogoFileUpload(image,fileInfo) {
    // let fileName=this.state.fileName;
    const fileName = fileInfo && fileInfo.name ? fileInfo.name : "fileName";
    let file=image;
    if(file){
      let data = {
        moduleName: "PORTFOLIO",
        actionName: "UPLOAD",
        portfolioDetailsId: this.props.portfolioDetailsId,
        portfolio: {awardsRecognition: [{logo: {fileUrl: '', fileName: fileName}, index: this.state.selectedIndex}]}
      };
      let response = multipartASyncFormHandler(data, file, 'registration', this.onFileUploadCallBack.bind(this, file));
    }else{
      this.setState({
        uploadingAvatar: false,
      });
    }
  }

  onFileUploadCallBack(file,resp) {
    this.setState({
      uploadingAvatar: false,
      showProfileModal: false
    });
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

      if (result && result.success) {
        this.curSelectLogo = {
          fileName: file && file.name ? file.name : "",
          fileUrl: result.result
        }
        // this.setState({loading: true});
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

  /**
   * @Note: with latest changes @fetchOnlyImages dependency removed
   * @handling logo view on client only
   * */
  async fetchOnlyImages() {
    const response = await fetchServiceProviderPortfolioAwards(this.props.portfolioDetailsId);
    if (response) {
      let thisState = this.state.selectedIndex;
      let dataDetails = this.state.serviceProviderAwards
      let cloneBackUp = _.cloneDeep(dataDetails);
      let specificData = cloneBackUp[thisState];
      if (specificData) {
        let curUpload = response[thisState]
        specificData['logo'] = curUpload['logo']
        this.setState({loading: false, serviceProviderAwards: cloneBackUp});

      } else {
        this.setState({loading: false})
      }
    }
  }

  toggleModal() {
    const that = this;
    this.setState({
      showProfileModal: !that.state.showProfileModal
    });
  }
  handleUploadAvatar(image,file) {
    this.setState({
      //uploadingAvatar: true,,
    });
    this.setState({ fileName: file.name })
    this.onLogoFileUpload(image,file);
  }

  render() {
    var yesterday = Datetime.moment().subtract(0, 'day');
    var valid = function (current) {
      return current.isBefore(yesterday);
    };
    let query = gql`query{
      data:fetchActiveAwards {
        label:awardDisplayName
        value:_id
      }
    }`;
    let that = this;
    const showLoader = that.state.loading;
    let serviceProviderAwardsList = that.state.serviceProviderAwardsList || [];
    let displayUploadButton = null;
    if (this.state.selectedObject != "default") {
      displayUploadButton = true
    } else {
      displayUploadButton = false
    }
    return (
      <div>
        {showLoader === true ? ( <MlLoader/>) : (
          <div>
            <h2>Awards</h2>
            <div className="requested_input main_wrap_scroll">
              
                <div className="col-lg-12">
                  <div className="row">
                    <div className="col-lg-2 col-md-3 col-sm-3">
                      <a id="create_clientdefault" data-placement="top" data-class="large_popover">
                        <div className="list_block notrans" onClick={this.addAward.bind(this)}>
                          <div className="hex_outer"><span className="ml ml-plus "></span></div>
                          <h3 onClick={this.addAward.bind(this)}> Add New Awards</h3>
                        </div>
                      </a>
                    </div>
                    {serviceProviderAwardsList.map(function (details, idx) {
                      return (<div className="col-lg-2 col-md-3 col-sm-3" key={idx}>
                        <a id={"create_client" + idx}>
                          <div className="list_block">
                            <FontAwesome name='unlock' id="makePrivate" defaultValue={details.makePrivate}/><input
                            type="checkbox" className="lock_input" id="isAssetTypePrivate"
                            checked={details.makePrivate}/>
                            {/*<div className="cluster_status inactive_cl"><FontAwesome name='times'/></div>*/}
                            <div className="hex_outer" onClick={that.onTileClick.bind(that,details.index, idx)}>
                              <img
                                src={details.logo && details.logo.fileUrl ? generateAbsolutePath(details.logo.fileUrl) : "/images/sub_default.jpg"}/>
                            </div>
                            <h3>{details.awardName ? details.awardName : ""}</h3>
                          </div>
                        </a>
                      </div>)
                    })}
                  </div>
                </div>
              
              <Popover placement="right" isOpen={this.state.popoverOpen}
                       target={"create_client" + this.state.selectedObject} toggle={this.toggle}>
                <PopoverTitle>Add Award</PopoverTitle>
                <PopoverContent>
                  <div className="ml_create_client">
                    <div className="medium-popover">
                      <div className="row">
                        <div className="col-md-12">
                          <Moolyaselect multiSelect={false} className="form-control float-label" valueKey={'value'}
                                        labelKey={'label'} queryType={"graphql"} query={query}
                                        isDynamic={true} placeholder="Select Award.."
                                        onSelect={this.onOptionSelected.bind(this)} mandatory={true}
                                        selectedValue={this.state.selectedVal} ref={"awardId"} data-required={true}
                                        data-errMsg="Award is required"/>
                          <div className="form-group">
                            <Datetime dateFormat="YYYY" timeFormat={false} viewMode="years"
                                      inputProps={{placeholder: "Select Year", className: "float-label form-control",readOnly:true}}
                                      defaultValue={this.state.data.year}
                                      closeOnSelect={true} ref="year" onBlur={this.handleYearChange.bind(this)}/>
                          </div>
                          <div className="form-group">
                            <input type="text" name="awardsDescription" placeholder="About"
                                   className="form-control float-label" defaultValue={this.state.data.awardsDescription}
                                   onBlur={this.handleBlur}/>
                            <FontAwesome name='unlock' className="input_icon req_textarea_icon un_lock"
                                         id="isDescriptionPrivate"
                                         defaultValue={this.state.data.isDescriptionPrivate}
                                         onClick={this.onLockChange.bind(this, "awardDescription", "isDescriptionPrivate")}/>
                          </div>
                          {displayUploadButton ? <div className="form-group">
                            <div className="fileUpload mlUpload_btn">
                                <span onClick={this.toggleModal.bind(this)}>Upload Logo</span>
                              {/*<input type="file" name="logo" id="logo" className="upload" accept="image/*"
                                     onChange={this.onLogoFileUpload.bind(this)}/>*/}
                            </div>
                          </div> : ""}
                          <div className="clearfix"></div>
                          <div className="form-group">
                            <div className="input_types"><input id="makePrivate" type="checkbox"
                                                                checked={this.state.data.makePrivate && this.state.data.makePrivate}
                                                                name="checkbox"
                                                                onChange={this.onStatusChangeNotify.bind(this)}/><label
                              htmlFor="checkbox1"><span></span>Make Private</label></div>
                          </div>
                          <div className="ml_btn" style={{'textAlign': 'center'}}>
                            <a className="save_btn" onClick={this.onSaveAction.bind(this)}>Save</a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
              <CropperModal
                uploadingImage={this.state.uploadingAvatar}
                handleImageUpload={this.handleUploadAvatar}
                cropperStyle="any"
                show={this.state.showProfileModal}
                toggleShow={this.toggleModal}
              />
            </div>
          </div>)}
      </div>
    )
  }
}
MlServiceProviderAwards.contextTypes = {
  serviceProviderPortfolio: PropTypes.object,
  portfolioKeys :PropTypes.object,
};
