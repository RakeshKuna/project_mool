import React, {Component, PropTypes} from "react";
import ScrollArea from 'react-scrollbar';
import {dataVisibilityHandler, OnLockSwitch} from '../../../../../../utils/formElemUtil';
import _ from 'lodash';

var FontAwesome = require('react-fontawesome');
var Rating = require('react-rating');
import MlPortfolioCompanyAboutsUsTabs from './MlPortfolioCompanyAboutsUsTabs'
import {fetchDetailsCompanyActionHandler} from '../../../../actions/findCompanyPortfolioDetails'
import generateAbsolutePath from '../../../../../../../../lib/mlGenerateAbsolutePath';
import MlTextEditor, {createValueFromString} from "../../../../../../../commons/components/textEditor/MlTextEditor";

export default class MlCompanyAboutUsLandingPage extends Component {
  constructor(props) {
    super(props);
    this.state = {aboutUsCompany: false, aboutUs: [], aboutUsList: []}
    this.fetchPortfolioDetails.bind(this);
    this.selectedTab = this.selectedTab.bind(this);
  }

  selectedTab(activeTab) {
    this.setState({aboutUsCompany: true, activeTab: activeTab})
    this.props.backClickHandler(this.getState.bind(this))
  }

  getPortfolioAboutUsDetails(details, tabName, privateKey, requiredFields) {
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
    }, 500);
  }

  componentWillMount() {
    if (FlowRouter.getQueryParam('subtab') && FlowRouter.getQueryParam('tab') === 'About') {
      this.setState({aboutUsCompany: true});
    }
    this.fetchPortfolioDetails();
  }

  async fetchPortfolioDetails() {
    let that = this;
    let companyDescription;
    let spDescription;
    let informationDescription;
    const portfoliodetailsId = that.props.portfolioDetailsId;
    const response = await fetchDetailsCompanyActionHandler(portfoliodetailsId);
    if (response) {
      companyDescription = createValueFromString(response.aboutUs ? response.aboutUs.companyDescription : null);
      spDescription = createValueFromString(response.serviceProducts ? response.serviceProducts.spDescription : null);
      informationDescription = createValueFromString(response.information ? response.information.informationDescription : null);
      this.setState({
        loading: false,
        aboutUs: response,
        aboutUsList: response,
        companyDescription,
        spDescription,
        informationDescription
      });
    }
  }

  getState() {
    this.setState({aboutUsCompany: false})
    //$('.last-item').removeClass('menunone');
    this.props.backClickHandler();

  }

  render() {
    let aboutUsImages = null;
    let aboutUs = this.state.aboutUs;
    const {companyDescription, spDescription, informationDescription} = this.state;
    if (aboutUs) {
      let clients = aboutUs.clients;
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
        {this.state.aboutUsCompany === false ? (<div className=" portfolio-main-wrap">
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
                      {(<div>{this.state.aboutUs.aboutUs && this.state.aboutUs.aboutUs.companyDescription ?
                        <MlTextEditor
                          value={companyDescription}
                          isReadOnly={true}
                        /> : (<p></p>)}</div>)}

                      {/* <p>{this.state.aboutUs.aboutUs&&this.state.aboutUs.aboutUs.companyDescription}</p> */}
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
                      initialRate={this.state.aboutUs.rating && this.state.aboutUs.rating.rating ? Number(this.state.aboutUs.rating.rating) : 0}
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
                          {this.state.aboutUs.serviceProducts && this.state.aboutUs.serviceProducts.spDescription ?
                            <MlTextEditor
                              value={spDescription}
                              isReadOnly={true}
                            /> :
                            <div className="portfolio-main-wrap">
                              <p></p>
                            </div>}
                          {/* <p>{this.state.aboutUs.serviceProducts&&this.state.aboutUs.serviceProducts.spDescription}</p> */}
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
                          {this.state.aboutUs.information && this.state.aboutUs.information.informationDescription ?
                            <MlTextEditor
                              value={informationDescription}
                              isReadOnly={true}
                            /> :
                            <div className="portfolio-main-wrap">
                              <p></p>
                            </div>}
                          {/* <li>{this.state.aboutUs.information&&this.state.aboutUs.information.informationDescription}</li> */}
                        </ul>
                      </ScrollArea>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>) : (<div>{<MlPortfolioCompanyAboutsUsTabs getState={this.getState.bind(this)}
                                                         getPortfolioAboutUsDetails={this.getPortfolioAboutUsDetails.bind(this)}
                                                         portfolioDetailsId={this.props.portfolioDetailsId}
                                                         aboutUsDetails={this.state.aboutUs} isApp={this.props.isApp}
                                                         activeTab={this.state.activeTab || null}></MlPortfolioCompanyAboutsUsTabs>}</div>)}
      </div>
    )
  }
};
