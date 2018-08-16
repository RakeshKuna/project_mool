/**
 * Created by vishwadeep on 8/7/17.
 */

/**
 * Import of all the usable components
 * */
import React, {Component, PropTypes} from "react";
import _ from "lodash";
import omitDeep from 'omit-deep-lodash';
import MlTabComponent from "../../../../commons/components/tabcomponent/MlTabComponent";
import MlServiceProviderAbout from '../../../../admin/transaction/portfolio/component/ServiceProvider/edit/MlServiceProviderAbout'
import MlServiceProviderAwards from "../../../../admin/transaction/portfolio/component/ServiceProvider/edit/MlServiceProviderAwards";
import MlServiceProviderMCL from "../../../../admin/transaction/portfolio/component/ServiceProvider/edit/MlServiceProviderMCL";
import MlServiceProviderClients from "../../../../admin/transaction/portfolio/component/ServiceProvider/edit/MlServiceProviderClients";
import MlServiceProviderLookingFor from "../../../../admin/transaction/portfolio/component/ServiceProvider/edit/MlServiceProviderLookingFor";
import PortfolioLibrary from '../../../../commons/components/portfolioLibrary/PortfolioLibrary'
import MlFunderServices from '../../../../admin/transaction/portfolio/component/Funders/edit/MlFunderServices'
import {appClient} from '../../../core/appConnection'
import {getProfileBasedOnPortfolio} from '../../../calendar/manageScheduler/service/actions/MlServiceActionHandler'
// import MlServiceProviderServices from "../../../admin/transaction/portfolio/component/ServiceProvider/edit/MlServiceProviderServices";
import MlServiceProviderViewServices from "../../../../admin/transaction/portfolio/component/ServiceProvider/view/MlServiceProviderViewServices";

export default class MlAppServiceProviderEditTabs extends Component {
  constructor(props) {
    super(props)
    this.state = {tabs: [], aboutUs: {}, serviceProviderPortfolio: {}, portfolioKeys: {privateKeys: [],
      removePrivateKeys: []}, activeTab:'About'};
    this.getChildContext.bind(this)
    this.getAwardsDetails.bind(this);
    this.getFunderLibrary.bind(this);
    this.saveDataToServices = this.saveDataToServices.bind(this);
    this.getServiceDetails = this.getServiceDetails.bind(this);
  }

  getChildContext() {
    return {
      serviceProviderPortfolio: this.state.serviceProviderPortfolio,
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

  /**
   * Display of all tabs of service provider and passing the portfolioId
   * */
  getTabComponents() {
    let tabs = [
      {
        tabClassName: 'tab',
        panelClassName: 'panel',
        title: "About",
        component: <MlServiceProviderAbout client={appClient} isAdmin={false} key="1" getAboutus={this.getAboutus.bind(this)}
                                           portfolioDetailsId={this.props.portfolioDetailsId}/>
      },
      {
        tabClassName: 'tab',
        panelClassName: 'panel',
        title: "Awards and Rewards",
        component: <MlServiceProviderAwards client={appClient} isAdmin={false} key="2" getAwardsDetails={this.getAwardsDetails.bind(this)}
                                            portfolioDetailsId={this.props.portfolioDetailsId} tabName="awardsRecognition"/>
      },
      {
        tabClassName: 'tab',
        panelClassName: 'panel',
        title: "Library",
        component: <PortfolioLibrary isAdmin={false} client={appClient} key="3" getFunderLibrary={this.getFunderLibrary.bind(this)}
                                     portfolioDetailsId={this.props.portfolioDetailsId}/>
      },
      {
        tabClassName: 'tab',
        panelClassName: 'panel',
        title: "MCL",
        component: <MlServiceProviderMCL isAdmin={false} client={appClient} key="4" getServiceProviderMCL={this.getServiceProviderMCL.bind(this)}
                                         portfolioDetailsId={this.props.portfolioDetailsId}/>
      },
      // {
      //   tabClassName: 'tab',
      //   panelClassName: 'panel',
      //   title: "Services",
      //   component: <MlServiceProviderServices key="5" client={appClient} isAdmin={false}
      //                                         getServiceProviderServices={this.getServiceProviderServices.bind(this)}
      //                                         portfolioDetailsId={this.props.portfolioDetailsId}/>
      // },
      {
        tabClassName: 'tab',
        panelClassName: 'panel',
        title: "Clients",
        component: <MlServiceProviderClients key="5" client={appClient} isAdmin={false}
                                             getServiceProviderClients={this.getServiceProviderClients.bind(this)}
                                             portfolioDetailsId={this.props.portfolioDetailsId} tabName="clients"/>
      },
      {
        tabClassName: 'tab',
        panelClassName: 'panel',
        title: "Looking For",
        component: <MlServiceProviderLookingFor key="6" client={appClient} isAdmin={false}
                                             getLookingForDetails={this.getLookingForDetails.bind(this)}
                                             portfolioDetailsId={this.props.portfolioDetailsId} tabName="lookingFor"/>
      },
      {
        tabClassName: 'tab',
        panelClassName: 'panel',
        title: "Services",
        component: <MlFunderServices myPortfolio={true} createServiceMode={true} client={appClient} isAdmin={false}
                                     key="10" getServiceDetails={this.getServiceDetails.bind(this)}
                                     portfolioDetailsId={this.props.portfolioDetailsId} tabName="Services"/>
      }
    ];
    return tabs;
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

  async saveDataToServices(portfolioId) {
    const resp = await getProfileBasedOnPortfolio(portfolioId)
    // this.saveServiceDetails()
    return resp
  }

  getLookingForDetails(details, privatekey, requiredFields) {
    let data = this.state.serviceProviderPortfolio;
    if (data && !data.lookingFor) {
      data['lookingFor'] = [];
    }
    data['lookingFor'] = details;
    this.setState({serviceProviderPortfolio: data})
    const object = omitDeep(data, 'logo');
    this.props.getPortfolioDetails({serviceProviderPortfolio: object}, privatekey, requiredFields);
  }
  /**
   * getting all values from the child components and passing all to Main component through props
   * */
  getAboutus(details, privateKey) {
    let data = this.state.serviceProviderPortfolio;
    data['about'] = details;
    this.setState({serviceProviderPortfolio: data})
    const object = omitDeep(data, 'logo');
    this.props.getPortfolioDetails({serviceProviderPortfolio: object}, privateKey);
  }

  getAwardsDetails(details, privateKey, requiredFields) {
    let data = this.state.serviceProviderPortfolio;
    if (data && !data.awardsRecognition) {
      data['awardsRecognition'] = [];
    }
    data['awardsRecognition'] = details;
    this.setState({serviceProviderPortfolio: data})
    const object = omitDeep(data, 'logo');
    this.props.getPortfolioDetails({serviceProviderPortfolio: object}, privateKey, requiredFields);
  }

  getServiceProviderMCL(details, privateKey) {
    let data = this.state.serviceProviderPortfolio;
    if (details.memberships) {
      data['memberships'] = details.memberships;
    }
    if (details.compliances) {
      data['compliances'] = details.compliances;
    }
    if (details.licenses) {
      data['licenses'] = details.licenses;
    }
    this.setState({serviceProviderPortfolio: data})
    const object = omitDeep(data, 'logo');
    this.props.getPortfolioDetails({serviceProviderPortfolio: object}, privateKey);
  }

  // getServiceProviderServices(details, privateKey) {
  //   let data = this.state.serviceProviderPortfolio;
  //   data['services']=details;
  //   this.setState({serviceProviderPortfolio : data})
  //   this.props.getPortfolioDetails({serviceProviderPortfolio:this.state.serviceProviderPortfolio}, privateKey);
  // }

  /**
   * Note: it has no use need to remove it
   * */
  getFunderLibrary(details) {
    // let data = this.state.serviceProviderPortfolio;
    // if (details.memberships) {
    //   data['memberships'] = details.memberships;
    // }
    // if (details.compliances) {
    //   data['compliances'] = details.compliances;
    // }
    // if (details.licenses) {
    //   data['licenses'] = details.licenses;
    // }
    // this.setState({serviceProviderPortfolio: data})
    // this.props.getPortfolioDetails({serviceProviderPortfolio: this.state.serviceProviderPortfolio}, []);
  }

  getServiceProviderClients(details, privateKey, requiredFields,) {
    var data = this.state.serviceProviderPortfolio;
    data['clients'] = details;
    this.setState({serviceProviderPortfolio: data})
    const object = omitDeep(data, 'logo')
    this.props.getPortfolioDetails({serviceProviderPortfolio: object}, privateKey, requiredFields);
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
        key: tab.title,
        getContent: () => tab.component
      }));
    }
    let activeTab = FlowRouter.getQueryParam('tab');
    if(activeTab){
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
    console.log('newProps', newProps);
    if (newProps) {
      const resp = this.getAllPrivateKeys(newProps.privateKeys, newProps.removePrivateKeys);
      return resp
    }
  }

  updateTab(index){
    let tab =  this.state.tabs[index].title;
    FlowRouter.setQueryParams({ tab: tab });
  }

  render() {
    let tabs = this.state.tabs;
    return <MlTabComponent tabs={tabs}  selectedTabKey={this.state.activeTab}  onChange={this.updateTab} type="tab" mkey="title"/>
  }
}

/**
 * preparing context of all the data coming from child component
 * */
MlAppServiceProviderEditTabs.childContextTypes = {
  serviceProviderPortfolio: PropTypes.object,
  portfolioKeys: PropTypes.object
};
