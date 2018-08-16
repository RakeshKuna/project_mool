import React, {Component, PropTypes} from "react";
import ScrollArea from "react-scrollbar";
import {Popover, PopoverTitle, PopoverContent} from "reactstrap";
import {dataVisibilityHandler, OnLockSwitch, initalizeFloatLabel} from "../../../../../utils/formElemUtil";
import Moolyaselect from "../../../../../commons/components/MlAdminSelectWrapper";
import gql from "graphql-tag";
import _ from "lodash";
import {multipartASyncFormHandler} from "../../../../../../commons/MlMultipartFormAction";
import {fetchInstitutionDetailsHandler} from "../../../actions/findPortfolioInstitutionDetails";
import {putDataIntoTheLibrary} from '../../../../../../commons/actions/mlLibraryActionHandler'
import MlLoader from "../../../../../../commons/components/loader/loader";
var FontAwesome = require('react-fontawesome');
import generateAbsolutePath from '../../../../../../../lib/mlGenerateAbsolutePath';
import Confirm from '../../../../../../commons/utils/confirm';
import { fetchCurrencyTypeActionHandler } from '../../../../../../commons/actions/mlCurrencySymbolHandler';


const KEY = 'investor'

export default class MlInstitutionEditInvestor extends React.Component{
  constructor(props, context){
    super(props);
    this.state={
      loading: true,
      data:{},
      institutionInvestor: [],
      popoverOpen:false,
      privateKey:{},
      selectedIndex:-1,
      institutionInvestorList:[],
      selectedVal:null,
      selectedObject:"default"
    }
    this.curSelectLogo = {};
    this.handleBlur.bind(this);
    this.fetchPortfolioDetails.bind(this);
    this.libraryAction.bind(this);
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
  }
  componentWillMount(){
    const resp= this.fetchPortfolioDetails();
    this.getCurrencyType();
    return resp;
  }

  async getCurrencyType() {
    const response = await fetchCurrencyTypeActionHandler(this.props.client, null, this.props.portfolioDetailsId);
    this.setState({currencySymbol: response.symbol, currencyName:response.currencyName})
    return response;
  }

  async fetchPortfolioDetails() {
    let that = this;
    let portfolioDetailsId=that.props.portfolioDetailsId;
    let empty = _.isEmpty(that.context.institutionPortfolio && that.context.institutionPortfolio.investor);
    const response = await fetchInstitutionDetailsHandler(portfolioDetailsId, KEY);
    if(empty){
      if (response && response.investor && response.investor.length>0) {
        this.setState({loading: false, institutionInvestor: response.investor, institutionInvestorList: response.investor});
      }
      else{
        this.setState({loading:false})
      }
    }else{
      this.setState({loading: false, institutionInvestor: that.context.institutionPortfolio.investor, institutionInvestorList:that.context.institutionPortfolio.investor});
    }
    this.institutionInvestorServer = response && response.investor?response.investor:[]
  }
  addInvestor(){
    this.setState({selectedObject : "default", popoverOpen : !(this.state.popoverOpen), data : {}})
    if(this.state.institutionInvestor){
      this.setState({selectedIndex:this.state.institutionInvestor.length})
    }else{
      this.setState({selectedIndex:0})
    }
  }
  onTileClick(index,uiIndex, e){
    let cloneArray = _.cloneDeep(this.state.institutionInvestor);
    //let details = cloneArray[index]
    let details = _.find(cloneArray,{index:index});
    details = _.omit(details, "__typename");
    this.curSelectLogo = details.logo
    this.setState({selectedIndex: index,
                   data:details,
                   "selectedVal" : details.fundingTypeId,
                   selectedObject : uiIndex,
                   popoverOpen : !(this.state.popoverOpen)},()=>{
                       this.lockPrivateKeys(index)
                 });

    /*setTimeout(function () {
      _.each(details.privateFields, function (pf) {
        $("#"+pf.booleanKey).removeClass('un_lock fa-unlock').addClass('fa-lock')
      })
    }, 10)*/

  }
//todo:// context data connection first time is not coming have to fix
  lockPrivateKeys(selIndex) {
    var privateValues = this.institutionInvestorServer && this.institutionInvestorServer[selIndex] ? this.institutionInvestorServer[selIndex].privateFields : []
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

  onLockChange(fieldName, field, e){
    var isPrivate = false;
    let className = e.target.className;
    if(className.indexOf("fa-lock") != -1){
      isPrivate = true
    }
    var privateKey = {keyName:fieldName, booleanKey:field, isPrivate:isPrivate, index:this.state.selectedIndex, tabName: this.props.tabName}
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
    this.sendDataToParent(true);
    var setObject = this.state.institutionInvestor;
    if (this.context && this.context.institutionPortfolio && this.context.institutionPortfolio.investor) {
      setObject = this.context.institutionPortfolio.investor
    }
    this.setState({institutionInvestorList: setObject, popoverOpen: false})
    this.curSelectLogo = {}
  }
  getActualIndex(dataArray, checkIndex){
    var response = _.findIndex(dataArray, {index: checkIndex});
    response = response >= 0 ? response : checkIndex;
    return response;
  }

  sendDataToParent(isSaveClicked) {
    let data = this.state.data;
    let institutionInvestor1 = this.state.institutionInvestor;
    let institutionInvestor = _.cloneDeep(institutionInvestor1);
    data.index = this.state.selectedIndex;
    data.logo = this.curSelectLogo;
    if(isSaveClicked){
      const actualIndex = this.getActualIndex(institutionInvestor, this.state.selectedIndex);
      institutionInvestor[actualIndex] = data;
    }
    let arr = [];
    _.each(institutionInvestor, function (item) {
      for (var propName in item) {
        if (item[propName] === null || item[propName] === undefined) {
          delete item[propName];
        }
      }
      let newItem = _.omit(item, "__typename")
      newItem = _.omit(newItem, ["privateFields"])
      arr.push(newItem)
    })
    institutionInvestor = arr;
    this.setState({institutionInvestor: institutionInvestor})
    this.props.getInvestorDetails(institutionInvestor, this.state.privateKey);
  }

  onLogoFileUpload(e){
    if(e.target.files[0].length ==  0)
      return;
    let file = e.target.files[0];
    let name = e.target.name;
    let fileName = e.target.files[0].name;
    let data ={moduleName: "PORTFOLIO", actionName: "UPLOAD", portfolioDetailsId:this.props.portfolioDetailsId, portfolio:{investor:[{logo:{fileUrl:'', fileName : fileName}, index:this.state.selectedIndex}]}};
    let response = multipartASyncFormHandler(data,file,'registration',this.onFileUploadCallBack.bind(this, name, file));
  }
  onFileUploadCallBack(name,file, resp) {
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

        if (result.success) {
          this.curSelectLogo = {
            fileName: file && file.name ? file.name : "",
            fileUrl: result.result
          };
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

  async fetchOnlyImages(){
    const response = await fetchInstitutionDetailsHandler(this.props.portfolioDetailsId, KEY);
    if (response && response.investor) {
      let dataDetails =this.state.institutionInvestor
      let cloneBackUp = _.cloneDeep(dataDetails);
      let specificData = cloneBackUp[this.state.selectedIndex];
      if(specificData){
        let curUpload=response.investor[this.state.selectedIndex]
        specificData['logo']= curUpload['logo']
        this.setState({loading: false, institutionInvestor:cloneBackUp });
      }else {
        this.setState({loading: false})
      }
    }
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
    let investorsArray = that.state.institutionInvestorList || [];
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
                              src={details.logo && generateAbsolutePath(details.logo.fileUrl) }/></div>
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
                        <div className="form-group">
                          <input type="text" name="investorName" placeholder="Name" className="form-control float-label" defaultValue={this.state.data.investorName}  onBlur={this.handleBlur.bind(this)}/>
                          <FontAwesome name='unlock' className="input_icon req_textarea_icon un_lock" id="isNamePrivate" defaultValue={this.state.data.isNamePrivate}  onClick={this.onLockChange.bind(this, "investorName", "isNamePrivate")}/>
                        </div>
                        <div className="form-group">
                          <Moolyaselect multiSelect={false} className="form-control float-label" valueKey={'value'}
                                        labelKey={'label'} queryType={"graphql"} query={query} placeholder={'Select Funding..'}
                                        isDynamic={true}
                                        onSelect={this.onOptionSelected.bind(this)}
                                        selectedValue={this.state.selectedVal}/>
                        </div>
                        <div className="form-group">
                          <input type="text" name="investmentAmount" placeholder={`Investment Amount in ${this.state.currencyName} (${this.state.currencySymbol})`} className="form-control float-label" id="" defaultValue={this.state.data.investmentAmount}  onBlur={this.handleBlur.bind(this)}/>
                          <FontAwesome name='unlock' className="input_icon req_textarea_icon un_lock" id="isInvestmentAmountPrivate" defaultValue={this.state.data.isInvestmentAmountPrivate}  onClick={this.onLockChange.bind(this, "investmentAmount", "isInvestmentAmountPrivate")}/>
                        </div>
                        <div className="form-group">
                          <input type="text" name="investorDescription" placeholder="About" className="form-control float-label" id="" defaultValue={this.state.data.investorDescription}  onBlur={this.handleBlur.bind(this)}/>
                          <FontAwesome name='unlock' className="input_icon req_textarea_icon un_lock" id="isDescriptionPrivate" defaultValue={this.state.data.isDescriptionPrivate}  onClick={this.onLockChange.bind(this, "investorDescription", "isDescriptionPrivate")}/>
                        </div>
                        {displayUploadButton?<div className="form-group">
                          <div className="fileUpload mlUpload_btn">
                            <span>Upload Logo</span>
                            <input type="file" name="logo" id="logo" className="upload"  accept="image/*" onChange={this.onLogoFileUpload.bind(this)}  />
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
            </div>
          </div>)}
      </div>
    )
  }
}
MlInstitutionEditInvestor.contextTypes = {
  institutionPortfolio: PropTypes.object,
  portfolioKeys :PropTypes.object
};
