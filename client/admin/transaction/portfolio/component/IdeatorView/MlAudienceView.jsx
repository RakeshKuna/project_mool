import React, { Component, PropTypes }  from "react";
import _ from 'lodash'
var FontAwesome = require('react-fontawesome');
import { initalizeLockTitle, initalizeFloatLabel } from '../../../../utils/formElemUtil';
import {findIdeatorAudienceActionHandler} from '../../actions/findPortfolioIdeatorDetails'
import {initializeMlAnnotator} from '../../../../../commons/annotator/mlAnnotator'
import {createAnnotationActionHandler} from '../../actions/updatePortfolioDetails'
import {findAnnotations} from '../../../../../commons/annotator/findAnnotations'
import {validateUserForAnnotation} from '../../actions/findPortfolioIdeatorDetails'
import MlLoader from '../../../../../commons/components/loader/loader'
import NoData from '../../../../../commons/components/noData/noData';
import generateAbsolutePath from '../../../../../../lib/mlGenerateAbsolutePath';
import MlTextEditor, {createValueFromString} from "../../../../../commons/components/textEditor/MlTextEditor";

// import {multipartASyncFormHandler} from '../../../../../commons/MlMultipartFormAction'


export default class MlAudienceView extends Component{
  constructor(props, context){
    super(props);
    this.state={
      loading: true,
      data:{},
      privateKey:{}
    };
    this.fetchPortfolioInfo.bind(this);
    this.fetchOnlyImages.bind(this);
    this.initalizeAnnotaor.bind(this);
    this.annotatorEvents.bind(this);
    this.validateUserForAnnotation(this)
  }



  componentWillMount(){
    this.fetchPortfolioInfo();
    let resp = this.validateUserForAnnotation();
    return resp
  }
  componentDidUpdate(){
    // OnLockSwitch();
    // dataVisibilityHandler();
    initalizeFloatLabel();
  }

  initalizeAnnotaor() {
    initializeMlAnnotator(this.annotatorEvents.bind(this))
    this.state.content = jQuery("#psContent").annotator();
    this.state.content.annotator('addPlugin', 'MyPlugin', {
      pluginInit: function () {
      }
    });
  }

  annotatorEvents(event, annotation, editor) {
    if (!annotation)
      return;
    switch (event) {
      case 'create': {
        let response = this.createAnnotations(annotation);
      }
        break;
      case 'update': {
      }
        break;
      case 'annotationViewer': {
        if (annotation[0].id) {
          this.props.getSelectedAnnotations(annotation[0]);
        } else {
          this.props.getSelectedAnnotations(annotation[1]);
        }
      }
        break;
    }
  }
  async createAnnotations(annotation) {
    let details = {portfolioId: this.props.portfolioDetailsId, docId: "audience", quote: JSON.stringify(annotation)}
    const response = await createAnnotationActionHandler(details);
    if (response && response.success) {
      this.fetchAnnotations(true);
    }
    return response;
  }

  async fetchAnnotations(isCreate) {
    const response = await findAnnotations(this.props.portfolioDetailsId, "audience");
    let resp = JSON.parse(response.result);
    let annotations = this.state.annotations;
    this.setState({annotations: JSON.parse(response.result)})

    let quotes = [];

    _.each(this.state.annotations, function (value) {
      quotes.push({
        "id": value.annotatorId,
        "text": value.quote.text,
        "quote": value.quote.quote,
        "ranges": value.quote.ranges,
        "userName": value.userName,
        "roleName" : value.roleName,
        "profileImage" : value.profileImage,
        "createdAt": value.createdAt
      })
    })
    this.state.content.annotator('loadAnnotations', quotes);
    return response;
  }

  async validateUserForAnnotation() {
    const portfolioId = this.props.portfolioDetailsId
    const response = await validateUserForAnnotation(portfolioId);
    if (response && !this.state.isUserValidForAnnotation) {
      this.setState({isUserValidForAnnotation:response})
      this.initalizeAnnotaor()
      this.fetchAnnotations()
    }
  }

  // onClick(fieldName, field, e){
  //   let details = this.state.data||{};
  //   let key = e.target.id;
  //   details=_.omit(details,[key]);
  //   var isPrivate = false;
  //   let className = e.target.className;
  //   if(className.indexOf("fa-lock") != -1){
  //     details=_.extend(details,{[key]:true});
  //     isPrivate = true;
  //   }else{
  //     details=_.extend(details,{[key]:false});
  //   }
  //
  //   var privateKey = {keyName:fieldName, booleanKey:field, isPrivate:isPrivate}
  //   this.setState({privateKey:privateKey})
  //   this.setState({data:details}, function () {
  //     this.sendDataToParent()
  //   })
  // }
  // handleBlur(e){
  //   let details =this.state.data;
  //   let name  = e.target.name;
  //   details=_.omit(details,[name]);
  //   details=_.extend(details,{[name]:e.target.value});
  //   this.setState({data:details}, function () {
  //     this.sendDataToParent()
  //   })
  // }

  // sendDataToParent(){
  //   let data = this.state.data;
  //   data = _.omit(data, 'audienceImages')
  //   for (var propName in data) {
  //     if (data[propName] === null || data[propName] === undefined) {
  //       delete data[propName];
  //     }
  //   }
  //   data=_.omit(data,["privateFields"]);
  //
  //   this.props.getAudience(data, this.state.privateKey)
  // }
  async fetchPortfolioInfo() {
    const that = this;
    let portfoliodetailsId = that.props.portfolioDetailsId;
    const response = await findIdeatorAudienceActionHandler(portfoliodetailsId);
    if (response) {
      const editorValue = createValueFromString(response.audienceDescription);
      this.setState({loading: false, data: response, editorValue: editorValue});
      _.each(response.privateFields, function (pf) {
        $("#" + pf.booleanKey).removeClass('un_lock fa-unlock').addClass('fa-lock')
      })
      initalizeLockTitle();
    }
  }

  // onAudienceImageFileUpload(e){
  //   if(e.target.files[0].length ==  0)
  //     return;
  //   let file = e.target.files[0];
  //   let name = e.target.name;
  //   let fileName = e.target.files[0].name;
  //   let data ={moduleName: "PORTFOLIO", actionName: "UPLOAD", portfolioDetailsId:this.props.portfolioDetailsId, portfolio:{audience:{audienceImages:[{fileUrl:'', fileName : fileName}]}}};
  //   let response = multipartASyncFormHandler(data,file,'registration',this.onFileUploadCallBack.bind(this, name, fileName));
  // }

  async fetchOnlyImages(){
    const response = await findIdeatorAudienceActionHandler(this.props.portfolioDetailsId);
    if (response) {
        let dataDetails =this.state.data
        dataDetails['audienceImages'] = response.audienceImages
        this.setState({loading: false, data: dataDetails});
    }
  }

  // onFileUploadCallBack(name,fileName, resp){
  //   if(resp){
  //     let result = JSON.parse(resp)
  //     if(result.success){
  //       this.fetchOnlyImages();
  //     }
  //   }
  // }

  render(){
    const showLoader = this.state.loading;
    const audienceImageArray = this.state.data.audienceImages && this.state.data.audienceImages.length > 0 ? this.state.data.audienceImages : [];
    const audienceImages = audienceImageArray.map(function (m, id) {
      return (
        <div className="upload-image" key={id}>
          <img id="output" src={generateAbsolutePath(m.fileUrl)}/>
        </div>
      )
    });
    let description = this.state.data.audienceDescription ? this.state.data.audienceDescription : '';
    const { editorValue } = this.state;
    let loading = this.state.loading ? this.state.loading : false;
    return (
      <div>
          <div className="requested_input">

                <div className="col-lg-12 col-sm-12">
                    <div className="row">
                        <h2>Audience</h2>
                        <div id="psContent" className="panel-form-view hide_unlock">
                            <div className="panel panel-default">
                                <div className="panel-heading">
                                    Audience
                                    <FontAwesome name='unlock' className="input_icon req_header_icon un_lock" id="isAudiencePrivate" />
                                </div>
                                <div className="panel-body">
                                  {/*{loading === true ? ( <MlLoader/>) : (<div>{description?description:(<NoData tabName={this.props.tabName}/>)}</div>)}*/}
                                  {loading === true ? ( <MlLoader/>) : (<div>{description ? 
                                  <MlTextEditor
                                    value={editorValue}
                                    isReadOnly={true}
                                  /> : (<NoData tabName={this.props.tabName}/>)}</div>)}
                                </div>
                            </div>
                        </div>


                      <div className="panel panel-default">
                        <div className="panel-heading">Images</div>
                         <div className="panel-body nopadding">
                            {audienceImages}
                         </div>
                      </div>

                    </div>
              </div>
          </div>
      </div>
    )
  }
};





























// import React from 'react';
// import { Meteor } from 'meteor/meteor';
// import { render } from 'react-dom';
// import ScrollArea from 'react-scrollbar';
// var FontAwesome = require('react-fontawesome');
// var Select = require('react-select');
// import {findIdeatorAudienceActionHandler} from '../../actions/findPortfolioIdeatorDetails'
// import {dataVisibilityHandler, OnLockSwitch,initalizeFloatLabel} from '../../../../utils/formElemUtil';
// import {findAnnotations} from '../../../../../commons/annotator/findAnnotations'
// import {initializeMlAnnotator} from '../../../../../commons/annotator/mlAnnotator'
// import {createAnnotationActionHandler} from '../../actions/updatePortfolioDetails'
// import 'react-responsive-tabs/styles.css'
// export default class MlPortfolioIdeatorAudienceView extends React.Component {
//   constructor(props) {
//     super(props);
//
//     this.state = {
//       portfolioIdeatorInfo: {}
//     }
//     this.fetchPortfolioInfo.bind(this);
//     this.initalizeAnnotaor.bind(this);
//     this.fetchAnnotations.bind(this);
//     this.annotatorEvents.bind(this);
//   }
//
//   initalizeAnnotaor(){
//     initializeMlAnnotator(this.annotatorEvents.bind(this))
//     this.state.content = jQuery("#audienceContent").annotator();
//     this.state.content.annotator('addPlugin', 'MyPlugin', {
//       pluginInit:  function () {
//       }
//     });
//
//
//   }
//
//   async createAnnotations(annotation){
//     let details = {portfolioId:this.props.portfolioDetailsId, docId:"audience", quote:JSON.stringify(annotation)}
//     const response = await createAnnotationActionHandler(details);
//     if(response && response.success){
//       this.fetchAnnotations(true);
//     }
//     return response;
//   }
//
//   async fetchAnnotations(isCreate){
//     const response = await findAnnotations(this.props.portfolioDetailsId, "audience");
//     let resp = JSON.parse(response.result);
//     let annotations = this.state.annotations;
//     this.setState({annotations:JSON.parse(response.result)})
//
//     let quotes = [];
//
//     _.each(this.state.annotations, function (value) {
//       quotes.push({
//         "id":value.annotatorId,
//         "text" : value.quote.text,
//         "quote" : value.quote.quote,
//         "ranges" : value.quote.ranges,
//         "userName" : value.userName,
//         "roleName" : value.roleName,
//         "profileImage" : value.profileImage,
//         "createdAt" : value.createdAt
//       })
//     })
//     this.state.content.annotator('loadAnnotations', quotes);
//
//     return response;
//   }
//
//
//   annotatorEvents(event, annotation, editor){
//     if(!annotation)
//       return;
//     switch (event){
//       case 'create':{
//         let response = this.createAnnotations(annotation);
//       }
//         break;
//       case 'update':{
//       }
//         break;
//       case 'annotationViewer':{
//         if(annotation[0].id){
//           this.props.getSelectedAnnotations(annotation[0]);
//         }else{
//           this.props.getSelectedAnnotations(annotation[1]);
//         }
//       }
//         break;
//     }
//   }
//
//   componentDidMount()
//   {
//     $('.actions_switch').click();
//
//     $("#timeLine").popover({
//       'title' : 'Timeline',
//       'html' : true,
//       'placement' : 'top',
//       'container' : '.admin_main_wrap',
//       'content' : $(".ml_timeline").html()
//     });
//     $(document).on('click', '.add_comment', function(e){
//       $('.comment-input-box').slideToggle();
//     });
//
//     this.initalizeAnnotaor()
//     this.fetchPortfolioInfo();
//     this.fetchAnnotations();
//     initalizeFloatLabel();
//   }
//
//   async fetchPortfolioInfo(){
//     const response = await findIdeatorAudienceActionHandler(this.props.portfolioDetailsId);
//     if(response){
//       this.setState({portfolioIdeatorInfo : response});
//     }
//   }
//
//   render(){
//     return (
//
//       <div className="col-lg-12 col-sm-12">
//         <div className="row">
//           <h2>Audience</h2>
//           <div id="audienceContent" className="panel panel-default panel-form-view">
//
//             <div className="panel-body">z
//               {this.state.portfolioIdeatorInfo.description}
//             </div>
//           </div>
//         </div>
//       </div>
//
//
//     )
//   }
// }
