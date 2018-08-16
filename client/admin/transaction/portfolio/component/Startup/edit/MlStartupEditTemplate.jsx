import React, { Component, PropTypes } from "react";
import { connect } from 'react-redux';
import _ from "lodash";
import omitDeep from 'omit-deep-lodash';
import MlTabComponent from "../../../../../../commons/components/tabcomponent/MlTabComponent";
import MlStartupManagement from "./MlStartupManagement";
import MlStartupAboutUsLandingPage from "./aboutUs/MlStartupAboutUsLandingPage";
import MlStartupInvestor from "./MlStartupInvestor";
import MlStartupData from "./MlStartupData";
import MlStartupAwards from "./MlStartupAwards";
import MlStartupMCL from "./MlStartupMCL";
import MlStartupLookingFor from "./MlStartupLookingFor";
import PortfolioLibrary from '../../../../../../commons/components/portfolioLibrary/PortfolioLibrary'
import MlStartupCharts from "./MlStartupCharts/MlStartupCharts";
import MlFunderServices from "../../Funders/edit/MlFunderServices"
import {client} from '../../../../../core/apolloConnection'


class MlStartupEditTemplate extends Component {
  constructor(props) {
    // console.log('LOG from MlStartupEditTemplate');
    super(props)
    this.state = {tabs: [], aboutUs: {}, startupPortfolio: {}, portfolioKeys: {privateKeys: [], removePrivateKeys: []}};
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
        component: <MlStartupAboutUsLandingPage key="1" isAdmin={true} getAboutus={this.getAboutus.bind(this)}
                                     portfolioDetailsId={this.props.portfolioDetailsId}
                                     backClickHandler={this.backClickHandler.bind(this)}/>
      },
      {
        tabClassName: 'tab',
        panelClassName: 'panel',
        name: "Management",
        title: "Management",
        component: <MlStartupManagement client={client} isAdmin={true} key="2" tabName={"management"}
                                        getManagementDetails={this.getManagementDetails.bind(this)}
                                        portfolioDetailsId={this.props.portfolioDetailsId}/>
      },
      {
        tabClassName: 'tab',
        panelClassName: 'panel',
        title: "Investor",
        name: "Investor",
        component: <MlStartupInvestor key="3" getInvestorDetails={this.getInvestorDetails.bind(this)} client={client}
                                      portfolioDetailsId={this.props.portfolioDetailsId} tabName="investor"/>
      },
      {
        tabClassName: 'tab',
        panelClassName: 'panel',
        title: "Data",
        name: "Data",
        component: <MlStartupData key="4" isApp={false} isAdmin={true} client={client} getDataDetails={this.getDataDetails.bind(this)}
                                  portfolioDetailsId={this.props.portfolioDetailsId}/>
      },
      {
        tabClassName: 'tab',
        panelClassName: 'panel',
        title: "Charts",
        name: "Charts",
        component: <MlStartupCharts key="5" getChartDetails={this.getChartDetails.bind(this)} isAdmin={true}
                                    portfolioDetailsId={this.props.portfolioDetailsId}/>
      },
      {
        tabClassName: 'tab',
        panelClassName: 'panel',
        title: "Awards",
        name: "Awards",
        component: <MlStartupAwards key="6" getAwardsDetails={this.getAwardsDetails.bind(this)} client={client}
                                    portfolioDetailsId={this.props.portfolioDetailsId} tabName="awardsRecognition"/>
      },
      {
        tabClassName: 'tab',
        panelClassName: 'panel',
        title: "Library",
        name: "Library",
        component: <PortfolioLibrary key="7" isAdmin={false} client={client}
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
        component: <MlStartupLookingFor key="9" getLookingForDetails={this.getLookingForDetails.bind(this)} client={client}
                                        portfolioDetailsId={this.props.portfolioDetailsId} tabName="lookingFor"/>
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

  getAboutus(details, tabName, privateKey, requiredFields) {
    let data = this.state.startupPortfolio;
    data[tabName] = details;
    const object = omitDeep(data, ['logo', 'privateFields']);
    // this.props.getPortfolioDetails({startupPortfolio: data}, privateKey, requiredFields);
    this.props.getPortfolioDetails({startupPortfolio: object}, privateKey, requiredFields);
  }

  getDataDetails(details, tabName) {
    let data = this.state.startupPortfolio;
    data[tabName] = details;
    this.props.getPortfolioDetails({startupPortfolio: data});
  }

  getManagementDetails(details, privateKey, requiredFields) {
    let data = this.state.startupPortfolio;
    // if (data && !data.management) {
    //   data['management'] = [];
    // }
    data['management'] = details;
    this.setState({startupPortfolio: data})
    var object = omitDeep(data, 'logo');
    this.props.getPortfolioDetails({startupPortfolio: object}, privateKey, requiredFields);
  }

  getInvestorDetails(details, privateKey, requiredFields) {
    let data = this.state.startupPortfolio;
    data['investor'] = details;
    this.setState({startupPortfolio: data})
    var object = omitDeep(data, 'logo');
    this.props.getPortfolioDetails({startupPortfolio: object}, privateKey, requiredFields);
  }

  getAwardsDetails(details, privateKey, requiredFields) {
    let data = this.state.startupPortfolio;
    data['awardsRecognition'] = details;
    this.setState({startupPortfolio: data})
    var object = omitDeep(data, 'logo');
    this.props.getPortfolioDetails({startupPortfolio: object}, privateKey, requiredFields);
  }

  getLookingForDetails(details, privateKey, requiredFields) {
    let data = this.state.startupPortfolio;
    if (data && !data.lookingFor) {
      data['lookingFor'] = [];
    }
    data['lookingFor'] = details;
    this.setState({startupPortfolio: data});
    this.sendDataToParentPortfolio(this.state.startupPortfolio, privateKey, requiredFields);
    // this.props.getPortfolioDetails({startupPortfolio: this.state.startupPortfolio}, privateKey, requiredFields);
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
    this.setState({startupPortfolio: data});
    this.sendDataToParentPortfolio(this.state.startupPortfolio, privateKey);
    // this.props.getPortfolioDetails({startupPortfolio: this.state.startupPortfolio}, privateKey);
  }

  getChartDetails(details, tabName) {
    let data = this.state.startupPortfolio;
    data[tabName] = details;
    this.props.getPortfolioDetails({startupPortfolio: data});
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
MlStartupEditTemplate.childContextTypes = {
  startupPortfolio: PropTypes.object,
  portfolioKeys: PropTypes.object
};

// const mapStateToProps = (state) => {
//   return {
//     mlStartupEditTemplate: state,
//   };
// }

// const mapDispatchToProps = (dispatch) => {
//   return {
//     onChangePrivateKeys: (keys) => dispatch({
//       type: 'CHANGE_PRIVATE_KEYS',
//       payload: keys,
//     }),
//   };
// };

// export default connect(mapStateToProps, mapDispatchToProps)(MlStartupEditTemplate);
export default MlStartupEditTemplate;
