import React from "react";
import {render} from "react-dom";
import {fetchServiceProviderPortfolioClients} from "../../../actions/findPortfolioServiceProviderDetails";
import {initializeMlAnnotator} from "../../../../../../commons/annotator/mlAnnotator";
import {createAnnotationActionHandler} from "../../../actions/updatePortfolioDetails";
import {findAnnotations} from "../../../../../../commons/annotator/findAnnotations";
import {validateUserForAnnotation} from '../../../actions/findPortfolioIdeatorDetails';
import NoData from '../../../../../../commons/components/noData/noData';
import ScrollArea from 'react-scrollbar';
import MlLoader from "../../../../../../commons/components/loader/loader";
var FontAwesome = require('react-fontawesome');
import generateAbsolutePath from '../../../../../../../lib/mlGenerateAbsolutePath';


export default class MlServiceProviderViewClients extends React.Component {
  constructor(props) {
    super(props);
    this.state = {serviceProviderClientsList: [],selectedAbout:"",tabIndex:0,isUserValidForAnnotation:false,loading: true};
    this.fetchPortfolioStartupDetails.bind(this);
    this.createAnnotations.bind(this);
    this.fetchAnnotations.bind(this);
    this.initalizeAnnotaor.bind(this);
    this.annotatorEvents.bind(this);
    this.validateUserForAnnotation(this)
  }


  componentDidMount() {
    //this.initalizeAnnotaor()
    var WinHeight = $(window).height();
    var WinWidth = $(window).width();
    var className = this.props.isAdmin?"admin_header":"app_header"
    setTimeout (function(){
    $('.main_wrap_scroll').height(WinHeight-($('.'+className).outerHeight(true)+120));
    if(WinWidth > 768){
      $(".main_wrap_scroll").mCustomScrollbar({theme:"minimal-dark"});
    }
  },200);
    $("#show").click(function(){
      $("#details-div").show();
      var $frame = $('#centered');
      var $wrap  = $frame.parent();


      // Call Sly on frame
      $frame.sly({
        horizontal: 1,
        itemNav: 'centered',
        smart: 1,
        activateOn: 'click',
        mouseDragging: 1,
        touchDragging: 1,
        releaseSwing: 1,
        startAt:0,
        scrollBar: $wrap.find('.scrollbar'),
        scrollBy: 1,
        speed: 300,
        elasticBounds: 1,
        easing: 'easeOutExpo',
        dragHandle: 1,
        dynamicHandle: 1,
        clickBar: 1,

      });
      $("#show").hide();
    });
    $(function() {
      $('.float-label').jvFloat();
    });
    this.fetchPortfolioStartupDetails();
    this.validateUserForAnnotation();
  }

  componentWillMount() {

  }

  initalizeAnnotaor() {
    initializeMlAnnotator(this.annotatorEvents.bind(this))
    this.state.content = jQuery("#annotatorContent").annotator();
    this.state.content.annotator('addPlugin', 'MyPlugin', {
      pluginInit: function () {
      }
    });
  }

  annotatorEvents(event, annotation, editor) {
    if (!annotation)
      return;
    switch (event) {
      case 'create': {
        let response = this.createAnnotations(annotation);
      }
        break;
      case 'update': {
      }
        break;
      case 'annotationViewer': {
        if (annotation[0].id) {
          this.props.getSelectedAnnotations(annotation[0]);
        } else {
          this.props.getSelectedAnnotations(annotation[1]);
        }

      }
        break;
    }
  }

  async createAnnotations(annotation) {
    let details = {
      portfolioId: this.props.portfolioDetailsId,
      docId: "serviceProviderClients"+ this.state.tabIndex,
      quote: JSON.stringify(annotation)
    }
    const response = await createAnnotationActionHandler(details);
    if (response && response.success) {
      this.fetchAnnotations(this.state.tabIndex);
    }
    return response;
  }


  async fetchAnnotations(id,isCreate) {
    const response = await findAnnotations(this.props.portfolioDetailsId, "serviceProviderClients"+id);
    let resp = JSON.parse(response.result);
    let annotations = this.state.annotations;
    this.setState({annotations: JSON.parse(response.result)})

    let quotes = [];

    _.each(this.state.annotations, function (value) {
      quotes.push({
        "id": value.annotatorId,
        "text": value.quote.text,
        "quote": value.quote.quote,
        "ranges": value.quote.ranges,
        "userName": value.userName,
        "roleName": value.roleName,
        "profileImage": value.profileImage,
        "createdAt": value.createdAt
      })
    })
    if(quotes && quotes.length>0){
      this.state.content.annotator('loadAnnotations', quotes);
      return response
    }else {
      return response
    }
  }

  async fetchPortfolioStartupDetails() {
    let that = this;
    let portfoliodetailsId = that.props.portfolioDetailsId;
    const response = await fetchServiceProviderPortfolioClients(portfoliodetailsId);
    if (response) {
      this.setState({loading: false, serviceProviderClientsList: response});
      if(response&&response.length>0){
        let about = response&&response[0].clientDescription
        let index = response&&response[0].index
        this.setState({"selectedAbout" : about,"tabIndex":0})
      }
    }else
      this.setState({loading: false})
  }

  onChangeAbout(data,index,e){
    this.setState({"selectedAbout" : data,"tabIndex":index})
    this.fetchAnnotations(index);
  }

  onChangeIndex(e){
    this.fetchAnnotations(0);
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

  render() {
    let that = this;
    let clientsArray = that.state.serviceProviderClientsList || [];
    const showLoader = this.state.loading;
    return (
        <div>
          {showLoader === true ? ( <MlLoader/>) : (
            <div>
            {_.isEmpty(clientsArray)?(
              <div className="portfolio-main-wrap">
                <NoData tabName={this.props.tabName} />
              </div>): (
              <div className="" id="annotatorContent">
              <h2>Clients</h2>
              <div className="main_wrap_scroll">
                
                  <div className="">
                    <div className="col-lg-12" id="show">
                      <div className="row">
                        {clientsArray && clientsArray.map(function (details, idx) {
                          return (
                            <div className="col-lg-2 col-md-4 col-sm-4" key={idx} onClick={that.onChangeIndex.bind(that)}>
                              <div className="list_block">
                                <div className="hex_outer"><img src={details.logo&&generateAbsolutePath(details.logo.fileUrl)}/></div>
                                <h3>{details.companyName && details.companyName}</h3>
                              </div>
                            </div>)
                        })}
                      </div>
                    </div>
                    <div id="details-div" style={{display:'none'}}>
                      <div className="col-lg-12">
                        <div className="row">
                          <div className="top_block_scroller" id="centered">
                            <ul className="topscroll_listblock">
                              {clientsArray && clientsArray.map(function (details, idx) {
                                let description = details.clientDescription ? details.clientDescription : ""
                                let index = details.index ? details.index : ""
                                return (<li key={idx}>
                                  <div className="list_block list_block_intrests notrans"
                                       onClick={that.onChangeAbout.bind(that,description,idx)}>
                                    <div className="hex_outer"><img src={details.logo&&details.logo.fileUrl}/></div>
                                    <h3>{details.companyName && details.companyName}</h3>
                                  </div>
                                </li>)
                              })}

                            </ul>
                          </div>
                        </div>
                      </div>
                      <div className="">
                        <div className="col-lg-12">
                          <div className="row">
                            <div className="investement-view-content">
                              <div className="panel panel-default panel-form-view">
                                <div className="panel-body">
                                  <p>{that.state.selectedAbout ? that.state.selectedAbout : ""}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <br className="brclear"/>
                  </div>
                
              </div>
            </div>)
          }
           </div>
          )
          }
        </div>

      )
    }
}
