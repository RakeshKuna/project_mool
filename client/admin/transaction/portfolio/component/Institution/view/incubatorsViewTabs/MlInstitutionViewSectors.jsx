import React, { Component, PropTypes }  from "react";
import ScrollArea from 'react-scrollbar'
var FontAwesome = require('react-fontawesome');
import {dataVisibilityHandler, OnLockSwitch} from '../../../../../../utils/formElemUtil';
import MlLoader from "../../../../../../../commons/components/loader/loader";
import {fetchInstitutionDetailsHandler} from "../../../../actions/findPortfolioInstitutionDetails";
import {initializeMlAnnotator} from '../../../../../../../commons/annotator/mlAnnotator'
import {initalizeFloatLabel} from "../../../../../../utils/formElemUtil";
import {createAnnotationActionHandler} from '../../../../actions/updatePortfolioDetails'
import {findAnnotations} from '../../../../../../../commons/annotator/findAnnotations'
import {validateUserForAnnotation} from '../../../../actions/findPortfolioIdeatorDetails'
import NoData from '../../../../../../../commons/components/noData/noData';
import MlTextEditor, {createValueFromString} from "../../../../../../../commons/components/textEditor/MlTextEditor";
const KEY = "sectorsAndServices"

export default class MlInstitutionSectors extends React.Component{
  constructor(props, context){
    super(props);
    this.state={
      sectorsAndServices:{},
      content:{},
      loading: true
    }
    this.createAnnotations.bind(this);
    this.fetchAnnotations.bind(this);
    this.initalizeAnnotaor.bind(this);
    this.annotatorEvents.bind(this);
    this.validateUserForAnnotation(this)
  }

  componentWillMount(){
    this.fetchPortfolioDetails();
    let resp = this.validateUserForAnnotation();
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
    let details = {portfolioId:this.props.portfolioDetailsId, docId:"institutionSectors", quote:JSON.stringify(annotation)}
    const response = await createAnnotationActionHandler(details);
    if(response && response.success){
      this.fetchAnnotations(true);
    }
    return response;
  }

  async fetchAnnotations(isCreate){
    const response = await findAnnotations(this.props.portfolioDetailsId, "institutionSectors");
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

  async fetchPortfolioDetails() {
    let that = this;
    let portfolioDetailsId=that.props.portfolioDetailsId;
      const response = await fetchInstitutionDetailsHandler(portfolioDetailsId, KEY);
      if (response && response.sectorsAndServices) {
        const editorValue = createValueFromString(response.sectorsAndServices.sectorsAndServicesDescription);
        const object = response.sectorsAndServices;
        this.setState({ loading: false, sectorsAndServices: object, editorValue: editorValue }, () => {
          this.lockPrivateKeys();
        });
      }else{
        this.setState({loading:false})
      }
  }

  lockPrivateKeys() {
    const { privateFields } = this.state.sectorsAndServices;
    _.each(privateFields, function (pf) {
      $("#" + pf.booleanKey).removeClass('un_lock fa-unlock').addClass('fa-lock')
    })
  }

  render(){
    const showLoader = this.state.loading;
    const { editorValue } = this.state;
    return (


          <div className="col-lg-12 col-sm-12">
            <div className="row">
              <h2>Sectors And Services</h2>
              <div className="panel panel-default panel-form-view hide_unlock" id="annotatorContent">

                <div className="panel-body">
                {showLoader === true ? (<MlLoader />) : (<div>{this.state.sectorsAndServices && this.state.sectorsAndServices.sectorsAndServicesDescription ?
                        <MlTextEditor
                          value={editorValue}
                          isReadOnly={true}
                        /> : (<NoData tabName={this.props.tabName} />)}</div>)}
                  {/* {showLoader === true ? ( <MlLoader/>) : (<p>{this.state.sectorsAndServices && this.state.sectorsAndServices.sectorsAndServicesDescription ? this.state.sectorsAndServices.sectorsAndServicesDescription
                    :  <div className="portfolio-main-wrap">
                      <NoData tabName={this.props.tabName}/>
                    </div>
                }</p>)} */}
                <FontAwesome name='unlock' className="input_icon" id="isSectorsAndServicesPrivate" />
                </div>
              </div>
            </div>
          </div>

    )
  }
}
