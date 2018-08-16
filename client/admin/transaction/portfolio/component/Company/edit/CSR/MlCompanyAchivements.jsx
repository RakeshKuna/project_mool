import React, {Component, PropTypes} from "react";
import ScrollArea from "react-scrollbar";
import Datetime from "react-datetime";
import _ from "lodash";
var FontAwesome = require('react-fontawesome');
import {Popover, PopoverTitle, PopoverContent} from "reactstrap";
import {dataVisibilityHandler, OnLockSwitch, initalizeFloatLabel} from "../../../../../../utils/formElemUtil";
import {multipartASyncFormHandler} from "../../../../../../../commons/MlMultipartFormAction";
import {fetchCompanyDetailsHandler} from "../../../../actions/findCompanyPortfolioDetails";
import MlLoader from "../../../../../../../commons/components/loader/loader";
import {putDataIntoTheLibrary} from '../../../../../../../commons/actions/mlLibraryActionHandler'
import {mlFieldValidations} from "../../../../../../../commons/validations/mlfieldValidation";
import generateAbsolutePath from '../../../../../../../../lib/mlGenerateAbsolutePath';
import Confirm from '../../../../../../../commons/utils/confirm';
const KEY = "achievements"

export default class MlCompanyAchivements extends Component{
  constructor(props, context){
    super(props);
    this.state={
      loading: true,
      data:{},
      privateKey:{},
      institutionAchievements: [],
      popoverOpen:false,
      selectedIndex:-1,
      institutionAchievementsList:[],
      selectedVal:null,
      selectedObject:"default"
    };
    this.curSelectLogo = {};
    this.tabName = this.props.tabName || ""
    this.handleBlur.bind(this);
    this.fetchPortfolioDetails.bind(this);
    this.onSaveAction.bind(this);
    this.libraryAction.bind(this);
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
    this.fetchPortfolioDetails();
  }
  async fetchPortfolioDetails() {
    let that = this;
    let portfolioDetailsId=that.props.portfolioDetailsId;
    let empty = _.isEmpty(that.context.companyPortfolio && that.context.companyPortfolio.achievements)
    if(empty){
      const response = await fetchCompanyDetailsHandler(portfolioDetailsId, KEY);
      if (response && response.achievements) {
        this.setState({loading: false, institutionAchievements: response.achievements, institutionAchievementsList: response.achievements});
      }else{
        this.setState({loading:false})
      }
    }else{
      this.setState({loading: false, institutionAchievements: that.context.companyPortfolio.achievements, institutionAchievementsList: that.context.companyPortfolio.achievements});
    }
  }
  addAchievement(){
    this.setState({selectedObject : "default", popoverOpen : !(this.state.popoverOpen), data : {}})
    if(this.state.institutionAchievements){
      this.setState({selectedIndex:this.state.institutionAchievements.length})
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
    var setObject = this.state.institutionAchievements
    if(this.context && this.context.companyPortfolio && this.context.companyPortfolio.achievements ){
      setObject = this.context.companyPortfolio.achievements
    }
    this.setState({institutionAchievementsList:setObject, popoverOpen : false})
    this.curSelectLogo = {}
  }

  onTileClick(index,uiIndex, e){
    let cloneArray = _.cloneDeep(this.state.institutionAchievements);
    // let details = cloneArray[index]
    let details = _.find(cloneArray,{index:index});
    details = _.omit(details, "__typename");
    this.curSelectLogo = details.logo
    this.setState({selectedIndex:index, data:details,selectedObject : uiIndex,popoverOpen : !(this.state.popoverOpen)});
    setTimeout(function () {
      _.each(details.privateFields, function (pf) {
        $("#"+pf.booleanKey).removeClass('un_lock fa-unlock').addClass('fa-lock')
      })
    }, 10)
  }

  onLockChange(fiedName, field, e){
    var isPrivate = false
    let className = e.target.className;
    if(className.indexOf("fa-lock") != -1){
      isPrivate = true
    }
    var privateKey = {keyName:fiedName, booleanKey:field, isPrivate:isPrivate, index:this.state.selectedIndex, tabName:KEY}
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

 /* onOptionSelected(selectedAward, callback, selObject) {
    let details = this.state.data;
    details = _.omit(details, ["awardId"]);
    details = _.omit(details, ["awardName"]);
    if(selectedAward){
      details = _.extend(details, {["awardId"]: selectedAward, "awardName": selObject.label});
      this.setState({data: details}, function () {
        this.setState({"selectedVal": selectedAward, awardName: selObject.label})
        this.sendDataToParent()
      })
    }else {
      details = _.extend(details, {["awardId"]: '', "awardName": ''});
      this.setState({data: details}, function () {
        this.setState({"selectedVal": '', awardName: ''})
        this.sendDataToParent()
      })
    }

  }*/

  handleBlur(e){
    let details =this.state.data;
    let name  = e.target.name;
    details=_.omit(details,[name]);
    details=_.extend(details,{[name]:e.target.value});
    this.setState({data:details}, function () {
      // this.sendDataToParent()
    })
  }
/*
  handleYearChange(e){
    let details =this.state.data;
    let name  = 'year';
    details=_.omit(details,[name]);
    details=_.extend(details,{[name]:this.refs.year.state.inputValue});
    this.setState({data:details}, function () {
      this.sendDataToParent()
    })
  }*/

  getFieldValidations() {
    const ret = mlFieldValidations(this.refs);
    return {tabName: this.tabName, errorMessage: ret, index: this.state.selectedIndex}
  }

  sendDataToParent(isSaveClicked){
    let data = this.state.data;
    let achievements = this.state.institutionAchievements;
    let institutionAchievements = _.cloneDeep(achievements);
    data.index = this.state.selectedIndex;
    data.logo = this.curSelectLogo;
    if(isSaveClicked){
      var actualIndex = _.findIndex(institutionAchievements, {index: this.state.selectedIndex});
      actualIndex = actualIndex >= 0 ? actualIndex : this.state.selectedIndex;
      institutionAchievements[actualIndex] = data;
      // institutionAchievements[this.state.selectedIndex] = data;
    }
    let arr = [];
    _.each(institutionAchievements, function (item)
    {
      for (var propName in item) {
        if (item[propName] === null || item[propName] === undefined || propName === 'privateFields') {
          delete item[propName];
        }
      }
      let newItem = _.omit(item, "__typename");
      newItem = _.omit(newItem, ["privateFields"])
      arr.push(newItem)
    })
    institutionAchievements = arr;
    this.setState({institutionAchievements:institutionAchievements})
    this.props.getAchivements(institutionAchievements, this.state.privateKey);
  }

  onLogoFileUpload(e){
    if(e.target.files[0].length ==  0)
      return;
    let file = e.target.files[0];
    let name = e.target.name;
    let fileName = e.target.files[0].name;
    let data ={moduleName: "PORTFOLIO", actionName: "UPLOAD", portfolioDetailsId:this.props.portfolioDetailsId, portfolio:{achievements:[{logo:{fileUrl:'', fileName : fileName}, index:this.state.selectedIndex}]}};
    let response = multipartASyncFormHandler(data,file,'registration',this.onFileUploadCallBack.bind(this, file));
  }

  onFileUploadCallBack(file,resp) {
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
    if (resp.code === 404) {
      toastr.error(resp.result)
    } else {
      toastr.success(resp.result)
      return resp;
    }
  }

  async fetchOnlyImages(){
    const response = await fetchCompanyDetailsHandler(this.props.portfolioDetailsId, KEY);
    if (response && response.achievements) {
      let dataDetails =this.state.institutionAchievements
      let cloneBackUp = _.cloneDeep(dataDetails);
      let specificData = cloneBackUp[this.state.selectedIndex];
      if(specificData){
        let curUpload=response.achievements[this.state.selectedIndex]
        specificData['logo']= curUpload['logo']
        this.setState({loading: false, institutionAchievements:cloneBackUp });

      }else {
        this.setState({loading: false})
      }
    }
  }

  render(){
    var yesterday = Datetime.moment().subtract(0,'day');
    var valid = function( current ){
      return current.isBefore( yesterday );
    };
   /* let query=gql`query{
      data:fetchActiveAwards {
        label:awardDisplayName
        value:_id
      }
    }`;*/
    let that = this;
    const showLoader = that.state.loading;
    let institutionAchievementsList = that.state.institutionAchievementsList || [];
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
            <h2>Achievements</h2>
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
                        <div className="list_block notrans" onClick={this.addAchievement.bind(this)}>
                          <div className="hex_outer"><span className="ml ml-plus "></span></div>
                          <h3 onClick={this.addAchievement.bind(this)}>Add New Achievement</h3>
                        </div>
                      </a>
                    </div>
                    {institutionAchievementsList&&institutionAchievementsList.map(function (details, idx) {
                      return(<div className="col-lg-2 col-md-3 col-sm-3" key={idx}>
                        <a href="" id={"create_client"+idx}>
                          <div className="list_block">
                            <FontAwesome name='unlock'  id="makePrivate" defaultValue={details.makePrivate}/><input type="checkbox" className="lock_input" id="isAssetTypePrivate" checked={details.makePrivate}/>
                            {/*<div className="cluster_status inactive_cl"><FontAwesome name='times'/></div>*/}
                            <div className="hex_outer" onClick={that.onTileClick.bind(that,details.index,idx)}>
                              <img
                                src={details.logo && details.logo.fileUrl ? generateAbsolutePath(details.logo.fileUrl) : "/images/def_profile.png"}/>
                            </div>
                            <h3>{details.achievementName?details.achievementName:""}</h3>
                          </div>
                        </a>
                      </div>)
                    })}
                  </div>
                </div>
              </ScrollArea>
              <Popover placement="right" isOpen={this.state.popoverOpen}  target={"create_client"+this.state.selectedObject} toggle={this.toggle}>
                <PopoverTitle>Add Achievement</PopoverTitle>
                <PopoverContent>
                  <div  className="ml_create_client">
                    <div className="medium-popover"><div className="row">
                      <div className="col-md-12">
                        <div className="form-group mandatory">
                          <input type="text" name="achievementName" placeholder="Name"
                                 className="form-control float-label" defaultValue={this.state.data.achievementName}
                                 onBlur={this.handleBlur.bind(this)} ref={"achievementName"} data-required={true}
                                 data-errMsg="Achievement Name is required"/>
                          <FontAwesome name='unlock' className="input_icon req_textarea_icon un_lock" id="isAchievementNamePrivate" defaultValue={this.state.data.isAchievementNamePrivate}  onClick={this.onLockChange.bind(this, "achievementName", "isAchievementNamePrivate")}/>
                        </div>
                        <div className="form-group">
                          <input type="text" name="achievementDescription" placeholder="About" className="form-control float-label" defaultValue={this.state.data.achievementDescription}  onBlur={this.handleBlur.bind(this)}/>
                          <FontAwesome name='unlock' className="input_icon req_textarea_icon un_lock" id="isAchievementDescriptionPrivate" defaultValue={this.state.data.isAchievementDescriptionPrivate}  onClick={this.onLockChange.bind(this, "achievementDescription", "isAchievementDescriptionPrivate")}/>
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
            </div>
          </div>)}
      </div>
    )
  }
}
MlCompanyAchivements.contextTypes = {
  companyPortfolio: PropTypes.object,
};
