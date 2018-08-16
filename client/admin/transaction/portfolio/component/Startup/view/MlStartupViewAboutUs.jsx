import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import ScrollArea from 'react-scrollbar';
var FontAwesome = require('react-fontawesome');
import {fetchStartupDetailsHandler} from '../../../actions/findPortfolioStartupDetails';
import {initializeMlAnnotator} from '../../../../../../commons/annotator/mlAnnotator'
import {createAnnotationActionHandler} from '../../../actions/updatePortfolioDetails'
import {findAnnotations} from '../../../../../../commons/annotator/findAnnotations'
import _ from 'lodash'
var Rating = require('react-rating');

var KEY = 'aboutUs'
export default class MlStartupViewAboutUs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {startupAboutUsList: []};
    this.createAnnotations.bind(this);
    this.fetchAnnotations.bind(this);
    this.initalizeAnnotaor.bind(this);
    this.annotatorEvents.bind(this);

  }

  componentDidMount(){
    this.initalizeAnnotaor()
    var WinWidth = $(window).width();
    var WinHeight = $(window).height();
    $('.tab_wrap_scroll').height(WinHeight-($('.app_header').outerHeight(true)+120));
    if(WinWidth > 768){
      $(".tab_wrap_scroll").mCustomScrollbar({theme:"minimal-dark"});
    }

  }
  componentWillMount(){
    this.fetchPortfolioStartupDetails();


  }
  async fetchPortfolioStartupDetails() {
    let that = this;
    let portfoliodetailsId=that.props.portfolioDetailsId;
    const response = await fetchStartupDetailsHandler(portfoliodetailsId, KEY);
    if (response) {
      this.setState({startupAboutUsList: response});
      this.fetchAnnotations();
    }

    this.setState({loading:false})

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
    let details = {portfolioId:this.props.portfolioDetailsId, docId:"serviceproviderServices", quote:JSON.stringify(annotation)}
    const response = await createAnnotationActionHandler(details);
    if(response && response.success){
      this.fetchAnnotations(true);
    }
    return response;
  }



  async fetchAnnotations(isCreate){
    const response = await findAnnotations(this.props.portfolioDetailsId, "serviceproviderServices");
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
    let clientsArray = this.state.startupAboutUsList.clients || [];
    let rating = parseInt(this.state.startupAboutUsList.rating&&this.state.startupAboutUsList.rating.rating?this.state.startupAboutUsList.rating.rating:4);
    return (
      <div>
          <h2>About</h2>
          <div id="annotatorContent" className="tab_wrap_scroll">
              <div className="col-lg-12 col-sm-12" >
                <div className="row">
                  <div className="panel panel-default panel-form-view">
                    <div   className="panel-body">
                      <h4>About us</h4>
                      <p>{this.state.startupAboutUsList&&this.state.startupAboutUsList.aboutUs&&this.state.startupAboutUsList.aboutUs.startupDescription}.</p>
                      <h4>Rating</h4>
                      <p><Rating
                        empty="fa fa-star-o empty"
                        full="fa fa-star fill"
                        fractions={2}
                        readonly={true}
                        initialRate={rating}
                      /></p>
                      <h4>Service & Products</h4>
                      <p>{this.state.startupAboutUsList&&this.state.startupAboutUsList.serviceProducts&&this.state.startupAboutUsList.serviceProducts.spDescription}. </p>
                      <h4>Information</h4>
                      <p>{this.state.startupAboutUsList&&this.state.startupAboutUsList.serviceProducts&&this.state.startupAboutUsList.information.informationDescription}.</p>
                    </div>
                  </div>
                </div>
              </div>
          </div>


        </div>



    )
  }
}
