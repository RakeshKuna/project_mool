import React, {Component, PropTypes} from "react";
import ScrollArea from 'react-scrollbar'
import _ from "lodash";
import gql from "graphql-tag";

var FontAwesome = require('react-fontawesome');
import {Popover, PopoverContent, PopoverTitle} from "reactstrap";
import Moolyaselect from "../../../../../../commons/components/MlAdminSelectWrapper";
import {dataVisibilityHandler, OnLockSwitch} from '../../../../../../utils/formElemUtil';
import MlLoader from "../../../../../../../commons/components/loader/loader";
import {fetchCompanyDetailsHandler} from "../../../../actions/findCompanyPortfolioDetails";
import CropperModal from '../../../../../../../../client/commons/components/cropperModal';
import {putDataIntoTheLibrary} from '../../../../../../../commons/actions/mlLibraryActionHandler'
import {multipartASyncFormHandler} from "../../../../../../../../client/commons/MlMultipartFormAction";
import {mlFieldValidations} from "../../../../../../../../client/commons/validations/mlfieldValidation";
import generateAbsolutePath from '../../../../../../../../lib/mlGenerateAbsolutePath';
import Confirm from '../../../../../../../commons/utils/confirm';
import {fetchInstitutionDetailsHandler} from "../../../../actions/findPortfolioInstitutionDetails";
import {createValueFromString} from "../../../../../../../commons/components/textEditor/MlTextEditor";

const KEY = "sectorsAndServices"

export default class MlCompanySectors extends React.Component {
  constructor(props, context) {
    super(props);
    this.state = {
      loading: true,
      data: {},
      privateKey: {},
      companysectorsAndServices: [],
      popoverOpen: false,
      fileName: "",
      selectedIndex: -1,
      sectorsAndServicesList: [],
      selectedObject: "default",
      uploadingAvatar: false,
      showProfileModal: false,
      // sectorsAndServices:{}
      // data:this.props.serviceProductsDetails || {},
    }
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

  componentDidUpdate() {
    OnLockSwitch();
    dataVisibilityHandler();
  }

  componentDidMount() {
    OnLockSwitch();
    dataVisibilityHandler();
    // this.updatePrivateKeys();
  }

  // componentWillMount(){
  //   let empty = _.isEmpty(this.context.companyPortfolio && this.context.companyPortfolio.serviceProducts)
  //   if(!empty){
  //     this.setState({loading: false, data: this.context.companyPortfolio.serviceProducts});
  //   }
  // }
  componentWillMount() {
    const resp = this.fetchPortfolioDetails();
    return resp
  }

  async fetchPortfolioDetails() {
    // let that = this;
    // let portfolioDetailsId = that.props.portfolioDetailsId;
    // let empty = _.isEmpty(that.context.companyPortfolio && that.context.companyPortfolio.sectorsAndServices)
    // const response = await fetchCompanyDetailsHandler(portfolioDetailsId, KEY);
    // if (empty) {
    //   if (response && response.sectorsAndServices && response.sectorsAndServices.length > 0) {
    //     this.setState({
    //       loading: false,
    //       companysectorsAndServices: response.sectorsAndServices,
    //       sectorsAndServicesList: response.sectorsAndServices
    //     });
    //   }
    //   else
    //     this.setState({loading: false})
    // } else {
    //   this.setState({
    //     loading: false,
    //     companysectorsAndServices: that.context.companyPortfolio.sectorsAndServices,
    //     sectorsAndServicesList: that.context.companyPortfolio.sectorsAndServices
    //   });
    // }
    // this.companysectorsAndServicesServer = response && response.sectorsAndServices ? response.sectorsAndServices : []
    // // if(empty){
    // //   if (response && response.sectorsAndServices) {
    // //     var object = response.sectorsAndServices;
    // //     object = _.omit(object, '__typename')
    // //     // this.setState({data: object});
    // //     this.setState({loading: false,data: object,privateFields:object.privateFields});
    // //   }else{
    // //     this.setState({loading:false})
    // //   }
    // // }else{
    // //   this.setState({loading: false, data: that.context.companyPortfolio.sectorsAndServices});
    // // }

    let portfolioDetailsId = this.props.portfolioDetailsId;
    const response = await fetchCompanyDetailsHandler(portfolioDetailsId, KEY);
    if (response && response.sectorsAndServices) {
      var object = response.sectorsAndServices;
      object = _.omit(object, '__typename')
      // this.setState({data: object});
      this.setState({
        loading: false,
        data: object,
        privateFields: object.privateFields,
      }, () => {
        this.lockPrivateKeys()
      });
    } else {
      this.setState({loading: false})
    }
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

  addAreaOfInterest() {
    this.setState({
      selectedObject: "default",
      popoverOpen: !(this.state.popoverOpen),
      data: {},
      industryTypeId: null,
      industryTypeName: null
    })
    if (this.state.companysectorsAndServices) {
      this.setState({selectedIndex: this.state.companysectorsAndServices.length})
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

  onLogoFileUpload(fileInfo, image) {
    let file = image;
    let fileName = fileInfo.name;
    let data = {
      moduleName: "PORTFOLIO",
      actionName: "UPLOAD",
      portfolioDetailsId: this.props.portfolioDetailsId,
      portfolio: {sectorsAndServices: [{logo: {fileUrl: '', fileName: fileName}, index: this.state.selectedIndex}]}
    };
    let response = multipartASyncFormHandler(data, file, 'registration', this.onFileUploadCallBack.bind(this, file));
  }

  onFileUploadCallBack(file, resp) {
    if (resp) {
      let result = JSON.parse(resp);
      Confirm('', "Do you want to add this file to your library?", 'Yes', 'No', (ifConfirm) => {
        if (ifConfirm) {
          let fileObjectStructure = {
            fileName: file.name,
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
      this.setState({uploadingAvatar: false})
    }
  }

  async libraryAction(file) {
    debugger;
    let portfolioDetailsId = this.props.portfolioDetailsId;
    const resp = await putDataIntoTheLibrary(portfolioDetailsId, file, this.props.client)
    return resp;
  }

  handleUploadAvatar(image, e) {
    this.setState({
      //uploadingAvatar: true,,
    });
    this.onLogoFileUpload(e, image);
  }

  toggleModal() {
    const that = this;
    this.setState({
      showProfileModal: !that.state.showProfileModal,
    });
  }

  async fetchOnlyImages() {
    const response = await fetchCompanyDetailsHandler(this.props.portfolioDetailsId, KEY);
    if (response && response.sectorsAndServices) {
      let thisState = this.state.selectedIndex;
      let dataDetails = this.state.companysectorsAndServices
      let cloneBackUp = _.cloneDeep(dataDetails);
      let specificData = cloneBackUp[thisState];
      if (specificData) {
        let curUpload = response.sectorsAndServices[this.state.selectedIndex]
        specificData['logo'] = curUpload['logo']
        this.setState({loading: false, companysectorsAndServices: cloneBackUp});
      } else {
        this.setState({loading: false})
      }
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

  getActualIndex(dataArray, checkIndex) {
    var response = _.findIndex(dataArray, {index: checkIndex});
    response = response >= 0 ? response : checkIndex;
    return response;
  }

  sendDataToParent(isSaveClicked) {
    let data = this.state.data;
    let investment = this.state.companysectorsAndServices;
    let companysectorsAndServices = _.cloneDeep(investment);
    data.index = this.state.selectedIndex;
    data.logo = this.curSelectLogo;
    if (isSaveClicked) {
      const actualIndex = this.getActualIndex(companysectorsAndServices, this.state.selectedIndex);
      companysectorsAndServices[actualIndex] = data;
    }
    let arr = [];
    _.each(companysectorsAndServices, function (item) {
      for (var propName in item) {
        if (item[propName] === null || item[propName] === undefined) {
          delete item[propName];
        }
      }
      let newItem = _.omit(item, "__typename");
      let updateItem = _.omit(newItem, "privateFields");
      arr.push(updateItem)
    })
    companysectorsAndServices = arr;
    this.setState({companysectorsAndServices: companysectorsAndServices})
    this.props.getSectors(companysectorsAndServices, this.state.privateKey);
  }

  updatePrivateKeys(selIndex) {
    var privateValues = this.companysectorsAndServicesServer && this.companysectorsAndServicesServer[selIndex] ? this.companysectorsAndServicesServer[selIndex].privateFields : []
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
    console.log('keysssssssssssssssss', keys)
    _.each(keys, function (pf) {
      $("#" + pf.booleanKey).removeClass('un_lock fa-unlock').addClass('fa-lock')
    })
  }

  onTileClick(index, uiIndex, e) {
    let cloneArray = _.cloneDeep(this.state.companysectorsAndServices);
    // let details = cloneArray[index]
    let details = _.find(cloneArray, {index: index});
    details = _.omit(details, "__typename");
    this.curSelectLogo = details.logo
    this.setState({
      selectedIndex: index,
      data: details,
      selectedObject: uiIndex,
      popoverOpen: !(this.state.popoverOpen),
      "selectedVal": details.industryTypeId,
      "selectedValDomain": details.subDomainId
    }, () => {
      this.updatePrivateKeys(index)
    });
  }

  getFieldValidations() {
    const ret = mlFieldValidations(this.refs);
    return {tabName: this.tabName, errorMessage: ret, index: this.state.selectedIndex}
  }

  onSaveAction(e) {
    const requiredFields = this.getFieldValidations();
    if (requiredFields && !requiredFields.errorMessage) {
      this.sendDataToParent(true)
    } else {
      toastr.error(requiredFields.errorMessage);
      return
    }
    var setObject = this.state.companysectorsAndServices
    if (this.context && this.context.companyPortfolio && this.context.companyPortfolio.sectorsAndServices) {
      setObject = this.context.companyPortfolio.sectorsAndServices
    }
    this.setState({sectorsAndServicesList: setObject, popoverOpen: false})
    this.curSelectLogo = {}
  }

  onOptionSelectedIndustry(selectedFunding, callback, selObject) {
    let details = this.state.data;
    details = _.omit(details, ["industryTypeId"]);
    details = _.extend(details, {["industryTypeId"]: selectedFunding, "industryTypeName": selObject.label});
    this.setState({data: details, "selectedVal": selectedFunding, "industryTypeName": selObject.label}, function () {
      // this.sendDataToParent()
    })
  }

  onOptionSelectedSubDomain(selectedSubDomain) {
    let details = this.state.data;
    details = _.omit(details, ["subDomainId"]);
    details = _.extend(details, {["subDomainId"]: selectedSubDomain});
    this.setState({data: details, "selectedValDomain": selectedSubDomain}, function () {
      // this.sendDataToParent()
    })
  }

  render() {
    let that = this;
    let industriesquery = gql` query{
    data:fetchIndustries{label:industryName,value:_id}
    }
  `;
    let subDomainQuery = gql` query($industryId:String){
    data:fetchIndustryDomain(industryId:$industryId){label:name,value:_id}
    }
  `;
    let subDomainOption = {options: {variables: {industryId: this.state.data.industryTypeId}}};
    const showLoader = that.state.loading;
    let sectorList = that.state.sectorsAndServicesList || [];
    // let that = this;
    // const showLoader = that.state.loading;
    return (
      <div>
        {showLoader === true ? (<MlLoader/>) : (
          <div className="requested_input">
            <div className="col-lg-12">
              <div className="row">
                <h2>Sectors And Services</h2>
                <div className="requested_input main_wrap_scroll">
                  <ScrollArea
                    speed={0.8}
                    className="main_wrap_scroll"
                    smoothScrolling={true}
                    default={true}
                  >
                    <div className="col-lg-12">
                      <div className="row">
                        <div className="col-lg-2 col-md-4 col-sm-4">
                          <a href="" id="create_clientdefault" data-placement="top" data-class="large_popover">
                            <div className="list_block list_block_intrests notrans"
                                 onClick={this.addAreaOfInterest.bind(this)}>
                              <div className="hex_outer">
                                <span className="ml ml-plus "></span>
                              </div>
                              <h3>Add Sectors And Services</h3>
                            </div>
                          </a>
                        </div>

                        {/*list of interest*/}
                        {sectorList && sectorList.map(function (details, idx) {
                          return (
                            <div className="col-lg-2 col-md-4 col-sm-4" key={idx}>
                              <a href="" id={"create_client" + idx}>
                                <div className="list_block list_block_intrests notrans"
                                     onClick={that.onTileClick.bind(that, details.index, idx)}>
                                  <FontAwesome name='unlock' id="makePrivate" defaultValue={details.makePrivate}/>
                                  <input type="checkbox" className="lock_input" id="isAssetTypePrivate"
                                         checked={details.makePrivate}/>
                                  {/*<div className="cluster_status inactive_cl"><FontAwesome name='times'/></div>*/}
                                  <div className="hex_outer">
                                    {/*<div className="cluster_status inactive_cl"><FontAwesome name='trash-o'/></div>*/}
                                    <div className="hex_outer"><img
                                      src={details.logo && details.logo.fileUrl ? generateAbsolutePath(details.logo.fileUrl) : "/images/def_profile.png"}/>
                                    </div>
                                  </div>
                                  <h3>{details.industryTypeName}</h3>
                                </div>
                              </a>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </ScrollArea>

                  {/*popover */}
                  <Popover placement="right" isOpen={this.state.popoverOpen}
                           target={"create_client" + this.state.selectedObject} toggle={this.toggle}>
                    <PopoverTitle>Add Sectors And Services</PopoverTitle>
                    <PopoverContent>
                      <div className="ml_create_client">
                        <div className="medium-popover">
                          <div className="row">
                            <div className="col-md-12">
                              <div className="form-group">
                                <Moolyaselect multiSelect={false} className="form-field-name" valueKey={'value'}
                                              ref={"industryTypeId"}
                                              labelKey={'label'} queryType={"graphql"} query={industriesquery}
                                              mandatory={true}
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
                </div>
              </div>
            </div>
          </div>)}
      </div>
    )
  }
}
MlCompanySectors.contextTypes = {
  companyPortfolio: PropTypes.object,
  portfolioKeys: PropTypes.object,
};
{/*<div className="panel panel-default panel-form">*/
}

{/*<div className="panel-body">*/
}

{/*<div className="form-group nomargin-bottom">*/
}
{/*<textarea placeholder="Describe..." name="sectorsAndServicesDescription" className="form-control" id="cl_about"  defaultValue={this.state.data&&this.state.data.sectorsAndServicesDescription} onBlur={this.handleBlur.bind(this)}></textarea>*/
}
{/*<FontAwesome name='unlock' className="input_icon req_textarea_icon un_lock" id="isSectorsAndServicesPrivate" defaultValue={this.state.data&&this.state.data.isSectorsAndServicesPrivate} onClick={this.onLockChange.bind(this, "sectorsAndServicesDescription", "isSectorsAndServicesPrivate")}/>*/
}
{/*</div>*/
}

{/*</div>*/
}
{/*</div>*/
}


{/*</div>*/
}
{/*</div>*/
}
