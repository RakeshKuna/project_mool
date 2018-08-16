import React from 'react';
var FontAwesome = require('react-fontawesome');
import {fetchCompanyDetailsHandler} from "../../../../actions/findCompanyPortfolioDetails";
import {initializeMlAnnotator} from '../../../../../../../commons/annotator/mlAnnotator'
import {createAnnotationActionHandler} from '../../../../actions/updatePortfolioDetails'
import {findAnnotations} from '../../../../../../../commons/annotator/findAnnotations'
import {initalizeFloatLabel} from "../../../../../../utils/formElemUtil";
import {validateUserForAnnotation} from '../../../../actions/findPortfolioIdeatorDetails'
import _ from 'lodash'
import NoData from '../../../../../../../commons/components/noData/noData';
import MlLoader from "../../../../../../../commons/components/loader/loader"; 
import MlTextEditor, {createValueFromString} from "../../../../../../../commons/components/textEditor/MlTextEditor";
const KEY = "policy"

export default class MlCompanyViewPolicy extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      policy:{},
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
    var WinHeight = $(window).height();
    $('.main_wrap_scroll ').height(WinHeight-(68+$('.admin_header').outerHeight(true)));
    initalizeFloatLabel();
  }

  componentWillMount(){
    this.fetchPortfolioDetails();
    let resp = this.validateUserForAnnotation();
    return resp
  }

  async fetchPortfolioDetails() {
    let that = this;
    let data = {};
    let portfoliodetailsId=that.props.portfolioDetailsId;
    const responseM = await fetchCompanyDetailsHandler(portfoliodetailsId, KEY);
    if (responseM) {
      const editorValue = createValueFromString(responseM.policy.policyDescription);
      this.setState({ policy: responseM.policy, loading: false, editorValue: editorValue }, () => {
        const privateFields = responseM.policy && responseM.policy.privateFields.length ? responseM.policy.privateFields : [];
        _.each(privateFields, function (pf) {
          $("#" + pf.booleanKey).removeClass('un_lock fa-unlock').addClass('fa-lock')
        })
      });
    }

    data = {
      policy:this.state.policy,
    }
    this.setState({data:data,loading:false})

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
    let details = {portfolioId:this.props.portfolioDetailsId, docId:"companyPolicy", quote:JSON.stringify(annotation)}
    const response = await createAnnotationActionHandler(details);
    if(response && response.success){
      this.fetchAnnotations(true);
    }
    return response;
  }

  async validateUserForAnnotation() {
    const portfolioId = this.props.portfolioDetailsId
    const response = await validateUserForAnnotation(portfolioId);
    if (response && !this.state.isUserValidForAnnotation) {
      this.setState({isUserValidForAnnotation:response,loading:false})

      this.initalizeAnnotaor()

      this.fetchAnnotations();
    }
  }

  async fetchAnnotations(isCreate){
    const response = await findAnnotations(this.props.portfolioDetailsId, "companyPolicy");
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
    let that = this;
    let policy = that.state.policy || {};
    let loading=this.state.loading
    const { editorValue } = this.state;
      return (
        <div className="portfolio-main-wrap" id="annotatorContent">
          <div className="col-lg-12 col-sm-12">
            <div className="row hide_unlock">
              <h2>Policy</h2>
              <div className="panel panel-default panel-form-view">
                <div className="panel-body">
                {loading === true ? (<MlLoader />) : (<div>{this.state.policy && this.state.policy.policyDescription ?
                        <MlTextEditor
                          value={editorValue}
                          isReadOnly={true}
                        /> : (<NoData tabName={this.props.tabName} />)}</div>)}
                  {/* {loading === true ? ( <MlLoader/>) : (<p>{this.state.policy && this.state.policy.policyDescription ? this.state.policy.policyDescription :  (<div className="portfolio-main-wrap">
                    <NoData tabName={this.props.tabName}/>
                  </div>)}</p>)} */}
                  <FontAwesome name='unlock' className="input_icon req_textarea_icon un_lock" id="isPolicyDescriptionPrivate" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )
  }
}
