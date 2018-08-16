import React from 'react';
import {fetchInstitutionDetailsHandler} from '../../../actions/findPortfolioInstitutionDetails'
import {initializeMlAnnotator} from '../../../../../../commons/annotator/mlAnnotator'
import {createAnnotationActionHandler} from '../../../actions/updatePortfolioDetails'
import {findAnnotations} from '../../../../../../commons/annotator/findAnnotations'
import NoData from '../../../../../../commons/components/noData/noData';
import MlGenericIntrapreneurView from '../../commons/MlGenericIntrapreneurView';

const KEY = 'intrapreneurRecognition'

export default class MlInstitutionViewIntrapreneur extends React.Component {
  constructor(props) {
    super(props);
    this.state = {institutionIntrapreneurList: [], loading: true};
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
    let details = {portfolioId:this.props.portfolioDetailsId, docId:"institutionIntrapreneur", quote:JSON.stringify(annotation)}
    const response = await createAnnotationActionHandler(details);
    if(response && response.success){
      this.fetchAnnotations(true);
    }
    return response;
  }



  async fetchAnnotations(isCreate){
    const response = await findAnnotations(this.props.portfolioDetailsId, "institutionIntrapreneur");
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
    let portfoliodetailsId=that.props.portfolioDetailsId;
    const response = await fetchInstitutionDetailsHandler(portfoliodetailsId, KEY);
    if (response && response.intrapreneurRecognition) {
      this.setState({institutionIntrapreneurList: response.intrapreneurRecognition});
    }
    this.setState({loading: false})
  }

  render(){
    let that = this;
    let intrapreneurArray = that.state.institutionIntrapreneurList || [];
    if (!this.state.loading && intrapreneurArray && intrapreneurArray.length === 0) {
      return (<NoData tabName="Intrapreneur" />);
    } else {
      return (
        <div id="annotatorContent">
          <h2>Intrapreneur</h2>
          <div className="col-lg-12">
            <MlGenericIntrapreneurView intrapreneurList={intrapreneurArray} isAdmin={this.props.isAdmin}/>
          </div>
        </div>
      )
    }
  }
}
