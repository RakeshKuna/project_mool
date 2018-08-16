
import React from "react";
import MlCompanyViewStartupIncubators from "./MlCompanyViewStartupIncubators";
import MlCompanyViewSectors from "./MlCompanyViewSectors";
import MlCompanyViewListOfIncubators from "./MlCompanyViewListOfIncubators";
import MlTabComponent from "../../../../../../../commons/components/tabcomponent/MlTabComponent";
import {client} from '../../../../../../core/apolloConnection';
import _ from 'lodash';
// import {appClient} from '../../../../../../../app/core/appConnection'

export default class MlCompanyIncubatorsViewTabs extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      tabs: [],
      portfolioIncubators: {},
      institutionIncubators: {},
      sectorsAndServices: {},
      listOfIncubators: {},
      admin: true,
      activeTab: 'Startup Incubators',
    };
  }

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
        $('.first-item').addClass('menunone');
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
    $('.RRT__tab--first').click();
  }

  getTabComponents(){
    let tabs = [
      {tabClassName: 'tab', panelClassName: 'panel', title:"Startup Incubators", component:<MlCompanyViewStartupIncubators client={client} isAdmin={true} key="1" portfolioDetailsId={this.props.portfolioDetailsId} getSelectedAnnotations={this.props.getSelectedAnnotations}/> },
      {tabClassName: 'tab', panelClassName: 'panel', title:"Sectors and Service" , component:<MlCompanyViewSectors key="2" portfolioDetailsId={this.props.portfolioDetailsId} getSelectedAnnotations={this.props.getSelectedAnnotations}/>},
      {tabClassName: 'tab', panelClassName: 'panel', title:"List of Incubators", component:<MlCompanyViewListOfIncubators client={client} isAdmin={true} key="3" portfolioDetailsId={this.props.portfolioDetailsId} getSelectedAnnotations={this.props.getSelectedAnnotations}/>},
    ]
    return tabs;
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
      return tabs.map((tab,index) => ({
        tabClassName: 'moolya_btn', // Optional
        panelClassName: 'panel1', // Optional
        title: tab.title,
        key:tab.title ,
        getContent: () => tab.component
      }));
    }
    let AllTabs =getTabs() ||[];
    // if(admin){
    //   AllTabs.forEach(function(v){ delete v.key });
    // }
    let activeTab = FlowRouter.getQueryParam('subtab');
    if(activeTab){
      this.setState({activeTab,admin,tabs:AllTabs});
    }else
    this.setState({tabs:AllTabs,admin});
    /**UI changes for back button*/  //+tab.tabClassName?tab.tabClassName:""
    this.setBackTab()
  }

  updateTab(index){
    let subtab =  this.state.tabs[index].title;
    FlowRouter.setQueryParams({ subtab });
  }

  render(){
    let tabs = this.state.tabs;
    // if(this.state.admin){
    //   return <MlTabComponent tabs={tabs} backClickHandler={this.props.backClickHandler}/>
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
