import React, {Component, PropTypes} from "react";
import ScrollArea from "react-scrollbar";
import gql from "graphql-tag";
import _ from "lodash";
import Datetime from "react-datetime";
var FontAwesome = require('react-fontawesome')
import {Popover, PopoverTitle, PopoverContent} from "reactstrap";
import {dataVisibilityHandler, OnLockSwitch, initalizeFloatLabel} from "../../../../../utils/formElemUtil";
import Moolyaselect from "../../../../../commons/components/MlAdminSelectWrapper";
import {multipartASyncFormHandler} from "../../../../../../commons/MlMultipartFormAction";
import {fetchStartupDetailsHandler} from "../../../actions/findPortfolioStartupDetails";
import MlLoader from "../../../../../../commons/components/loader/loader";
import {putDataIntoTheLibrary} from '../../../../../../commons/actions/mlLibraryActionHandler'
import CropperModal from '../../../../../../commons/components/cropperModal';
import {mlFieldValidations} from "../../../../../../commons/validations/mlfieldValidation";
import generateAbsolutePath from '../../../../../../../lib/mlGenerateAbsolutePath';
import Confirm from '../../../../../../commons/utils/confirm';
const KEY = "awardsRecognition"

export default class MlStartupAwards extends Component{
  constructor(props, context){
    super(props);
    this.state={
      loading: true,
      data:{},
      fileName:"",
      privateKey:{},
      startupAwards: [],
      popoverOpen:false,
      selectedIndex:-1,
      startupAwardsList:[],
      selectedVal:null,
      selectedObject:"default",
      showProfileModal: false,
      uploadingAvatar: false
    }
    this.tabName = this.props.tabName || ""
    this.curSelectLogo = {};
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

  componentDidUpdate(){
    OnLockSwitch();
    dataVisibilityHandler()
    initalizeFloatLabel();
  }

  componentDidMount(){
    OnLockSwitch();
    dataVisibilityHandler();
    //initalizeFloatLabel();
  }
  componentWillMount(){
    const resp= this.fetchPortfolioDetails();
    return resp;
  }
  async fetchPortfolioDetails() {
    let that = this;
    let portfolioDetailsId=that.props.portfolioDetailsId;
    var awardsRecognition = that.context.startupPortfolio && that.context.startupPortfolio.awardsRecognition
    let empty = _.isEmpty(awardsRecognition)
    const response = await fetchStartupDetailsHandler(portfolioDetailsId, KEY);
    if(empty){
      if (response && response.awardsRecognition && response.awardsRecognition.length>0) {
        this.setState({loading: false, startupAwards: response.awardsRecognition, startupAwardsList: response.awardsRecognition});
      }else{
        this.setState({loading:false})
      }
    }else{
      this.setState({loading: false, startupAwards: that.context.startupPortfolio.awardsRecognition, startupAwardsList: that.context.startupPortfolio.awardsRecognition});
    }
    this.startupAwardServer = response&&response.awardsRecognition?response.awardsRecognition:[]
  }

  addAward(){
    this.setState({selectedObject: "default", popoverOpen: !(this.state.popoverOpen), data: {}, selectedVal: null})
    if(this.state.startupAwards){
      this.setState({selectedIndex:this.state.startupAwards.length})
    }else{
      this.setState({selectedIndex:0})
    }
  }

  onSaveAction(e){
    const requiredFields = this.getFieldValidations();
    if (requiredFields && !requiredFields.errorMessage) {
      this.sendDataToParent(true)
    }else {
      toastr.error(requiredFields.errorMessage);
      return
    }
    var setObject =  this.state.startupAwards
    if(this.context && this.context.startupPortfolio && this.context.startupPortfolio.awardsRecognition ){
      setObject = this.context.startupPortfolio.awardsRecognition
    }
    this.setState({startupAwardsList:setObject, popoverOpen : false})
    this.curSelectLogo = {}
  }

  onTileClick(index,uiIndex, e){
    let cloneArray = _.cloneDeep(this.state.startupAwards);
    //let details = cloneArray[index]
    let details = _.find(cloneArray,{index:index});
    details = _.omit(details, "__typename");
    this.curSelectLogo = details.logo
    this.setState({selectedIndex:index,
      data:details,selectedObject : uiIndex,
      "selectedVal" : details.awardId,
      popoverOpen : !(this.state.popoverOpen)},() => {
      this.lockPrivateKeys(index)
    });
  }

  //todo:// context data connection first time is not coming have to fix
  lockPrivateKeys(selIndex) {
    var privateValues = this.startupAwardServer && this.startupAwardServer[selIndex]?this.startupAwardServer[selIndex].privateFields : []
    var filterPrivateKeys = _.filter(this.context.portfolioKeys && this.context.portfolioKeys.privateKeys, {tabName: this.props.tabName, index:selIndex})
    var filterRemovePrivateKeys = _.filter(this.context.portfolioKeys&&this.context.portfolioKeys.removePrivateKeys, {tabName: this.props.tabName, index:selIndex})
    var finalKeys = _.unionBy(filterPrivateKeys, privateValues, 'booleanKey')
    var keys = _.differenceBy(finalKeys, filterRemovePrivateKeys, 'booleanKey')
    console.log('keysssssssssssssss', keys)
    _.each(keys, function (pf) {
      $("#" + pf.booleanKey).removeClass('un_lock fa-unlock').addClass('fa-lock')
    })
  }

  onLockChange(fiedName, field, e){
    var isPrivate = false
    let className = e.target.className;
    if(className.indexOf("fa-lock") != -1){
      isPrivate = true
    }
    var privateKey = {keyName:fiedName, booleanKey:field, isPrivate:isPrivate, index:this.state.selectedIndex, tabName: this.props.tabName}
    this.setState({privateKey:privateKey}, function () {
      this.sendDataToParent()
    })
  }

  onStatusChangeNotify(e)
  {
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

  onOptionSelected(selectedAward, callback, selObject) {
    let details = this.state.data;
    details = _.omit(details, ["awardId"]);
    details = _.omit(details, ["awardName"]);
    if(selectedAward){
      details = _.extend(details, {["awardId"]: selectedAward, "awardName": selObject.label});
      this.setState({data: details, "selectedVal": selectedAward, awardName: selObject.label}, function () {
        // this.sendDataToParent()
      })
    }else {
      details = _.extend(details, {["awardId"]: '', "awardName": ''});
      this.setState({data: details, "selectedVal": '', awardName: ''}, function () {
        // this.sendDataToParent()
      })
    }

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

  handleYearChange(e){
    let details =this.state.data;
    let name  = 'year';
    details=_.omit(details,[name]);
    details=_.extend(details,{[name]:this.refs.year.state.inputValue});
    this.setState({data:details}, function () {
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

  sendDataToParent(isSaveClicked){
    let data = this.state.data;
    let awards = this.state.startupAwards;
    let startupAwards = _.cloneDeep(awards);
    data.index = this.state.selectedIndex;
    data.logo = this.curSelectLogo;
    if(isSaveClicked){
        const actualIndex = this.getActualIndex(startupAwards, this.state.selectedIndex);
      startupAwards[actualIndex] = data;
    }
    let arr = [];
    _.each(startupAwards, function (item)
    {
        for (var propName in item) {
          if (item[propName] === null || item[propName] === undefined) {
            delete item[propName];
          }
        }
        let newItem = _.omit(item, "__typename");
        newItem = _.omit(newItem, ["privateFields"])
        arr.push(newItem)
    })
    startupAwards = arr;
    this.setState({startupAwards:startupAwards})
    this.props.getAwardsDetails(startupAwards, this.state.privateKey);
  }

  onLogoFileUpload(fileInfo,image){
    let fileName = fileInfo.name;
    this.setState({fileName: fileName})
    let file =image;
    if(file){
      let data ={moduleName: "PORTFOLIO", actionName: "UPLOAD", portfolioDetailsId:this.props.portfolioDetailsId, portfolio:{awardsRecognition:[{logo:{fileUrl:'', fileName : fileName}, index:this.state.selectedIndex}]}};
      let response = multipartASyncFormHandler(data,file,'registration',this.onFileUploadCallBack.bind(this, file));
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
        //this.setState({loading: true})
        //this.fetchOnlyImages();
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
    if (response && response.awardsRecognition) {
      let dataDetails =this.state.startupAwards
      let cloneBackUp = _.cloneDeep(dataDetails);
      let specificData = cloneBackUp[this.state.selectedIndex];
      if(specificData){
        let curUpload=response.awardsRecognition[this.state.selectedIndex]
        specificData['logo']= curUpload['logo']
        this.setState({loading: false, startupAwards:cloneBackUp });

      }else {
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
  handleUploadAvatar(image,e) {
    this.setState({
      //uploadingAvatar: true,,
    });
    this.onLogoFileUpload(e,image);
  }

  render(){
    var yesterday = Datetime.moment().subtract(0,'day');
    var valid = function( current ){
      return current.isBefore( yesterday );
    };
    let query=gql`query{
      data:fetchActiveAwards {
        label:awardDisplayName
        value:_id
      }
    }`;
    let that = this;
    const showLoader = that.state.loading;
    let startupAwardsList = that.state.startupAwardsList || [];
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
          <h2>Awards</h2>
          <div className="requested_input main_wrap_scroll">
            <ScrollArea
              speed={0.8}
              className="main_wrap_scroll"
              smoothScrolling={true}
              default={true}>
              <div className="col-lg-12">
                <div className="row">
                  <div className="col-lg-2 col-md-3 col-sm-3">
                    <a href="" id="create_clientdefault" data-placement="top" data-class="large_popover" >
                      <div className="list_block notrans" onClick={this.addAward.bind(this)}>
                        <div className="hex_outer"><span className="ml ml-plus "></span></div>
                        <h3 onClick={this.addAward.bind(this)}>Add New Awards</h3>
                      </div>
                    </a>
                  </div>
                  {startupAwardsList.map(function (details, idx) {
                    return(<div className="col-lg-2 col-md-3 col-sm-3" key={idx}>
                      <a href="" id={"create_client"+idx}>
                        <div className="list_block">
                          <FontAwesome name='unlock' id="makePrivate" defaultValue={details.makePrivate}/><input type="checkbox" className="lock_input" id="isAssetTypePrivate" checked={details.makePrivate}/>
                          {/*<div className="cluster_status inactive_cl"><FontAwesome name='times'/></div>*/}
                          <div className="hex_outer" onClick={that.onTileClick.bind(that, details.index,idx)}><img
                            src={details.logo ? generateAbsolutePath(details.logo.fileUrl) : "/images/def_profile.png"}/></div>
                          <h3>{details.awardName?details.awardName:""}</h3>
                        </div>
                      </a>
                    </div>)
                  })}
                </div>
              </div>
            </ScrollArea>
            <Popover placement="right" isOpen={this.state.popoverOpen}  target={"create_client"+this.state.selectedObject} toggle={this.toggle}>
              <PopoverTitle>Add Award</PopoverTitle>
              <PopoverContent>
                <div  className="ml_create_client">
                  <div className="medium-popover"><div className="row">
                    <div className="col-md-12">
                      <Moolyaselect multiSelect={false} className="form-control float-label" valueKey={'value'}
                                    labelKey={'label'} queryType={"graphql"} query={query}
                                    isDynamic={true} placeholder="Select Award.."
                                    onSelect={this.onOptionSelected.bind(this)} mandatory={true}
                                    selectedValue={this.state.selectedVal} ref={"awardId"} data-required={true}
                                    data-errMsg="Award is required"/>
                      <div className="form-group">
                        <Datetime dateFormat="YYYY" timeFormat={false} viewMode="years"
                                  inputProps={{placeholder: "Select Year", className:"float-label form-control",readOnly:true}} defaultValue={this.state.data&&this.state.data.year?this.state.data.year:0}
                                  closeOnSelect={true} ref="year" onBlur={this.handleYearChange.bind(this)} isValidDate={this.state.data&&this.state.data.year? valid :"" }/>
                      </div>
                      <div className="form-group">
                        <input type="text" name="awardsDescription" placeholder="About" className="form-control float-label" defaultValue={this.state.data.awardsDescription}  onBlur={this.handleBlur}/>
                        <FontAwesome name='unlock' className="input_icon req_textarea_icon un_lock" id="isDescriptionPrivate" defaultValue={this.state.data.isDescriptionPrivate}  onClick={this.onLockChange.bind(this, "awardsDescription", "isDescriptionPrivate")}/>
                      </div>
                      {displayUploadButton?<div className="form-group">
                        <div className="fileUpload mlUpload_btn">
                          <span onClick={this.toggleModal.bind(this)}>Upload Logo</span>
                          {/* <input type="file" name="logo" id="logo" className="upload"  accept="image/!*" onChange={this.onLogoFileUpload.bind(this)}  />*/}
                        </div>
                      </div>:""}
                      <div className="clearfix"></div>
                      <div className="form-group">
                        <div className="input_types"><input id="makePrivate" type="checkbox" checked={this.state.data.makePrivate&&this.state.data.makePrivate}  name="checkbox" onChange={this.onStatusChangeNotify.bind(this)}/><label htmlFor="checkbox1"><span></span>Make Private</label></div>
                      </div>
                      <div className="ml_btn" style={{'textAlign': 'center'}}>
                        <a className="save_btn" onClick={this.onSaveAction.bind(this)}>Save</a>
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
MlStartupAwards.contextTypes = {
  startupPortfolio: PropTypes.object,
  portfolioKeys :PropTypes.object,
};
