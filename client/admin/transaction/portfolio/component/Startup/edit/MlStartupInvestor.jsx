import React, {Component, PropTypes} from "react";
import ScrollArea from "react-scrollbar";
import gql from "graphql-tag";
import _ from "lodash";
import {Popover, PopoverTitle, PopoverContent} from "reactstrap";
var FontAwesome = require('react-fontawesome');
import {dataVisibilityHandler, OnLockSwitch, initalizeFloatLabel} from "../../../../../utils/formElemUtil";
import Moolyaselect from "../../../../../commons/components/MlAdminSelectWrapper";
import {multipartASyncFormHandler} from "../../../../../../commons/MlMultipartFormAction";
import {fetchStartupDetailsHandler} from "../../../actions/findPortfolioStartupDetails";
import {putDataIntoTheLibrary} from '../../../../../../commons/actions/mlLibraryActionHandler'
import MlLoader from "../../../../../../commons/components/loader/loader";
import CropperModal from '../../../../../../commons/components/cropperModal';
import {mlFieldValidations} from "../../../../../../commons/validations/mlfieldValidation";
import generateAbsolutePath from '../../../../../../../lib/mlGenerateAbsolutePath';
import { fetchCurrencyTypeActionHandler } from '../../../../../../commons/actions/mlCurrencySymbolHandler';


const KEY = 'investor'
import Confirm from '../../../../../../commons/utils/confirm';
export default class MlStartupInvestor extends Component{
  constructor(props, context){
    super(props);
    this.state={
      loading: true,
      data:{},
      startupInvestor: [],
      popoverOpen:false,
      privateKey:{},
      selectedIndex:-1,
      startupInvestorList:[],
      selectedVal:null,
      selectedObject:"default",
      showProfileModal: false,
      uploadingAvatar: false,currencySymbol:"",currencyName:""
    }
    this.tabName = this.props.tabName || "";
    this.curSelectLogo = {};
    this.handleBlur = this.handleBlur.bind(this);
    this.fetchPortfolioDetails.bind(this);
    // this.imagesDisplay.bind(this);
    this.libraryAction.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.handleUploadAvatar = this.handleUploadAvatar.bind(this);
    this.onLogoFileUpload = this.onLogoFileUpload.bind(this);
    return this;
  }

  componentDidUpdate(){
    OnLockSwitch();
    dataVisibilityHandler();
    initalizeFloatLabel();
  }

  componentDidMount(){
    OnLockSwitch();
    dataVisibilityHandler();
    // this.imagesDisplay()
  }
  componentWillMount(){
    const resp = this.fetchPortfolioDetails();
    this.getCurrencyType();
    return resp
  }

  async getCurrencyType() {
    const response = await fetchCurrencyTypeActionHandler(this.props.client, null, this.props.portfolioDetailsId);
    this.setState({currencySymbol: response.symbol, currencyName:response.currencyName})
    return response;
  }

  async fetchPortfolioDetails() {
    let that = this;
    let portfolioDetailsId=that.props.portfolioDetailsId;
    let empty = _.isEmpty(that.context.startupPortfolio && that.context.startupPortfolio.investor)
    const response = await fetchStartupDetailsHandler(portfolioDetailsId, KEY);
    if(empty){
      if (response) {
        this.setState({loading: false, startupInvestor: response.investor, startupInvestorList: response.investor});
      }else {
        this.setState({loading: false})
      }
    }else{
      this.setState({loading: false, startupInvestor: that.context.startupPortfolio.investor, startupInvestorList:that.context.startupPortfolio.investor});
    }
    this.startupInvestorServer = response && response.investor?response.investor:[]
  }

  addInvestor(){
    this.setState({selectedObject: "default", popoverOpen: !(this.state.popoverOpen), data: {}, selectedVal: null})
    if(this.state.startupInvestor){
      this.setState({selectedIndex:this.state.startupInvestor.length})
    }else{
      this.setState({selectedIndex:0})
    }
  }

  onTileClick(index,uiIndex, e){
    let cloneArray = _.cloneDeep(this.state.startupInvestor);
   // let details = cloneArray[index]
    let details = _.find(cloneArray,{index:index});
    details = _.omit(details, "__typename");
    // if(details && details.logo){
    //   delete details.logo['__typename'];
    // }
    this.setState({ selectedIndex: index,
                    data:details,
                    selectedObject : uiIndex,
                    popoverOpen : !(this.state.popoverOpen),
                    "selectedVal" : details.fundingTypeId}, () => {
                    this.lockPrivateKeys(index)
    });
    this.curSelectLogo = details.logo
   /* setTimeout(function () {
      _.each(details.privateFields, function (pf) {
        $("#"+pf.booleanKey).removeClass('un_lock fa-unlock').addClass('fa-lock')
      })
    }, 10)*/
  }

  /**
   * UI creating lock function\
   * @Note: For the first Time context data is not working
   *        from the second time context when connection establish then its working
   * */
  //todo:// context data connection first time is not coming have to fix
  lockPrivateKeys(selIndex) {
    var privateValues = this.startupInvestorServer && this.startupInvestorServer[selIndex]?this.startupInvestorServer[selIndex].privateFields : []
    var filterPrivateKeys = _.filter(this.context.portfolioKeys && this.context.portfolioKeys.privateKeys, {tabName: this.props.tabName, index:selIndex})
    var filterRemovePrivateKeys = _.filter(this.context.portfolioKeys && this.context.portfolioKeys.removePrivateKeys, {tabName: this.props.tabName, index:selIndex})
    var finalKeys = _.unionBy(filterPrivateKeys, privateValues, 'booleanKey')
    var keys = _.differenceBy(finalKeys, filterRemovePrivateKeys, 'booleanKey')
    _.each(keys, function (pf) {
      $("#" + pf.booleanKey).removeClass('un_lock fa-unlock').addClass('fa-lock')
    })
  }


  onLockChange(fieldName, field, e){
    var isPrivate = false;
    let className = e.target.className;
    if(className.indexOf("fa-lock") != -1){
      isPrivate = true
    }
    var privateKey = {keyName:fieldName, booleanKey:field, isPrivate:isPrivate, index:this.state.selectedIndex, tabName:this.props.tabName}
    this.setState({privateKey:privateKey}, function () {
      this.sendDataToParent()
    })
  }

  onStatusChangeNotify(e){
    let updatedData = this.state.data||{};
    let key = e.target.id;
    updatedData=_.omit(updatedData,[key]);
    if (e.currentTarget.checked) {
      updatedData=_.extend(updatedData,{[key]:true});
    } else {
      updatedData=_.extend(updatedData,{[key]:false});
    }
    this.setState({data:updatedData}, function () {
      // this.sendDataToParent()
    })
  }

  onOptionSelected(selectedId){
    let details =this.state.data;
    details=_.omit(details,["fundingTypeId"]);
    details=_.extend(details,{["fundingTypeId"]:selectedId});
    this.setState({data:details, "selectedVal" : selectedId}, function () {
      // this.sendDataToParent()
    })

  }
  handleBlur(e){
    let details =this.state.data;
    let name  = e.target.name;
    details=_.omit(details,[name]);
    details=_.extend(details,{[name]:e.target.value});
    this.setState({data:details}, function () {
      // this.sendDataToParent()
    })
  }
  onSaveAction(e){
    const requiredFields = this.getFieldValidations();
    if (requiredFields && !requiredFields.errorMessage) {
      this.sendDataToParent(true)
    }else {
      toastr.error(requiredFields.errorMessage);
      return
    }
    var setObject =  this.state.startupInvestor
    if(this.context && this.context.startupPortfolio && this.context.startupPortfolio.investor ){
      setObject = this.context.startupPortfolio.investor
    }
    this.setState({startupInvestorList:setObject, popoverOpen : false})
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

  sendDataToParent(isSaveClicked) {
    let data = this.state.data;
    let startupInvestor1 = this.state.startupInvestor;
    let startupInvestor = _.cloneDeep(startupInvestor1);
    data.index = this.state.selectedIndex;
    data.logo = this.curSelectLogo;
    if(isSaveClicked){
      const actualIndex = this.getActualIndex(startupInvestor, this.state.selectedIndex);
      startupInvestor[actualIndex] = data;    //startupInvestor[this.state.index] = data;
    }
    let arr = [];
    _.each(startupInvestor, function (item) {
      for (var propName in item) {
        if (item[propName] === null || item[propName] === undefined) {
          delete item[propName];
        }
      }
      let newItem = _.omit(item, "__typename")
      newItem = _.omit(newItem, ["privateFields"])
      arr.push(newItem)
    })
    startupInvestor = arr;
    this.setState({startupInvestor: startupInvestor})
    this.props.getInvestorDetails(startupInvestor, this.state.privateKey);
  }

  onLogoFileUpload(image,fileInfo){
    let file=image;
    let name = 'logo';
    let fileName = fileInfo.name;
    if(file){
      let data ={moduleName: "PORTFOLIO", actionName: "UPLOAD", portfolioDetailsId:this.props.portfolioDetailsId, portfolio:{investor:[{logo:{fileUrl:'', fileName : fileName}, index:this.state.selectedIndex}]}};
      let response = multipartASyncFormHandler(data,file,'registration',this.onFileUploadCallBack.bind(this, name, file));
    }else{
      this.setState({
        uploadingAvatar: false,
      });
    }
  }
  onFileUploadCallBack(name,file, resp) {
    this.setState({
      uploadingAvatar: false,
      showProfileModal: false
    });
    if (resp) {
      let result = JSON.parse(resp);

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

      if (result && result.success) {
        this.curSelectLogo = {
          fileName: file && file.name ? file.name : "",
          fileUrl: result.result
        };
        //this.setState({loading: true});
       // this.fetchOnlyImages();
        // this.imagesDisplay()
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

  async fetchOnlyImages(){
    const response = await fetchStartupDetailsHandler(this.props.portfolioDetailsId, KEY);
    if (response && response.investor) {
      const thisState=this.state.selectedIndex;
      let dataDetails =this.state.startupInvestor
      let cloneBackUp = _.cloneDeep(dataDetails);
      let specificData = cloneBackUp[thisState];
      if(specificData){
        let curUpload=response.investor[thisState]
        specificData['logo']= curUpload['logo']
        this.setState({loading: false, startupInvestor:cloneBackUp });
      }else {
        this.setState({loading: false})
      }
    }
  }

  // async imagesDisplay(){
  //   const response = await fetchStartupDetailsHandler(this.props.portfolioDetailsId, KEY);
  //   if (response && response.investor) {
  //     let detailsArray = response.investor?response.investor:[]
  //     let dataDetails =this.state.startupInvestor
  //     let cloneBackUp = _.cloneDeep(dataDetails);
  //     _.each(detailsArray, function (obj,key) {
  //       cloneBackUp[key]["logo"] = obj.logo;
  //     })
  //     let listDetails = this.state.startupInvestorList || [];
  //     listDetails = cloneBackUp
  //     let cloneBackUpList = _.cloneDeep(listDetails);
  //     this.setState({loading: false, startupInvestor:cloneBackUp,startupInvestorList:cloneBackUpList});
  //   }
  // }
  toggleModal() {
    const that = this;
    this.setState({
      showProfileModal: !that.state.showProfileModal
    });
  }
  handleUploadAvatar(image,e) {
    this.setState({
      //uploadingAvatar: true,,
    });
    this.onLogoFileUpload(image,e);
  }

  render(){
    let query=gql`query{
      data:fetchFundingTypes {
        label:displayName
        value:_id
      }
    }`;
    let that = this;
    const showLoader = that.state.loading;
    let investorsArray = that.state.startupInvestorList || [];
    let displayUploadButton = null;
    if(this.state.selectedObject != "default"){
      displayUploadButton = true
    }else{
      displayUploadButton = false
    }
    return (
      <div>
        {showLoader === true ? ( <MlLoader/>) : (
        <div>
          <h2>Investor</h2>
          <div className="requested_input main_wrap_scroll">
            <ScrollArea
              speed={0.8}
              className="main_wrap_scroll"
              smoothScrolling={true}
              default={true}
            >
              <div className="col-lg-12">
                <div className="row">
                  <div className="col-lg-2 col-md-3 col-sm-3">
                    <a href="" id="create_clientdefault" data-placement="top" data-class="large_popover" >
                      <div className="list_block notrans" onClick={this.addInvestor.bind(this)}>
                        <div className="hex_outer"><span className="ml ml-plus "></span></div>
                        <h3 onClick={this.addInvestor.bind(this)}>Add New Investor</h3>
                      </div>
                    </a>
                  </div>
                  {investorsArray.map(function (details, idx) {
                    return(<div className="col-lg-2 col-md-3 col-sm-3" key={idx}>
                      <a id={"create_client"+idx}>
                        <div className="list_block">
                          <FontAwesome name='unlock'  id={"investor_"+idx} defaultValue={details.makePrivate}/><input type="checkbox" className="lock_input" id="isInvestorPrivate" checked={details.makePrivate}/>
                          <div className="hex_outer" id={"details"+idx} onClick={that.onTileClick.bind(that,details.index, idx)}><img
                            src={details.logo ? generateAbsolutePath(details.logo.fileUrl) : "/images/def_profile.png"}/></div>
                          <h3>{details.investorName ? details.investorName : ''}</h3>
                        </div>
                      </a>
                    </div>)
                  })}
                </div>
              </div>

            </ScrollArea>

            <Popover placement="right" isOpen={this.state.popoverOpen}  target={"create_client"+this.state.selectedObject} toggle={this.toggle}>
              <PopoverTitle>Add Investor</PopoverTitle>
              <PopoverContent>
                <div  className="ml_create_client">
                  <div className="medium-popover"><div className="row">
                    <div className="col-md-12">
                      <div className="form-group mandatory">
                        <input type="text" name="investorName" placeholder="Name" className="form-control float-label"
                               defaultValue={this.state.data.investorName} onBlur={this.handleBlur}
                               ref={"investorName"} data-required={true}
                               data-errMsg="Investor Name is required"/>
                        <FontAwesome name='unlock' className="input_icon req_textarea_icon un_lock" id="isNamePrivate" defaultValue={this.state.data.isNamePrivate}  onClick={this.onLockChange.bind(this, "investorName", "isNamePrivate")}/>
                      </div>
                      <Moolyaselect multiSelect={false} className="form-control float-label" valueKey={'value'}
                                    labelKey={'label'} queryType={"graphql"} query={query}
                                    placeholder={'Select Funding..'}
                                    isDynamic={true} mandatory={true} ref={"fundingTypeId"}
                                    onSelect={this.onOptionSelected.bind(this)}
                                    selectedValue={this.state.selectedVal} data-required={true}
                                    data-errMsg="Funding is required"/>
                      <div className="form-group">
                        <input type="text" name="investmentAmount" placeholder={`Investment Amount in ${this.state.currencyName} (${this.state.currencySymbol})`} className="form-control float-label" id="" defaultValue={this.state.data.investmentAmount}  onBlur={this.handleBlur}/>
                        <FontAwesome name='unlock' className="input_icon req_textarea_icon un_lock" id="isInvestmentAmountPrivate" defaultValue={this.state.data.isInvestmentAmountPrivate}  onClick={this.onLockChange.bind(this, "investmentAmount", "isInvestmentAmountPrivate")}/>
                      </div>
                      <div className="form-group">
                        <input type="text" name="investorDescription" placeholder="About" className="form-control float-label" id="" defaultValue={this.state.data.investorDescription}  onBlur={this.handleBlur}/>
                        <FontAwesome name='unlock' className="input_icon req_textarea_icon un_lock" id="isDescriptionPrivate" defaultValue={this.state.data.isDescriptionPrivate}  onClick={this.onLockChange.bind(this, "investorDescription", "isDescriptionPrivate")}/>
                      </div>
                      {displayUploadButton?<div className="form-group">
                        <div className="fileUpload mlUpload_btn">
                          <span onClick={this.toggleModal.bind(this)}>Upload Logo</span>
                          {/*  <input type="file" name="logo" id="logo" className="upload"  accept="image/!*" onChange={this.onLogoFileUpload.bind(this)}  />*/}
                        </div>
                      </div>:""}
                      <div className="clearfix"></div>
                      <div className="form-group">
                        <div className="input_types"><input id="makePrivate" type="checkbox" checked={this.state.data.makePrivate&&this.state.data.makePrivate}  name="checkbox" onChange={this.onStatusChangeNotify.bind(this)}/><label htmlFor="checkbox1"><span></span>Make Private</label></div>
                      </div>
                      <div className="ml_btn" style={{'textAlign': 'center'}}>
                        <a href="" className="save_btn" onClick={this.onSaveAction.bind(this)}>Save</a>
                      </div>
                    </div>
                  </div></div>
                </div>
              </PopoverContent>
            </Popover>
            <CropperModal
              uploadingImage={this.state.uploadingAvatar}
              handleImageUpload={this.handleUploadAvatar}
              cropperStyle="square"
              show={this.state.showProfileModal}
              toggleShow={this.toggleModal}
            />
          </div>
        </div>)}
      </div>
    )
  }
}
MlStartupInvestor.contextTypes = {
  startupPortfolio: PropTypes.object,
  portfolioKeys :PropTypes.object,
};
