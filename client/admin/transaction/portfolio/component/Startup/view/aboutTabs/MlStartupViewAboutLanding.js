/**
 * Created by vishwadeep on 21/8/17.
 */
import React, {Component}  from "react";
import {render} from 'react-dom';
import ScrollArea from 'react-scrollbar';
import _ from 'lodash';
var FontAwesome = require('react-fontawesome');
var Rating = require('react-rating');
import MlStartupViewAboutusTabs from './MlStartupViewAboutusTabs'
import {fetchDetailsStartupActionHandler} from '../../../../../portfolio/actions/findPortfolioStartupDetails'
import NoData from '../../../../../../../commons/components/noData/noData';
import generateAbsolutePath from '../../../../../../../../lib/mlGenerateAbsolutePath';
import MlTextEditor, { createValueFromString } from "../../../../../../../commons/components/textEditor/MlTextEditor";
export default class MlStartupViewAboutLanding extends Component {
  constructor(props) {
    super(props)
    this.state = {aboutStartup: false, startupAboutUs: [], startupAboutUsList: []}
    this.fetchPortfolioDetails.bind(this);
    this.selectedTab=this.selectedTab.bind(this);
  }



  // getPortfolioStartupAboutUsDetails(details, tabName, privateKey) {
    // this.props.getAboutus(details, tabName, privateKey);
  // }

  componentDidMount()
  {
    var className = this.props.isAdmin ? "admin_header" : "app_header";
    var WinHeight = $(window).height();
    var WinWidth = $(window).width();
    var height  = this.props.isAdmin ? 465 : 535;
    $('.md_scroll').height(WinHeight-($('.'+className).outerHeight(true)+255));
    $('.sm_scroll').height(WinHeight-($('.'+className).outerHeight(true)+height));
  }
  
  componentDidUpdate(){
    var WinHeight = $(window).height();
    var WinWidth = $(window).width();
    var className = this.props.isAdmin ? "admin_header" : "app_header";
    setTimeout(function(){
      $('.main_wrap_scroll').height(WinHeight-($('.'+className).outerHeight(true)+120));
      if(WinWidth > 768){
        $(".main_wrap_scroll").mCustomScrollbar({theme:"minimal-dark"});
      }
    },500);
  }

  componentWillMount() {
    if(FlowRouter.getQueryParam('subtab') && FlowRouter.getQueryParam('tab')==='About'){
      this.setState({aboutStartup: true});
    }
    const resp = this.fetchPortfolioDetails();
    return resp;
  }

  async fetchPortfolioDetails() {
    let that = this;
    let startupDescription;
    let spDescription;
    let informationDescription;
    let portfoliodetailsId = that.props.portfolioDetailsId;
    const response = await fetchDetailsStartupActionHandler(portfoliodetailsId);
    if (response) {
      startupDescription = createValueFromString(response.aboutUs ? response.aboutUs.startupDescription : null);
      spDescription = createValueFromString(response.serviceProducts ? response.serviceProducts.spDescription : null);
      informationDescription = createValueFromString(response.information ? response.information.informationDescription : null);
      this.setState({loading: false, startupAboutUs: response, startupAboutUsList: response,startupDescription, spDescription, informationDescription});
    }
  }

  selectedTab(activeTab) {
    this.setState({aboutStartup: true,activeTab:activeTab})
    this.props.backClickHandler(this.getStartUpState.bind(this))
  }

  getStartUpState() {
    this.setState({aboutStartup: false})
    this.props.backClickHandler();
  }

  render() {
    let aboutUsImages = null;
    const { startupDescription, spDescription, informationDescription } = this.state;
    let startupAboutUs = this.state.startupAboutUs;
    if (startupAboutUs) {
      let clients = startupAboutUs.clients;
      if (clients) {
        let logos = []
        _.map(clients, function (client) {
          if (client.logo) {
            logos.push(client.logo)
          }
        })
        if (logos.length > 0) {
          aboutUsImages = logos.map(function (items, id) {
            return ( <img src={generateAbsolutePath(items.fileUrl)} key={id}/>)

          })
        }
      }
    }
    return (
      <div>
        {this.state.aboutStartup === false ? (<div className=" portfolio-main-wrap">
          <h2>Portfolio</h2>
          <div className="main_wrap_scroll">
            <div className="col-md-6 col-sm-6 nopadding">
              <div className="panel panel-default panel-form-view">
                <div className="panel-heading">About Us<a href="" className="pull-right ellipsis-menu"><FontAwesome
                  name='ellipsis-h' onClick={e=>this.selectedTab('About Us')}/></a></div>
                <div className="panel-body">
                  <div className="md_scroll">
                    <ScrollArea
                      speed={0.8}
                      className="md_scroll"
                      smoothScrolling={true}
                      default={true}
                    >
                    {(<div>{this.state.startupAboutUs.aboutUs && this.state.startupAboutUs.aboutUs.startupDescription ?
                        <MlTextEditor
                          value={startupDescription}
                          isReadOnly={true}
                        /> : (<NoData tabName="aboutUs"/>)}</div>)}
                      {/* {this.state.startupAboutUs.aboutUs && this.state.startupAboutUs.aboutUs.startupDescription?<p>{this.state.startupAboutUs.aboutUs.startupDescription}</p>: (<NoData tabName="aboutUs"/>)} */}
                    </ScrollArea>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-sm-6 nopadding-right">
              <div className="panel panel-default panel-form-view">
                <div className="panel-heading ">Rating <a href="" className="pull-right ellipsis-menu"><FontAwesome
                  name='ellipsis-h' onClick={e=>this.selectedTab('Rating')}/></a></div>
                <div className="panel-body rating_small">
                  <div className="star_ratings">
                    <Rating
                      empty="fa fa-star-o empty"
                      full="fa fa-star fill"
                      fractions={2}
                      initialRate={this.state.startupAboutUs.rating && this.state.startupAboutUs.rating.rating ? Number(this.state.startupAboutUs.rating.rating) : 4}
                      readonly={true}
                    />
                  </div>
                </div>
              </div>
              <div className="clearfix"></div>
              <div className="col-md-6 col-sm-6 nopadding-left">
                <div className="col-md-12 nopadding">
                  <div className="panel panel-default panel-form-view">
                    <div className="panel-heading">Clients <a href="" className="pull-right ellipsis-menu"><FontAwesome
                      name='ellipsis-h' onClick={e=>this.selectedTab('Clients')}/></a></div>
                    <div className="panel-body text-center">
                      <div className="sm_scroll">
                        <ScrollArea
                          speed={0.8}
                          className="sm_scroll"
                          smoothScrolling={true}
                          default={true}
                        >
                      {aboutUsImages && aboutUsImages.length?<div>{aboutUsImages}</div>:(<NoData tabName="Clients"/>)}
                        </ScrollArea>
                    </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-12 nopadding">
                  <div className="panel panel-default panel-form-view">
                    <div className="panel-heading">Service & Products <a href=""
                                                                         className="pull-right ellipsis-menu"><FontAwesome
                      name='ellipsis-h' onClick={e=>this.selectedTab('Services And Products')}/></a></div>
                    <div className="panel-body">
                        <div className="sm_scroll">
                          <ScrollArea
                            speed={0.8}
                            className="sm_scroll"
                            smoothScrolling={true}
                            default={true}
                          >
                           {this.state.startupAboutUs.serviceProducts && this.state.startupAboutUs.serviceProducts.spDescription ?
                          <MlTextEditor
                            value={spDescription}
                            isReadOnly={true}
                          /> :
                          <div className="portfolio-main-wrap">
                           <NoData tabName="serviceProducts"/>
                          </div>}
                            {/* {this.state.startupAboutUs.serviceProducts && this.state.startupAboutUs.serviceProducts.spDescription?<p>{this.state.startupAboutUs.serviceProducts.spDescription}</p>:(<NoData tabName="serviceProducts"/>)} */}
                          </ScrollArea>
                        </div>
                      </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-sm-6 nopadding">
                <div className="panel panel-default panel-form-view">
                  <div className="panel-heading">Information <a href=""
                                                                className="pull-right ellipsis-menu"><FontAwesome
                    name='ellipsis-h' onClick={e=>this.selectedTab('Information')}/></a></div>
                  <div className="panel-body">
                    <div className="sm_scroll">
                      <ScrollArea
                        speed={0.8}
                        className="sm_scroll"
                        smoothScrolling={true}
                        default={true}
                      >
                       {this.state.startupAboutUs.information && this.state.startupAboutUs.information.informationDescription ?
                          <MlTextEditor
                            value={informationDescription}
                            isReadOnly={true}
                          /> :
                          <div className="portfolio-main-wrap">
                            <NoData tabName="information"/>
                          </div>}
                        {/* {this.state.startupAboutUs.information && this.state.startupAboutUs.information.informationDescription?
                          <ul className="list-info">
                            <li>{this.state.startupAboutUs.information.informationDescription}</li>
                          </ul>
                          :(<NoData tabName="information"/>)} */}
                      </ScrollArea>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>) : (<div>{<MlStartupViewAboutusTabs getStartUpState={this.getStartUpState.bind(this)}
                                                   portfolioDetailsId={this.props.portfolioDetailsId}
                                                   startupAboutUsDetails={this.state.startupAboutUs}
                                                   getSelectedAnnotations={this.props.getSelectedAnnotations}
                                                   isApp={this.props.isApp}
                                                    activeTab={this.state.activeTab}></MlStartupViewAboutusTabs> }</div>)}
      </div>
    )
  }
};
// getPortfolioStartupAboutUsDetails={this.getPortfolioStartupAboutUsDetails.bind(this)}
