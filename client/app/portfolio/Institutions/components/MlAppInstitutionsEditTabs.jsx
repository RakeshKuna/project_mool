import React, {Component, PropTypes} from "react";
import _ from 'lodash'
import omitDeep from 'omit-deep-lodash';
import MlTabComponent from "../../../../commons/components/tabcomponent/MlTabComponent";
import MlInstitutionAboutUsLandingPage from "../../../../admin/transaction/portfolio/component/Institution/edit/aboutUs/MlInstitutionAboutUsLandingPage"
import MlInstitutionEditManagement from "../../../../admin/transaction/portfolio/component/Institution/edit/MlInstitutionEditManagement"
import MlInstitutionInvestor from "../../../../admin/transaction/portfolio/component/Institution/edit/MlInstitutionEditInvestor";
import MlInstitutionData from "../../../../admin/transaction/portfolio/component/Institution/edit/MlInstitutionEditData";
import MlInstitutionCharts from "../../../../admin/transaction/portfolio/component/Institution/edit/MlInstitutionEditChart";
import MlInstitutionEditAwards from "../../../../admin/transaction/portfolio/component/Institution/edit/MlInstitutionEditAwards";
import MlInstitutionMCL from "../../../../admin/transaction/portfolio/component/Institution/edit/MlInstitutionEditMCL";
import MlInstitutionLookingFor from "../../../../admin/transaction/portfolio/component/Institution/edit/MlInstitutionEditLookingFor";
import MlInstitutionIntrapreneur from "../../../../admin/transaction/portfolio/component/Institution/edit/MlInstitutionEditIntrapreneur";
import MlInstitutionRAndD from "../../../../admin/transaction/portfolio/component/Institution/edit/MlInstitutionEditR&D";
import MlInstitutionCSREditTabs from "../../../../admin/transaction/portfolio/component/Institution/edit/CSR/MlInstitutionCSREditTabs";
import MlInstitutionEditPartners from "../../../../admin/transaction/portfolio/component/Institution/edit/MlInstitutionEditPartners";
import MlInstitutionIncubator from "../../../../admin/transaction/portfolio/component/Institution/edit/incubators/MlInstitutionIncubatorsEditTabs";
import PortfolioLibrary from '../../../../commons/components/portfolioLibrary/PortfolioLibrary'
import {appClient} from '../../../core/appConnection'
import MlFunderServices from '../../../../admin/transaction/portfolio/component/Funders/edit/MlFunderServices'
// import MlVerticalTabComponent from '../../../commons/components/tabcomponent/MlVerticalTabComponent'

export default class MlAppInstitutionEditTabs extends Component {

  constructor(props) {
    super(props)
    this.state = {tabs: [], aboutUs: {}, institutionPortfolio: {}, portfolioKeys: {privateKeys: [],
      removePrivateKeys: []},activeTab:'About'};
    this.getChildContext.bind(this)
    this.getManagementDetails.bind(this);
    this.getAwardsDetails.bind(this);
    this.getLookingForDetails.bind(this);
    this.getInstitutionMCL.bind(this)
    this.getCSRDetails.bind(this);
    this.getLookingForDetails.bind(this);
    this.getRDDetails.bind(this)
  }

  getChildContext() {
    return {
      institutionPortfolio: this.state.institutionPortfolio,
      portfolioKeys: this.state.portfolioKeys
    }
  }

  componentDidMount() {
    // setTimeout(function(){
    //   $('div[role="tab"]').each(function( index ) {
    //     var test = $(this).text();
    //     $(this).empty();
    //     $(this).html('<div class="moolya_btn moolya_btn_in">'+test+'</div>');
    //   });
    //   $('.RRT__tabs').addClass('horizon-swiper');
    //   $('.RRT__tab').addClass('horizon-item');
    //   $('.horizon-swiper').horizonSwiper();
    // },200);
    // alert(1);
    // $('.RRT__tabs').removeClass('menunone');
  }

  backClickHandler() {
    let tabs = this.state.tabs;
    this.setState({tabs: tabs})
  }

  setBackHandler(backMethod) {
    this.props.setBackHandler(backMethod);
    $('.RRT__tabs').removeClass('menunone');
  }

  getTabComponents() {
    let tabs = [

      {
        tabClassName: 'tab',
        panelClassName: 'panel',
        title: "About",
        name: "About",
        component: <MlInstitutionAboutUsLandingPage client={appClient} isAdmin={false} key="1"
                                         getAboutus={this.getAboutus.bind(this)}
                                         portfolioDetailsId={this.props.portfolioDetailsId}
                                         backClickHandler={this.setBackHandler.bind(this)} isApp={true}/>
      },
      {
        tabClassName: 'tab',
        panelClassName: 'panel',
        title: "Management",
        name: "Management",
        component: <MlInstitutionEditManagement key="2" isAdmin={false} client={appClient} tabName={"management"}
                                            getManagementDetails={this.getManagementDetails.bind(this)}
                                            portfolioDetailsId={this.props.portfolioDetailsId}/>
      },
      {
        tabClassName: 'tab',
        panelClassName: 'panel',
        title: "Investor",
        name: "Investor",
        component: <MlInstitutionInvestor client={appClient} isAdmin={false} key="3"
                                          getInvestorDetails={this.getInvestorDetails.bind(this)}
                                          portfolioDetailsId={this.props.portfolioDetailsId} tabName="investor"/>
      },
      {
        tabClassName: 'tab',
        panelClassName: 'panel',
        title: "Data",
        name: "Data",
        component: <MlInstitutionData client={appClient} key="4" getDataDetails={this.getDataDetails.bind(this)}
                                      portfolioDetailsId={this.props.portfolioDetailsId} isApp={true}/>
      },
      {
        tabClassName: 'tab',
        panelClassName: 'panel',
        title: "Charts",
        name: "Charts",
        component: <MlInstitutionCharts key="5" client={appClient} isAdmin={false}
                                        getChartDetails={this.getChartDetails.bind(this)}
                                        portfolioDetailsId={this.props.portfolioDetailsId}
                                        backClickHandler={this.setBackHandler.bind(this)} isApp={true}/>
      },
      {
        tabClassName: 'tab',
        panelClassName: 'panel',
        title: "Awards",
        name: "Awards",
        component: <MlInstitutionEditAwards client={appClient} isAdmin={false} key="6"
                                        getAwardsDetails={this.getAwardsDetails.bind(this)}
                                        portfolioDetailsId={this.props.portfolioDetailsId} tabName="awardsRecognition"/>
      },
      {
        tabClassName: 'tab',
        panelClassName: 'panel',
        title: "Library",
        name: "Library",
        component: <PortfolioLibrary key="7" isAdmin={false} client={appClient}
                                     portfolioDetailsId={this.props.portfolioDetailsId}/>
      }, //
      {
        tabClassName: 'tab',
        panelClassName: 'panel',
        title: "M C & L",
        name: "M C And L",
        component: <MlInstitutionMCL key="8" getInstitutionMCL={this.getInstitutionMCL.bind(this)}
                                     portfolioDetailsId={this.props.portfolioDetailsId}/>
      },
      {
        tabClassName: 'tab',
        panelClassName: 'panel',
        title: "Looking For",
        name: "Looking For",
        component: <MlInstitutionLookingFor key="9" getLookingForDetails={this.getLookingForDetails.bind(this)}
                                            portfolioDetailsId={this.props.portfolioDetailsId} tabName="lookingFor"/>
      },
      {
        tabClassName: 'tab',
        panelClassName: 'panel',
        title: "Partner",
        name: "Partner",
        component: <MlInstitutionEditPartners key="10" getPartnersDetails={this.getPartnersDetails.bind(this)} client={appClient}
                                              portfolioDetailsId={this.props.portfolioDetailsId} tabName="partners"/>
      },
      {
        tabClassName: 'tab',
        panelClassName: 'panel',
        title: "CSR",
        name: "CSR",
        component: <MlInstitutionCSREditTabs client={appClient} isAdmin={false} key="11"
                                     getCSRDetails={this.getCSRDetails.bind(this)}
                                     portfolioDetailsId={this.props.portfolioDetailsId}
                                     backClickHandler={this.setBackHandler.bind(this)} isApp={true}/>
      },
      {
        tabClassName: 'tab',
        panelClassName: 'panel',
        title: "R&D",
        name: "R&D",
        component: <MlInstitutionRAndD key="12" getRDDetails={this.getRDDetails.bind(this)}
                                       portfolioDetailsId={this.props.portfolioDetailsId} tabName="researchAndDevelopment"/>
      },
      {
        tabClassName: 'tab',
        panelClassName: 'panel',
        title: "Intrapreneur",
        name: "Intrapreneur",
        component: <MlInstitutionIntrapreneur key="14" getIntrapreneurDetails={this.getIntrapreneurDetails.bind(this)}
                                              portfolioDetailsId={this.props.portfolioDetailsId} tabName="intrapreneurRecognition"/>
      },
      {
        tabClassName: 'tab',
        panelClassName: 'panel',
        title: "Incubators",
        name: "Incubators",
        component: <MlInstitutionIncubator client={appClient} isAdmin={false} key="15"
                                           getIncubators={this.getIncubators.bind(this)}
                                           portfolioDetailsId={this.props.portfolioDetailsId}
                                           backClickHandler={this.setBackHandler.bind(this)} isApp={true}/>
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


    ];
    return tabs;
  }

  getAboutus(details, tabName, privatekey, requiredFields) {
    let data = this.state.institutionPortfolio;
    data[tabName] = details;
    const object = omitDeep(data, ['logo', 'privateFields']);
    this.props.getPortfolioDetails({institutionPortfolio: object}, privatekey, requiredFields);
  }

  getCSRDetails(details, tabName, privatekey, requiredFields) {
    if (tabName == "reports") {
      let data = this.state.institutionPortfolio;
      data[tabName] = details;
      this.props.getPortfolioDetails({institutionPortfolio: data});
    } else {
      let data = this.state.institutionPortfolio;
      data[tabName] = details;
      this.props.getPortfolioDetails({institutionPortfolio: data}, privatekey, requiredFields);
    }
  }

  getIncubators(details, tabName, privatekey) {
    let data = this.state.institutionPortfolio;
    data[tabName] = details;
    this.props.getPortfolioDetails({institutionPortfolio: data}, privatekey);
  }

  getManagementDetails(details, privatekey, requiredFields) {
    let data = this.state.institutionPortfolio;
    if (data && !data.management) {
      data['management'] = [];
    }
    data['management'] = details;
    this.setState({institutionPortfolio: data})
    var object = omitDeep(data, 'logo');
    this.props.getPortfolioDetails({institutionPortfolio: object}, privatekey, requiredFields);
  }

  getInvestorDetails(details, privatekey) {
    let data = this.state.institutionPortfolio;
    data['investor'] = details;
    this.setState({institutionPortfolio: data})
    var object = omitDeep(data, 'logo');
    this.props.getPortfolioDetails({institutionPortfolio: object}, privatekey);
  }

  getPartnersDetails(details, privatekey) {
    let data = this.state.institutionPortfolio;
    data['partners'] = details;
    this.setState({institutionPortfolio: data})
    var object = omitDeep(data, 'logo');
    this.props.getPortfolioDetails({institutionPortfolio: object}, privatekey);
  }

  getAwardsDetails(details, privatekey, requiredFields) {
    let data = this.state.institutionPortfolio;
    if (data && !data.awardsRecognition) {
      data['awardsRecognition'] = [];
    }
    data['awardsRecognition'] = details;
    this.setState({institutionPortfolio: data})
    var object = omitDeep(data, 'logo');
    this.props.getPortfolioDetails({institutionPortfolio: object}, privatekey, requiredFields);
  }

  getIntrapreneurDetails(details, privatekey) {
    let data = this.state.institutionPortfolio;
    if (data && !data.awardsRecognition) {
      data['intrapreneurRecognition'] = [];
    }
    data['intrapreneurRecognition'] = details;
    this.setState({institutionPortfolio: data})
    var object = omitDeep(data, 'logo')
    this.props.getPortfolioDetails({institutionPortfolio: object}, privatekey);
  }

  getRDDetails(details, privatekey, requiredFields) {
    let data = this.state.institutionPortfolio;
    if (data && !data.awardsRecognition) {
      data['researchAndDevelopment'] = [];
    }
    data['researchAndDevelopment'] = details;
    this.setState({institutionPortfolio: data});
    var object = omitDeep(data, 'logo')
    this.props.getPortfolioDetails({institutionPortfolio: object}, privatekey, requiredFields);
  }

  getLookingForDetails(details, privateKey, requiredFields) {
    let data = this.state.institutionPortfolio;
    if (data && !data.lookingFor) {
      data['lookingFor'] = [];
    }
    data['lookingFor'] = details;
    this.setState({institutionPortfolio: data});
    this.sendDataToParentPortfolio(this.state.institutionPortfolio, privateKey, requiredFields);
    // this.props.getPortfolioDetails({institutionPortfolio: this.state.institutionPortfolio}, privatekey, requiredFields);
  }

  getChartDetails(details, tabName) {
    let data = this.state.institutionPortfolio;
    data[tabName] = details;
    this.props.getPortfolioDetails({institutionPortfolio: data});
  }

  getDataDetails(details, tabName, privatekey) {
    let data = this.state.institutionPortfolio;
    data[tabName] = details;
    this.props.getPortfolioDetails({institutionPortfolio: data}, privatekey);
  }

  getInstitutionMCL(details, privateKey) {
    let data = this.state.institutionPortfolio;
    if (details.memberships) {
      data['memberships'] = details.memberships;
    }
    if (details.compliances) {
      data['compliances'] = details.compliances;
    }
    if (details.licenses) {
      data['licenses'] = details.licenses;
    }
    this.setState({institutionPortfolio: data});
    this.sendDataToParentPortfolio(this.state.institutionPortfolio, privateKey);
    // this.props.getPortfolioDetails({institutionPortfolio: this.state.institutionPortfolio}, privateKey);
  }

  sendDataToParentPortfolio(data, privateKey, requiredFields){
    var object = omitDeep(data, 'logo');
    this.props.getPortfolioDetails({institutionPortfolio: object}, privateKey, requiredFields);
  }


  getAllPrivateKeys(privateKeys, removePrivateKeys) {
    let privateObject = this.state.portfolioKeys;
    privateObject['privateKeys'] = privateKeys;
    privateObject['removePrivateKeys'] = removePrivateKeys;
    this.setState({ portfolioKeys: privateObject });
    return privateObject
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
    // return  <MlVerticalTabComponent/>
  }

}
MlAppInstitutionEditTabs.childContextTypes = {
  institutionPortfolio: PropTypes.object,
  portfolioKeys: PropTypes.object
};

