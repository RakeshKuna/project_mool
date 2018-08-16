import React, {Component, PropTypes}  from "react";
import _ from 'lodash'
import omitDeep from 'omit-deep-lodash';
import MlTabComponent from "../../../../commons/components/tabcomponent/MlTabComponent";
import {getProfileBasedOnPortfolio} from '../../../calendar/manageScheduler/service/actions/MlServiceActionHandler'
import MlFunderAbout from '../../../../admin/transaction/portfolio/component/Funders/edit/MlFunderAbout'
import MlFunderAreaOfInterest from '../../../../admin/transaction/portfolio/component/Funders/edit/MlFunderAreaOfInterest'
import MlFunderEngagementMethod from '../../../../admin/transaction/portfolio/component/Funders/edit/MlFunderEngagementMethod'
import MlFunderInvestment from '../../../../admin/transaction/portfolio/component/Funders/edit/MlFunderInvestment'
import PortfolioLibrary from '../../../../commons/components/portfolioLibrary/PortfolioLibrary';
import MlFunderNews from '../../../../admin/transaction/portfolio/component/Funders/edit/MlFunderNews'
import MlFunderPrincipalTeam from '../../../../admin/transaction/portfolio/component/Funders/edit/MlFunderPrincipalTeam'
import MlFunderSuccessStories from '../../../../admin/transaction/portfolio/component/Funders/edit/MlFunderSuccessStories'
import MlFunderServices from '../../../../admin/transaction/portfolio/component/Funders/edit/MlFunderServices'
import MlFunderLookingFor from '../../../../admin/transaction/portfolio/component/Funders/edit/MlFunderLookingFor'
import FunderCreateServicesView from '../../../../admin/transaction/portfolio/component/Funders/edit/beSpokeHandler'
import MlBeSpokeListView from '../../../../admin/transaction/portfolio/component/Funders/edit/MlFunderServicesList'
import {appClient} from '../../../core/appConnection'


export default class MlAppFunderEditTabs extends Component {
  constructor(props) {
    super(props)
    this.state = {tabs: [], aboutUs: {}, funderPortfolio: {}, portfolioKeys: {privateKeys: [], removePrivateKeys: []}, activeTab:'About'};
    this.getChildContext.bind(this)
    this.getInvestmentsDetails.bind(this);
    this.getFunderNewsDetails.bind(this);
    this.getFunderLibrary.bind(this);
    this.getServiceDetails.bind(this);
    this.saveDataToServices.bind(this);
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
        component: <MlFunderAbout client={appClient} tabName="funderAbout" isAdmin={false} key="1"
                                  getAboutus={this.getAboutus.bind(this)}
                                  portfolioDetailsId={this.props.portfolioDetailsId}/>
      },
      {
        tabClassName: 'tab',
        panelClassName: 'panel',
        title: "Investments",
        name: "Investments",
        component: <MlFunderInvestment client={appClient} isAdmin={false} key="2" tabName="investments"
                                       getInvestmentsDetails={this.getInvestmentsDetails.bind(this)}
                                       portfolioDetailsId={this.props.portfolioDetailsId}/>
      },
      {
        tabClassName: 'tab',
        panelClassName: 'panel',
        title: "Principals & Team",
        name: "Principals And Team",
        component: <MlFunderPrincipalTeam client={appClient} isAdmin={false} key="3"
                                          getPrincipalDetails={this.getPrincipalDetails.bind(this)}
                                          getTeamDetails={this.getTeamDetails.bind(this)}
                                          portfolioDetailsId={this.props.portfolioDetailsId}/>
      },
      {
        tabClassName: 'tab',
        panelClassName: 'panel',
        title: "Engagement Methods",
        name: "Engagement Methods",
        component: <MlFunderEngagementMethod client={appClient} isAdmin={false} key="4"
                                             portfolioDetailsId={this.props.portfolioDetailsId}/>
      },
      {
        tabClassName: 'tab',
        panelClassName: 'panel',
        title: "Areas Of Interest",
        name: "Areas Of Interest",
        component: <MlFunderAreaOfInterest client={appClient} isAdmin={false} key="6"
                                           getAreaOfInterestDetails={this.getAreaOfInterestDetails.bind(this)}
                                           portfolioDetailsId={this.props.portfolioDetailsId}/>
      },
      {
        tabClassName: 'tab',
        panelClassName: 'panel',
        title: "Success Stories",
        name: "Success Stories",
        component: <MlFunderSuccessStories client={appClient} isAdmin={false} key="7" tabName="successStories"
                                           getSuccessStoriesDetails={this.getSuccessStoriesDetails.bind(this)}
                                           portfolioDetailsId={this.props.portfolioDetailsId}/>
      },
      {
        tabClassName: 'tab',
        panelClassName: 'panel',
        title: "Library",
        name: "Library",
        component: <PortfolioLibrary client={appClient} isAdmin={false} key="8"
                                     getFunderLibrary={this.getFunderLibrary.bind(this)}
                                     portfolioDetailsId={this.props.portfolioDetailsId}/>
      },
      {
        tabClassName: 'tab',
        panelClassName: 'panel',
        title: "News",
        name: "News",
        component: <MlFunderNews client={appClient} isAdmin={false} key="9"
                                 getFunderNewsDetails={this.getFunderNewsDetails.bind(this)}
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
        component: <MlFunderServices myPortfolio={true} createServiceMode={true} client={appClient} isAdmin={false}
                                     key="10" getServiceDetails={this.getServiceDetails.bind(this)}
                                     portfolioDetailsId={this.props.portfolioDetailsId}/>
      } //getFunderServicesDetails={this.getFunderServicesDetails.bind(this)} portfolioDetailsId={this.props.portfolioDetailsId}
    ]
    return tabs;
  }

  getLookingFor(details, privateKey, requiredFields) {
    let data = this.state.funderPortfolio;
    data['lookingFor'] = details;
    this.setState({funderPortfolio: data})
    // this.props.getPortfolioDetails({funderPortfolio: this.state.funderPortfolio}, privateKey, requiredFields);
    this.sendDataToParentPortfolio(this.state.funderPortfolio, privateKey, requiredFields)
  }

  getSuccessStoriesDetails(details, privateKey, requiredFields) {
    let data = this.state.funderPortfolio;
    data['successStories'] = details;
    this.setState({funderPortfolio: data})
    // var object = omitDeep(data, 'logo')
    // this.props.getPortfolioDetails({funderPortfolio: object}, privatekey, requiredFields);
    this.sendDataToParentPortfolio(this.state.funderPortfolio, privateKey, requiredFields)
  }

  getAboutus(details, privateKey, requiredFields) {
    let data = this.state.funderPortfolio;
    data['funderAbout'] = details;
    this.setState({funderPortfolio: data})
    // this.props.getPortfolioDetails({funderPortfolio: this.state.funderPortfolio}, privatekey, requiredFields);
    this.sendDataToParentPortfolio(this.state.funderPortfolio, privateKey, requiredFields)
  }

  getInvestmentsDetails(details, privateKey, requiredFields) {
    let data = this.state.funderPortfolio;
    data['investments'] = details;
    this.setState({funderPortfolio: data})
    // this.props.getPortfolioDetails({funderPortfolio: this.state.funderPortfolio}, privatekey, requiredFields);
    this.sendDataToParentPortfolio(this.state.funderPortfolio, privateKey, requiredFields)
  }

  getPrincipalDetails(details, privatekey, requiredFields) {
    let data = this.state.funderPortfolio;
    if (data && !data.principal) {
      data['principal'] = [];
    }
    data['principal'] = details;
    this.setState({funderPortfolio: data});
    var object = omitDeep(data, 'logo')
    this.props.getPortfolioDetails({funderPortfolio: object}, privatekey, requiredFields);
  }

  getTeamDetails(details, privatekey, requiredFields) {
    let data = this.state.funderPortfolio;
    if (data && !data.team) {
      data['team'] = [];
    }
    data['team'] = details;
    this.setState({funderPortfolio: data});
    var object = omitDeep(data, 'logo')
    this.props.getPortfolioDetails({funderPortfolio: object}, privatekey, requiredFields);
  }

  getAreaOfInterestDetails(details, privatekey, requiredFields) {
    let data = this.state.funderPortfolio;
    if (data && !data.areaOfInterest) {
      data['areaOfInterest'] = [];
    }
    data['areaOfInterest'] = details;
    this.setState({funderPortfolio: data});
    var object = omitDeep(data, 'logo');
    this.props.getPortfolioDetails({funderPortfolio: object}, privatekey, requiredFields);
  }

  getServiceDetails(details, privatekey) {
    if (details.services) {
      let portfolioId = details.portfolioId;
      this.saveDataToServices(portfolioId)
    }
    let data = this.state.funderPortfolio;
    data['services'] = details;
    this.setState({funderPortfolio: data})
    this.props.getPortfolioDetails({funderPortfolio: this.state.funderPortfolio}, privatekey);
  }

  /**
   * @Note: send data to parent portfolio
   * */
  sendDataToParentPortfolio(data, privateKey, requiredFields){
    var object = omitDeep(data, 'logo');
    this.props.getPortfolioDetails({funderPortfolio: object}, privateKey, requiredFields);
  }

  async saveDataToServices(portfolioId) {
    const resp = await getProfileBasedOnPortfolio(portfolioId)
    // this.saveServiceDetails()
    return resp
  }

  /**
   * check need and remove it
   * */
  getFunderNewsDetails(details, privatekey) {
    let data = this.state.funderPortfolio;
    if (data && !data.lookingFor) {
      data['lookingFor'] = [];
    }
    data['lookingFor'] = details;
    this.setState({funderPortfolio: data})
    this.props.getPortfolioDetails({funderPortfolio: this.state.funderPortfolio}, privatekey);
  }

  /**
   * check need and remove it
   * */
  getFunderLibrary(details) {
    let data = this.state.funderPortfolio;
    if (details.memberships) {
      data['memberships'] = details.memberships;
    }
    if (details.compliances) {
      data['compliances'] = details.compliances;
    }
    if (details.licenses) {
      data['licenses'] = details.licenses;
    }
    this.setState({funderPortfolio: data})
    this.props.getPortfolioDetails({funderPortfolio: this.state.funderPortfolio}, []);
  }

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
        tabClassName: 'horizon-item', // Optional
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
MlAppFunderEditTabs.childContextTypes = {
  funderPortfolio: PropTypes.object,
  portfolioKeys: PropTypes.object
};
