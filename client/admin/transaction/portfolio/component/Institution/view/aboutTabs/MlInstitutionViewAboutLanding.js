/**
 * Created by Birendra on 21/8/17.
 */
import React, {Component}  from "react";
import ScrollArea from 'react-scrollbar';
import _ from 'lodash';
var FontAwesome = require('react-fontawesome');
var Rating = require('react-rating');
import MlInstitutionViewAboutusTabs from './MlInstitutionViewAboutusTabs'
import {fetchDetailsInstitutionActionHandler} from '../../../../../portfolio/actions/findPortfolioInstitutionDetails'
import NoData from '../../../../../../../commons/components/noData/noData';
import generateAbsolutePath from '../../../../../../../../lib/mlGenerateAbsolutePath';
import MlTextEditor, { createValueFromString } from "../../../../../../../commons/components/textEditor/MlTextEditor";
export default class MlInstitutionViewAboutLanding extends Component {
  constructor(props) {
    super(props)
    this.state = {aboutInstitution: false, institutionAboutUs: [], institutionAboutUsList: []}
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
    var height  = this.props.isAdmin ? 465 : 535;
    $('.md_scroll').height(WinHeight-($('.'+className).outerHeight(true)+255));
    $('.sm_scroll').height(WinHeight-($('.'+className).outerHeight(true)+height));

    
    var WinWidth = $(window).width();    
    setTimeout (function(){
    $('.main_wrap_scroll').height(WinHeight-($('.'+className).outerHeight(true)+120));
    if(WinWidth > 768){
      $(".main_wrap_scroll").mCustomScrollbar({theme:"minimal-dark"});
    }
  },200);
  }

  componentWillMount() {
    if(FlowRouter.getQueryParam('subtab') && FlowRouter.getQueryParam('tab')==='About'){
      this.setState({aboutInstitution: true});
    }
    const resp = this.fetchPortfolioDetails();
    return resp
  }

  async fetchPortfolioDetails() {
    let that = this;
    let institutionDescription;
    let spDescription;
    let informationDescription;
    let portfoliodetailsId = that.props.portfolioDetailsId;
    const response = await fetchDetailsInstitutionActionHandler(portfoliodetailsId);
    if (response) {
      institutionDescription = createValueFromString(response.aboutUs ? response.aboutUs.institutionDescription : null);
      spDescription = createValueFromString(response.serviceProducts ? response.serviceProducts.spDescription : null);
      informationDescription = createValueFromString(response.information ? response.information.informationDescription : null);
      this.setState({loading: false, institutionAboutUs: response, institutionAboutUsList: response,institutionDescription, spDescription, informationDescription});
    }
  }

  selectedTab(activeTab) {
    this.setState({aboutInstitution: true,activeTab:activeTab})
    this.props.backClickHandler(this.getInstitutionState.bind(this))
  }

  getInstitutionState() {
    this.setState({aboutInstitution: false})
    this.props.backClickHandler();
  }

  render() {
    const { institutionDescription, spDescription, informationDescription } = this.state;
    let aboutUsImages = null;
    let institutionAboutUs = this.state.institutionAboutUs;
    if (institutionAboutUs) {
      let clients = institutionAboutUs.clients;
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
        {this.state.aboutInstitution === false ? (<div className=" portfolio-main-wrap">
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
                     {(<div>{this.state.institutionAboutUs.aboutUs&& this.state.institutionAboutUs.aboutUs.institutionDescription ?
                        <MlTextEditor
                          value={institutionDescription}
                          isReadOnly={true}
                        /> : ((<NoData tabName="aboutUs"/>))}</div>)}
                      {/* {this.state.institutionAboutUs.aboutUs && this.state.institutionAboutUs.aboutUs.institutionDescription?<p>{this.state.institutionAboutUs.aboutUs.institutionDescription}</p>:(<NoData tabName="aboutUs"/>)} */}
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
                      initialRate={this.state.institutionAboutUs.rating && this.state.institutionAboutUs.rating.rating ? Number(this.state.institutionAboutUs.rating.rating) : 4}
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
                    <div className="panel-body">
                      <div className="sm_scroll">
                        <ScrollArea
                          speed={0.8}
                          className="sm_scroll"
                          smoothScrolling={true}
                          default={true}
                        >
                      {aboutUsImages&&aboutUsImages.length?<div>{aboutUsImages}</div>:(<NoData tabName="clients"/>)}
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
                         {(<div>{this.state.institutionAboutUs.serviceProducts && this.state.institutionAboutUs.serviceProducts.spDescription ?
                        <MlTextEditor
                          value={spDescription}
                          isReadOnly={true}
                        /> : (<p></p>)}</div>)}
                          {/* {this.state.institutionAboutUs.serviceProducts && this.state.institutionAboutUs.serviceProducts.spDescription?<p>{this.state.institutionAboutUs.serviceProducts.spDescription}</p>:(<NoData tabName="serviceProducts"/>)} */}
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
                        {(<div>{this.state.institutionAboutUs.information && this.state.institutionAboutUs.information.informationDescription ?
                        <MlTextEditor
                          value={informationDescription}
                          isReadOnly={true}
                        /> : (<NoData tabName="information"/>)}</div>)}
                        {/* {this.state.institutionAboutUs.information && this.state.institutionAboutUs.information.informationDescription?
                          (<ul className="list-info">
                            <li>{this.state.institutionAboutUs.information.informationDescription}</li>
                          </ul>)
                          :
                          (<NoData tabName="information"/>)} */}
                      </ScrollArea>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>) : (<div>{<MlInstitutionViewAboutusTabs getInstitutionState={this.getInstitutionState.bind(this)}
                                                   portfolioDetailsId={this.props.portfolioDetailsId}
                                                   institutionAboutUsDetails={this.state.institutionAboutUs}
                                                   getSelectedAnnotations={this.props.getSelectedAnnotations}
                                                   isApp={this.props.isApp}
                                                    activeTab={this.state.activeTab}></MlInstitutionViewAboutusTabs> }</div>)}
      </div>
    )
  }
};
// getPortfolioInstitutionAboutUsDetails={this.getPortfolioInstitutionAboutUsDetails.bind(this)}
