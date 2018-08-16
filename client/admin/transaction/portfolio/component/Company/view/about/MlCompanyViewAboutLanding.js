/**
 * Created by Birendra on 21/8/17.
 */
import React, {Component}  from "react";
import ScrollArea from 'react-scrollbar';
import _ from 'lodash';
var FontAwesome = require('react-fontawesome');
var Rating = require('react-rating');
import MlCompanyViewAboutusTabs from './MlCompanyViewAboutusTabs'
import {fetchDetailsCompanyActionHandler} from '../../../../../portfolio/actions/findCompanyPortfolioDetails'
import NoData from '../../../../../../../commons/components/noData/noData';
import MlTextEditor, { createValueFromString } from "../../../../../../../commons/components/textEditor/MlTextEditor";
import generateAbsolutePath from '../../../../../../../../lib/mlGenerateAbsolutePath';

export default class MlCompanyViewAboutLanding extends Component {
  constructor(props) {
    super(props)
    this.state = {aboutCompany: false, aboutUs: [], aboutUsList: []}
    this.fetchPortfolioDetails.bind(this);
    this.selectedTab=this.selectedTab.bind(this);
  }



  // getPortfolioInstitutionAboutUsDetails(details, tabName, privateKey) {
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
    setTimeout (function(){
    $('.main_wrap_scroll').height(WinHeight-($('.'+className).outerHeight(true)+120));
    if(WinWidth > 768){
    $(".main_wrap_scroll").mCustomScrollbar({theme:"minimal-dark"});
    }
    },200);
  }

  componentWillMount() {
    if(FlowRouter.getQueryParam('subtab') && FlowRouter.getQueryParam('tab')==='About'){
      this.setState({aboutCompany: true});
    }
    const resp = this.fetchPortfolioDetails();
    return resp
  }

  async fetchPortfolioDetails() {
    let that = this;
    let companyDescription;
    let spDescription;
    let informationDescription;
    let portfoliodetailsId = that.props.portfolioDetailsId;
    const response = await fetchDetailsCompanyActionHandler(portfoliodetailsId);
    if (response) {
      companyDescription = createValueFromString(response.aboutUs ? response.aboutUs.companyDescription : null);
      spDescription = createValueFromString(response.serviceProducts ? response.serviceProducts.spDescription : null);
      informationDescription = createValueFromString(response.information ? response.information.informationDescription : null);
      this.setState({loading: false, aboutUs: response, aboutUsList: response,companyDescription, spDescription, informationDescription});
    }
  }

  selectedTab(activeTab) {
    this.setState({aboutCompany: true,activeTab:activeTab})
    this.props.backClickHandler(this.getInstitutionState.bind(this))
  }

  getInstitutionState() {
    this.setState({aboutCompany: false})
    this.props.backClickHandler();
  }

  render() {
    let aboutUsImages = null;
    const { companyDescription, spDescription, informationDescription } = this.state;
    let aboutUs = this.state.aboutUs;
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
            return ( <img src={generateAbsolutePath(items.fileUrl)} key={id}/>)

          })
        }
      }
    }
    return (
      <div>
        {this.state.aboutCompany === false ? (<div className=" portfolio-main-wrap">
         <h2>Portfolio</h2>
         <div className="main_wrap_scroll">
            <div className="col-md-6 col-sm-6 nopadding">
              <div className="panel panel-default panel-form-view">
                <div className="panel-heading">About Us<a href="" className="pull-right ellipsis-menu"><FontAwesome
                  name='ellipsis-h' onClick={(e)=>this.selectedTab('About Us')}/></a></div>
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
                        /> : (<NoData tabName="aboutUs"/>)}</div>)}
                  {/* {this.state.aboutUs.aboutUs && this.state.aboutUs.aboutUs.companyDescription?<p>{this.state.aboutUs.aboutUs.companyDescription}</p>:(<NoData tabName="aboutUs"/>)} */}
                    </ScrollArea>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-sm-6 nopadding-right">
              <div className="panel panel-default panel-form-view">
                <div className="panel-heading ">Rating <a href="" className="pull-right ellipsis-menu"><FontAwesome
                  name='ellipsis-h' onClick={(e)=>this.selectedTab('Rating')}/></a></div>
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
                      name='ellipsis-h' onClick={(e)=>this.selectedTab('Clients')}/></a></div>
                    <div className="panel-body">
                      <div className="sm_scroll">
                        <ScrollArea
                          speed={0.8}
                          className="sm_scroll"
                          smoothScrolling={true}
                          default={true}
                        >
                      {aboutUsImages && aboutUsImages.length?<div>{aboutUsImages}</div>:(<NoData tabName="clients"/>)}
                        </ScrollArea>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-12 nopadding">
                  <div className="panel panel-default panel-form-view">
                    <div className="panel-heading">Service & Products <a href=""
                                                                         className="pull-right ellipsis-menu"><FontAwesome
                      name='ellipsis-h' onClick={(e)=>this.selectedTab('Services And Products')}/></a></div>
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
                          <NoData tabName="serviceProducts"/>
                          </div>}
                          {/* {this.state.aboutUs.serviceProducts && this.state.aboutUs.serviceProducts.spDescription?<p>{this.state.aboutUs.serviceProducts.spDescription}</p>:(<NoData tabName="serviceProducts"/>)} */}
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
                    name='ellipsis-h' onClick={(e)=>this.selectedTab('Information')}/></a></div>
                  <div className="panel-body">
                    <div className="sm_scroll">
                      <ScrollArea
                        speed={0.8}
                        className="sm_scroll"
                        smoothScrolling={true}
                        default={true}
                      >
                        {this.state.aboutUs.information && this.state.aboutUs.information.informationDescription ?
                          <MlTextEditor
                            value={informationDescription}
                            isReadOnly={true}
                          /> :
                          <div className="portfolio-main-wrap">
                          <NoData tabName="information"/>
                          </div>}
                        {/* {this.state.aboutUs.information && this.state.aboutUs.information.informationDescription?
                          (<ul className="list-info">
                            <li>{this.state.aboutUs.information.informationDescription}</li>
                          </ul>)
                          :(<NoData tabName="information"/>)} */}
                    <ul className="list-info">
                      <li></li>
                    </ul>
                      </ScrollArea>
                    </div>
                  </div>
                </div>
              </div>

            </div>
            </div>
        </div>) : (<div>{<MlCompanyViewAboutusTabs getInstitutionState={this.getInstitutionState.bind(this)}
                                                   portfolioDetailsId={this.props.portfolioDetailsId}
                                                   institutionAboutUsDetails={this.state.aboutUs}
                                                   getSelectedAnnotations={this.props.getSelectedAnnotations}
                                                   activeTab={this.state.activeTab || null}
                                                   isApp={this.props.isApp}></MlCompanyViewAboutusTabs> }</div>)}
      </div>
    )
  }
};
// getPortfolioInstitutionAboutUsDetails={this.getPortfolioInstitutionAboutUsDetails.bind(this)}
