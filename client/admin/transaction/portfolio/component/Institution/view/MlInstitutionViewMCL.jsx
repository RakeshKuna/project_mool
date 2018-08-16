import React, { Component } from 'react';
const FontAwesome = require('react-fontawesome');
import _ from 'lodash';
import {fetchInstitutionDetailsHandler} from '../../../actions/findPortfolioInstitutionDetails'
import {initializeMlAnnotator} from '../../../../../../commons/annotator/mlAnnotator'
import {createAnnotationActionHandler} from '../../../actions/updatePortfolioDetails'
import {findAnnotations} from '../../../../../../commons/annotator/findAnnotations'
import NoData from '../../../../../../commons/components/noData/noData';
import MlLoader from "../../../../../../commons/components/loader/loader";
import {validateUserForAnnotation} from '../../../actions/findPortfolioIdeatorDetails'
import MlTextEditor, {createValueFromString} from "../../../../../../commons/components/textEditor/MlTextEditor";

const MEMBERKEY = 'memberships'
const LICENSEKEY = 'licenses'
const COMPLIANCEKEY = 'compliances'

export default class MlInstitutionViewMCL extends Component {
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
    /*this.initalizeAnnotaor()
    this.fetchAnnotations();*/
    var WinHeight = $(window).height();
    $('.main_wrap_scroll ').height(WinHeight-(68+$('.admin_header').outerHeight(true)));
    this.fetchPortfolioInstitutionDetails();

  }
  componentWillMount(){
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


  async fetchPortfolioInstitutionDetails() {
    let that = this;
    let data = {};
    let privateFields = [];
    let membershipDescription;
    let complianceDescription;
    let licenseDescription
    let portfoliodetailsId=that.props.portfolioDetailsId;
    const responseM = await fetchInstitutionDetailsHandler(portfoliodetailsId, MEMBERKEY);
    if (responseM) {
      privateFields = responseM.memberships && responseM.memberships.privateFields && responseM.memberships.privateFields.length ? responseM.memberships.privateFields.concat(privateFields) : privateFields;
      this.setState({memberships: responseM.memberships, loading: true}, function () {
        this.fetchAnnotations();
        this.setState({loading: false})
      });
    }
    const responseC = await fetchInstitutionDetailsHandler(portfoliodetailsId, COMPLIANCEKEY);
    if (responseC) {
      privateFields = responseC.memberships && responseC.compliances.privateFields && responseC.compliances.privateFields.length ? responseC.compliances.privateFields.concat(privateFields) : privateFields; 
      this.setState({compliances: responseC.compliances,loading: true},function () {
        this.fetchAnnotations();
        this.setState({loading: false})
      });
    }
    const responseL = await fetchInstitutionDetailsHandler(portfoliodetailsId, LICENSEKEY);
    if (responseL) {
      privateFields = responseL.licenses && responseL.licenses.privateFields && responseL.licenses.privateFields.length ? responseL.licenses.privateFields.concat(privateFields) : privateFields;
      this.setState({licenses: responseL.licenses,loading: true},function () {
        this.fetchAnnotations();
        this.setState({loading: false})
      });
    }

    data = {
      memberships:this.state.memberships,
      licenses: this.state.licenses,
      compliances:this.state.compliances
    }
    membershipDescription = createValueFromString(data.memberships ? data.memberships.membershipDescription : null);
    complianceDescription = createValueFromString(data.compliances ? data.compliances.complianceDescription : null);
    licenseDescription = createValueFromString(data.licenses ? data.licenses.licenseDescription : null);
    this.setState({ data: data, loading: false, membershipDescription, complianceDescription, licenseDescription }, () => {
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
    let details = {portfolioId:this.props.portfolioDetailsId, docId:"institutionMCL", quote:JSON.stringify(annotation)}
    const response = await createAnnotationActionHandler(details);
    if(response && response.success){
      this.fetchAnnotations(true);
    }
    return response;
  }



  async fetchAnnotations(isCreate){
    const response = await findAnnotations(this.props.portfolioDetailsId, "institutionMCL");
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

  compareQueryOptions(a, b) {
    return JSON.stringify(a) === JSON.stringify(b);
  };



  render(){
    const { membershipDescription, complianceDescription, licenseDescription } = this.state;
    // const {memberships, compliances, licenses} = this.state;
    const loading=this.state.loading?this.state.loading:false;
      return (

       <div className="portfolio-main-wrap" id="annotatorContent">
          <h2>MCL</h2>

          <div className="col-md-6 col-sm-6 nopadding-left" >
            <div className="panel panel-default panel-form-view">
              <div className="panel-heading">Membership </div>
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
                  {/* {loading === true ? ( <MlLoader/>) : (<p>{memberships.membershipDescription?(this.state.memberships&&this.state.memberships.membershipDescription?this.state.memberships.membershipDescription:""):(<NoData tabName="M C & L" />)}</p>)} */}
                </div>
              </div>
            </div>
            <div className="clearfix"></div>
          </div>

         <div className="col-md-6 col-sm-6 nopadding-right" >
            <div className="panel panel-default panel-form-view">
              <div className="panel-heading">Compliances</div>
              <div className="panel-body ">
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
                {/* {loading === true ? ( <MlLoader/>) : (<p>{compliances.complianceDescription?(this.state.compliances&&this.state.compliances.complianceDescription?this.state.compliances.complianceDescription:""):(<NoData tabName="M C & L" />)}</p>)} */}
                </div>
              </div>
            </div>
            <div className="clearfix"></div>
            <div className="panel panel-default panel-form-view">
              <div className="panel-heading">Licenses </div>
              <div className="panel-body ">
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
                  {/* {loading === true ? ( <MlLoader/>) : (<p>{licenses.licenseDescription?(this.state.licenses&&this.state.licenses.licenseDescription?this.state.licenses.licenseDescription:""):(<NoData tabName="M C & L" />)}</p>)} */}
                </div>
              </div>
            </div>
          </div>
        </div>
      )
  }
}
