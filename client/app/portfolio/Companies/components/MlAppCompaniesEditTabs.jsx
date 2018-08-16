/**
 * Import of all the usable components
 * */
import React, {Component, PropTypes} from "react";
import omitDeep from 'omit-deep-lodash';
import MlTabComponent from "../../../../commons/components/tabcomponent/MlTabComponent";
import {appClient} from '../../../core/appConnection'
import MlCompanyManagement from '../../../../admin/transaction/portfolio/component/Company/edit/MlCompanyManagement';
import MlCompanyAboutUsLandingPage from "../../../../admin/transaction/portfolio/component/Company/edit/about/MlCompanyAboutUsLandingPage";
import MlCompanyData from "../../../../admin/transaction/portfolio/component/Company/edit/MlCompanyData";
import MlCompanyAwards from "../../../../admin/transaction/portfolio/component/Company/edit/MlCompanyAwards";
import MlCompanyMCL from "../../../../admin/transaction/portfolio/component/Company/edit/MlCompanyMCL";
import MlCompanyIncubatorsEditTabs from "../../../../admin/transaction/portfolio/component/Company/edit/incubators/MlCompanyIncubatorsEditTabs"
import MlCompanyPartners from "../../../../admin/transaction/portfolio/component/Company/edit/MlCompanyPartners";
import MlCompanyCSREditTabs from "../../../../admin/transaction/portfolio/component/Company/edit/CSR/MlCompanyCSREditTabs"
import MlCompanyIntrapreneur from '../../../../admin/transaction/portfolio/component/Company/edit/MlCompanyIntrapreneur'
import MlCompanyRAndD from '../../../../admin/transaction/portfolio/component/Company/edit/MlCompanyR&D'
import MlCompanyLookingFor from '../../../../admin/transaction/portfolio/component/Company/edit/MlCompanyLookingFor'
import MlCompanyCharts from "../../../../admin/transaction/portfolio/component/Company/edit/MlCompanyEditCharts";
import PortfolioLibrary from '../../../../commons/components/portfolioLibrary/PortfolioLibrary'
import MlFunderServices from '../../../../admin/transaction/portfolio/component/Funders/edit/MlFunderServices'

export default class MlAppCompaniesEditTabs extends Component {
  constructor(props) {
    super(props)
    this.state = {
      tabs: [], companyPortfolio: {}, portfolioKeys: {privateKeys: [], removePrivateKeys: []},
      activeTab: 'About'
    };
    this.getChildContext.bind(this)
  }

  getChildContext() {
    return {
      companyPortfolio: this.state.companyPortfolio,
      portfolioKeys: this.state.portfolioKeys
    }
  }

  setBackHandler(backMethod) {
    this.props.setBackHandler(backMethod);
    $('.RRT__tabs').removeClass('menunone');
  }

  backClickHandler() {
    let tabs = this.state.tabs;
    this.setState({tabs: tabs})
  }

  componentDidMount() {
    // setTimeout(function () {
    //   $('div[role="tab"]').each(function (index) {
    //     var test = $(this).text();
    //     $(this).empty();
    //     $(this).html('<div class="moolya_btn moolya_btn_in">' + test + '</div>');
    //   });
    //   $('.RRT__tabs').addClass('horizon-swiper');
    //   $('.RRT__tab').addClass('horizon-item');
    //   $('.horizon-swiper').horizonSwiper();
    // }, 300);
  }

  /**
   * Display of all tabs of service provider and passing the portfolioId
   * */
  getTabComponents() {
    let tabs = [
      {
        tabClassName: 'tab',
        panelClassName: 'panel',
        title: "About",
        name: "About",
        component: <MlCompanyAboutUsLandingPage key="1" client={appClient} getAboutus={this.getAboutus.bind(this)}
                                                portfolioDetailsId={this.props.portfolioDetailsId}
                                                backClickHandler={this.setBackHandler.bind(this)} isApp={true}/>
      },
      {
        tabClassName: 'tab',
        panelClassName: 'panel',
        title: "Management",
        name: "Management",
        component: <MlCompanyManagement client={appClient} isAdmin={false} key="2" tabName={"management"}
                                        getManagementDetails={this.getManagementDetails.bind(this)}
                                        portfolioDetailsId={this.props.portfolioDetailsId}/>
      },
      {
        tabClassName: 'tab',
        panelClassName: 'panel',
        title: "Data",
        name: "Data",
        component: <MlCompanyData key="4" isApp={false} client={appClient}
                                  getDataDetails={this.getDataDetails.bind(this)}
                                  portfolioDetailsId={this.props.portfolioDetailsId}/>
      },
      {
        tabClassName: 'tab',
        panelClassName: 'panel',
        title: "Charts",
        name: "Charts",
        component: <MlCompanyCharts key="5" client={appClient} isAdmin={false}
                                    getChartDetails={this.getChartDetails.bind(this)}
                                    portfolioDetailsId={this.props.portfolioDetailsId}
                                    backClickHandler={this.setBackHandler.bind(this)} isApp={true}/>
      },
      {
        tabClassName: 'tab',
        panelClassName: 'panel',
        title: "Awards",
        name: "Awards",
        component: <MlCompanyAwards key="6" getAwardsDetails={this.getAwardsDetails.bind(this)} client={appClient}
                                    portfolioDetailsId={this.props.portfolioDetailsId} tabName="awardsRecognition"/>
      },
      {
        tabClassName: 'tab',
        panelClassName: 'panel',
        title: "Library",
        name: "Library",
        component: <PortfolioLibrary key="7" client={appClient} isAdmin={false}
                                     portfolioDetailsId={this.props.portfolioDetailsId}/>
      }, //
      {
        tabClassName: 'tab',
        panelClassName: 'panel',
        title: "M C & L",
        name: "M C And L",
        component: <MlCompanyMCL key="8" client={appClient} getMCL={this.getMCL.bind(this)}
                                 portfolioDetailsId={this.props.portfolioDetailsId}/>
      },
      {
        tabClassName: 'tab',
        panelClassName: 'panel',
        title: "Incubators",
        name: "Incubators",
        component: <MlCompanyIncubatorsEditTabs key="9" client={appClient} getIncubators={this.getIncubators.bind(this)}
                                                portfolioDetailsId={this.props.portfolioDetailsId}
                                                backClickHandler={this.setBackHandler.bind(this)} isApp={true}/>
      },
      {
        tabClassName: 'tab',
        panelClassName: 'panel',
        title: "Partners",
        name: "Partners",
        component: <MlCompanyPartners key="10" client={appClient}
                                      getPartnersDetails={this.getPartnersDetails.bind(this)}
                                      portfolioDetailsId={this.props.portfolioDetailsId}/>
      },
      {
        tabClassName: 'tab',
        panelClassName: 'panel',
        title: "CSR",
        name: "CSR",
        component: <MlCompanyCSREditTabs key="11" client={appClient} getCSRDetails={this.getCSRDetails.bind(this)}
                                         portfolioDetailsId={this.props.portfolioDetailsId}
                                         backClickHandler={this.setBackHandler.bind(this)} isApp={true}/>
      },
      {
        tabClassName: 'tab',
        panelClassName: 'panel',
        title: "R&D",
        name: "R And D",
        component: <MlCompanyRAndD key="13" client={appClient} getRDDetails={this.getRDDetails.bind(this)}
                                   portfolioDetailsId={this.props.portfolioDetailsId} tabName="researchAndDevelopment"/>
      },
      {
        tabClassName: 'tab',
        panelClassName: 'panel',
        title: "Intrapreneur",
        name: "Intrapreneur",
        component: <MlCompanyIntrapreneur key="12" client={appClient}
                                          getIntrapreneurDetails={this.getIntrapreneurDetails.bind(this)}
                                          portfolioDetailsId={this.props.portfolioDetailsId}
                                          tabName="intrapreneurRecognition"/>
      },
      {
        tabClassName: 'tab',
        panelClassName: 'panel',
        title: "Looking For",
        name: "Looking For",
        component: <MlCompanyLookingFor key="14" client={appClient}
                                        getLookingForDetails={this.getLookingForDetails.bind(this)}
                                        portfolioDetailsId={this.props.portfolioDetailsId} tabName="lookingFor"/>
      },
      {
        tabClassName: 'tab',
        panelClassName: 'panel',
        title: "Services",
        name: "Services",
        component: <MlFunderServices myPortfolio={true} createServiceMode={true} client={appClient} isAdmin={false}
                                     key="10"
                                     // getServiceDetails={this.getServiceDetails.bind(this)}
                                     portfolioDetailsId={this.props.portfolioDetailsId}/>
      } //getFunderServicesDetails={this.getFunderServicesDetails.bind(this)} portfolioDetailsId={this.props.portfolioDetailsId}

    ]
    return tabs;
  }

  /**
   * getting all values from the child components and passing all to Main component through props
   * */
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

  getIncubators(details, tabName, privateKey) {
    let data = this.state.companyPortfolio;
    data[tabName] = details;
    var object = omitDeep(data, 'logo');
    this.props.getPortfolioDetails({companyPortfolio: object}, privateKey);
  }

  getPartnersDetails(details, privateKey) {
    let data = this.state.companyPortfolio;
    if (data && !data.partners) {
      data['partners'] = [];
    }
    data['partners'] = details;
    this.setState({companyPortfolio: data});
    var object = omitDeep(data, 'logo');
    this.props.getPortfolioDetails({companyPortfolio: object}, privateKey);
  }

  getCSRDetails(details, tabName, privateKey, requiredFields) {
    if (tabName == "reports") {
      let data = this.state.companyPortfolio;
      data[tabName] = details;
      this.props.getPortfolioDetails({companyPortfolio: data});
    } else {
      let data = this.state.companyPortfolio;
      data[tabName] = details;
      var object = omitDeep(data, 'logo');
      this.props.getPortfolioDetails({companyPortfolio: object}, privateKey, requiredFields);
    }
  }

  getRDDetails(details, privateKey, requiredFields) {
    let data = this.state.companyPortfolio;
    if (data && !data.awardsRecognition) {
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
    this.setState({companyPortfolio: data})
    var object = omitDeep(data, 'logo');
    this.props.getPortfolioDetails({companyPortfolio: object}, privateKey);
  }

  getLookingForDetails(details, privatekey, requiredFields) {
    let data = this.state.companyPortfolio;
    if (data && !data.lookingFor) {
      data['lookingFor'] = [];
    }
    data['lookingFor'] = details;
    this.setState({companyPortfolio: data})
    this.props.getPortfolioDetails({companyPortfolio: this.state.companyPortfolio}, privatekey, requiredFields);
  }

  /**
   * tab mounting component
   * */
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
    if (activeTab) {
      this.setState({activeTab});
    }
    this.setState({tabs: getTabs() || []});
  }

  getAllPrivateKeys(privateKeys, removePrivateKeys) {
    let privateObject = this.state.portfolioKeys;
    privateObject['privateKeys'] = privateKeys;
    privateObject['removePrivateKeys'] = removePrivateKeys;
    this.setState({ portfolioKeys: privateObject });
  }

  componentWillReceiveProps(newProps) {
    // console.log('newProps', newProps);
    if (newProps) {
      const resp = this.getAllPrivateKeys(newProps.privateKeys, newProps.removePrivateKeys);
      return resp
    }
  }

  updateTab(index) {
    let tab = this.state.tabs[index].title;
    FlowRouter.setQueryParams({tab: tab});
  }

  render() {
    let tabs = this.state.tabs;
    return <MlTabComponent tabs={tabs} selectedTabKey={this.state.activeTab} onChange={this.updateTab} type="tab"
                           mkey="title"/>
  }
}

/**
 * preparing context of all the data coming from child component
 * */
MlAppCompaniesEditTabs.childContextTypes = {
  companyPortfolio: PropTypes.object,
  portfolioKeys: PropTypes.object
};
