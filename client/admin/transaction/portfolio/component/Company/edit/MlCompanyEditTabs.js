import React, {Component, PropTypes} from "react";
import _ from "lodash";
import omitDeep from 'omit-deep-lodash';
import MlTabComponent from "../../../../../../commons/components/tabcomponent/MlTabComponent";
import MlCompanyManagement from "./MlCompanyManagement";
import MlCompanyAboutUsLandingPage from "./about/MlCompanyAboutUsLandingPage";
import MlCompanyData from "./MlCompanyData";
import MlCompanyAwards from "./MlCompanyAwards";
import MlCompanyMCL from "./MlCompanyMCL";
import MlCompanyIncubatorsEditTabs from "./incubators/MlCompanyIncubatorsEditTabs"
import MlCompanyPartners from "./MlCompanyPartners";
import MlCompanyCSREditTabs from "./CSR/MlCompanyCSREditTabs"
import MlCompanyIntrapreneur from './MlCompanyIntrapreneur'
import MlCompanyRAndD from './MlCompanyR&D'
import MlCompanyEditCharts from './MlCompanyEditCharts'
import MlCompanyLookingFor from './MlCompanyLookingFor';
import PortfolioLibrary from '../../../../../../commons/components/portfolioLibrary/PortfolioLibrary'
import {client} from '../../../../../core/apolloConnection'
// import MlStartupCharts from "./MlStartupCharts/MlStartupCharts";


export default class MlCompanyEditTabs extends Component {
  constructor(props) {
    super(props)
    this.state = {
      tabs: [],
      aboutUs: {},
      companyPortfolio: {},
      portfolioKeys: {privateKeys: [], removePrivateKeys: [], activeTab: 'About'}
    };
    this.getChildContext.bind(this)
    this.getManagementDetails.bind(this);
    this.getAwardsDetails.bind(this);
    this.getMCL.bind(this)
  }

  getChildContext() {
    return {
      companyPortfolio: this.state.companyPortfolio,
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
    }, 10);
  }

  getAllPrivateKeys(privateKeys, removePrivateKeys) {
    let privateObject = this.state.portfolioKeys;
    privateObject['privateKeys'] = privateKeys;
    privateObject['removePrivateKeys'] = removePrivateKeys;
    this.setState({portfolioKeys: privateObject});
  }

  componentWillReceiveProps(newProps) {
    // console.log('newProps', newProps);
    if (newProps) {
      const resp = this.getAllPrivateKeys(newProps.privateKeys, newProps.removePrivateKeys);
      return resp
    }
  }

  backClickHandler() {
    let tabs = this.state.tabs;
    this.setState({tabs: tabs})
  }

  getTabComponents() {
    let tabs = [

      {
        tabClassName: 'tab',
        panelClassName: 'panel',
        title: "About",
        name: "About",
        component: <MlCompanyAboutUsLandingPage key="1" isAdmin={true} client={client}
                                                getAboutus={this.getAboutus.bind(this)}
                                                portfolioDetailsId={this.props.portfolioDetailsId}
                                                backClickHandler={this.backClickHandler.bind(this)}/>
      },
      {
        tabClassName: 'tab',
        panelClassName: 'panel',
        title: "Management",
        name: "Management",
        component: <MlCompanyManagement client={client} isAdmin={true} key="2" tabName={"management"}
                                        getManagementDetails={this.getManagementDetails.bind(this)}
                                        portfolioDetailsId={this.props.portfolioDetailsId}/>
      },
      {
        tabClassName: 'tab',
        panelClassName: 'panel',
        title: "Data",
        name: "Data",
        component: <MlCompanyData key="4" isApp={false} isAdmin={true} client={client}
                                  getDataDetails={this.getDataDetails.bind(this)}
                                  portfolioDetailsId={this.props.portfolioDetailsId}/>
      },
      {
        tabClassName: 'tab',
        panelClassName: 'panel',
        title: "Charts",
        name: "Charts",
        component: <MlCompanyEditCharts key="5" getChartDetails={this.getChartDetails.bind(this)}
                                        portfolioDetailsId={this.props.portfolioDetailsId}/>
      },
      {
        tabClassName: 'tab',
        panelClassName: 'panel',
        title: "Awards",
        name: "Awards",
        component: <MlCompanyAwards key="6" client={client} getAwardsDetails={this.getAwardsDetails.bind(this)}
                                    portfolioDetailsId={this.props.portfolioDetailsId} tabName="awardsRecognition"/>
      },
      {
        tabClassName: 'tab',
        panelClassName: 'panel',
        title: "Library",
        name: "Library",
        component: <PortfolioLibrary key="7" client={client} isAdmin={true}
                                     portfolioDetailsId={this.props.portfolioDetailsId}/>
      }, //
      {
        tabClassName: 'tab',
        panelClassName: 'panel',
        title: "M C & L",
        name: "M C And L",
        component: <MlCompanyMCL key="8" client={client} isAdmin={true} getMCL={this.getMCL.bind(this)}
                                 portfolioDetailsId={this.props.portfolioDetailsId}/>
      },
      {
        tabClassName: 'tab',
        panelClassName: 'panel',
        title: "Incubators",
        name: "Incubators",
        component: <MlCompanyIncubatorsEditTabs key="9" client={client} getIncubators={this.getIncubators.bind(this)}
                                                portfolioDetailsId={this.props.portfolioDetailsId}
                                                backClickHandler={this.backClickHandler.bind(this)}/>
      },
      {
        tabClassName: 'tab',
        panelClassName: 'panel',
        title: "Partners",
        name: "Partners",
        component: <MlCompanyPartners key="10" client={client} isAdmin={true}
                                      getPartnersDetails={this.getPartnersDetails.bind(this)}
                                      portfolioDetailsId={this.props.portfolioDetailsId} tabName="partners"/>
      },
      {
        tabClassName: 'tab',
        panelClassName: 'panel',
        title: "CSR",
        name: "CSR",
        component: <MlCompanyCSREditTabs key="11" client={client} getCSRDetails={this.getCSRDetails.bind(this)}
                                         portfolioDetailsId={this.props.portfolioDetailsId}
                                         backClickHandler={this.backClickHandler.bind(this)}/>
      },
      {
        tabClassName: 'tab',
        panelClassName: 'panel',
        title: "R&D",
        name: "R And D",
        component: <MlCompanyRAndD key="13" client={client} getRDDetails={this.getRDDetails.bind(this)}
                                   portfolioDetailsId={this.props.portfolioDetailsId} tabName="researchAndDevelopment"/>
      },
      {
        tabClassName: 'tab',
        panelClassName: 'panel',
        title: "Intrapreneur",
        name: "Intrapreneur",
        component: <MlCompanyIntrapreneur key="12" client={client}
                                          getIntrapreneurDetails={this.getIntrapreneurDetails.bind(this)}
                                          portfolioDetailsId={this.props.portfolioDetailsId}
                                          tabName="intrapreneurRecognition"/>
      },
      {
        tabClassName: 'tab',
        panelClassName: 'panel',
        title: "Looking For",
        name: "Looking For",
        component: <MlCompanyLookingFor key="14" client={client}
                                        getLookingForDetails={this.getLookingForDetails.bind(this)}
                                        portfolioDetailsId={this.props.portfolioDetailsId} tabName="lookingFor"/>
      },

    ]
    return tabs;
  }

  getAboutus(details, tabName, privateKey, requiredFields) {
    let data = this.state.companyPortfolio;
    data[tabName] = details;
    const object = omitDeep(data, ['logo', "privateFields"]);
    this.props.getPortfolioDetails({companyPortfolio: object}, privateKey, requiredFields);
  }

  getDataDetails(details, tabName) {
    let data = this.state.companyPortfolio;
    data[tabName] = details;
    this.props.getPortfolioDetails({companyPortfolio: data});
  }

  getManagementDetails(details, privateKey, requiredFields) {
    let data = this.state.companyPortfolio;
    if (data && !data.management) {
      data['management'] = [];
    }
    data['management'] = details;
    this.setState({companyPortfolio: data})
    var object = omitDeep(data, 'logo');
    this.props.getPortfolioDetails({companyPortfolio: object}, privateKey, requiredFields);
  }

  getLookingForDetails(details, privateKey, requiredFields) {
    let data = this.state.companyPortfolio;
    if (data && !data.lookingFor) {
      data['lookingFor'] = [];
    }
    data['lookingFor'] = details;
    this.setState({companyPortfolio: data})
    this.props.getPortfolioDetails({companyPortfolio: this.state.companyPortfolio}, privateKey, requiredFields);
  }

  getAwardsDetails(details, privateKey, requiredFields) {
    let data = this.state.companyPortfolio;
    if (data && !data.awardsRecognition) {
      data['awardsRecognition'] = [];
    }
    data['awardsRecognition'] = details;
    this.setState({companyPortfolio: data})
    var object = omitDeep(data, 'logo');
    this.props.getPortfolioDetails({companyPortfolio: object}, privateKey, requiredFields);
  }

  getMCL(details, privateKey) {
    let data = this.state.companyPortfolio;
    if (details.memberships) {
      data['memberships'] = details.memberships;
    }
    if (details.compliances) {
      data['compliances'] = details.compliances;
    }
    if (details.licenses) {
      data['licenses'] = details.licenses;
    }
    this.setState({companyPortfolio: data})
    this.props.getPortfolioDetails({companyPortfolio: this.state.companyPortfolio}, privateKey);
  }

  getChartDetails(details, tabName) {
    let data = this.state.companyPortfolio;
    data[tabName] = details;
    this.props.getPortfolioDetails({companyPortfolio: data});
  }

  getIncubators(details, tabName, privateKey, requiredFields) {
    let data = this.state.companyPortfolio;
    data[tabName] = details;
    var object = omitDeep(data, 'logo');
    this.props.getPortfolioDetails({companyPortfolio: object}, privateKey, requiredFields);
  }

  getPartnersDetails(details, privateKey) {
    let data = this.state.companyPortfolio;
    if (data && !data.partners) {
      data['partners'] = [];
    }
    data['partners'] = details;
    this.setState({companyPortfolio: data})
    var object = omitDeep(data, 'logo');
    this.props.getPortfolioDetails({companyPortfolio: object}, privateKey);
  }

  getCSRDetails(details, tabName, privateKey, requiredFields) {
    let data = this.state.companyPortfolio;
    data[tabName] = details;
    var object = omitDeep(data, 'logo');
    this.props.getPortfolioDetails({companyPortfolio: object}, privateKey, requiredFields);
  }

  getRDDetails(details, privateKey, requiredFields) {
    let data = this.state.companyPortfolio;
    if (data && !data.researchAndDevelopment) {
      data['researchAndDevelopment'] = [];
    }
    data['researchAndDevelopment'] = details;
    this.setState({companyPortfolio: data});
    var object = omitDeep(data, 'logo');
    this.props.getPortfolioDetails({companyPortfolio: object}, privateKey, requiredFields);
  }

  getIntrapreneurDetails(details, privateKey) {
    let data = this.state.companyPortfolio;
    if (data && !data.intrapreneurRecognition) {
      data['intrapreneurRecognition'] = [];
    }
    data['intrapreneurRecognition'] = details;
    this.setState({companyPortfolio: data});
    var object = omitDeep(data, 'logo');
    this.props.getPortfolioDetails({companyPortfolio: object}, privateKey);
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
    if (activeTab) {
      this.setState({activeTab});
    }
    this.setState({tabs: getTabs() || []});
  }

  updateTab(index) {
    let tab = this.state.tabs[index].title;
    FlowRouter.setQueryParams({tab: tab});
  }

  render() {
    let tabs = this.state.tabs;
    return <MlTabComponent tabs={tabs} selectedTabKey={this.state.activeTab} onChange={this.updateTab} type="tab"
                           mkey="name"/>
  }
}
MlCompanyEditTabs.childContextTypes = {
  companyPortfolio: PropTypes.object,
  portfolioKeys: PropTypes.object
};
