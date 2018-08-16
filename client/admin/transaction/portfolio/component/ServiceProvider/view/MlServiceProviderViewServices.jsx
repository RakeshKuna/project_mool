import React, {Component} from "react";
import {render} from "react-dom";
import ScrollArea from "react-scrollbar";
import {dataVisibilityHandler, OnLockSwitch} from "../../../../../utils/formElemUtil";
import {findServiceProviderServicesActionHandler} from "../../../actions/findPortfolioServiceProviderDetails";
import _ from "lodash";
import MlLoader from "../../../../../../commons/components/loader/loader";
import {createAnnotationActionHandler} from "../../../actions/updatePortfolioDetails";
import {findAnnotations} from "../../../../../../commons/annotator/findAnnotations";
import {initializeMlAnnotator} from "../../../../../../commons/annotator/mlAnnotator";
import {validateUserForAnnotation} from '../../../actions/findPortfolioIdeatorDetails';
import NoData from '../../../../../../commons/components/noData/noData';

import MlFunderServicesList from "../../Funders/edit/Services/Container/MlFunderServicesList";

var FontAwesome = require('react-fontawesome');

export default class MlServiceProviderViewServices extends Component {
  constructor(props, context) {
    super(props);
    this.state = {
      data: {},
      privateKey: {},
      isUserValidForAnnotation:false,
      loading: true
    }
    this.fetchPortfolioDetails.bind(this);
    this.createAnnotations.bind(this);
    this.fetchAnnotations.bind(this);
    this.initalizeAnnotaor.bind(this);
    this.annotatorEvents.bind(this);
    this.validateUserForAnnotation(this)
  }

  componentWillMount() {

  }

  componentDidMount() {
    // OnLockSwitch();
    // dataVisibilityHandler();
    //this.initalizeAnnotaor()
    var WinHeight = $(window).height();
    $('.main_wrap_scroll ').height(WinHeight - (68 + $('.admin_header').outerHeight(true)));
    this.fetchPortfolioDetails();
    this.validateUserForAnnotation();
  }

  componentDidUpdate() {
    // OnLockSwitch();
    // dataVisibilityHandler();
  }

  /**
   * fetch data handler
   * */
  async fetchPortfolioDetails() {
    let that = this;
    let portfolioDetailsId = that.props.portfolioDetailsId;
    const response = await findServiceProviderServicesActionHandler(portfolioDetailsId);
    if (response) {
      this.setState({loading: false, data: response});
      this.fetchAnnotations();
    }
    _.each(response.privateFields, function (pf) {
      $("#" + pf.booleanKey).removeClass('un_lock fa-unlock').addClass('fa-lock')
    })
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
    let details = {portfolioId:this.props.portfolioDetailsId, docId:"serviceProviderServices", quote:JSON.stringify(annotation)}
    const response = await createAnnotationActionHandler(details);
    if(response && response.success){
      this.fetchAnnotations(true);
    }
    return response;
  }



  async fetchAnnotations(isCreate){
    const response = await findAnnotations(this.props.portfolioDetailsId, "serviceProviderServices");
    let resp = JSON.parse(response.result);
    let annotations = this.state.annotations;
    this.setState({annotations:JSON.parse(response.result)})

    let quotes = [];

    _.each(resp||[], function (value) {
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
    if(quotes && quotes.length>0){
      this.state.content.annotator('loadAnnotations', quotes);
      return response
    }else {
      return response
    }
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

  /**
   * UI to be render
   * */
  render() {
    let description = this.state.data.servicesDescription ? this.state.data.servicesDescription : ''
    let isServicesPrivate = this.state.data.isServicesPrivate ? this.state.data.isServicesPrivate : false
    const showLoader = this.state.loading;
    console.log(this.props);
    return (
      <div>
        <div className="clearfix"/>
        <MlFunderServicesList view={this.props.view}
          myPortfolio={this.props.myPortfolio}
          createServiceMode={this.props.createServiceMode ? this.props.createServiceMode : ""}
          portfolioDetailsId={this.props.portfolioDetailsId} />
      </div>
    )
  }
};
