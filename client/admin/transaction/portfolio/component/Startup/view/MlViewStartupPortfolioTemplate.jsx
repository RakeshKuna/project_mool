import React, { Component, PropTypes }  from "react";
import MlStartupViewAboutLanding from './aboutTabs/MlStartupViewAboutLanding'
import MlStartupViewManagement from './MlStartupViewManagement';
import MlStartupViewInvestor from './MlStartupViewInvestor';
import MlStartupViewAwards from './MlStartupViewAwards';
import MlStartupViewMCL from './MlStartupViewMCL';
import MlStartupViewLookingFor from './MlStartupViewLookingFor';
import MlTabComponent from "../../../../../../commons/components/tabcomponent/MlTabComponent";
import PortfolioLibrary from '../../../../../../commons/components/portfolioLibrary/PortfolioLibrary'
import {client} from '../../../../../core/apolloConnection'
import MlStartupViewCharts from './MlStartupViewCharts'

export default class MlViewStartupPortfolioTemplate extends React.Component {
  constructor(props){
    super(props);
    this.state =  {tabs: []};
  }
  componentDidMount(){
    setTimeout(function(){
      $('div[role="tab"]').each(function( index ) {
        var test = $(this).text();
        $(this).empty();
        $(this).html('<div class="moolya_btn moolya_btn_in">'+test+'</div>');
      });
      $('.RRT__tabs').addClass('horizon-swiper');
      $('.RRT__tab').addClass('horizon-item');
      $('.horizon-swiper').horizonSwiper();
    },300);
  }
  componentWillMount()
  {
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
    this.setState({tabs:getTabs() ||[]});
  }

  updateTab(index){
    let tab =  this.state.tabs[index].title;
    FlowRouter.setQueryParams({ tab: tab });
  }

  backClickHandler(){
    let tabs = this.state.tabs;
    this.setState({tabs: tabs})
  }

  getTabComponents(){
    let tabs = [
      { tabClassName: 'tab', panelClassName: 'panel', title: "About", name: "About", component: <MlStartupViewAboutLanding key="1" tabName="About" portfolioDetailsId={this.props.portfolioDetailsId} getSelectedAnnotations={this.props.getSelectedAnnotations} backClickHandler={this.backClickHandler.bind(this)} isAdmin={true} /> },
      {tabClassName: 'tab', panelClassName: 'panel', title:"Management" ,  name:"Management" ,component:<MlStartupViewManagement key="2" tabName="Management" isAdmin={true} client={client} portfolioDetailsId={this.props.portfolioDetailsId} getSelectedAnnotations={this.props.getSelectedAnnotations}/>},
      {tabClassName: 'tab', panelClassName: 'panel', title:"Investor" , name:"Investor" , component:<MlStartupViewInvestor key="3" tabName="Investor" portfolioDetailsId={this.props.portfolioDetailsId} getSelectedAnnotations={this.props.getSelectedAnnotations}/>},
      {tabClassName: 'tab', panelClassName: 'panel', title:"Charts" ,name:"Charts" , component:<MlStartupViewCharts key="5" tabName="Charts" isAdmin={true}  portfolioDetailsId={this.props.portfolioDetailsId}/>},
      {tabClassName: 'tab', panelClassName: 'panel', title:"Awards" ,name:"Awards" , component:<MlStartupViewAwards key="6" tabName="Awards" portfolioDetailsId={this.props.portfolioDetailsId} getSelectedAnnotations={this.props.getSelectedAnnotations}/>},
      {tabClassName: 'tab', panelClassName: 'panel', title:"Library" ,name:"Library" , component:<PortfolioLibrary view={true} isAdmin={true} tabName="Library" client={client}  key="7"  portfolioDetailsId={this.props.portfolioDetailsId} getSelectedAnnotations={this.props.getSelectedAnnotations}/>},
      {tabClassName: 'tab', panelClassName: 'panel', title:"M C & L" ,name:"M C And L" , component:<MlStartupViewMCL isAdmin={true} key="9" tabName="M C & L" portfolioDetailsId={this.props.portfolioDetailsId} getSelectedAnnotations={this.props.getSelectedAnnotations}/>},
      {tabClassName: 'tab', panelClassName: 'panel', title:"Looking For" ,name:"Looking For" , component:<MlStartupViewLookingFor key="10" tabName="Looking For"  portfolioDetailsId={this.props.portfolioDetailsId} getSelectedAnnotations={this.props.getSelectedAnnotations}/>}
    ]
    return tabs;
  }
  render(){
    let tabs = this.state.tabs;
    return <MlTabComponent tabs={tabs} selectedTabKey={this.state.activeTab}  onChange={this.updateTab} type="tab" mkey="name"/>
  }
}
