import React, {Component, PropTypes} from "react";
import ScrollArea from "react-scrollbar";
import {Popover, PopoverTitle, PopoverContent} from "reactstrap";
import gql from "graphql-tag";
import _ from "lodash";
var FontAwesome = require('react-fontawesome');
import {dataVisibilityHandler, OnLockSwitch} from "../../../../../../utils/formElemUtil";
import Moolyaselect from "../../../../../../commons/components/MlAdminSelectWrapper";
import {multipartASyncFormHandler} from "../../../../../../../commons/MlMultipartFormAction";
import {fetchStartupDetailsHandler} from "../../../../actions/findPortfolioStartupDetails";
import {putDataIntoTheLibrary} from '../../../../../../../commons/actions/mlLibraryActionHandler'
import MlLoader from "../../../../../../../commons/components/loader/loader";
import { connect } from 'react-redux';
import {mlFieldValidations} from "../../../../../../../commons/validations/mlfieldValidation";
import generateAbsolutePath from '../../../../../../../../lib/mlGenerateAbsolutePath';
import Confirm from '../../../../../../../commons/utils/confirm';

const KEY = "technologies"

class MlStartupTechnology extends Component{
  constructor(props, context){
    super(props);
    this.state={
      loading: false,
      data:{},
      privateKey:{},
      startupTechnologies:this.props.technologyDetails || [],
      popoverOpen:false,
      selectedIndex:-1,
      startupTechnologiesList:this.props.technologyDetails || [],
      selectedVal:null,
      selectedObject:"default"
    }
    this.startupTechnologyServer = this.props.technologyDetails || [];
    this.tabName = this.props.tabName || ""
    this.curSelectLogo = {};
    this.handleBlur = this.handleBlur.bind(this);
    this.onOptionSelected = this.onOptionSelected.bind(this);
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
    let empty = _.isEmpty(this.context.startupPortfolio && this.context.startupPortfolio.technologies)
    if(!empty){
      this.setState({loading: false, startupTechnologies: this.context.startupPortfolio.technologies, startupTechnologiesList:this.context.startupPortfolio.technologies});
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
    var setObject =  this.state.startupTechnologies
    if(this.context && this.context.startupPortfolio && this.context.startupPortfolio.technologies ){
      setObject = this.context.startupPortfolio.technologies
    }
    this.setState({startupTechnologiesList:setObject,popoverOpen : false})
    this.curSelectLogo = {}
  }

  addTechnology(){
    this.setState({selectedObject: "default", popoverOpen: !(this.state.popoverOpen), data: {}, selectedVal: null})
    if(this.state.startupTechnologies){
      this.setState({selectedIndex:this.state.startupTechnologies.length})
    }else{
      this.setState({selectedIndex:0})
    }
  }

  onTileClick(index,uiIndex, e){
    let cloneArray = _.cloneDeep(this.state.startupTechnologies);
    //let details = cloneArray[index]
    let details = _.find(cloneArray,{index:index});
    details = _.omit(details, "__typename");
    this.setState({
      selectedIndex: index, data: details,
      selectedObject: uiIndex, popoverOpen: !(this.state.popoverOpen), "selectedVal": details.technologyId
    }, () => {
      this.lockPrivateKeys(index);
    });
    // setTimeout(function () {
    //   _.each(details.privateFields, function (pf) {
    //     $("#"+pf.booleanKey).removeClass('un_lock fa-unlock').addClass('fa-lock')
    //   })
    // }, 10)
    this.curSelectLogo = details.logo;
  }

  lockPrivateKeys(selIndex) {
    const privateValues = this.startupTechnologyServer && this.startupTechnologyServer[selIndex]?this.startupTechnologyServer[selIndex].privateFields : []
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

  onOptionSelected(selectedId, callback, selObject) {
    if (selectedId) {
      let details = this.state.data;
      details = _.omit(details, ["technologyId"]);
      details = _.extend(details, {["technologyId"]: selectedId, "technologyName": selObject.label, technologyDescription: selObject.about});
      this.setState({data: details, "selectedVal": selectedId, "technologyName": selObject.label, "technologyDescription": selObject.about}, function () {
        // this.sendDataToParent()
      })
    } else {
      let details = this.state.data;
      details = _.omit(details, ["technologyId"]);
      details = _.omit(details, ["technologyName"]);
      details = _.omit(details, ["technologyDescription"]);
      this.setState({data: details, "selectedVal": '', "technologyName": '', technologyDescription:''}, function () {
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
    let technologies = this.state.startupTechnologies;
    let startupTechnologies = _.cloneDeep(technologies);
    data.logo = this.curSelectLogo;
    data.index = this.state.selectedIndex;
    if(isSaveClicked){
        const actualIndex = this.getActualIndex(startupTechnologies, this.state.selectedIndex);
      startupTechnologies[actualIndex] = data;
    }
    let arr = [];
    _.each(startupTechnologies, function (item)
    {
      for (var propName in item) {
        if (item[propName] === null || item[propName] === undefined) {
          delete item[propName];
        }
      }
      let newItem = _.omit(item, "__typename");
      newItem = _.omit(newItem, "privateFields");
      arr.push(newItem)
    })
    startupTechnologies = arr;
    this.setState({startupTechnologies:startupTechnologies})
    this.props.getStartupTechnology(startupTechnologies, this.state.privateKey);
  }

  onLogoFileUpload(e){
    if(e.target.files[0].length ==  0)
      return;
    let file = e.target.files[0];
    let name = e.target.name;
    let fileName = e.target.files[0].name;
    let data ={moduleName: "PORTFOLIO", actionName: "UPLOAD", portfolioDetailsId:this.props.portfolioDetailsId, portfolio:{technologies:[{logo:{fileUrl:'', fileName : fileName}, index:this.state.selectedIndex}]}};
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
    const resp = await putDataIntoTheLibrary(portfolioDetailsId, file, this.props.client)
    if (resp.code === 404) {
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
    let technologyDescriptionActive =''
    if(this.state.data.technologyDescription){
      technologyDescriptionActive = 'active'
    }
    let query=gql`query{
      data:fetchTechnologies {
        about : about
        label:displayName
        value:_id
      }
    }`;
    let that = this;
    const showLoader = that.state.loading;
    let technologiesArray = that.state.startupTechnologiesList || [];
    let displayUploadButton = null
    if(this.state.selectedObject != "default"){
      displayUploadButton = true
    }else{
      displayUploadButton = false
    }
    //
    return (
      <div onClick={this.emptyClick.bind(this)}>
        <h2>Technology</h2>
        {showLoader === true ? ( <MlLoader/>) : (
        <div className="requested_input main_wrap_scroll">
          
            <div className="col-lg-12">
              <div className="row">
                <div className="col-lg-2 col-md-3 col-sm-3">
                  <a href="" id="create_clientdefault" data-placement="top" data-class="large_popover" >
                    <div className="list_block notrans" onClick={this.addTechnology.bind(this)}>
                      <div className="hex_outer"><span className="ml ml-plus "></span></div>
                      <h3 onClick={this.addTechnology.bind(this)}>Add New Technology</h3>
                    </div>
                  </a>
                </div>

                {technologiesArray.map(function (details, idx) {
                  return(<div className="col-lg-2 col-md-3 col-sm-3" key={idx}>
                    <a href="" id={"create_client"+idx}>
                      <div className="list_block">
                        <FontAwesome name='unlock'  id="makePrivate" defaultValue={details.makePrivate}/><input type="checkbox" className="lock_input" id="isAssetTypePrivate" checked={details.makePrivate}/>
                        <div className="hex_outer" onClick={that.onTileClick.bind(that,details.index, idx)}>
                          <img src={details.logo && details.logo.fileUrl ? generateAbsolutePath(details.logo.fileUrl) : "/images/sub_default.jpg"}/>
                        </div>
                        <h3>{details.technologyName?details.technologyName:" "}</h3>
                      </div>
                    </a>
                  </div>)
                })}
              </div>
            </div>
          
          <Popover placement="right" isOpen={this.state.popoverOpen}  target={"create_client"+this.state.selectedObject} toggle={this.toggle}>
             <PopoverTitle>Add New Technology</PopoverTitle>
            <PopoverContent>
              <div className="ml_create_client">
                <div className="medium-popover"><div className="row">
                  <div className="col-md-12">
                    <div className="form-group">
                      <Moolyaselect multiSelect={false} className="form-control float-label" valueKey={'value'} ref={"technologyId"}
                                    labelKey={'label'} queryType={"graphql"} query={query}
                                    placeholder={'Select Technology'}
                                    isDynamic={true} mandatory={true}
                                    onSelect={this.onOptionSelected}
                                    selectedValue={this.state.selectedVal}
                                    data-required={true} data-errMsg="Technology is required"/>
                    </div>

                    <div className="form-group">
                      <span className={`placeHolder ${technologyDescriptionActive}`}>About</span>
                      <input type="text" name="technologyDescription" placeholder="About" className="form-control float-label" defaultValue={this.state.data.technologyDescription}  onBlur={this.handleBlur}/>
                      <FontAwesome id="isDescriptionPrivate" name='unlock' className="input_icon req_textarea_icon un_lock" defaultValue={this.state.data.isDescriptionPrivate}  onClick={this.onLockChange.bind(this, "technologyDescription", "isDescriptionPrivate")}/>
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
MlStartupTechnology.contextTypes = {
  startupPortfolio: PropTypes.object,
  portfolioKeys: PropTypes.object
};

// const mapStateToProps = (state, ownProps) => {
//   return {
//     keys: state.mlStartupEditTemplateReducer.privateKeys
//   };
// }
//
// export default connect(mapStateToProps)(MlStartupTechnology);
export default MlStartupTechnology;
