import React from 'react';
import {fetchCompanyDetailsHandler} from "../../../actions/findCompanyPortfolioDetails";
import {initializeMlAnnotator} from '../../../../../../commons/annotator/mlAnnotator'
import {createAnnotationActionHandler} from '../../../actions/updatePortfolioDetails'
import {findAnnotations} from '../../../../../../commons/annotator/findAnnotations'
import NoData from '../../../../../../commons/components/noData/noData';
import MlGenericIntrapreneurView from '../../commons/MlGenericIntrapreneurView';


const KEY = 'intrapreneurRecognition'

export default class MlCompanyViewIntrapreneur extends React.Component {
  constructor(props) {
    super(props);
    this.state = {intrapreneurList: [], loading: true};
    this.fetchPortfolioDetails.bind(this);
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
    this.fetchPortfolioDetails();
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
    let details = {portfolioId:this.props.portfolioDetailsId, docId:"intrapreneur", quote:JSON.stringify(annotation)}
    const response = await createAnnotationActionHandler(details);
    if(response && response.success){
      this.fetchAnnotations(true);
    }
    return response;
  }



  async fetchAnnotations(isCreate){
    const response = await findAnnotations(this.props.portfolioDetailsId, "intrapreneur");
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

  async fetchPortfolioDetails() {
    let that = this;
    let portfoliodetailsId=that.props.portfolioDetailsId;
    const response = await fetchCompanyDetailsHandler(portfoliodetailsId, KEY);
    if (response && response.intrapreneurRecognition) {
      this.setState({intrapreneurList: response.intrapreneurRecognition});
    }
    this.setState({loading: false})
  }

  render(){
    let that = this;
    let intrapreneurArray = that.state.intrapreneurList || [];
    if (!this.state.loading && intrapreneurArray && intrapreneurArray.length === 0) {
      return (<NoData tabName="Intrapreneur" />);
    }
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
