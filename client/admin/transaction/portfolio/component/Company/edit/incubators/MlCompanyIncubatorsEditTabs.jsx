
import React, { Component, PropTypes } from "react";
import {render} from "react-dom";
import MlCompanyStartupIncubators from "./MlCompanyStartupIncubators";
import MlCompanySectors from "./MlCompanySectors";
import MlCompanyListOfIncubators from "./MlCompanyListOfIncubators";
import MlTabComponent from "../../../../../../../commons/components/tabcomponent/MlTabComponent";
import {client} from '../../../../../../core/apolloConnection'
import {appClient} from '../../../../../../../app/core/appConnection'

export default class MlCompanyIncubatorsEditTabs extends React.Component{
  constructor(props){
    super(props)
    this.state =  {
      tabs: [],
      portfolioIncubators:{},
      startupIncubators:{},
      sectorsAndServices:[],
      listOfIncubators:{},
      admin: true,
      activeTab:"Startup Incubators",
    }
    ;
    // this.getChildContext.bind(this)
  }

  // getChildContext() {
  //   return {
  //     companyPortfolio: this.state.companyPortfolio,
  //     portfolioKeys: this.state.portfolioKeys
  //   }
  // }
  /**
   * handling different condition for app and admin
   * */
  componentDidMount(){
    var props = this.props
    setTimeout(function(){
      if(!props.isApp) {
        $('div[role="tab"]').each(function (index) {
          var test = $(this).text();
          $(this).empty();
          $(this).html('<div class="moolya_btn moolya_btn_in">' + test + '</div>');
        });
        $('.initialized').addClass('menunone');
        $('.RRT__tabs').addClass('horizon-swiper');
        $('.RRT__tab').addClass('horizon-item');
        $('.RRT__panel').addClass('nomargintop');
        $('.RRT__panel .RRT__panel').removeClass('nomargintop');
        $('.horizon-swiper').horizonSwiper();
      }else {
        $('.RRT__tabs').addClass('menunone');
        $('.RRT__container .RRT__container .RRT__tabs').removeClass('menunone');
      }
    },10);
    // let path = FlowRouter._current.path;
    // if (path.indexOf("app") != -1){
    //   this.setState({admin: false, client: appClient})
    // }
  }

  setBackTab(e) {
    this.props.backClickHandler(this.getIncubators.bind(this))
  }

  getIncubators() {
    this.props.backClickHandler();
    $('.RRT__tabs div:first-of-type').click();
  }

  getTabComponents(){
    let tabs = [
      {tabClassName: 'tab', panelClassName: 'panel', title:"Startup Incubators", component:<MlCompanyStartupIncubators client={client} isAdmin={true} key="1"  getStartupIncubators={this.getStartupIncubators.bind(this)} portfolioDetailsId={this.props.portfolioDetailsId} tabName="startupIncubators"/> },
      {tabClassName: 'tab', panelClassName: 'panel', title:"Sectors and Service" , component:<MlCompanySectors key="2" client={client} getSectors={this.getSectors.bind(this)} portfolioDetailsId={this.props.portfolioDetailsId} tabName="sectorsAndServices" />},
      {tabClassName: 'tab', panelClassName: 'panel', title:"List of Incubators", component:<MlCompanyListOfIncubators client={client} isAdmin={true} key="3" getListOfIncubators={this.getListOfIncubators.bind(this)} portfolioDetailsId={this.props.portfolioDetailsId} tabName="listOfIncubators" />},
    ]
    return tabs;
  }

  /**
   * @Note : need to check the use of maintaining state in this file
   * seems there is no use to maintain state in this file
   * */
  getStartupIncubators(details, privateKey){
    let data = this.state.startupIncubators;
    data=details;
    this.setState({startupIncubators : data})
    // let updateItem = _.omit(details, 'logo');
    this.props.getIncubators(details,"startupIncubators", privateKey);
  }
  getSectors(details, privateKey,requiredFields){
    let data = this.state.sectorsAndServices;
    data = details;
    this.setState({sectorsAndServices : data})
    this.props.getIncubators(data,"sectorsAndServices", privateKey,requiredFields);
  }
  getListOfIncubators(details, privateKey){
    let data = this.state.listOfIncubators;
    data = details;
    this.setState({listOfIncubators : data})
    this.props.getIncubators(data,"listOfIncubators", privateKey);
  }

  componentWillMount()
  {
    let admin=true;
    let path = FlowRouter._current.path;
    if (path.indexOf("app") != -1){
      admin = false;
    }
    let tabs = this.getTabComponents();
    function getTabs() {
      return tabs.map(tab => ({
        tabClassName: 'moolya_btn', // Optional
        panelClassName: 'panel1', // Optional
        title: tab.title,
        key:tab.title,
        getContent: () => tab.component
      }));
    }
    let AllTabs =getTabs() ||[];
    // if(admin){
    //   AllTabs.forEach(function(v){ delete v.key });
    // }
    let activeTab = FlowRouter.getQueryParam('subtab');
    if(activeTab){
      this.setState({tabs:AllTabs,activeTab,admin:admin});
    }else
    this.setState({tabs:AllTabs,admin:admin});
    /**UI changes for back button*/
    this.setBackTab()
  }

  updateTab(index){
    let subtab =  this.state.tabs[index].title;
    FlowRouter.setQueryParams({ subtab });
  }
  render(){
    let tabs = this.state.tabs;
    // if(this.state.admin){
    //   return <MlTabComponent tabs={tabs} backClickHandler={this.props.backClickHandler}
    //   />
    // }
    // else{
      return <MlTabComponent tabs={tabs}
                             selectedTabKey={this.state.activeTab}
                             onChange={this.updateTab}
                             backClickHandler={this.props.backClickHandler}
                             type="subtab" mkey="title"
      />
    }
  // }
}
// MlCompanyIncubatorsEditTabs.childContextTypes = {
//   companyPortfolio: PropTypes.object,
//   portfolioKeys :PropTypes.object,
// };
