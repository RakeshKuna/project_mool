import React, { Component, PropTypes }  from "react";
import _ from 'lodash';
var FontAwesome = require('react-fontawesome');
import {dataVisibilityHandler, OnLockSwitch, initalizeFloatLabel} from '../../../../utils/formElemUtil';
import {findIdeatorAudienceActionHandler} from '../../actions/findPortfolioIdeatorDetails'
import {multipartASyncFormHandler} from '../../../../../commons/MlMultipartFormAction'
import {putDataIntoTheLibrary,removePortfolioFileUrl} from '../../../../../commons/actions/mlLibraryActionHandler'
import generateAbsolutePath from '../../../../../../lib/mlGenerateAbsolutePath';
import MlLoader from '../../../../../commons/components/loader/loader'
import Confirm from '../../../../../commons/utils/confirm';
import MlTextEditor, {createValueFromString} from "../../../../../commons/components/textEditor/MlTextEditor";

export default class MlIdeatorAudience extends Component{
  constructor(props, context){
    super(props);
    this.state={
      loading: true,
      data:{},
      privateKey:{},
      privateValues:[]
    }
    this.onClick.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.onAudienceImageFileUpload.bind(this)
    this.fetchPortfolioInfo.bind(this);
    this.fetchOnlyImages.bind(this);
    this.libraryAction.bind(this);
  }

  componentWillMount(){
    const resp = this.fetchPortfolioInfo();
    return resp
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

  onClick(fieldName, field, e){
    let isPrivate = false;
    let className = e.target.className;
    if (className.indexOf('fa-lock') !== -1) {
      isPrivate = true;
    }
    var privateKey = {keyName:fieldName, booleanKey:field, isPrivate:isPrivate, tabName: this.props.tabName}
    this.setState({privateKey:privateKey}, function () {
      this.sendDataToParent()
    })
  }

  handleBlur(value){
    let details = this.state.data;
    // let name  = e.target.name;
    let name  = "audienceDescription";
    details=_.omit(details,[name]);
    details = _.extend(details, {[name]: value.toString('html')});
    this.setState({data:details, editorValue:value}, function () {
      this.sendDataToParent()
    })
  }

  sendDataToParent(){
    let data = this.state.data;
    data = _.omit(data, 'audienceImages')
    for (var propName in data) {
      if (data[propName] === null || data[propName] === undefined) {
        delete data[propName];
      }
    }
    data=_.omit(data,["privateFields"]);
    this.props.getAudience(data, this.state.privateKey)
  }

  async fetchPortfolioInfo() {
    let that = this;
    let portfoliodetailsId=that.props.portfolioDetailsId;
    const response = await findIdeatorAudienceActionHandler(portfoliodetailsId);
    let empty = _.isEmpty(that.context.ideatorPortfolio && that.context.ideatorPortfolio.audience)
    if(empty && response){
      const editorValue = createValueFromString(response.audienceDescription);
      this.setState({loading: false, data: response, editorValue: editorValue});
      _.each(response.privateFields, function (pf) {
        $("#"+pf.booleanKey).removeClass('un_lock fa-unlock').addClass('fa-lock')
      })
    }else{
      this.fetchOnlyImages();
      const editorValue = createValueFromString(that.context.ideatorPortfolio.audience.audienceDescription);
      this.setState({loading: true, data: that.context.ideatorPortfolio.audience, editorValue: editorValue});
    }
  }

  /**
   * UI creating lock function
   * */
  lockPrivateKeys() {
    var filterPrivateKeys = _.filter(this.context.portfolioKeys.privateKeys, {tabName: this.props.tabName})
    var filterRemovePrivateKeys = _.filter(this.context.portfolioKeys.removePrivateKeys, {tabName: this.props.tabName})
    var finalKeys = _.unionBy(filterPrivateKeys, this.state.privateValues, 'booleanKey')
    var keys = _.differenceBy(finalKeys, filterRemovePrivateKeys, 'booleanKey')
    console.log('keysssssssssssssssss', keys)
    _.each(keys, function (pf) {
      $("#" + pf.booleanKey).removeClass('un_lock fa-unlock').addClass('fa-lock')
    })
  }

  onAudienceImageFileUpload(e){
    if(e.target.files[0].length ==  0)
      return;
    let file = e.target.files[0];
    let name = e.target.name;
    let fileName = e.target.files[0].name;
    let data ={moduleName: "PORTFOLIO", actionName: "UPLOAD", portfolioDetailsId:this.props.portfolioDetailsId, portfolio:{audience:{audienceImages:[{fileUrl:'', fileName : fileName}]}}};
    let response = multipartASyncFormHandler(data,file,'registration',this.onFileUploadCallBack.bind(this, name, file));
  }

  async fetchOnlyImages(){
    const response = await findIdeatorAudienceActionHandler(this.props.portfolioDetailsId);
    if (response) {
      let dataDetails =this.state.data
      dataDetails['audienceImages'] = response.audienceImages
      this.setState({loading: false, data: dataDetails, privateValues: response.privateFields}, () => {
        this.lockPrivateKeys()
      })
    }
  }

  onFileUploadCallBack(name,file, resp){
    if(resp){
      console.log(file)
      let result = JSON.parse(resp)

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

      this.fetchOnlyImages();
    }
  }

  async libraryAction(file) {
    console.log(this.props.client)
    let portfolioDetailsId = this.props.portfolioDetailsId;
    const resp = await putDataIntoTheLibrary(portfolioDetailsId ,file, this.props.client)
    if(resp.code === 404) {
      toastr.error(resp.result)
    } else {
      toastr.success(resp.result)
      return resp;
    }
    return resp;
  }
  async removeProblemAndSolutionPic(typeOfImage,fileUrl){
    if(typeOfImage && fileUrl){
      let portfolioDetailsId = this.props.portfolioDetailsId;
      const resp = await removePortfolioFileUrl(portfolioDetailsId , fileUrl,"audience",typeOfImage);
      this.fetchOnlyImages();
    }
  }
  render(){
    const showLoader = this.state.loading;
    let that=this;
    const { editorValue } = this.state;
    const audienceImageArray = this.state.data.audienceImages && this.state.data.audienceImages.length > 0 ? this.state.data.audienceImages : [];
    const audienceImages = audienceImageArray.map(function (m, id) {
      return (
        <div className="upload-image" key={id}>
          <FontAwesome className="fa fa-trash-o" name="audienceImages" onClick={that.removeProblemAndSolutionPic.bind(that,"audienceImages",m.fileUrl)}/>
          <img id="output" src={generateAbsolutePath(m.fileUrl)}/>
        </div>
      )
    });
    // let description = this.state.data.audienceDescription ? this.state.data.audienceDescription : "";
    // const isAudiencePrivate = this.state.data.isAudiencePrivate?this.state.data.isAudiencePrivate:false;
    return (
      <div>
        {showLoader === true ? ( <MlLoader/>) : (
      <div className="requested_input">
        <h2>Audience</h2>
        <div className="col-lg-12">
          <div className="row">
            <div className="panel panel-default panel-form">
              <div className="panel-heading">
                Audience
                <FontAwesome name='unlock' className="input_icon req_header_icon un_lock" id="isAudiencePrivate" onClick={this.onClick.bind(this, "audienceDescription", "isAudiencePrivate")}/>
              </div>
              <div className="panel-body">
                <div className="form-group nomargin-bottom">
                  <MlTextEditor
                    value={editorValue}
                    handleOnChange={this.handleBlur}
                  />
                  {/*<textarea placeholder="Describe..." className="form-control" id="cl_about" defaultValue={description } name="audienceDescription" onBlur={this.handleBlur.bind(this)}></textarea>*/}
                </div>
              </div>
            </div>
            <div className="panel panel-default">
              <div className="panel-heading">Add Images</div>
              <div className="panel-body nopadding">
                <div className="upload-file-wrap">
                  <input type="file" id="siFileinput" name="audienceImages" className="inputfile inputfile-upload" data-multiple-caption="{count} files selected" accept="image/*" onChange={this.onAudienceImageFileUpload.bind(this)} multiple />
                  <label htmlFor="siFileinput">
                    <figure>
                      <i className="fa fa-upload" aria-hidden="true"></i>
                    </figure>
                  </label>
                </div>
                {audienceImages}
              </div>
            </div>

          </div>
        </div>
      </div>)}
      </div>
    )
  }
};

MlIdeatorAudience.contextTypes = {
  ideatorPortfolio: PropTypes.object,
  portfolioKeys: PropTypes.object,
};
