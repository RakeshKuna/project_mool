import React, { Component } from 'react';
import ScrollArea from 'react-scrollbar';
import _ from 'lodash';
var FontAwesome = require('react-fontawesome');
import {fetchStartupDetailsHandler} from '../../../actions/findPortfolioStartupDetails'
import {initializeMlAnnotator} from '../../../../../../commons/annotator/mlAnnotator'
import {createAnnotationActionHandler} from '../../../actions/updatePortfolioDetails'
import {findAnnotations} from '../../../../../../commons/annotator/findAnnotations';
import NoData from '../../../../../../commons/components/noData/noData';
import MlLoader from "../../../../../../commons/components/loader/loader";
import MlTextEditor, {createValueFromString} from "../../../../../../commons/components/textEditor/MlTextEditor";
import { initalizeLockTitle } from '../../../../../../commons/utils/formElemUtil.js';

const MEMBERKEY = 'memberships'
const LICENSEKEY = 'licenses'
const COMPLIANCEKEY = 'compliances'

export default class MlStartupViewMCL extends Component {
  constructor(props) {
    super(props);
    this.state={
      memberships:{},
      compliances:{},
      licenses:{},
      data:{},
      annotations:[],
      content:{},
      loading: true
    }
    this.createAnnotations.bind(this);
    this.fetchAnnotations.bind(this);
    this.initalizeAnnotaor.bind(this);
    this.annotatorEvents.bind(this);
  }

  componentDidMount(){
    this.initalizeAnnotaor()
    this.fetchAnnotations();
    var WinWidth = $(window).width();
    var WinHeight = $(window).height();
    const className = this.props.isAdmin ? "admin_header" : "app_header";
    // $('.tab_wrap_scroll').height(WinHeight-($('.app_header').outerHeight(true)+120));
    $('.tab_wrap_scroll').height(WinHeight-($('.'+className).outerHeight(true)+120));
    if(WinWidth > 768){
      $(".tab_wrap_scroll").mCustomScrollbar({theme:"minimal-dark"});
    }
  }

  componentWillMount() {
    const resp = this.fetchPortfolioStartupDetails();
    return resp
  }

  async fetchPortfolioStartupDetails() {
    let that = this;
    let data = {};
    let membershipDescription;
    let complianceDescription;
    let licenseDescription;
    let privateFields = [];
    let portfoliodetailsId = that.props.portfolioDetailsId;
    const responseM = await fetchStartupDetailsHandler(portfoliodetailsId, MEMBERKEY);
    if (responseM) {
      data.memberships = responseM.memberships;
      privateFields = responseM.memberships && responseM.memberships.privateFields && responseM.memberships.privateFields.length ? responseM.memberships.privateFields.concat(privateFields) : privateFields;
    }
    const responseC = await fetchStartupDetailsHandler(portfoliodetailsId, COMPLIANCEKEY);
    if (responseC) {
      data.compliances = responseC.compliances;
      privateFields = responseC.memberships && responseC.compliances.privateFields && responseC.compliances.privateFields.length ? responseC.compliances.privateFields.concat(privateFields) : privateFields;
    }
    const responseL = await fetchStartupDetailsHandler(portfoliodetailsId, LICENSEKEY);
    if (responseL) {
      data.licenses = responseL.licenses;
      privateFields = responseL.licenses && responseL.licenses.privateFields && responseL.licenses.privateFields.length ? responseL.licenses.privateFields.concat(privateFields) : privateFields;
    }
    membershipDescription = createValueFromString(data.memberships ? data.memberships.membershipDescription : null);
    complianceDescription = createValueFromString(data.compliances ? data.compliances.complianceDescription : null);
    licenseDescription = createValueFromString(data.licenses ? data.licenses.licenseDescription : null);
    this.setState({ loading: false, data: data, membershipDescription, complianceDescription, licenseDescription }, () => {
      _.each(privateFields, function (pf) {
        $("#" + pf.booleanKey).removeClass('un_lock fa-unlock').addClass('fa-lock')
      })
      initalizeLockTitle();
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
    let details = {portfolioId:this.props.portfolioDetailsId, docId:"startupMCL", quote:JSON.stringify(annotation)}
    const response = await createAnnotationActionHandler(details);
    if(response && response.success){
      this.fetchAnnotations(true);
    }
    return response;
  }

  async fetchAnnotations(isCreate){
    const response = await findAnnotations(this.props.portfolioDetailsId, "startupMCL");
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
    const { membershipDescription, complianceDescription, licenseDescription } = this.state;
    return (
      <div>
        <div className="tab_wrap_scroll hide_unlock">
          <ScrollArea
            speed={0.8}
            className="tab_wrap_scroll"
            smoothScrolling={true}
            default={true}
          >
        {/* {showLoader === true ? ( <MlLoader/>) : ( */}

            <div className="portfolio-main-wrap" id="annotatorContent">
              <h2>MCL</h2>
               <div className="col-md-6 col-sm-6 nopadding-left">
                <div className="panel panel-default panel-form-view">
                  <div className="panel-heading">Membership</div>
                  <div className="panel-body">
                    <div className="form-group nomargin-bottom panel_input">
                      {this.state.data.memberships && this.state.data.memberships.membershipDescription ?
                        <MlTextEditor
                          value={membershipDescription}
                          isReadOnly={true}
                        /> :
                        <div className="portfolio-main-wrap">
                          <NoData tabName={this.props.tabName} />
                        </div>}
                      <FontAwesome name='unlock' className="input_icon req_textarea_icon un_lock" id="isMDPrivate" />
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
                      {this.state.data.compliances && this.state.data.compliances.complianceDescription ?
                        <MlTextEditor
                          value={complianceDescription}
                          isReadOnly={true}
                        /> :
                        <div className="portfolio-main-wrap">
                          <NoData tabName={this.props.tabName} />
                        </div>}
                      <FontAwesome name='unlock' className="input_icon req_textarea_icon un_lock" id="isCDPrivate" />
                    </div>
                  </div>
                </div>
                <div className="clearfix"></div>

                <div className="panel panel-default panel-form-view">
                  <div className="panel-heading">Licenses</div>
                  <div className="panel-body">
                    <div className="form-group nomargin-bottom panel_input">
                      {this.state.data.licenses && this.state.data.licenses.licenseDescription ?
                        <MlTextEditor
                          value={licenseDescription}
                          isReadOnly={true}
                        /> :
                        <div className="portfolio-main-wrap">
                          <NoData tabName={this.props.tabName} />
                        </div>}
                      <FontAwesome name='unlock' className="input_icon req_textarea_icon un_lock" id="isLDPrivate" />
                    </div>
                  </div>
                </div>
              </div>
          </div>
          {/* )
        } */}
          </ScrollArea>
        </div>
      </div>
    )
  }
}
