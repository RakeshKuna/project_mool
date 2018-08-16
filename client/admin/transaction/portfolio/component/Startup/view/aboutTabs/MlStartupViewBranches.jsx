/**
 * Created by vishwadeep on 21/8/17.
 */
import React from 'react';
import { render } from 'react-dom';
// import {fetchDetailsStartupActionHandler} from '../../actions/findPortfolioStartupDetails'
import {initializeMlAnnotator} from '../../../../../../../commons/annotator/mlAnnotator'
import {createAnnotationActionHandler} from '../../../../actions/updatePortfolioDetails'
import {findAnnotations} from '../../../../../../../commons/annotator/findAnnotations'
import NoData from '../../../../../../../commons/components/noData/noData';
import generateAbsolutePath from '../../../../../../../../lib/mlGenerateAbsolutePath';
import {validateUserForAnnotation} from '../../../../actions/findPortfolioIdeatorDetails';

export default class MlStartupViewBranches extends React.Component {
  constructor(props) {
    super(props);
    this.state = {startupBranchesList: []};
    this.createAnnotations.bind(this);
    this.fetchAnnotations.bind(this);
    this.initalizeAnnotaor.bind(this);
    this.annotatorEvents.bind(this);
  }
  componentDidMount(){
    let resp = this.validateUserForAnnotation();
    return resp
  }
  // componentWillMount(){
  //   this.fetchPortfolioStartupDetails();
  // }
  initalizeAnnotaor(){
    initializeMlAnnotator(this.annotatorEvents.bind(this))
    this.state.content = jQuery("#annotatorContent").annotator();
    this.state.content.annotator('addPlugin', 'MyPlugin', {
      pluginInit:  function () {
      }
    });
  }
  async validateUserForAnnotation() {
    const portfolioId = this.props.portfolioDetailsId
    const response = await validateUserForAnnotation(portfolioId);
    if (response && !this.state.isUserValidForAnnotation) {
      this.setState({isUserValidForAnnotation: true})
      this.initalizeAnnotaor()
      this.fetchAnnotations()
    }
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
    let details = {portfolioId:this.props.portfolioDetailsId, docId:"startupBranches", quote:JSON.stringify(annotation)}
    const response = await createAnnotationActionHandler(details);
    if(response && response.success){
      this.fetchAnnotations(true);
    }
    return response;
  }

  async fetchAnnotations(isCreate){
    const response = await findAnnotations(this.props.portfolioDetailsId, "startupBranches");
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

  // async fetchPortfolioStartupDetails() {
  //   let that = this;
  //   let portfoliodetailsId=that.props.portfolioDetailsId;
  //   const response = await fetchDetailsStartupActionHandler(portfoliodetailsId);
  //   if (response) {
  //     this.setState({loading: false,startupBranchesList: response});
  //   }
  // }

  render(){
    let that = this;
    const branchesArray = that.props.branchesDetails || [];
    return (

        <div>
          <h2>Branches</h2>
          <div>
            {branchesArray && branchesArray.length?(
             <div className="col-lg-12"  id="annotatorContent">
            <div className="row">
              {branchesArray.map(function (details, idx) {
                return(
                  <div className="col-lg-4 col-md-6 col-sm-6" key={idx}>
                    <div className="branch_block shadow_block">
                      <img
                        src={details.logo && details.logo.fileUrl ? generateAbsolutePath(details.logo.fileUrl) : "/images/headquarters_img.png"}/>
                      <h3>
                        {details.branchName} <br />
                      </h3>
                      <p>
                        #{details.branchAddress1} {details.branchAddress2}<br />
                      </p>
                      <p>
                        {details.branchLandmark} {details.branchArea?',' + details.branchArea:''}<br/>
                      </p>
                      <p>
                        {details.branchCity} {details.branchState?',' + details.branchState:''}<br/>
                      </p>
                      <p>
                        Phone: {details.branchPhoneNumber}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>):(<NoData tabName={this.props.tabName}/>)}
            </div>
        </div>
    )
  }
}
// && branchesArray.branches && branchesArray.branches
