import React, { Component } from 'react';
import _ from 'lodash';
var FontAwesome = require('react-fontawesome');
import {fetchCompanyDetailsHandler} from "../../../actions/findCompanyPortfolioDetails";
import {initializeMlAnnotator} from '../../../../../../commons/annotator/mlAnnotator'
import {createAnnotationActionHandler} from '../../../actions/updatePortfolioDetails'
import {findAnnotations} from '../../../../../../commons/annotator/findAnnotations'
import NoData from '../../../../../../commons/components/noData/noData';
import {initalizeFloatLabel} from "../../../../../utils/formElemUtil";
import {validateUserForAnnotation} from '../../../actions/findPortfolioIdeatorDetails';
import MlLoader from "../../../../../../commons/components/loader/loader";
import ScrollArea from 'react-scrollbar';
import MlTextEditor, {createValueFromString} from "../../../../../../commons/components/textEditor/MlTextEditor";
const MEMBERKEY = 'memberships'
const LICENSEKEY = 'licenses'
const COMPLIANCEKEY = 'compliances'

export default class MlCompanyViewMCL extends Component {
  constructor(props) {
    super(props);
    this.state={
      memberships:{},
      compliances:{},
      licenses:{},
      data:{},
      annotations:[],
      content:{},
      loading:true
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
    var WinHeight = $(window).height();
    var WinWidth = $(window).width();
    var className = this.props.isAdmin?"admin_header":"app_header"
    setTimeout (function(){
    $('.main_wrap_scroll').height(WinHeight-($('.'+className).outerHeight(true)+90));
    if(WinWidth > 768){
    $(".main_wrap_scroll").mCustomScrollbar({theme:"minimal-dark"});
    }
    },200);
    initalizeFloatLabel();
  }

  componentWillMount(){
    this.validateUserForAnnotation();
    let resp = this.fetchPortfolioDetails();
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

  async fetchPortfolioDetails() {
    let that = this;
    let data = {};
    let privateFields = [];
    let membershipsDescription;
    let compliancesDescription;
    let licensesDescription;
    const portfoliodetailsId = that.props.portfolioDetailsId;
    /*const responseM = await fetchCompanyDetailsHandler(portfoliodetailsId, MEMBERKEY);
    if (responseM) {
      this.setState({memberships: responseM.memberships});
    }
    const responseC = await fetchCompanyDetailsHandler(portfoliodetailsId, COMPLIANCEKEY);
    if (responseC) {
      this.setState({compliances: responseC.compliances});
    }
    const responseL = await fetchCompanyDetailsHandler(portfoliodetailsId, LICENSEKEY);
    if (responseL) {
      this.setState({licenses: responseL.licenses});
    }
    this.setState({loading: false});*/
    const responseM = await fetchCompanyDetailsHandler(portfoliodetailsId, MEMBERKEY);
    if (responseM) {
      data.memberships = responseM.memberships;
      privateFields = responseM.memberships && responseM.memberships.privateFields && responseM.memberships.privateFields.length ? responseM.memberships.privateFields.concat(privateFields) : privateFields;
      // this.setState({memberships: responseM.memberships,loading: true},function () {
      //   this.fetchAnnotations();
      //   this.setState({loading: false})
      // });
    }
    const responseC = await fetchCompanyDetailsHandler(portfoliodetailsId, COMPLIANCEKEY);
    if (responseC) {
      data.compliances = responseC.compliances;
      privateFields = responseC.memberships && responseC.compliances.privateFields && responseC.compliances.privateFields.length ? responseC.compliances.privateFields.concat(privateFields) : privateFields;
      // this.setState({compliances: responseC.compliances,loading: true},function () {
      //   this.fetchAnnotations();
      //   this.setState({loading: false})
      // });
    }
    const responseL = await fetchCompanyDetailsHandler(portfoliodetailsId, LICENSEKEY);
    if (responseL) {
      data.licenses = responseL.licenses;
      privateFields = responseL.licenses && responseL.licenses.privateFields && responseL.licenses.privateFields.length ? responseL.licenses.privateFields.concat(privateFields) : privateFields;
      // this.setState({licenses: responseL.licenses,loading: true},function () {
      //   this.fetchAnnotations();
      //   this.setState({loading: false})
      // });
    }
    // data = {
    //   memberships:this.state.memberships,
    //   licenses: this.state.licenses,
    //   compliances:this.state.compliances
    // }
    membershipsDescription = createValueFromString(data.memberships ? data.memberships.membershipsDescription : null);
    compliancesDescription = createValueFromString(data.compliances ? data.compliances.compliancesDescription : null);
    licensesDescription = createValueFromString(data.licenses ? data.licenses.licensesDescription : null);

    this.setState({ data: data, loading: false, membershipsDescription, compliancesDescription, licensesDescription }, () => {
      this.fetchAnnotations();
      _.each(privateFields, function (pf) {
        $("#" + pf.booleanKey).removeClass('un_lock fa-unlock').addClass('fa-lock')
      })
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
    let details = {portfolioId:this.props.portfolioDetailsId, docId:"MCL", quote:JSON.stringify(annotation)}
    const response = await createAnnotationActionHandler(details);
    if(response && response.success){
      this.fetchAnnotations(true);
    }
    return response;
  }



  async fetchAnnotations(isCreate){
    const response = await findAnnotations(this.props.portfolioDetailsId, "MCL");
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

  render(){
    const showLoader = this.state.loading;
    const { membershipsDescription, compliancesDescription, licensesDescription } = this.state;
    return (
      <div>
        <div className="main_wrap_scroll hide_unlock">
              <div className="portfolio-main-wrap" id="annotatorContent">
                <h2>MCL</h2>

                <div className="col-md-6 col-sm-6 nopadding-left">
                  <div className="panel panel-default panel-form-view">
                    <div className="panel-heading">Membership</div>
                    <div className="panel-body">
                      <div className="form-group nomargin-bottom panel_input">
                        {/* 
                  {showLoader === true ? (<MlLoader />) : (
                    <div>{this.state.memberships && this.state.memberships.membershipsDescription ? <p>{this.state.memberships.membershipsDescription}</p> : (<div className="portfolio-main-wrap">
                      <NoData tabName={this.props.tabName} />
                    </div>)}
                  </div>)} */}
                        {this.state.data.memberships && this.state.data.memberships.membershipsDescription ?
                          <MlTextEditor
                            value={membershipsDescription}
                            isReadOnly={true}
                          /> :
                          <div className="portfolio-main-wrap">
                            <NoData tabName={this.props.tabName} />
                          </div>}
                        <FontAwesome name='unlock' className="input_icon req_textarea_icon un_lock" id="isMembershipsDescriptionPrivate" />
                      </div>
                    </div>
                  </div>
                  <div className="clearfix"></div>
                </div>

                <div className="col-md-6 col-sm-6 nopadding-right">
                  <div className="panel panel-default panel-form-view">
                    <div className="panel-heading">Compliances</div>
                    <div className="panel-body">
                      <div className="form-group nomargin-bottom panel_input">
                        {/* 
                      {showLoader === true ? ( <MlLoader/>) : (
                    <div>{this.state.compliances && this.state.compliances.compliancesDescription ? <p>{this.state.compliances.compliancesDescription}</p> : (<div className="portfolio-main-wrap">
                      <NoData tabName={this.props.tabName} />
                    </div>)}</div>)} */}
                        {this.state.data.compliances && this.state.data.compliances.compliancesDescription ?
                          <MlTextEditor
                            value={compliancesDescription}
                            isReadOnly={true}
                          /> :
                          <div className="portfolio-main-wrap">
                            <NoData tabName={this.props.tabName} />
                          </div>}
                        <FontAwesome name='unlock' className="input_icon req_textarea_icon un_lock" id="isCompliancesDescriptionPrivate" />
                      </div>
                    </div>
                  </div>

                  <div className="clearfix"></div>
                  <div className="panel panel-default panel-form-view">
                    <div className="panel-heading">Licenses</div>
                    <div className="panel-body">
                    <div className="form-group nomargin-bottom panel_input">
                      {/* 
                  {showLoader === true ? (<MlLoader />) : (
                    <div>
                      {this.state.licenses && this.state.licenses.licensesDescription ? <p>{this.state.licenses.licensesDescription}</p> : (<div className="portfolio-main-wrap">
                        <NoData tabName={this.props.tabName} />
                      </div>)}
                    </div>)} */}
                      {this.state.data.licenses && this.state.data.licenses.licensesDescription ?
                        <MlTextEditor
                          value={licensesDescription}
                          isReadOnly={true}
                        /> :
                        <div className="portfolio-main-wrap">
                          <NoData tabName={this.props.tabName} />
                        </div>}
                      <FontAwesome name='unlock' className="input_icon req_textarea_icon un_lock" id="isLicensesDescriptionPrivate" />
                        </div>
                    </div>
                  </div>
                </div>
              </div>
        </div>
      </div>
    )
  }
}
