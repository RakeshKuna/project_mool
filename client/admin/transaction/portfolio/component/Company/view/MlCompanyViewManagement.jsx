import React from 'react';;
var FontAwesome = require('react-fontawesome');
import {fetchCompanyDetailsHandler} from "../../../actions/findCompanyPortfolioDetails";
import {initializeMlAnnotator} from '../../../../../../commons/annotator/mlAnnotator'
import {createAnnotationActionHandler} from '../../../actions/updatePortfolioDetails'
import {findAnnotations} from '../../../../../../commons/annotator/findAnnotations'
import NoData from '../../../../../../commons/components/noData/noData';
import MlGenericManagementView from "../../commons/MlGenericManagementView";

import generateAbsolutePath from '../../../../../../../lib/mlGenerateAbsolutePath';

const KEY = 'management'
export default class MlCompanyViewManagement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {managementList: [], loading: true};
    // this.fetchPortfolioDetails.bind(this);
    // this.createAnnotations.bind(this);
    // this.fetchAnnotations.bind(this);
    // this.initalizeAnnotaor.bind(this);
    // this.annotatorEvents.bind(this);
  }

  // componentDidMount(){
  //   this.initalizeAnnotaor()
  //   this.fetchAnnotations();
  // }

  componentWillMount(){
    const resp = this.fetchPortfolioDetails();
    return resp;
  }

  // initalizeAnnotaor(){
  //   initializeMlAnnotator(this.annotatorEvents.bind(this))
  //   this.state.content = jQuery("#annotatorContent").annotator();
  //   this.state.content.annotator('addPlugin', 'MyPlugin', {
  //     pluginInit:  function () {
  //     }
  //   });
  // }
  //
  // annotatorEvents(event, annotation, editor){
  //   if(!annotation)
  //     return;
  //   switch (event){
  //     case 'create':{
  //       let response = this.createAnnotations(annotation);
  //     }
  //       break;
  //     case 'update':{
  //     }
  //       break;
  //     case 'annotationViewer':{
  //       if(annotation[0].id){
  //         this.props.getSelectedAnnotations(annotation[0]);
  //       }else{
  //         this.props.getSelectedAnnotations(annotation[1]);
  //       }
  //
  //     }
  //       break;
  //   }
  // }
  //
  // async createAnnotations(annotation){
  //   let details = {portfolioId:this.props.portfolioDetailsId, docId:"management", quote:JSON.stringify(annotation)}
  //   const response = await createAnnotationActionHandler(details);
  //   if(response && response.success){
  //     this.fetchAnnotations(true);
  //   }
  //   return response;
  // }
  //
  //
  //
  // async fetchAnnotations(isCreate){
  //   const response = await findAnnotations(this.props.portfolioDetailsId, "management");
  //   let resp = JSON.parse(response.result);
  //   let annotations = this.state.annotations;
  //   this.setState({annotations:JSON.parse(response.result)})
  //
  //   let quotes = [];
  //
  //   _.each(this.state.annotations, function (value) {
  //     quotes.push({
  //       "id":value.annotatorId,
  //       "text" : value.quote.text,
  //       "quote" : value.quote.quote,
  //       "ranges" : value.quote.ranges,
  //       "userName" : value.userName,
  //       "roleName" : value.roleName,
  //       "profileImage" : value.profileImage,
  //       "createdAt" : value.createdAt
  //     })
  //   })
  //   this.state.content.annotator('loadAnnotations', quotes);
  //
  //   return response;
  // }

  async fetchPortfolioDetails() {
    let that = this;
    let portfoliodetailsId=that.props.portfolioDetailsId;
    const response = await fetchCompanyDetailsHandler(portfoliodetailsId, KEY);
    if (response && response.management) {
      this.setState({managementList: response.management});
    }

    this.setState({loading:false})

  }

  render(){
    let that = this;
    let managementArray = that.state.managementList || [];
    if (!this.state.loading && managementArray && managementArray.length === 0) {
      return (<NoData tabName="Management" />);
    }
    return (

      <div id="annotatorContent">
        <h2>Management</h2>
        <div className="col-lg-12">
          <MlGenericManagementView data={managementArray} isAdmin={this.props.isAdmin} portfolioDetailsId={this.props.portfolioDetailsId}/>
          {/*<div className="row">*/}
            {/*{managementArray && managementArray.map(function (details, idx) {*/}
              {/*return(<div className="col-lg-2 col-md-3 col-xs-12 col-sm-4" key={idx}>*/}
                {/*<div className="team-block">*/}
                  {/*<img src={details.logo&&details.logo.fileUrl} className="team_img" />*/}
                  {/*<h3>*/}
                    {/*{details.firstName}<br /><b>{details.designation}</b>*/}
                  {/*</h3>*/}
                {/*</div>*/}
              {/*</div>)*/}
            {/*})}*/}
          {/*</div>*/}
        </div>
      </div>


    )
  }
}
