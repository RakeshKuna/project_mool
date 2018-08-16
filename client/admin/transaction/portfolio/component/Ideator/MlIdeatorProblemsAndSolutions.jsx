import React, { Component, PropTypes }  from "react";
import { render } from 'react-dom';
import _ from 'lodash';
var FontAwesome = require('react-fontawesome');
import {multipartASyncFormHandler} from '../../../../../commons/MlMultipartFormAction'
import {dataVisibilityHandler, OnLockSwitch, initalizeFloatLabel} from '../../../../utils/formElemUtil';
import MlLoader from '../../../../../commons/components/loader/loader'
import {findIdeatorProblemsAndSolutionsActionHandler} from '../../actions/findPortfolioIdeatorDetails'
import {putDataIntoTheLibrary, removePortfolioFileUrl} from '../../../../../commons/actions/mlLibraryActionHandler'
import generateAbsolutePath from '../../../../../../lib/mlGenerateAbsolutePath';
import Confirm from '../../../../../commons/utils/confirm';
import MlTextEditor, {createValueFromString} from "../../../../../commons/components/textEditor/MlTextEditor";

export default class MlIdeatorProblemsAndSolutions extends Component{
  constructor(props, context) {
    super(props);
    this.state =  {loading: true, data:{}, privateKey:{},
      privateValues:[]};
    this.onInputChange = this.onInputChange.bind(this);
    this.onProblemImageFileUpload.bind(this);
    this.onSolutionImageFileUpload.bind(this);
    this.fetchPortfolioInfo.bind(this);
    this.fetchOnlyImages.bind(this);
    this.libraryAction.bind(this);
    return this;
  }

  componentWillMount() {
    const resp = this.fetchPortfolioInfo();
    return resp
  }

  async fetchPortfolioInfo(){
    let empty = _.isEmpty(this.context.ideatorPortfolio && this.context.ideatorPortfolio.problemSolution)
    if(empty){
      const response = await findIdeatorProblemsAndSolutionsActionHandler(this.props.portfolioDetailsId);
      if (response) {
        const solutionStatement = createValueFromString(response.solutionStatement);
        const problemStatement = createValueFromString(response.problemStatement);
        this.setState({ loading: false, data: response, solutionStatement, problemStatement });
      }
      _.each(response.privateFields, function (pf) {
        $("#"+pf.booleanKey).removeClass('un_lock fa-unlock').addClass('fa-lock')
      })

    }else{
      this.fetchOnlyImages();
      const solutionStatement = createValueFromString(this.context.ideatorPortfolio.problemSolution.solutionStatement);
      const problemStatement = createValueFromString(this.context.ideatorPortfolio.problemSolution.problemStatement);
      this.setState({ loading: true, data: this.context.ideatorPortfolio.problemSolution, solutionStatement, problemStatement });
    }
  }

  async fetchOnlyImages(){
    const response = await findIdeatorProblemsAndSolutionsActionHandler(this.props.portfolioDetailsId);
    if (response) {
      let dataDetails =this.state.data
      dataDetails['problemImage'] = response.problemImage
      dataDetails['solutionImage'] =response.solutionImage
      this.setState({loading: false, data: dataDetails, privateValues: response.privateFields}, () => {
        this.lockPrivateKeys()
      })
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

  onInputChange(value, name){
      let details = this.state.data;
      // let name  = e.target.name;
      details = _.omit(details, [name]);
      details = _.extend(details, { [name]: value.toString('html') });
      this.setState({ data: details, [name]: value }, function () {
        this.sendDataToParent()
      })
  }

  onLockChange(fieldName, field, e){
      let details = this.state.data||{};
      let key = e.target.id;
      var isPrivate = false;
      details=_.omit(details,[key]);
      let className = e.target.className;
      if(className.indexOf("fa-lock") != -1){
        details=_.extend(details,{[key]:true});
        isPrivate = true;
      }else{
        details=_.extend(details,{[key]:false});
      }

      var privateKey = {keyName:fieldName, booleanKey:field, isPrivate:isPrivate, tabName: this.props.tabName}
      // this.setState({privateKey:privateKey})
      this.setState({data:details, privateKey:privateKey}, function () {
        this.sendDataToParent()
      })
  }

  onProblemImageFileUpload(e){
      if(e.target.files[0].length ==  0)
          return;
      let file = e.target.files[0];
      let name = e.target.name;
      let fileName = e.target.files[0].name;
      let data ={moduleName: "PORTFOLIO", actionName: "UPLOAD", portfolioDetailsId:this.props.portfolioDetailsId, portfolio:{problemSolution:{problemImage:[{fileUrl:'', fileName : fileName}]}}};
      let response = multipartASyncFormHandler(data,file,'registration',this.onFileUploadCallBack.bind(this, name, file));
  }

  onSolutionImageFileUpload(e){
      if(e.target.files[0].length ==  0)
          return;
      let file = e.target.files[0];
      let name = e.target.name;
      let fileName = e.target.files[0].name;
      let data= {moduleName: "PORTFOLIO", actionName: "UPLOAD", portfolioDetailsId:this.props.portfolioDetailsId, portfolio:{problemSolution:{solutionImage:[{fileUrl:'', fileName : fileName}]}}};
      let response = multipartASyncFormHandler(data,file,'registration',this.onFileUploadCallBack.bind(this, name, file));
  }

  sendDataToParent() {
    let data = this.state.data;
    data = _.omit(data, 'problemImage')
    data = _.omit(data, 'solutionImage')
    for (var propName in data) {
      if (data[propName] === null || data[propName] === undefined) {
        delete data[propName];
      }
    }

    data=_.omit(data,["privateFields"]);
    this.props.getProblemSolution(data, this.state.privateKey);
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

  onFileUploadCallBack(name,file, resp){
    console.log('file', file)
      if(resp){
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

        if(result.success){
            this.fetchOnlyImages();
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

  async removeProblemAndSolutionPic(typeOfImage,fileUrl){
      if(typeOfImage && fileUrl){
        let portfolioDetailsId = this.props.portfolioDetailsId;
        const resp = await removePortfolioFileUrl(portfolioDetailsId , fileUrl,"problemSolution",typeOfImage);
        this.fetchOnlyImages();
      }
  }

  render(){
    const problemImageArray = this.state.data.problemImage && this.state.data.problemImage.length > 0 ? this.state.data.problemImage : [];
    let that=this;
    const problemImages = problemImageArray.map(function (m, id) {
      return (
        <div className="upload-image" key={id}>
          <FontAwesome name="trash-o" onClick={that.removeProblemAndSolutionPic.bind(that,"problemImage",m.fileUrl)}/>
          <img id="output" src={generateAbsolutePath(m.fileUrl)}/>
        </div>
      )
    });

    const solutionImageArray = this.state.data.solutionImage && this.state.data.solutionImage.length > 0 ? this.state.data.solutionImage : [];
    const solutionImages = solutionImageArray.map(function (m, id) {
      return (
        <div className="upload-image" key={id}>
          <FontAwesome name="trash-o" onClick={that.removeProblemAndSolutionPic.bind(that,"solutionImage",m.fileUrl)}/>
          <img id="output" src={generateAbsolutePath(m.fileUrl)}/>
        </div>
      )
    });
    // let problemStatement = this.state.data.problemStatement?this.state.data.problemStatement:''
    // let solutionStatement =   this.state.data.solutionStatement?this.state.data.solutionStatement:''
    let problemLockStatus =  this.state.data.isProblemPrivate?this.state.data.isProblemPrivate:false
    let solutionLockStatus =  this.state.data.isSolutionPrivate?this.state.data.isSolutionPrivate:false
    const showLoader = this.state.loading;
    const { solutionStatement, problemStatement } = this.state;
    return (
      <div>
        {showLoader === true ? ( <MlLoader/>) : (
              <div className="requested_input">
                <div className="col-md-12 nopadding"><h2>Problems and Solutions</h2></div>
                <div className="col-lg-6 nopadding-left">
                  <div className="panel panel-default panel-form">
                    <div className="panel-heading">
                      Problems
                      <FontAwesome name='unlock' className="input_icon req_header_icon un_lock" id="isProblemPrivate" onClick={this.onLockChange.bind(this, "problemStatement", "isProblemPrivate")}/>
                    </div>
                    <div className="panel-body">
                      <div className="form-group nomargin-bottom">
                        {/* <textarea placeholder="Describe..." className="form-control" id="cl_about" ref="problems" onBlur={this.onInputChange} name="problemStatement" defaultValue={problemStatement}></textarea> */}
                        <MlTextEditor
                          handleOnChange={(value, name) => this.onInputChange(value, "problemStatement")}
                          value={problemStatement}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="panel panel-default">
                    <div className="panel-heading">Add Images</div>
                    <div className="panel-body nopadding">
                      <div className="upload-file-wrap">
                        <input type="file" name="problemImage" id="piFileinput" className="inputfile inputfile-upload" data-multiple-caption="{count} files selected" accept="image/*" onChange={this.onProblemImageFileUpload.bind(this)} multiple />
                        <label htmlFor="piFileinput">
                          <figure>
                            <i className="fa fa-upload" aria-hidden="true"></i>
                          </figure>
                        </label>
                      </div>

                      {problemImages}

                    </div>
                  </div>
                </div>
                <div className="col-lg-6 nopadding-right">
                  <div className="panel panel-default panel-form">
                    <div className="panel-heading">
                      Solutions
                      <FontAwesome name='unlock' className="input_icon req_header_icon un_lock" id="isSolutionPrivate" onClick={this.onLockChange.bind(this, "solutionStatement", "isSolutionPrivate")}/>
                    </div>
                    <div className="panel-body">
                      <div className="form-group nomargin-bottom">
                        {/* <textarea placeholder="Describe..." className="form-control" id="cl_about" ref="solution" onBlur={this.onInputChange} name="solutionStatement" defaultValue={solutionStatement}></textarea> */}
                        <MlTextEditor
                          handleOnChange={(value, name) => this.onInputChange(value, "solutionStatement")}
                          value={solutionStatement}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="panel panel-default">
                    <div className="panel-heading">Add Images</div>
                    <div className="panel-body nopadding">
                      <div className="upload-file-wrap">
                        <input type="file" id="siFileinput" name="solutionImage" className="inputfile inputfile-upload" data-multiple-caption="{count} files selected" accept="image/*" onChange={this.onSolutionImageFileUpload.bind(this)} multiple />
                        <label htmlFor="siFileinput">
                          <figure>
                            <i className="fa fa-upload" aria-hidden="true"></i>
                          </figure>
                        </label>
                      </div>

                      {solutionImages}

                    </div>
                  </div>
                </div>
              </div>


        )}
      </div>
    )
  }
};
MlIdeatorProblemsAndSolutions.contextTypes = {
  ideatorPortfolio: PropTypes.object,
  portfolioKeys: PropTypes.object
};
