import React, { Component } from 'react';
import ScrollArea from 'react-scrollbar';
var FontAwesome = require('react-fontawesome');
import {fetchStartupDetailsHandler} from '../../../actions/findPortfolioStartupDetails'
import {initializeMlAnnotator} from '../../../../../../commons/annotator/mlAnnotator'
import {findAnnotations} from '../../../../../../commons/annotator/findAnnotations'
import NoData from '../../../../../../commons/components/noData/noData';
import MlLoader from "../../../../../../commons/components/loader/loader";

const KEY = "lookingFor"
export default class MlStartupViewLookingFor extends Component {
  constructor(props) {
    super(props);
    this.state = { startupLookingforList: [], loading: true };
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
    const resp = this.fetchPortfolioStartupDetails();
    return resp
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
    let details = {portfolioId:this.props.portfolioDetailsId, docId:"startupLookingFor", quote:JSON.stringify(annotation)}
    const response = await createAnnotationActionHandler(details);
    if(response && response.success){
      this.fetchAnnotations(true);
    }
    return response;
  }

  async fetchAnnotations(isCreate){
    const response = await findAnnotations(this.props.portfolioDetailsId, "startupLookingFor");
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

  async fetchPortfolioStartupDetails() {
    const that = this;
    const portfoliodetailsId=that.props.portfolioDetailsId;
    const response = await fetchStartupDetailsHandler(portfoliodetailsId, KEY);
    if (response && response.lookingFor) {
      this.setState({startupLookingforList: response});
    }
    this.setState({loading:false})
  }

  render(){
    const that = this;
    let lookingforArray = that.state.startupLookingforList && that.state.startupLookingforList.lookingFor  || [];
    const loading = this.state.loading;
    return ( <div>
      {loading === true ? ( <MlLoader/>) : (
        <div>
          {_.isEmpty(lookingforArray) ?(
            <div className="portfolio-main-wrap">
              <NoData tabName={this.props.tabName}/>
            </div>):(
              <div id="annotatorContent">
                <h2>Looking For</h2>
                <div className="col-lg-12">
                  <div className="row">
                    {lookingforArray && lookingforArray.map(function (details, idx) {
                      return(<div className="col-lg-2 col-md-3 col-sm-4" key={idx}>
                        <div className="team-block">
                          <span className="ml my-ml-browser_3" />
                          <h3 title={details.lookingForName}>
                            {details.lookingForName&&details.lookingForName}
                          </h3>
                        </div>
                      </div>)
                    })}
                  </div>
                </div>
              </div>)
          }
        </div>)}
      </div>
      )
    }
}
