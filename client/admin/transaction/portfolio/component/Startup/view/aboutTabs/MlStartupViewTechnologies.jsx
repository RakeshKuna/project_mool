/**
 * Created by vishwadeep on 21/8/17.
 */
import React from 'react';
// import {fetchDetailsStartupActionHandler} from '../../actions/findPortfolioStartupDetails'
import {initializeMlAnnotator} from '../../../../../../../commons/annotator/mlAnnotator'
import {createAnnotationActionHandler} from '../../../../actions/updatePortfolioDetails'
import {findAnnotations} from '../../../../../../../commons/annotator/findAnnotations'
import NoData from '../../../../../../../commons/components/noData/noData';
import generateAbsolutePath from '../../../../../../../../lib/mlGenerateAbsolutePath';

export default class MlStartupViewTechnologies extends React.Component {
  constructor(props) {
    super(props);
    this.state = {startupBranchesList: []};
    this.createAnnotations.bind(this);
    this.fetchAnnotations.bind(this);
    this.initalizeAnnotaor.bind(this);
    this.annotatorEvents.bind(this);
  }
  componentDidMount(){
    this.initalizeAnnotaor()
    this.fetchAnnotations();
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
    let details = {portfolioId:this.props.portfolioDetailsId, docId:"startupTechnologies", quote:JSON.stringify(annotation)}
    const response = await createAnnotationActionHandler(details);
    if(response && response.success){
      this.fetchAnnotations(true);
    }
    return response;
  }



  async fetchAnnotations(isCreate){
    const response = await findAnnotations(this.props.portfolioDetailsId, "startupTechnologies");
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
  //
  // }

  render(){
    let that = this;
    // let branchesArray = that.state.startupBranchesList || [];
    let technologiesArray = that.props.technologiesDetails || [];
    return (

        <div id="annotatorContent">
          <h2>Technologies</h2>
          <div>
            {technologiesArray && technologiesArray.length?(
              <div className="col-lg-12">
            <div className="row">
              {technologiesArray.map(function (details, idx) {
                return(<div className="col-lg-2 col-md-3 col-xs-12 col-sm-4" key={idx}>
                  <div className="team-block">
                    <img src={details.logo&&generateAbsolutePath(details.logo.fileUrl)} className="team_img"/>
                    <h3>
                      {details.technologyName&&details.technologyName} <br />
                    </h3>
                  </div>
                </div>)
              })}
            </div>
          </div>):(<NoData tabName={this.props.tabName}/>)}
            </div>
        </div>
    )
  }
}
// && branchesArray.technologies && branchesArray.technologies
