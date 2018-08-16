import React, { Component, PropTypes }  from "react";
import ScrollArea from 'react-scrollbar'
import { connect } from 'react-redux';
var FontAwesome = require('react-fontawesome');
import { Button, Popover, PopoverTitle, PopoverContent } from 'reactstrap';
import _ from 'lodash';
import {dataVisibilityHandler, OnLockSwitch} from '../../../../../../utils/formElemUtil';
import {multipartASyncFormHandler} from '../../../../../../../commons/MlMultipartFormAction'
import {fetchStartupDetailsHandler} from '../../../../actions/findPortfolioStartupDetails';
import {putDataIntoTheLibrary} from '../../../../../../../commons/actions/mlLibraryActionHandler'
import MlLoader from '../../../../../../../commons/components/loader/loader';
import {mlFieldValidations} from "../../../../../../../commons/validations/mlfieldValidation";
import generateAbsolutePath from '../../../../../../../../lib/mlGenerateAbsolutePath';
import Confirm from '../../../../../../../commons/utils/confirm';
const KEY = 'clients';

class MlStartupClients extends Component{
  constructor(props, context){
    super(props);
    this.state={
      loading: false,
      data:{},
      privateKey:{},
      startupClients: this.props.clientsDetails || [],
      popoverOpen:false,
      selectedIndex:-1,
      startupClientsList: this.props.clientsDetails || [],
      selectedVal:null,
      selectedObject:"default"
    }
    this.startupClientsServer = this.props.clientsDetails || [];
    this.tabName = this.props.tabName || ""
    this.curSelectLogo = {};
    this.handleBlur.bind(this);
    this.onSaveAction = this.onSaveAction.bind(this);
    this.libraryAction.bind(this);
    return this;
  }
  componentDidUpdate(){
    OnLockSwitch();
    dataVisibilityHandler();
  }

  componentDidMount(){
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
  componentWillMount(){
    let empty = _.isEmpty(this.context.startupPortfolio && this.context.startupPortfolio.clients)
    if(!empty){
      this.setState({loading: false, startupClients: this.context.startupPortfolio.clients, startupClientsList:this.context.startupPortfolio.clients});
    }
  }

  addClient(){
    this.setState({selectedObject: "default", popoverOpen: !(this.state.popoverOpen), data: {}, selectedVal: null})
    if(this.state.startupClients){
      this.setState({selectedIndex:this.state.startupClients.length})
    }else{
      this.setState({selectedIndex:0})
    }
  }

  onTileSelect(index, uiIndex, e) {
    let cloneArray = _.cloneDeep(this.state.startupClients);
    let details = _.find(cloneArray,{index:index});
    details = _.omit(details, "__typename");
    this.curSelectLogo = details.logo;
    this.setState({ selectedIndex: index, data: details, selectedObject: uiIndex, popoverOpen: !(this.state.popoverOpen), "selectedVal": details.companyId }, () => {
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
    const privateValues = this.startupClientsServer && this.startupClientsServer[selIndex]?this.startupClientsServer[selIndex].privateFields : []
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
    var privateKey = {keyName:fieldName, booleanKey:field, isPrivate:isPrivate, index:this.state.selectedIndex, tabName:KEY};
    if(fieldName === "logo")
      privateKey["objectName"] = "logo";
    this.setState({privateKey:privateKey}, function () {
      this.sendDataToParent()
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
    var setObject = this.state.startupClients
    if(this.context && this.context.startupPortfolio && this.context.startupPortfolio.clients ){
      setObject = this.context.startupPortfolio.clients
    }
    this.setState({startupClientsList:setObject,popoverOpen : false})
    this.curSelectLogo = {}
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
    let clients = this.state.startupClients;
    let startupClients = _.cloneDeep(clients);
    data.index = this.state.selectedIndex;
    data.logo = this.curSelectLogo;
    if(isSaveClicked) {
        const actualIndex = this.getActualIndex(startupClients, this.state.selectedIndex);
      startupClients[actualIndex] = data;
    }
    let arr = [];
    _.each(startupClients, function (item)
    {
      for (var propName in item) {
        if (item[propName] === null || item[propName] === undefined) {
          delete item[propName];
        }
      }
      let newItem = _.omit(item, "__typename");
      newItem = _.omit(newItem, ["privateFields"])
      // let updateItem = _.omit(newItem, 'logo');
      arr.push(newItem)
    })
    startupClients = arr;
    this.setState({startupClients:startupClients})
    this.props.getStartupClients(startupClients, this.state.privateKey);
  }

  onLogoFileUpload(e){
    if(e.target.files[0].length ==  0)
      return;
    let file = e.target.files[0];
    let name = e.target.name;
    let fileName = e.target.files[0].name;
    let data ={moduleName: "PORTFOLIO", actionName: "UPLOAD", portfolioDetailsId:this.props.portfolioDetailsId, portfolio:{clients:[{logo:{fileUrl:'', fileName : fileName}, index:this.state.selectedIndex}]}};
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
        };
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
    if (response && response.clients) {
      let thisState=this.state.selectedIndex;
      let dataDetails =this.state.startupClients
      let cloneBackUp = _.cloneDeep(dataDetails);
      let specificData = cloneBackUp[thisState];
      if(specificData){
        let curUpload=response.clients[thisState]
        specificData['logo']= curUpload['logo']
        this.setState({loading: false, startupClients:cloneBackUp });
      }else {
        this.setState({loading: false})
      }
    }
  }

  emptyClick(e) {
    if (this.state.popoverOpen)
      this.setState({popoverOpen: false})
  }

  render(){
    let companyNameActive ='',clientDescriptionActive = ''
    if(this.state.data.companyName){
      companyNameActive = 'active'
    }
    if(this.state.data.clientDescription){
      clientDescriptionActive = 'active'
    }
    let that = this;
    const showLoader = that.state.loading;
    let clientsArray = that.state.startupClientsList || [];
    let displayUploadButton = null;
    if(this.state.selectedObject != "default"){
      displayUploadButton = true
    }else{
      displayUploadButton = false
    }
    return(
      <div onClick={this.emptyClick.bind(this)}>
        <h2>Clients</h2>
        {showLoader === true ? ( <MlLoader/>) : (
        <div className="requested_input main_wrap_scroll">
          
            <div className="col-lg-12">
              <div className="row">
                <div className="col-lg-2 col-md-3 col-sm-3">
                  <a href="" id="create_clientdefault" data-placement="right" data-class="large_popover" >
                    <div className="list_block notrans" onClick={this.addClient.bind(this)}>
                      <div className="hex_outer"><span className="ml ml-plus "></span></div>
                      <h3 onClick={this.addClient.bind(this)}>Add New Client</h3>
                    </div>
                  </a>
                </div>
                {clientsArray.map(function (details, idx) {
                  return(<div className="col-lg-2 col-md-3 col-sm-3" key={idx}>
                    <a href="" id={"create_client"+idx}>
                      <div className="list_block">
                        <FontAwesome name='unlock'  id="makePrivate" defaultValue={details.makePrivate}/><input type="checkbox" className="lock_input" id="isAssetTypePrivate" checked={details.makePrivate}/>
                        <div className="hex_outer portfolio-font-icons" onClick={that.onTileSelect.bind(that,details.index, idx)}><img src={details.logo&&generateAbsolutePath(details.logo.fileUrl)}/></div>
                        <h3>{details.companyName?details.companyName:""} </h3>
                      </div>
                    </a>
                  </div>)
                })}
              </div>
            </div>
          
          <Popover placement="right" isOpen={this.state.popoverOpen} target={"create_client"+this.state.selectedObject}  toggle={this.toggle}>
             <PopoverTitle>Add New Client</PopoverTitle>
            <PopoverContent>
              <div className="ml_create_client">
                <div className="medium-popover"><div className="row">
                  <div className="col-md-12">
                    <div className="form-group mandatory">
                      <span className={`placeHolder ${companyNameActive}`}>Company Name</span>
                      <input type="text" name="companyName" placeholder="Company Name" ref={"companyName"}
                             className="form-control float-label" defaultValue={this.state.data.companyName}
                             onBlur={this.handleBlur.bind(this)}
                             data-required={true}
                             data-errMsg="Company Name is required"/>
                      <FontAwesome name='unlock' className="input_icon" id="isCompanyNamePrivate"  defaultValue={this.state.data.isCompanyNamePrivate}  onClick={this.onLockChange.bind(this, "companyName", "isCompanyNamePrivate")}/>
                    </div>
                    <div className="form-group">
                      <span className={`placeHolder ${clientDescriptionActive}`}>About</span>
                      <input type="text" name="clientDescription" placeholder="About" className="form-control float-label" id="" defaultValue={this.state.data.clientDescription} onBlur={this.handleBlur.bind(this)}/>
                      <FontAwesome name='unlock' className="input_icon" id="isDescriptionPrivate"  defaultValue={this.state.data.isDescriptionPrivate}  onClick={this.onLockChange.bind(this, "clientDescription", "isDescriptionPrivate")}/>
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
                </div></div>
              </div>
            </PopoverContent>
          </Popover>
        </div>)}
      </div>
    )
  }
}

MlStartupClients.contextTypes = {
  startupPortfolio: PropTypes.object,
  portfolioKeys: PropTypes.object
};
// const mapStateToProps = (state, ownProps) => {
//   return {
//     keys: state.mlStartupEditTemplateReducer.privateKeys
//   };
// }
//
// export default connect(mapStateToProps)(MlStartupClients);
export default MlStartupClients;
