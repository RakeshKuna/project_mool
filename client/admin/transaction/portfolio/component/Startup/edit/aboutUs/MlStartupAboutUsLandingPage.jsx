import React, {Component, PropTypes} from "react";
import ScrollArea from 'react-scrollbar';
import _ from 'lodash';

var FontAwesome = require('react-fontawesome');
var Select = require('react-select');
var Rating = require('react-rating');
import {setTimeout} from "timers";
import MlStartupAboutUsTabs from './MlPortfolioStartupAboutsUsTabs'
import {fetchDetailsStartupActionHandler} from '../../../../actions/findPortfolioStartupDetails'
import generateAbsolutePath from '../../../../../../../../lib/mlGenerateAbsolutePath';
import MlTextEditor, {createValueFromString} from "../../../../../../../commons/components/textEditor/MlTextEditor";

export default class MlStartupAboutUsLandingPage extends Component {
  constructor(props) {
    // console.log('LOG from MlStartupAboutUsLandingPage');
    super(props)
    this.state = {aboutStartup: false, startupAboutUs: [], startupAboutUsList: []}
    this.fetchPortfolioDetails.bind(this);
    this.selectedTab = this.selectedTab.bind(this);
  }

  selectedTab(activeTab) {
    this.setState({aboutStartup: true, activeTab: activeTab})
    this.props.backClickHandler(this.getStartUpState.bind(this))
  }

  getPortfolioStartupAboutUsDetails(details, tabName, privateKey, requiredFields) {
    this.props.getAboutus(details, tabName, privateKey, requiredFields);
  }

  componentDidMount() {
    var className = this.props.isAdmin ? "admin_header" : "app_header";
    var WinHeight = $(window).height();
    var WinWidth = $(window).width();
    var height = this.props.isAdmin ? 465 : 535;
    $('.md_scroll').height(WinHeight - ($('.' + className).outerHeight(true) + 255));
    $('.sm_scroll').height(WinHeight - ($('.' + className).outerHeight(true) + height));
    setTimeout(function () {
      $('.main_wrap_scroll').height(WinHeight - ($('.' + className).outerHeight(true) + 120));
      if (WinWidth > 768) {
        $(".main_wrap_scroll").mCustomScrollbar({theme: "minimal-dark"});
      }
    }, 100);
  }

  componentWillMount() {
    if (FlowRouter.getQueryParam('subtab') && FlowRouter.getQueryParam('tab') === 'About') {
      this.setState({aboutStartup: true});
    }
    const resp = this.fetchPortfolioDetails();
    return resp
  }

  async fetchPortfolioDetails() {
    let startupDescription;
    let spDescription;
    let informationDescription;
    const portfoliodetailsId = this.props.portfolioDetailsId;
    const response = await fetchDetailsStartupActionHandler(portfoliodetailsId);
    if (response) {
      startupDescription = createValueFromString(response.aboutUs ? response.aboutUs.startupDescription : null);
      spDescription = createValueFromString(response.serviceProducts ? response.serviceProducts.spDescription : null);
      informationDescription = createValueFromString(response.information ? response.information.informationDescription : null);
      this.setState({
        loading: false,
        startupAboutUs: response,
        startupAboutUsList: response,
        startupDescription,
        spDescription,
        informationDescription
      });
    }
  }

  getStartUpState() {
    this.setState({aboutStartup: false})
    this.props.backClickHandler();
  }

  render() {
    let aboutUsImages = null;
    let startupAboutUs = this.state.startupAboutUs;
    const {startupDescription, spDescription, informationDescription} = this.state;
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
            return (<img src={generateAbsolutePath(items.fileUrl)} key={id}/>)

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
                  name='ellipsis-h' onClick={e => this.selectedTab('About Us')}/></a></div>
                <div className="panel-body">
                  <div className="md_scroll">
                    <ScrollArea
                      speed={0.8}
                      className="md_scroll"
                      smoothScrolling={true}
                      default={true}
                    >
                      {(
                        <div>{this.state.startupAboutUs.aboutUs && this.state.startupAboutUs.aboutUs.startupDescription ?
                          <MlTextEditor
                            value={startupDescription}
                            isReadOnly={true}
                          /> : (<p></p>)}</div>)}
                      {/* <p>{this.state.startupAboutUs.aboutUs&&this.state.startupAboutUs.aboutUs.startupDescription}</p> */}
                    </ScrollArea>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-sm-6 nopadding-right">
              <div className="panel panel-default panel-form-view">
                <div className="panel-heading ">Rating <a href="" className="pull-right ellipsis-menu"><FontAwesome
                  name='ellipsis-h' onClick={e => this.selectedTab('Rating')}/></a></div>
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
                      name='ellipsis-h' onClick={e => this.selectedTab('Client')}/></a></div>
                    <div className="panel-body">
                      <div className="sm_scroll">
                        <ScrollArea
                          speed={0.8}
                          className="sm_scroll"
                          smoothScrolling={true}
                          default={true}
                        >
                          {aboutUsImages}
                        </ScrollArea>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-12 nopadding">
                  <div className="panel panel-default panel-form-view">
                    <div className="panel-heading">Service & Products <a href=""
                                                                         className="pull-right ellipsis-menu"><FontAwesome
                      name='ellipsis-h' onClick={e => this.selectedTab('Services And Products')}/></a></div>
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
                              <p></p>
                            </div>}
                          {/* <p>{this.state.startupAboutUs.serviceProducts&&this.state.startupAboutUs.serviceProducts.spDescription}</p> */}
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
                    name='ellipsis-h' onClick={e => this.selectedTab('Information')}/></a></div>
                  <div className="panel-body">
                    <div className="sm_scroll">
                      <ScrollArea
                        speed={0.8}
                        className="sm_scroll"
                        smoothScrolling={true}
                        default={true}
                      >
                        <ul className="list-info">
                          {this.state.startupAboutUs.information && this.state.startupAboutUs.information.informationDescription ?
                            <MlTextEditor
                              value={informationDescription}
                              isReadOnly={true}
                            /> :
                            <div className="portfolio-main-wrap">
                              <p></p>
                            </div>}
                          {/* <li>{this.state.startupAboutUs.information&&this.state.startupAboutUs.information.informationDescription}</li> */}
                        </ul>
                      </ScrollArea>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>) : (<div>{<MlStartupAboutUsTabs getStartUpState={this.getStartUpState.bind(this)}
                                               getPortfolioStartupAboutUsDetails={this.getPortfolioStartupAboutUsDetails.bind(this)}
                                               portfolioDetailsId={this.props.portfolioDetailsId}
                                               startupAboutUsDetails={this.state.startupAboutUs}
                                               isApp={this.props.isApp}
                                               activeTab={this.state.activeTab}></MlStartupAboutUsTabs>}</div>)}
      </div>

    )
  }
};
