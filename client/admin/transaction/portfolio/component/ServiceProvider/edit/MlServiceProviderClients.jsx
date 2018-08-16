import React, {Component, PropTypes} from "react";
import ScrollArea from "react-scrollbar";
import {Popover, PopoverTitle, PopoverContent} from "reactstrap";
import _ from "lodash";
import {dataVisibilityHandler, OnLockSwitch, initalizeFloatLabel} from "../../../../../utils/formElemUtil";
var FontAwesome = require('react-fontawesome');
import {multipartASyncFormHandler} from "../../../../../../commons/MlMultipartFormAction";
import {fetchServiceProviderClients} from "../../../actions/findPortfolioServiceProviderDetails";
import {putDataIntoTheLibrary} from '../../../../../../commons/actions/mlLibraryActionHandler'
import MlLoader from "../../../../../../commons/components/loader/loader";
import CropperModal from '../../../../../../commons/components/cropperModal';
import {mlFieldValidations} from "../../../../../../commons/validations/mlfieldValidation";
import generateAbsolutePath from '../../../../../../../lib/mlGenerateAbsolutePath';
import Confirm from '../../../../../../commons/utils/confirm';

export default class MlServiceProviderClients extends Component {
  constructor(props, context) {
    super(props);
    this.state = {
      loading: false,
      data: {},
      serviceProviderClients:[],
      popoverOpen: false,
      selectedIndex: -1,
      serviceProviderClientsList:[],
      selectedObject: "default",
      privateKey:{},
      showProfileModal: false,
      uploadingAvatar: false
    };
    this.curSelectLogo = {};
    this.tabName = this.props.tabName || ""
    this.handleBlur = this.handleBlur.bind(this);
    this.onSaveAction = this.onSaveAction.bind(this);
    // this.imagesDisplay.bind(this);
    // this.fetchPortfolioDetails.bind(this);
    this.libraryAction.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.handleUploadAvatar = this.handleUploadAvatar.bind(this);
    this.onLogoFileUpload = this.onLogoFileUpload.bind(this);
    this.onStatusChangeNotify = this.onStatusChangeNotify.bind(this)
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
    // this.imagesDisplay();
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
    return resp;
  }

  async fetchPortfolioDetails() {
    let that = this;
    let portfolioDetailsId = that.props.portfolioDetailsId;
    let empty = _.isEmpty(that.context.serviceProviderPortfolio && that.context.serviceProviderPortfolio.clients)
    const response = await fetchServiceProviderClients(portfolioDetailsId);
    if (empty) {
      if (response && response.length>0) {
        this.setState({loading: false, serviceProviderClients: response, serviceProviderClientsList: response});
      }
      else{
        this.setState({loading:false})
      }
    } else {
      this.setState({
        loading: false,
        serviceProviderClients: that.context.serviceProviderPortfolio.clients,
        serviceProviderClientsList: that.context.serviceProviderPortfolio.clients
      });
    }
    this.serviceProviderClientsServer =response?response:[]
  }

  addClient() {
    this.setState({selectedObject: "default", popoverOpen: !(this.state.popoverOpen), data: {}})
    if (this.state.serviceProviderClients) {
      this.setState({selectedIndex: this.state.serviceProviderClients.length})
    } else {
      this.setState({selectedIndex: 0})
    }
  }

  onTileSelect(index, uiIndex, e) {
    let cloneArray = _.cloneDeep(this.state.serviceProviderClients);
    // let details = cloneArray[index]
    var details = _.find(cloneArray, {index: index});
    details = _.omit(details, "__typename");
    if (details && details.logo) {
      delete details.logo['__typename'];
    }
    this.curSelectLogo = details.logo
    this.setState({
      selectedIndex: index,
      data: details,
      selectedObject: uiIndex,
      popoverOpen: !(this.state.popoverOpen)},()=>{
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
    var privateValues = this.serviceProviderClientsServer && this.serviceProviderClientsServer[selIndex]?this.serviceProviderClientsServer[selIndex].privateFields : []
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
      isPrivate = true
    }
    var privateKey = {keyName:fieldName, booleanKey:field, isPrivate:isPrivate, index:this.state.selectedIndex, tabName: this.props.tabName}
    this.setState({privateKey:privateKey}, function () {
      this.sendDataToParent()
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
    var setObject = this.state.serviceProviderClients
    if (this.context && this.context.serviceProviderPortfolio && this.context.serviceProviderPortfolio.clients)
      setObject = this.context.serviceProviderPortfolio.clients
    this.setState({serviceProviderClientsList: setObject, popoverOpen: false})
    this.curSelectLogo = {}
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

  handleBlur(e) {
    let details = this.state.data;
    let name = e.target.name;
    details = _.omit(details, [name]);
    details = _.extend(details, {[name]: e.target.value});
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
    const requiredFields = this.getFieldValidations();
    let data = this.state.data;
    let clients = this.state.serviceProviderClients;
    let serviceProviderClients = _.cloneDeep(clients);
    data.logo = this.curSelectLogo;
    data.index = this.state.selectedIndex;
    if(isSaveClicked){
      const actualIndex = this.getActualIndex(serviceProviderClients, this.state.selectedIndex);
      serviceProviderClients[actualIndex] = data;
    }
    let arr = [];
    _.each(serviceProviderClients, function (item) {
      for (var propName in item) {
        if (item[propName] === null || item[propName] === undefined) {
          delete item[propName];
        }
      }
      let newItem = _.omit(item, "__typename");
      let updateItem =_.omit(newItem,"privateFields");
      arr.push(updateItem)
    })
    serviceProviderClients = arr;
    this.setState({serviceProviderClients: serviceProviderClients})
    this.props.getServiceProviderClients(serviceProviderClients, this.state.privateKey, requiredFields);

  }

  onLogoFileUpload(image, fileInfo) {
    let file = image;
    // let fileName = this.state.fileName;
    const fileName = fileInfo && fileInfo.name ? fileInfo.name : "fileName";
    if(file){
      let data = {
        moduleName: "PORTFOLIO",
        actionName: "UPLOAD",
        portfolioDetailsId: this.props.portfolioDetailsId,
        portfolio: {clients: [{logo: {fileUrl: '', fileName: fileName}, index: this.state.selectedIndex}]}
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

      if (result.success) {
        this.curSelectLogo = {
          fileName: file && file.name ? file.name : "",
          fileUrl: result.result
        };
        // this.setState({loading: true})
        // this.fetchOnlyImages();
        // this.imagesDisplay();
      }else {
        this.setState({loading: false})
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
    const response = await fetchServiceProviderClients(this.props.portfolioDetailsId);
    if (response) {
      let thisState = this.state.selectedIndex;
      let dataDetails = this.state.serviceProviderClients
      let cloneBackUp = _.cloneDeep(dataDetails);
      let specificData = cloneBackUp[thisState];
      if (specificData) {
        let curUpload = response[thisState]
        specificData['logo'] = curUpload['logo']
        this.setState({loading: false, serviceProviderClients: cloneBackUp});
      } else {
        this.setState({loading: false})
      }
    }
  }

  /**
   * @Note: check its usage and need to remove it
   * @function: imagesDisplay()
   */
  // async imagesDisplay() {
  //   const response = await fetchServiceProviderClients(this.props.portfolioDetailsId);
  //   if (response) {
  //     let detailsArray = response && response.clients ? response.clients : []
  //     let dataDetails = this.state.serviceProviderClients
  //     let cloneBackUp = _.cloneDeep(dataDetails);
  //     _.each(detailsArray, function (obj, key) {
  //       cloneBackUp[key]["logo"] = obj.logo;
  //     })
  //     let listDetails = this.state.serviceProviderClientsList || [];
  //     listDetails = cloneBackUp
  //     let cloneBackUpList = _.cloneDeep(listDetails);
  //     this.setState({loading: false, serviceProviderClients: cloneBackUp, serviceProviderClientsList: cloneBackUpList});
  //   }
  // }

  emptyClick(e) {
    if (this.state.popoverOpen)
      this.setState({popoverOpen: false})
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
    this.setState({ fileName: file.name})
    this.onLogoFileUpload(image, file);
  }
  render() {
    let that = this;
    const showLoader = that.state.loading;
    let clientsArray = that.state.serviceProviderClientsList || [];
    let displayUploadButton = null;
    if (this.state.selectedObject != "default") {
      displayUploadButton = true
    } else {
      displayUploadButton = false
    }
    return (
      <div onClick={this.emptyClick.bind(this)}>
        <h2>Clients</h2>
        {showLoader === true ? ( <MlLoader/>) : (
          <div className="requested_input main_wrap_scroll">
            
              <div className="col-lg-12">
                <div className="row">
                  <div className="col-lg-2 col-md-3 col-sm-3">
                    <a id="create_clientdefault" data-placement="right" data-class="large_popover">
                      <div className="list_block notrans" onClick={this.addClient.bind(this)}>
                        <div className="hex_outer"><span className="ml ml-plus "></span></div>
                        <h3 onClick={this.addClient.bind(this)}>Add New Client</h3>
                      </div>
                    </a>
                  </div>
                  {clientsArray.map(function (details, idx) {
                  /*  if(details.makePrivate){
                      $("#makePrivate"+idx).removeClass('un_lock fa-unlock').addClass('fa-lock');
                    }else{
                      $("#makePrivate"+idx).removeClass('fa-lock').addClass('un_lock fa-unlock');
                    }*/
                    return (<div className="col-lg-2 col-md-3 col-sm-3" key={idx}>
                      <a id={"create_client" + idx}>
                        <div className="list_block">
                          {/*<FontAwesome name='unlock' id={"makePrivate" + idx} defaultValue={details.makePrivate}/>*/}
                          <FontAwesome name='unlock' id={"makePrivate"} defaultValue={details.makePrivate}/>
                          <input type="checkbox" className="lock_input" id="makePrivate" checked={details.makePrivate} />
                          <div className="hex_outer portfolio-font-icons"
                               onClick={that.onTileSelect.bind(that, details.index, idx)}>
                            <img src={details.logo && details.logo.fileUrl?generateAbsolutePath(details.logo.fileUrl): "/images/def_profile.png"}/>
                          </div>
                          {/*<h3>{details.description} <span className="assets-list">50</span></h3>*/}
                          <h3>{details.companyName ? details.companyName : ""} </h3>
                        </div>
                      </a>
                    </div>)
                  })}
                </div>
              </div>
            
            <Popover placement="right" isOpen={this.state.popoverOpen}
                     target={"create_client" + this.state.selectedObject} toggle={this.toggle}>
              <PopoverTitle>Add New Client</PopoverTitle>
              <PopoverContent>
                <div className="ml_create_client">
                  <div className="medium-popover">
                    <div className="row">
                      <div className="col-md-12">
                        <div className="form-group mandatory">
                          <input type="text" name="companyName" placeholder="Company Name" ref={"companyName"}
                                 className="form-control float-label" defaultValue={this.state.data.companyName}
                                 onBlur={this.handleBlur} data-required={true}
                                 data-errMsg="Company Name is required"/>
                          <FontAwesome name='unlock' className="input_icon un_lock" id="isCompanyNamePrivate"
                                       defaultValue={this.state.data.isCompanyNamePrivate}
                                       onClick={this.onLockChange.bind(this, "companyName", "isCompanyNamePrivate")}/>
                        </div>
                        <div className="form-group">
                          <input type="text" name="clientDescription" placeholder="About" className="form-control float-label"
                                 id="" defaultValue={this.state.data.clientDescription} onBlur={this.handleBlur}/>
                          <FontAwesome name='unlock' className="input_icon un_lock" id="isClientDescriptionPrivate"
                                       defaultValue={this.state.data.isClientDescriptionPrivate}
                                       onClick={this.onLockChange.bind(this,"clientDescription", "isClientDescriptionPrivate")}/>
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
                          <div className="input_types">
                            <input id="makePrivate" type="checkbox"
                                   checked={this.state.data && this.state.data.makePrivate}
                                   name="checkbox"
                                   onChange={this.onStatusChangeNotify}/>
                            <label htmlFor="checkbox1"><span></span>Make Private</label>
                          </div>
                        </div>
                        <div className="ml_btn" style={{'textAlign': 'center'}}>
                          <a className="save_btn" onClick={this.onSaveAction}>Save</a>
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
          </div>)}
      </div>
    )
  }
}
MlServiceProviderClients.contextTypes = {
  serviceProviderPortfolio: PropTypes.object,
  portfolioKeys :PropTypes.object,
};
