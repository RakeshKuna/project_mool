import React, { Component, PropTypes }  from "react";
import { connect } from 'react-redux';
import ScrollArea from 'react-scrollbar'
import gql from 'graphql-tag';
import _ from 'lodash';
import { Button, Popover, PopoverTitle, PopoverContent } from 'reactstrap';
var FontAwesome = require('react-fontawesome');
import {dataVisibilityHandler, OnLockSwitch} from '../../../../../../utils/formElemUtil';
import {putDataIntoTheLibrary} from '../../../../../../../commons/actions/mlLibraryActionHandler'
import Moolyaselect from  '../../../../../../commons/components/MlAdminSelectWrapper';
import {multipartASyncFormHandler} from '../../../../../../../commons/MlMultipartFormAction'
import {fetchStartupDetailsHandler} from '../../../../actions/findPortfolioStartupDetails';
import MlLoader from '../../../../../../../commons/components/loader/loader'
import {mlFieldValidations} from "../../../../../../../commons/validations/mlfieldValidation";
import generateAbsolutePath from '../../../../../../../../lib/mlGenerateAbsolutePath';
import Confirm from '../../../../../../../commons/utils/confirm';

const KEY = "branches"

class MlStartupBranches extends Component{
  constructor(props, context){
    super(props);
    this.state={
      loading: false,
      data:{},
      privateKey:{},
      startupBranches:this.props.branchDetails || [],
      popoverOpen:false,
      selectedIndex:-1,
      countryId:null,
      stateId: null,
      cityId:null,
      startupBranchesList:this.props.branchDetails || [],
      selectedVal:null,
      selectedObject:"default"
    }
    this.startupBranchesServer = this.props.branchDetails || [];
    this.tabName = this.props.tabName || ""
    this.curSelectLogo = {};
    this.handleBlur.bind(this);
    this.libraryAction.bind(this);
    this.onSaveAction = this.onSaveAction.bind(this);
    return this;
  }
  componentDidUpdate(){
    OnLockSwitch();
    dataVisibilityHandler();
  }

  componentDidMount(){
    OnLockSwitch();
    dataVisibilityHandler();
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
    let empty = _.isEmpty(this.context.startupPortfolio && this.context.startupPortfolio.branches)
    if(!empty){
      this.setState({loading: false, startupBranches: this.context.startupPortfolio.branches, startupBranchesList:this.context.startupPortfolio.branches});
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
    var setObject =  this.state.startupBranches
    if(this.context && this.context.startupPortfolio && this.context.startupPortfolio.branches ){
      setObject = this.context.startupPortfolio.branches
    }
    this.setState({startupBranchesList:setObject,popoverOpen : false})
    this.curSelectLogo = {}
  }

  addBranch(){
    this.setState({selectedObject: "default", popoverOpen: !(this.state.popoverOpen), data: {}, selectedVal: null})
    if(this.state.startupBranches){
      this.setState({selectedIndex:this.state.startupBranches.length})
    }else{
      this.setState({selectedIndex:0})
    }
  }

  onTileClick(index,uiIndex, e){
    let cloneArray = _.cloneDeep(this.state.startupBranches);
   // let details = cloneArray[index]
    let details = _.find(cloneArray,{index:index});
    details = _.omit(details, "__typename");
    this.curSelectLogo = details.logo
    this.setState({
      selectedIndex: index, data: details, selectedObject: uiIndex,
      popoverOpen: !(this.state.popoverOpen), "selectedVal": details.addressTypeId,
      "countryId": details.countryId, "cityId": details.cityId, "stateId": details.stateId
    }, () => {
      this.lockPrivateKeys(index)
    });
    // const privateFieldAry = _.filter(details.privateFields, {tabName: this.props.tabName});
    // setTimeout(function () {
    //   _.each(privateFieldAry, function (pf) {
    //     $("#"+pf.booleanKey).removeClass('un_lock fa-unlock').addClass('fa-lock')
    //   })
    // }, 10)
  }

  lockPrivateKeys(selIndex) {
    const privateValues = this.startupBranchesServer && this.startupBranchesServer[selIndex]?this.startupBranchesServer[selIndex].privateFields : []
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
    var isPrivate = false;
    let className = e.target.className;
    if(className.indexOf("fa-lock") != -1){
      isPrivate = true
    }
    var privateKey = {keyName:fieldName, booleanKey:field, isPrivate:isPrivate, index:this.state.selectedIndex, tabName:KEY};
    if (fieldName === "logo")
      privateKey["objectName"] = "logo";
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
    this.setState({data:updatedData})
  }
  onOptionSelected(selectedBranch){
    let details =this.state.data;
    details=_.omit(details,["addressTypeId"]);
    details=_.extend(details,{["addressTypeId"]: selectedBranch});
    this.setState({ data: details, "selectedVal": selectedBranch })
  }
  onOptionSelectedCountry(val){
    let details =this.state.data;
    details=_.omit(details,["countryId"]);
    details=_.extend(details,{["countryId"]:val});
    this.setState({data: details, "countryId": val})
  }

  onOptionSelectedStates(value, callback, label){
    let details =this.state.data;
    details=_.omit(details,["stateId"]);
    details=_.omit(details,["branchState"]);
    details=_.extend(details,{["stateId"]: value, ["branchState"]:label.label});
    this.setState({data: details, "stateId": value})
  }
  onOptionSelectedCities(val, callback, label){
    let details =this.state.data;
    details=_.omit(details,["cityId"]);
    details=_.omit(details,["branchCity"]);
    details=_.extend(details,{["cityId"]: val, ["branchCity"]:label.label});
    this.setState({data: details, "cityId": val})
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
    let branches = this.state.startupBranches;
    let startupBranches = _.cloneDeep(branches);
    data.index = this.state.selectedIndex;
    data.logo = this.curSelectLogo;
    if(isSaveClicked){
        const actualIndex = this.getActualIndex(startupBranches, this.state.selectedIndex);
      startupBranches[actualIndex] = data;
    }
    let arr = [];
    _.each(startupBranches, function (item)
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
    startupBranches = arr;
    this.setState({startupBranches:startupBranches})
    this.props.getStartupBranches(startupBranches, this.state.privateKey);
  }

  onLogoFileUpload(e){
    if(e.target.files[0].length ==  0)
      return;
    let file = e.target.files[0];
    let name = e.target.name;
    let fileName = e.target.files[0].name;
    let data ={moduleName: "PORTFOLIO", actionName: "UPLOAD", portfolioDetailsId:this.props.portfolioDetailsId, portfolio:{branches:[{logo:{fileUrl:'', fileName : fileName}, index:this.state.selectedIndex}]}};
    let response = multipartASyncFormHandler(data,file,'registration',this.onFileUploadCallBack.bind(this, file));
  }
  onFileUploadCallBack(file,resp) {
    if (resp) {
      let result = JSON.parse(resp);

      Confirm('', "Do you want to add the file into the library", 'Ok', 'Cancel',(ifConfirm)=>{
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
        }
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

  emptyClick(e) {
    if (this.state.popoverOpen)
      this.setState({popoverOpen: false})
  }

  render(){
    let branchesQuery=gql`query  {
  data: fetchAddressTypes {
    label: addressName
    value: _id
  }
}

`;
    let countryQuery = gql`query{
       data:fetchCountries {
          value:_id
          label:country
        }
      }`
    let statesQuery=gql`query ($countryId: String) {
        data: fetchStatesPerCountry(countryId: $countryId) {
        value: _id
        label: name
      }
    }`;
    let citiesQuery=gql`query ($stateId: String) {
        data: fetchCitiesPerState(stateId: $stateId) {
        value: _id
        label: name
      }
    }`;
    let statesOption = {options: {variables: {countryId: this.state.countryId}}};
    let citiesOption = {options: {variables: {stateId: this.state.stateId}}};
    let that = this;
    const showLoader = that.state.loading;
    let branchesArray = that.state.startupBranchesList || [];
    let displayUploadButton = null
    if(this.state.selectedObject != "default"){
      displayUploadButton = true
    }else{
      displayUploadButton = false
    }
    let branchNameActive ='',branchPhoneNumberActive ='',branchAddress1Active='',branchAddress2Active='',branchLandmarkActive='',branchAreaAcitve=''
    if(this.state.data.branchName){
      branchNameActive = 'active'
    }
    if(this.state.data.branchPhoneNumber){
      branchPhoneNumberActive ='active'
    }
    if(this.state.data.branchAddress1){
      branchAddress1Active = 'active'
    }
    if(this.state.data.branchAddress2){
      branchAddress2Active ='active'
    }
    if(this.state.data.branchLandmark){
      branchLandmarkActive = 'active'
    }
    if(this.state.data.branchArea){
      branchAreaAcitve = 'active'
    }
    return (
      <div onClick={this.emptyClick.bind(this)}>
        <h2>Branches</h2>
        {showLoader === true ? (<MlLoader/>) : (
        <div className="requested_input main_wrap_scroll">

          
            <div className="col-lg-12">
              <div className="row">
                <div className="col-lg-2 col-md-3 col-sm-3">
                  <a href="" id="create_clientdefault" data-placement="top" data-class="large_popover" >
                    <div className="list_block notrans" onClick={this.addBranch.bind(this)}>
                      <div className="hex_outer"><span className="ml ml-plus "></span></div>
                      <h3 onClick={this.addBranch.bind(this)}>Add New Branch</h3>
                    </div>
                  </a>
                </div>
                {branchesArray.map(function (details, idx) {
                  return(<div className="col-lg-2 col-md-3 col-sm-3" key={idx}>
                    <a href="" id={"create_client"+idx}>
                      <div className="list_block">
                        <FontAwesome name='unlock'  id="makePrivate" defaultValue={details.makePrivate}/>
                        <input type="checkbox" className="lock_input" id="isAssetTypePrivate" checked={details.makePrivate}/>
                        {/*<div className="cluster_status inactive_cl"><FontAwesome name='times'/></div>*/}
                        <div className="hex_outer portfolio-font-icons" onClick={that.onTileClick.bind(that,details.index, idx)}>
                          <img src={details.logo && details.logo.fileUrl ? generateAbsolutePath(details.logo.fileUrl) : "/images/sub_default.jpg"} /></div>
                        <h3>{details.branchName?details.branchName:""}</h3>
                      </div>
                    </a>
                  </div>)
                })}
              </div>
            </div>
          
          <Popover placement="right" isOpen={this.state.popoverOpen}  target={"create_client"+this.state.selectedObject} toggle={this.toggle}>
            <PopoverTitle>Add Branches</PopoverTitle>
            <PopoverContent>
              <div className="ml_create_client">
                <div className="medium-popover scrollbar-wrap">
                  <ScrollArea
                    speed={0.8}
                    className="scrollbar-wrap"
                    smoothScrolling={true}
                    default={true}
                  >
                    <div className="row">
                      <div className="col-md-12">
                        <div className="form-group">
                          <Moolyaselect multiSelect={false} className="form-control float-label" valueKey={'value'}
                                        labelKey={'label'} queryType={"graphql"} query={branchesQuery}
                                        isDynamic={true} placeholder={'Select Branches..'}
                                        onSelect={this.onOptionSelected.bind(this)}
                                        selectedValue={this.state.selectedVal}/>
                        </div>
                        <div className="form-group mandatory">
                          <span className={`placeHolder ${branchNameActive}`}>Name</span>
                          <input type="text" name="branchName" placeholder="Name" className="form-control float-label" ref={"branchName"}
                                 defaultValue={this.state.data.branchName} onBlur={this.handleBlur.bind(this)}
                                 data-required={true} data-errMsg="Branch Name is required"/>
                        <FontAwesome name='unlock' className="input_icon req_textarea_icon un_lock" id="isNamePrivate" defaultValue={this.state.data.isNamePrivate} onClick={this.onLockChange.bind(this, "branchName", "isNamePrivate")}/>
                        </div>

                        <div className="form-group">
                          <span className={`placeHolder ${branchPhoneNumberActive}`}>Phone Number</span>
                          <input type="number" name="branchPhoneNumber" placeholder="Phone Number" className="form-control float-label" defaultValue={this.state.data.branchPhoneNumber} onBlur={this.handleBlur.bind(this)} min={0}/>
                          <FontAwesome name='unlock' className="input_icon req_textarea_icon un_lock" id="isPhoneNumberPrivate" defaultValue={this.state.data.isPhoneNumberPrivate} onClick={this.onLockChange.bind(this, "branchPhoneNumber", "isPhoneNumberPrivate")}/>
                        </div>

                        <div className="form-group mandatory">
                          <span className={`placeHolder ${branchAddress1Active}`}>Flat/House/Floor/Building</span>
                          <input type="text" name="branchAddress1" placeholder="Flat/House/Floor/Building"
                                 className="form-control float-label" ref={"branchAddress1"} data-required={true}
                                 data-errMsg="Flat/House/Floor/Building is required"
                                 defaultValue={this.state.data.branchAddress1} onBlur={this.handleBlur.bind(this)}
                          />
                          <FontAwesome name='unlock' className="input_icon req_textarea_icon un_lock" id="isAddressOnePrivate" defaultValue={this.state.data.isAddressOnePrivate} onClick={this.onLockChange.bind(this, "branchAddress1", "isAddressOnePrivate")}/>
                        </div>


                        <div className="form-group mandatory">
                          <span className={`placeHolder ${branchAddress2Active}`}>Colony/Street/Locality</span>
                          <input type="text" name="branchAddress2" placeholder="Colony/Street/Locality"
                                 className="form-control float-label"
                                 defaultValue={this.state.data.branchAddress2} onBlur={this.handleBlur.bind(this)}
                                 ref={"branchAddress2"} data-required={true} data-errMsg="Colony/Street/Locality is required"/>
                          <FontAwesome name='unlock' className="input_icon req_textarea_icon un_lock" id="isAddressTwoPrivate" defaultValue={this.state.data.isAddressTwoPrivate} onClick={this.onLockChange.bind(this, "branchAddress2", "isAddressTwoPrivate")}/>
                        </div>

                        <div className="form-group">
                          <span className={`placeHolder ${branchLandmarkActive}`}>Landmark</span>
                          <input type="text" name="branchLandmark" placeholder="Landmark" className="form-control float-label"  defaultValue={this.state.data.branchLandmark} onBlur={this.handleBlur.bind(this)}/>
                          <FontAwesome name='unlock' className="input_icon req_textarea_icon un_lock" id="isLandmarkPrivate" defaultValue={this.state.data.isLandmarkPrivate} onClick={this.onLockChange.bind(this, "branchLandmark", "isLandmarkPrivate")}/>
                        </div>

                        <div className="form-group">
                          <span className={`placeHolder ${branchAreaAcitve}`}>Area</span>
                          <input type="text" name="branchArea" placeholder="Area" className="form-control float-label" defaultValue={this.state.data.branchArea} onBlur={this.handleBlur.bind(this)}/>
                          <FontAwesome name='unlock' className="input_icon req_textarea_icon un_lock" id="isAreaPrivate" defaultValue={this.state.data.isAreaPrivate} onClick={this.onLockChange.bind(this, "branchArea", "isAreaPrivate")}/>
                        </div>
                        <div className="form-group">
                          <Moolyaselect multiSelect={false} ref="country"  className="form-control float-label"
                                        valueKey={'value'} labelKey={'label'} placeholder="Your Country"
                                        selectedValue={this.state.countryId} queryType={"graphql"} query={countryQuery} mandatory={true}
                                        isDynamic={true}  onSelect={this.onOptionSelectedCountry.bind(this)}
                                        data-required={true} data-errMsg="Country is required"/>
                        </div>
                        <div className="form-group">
                          <Moolyaselect multiSelect={false} ref="state" className="form-control float-label"
                                        valueKey={'value'} labelKey={'label'} placeholder="State" queryOptions={statesOption}
                                        selectedValue={this.state.stateId} queryType={"graphql"} query={statesQuery} mandatory={true}
                                        isDynamic={true}  onSelect={this.onOptionSelectedStates.bind(this)}
                                        data-required={true} data-errMsg="State is required"/>
                        </div>
                        <div className="form-group">
                          <Moolyaselect multiSelect={false} ref="town" className="form-control float-label"
                                        valueKey={'value'} labelKey={'label'} placeholder="Town/City" queryOptions={citiesOption}
                                        selectedValue={this.state.cityId} queryType={"graphql"} query={citiesQuery} mandatory={true}
                                        isDynamic={true}  onSelect={this.onOptionSelectedCities.bind(this)}
                                        data-required={true} data-errMsg="Town is required"/>
                        </div>
                        {displayUploadButton?<div className="form-group">
                          <div className="fileUpload mlUpload_btn">
                            <FontAwesome name='unlock' className="input_icon upload_lock" id="isLogoPrivate"  defaultValue={this.state.data.isLogoPrivate}  onClick={this.onLockChange.bind(this, "logo", "isLogoPrivate")}/>
                            <span>Upload Logo</span>
                            <input type="file" name="logo" id="logo" className="upload"  accept="image/*" onChange={this.onLogoFileUpload.bind(this)}  />
                          </div>
                        </div>:""}
                        <div className="clearfix"></div>
                        <div className="form-group">
                          <div className="input_types"><input id="makePrivate" type="checkbox" checked={this.state.data.makePrivate&&this.state.data.makePrivate}  name="checkbox" onChange={this.onStatusChangeNotify.bind(this)}/><label htmlFor="checkbox1"><span></span>Make Private</label></div>
                        </div>
                        <div className="ml_btn" style={{'textAlign': 'center'}}>
                            <a href="" className="save_btn" onClick={this.onSaveAction}>Save</a>
                        </div>
                      </div>
                    </div>
                  </ScrollArea>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>)}
      </div>
    )
  }
}
MlStartupBranches.contextTypes = {
  startupPortfolio: PropTypes.object,
  portfolioKeys: PropTypes.object
};

// const mapStateToProps = (state, ownProps) => {
//   return {
//     keys: state.mlStartupEditTemplateReducer.privateKeys
//   };
// }
//
// export default connect(mapStateToProps)(MlStartupBranches);
export default MlStartupBranches;
