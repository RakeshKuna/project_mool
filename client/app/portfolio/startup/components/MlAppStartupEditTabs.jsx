import React, {Component, PropTypes} from "react";
import _ from 'lodash'
import omitDeep from 'omit-deep-lodash';
import MlTabComponent from "../../../../commons/components/tabcomponent/MlTabComponent";
import MlStartupAboutUsLandingPage from "../../../../admin/transaction/portfolio/component/Startup/edit/aboutUs/MlStartupAboutUsLandingPage"
import MlStartupManagement from "../../../../admin/transaction/portfolio/component/Startup/edit/MlStartupManagement"
import MlStartupInvestor from "../../../../admin/transaction/portfolio/component/Startup/edit/MlStartupInvestor";
import MlStartupData from "../../../../admin/transaction/portfolio/component/Startup/edit/MlStartupData";
import MlStartupCharts from "../../../../admin/transaction/portfolio/component/Startup/edit/MlStartupCharts/MlStartupCharts";
import MlStartupAwards from "../../../../admin/transaction/portfolio/component/Startup/edit/MlStartupAwards";
import MlStartupMCL from "../../../../admin/transaction/portfolio/component/Startup/edit/MlStartupMCL";
import MlStartupLookingFor from "../../../../admin/transaction/portfolio/component/Startup/edit/MlStartupLookingFor";
import MlFunderServices from "../../../../admin/transaction/portfolio/component/Funders/edit/MlFunderServices"
import PortfolioLibrary from '../../../../commons/components/portfolioLibrary/PortfolioLibrary'
import {appClient} from '../../../core/appConnection'
// import MlVerticalTabComponent from '../../../commons/components/tabcomponent/MlVerticalTabComponent'
// import { connect } from 'react-redux';

class MlAppStartupEditTabs extends Component {

  constructor(props) {
    console.log('LOG from MlAppStartupEditTabs');
    super(props)
    this.state = {tabs: [], aboutUs: {}, startupPortfolio: {}, portfolioKeys: {privateKeys: [], removePrivateKeys: []}
    , activeTab:'About'};
    this.getChildContext.bind(this)
    this.getManagementDetails.bind(this);
    this.getAwardsDetails.bind(this);
    this.getLookingForDetails.bind(this);
    this.getStartupMCL.bind(this)
  }

  getChildContext() {
    return {
      startupPortfolio: this.state.startupPortfolio,
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
        component: <MlStartupAboutUsLandingPage client={appClient} isAdmin={false} key="1" getAboutus={this.getAboutus.bind(this)}
                                     portfolioDetailsId={this.props.portfolioDetailsId}
                                     backClickHandler={this.setBackHandler.bind(this)} isApp={true}/>
      },
      {
        tabClassName: 'tab',
        panelClassName: 'panel',
        title: "Management",
        name: "Management",
        component: <MlStartupManagement key="2" isAdmin={false} client={appClient} tabName={"management"}
                                        getManagementDetails={this.getManagementDetails.bind(this)}
                                        portfolioDetailsId={this.props.portfolioDetailsId}/>
      },
      {
        tabClassName: 'tab',
        panelClassName: 'panel',
        title: "Investor",
        name: "Investor",
        component: <MlStartupInvestor client={appClient} isAdmin={false} key="3"
                                      getInvestorDetails={this.getInvestorDetails.bind(this)}
                                      portfolioDetailsId={this.props.portfolioDetailsId} tabName="investor"/>
      },
      {
        tabClassName: 'tab',
        panelClassName: 'panel',
        title: "Data",
        name: "Data",
        component: <MlStartupData client={appClient} key="4" getDataDetails={this.getDataDetails.bind(this)}
                                  portfolioDetailsId={this.props.portfolioDetailsId} isApp={true}/>
      },
      {
        tabClassName: 'tab',
        panelClassName: 'panel',
        title: "Charts",
        name: "Charts",
        component: <MlStartupCharts key="5" client={appClient} isAdmin={false}
                                    getChartDetails={this.getChartDetails.bind(this)}
                                    portfolioDetailsId={this.props.portfolioDetailsId}
                                    backClickHandler={this.setBackHandler.bind(this)} isApp={true}/>
      },
      {
        tabClassName: 'tab',
        panelClassName: 'panel',
        title: "Awards",
        name: "Awards",
        component: <MlStartupAwards client={appClient} isAdmin={false} key="6"
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
        component: <MlStartupMCL key="8" getStartupMCL={this.getStartupMCL.bind(this)}
                                 portfolioDetailsId={this.props.portfolioDetailsId}/>
      },
      {
        tabClassName: 'tab',
        panelClassName: 'panel',
        title: "Looking For",
        name: "Looking For",
        component: <MlStartupLookingFor key="9" getLookingForDetails={this.getLookingForDetails.bind(this)}
                                        portfolioDetailsId={this.props.portfolioDetailsId} tabName="lookingFor"/>
      },
      {
        tabClassName: 'tab',
        panelClassName: 'panel',
        title: "Services",
        name: "Services",
        component: <MlFunderServices key="10" tabName="Services" portfolioDetailsId={this.props.portfolioDetailsId}/>
      }
    ];
    return tabs;
  }

  getAboutus(details, tabName, privatekey, requiredFields) {
    let data = this.state.startupPortfolio;
    data[tabName] = details;
    const object = omitDeep(data, ['logo', 'privateFields']);
    this.props.getPortfolioDetails({startupPortfolio: object}, privatekey, requiredFields);
  }

  getManagementDetails(details, privatekey, requiredFields) {
    let data = this.state.startupPortfolio;
    data['management'] = details;
    this.setState({startupPortfolio: data})
    var object = omitDeep(data, 'logo');
    this.props.getPortfolioDetails({startupPortfolio: object}, privatekey, requiredFields);
  }

  getInvestorDetails(details, privatekey, requiredFields) {
    let data = this.state.startupPortfolio;
    data['investor'] = details;
    this.setState({startupPortfolio: data})
    var object = omitDeep(data, 'logo');
    this.props.getPortfolioDetails({startupPortfolio: object}, privatekey, requiredFields);
  }

  getAwardsDetails(details, privatekey, requiredFields) {
    let data = this.state.startupPortfolio;
    data['awardsRecognition'] = details;
    this.setState({startupPortfolio: data})
    var object = omitDeep(data, 'logo');
    this.props.getPortfolioDetails({startupPortfolio: object}, privatekey, requiredFields);
  }

  getLookingForDetails(details, privateKey, requiredFields) {
    let data = this.state.startupPortfolio;
    if (data && !data.lookingFor) {
      data['lookingFor'] = [];
    }
    data['lookingFor'] = details;
    this.setState({startupPortfolio: data});
    // this.props.getPortfolioDetails({startupPortfolio: this.state.startupPortfolio}, privatekey, requiredFields);
    this.sendDataToParentPortfolio(this.state.startupPortfolio, privateKey, requiredFields);
  }

  getChartDetails(details, tabName) {
    let data = this.state.startupPortfolio;
    data[tabName] = details;
    this.props.getPortfolioDetails({startupPortfolio: data});
  }

  getDataDetails(details, tabName, privatekey) {
    let data = this.state.startupPortfolio;
    data[tabName] = details;
    this.props.getPortfolioDetails({startupPortfolio: data}, privatekey);
  }

  getStartupMCL(details, privateKey) {
    let data = this.state.startupPortfolio;
    if (details.memberships) {
      data['memberships'] = details.memberships;
    }
    if (details.compliances) {
      data['compliances'] = details.compliances;
    }
    if (details.licenses) {
      data['licenses'] = details.licenses;
    }
    this.setState({startupPortfolio: data})
    // this.props.getPortfolioDetails({startupPortfolio: this.state.startupPortfolio}, privatekey);
    this.sendDataToParentPortfolio(this.state.startupPortfolio, privateKey);
  }

  /**
   * @Note: send data to parent portfolio
   * */
  sendDataToParentPortfolio(data, privateKey, requiredFields){
    var object = omitDeep(data, 'logo');
    this.props.getPortfolioDetails({startupPortfolio: object}, privateKey, requiredFields);
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
MlAppStartupEditTabs.childContextTypes = {
  startupPortfolio: PropTypes.object,
  portfolioKeys: PropTypes.object
};
// const mapStateToProps = (state) => {
//   return {
//     mlStartupEditTemplate: state,
//   };
// }
//
// const mapDispatchToProps = (dispatch) => {
//   return {
//     onChangePrivateKeys: (keys) => dispatch({
//       type: 'CHANGE_PRIVATE_KEYS',
//       payload: keys,
//     }),
//   };
// };

// export default connect(mapStateToProps, mapDispatchToProps)(MlAppStartupEditTabs);
export default MlAppStartupEditTabs

