/**
 * Created by Rajat on 21/8/17.
 */
import React, { Component } from 'react';
const FontAwesome = require('react-fontawesome');
import {initializeMlAnnotator} from '../../../../../../../commons/annotator/mlAnnotator'
import {initalizeFloatLabel} from "../../../../../../utils/formElemUtil";
import {createAnnotationActionHandler} from '../../../../actions/updatePortfolioDetails'
import {findAnnotations} from '../../../../../../../commons/annotator/findAnnotations'
import {validateUserForAnnotation} from '../../../../actions/findPortfolioIdeatorDetails'
import NoData from '../../../../../../../commons/components/noData/noData';
import MlTextEditor, {createValueFromString} from "../../../../../../../commons/components/textEditor/MlTextEditor";

export default class MlCompanyViewAbout extends Component {
  constructor(props) {
    super(props);
    this.state={
      view:{},
      editorValue: createValueFromString(this.props.aboutUsDetails ? this.props.aboutUsDetails.companyDescription : null)
    }
    this.createAnnotations.bind(this);
    this.fetchAnnotations.bind(this);
    this.initalizeAnnotaor.bind(this);
    this.annotatorEvents.bind(this);
    this.validateUserForAnnotation(this)
  }
  componentDidMount(){
    // this.initalizeAnnotaor()
    // this.fetchAnnotations();
    $('.actions_switch').click();
    $('.appCommentBox').addClass('in');
    initalizeFloatLabel();
    this.lockPrivateKeys();
  }

  lockPrivateKeys() {
    const { privateFields } = this.props.aboutUsDetails;
    _.each(privateFields, function (pf) {
      $("#" + pf.booleanKey).removeClass('un_lock fa-unlock').addClass('fa-lock')
    })
  }

  componentWillMount(){
    const resp = this.validateUserForAnnotation();
    return resp
  }

  async validateUserForAnnotation() {
    const portfolioId = this.props.portfolioDetailsId
    const response = await validateUserForAnnotation(portfolioId);
    if (response && !this.state.isUserValidForAnnotation) {
      this.setState({isUserValidForAnnotation:response})

      this.initalizeAnnotaor()

      this.fetchAnnotations();
    }
  }
  initalizeAnnotaor(){
    initializeMlAnnotator(this.annotatorEvents.bind(this))
    this.state.content = jQuery("#annotatorContent").annotator();
    this.state.content.annotator('addPlugin', 'MyPlugin', {
      pluginInit:  function () {
      }
    });
  }

  annotatorEvents(event, annotation, editor){
    if(!annotation)
      return;
    switch (event){
      case 'create':{
        let response = this.createAnnotations(annotation);
      }
        break;
      case 'update':{
      }
        break;
      case 'annotationViewer':{
        if(annotation[0].id){
          this.props.getSelectedAnnotations(annotation[0]);
        }else{
          this.props.getSelectedAnnotations(annotation[1]);
        }

      }
        break;
    }
  }

  async createAnnotations(annotation){
    let details = {portfolioId:this.props.portfolioDetailsId, docId:"companyAboutUs", quote:JSON.stringify(annotation)}
    const response = await createAnnotationActionHandler(details);
    if(response && response.success){
      this.fetchAnnotations(true);
    }
    return response;
  }

  async fetchAnnotations(isCreate){
    const response = await findAnnotations(this.props.portfolioDetailsId, "companyAboutUs");
    let resp = JSON.parse(response.result);
    let annotations = this.state.annotations;
    this.setState({annotations:JSON.parse(response.result)})

    let quotes = [];

    _.each(this.state.annotations, function (value) {
      quotes.push({
        "id":value.annotatorId,
        "text" : value.quote.text,
        "quote" : value.quote.quote,
        "ranges" : value.quote.ranges,
        "userName" : value.userName,
        "roleName" : value.roleName,
        "profileImage" : value.profileImage,
        "createdAt" : value.createdAt
      })
    })
    this.state.content.annotator('loadAnnotations', quotes);
    return response;
  }

  render() {
    const { editorValue } = this.state;
    return (
      <div className="requested_input">
        <div className="col-lg-12 col-sm-12" id="annotatorContent">
          <div className="row">
            <div className="panel-form-view">
              <div className="panel panel-default">
                <div className="panel panel-default hide_unlock">
                  <div className="panel-heading">
                    About Us
                    <FontAwesome name='unlock' className="input_icon req_header_icon un_lock" id="isCompanyDescriptionPrivate" />
                  </div>
                </div>
                <div className="panel-body">
                  <div>{this.props.aboutUsDetails && this.props.aboutUsDetails.companyDescription ?
                    <MlTextEditor
                      value={editorValue}
                      isReadOnly={true}
                    /> : (<NoData tabName={this.props.tabName} />)}</div>
                  {/* <p>{this.props.aboutUsDetails && this.props.aboutUsDetails.companyDescription ? this.props.aboutUsDetails.companyDescription :(<NoData tabName={this.props.tabName}/>)}</p> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
};
