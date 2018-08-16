import React, {Component, PropTypes}  from "react";
import {render} from "react-dom";
import MlTabComponent from "../../../../../../commons/components/tabcomponent/MlTabComponent";
import _ from 'lodash'
import omitDeep from 'omit-deep-lodash';
import MlFunderAbout from './MlFunderAbout'
import MlFunderAreaOfInterest from './MlFunderAreaOfInterest'
import MlFunderEngagementMethod from './MlFunderEngagementMethod'
import MlFunderInvestment from './MlFunderInvestment'
import PortfolioLibrary from '../../../../../../commons/components/portfolioLibrary/PortfolioLibrary'
import MlFunderNews from './MlFunderNews'
import MlFunderPrincipalTeam from './MlFunderPrincipalTeam'
import MlFunderSuccessStories from './MlFunderSuccessStories'
import MlFunderServices from './MlFunderServices'
import MlFunderLookingFor from './MlFunderLookingFor'
import {client} from '../../../../../core/apolloConnection'

export default class MlFunderEditTemplate extends Component {
  constructor(props) {
    super(props)
    this.state = {tabs: [], aboutUs: {}, funderPortfolio: {}, portfolioKeys: {privateKeys: [], removePrivateKeys: [],activeTab:'About'}};
    this.getChildContext.bind(this)
    this.getInvestmentsDetails.bind(this);
    this.getFunderNewsDetails.bind(this);
  }

  getChildContext() {
    return {
      funderPortfolio: this.state.funderPortfolio,
      portfolioKeys: this.state.portfolioKeys
    }
  }

  componentDidMount() {
    setTimeout(function () {
      $('div[role="tab"]').each(function (index) {
        var test = $(this).text();
        $(this).empty();
        $(this).html('<div class="moolya_btn moolya_btn_in">' + test + '</div>');
      });
      $('.RRT__tabs').addClass('horizon-swiper');
      $('.RRT__tab').addClass('horizon-item');
      $('.horizon-swiper').horizonSwiper();
    }, 300);
  }

  getTabComponents() {
    let tabs = [
      {
        tabClassName: 'tab',
        panelClassName: 'panel',
        title: "About",
        name: "About",
        component: <MlFunderAbout client={client} tabName="funderAbout" isAdmin={true} key="1"
                                  getAboutus={this.getAboutus.bind(this)}
                                  portfolioDetailsId={this.props.portfolioDetailsId}/>
      },
      {
        tabClassName: 'tab',
        panelClassName: 'panel',
        title: "Investments",
        name: "Investments",
        component: <MlFunderInvestment key="2" tabName="investments" isAdmin={true}
                                       getInvestmentsDetails={this.getInvestmentsDetails.bind(this)}
                                       portfolioDetailsId={this.props.portfolioDetailsId}/>
      },
      {
        tabClassName: 'tab',
        panelClassName: 'panel',
        title: "Principals & Team",
        name: "Principals And Team",
        component: <MlFunderPrincipalTeam client={client} tabName="Principals & Team" key="3" isAdmin={true}
                                          getPrincipalDetails={this.getPrincipalDetails.bind(this)}
                                          getTeamDetails={this.getTeamDetails.bind(this)}
                                          portfolioDetailsId={this.props.portfolioDetailsId}/>
      },
      {
        tabClassName: 'tab',
        panelClassName: 'panel',
        title: "Engagement Methods",
        name: "Engagement Methods",
        component: <MlFunderEngagementMethod key="4" tabName="Engagement Methods"
                                             portfolioDetailsId={this.props.portfolioDetailsId}/>
      },
      {
        tabClassName: 'tab',
        panelClassName: 'panel',
        title: "Areas Of Interest",
        name: "Areas Of Interest",
        component: <MlFunderAreaOfInterest key="6" tabName="areaOfInterest" isAdmin={true}
                                           getAreaOfInterestDetails={this.getAreaOfInterestDetails.bind(this)}
                                           portfolioDetailsId={this.props.portfolioDetailsId}/>
      },
      {
        tabClassName: 'tab',
        panelClassName: 'panel',
        title: "Success Stories",
        name: "Success Stories",
        component: <MlFunderSuccessStories key="7" tabName="successStories" client={client} isAdmin={true}
                                           getSuccessStoriesDetails={this.getSuccessStoriesDetails.bind(this)}
                                           portfolioDetailsId={this.props.portfolioDetailsId}/>
      },
      {
        tabClassName: 'tab',
        panelClassName: 'panel',
        title: "Library",
        name: "Library",
        component: <PortfolioLibrary key="8" client={client} tabName="Library" isAdmin={true}
                                     portfolioDetailsId={this.props.portfolioDetailsId}/>
      },
      {
        tabClassName: 'tab',
        panelClassName: 'panel',
        title: "News",
        name: "News",
        component: <MlFunderNews key="9" tabName="News" getFunderNewsDetails={this.getFunderNewsDetails.bind(this)}
                                 portfolioDetailsId={this.props.portfolioDetailsId}/>
      },
      {
        tabClassName: 'tab',
        panelClassName: 'panel',
        title: "Looking For",
        name: "Looking For",
        component: <MlFunderLookingFor key="8" getLookingFor={this.getLookingFor.bind(this)} tabName="lookingFor"
                                        portfolioDetailsId={this.props.portfolioDetailsId}/>
      },
      {
        tabClassName: 'tab',
        panelClassName: 'panel',
        title: "Services",
        name: "Services",
        component: <MlFunderServices key="10" tabName="Services" portfolioDetailsId={this.props.portfolioDetailsId}/>
      }
    ]
    return tabs;
  }


  //todo://need to pass all function to common function ["sendDataToParentPortfolio"] to send data to wrapper {"APP+ADMIN"}
  getLookingFor(details, privateKey, requiredFields) {
    let data = this.state.funderPortfolio;
    data['lookingFor'] = details;
    this.setState({funderPortfolio: data})
    // var object = omitDeep(data, 'logo')
    // this.props.getPortfolioDetails({funderPortfolio: object}, privateKey, requiredFields);
    this.sendDataToParentPortfolio(this.state.funderPortfolio, privateKey, requiredFields)
  }

  getSuccessStoriesDetails(details, privateKey, requiredFields) {
    let data = this.state.funderPortfolio;
    data['successStories'] = details;
    this.setState({funderPortfolio: data});
    // this.props.getPortfolioDetails({funderPortfolio: this.state.funderPortfolio}, privateKey, requiredFields);
    this.sendDataToParentPortfolio(this.state.funderPortfolio, privateKey, requiredFields)
  }

  getAboutus(details, privateKey, requiredFields) {
    let data = this.state.funderPortfolio;
    data['funderAbout'] = details;
    this.setState({funderPortfolio: data})
    // this.props.getPortfolioDetails({funderPortfolio: this.state.funderPortfolio}, privateKey, requiredFields);
    this.sendDataToParentPortfolio(this.state.funderPortfolio, privateKey, requiredFields)
  }

  getInvestmentsDetails(details, privateKey, requiredFields) {
    let data = this.state.funderPortfolio;
    data['investments'] = details;
    this.setState({funderPortfolio: data})
    // this.props.getPortfolioDetails({funderPortfolio: this.state.funderPortfolio}, privateKey, requiredFields);
    this.sendDataToParentPortfolio(this.state.funderPortfolio, privateKey, requiredFields)
  }

  getPrincipalDetails(details, privateKey, requiredFields) {
    let data = this.state.funderPortfolio;
    if (data && !data.principal) {
      data['principal'] = [];
    }
    data['principal'] = details;
    this.setState({funderPortfolio: data})
    var object = omitDeep(data, 'logo')
    this.props.getPortfolioDetails({funderPortfolio: object}, privateKey, requiredFields);
  }

  getTeamDetails(details, privateKey, requiredFields) {
    let data = this.state.funderPortfolio;
    if (data && !data.team) {
      data['team'] = [];
    }
    data['team'] = details;
    this.setState({funderPortfolio: data});
    var object = omitDeep(data, 'logo');
    this.props.getPortfolioDetails({funderPortfolio: object}, privateKey, requiredFields);
  }

  getAreaOfInterestDetails(details, privateKey, requiredFields) {
    let data = this.state.funderPortfolio;
    if (data && !data.areaOfInterest) {
      data['areaOfInterest'] = [];
    }
    data['areaOfInterest'] = details;
    this.setState({funderPortfolio: data});
    var object = omitDeep(data, 'logo');
    this.props.getPortfolioDetails({funderPortfolio: object}, privateKey, requiredFields);
  }

  /**
   * @Note: send data to parent portfolio
   * */
  sendDataToParentPortfolio(data, privateKey, requiredFields){
    var object = omitDeep(data, 'logo');
    this.props.getPortfolioDetails({funderPortfolio: object}, privateKey, requiredFields);
  }
  /**
   * check need and remove it
   * */
  getFunderNewsDetails(details, privateKey) {
    let data = this.state.funderPortfolio;
    if (data && !data.news) {
      data['news'] = [];
    }
    data['news'] = details;
    this.setState({funderPortfolio: data})
    this.props.getPortfolioDetails({funderPortfolio: this.state.funderPortfolio}, privateKey);
  }

  /**
   * check need and remove it
   * */

  getAllPrivateKeys(privateKeys, removePrivateKeys) {
    let obj = {
      privateKeys: privateKeys,
      removePrivateKeys: removePrivateKeys
    }
    this.setState({portfolioKeys: obj});
    return obj
  }

  componentWillReceiveProps(newProps) {
    console.log('newProps', newProps);
    if (newProps) {
      const resp = this.getAllPrivateKeys(newProps.privateKeys, newProps.removePrivateKeys);
      return resp
    }
  }

  componentWillMount() {
    let tabs = this.getTabComponents();

    function getTabs() {
      return tabs.map(tab => ({
        tabClassName: 'moolya_btn', // Optional
        panelClassName: 'panel1', // Optional
        title: tab.title,
        key: tab.name,
        getContent: () => tab.component
      }));
    }
    let activeTab = FlowRouter.getQueryParam('tab');
    if(activeTab){
      this.setState({activeTab});
    }
    this.setState({tabs: getTabs() || []});
  }

  updateTab(index){
    let tab =  this.state.tabs[index].title;
    FlowRouter.setQueryParams({ tab: tab });
  }

  render() {
    let tabs = this.state.tabs;
    return <MlTabComponent tabs={tabs} selectedTabKey={this.state.activeTab}  onChange={this.updateTab} type="tab" mkey="name"/>
  }
}
MlFunderEditTemplate.childContextTypes = {
  funderPortfolio: PropTypes.object,
  portfolioKeys: PropTypes.object
};
