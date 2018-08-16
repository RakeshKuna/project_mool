import React, {Component, PropTypes} from "react";
import { connect } from 'react-redux';
import gql from "graphql-tag";
import _ from "lodash";
var FontAwesome = require('react-fontawesome');
import {Popover, PopoverTitle, PopoverContent} from "reactstrap";
import {dataVisibilityHandler, OnLockSwitch} from "../../../../../../utils/formElemUtil";
import ScrollArea from "react-scrollbar";
import Moolyaselect from "../../../../../../commons/components/MlAdminSelectWrapper";
import {multipartASyncFormHandler} from "../../../../../../../commons/MlMultipartFormAction";
import {fetchStartupDetailsHandler} from "../../../../actions/findPortfolioStartupDetails";
import {putDataIntoTheLibrary} from '../../../../../../../commons/actions/mlLibraryActionHandler'
import MlLoader from "../../../../../../../commons/components/loader/loader";
import {mlFieldValidations} from "../../../../../../../commons/validations/mlfieldValidation";
import generateAbsolutePath from '../../../../../../../../lib/mlGenerateAbsolutePath';
import Confirm from '../../../../../../../commons/utils/confirm';

const KEY = 'assets';

class MlStartupAssets extends Component{
  constructor(props, context){
    super(props);
    this.state={
      loading: false,
      data:{},
      privateKey:{},
      startupAssets:this.props.assetsDetails || [],
      startupAssetsList:this.props.assetsDetails || [],
      popoverOpen:false,
      selectedIndex:-1,
      selectedAssetType:null,
      selectedObject:"default"
    }
    this.startupAssetsServer = this.props.assetsDetails || []
    this.tabName = this.props.tabName || ""
    this.handleBlur.bind(this);
    // this.imagesDisplay.bind(this);
    this.libraryAction.bind(this)
    return this;
  }
  componentDidUpdate(){
    OnLockSwitch();
    dataVisibilityHandler();
  }

  componentDidMount(){
    OnLockSwitch();
    dataVisibilityHandler();
    // this.imagesDisplay()
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
  componentWillMount(){
    let empty = _.isEmpty(this.context.startupPortfolio && this.context.startupPortfolio.assets)
    if(!empty){
      this.setState({loading: false, startupAssets: this.context.startupPortfolio.assets, startupAssetsList:this.context.startupPortfolio.assets});
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
    var setObject =  this.state.startupAssets
    if(this.context && this.context.startupPortfolio && this.context.startupPortfolio.assets ){
      setObject = this.context.startupPortfolio.assets
    }
    this.setState({startupAssetsList:setObject,popoverOpen : false})
  }

  addAsset(){
    this.setState({selectedObject: "default", popoverOpen: !(this.state.popoverOpen), data: {}, selectedVal: null})
    if(this.state.startupAssets){
      this.setState({selectedIndex:this.state.startupAssets.length})
    }else{
      this.setState({selectedIndex:0})
    }
  }

  onTileClick(index, e){
    let cloneArray = _.cloneDeep(this.state.startupAssets);
    let details = cloneArray[index]
    details = _.omit(details, "__typename");
    if(details && details.logo){
      delete details.logo['__typename'];
    }
    this.setState({
      selectedIndex: index, data: details, selectedObject: index,
      popoverOpen: !(this.state.popoverOpen), "selectedVal": details.assetTypeId
    }, () => {
      this.lockPrivateKeys(index)
    });
    // setTimeout(function () {
    //   _.each(details.privateFields, function (pf) {
    //     $("#"+pf.booleanKey).removeClass('un_lock fa-unlock').addClass('fa-lock')
    //   })
    // }, 10)
  }

  lockPrivateKeys(selIndex) {
    const privateValues = this.startupAssetsServer && this.startupAssetsServer[selIndex]?this.startupAssetsServer[selIndex].privateFields : []
    const filterPrivateKeys = _.filter(this.context.portfolioKeys && this.context.portfolioKeys.privateKeys, {tabName: this.props.tabName, index:selIndex})
    const filterRemovePrivateKeys = _.filter(this.context.portfolioKeys&&this.context.portfolioKeys.removePrivateKeys, {tabName: this.props.tabName, index:selIndex})
    const finalKeys = _.unionBy(filterPrivateKeys, privateValues, 'booleanKey')
    const keys = _.differenceBy(finalKeys, filterRemovePrivateKeys, 'booleanKey')
    console.log('keysssssssssssssss', keys)
    _.each(keys, function (pf) {
      $("#" + pf.booleanKey).removeClass('un_lock fa-unlock').addClass('fa-lock')
    })
  }

  onLockChange(fieldName, field, e){
    var isPrivate = false
    let className = e.target.className;
    if(className.indexOf("fa-lock") != -1){
      isPrivate = true
    }
    var privateKey = {keyName:fieldName, booleanKey:field, isPrivate:isPrivate, index:this.state.selectedIndex, tabName:KEY}
    this.setState({privateKey:privateKey}, ()=>{
      this.sendDataToParent()
    });
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
    this.setState({data:updatedData})
  }

  handleBlur(e){
    let details =this.state.data;
    let name  = e.target.name;
    details=_.omit(details,[name]);
    details=_.extend(details,{[name]:e.target.value});
    this.setState({data:details})
  }

  assetTypeOptionSelected(selectedId, callback, selObject){
    let details =this.state.data;
    details=_.omit(details,["assetTypeId"]);
    details=_.omit(details,["assetTypeName"]);
    details=_.extend(details,{["assetTypeId"]: selectedId, assetTypeName: selObject.label});
    this.setState({data: details, "selectedVal": selectedId, assetTypeName: selObject.label})
  }

  getFieldValidations() {
    const ret = mlFieldValidations(this.refs);
    return {tabName: this.tabName, errorMessage: ret, index: this.state.selectedIndex}
  }

  sendDataToParent(isSaveClicked){
    let data = this.state.data;
    let assets = this.state.startupAssets;
    let startupAssets = _.cloneDeep(assets);
    data.index = this.state.selectedIndex;
    if(isSaveClicked){
      startupAssets[this.state.selectedIndex] = data;
    }
    let arr = [];
    _.each(startupAssets, function (item)
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
    startupAssets = arr;
    this.setState({startupAssets:startupAssets})
    this.props.getStartupAssets(startupAssets, this.state.privateKey);

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

  emptyClick(e) {
    if (this.state.popoverOpen)
      this.setState({popoverOpen: false})
  }

  render(){
    let assetsQuery=gql`query{
      data:fetchAssets {
        label:displayName
        value:_id
      }
    }`;
    let that = this;
    const showLoader = that.state.loading;
    let assetsArray = that.state.startupAssetsList || [];
    let displayUploadButton = null
    if(this.state.selectedObject != "default"){
      displayUploadButton = true
    }else{
      displayUploadButton = false
    }
    let  quantityActive = '',assetDescriptionActive = ''
    if(this.state.data.quantity){
      quantityActive = 'active'
    }
    if(this.state.data.assetDescription){
      assetDescriptionActive = 'active'
    }
    return(
      <div onClick={this.emptyClick.bind(this)}>
        <h2>Assets</h2>
        {showLoader === true ? ( <MlLoader/>) : (
        <div className="requested_input main_wrap_scroll">

          
            <div className="col-lg-12">
              <div className="row">
                <div className="col-lg-2 col-md-3 col-sm-3">
                  <a href="" id="create_clientdefault" data-placement="right" data-class="large_popover" >
                    <div className="list_block notrans" onClick={this.addAsset.bind(this)}>
                      <div className="hex_outer"><span className="ml ml-plus "></span></div>
                      <h3 onClick={this.addAsset.bind(this)}>Add New Asset</h3>
                    </div>
                  </a>
                </div>
                {assetsArray.map(function (details, idx) {
                 return(<div className="col-lg-2 col-md-3 col-sm-3" key={idx}>
                    <a href="" id={"create_client"+idx}>
                      <div className="list_block">
                        <FontAwesome name='unlock'  id="makePrivate" defaultValue={details.makePrivate}/><input type="checkbox" className="lock_input" id="isAssetTypePrivate" checked={details.makePrivate}/>
                        {/*<div className="cluster_status inactive_cl" onClick={that.onDeleteAsset.bind(that, idx)}><FontAwesome name='times'/></div>*/}
                        <div className="hex_outer portfolio-font-icons" onClick={that.onTileClick.bind(that, idx)}>
                          <img src={details.logo && details.logo.fileUrl ? generateAbsolutePath(details.logo.fileUrl) : "/images/sub_default.jpg"}/>
                        </div>
                        <h3>{details.assetTypeName?details.assetTypeName:""}<span className="assets-list">{details.quantity?details.quantity:"0"}</span></h3>
                      </div>
                    </a>
                  </div>)
                })}
              </div>
            </div>

          
          <Popover placement="right" isOpen={this.state.popoverOpen} target={"create_client"+this.state.selectedObject} toggle={this.toggle}>
            <PopoverTitle>Asset</PopoverTitle>
            <PopoverContent>
              <div  className="ml_create_client">
                <div className="medium-popover"><div className="row">
                  <div className="col-md-12">
                    <Moolyaselect multiSelect={false} className="form-control float-label" valueKey={'value'}
                                  ref={"assetTypeId"}
                                  labelKey={'label'} queryType={"graphql"} query={assetsQuery} mandatory={true}
                                  isDynamic={true} placeholder={'Select  Asset..'}
                                  onSelect={this.assetTypeOptionSelected.bind(this)}
                                  selectedValue={this.state.selectedVal}
                                  data-required={true} data-errMsg="Asset Type is required"/>
                    <div className="form-group mandatory">
                      <span className={`placeHolder ${quantityActive}`}>Enter Number of Quantity</span>
                      <input type="number" name="quantity" placeholder="Enter Number of Quantity" ref={"quantity"}
                             className="form-control float-label" defaultValue={this.state.data.quantity}
                             onBlur={this.handleBlur.bind(this)} data-required={true}
                             data-errMsg="Number of Quantity is required"/>
                      <FontAwesome name='unlock' className="input_icon req_textarea_icon un_lock"
                                   id="isQuantityTypePrivate" defaultValue={this.state.data.isQuantityTypePrivate}
                                   onClick={this.onLockChange.bind(this, "quantity", "isQuantityTypePrivate")}/>
                    </div>

                    <div className="form-group">
                      <span className={`placeHolder ${assetDescriptionActive}`}>About</span>
                      <input type="text" name="assetDescription" placeholder="About" className="form-control float-label" id="" defaultValue={this.state.data.assetDescription} onBlur={this.handleBlur.bind(this)}/>
                      <FontAwesome name='unlock' className="input_icon req_textarea_icon un_lock" id="isDescriptionPrivate" onClick={this.onLockChange.bind(this, "assetDescription", "isDescriptionPrivate")}/>
                    </div>
                    {/*{displayUploadButton?<div className="form-group">*/}
                      {/*<div className="fileUpload mlUpload_btn">*/}
                        {/*<span>Upload Logo</span>*/}
                        {/*<input type="file" name="logo" id="logo" className="upload"  accept="image/*" onChange={this.onLogoFileUpload.bind(this)}  />*/}
                      {/*</div>*/}
                    {/*</div>:""}*/}
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
        </div>)}
      </div>
    )
  }
}
MlStartupAssets.contextTypes = {
  startupPortfolio: PropTypes.object,
  portfolioKeys: PropTypes.object
};

// const mapStateToProps = (state, ownProps) => {
//   return {
//     keys: state.mlStartupEditTemplateReducer.privateKeys
//   };
// }

// export default connect(mapStateToProps)(MlStartupAssets);
export default MlStartupAssets;
