import React, {Component, PropTypes} from "react";
import ScrollArea from "react-scrollbar";
import _ from "lodash";
import gql from "graphql-tag";
var FontAwesome = require('react-fontawesome');
import {Popover, PopoverContent, PopoverTitle} from "reactstrap";
import Moolyaselect from "../../../../../commons/components/MlAdminSelectWrapper";
import {dataVisibilityHandler, OnLockSwitch} from "../../../../../../../client/admin/utils/formElemUtil";
import {fetchfunderPortfolioAreaInterest} from "../../../actions/findPortfolioFunderDetails";
import MlLoader from '../../../../../../commons/components/loader/loader'
import {mlFieldValidations} from "../../../../../../commons/validations/mlfieldValidation";
import CropperModal from '../../../../../../commons/components/cropperModal';
import { putDataIntoTheLibrary } from '../../../../../../commons/actions/mlLibraryActionHandler'
import { multipartASyncFormHandler } from "../../../../../../../client/commons/MlMultipartFormAction";
import generateAbsolutePath from '../../../../../../../lib/mlGenerateAbsolutePath';
import Confirm from '../../../../../../commons/utils/confirm';

export default class MlFunderAreaOfInterest extends Component {
  constructor(props, context) {
    super(props);
    this.state = {
      loading: true,
      data: {},
      fileName:"",
      funderAreaOfInterest: [],
      popoverOpen: false,
      selectedIndex: -1,
      funderAreaOfInterestList: [],
      selectedObject: "default",
      uploadingAvatar: false,
      showProfileModal: false,
      privateKey:{}
    };
    this.curSelectLogo = {}
    this.tabName = this.props.tabName || ""
    this.handleBlur.bind(this);
    this.onSaveAction.bind(this);
    this.dateChange.bind(this);
    this.handleUploadAvatar = this.handleUploadAvatar.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.fetchPortfolioDetails.bind(this);
    return this;
  }

  componentWillMount() {
    const resp = this.fetchPortfolioDetails();
    return resp
  }

  async fetchPortfolioDetails() {
    let that = this;
    let portfolioDetailsId = that.props.portfolioDetailsId;
    let empty = _.isEmpty(that.context.funderPortfolio && that.context.funderPortfolio.areaOfInterest)
    const response = await fetchfunderPortfolioAreaInterest(portfolioDetailsId);
      if (empty) {
        if(response && response.length)
          this.setState({loading: false, funderAreaOfInterest: response, funderAreaOfInterestList: response});
        else
          this.setState({loading: false})
      } else {
        this.setState({
          loading: false,
          funderAreaOfInterest: that.context.funderPortfolio.areaOfInterest,
          funderAreaOfInterestList: that.context.funderPortfolio.areaOfInterest
        });
      }
      this.funderAreaOfInterestServer = response
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

  dateChange(e) {
    let details = this.state.data;
    let name = 'date';
    details = _.omit(details, [name]);
    details = _.extend(details, {[name]: this.refs.date.state.inputValue});
    this.setState({data: details}, function () {
      // this.sendDataToParent()
    })
  }

  onTileClick(index, uiIndex, e) {
    let cloneArray = _.cloneDeep(this.state.funderAreaOfInterest);
    // let details = cloneArray[index]
    var details = _.find(cloneArray, {index: index});
    details = _.omit(details, "__typename");
    this.curSelectLogo = details.logo;
    this.setState({
      selectedIndex: index,
      data: details,
      selectedObject: uiIndex,
      popoverOpen: !(this.state.popoverOpen),
      "selectedVal": details.industryTypeId,
     "selectedValDomain": details.subDomainId},() => {
      this.lockPrivateKeys(index)
    });
    // let cloneArray = _.cloneDeep(this.state.funderAreaOfInterest);
    // let details = cloneArray[index]
    // details = _.omit(details, "__typename");
    // if (details && details.logo) {
    //   delete details.logo['__typename'];
    // }
    // this.setState({
    //   selectedIndex: index,
    //   data: details,
    //   selectedObject: index,
    //   popoverOpen: !(this.state.popoverOpen)
    // });
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
    
  }

  componentDidMount() {
    OnLockSwitch();
    dataVisibilityHandler();
  }

  addAreaOfInterest() {
    this.setState({
      selectedObject: "default",
      popoverOpen: !(this.state.popoverOpen),
      data: {},
      industryTypeId: null,
      industryTypeName: null,
      selectedVal: null
    })
    if (this.state.funderAreaOfInterest) {
      this.setState({selectedIndex: this.state.funderAreaOfInterest.length})
    } else {
      this.setState({selectedIndex: 0})
    }
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

  // onLockChange(fieldName, field, e) {
  //   var isPrivate = false;
  //   let className = e.target.className;
  //   if (className.indexOf("fa-lock") != -1) {
  //     isPrivate = true;
  //   }
  //   var privateKey = {keyName:fieldName, booleanKey:field, isPrivate:isPrivate, index:this.state.selectedIndex, tabName: this.props.tabName};
  //   this.setState({data: details, privateKey:privateKey}, function () {
  //     this.sendDataToParent()
  //   })
  // }

  /**
   * UI creating lock function\
   * @Note: For the first Time context data is not working
   *        from the second time context when connection establish then its working
   * */
  //todo:// context data connection first time is not coming have to fix
  lockPrivateKeys(selIndex) {
    var privateValues = this.funderAreaOfInterestServer && this.funderAreaOfInterestServer[selIndex]?this.funderAreaOfInterestServer[selIndex].privateFields : []
    var filterPrivateKeys = _.filter(this.context.portfolioKeys.privateKeys, {tabName: this.props.tabName, index:selIndex})
    var filterRemovePrivateKeys = _.filter(this.context.portfolioKeys.removePrivateKeys, {tabName: this.props.tabName, index:selIndex})
    var finalKeys = _.unionBy(filterPrivateKeys, privateValues, 'booleanKey')
    var keys = _.differenceBy(finalKeys, filterRemovePrivateKeys, 'booleanKey')
    console.log('keysssssssssssssssss', keys)
    _.each(keys, function (pf) {
      $("#" + pf.booleanKey).removeClass('un_lock fa-unlock').addClass('fa-lock')
    })
  }


  onSaveAction(e) {
    const requiredFields = this.getFieldValidations();
    if (requiredFields && !requiredFields.errorMessage) {
      this.sendDataToParent(true)
    }else {
      toastr.error(requiredFields.errorMessage);
      return
    }
    var setObject = this.state.funderAreaOfInterest
    if(this.context && this.context.funderPortfolio && this.context.funderPortfolio.areaOfInterest ){
      setObject = this.context.funderPortfolio.areaOfInterest
    }
    this.setState({funderAreaOfInterestList: setObject, popoverOpen: false})
    this.curSelectLogo = {}
  }

  onOptionSelectedIndustry(selectedFunding, callback, selObject) {
    let details = this.state.data;
    details = _.omit(details, ["industryTypeId"]);
    details = _.extend(details, {
      ["industryTypeId"]: selectedFunding ? selectedFunding : null,
      "industryTypeName": selObject && selObject.label ? selObject.label : null
    });
    this.setState({data: details, "selectedVal": selectedFunding, "industryTypeName": selObject.label}, function () {
      // this.sendDataToParent()
    })
  }

  onOptionSelectedSubDomain(selectedSubDomain, cb, selObject) {
    let details = this.state.data;
    details = _.omit(details, ["subDomainId"]);
    details = _.extend(details, {
      ["subDomainId"]: selectedSubDomain ? selectedSubDomain : null,
      subDomainName: selObject && selObject.label ? selObject.label : null
    });
    this.setState({data: details, "selectedValDomain": selectedSubDomain}, function () {
      // this.sendDataToParent()
    })
  }
  onLogoFileUpload(image, fileInfo) {
    let file = image;
    this.setState({ fileName: fileInfo.name});
    const fileName = fileInfo.name;
    let data = {
      moduleName: "PORTFOLIO",
      actionName: "UPLOAD",
      portfolioDetailsId: this.props.portfolioDetailsId,
      portfolio: { areaOfInterest: [{ logo: { fileUrl: '', fileName: fileName }, index: this.state.selectedIndex }] }
    };
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
        this.curSelectLogo = {
          fileName: file && file.name ? file.name : "",
          fileUrl: result.result
        }
        // this.setState({ loading: true })
        // this.fetchOnlyImages();
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

  /**
   * @Note: with latest changes @fetchOnlyImages dependency removed
   * @handling logo view on client only
   * */
  async fetchOnlyImages() {
    const response = await fetchfunderPortfolioAreaInterest(this.props.portfolioDetailsId);
    if (response) {
      let thisState = this.state.selectedIndex;
      let dataDetails = this.state.funderAreaOfInterest
      let cloneBackUp = _.cloneDeep(dataDetails);
      let specificData = cloneBackUp[thisState];
      if (specificData) {
        let curUpload = response[thisState]
        specificData['logo'] = curUpload['logo']
        this.setState({ loading: false, funderAreaOfInterest: cloneBackUp });
      } else {
        this.setState({ loading: false })
      }
    }
  }
  getFieldValidations() {
    const ret = mlFieldValidations(this.refs);
    return {tabName: this.tabName, errorMessage: ret, index: this.state.selectedIndex}
  }

  /**
   * UI creating lock function\
   * @Note: For the first Time context data is not working
   *        from the second time context when connection establish then its working
   * */
  //todo:// context data connection first time is not coming have to fix
  lockPrivateKeys(selIndex) {
    var privateValues = this.funderInvestmentServer && this.funderInvestmentServer[selIndex]?this.funderInvestmentServer[selIndex].privateFields : []
    var filterPrivateKeys = _.filter(this.context.portfolioKeys.privateKeys, {tabName: this.props.tabName, index:selIndex})
    var filterRemovePrivateKeys = _.filter(this.context.portfolioKeys.removePrivateKeys, {tabName: this.props.tabName, index:selIndex})
    var finalKeys = _.unionBy(filterPrivateKeys, privateValues, 'booleanKey')
    var keys = _.differenceBy(finalKeys, filterRemovePrivateKeys, 'booleanKey')
    console.log('keysssssssssssssssss', keys)
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
    let investment = this.state.funderAreaOfInterest;
    let funderAreaOfInterest = _.cloneDeep(investment);
    data.index = this.state.selectedIndex;
    data.logo = this.curSelectLogo;
    if(isSaveClicked){
      const actualIndex = this.getActualIndex(funderAreaOfInterest, this.state.selectedIndex);
      funderAreaOfInterest[actualIndex] = data;
    }
    let arr = [];
    _.each(funderAreaOfInterest, function (item) {
      for (var propName in item) {
        if (item[propName] === null || item[propName] === undefined) {
          delete item[propName];
        }
      }
      let newItem = _.omit(item, "__typename");
      let updateItem =_.omit(newItem,"privateFields");
      arr.push(updateItem)
    })
    funderAreaOfInterest = arr;
    this.setState({funderAreaOfInterest: funderAreaOfInterest})
    this.props.getAreaOfInterestDetails(funderAreaOfInterest, this.state.privateKey);
  }

  handleUploadAvatar(image, file) {
    this.setState({
      //uploadingAvatar: true,,
    });
    this.onLogoFileUpload(image, file);
  }

  toggleModal() {
    const that = this;
    this.setState({
      showProfileModal: !that.state.showProfileModal,
    });
  }



  render() {
    let that = this;
    let industriesquery = gql` query{
    data:fetchIndustries{label:industryDisplayName,value:_id}
    }
  `;
    let subDomainQuery = gql` query($industryId:String){
    data:fetchIndustryDomain(industryId:$industryId){label:displayName,value:_id}
    }
  `;
    let subDomainOption = {options: {variables: {industryId: this.state.data.industryTypeId}}};
    const showLoader = that.state.loading;
    let funderAreaOfInterestList = that.state.funderAreaOfInterestList || [];
      return (
        <div>
          {showLoader === true ? (<MlLoader/>) : (
            <div className="portfolio-main-wrap">
              <h2>Area of Interest</h2>
              <div className="requested_input main_wrap_scroll">
                
                  <div className="col-lg-12">
                    <div className="row">
                      <div className="col-lg-2 col-md-4 col-sm-4">
                        <a href="" id="create_clientdefault" data-placement="top" data-class="large_popover">
                          <div className="list_block list_block_intrests notrans"
                               onClick={this.addAreaOfInterest.bind(this)}>
                            <div className="hex_outer">
                              <span className="ml ml-plus "></span>
                            </div>
                            <h3>Add Area Of Interest</h3>
                          </div>
                        </a>
                      </div>

                      {/*list of interest*/}
                      {funderAreaOfInterestList.map(function (details, idx) {
                        return (
                          <div className="col-lg-2 col-md-4 col-sm-4" key={idx}>
                            <a href="" id={"create_client" + idx}>
                              <div className="list_block list_block_intrests notrans">`
                                <FontAwesome name='unlock'  id="makePrivate" defaultValue={details.makePrivate}/>
                                <input type="checkbox" className="lock_input" id="isAssetTypePrivate" checked={details.makePrivate}/>
                                {/*<div className="cluster_status inactive_cl"><FontAwesome name='times'/></div>*/}
                                <div className="hex_outer" onClick={that.onTileClick.bind(that, details.index, idx)}>
                                  {/*<div className="cluster_status inactive_cl"><FontAwesome name='trash-o'/></div>*/}
                                  <div className="hex_outer"><img src={details.logo && details.logo.fileUrl? generateAbsolutePath(details.logo.fileUrl) : "/images/def_profile.png"} /></div>
                                </div>
                                <h3>{details.industryTypeName}</h3>
                              </div>
                            </a>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                {/*popover */}
                <Popover placement="right" isOpen={this.state.popoverOpen}
                         target={"create_client" + this.state.selectedObject} toggle={this.toggle}>
                  <PopoverTitle>Add New Area of Interest</PopoverTitle>
                  <PopoverContent>
                    <div className="ml_create_client">
                      <div className="medium-popover">
                        <div className="row">
                          <div className="col-md-12">
                            <div className="form-group">
                              <Moolyaselect multiSelect={false} className="form-field-name" valueKey={'value'} ref={"industryTypeId"}
                                            labelKey={'label'} queryType={"graphql"} query={industriesquery} mandatory={true}
                                            isDynamic={true} placeholder="Select Industry.."
                                            onSelect={this.onOptionSelectedIndustry.bind(this)}
                                            selectedValue={this.state.selectedVal} data-required={true}
                                            data-errMsg="Industry is required"/>
                            </div>
                            <div className="form-group">
                              <Moolyaselect multiSelect={false} className="form-field-name" valueKey={'value'}
                                            labelKey={'label'} queryType={"graphql"} query={subDomainQuery}
                                            queryOptions={subDomainOption}
                                            isDynamic={true} placeholder="Select SubDomain.."
                                            onSelect={this.onOptionSelectedSubDomain.bind(this)}
                                            selectedValue={this.state.selectedValDomain}/>
                            </div>
                            <CropperModal
                              uploadingImage={this.state.uploadingAvatar}
                              handleImageUpload={this.handleUploadAvatar}
                              cropperStyle="circle"
                              show={this.state.showProfileModal}
                              toggleShow={this.toggleModal}
                            />
                            {this.state.selectedObject != "default" ?
                              <div className="form-group" onClick={this.toggleModal}>
                                <div className="fileUpload mlUpload_btn">
                                  <span>Upload Pic</span>
                                </div>
                              </div> : <div></div>
                            }
                            <br className="brclear"/>
                            <div className="form-group">
                              <div className="input_types"><input id="makePrivate" type="checkbox" checked={this.state.data.makePrivate&&this.state.data.makePrivate}  name="checkbox" onChange={this.onStatusChangeNotify.bind(this)}/><label htmlFor="checkbox1"><span></span>Make Private</label></div>
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
              </div>
            </div>)}
        </div>
      )
  }
}

MlFunderAreaOfInterest.contextTypes = {
  funderPortfolio: PropTypes.object,
  portfolioKeys :PropTypes.object,
};
