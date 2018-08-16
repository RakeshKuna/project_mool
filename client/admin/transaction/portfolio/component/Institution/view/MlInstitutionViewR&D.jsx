import React from 'react';
import {fetchInstitutionDetailsHandler} from '../../../actions/findPortfolioInstitutionDetails'
import {initializeMlAnnotator} from '../../../../../../commons/annotator/mlAnnotator'
import {createAnnotationActionHandler} from '../../../actions/updatePortfolioDetails'
import {findAnnotations} from '../../../../../../commons/annotator/findAnnotations'
import NoData from '../../../../../../commons/components/noData/noData';
import MlGenericRAndDView from '../../commons/MlGenericR&DView'

const KEY = 'researchAndDevelopment'

export default class MlInstitutionViewRD extends React.Component {
  constructor(props) {
    super(props);
    this.state = {institutionRDList: [], loading: true};
    this.fetchPortfolioInstitutionDetails.bind(this);
    this.createAnnotations.bind(this);
    this.fetchAnnotations.bind(this);
    this.initalizeAnnotaor.bind(this);
    this.annotatorEvents.bind(this);
  }


  componentDidMount(){
    this.initalizeAnnotaor()
    this.fetchAnnotations();
  }

  componentWillMount(){
    this.fetchPortfolioInstitutionDetails();
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
    let details = {portfolioId:this.props.portfolioDetailsId, docId:"institutionRD", quote:JSON.stringify(annotation)}
    const response = await createAnnotationActionHandler(details);
    if(response && response.success){
      this.fetchAnnotations(true);
    }
    return response;
  }



  async fetchAnnotations(isCreate){
    const response = await findAnnotations(this.props.portfolioDetailsId, "institutionRD");
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

  async fetchPortfolioInstitutionDetails() {
    let that = this;
    let portfoliodetailsId = that.props.portfolioDetailsId;
    const response = await fetchInstitutionDetailsHandler(portfoliodetailsId, KEY);
    if (response && response.researchAndDevelopment) {
      this.setState({institutionRDList: response.researchAndDevelopment});
    }
    this.setState({loading: false})
  }

  render(){
    let that = this;
    let researchAndDevelopmentArray = that.state.institutionRDList || [];
    if (!this.state.loading && researchAndDevelopmentArray && researchAndDevelopmentArray.length === 0) {
      return (<NoData tabName="R & D" />);
    } else {
      return (
        <div id="annotatorContent">
          <h2>Research And Development</h2>
          <div className="col-lg-12">
            <MlGenericRAndDView RAndDList={researchAndDevelopmentArray} isAdmin={this.props.isAdmin}/>
          </div>
        </div>
      )
    }
  }
}
