import React, { Component, PropTypes }  from "react";
import MlTabComponent from "../../../../../../../commons/components/tabcomponent/MlTabComponent";
// import PortfolioLibrary from '../../../../../../commons/components/portfolioLibrary/PortfolioLibrary'
import {client} from '../../../../../../core/apolloConnection'
import {appClient} from '../../../../../../../app/core/appConnection'
import MlCompanyViewEvolution from './MlCompanyViewEvolution'
import MlCompanyViewPolicy from './MlCompanyViewPolicy'
import MlCompanyViewAchievements from './MlCompanyViewAchievements'
import MlCompanyCSRReports from '../../edit/CSR/MlCompanyCSRReports'

export default class MlCSRViewTabs extends Component {
  constructor(props){
    super(props);
    this.state =  {tabs: [], activeTab: 'Achievements',admin:true};
  }
  componentDidMount(){
    var props = this.props
    setTimeout(function () {
      if (!props.isApp) {
        $('div[role="tab"]').each(function (index) {
          var test = $(this).text();
          $(this).empty();
          $(this).html('<div class="moolya_btn moolya_btn_in">' + test + '</div>');
        });
        $('.last-item').addClass('menunone');
        $('.RRT__tabs').addClass('horizon-swiper');
        $('.RRT__tab').addClass('horizon-item');
        $('.RRT__panel').addClass('nomargintop');
        $('.RRT__panel .RRT__panel').removeClass('nomargintop');
        $('.horizon-swiper').horizonSwiper();
      } else {
        $('.RRT__tabs').addClass('menunone');
        $('.RRT__container .RRT__container .RRT__tabs').removeClass('menunone');
      }
    }, 10);
    // let path = FlowRouter._current.path;
    // if (path.indexOf("app") != -1) {
    //   this.setState({admin: false, client: appClient})
    // }
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
      this.setState({activeTab,tabs:AllTabs,admin});
    }else
    this.setState({tabs:AllTabs,admin});
    this.setBackTab()
  }
  setBackTab(e) {
    this.props.backClickHandler(this.getCompanyCSRs.bind(this))
  }

  getCompanyCSRs() {
    this.props.backClickHandler();
    $('.RRT__tab--first').click();
  }

  backClickHandler(){
    let tabs = this.state.tabs;
    this.setState({tabs: tabs})
  }

  getTabComponents(){
    let tabs = [
      {tabClassName: 'tab', panelClassName: 'panel', title:"Achievements" , component:<MlCompanyViewAchievements key="1" isAdmin={true} portfolioDetailsId={this.props.portfolioDetailsId} getSelectedAnnotations={this.props.getSelectedAnnotations}/>},
      {tabClassName: 'tab', panelClassName: 'panel', title:"Evolution" , component:<MlCompanyViewEvolution key="2"  portfolioDetailsId={this.props.portfolioDetailsId} getSelectedAnnotations={this.props.getSelectedAnnotations} tabName={"evolution"}/>},
      {tabClassName: 'tab', panelClassName: 'panel', title:"Reports" , component:<MlCompanyCSRReports key="3" portfolioDetailsId={this.props.portfolioDetailsId} />},
      {tabClassName: 'tab', panelClassName: 'panel', title:"Policy" , component:<MlCompanyViewPolicy key="4" client={client} portfolioDetailsId={this.props.portfolioDetailsId} getSelectedAnnotations={this.props.getSelectedAnnotations}  tabName={"policy"}/>},
    ]
    return tabs;
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
