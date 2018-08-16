import React, { Component, PropTypes }  from "react";
import ScrollArea from "react-scrollbar";
import {fetchCompanyDetailsHandler} from "../../../../actions/findCompanyPortfolioDetails";
import {initalizeFloatLabel} from "../../../../../../utils/formElemUtil";
import {validateUserForAnnotation} from '../../../../actions/findPortfolioIdeatorDetails'
import {initializeMlAnnotator} from '../../../../../../../commons/annotator/mlAnnotator'
import {createAnnotationActionHandler} from '../../../../actions/updatePortfolioDetails'
import {findAnnotations} from '../../../../../../../commons/annotator/findAnnotations'
import NoData from '../../../../../../../commons/components/noData/noData';
import MlLoader from "../../../../../../../commons/components/loader/loader";
import generateAbsolutePath from '../../../../../../../../lib/mlGenerateAbsolutePath';
const KEY = "sectorsAndServices"

export default class MlCompanyViewSectors extends Component{
  constructor(props, context){
    super(props);
    this.state={
      // sectorsAndServices:{},
      content:{},
      loading: true
    }
    this.fetchPortfolioDetails.bind(this);
    this.viewDetails.bind(this)
    this.showDetails.bind(this)
    this.createAnnotations.bind(this);
    this.fetchAnnotations.bind(this);
    this.initalizeAnnotaor.bind(this);
    this.annotatorEvents.bind(this);
    this.validateUserForAnnotation(this)
    return this;
  }

  componentWillMount(){
    let res = this.validateUserForAnnotation();
    let resp = this.fetchPortfolioDetails();
    return resp
  }

  componentDidMount(){
    var WinHeight = $(window).height();
    $('.main_wrap_scroll ').height(WinHeight-(68+$('.admin_header').outerHeight(true)));
    initalizeFloatLabel();
  }

  async fetchPortfolioDetails() {
    let that = this;
    let portfolioDetailsId=that.props.portfolioDetailsId;
      const response = await fetchCompanyDetailsHandler(portfolioDetailsId, KEY);
      if (response && response.sectorsAndServices) {
        var object = response.sectorsAndServices;
        this.setState({loading: false,sectorsAndServicesList: object});
      }else{
        this.setState({loading:false})
      }
    const privateFields = response && response.privateFields&&response.privateFields.length?response.privateFields:[]
    _.each(privateFields, function (pf) {
      $("#"+pf.booleanKey).removeClass('un_lock fa-unlock').addClass('fa-lock')
    })
  }
  viewDetails(id, e) {
    this.setState({loading: true})
    let data = this.state.sectorsAndServicesList;
    let getData = data[id];
    let subDomain =getData.subDomainName
    this.setState({loading: false, viewCurDetail: subDomain});
  }
  showDetails(id){
    $("#details-div").show();
    var $frame = $('#forcecentered');
    var $wrap = $frame.parent();
    // Call Sly on frame
    $frame.sly({
      horizontal: 1,
      itemNav: 'forceCentered',
      smart: 1,
      activateOn: 'click',
      mouseDragging: 1,
      touchDragging: 1,
      releaseSwing: 1,
      startAt: 0,
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
    this.viewDetails(id)
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
    let details = {portfolioId:this.props.portfolioDetailsId, docId:"companySectorsAndServices", quote:JSON.stringify(annotation)}
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
      this.setState({isUserValidForAnnotation:response})

      this.initalizeAnnotaor()

      this.fetchAnnotations();
    }
  }

  async fetchAnnotations(isCreate){
    const response = await findAnnotations(this.props.portfolioDetailsId, "companySectorsAndServices");
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
    const showLoader = that.state.loading;
    let sectorsAndServicesArray = that.state.sectorsAndServicesList || [];
    if(_.isEmpty(sectorsAndServicesArray)){
      return (
        showLoader === true ? (<MlLoader/>) :
          <div className="portfolio-main-wrap">
            <NoData tabName={this.props.tabName} />
          </div>
      )
    } else {
      return (
        <div>
          {showLoader === true ? (<MlLoader/>) : (
            <div className="admin_padding_wrap">
              <h2>Area of Interest</h2>
              <div className="requested_input main_wrap_scroll">

                <ScrollArea
                  speed={0.8}
                  className="main_wrap_scroll"
                  smoothScrolling={true}
                  default={true}
                >
                  <div className="col-lg-12" id="show">
                    <div className="row">

                      {sectorsAndServicesArray && sectorsAndServicesArray.map(function (say, value) {
                        return (<div className="col-lg-2 col-md-3 col-sm-4" key={value} onClick={that.showDetails.bind(that,value)}>
                          <div className="list_block list_block_intrests notrans">
                            <div className="hex_outer">
                              <img src={say.logo && say.logo.fileUrl? generateAbsolutePath(say.logo.fileUrl) : "/images/def_profile.png"} />
                            </div>
                            <h3>{say.industryTypeName}</h3>
                          </div>
                        </div>)
                      })}
                    </div>
                  </div>

                </ScrollArea>

              </div>
              <div id="details-div" style={{display: 'none'}}>
                <div className="col-lg-12">
                  <div className="row">

                    <div className="top_block_scroller" id="forcecentered">
                      <ul className="topscroll_listblock">
                        {sectorsAndServicesArray && sectorsAndServicesArray.map(function (say, value) {
                          return (<li key={value} className="active">
                            <div className="list_block list_block_intrests notrans"
                                 onClick={that.viewDetails.bind(that, value)}>
                              <div className="hex_outer">
                                <img src={say.logo && say.logo.fileUrl? generateAbsolutePath(say.logo.fileUrl) : "/images/def_profile.png"}/>
                              </div>
                              <h3>{say.industryTypeName}</h3>
                            </div>
                          </li>)
                        })}
                      </ul>
                    </div>
                  </div>

                </div>
                <div className="main_wrap_scroll">
                  <ScrollArea
                    speed={0.8}
                    className="main_wrap_scroll"
                    smoothScrolling={true}
                    default={true}
                  >

                    <div className="col-lg-12">
                      <div className="row">
                        <div className="investement-view-content">
                          <div className="panel panel-default panel-form-view">
                            <div className="panel-body">
                              <p>Domain : {this.state.viewCurDetail}</p>
                            </div>
                          </div>

                        </div>
                      </div>
                    </div>
                  </ScrollArea>
                </div>
              </div>
            </div>)}
        </div>
      )
    }
  }
}
// const showLoader = this.state.loading;
// return (
//   <div>
//     {showLoader === true ? ( <MlLoader/>) : (
//       <div className="col-lg-12 col-sm-12" id="annotatorContent">
//         <div className="row">
//           <h2>Sectors And Services</h2>
//           <div className="panel panel-default panel-form-view">
//
//             <div className="panel-body">
//               <p>{this.state.sectorsAndServices && this.state.sectorsAndServices.sectorsAndServicesDescription ? this.state.sectorsAndServices.sectorsAndServicesDescription
//                 :  <div className="portfolio-main-wrap">
//                   <NoData tabName={this.props.tabName}/>
//                 </div>
//               }  </p>
//
//             </div>
//           </div>
//         </div>
//       </div>
//     )
//     }
//   </div>
// )
