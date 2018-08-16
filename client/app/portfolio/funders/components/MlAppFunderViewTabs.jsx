import React, { Component, PropTypes }  from "react";
import {render} from "react-dom";
import MlTabComponent from "../../../../commons/components/tabcomponent/MlTabComponent";
import MlFunderAboutView from '../../../../admin/transaction/portfolio/component/Funders/view/MlFunderAboutView'
import MlFunderInvestmentView from '../../../../admin/transaction/portfolio/component/Funders/view/MlFunderInvestmentView'
import MlFunderEngagementMethodView from '../../../../admin/transaction/portfolio/component/Funders/view/MlFunderEngagementMethodView'
import MlFunderAreaOfInterestView from '../../../../admin/transaction/portfolio/component/Funders/view/MlFunderAreaOfInterestView'
import MlFunderLibraryView from '../../../../admin/transaction/portfolio/component/Funders/view/MlFunderLibraryView'
import MlFunderNewsView from '../../../../admin/transaction/portfolio/component/Funders/view/MlFunderNewsView'
import MlFunderPrincipalTeamView from '../../../../admin/transaction/portfolio/component/Funders/view/MlFunderPrincipalTeamView'
import MlFunderSuccessStoriesView from '../../../../admin/transaction/portfolio/component/Funders/view/MlFunderSuccessStoriesView'
import MlFunderLookingForView from '../../../../admin/transaction/portfolio/component/Funders/view/MlFunderLookingForView'
import MlBeSpokeListView from '../../../../admin/transaction/portfolio/component/Funders/edit/Services/Container/MlFunderServicesList'
import {appClient} from '../../../core/appConnection'
import PortfolioLibrary from '../../../../commons/components/portfolioLibrary/PortfolioLibrary';

export default class MlAppFunderViewTabs extends React.Component{
  constructor(props){
    super(props)
    this.state =  {tabs: [],aboutUs: {}, funderPortfolio:{},activeTab:'About'};
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

  getTabComponents(){
    let tabs = [
      {tabClassName: 'tab', panelClassName: 'panel', title:"About" ,name:"About", component:<MlFunderAboutView key="1" portfolioDetailsId={this.props.portfolioDetailsId} getSelectedAnnotations={this.props.getSelectedAnnotations} client={appClient} />},
      {tabClassName: 'tab', panelClassName: 'panel', title:"Investments" ,  name:"Investments" ,component:<MlFunderInvestmentView key="2" portfolioDetailsId={this.props.portfolioDetailsId} getSelectedAnnotations={this.props.getSelectedAnnotations}/>},
      {tabClassName: 'tab', panelClassName: 'panel', title:"Principals & Team" , name:"Principals And Team" ,component:<MlFunderPrincipalTeamView key="3" portfolioDetailsId={this.props.portfolioDetailsId} getSelectedAnnotations={this.props.getSelectedAnnotations}/>},
      {tabClassName: 'tab', panelClassName: 'panel', title:"Engagement Methods" ,  name:"Engagement Methods" ,component:<MlFunderEngagementMethodView key="4" portfolioDetailsId={this.props.portfolioDetailsId} getSelectedAnnotations={this.props.getSelectedAnnotations}/>},
      {tabClassName: 'tab', panelClassName: 'panel', title:"Areas Of Interest" ,  name:"Areas Of Interest" ,component:<MlFunderAreaOfInterestView key="6" portfolioDetailsId={this.props.portfolioDetailsId} getSelectedAnnotations={this.props.getSelectedAnnotations}/>},
      {tabClassName: 'tab', panelClassName: 'panel', title:"Success Stories" ,name:"Success Stories" , component:<MlFunderSuccessStoriesView key="7" portfolioDetailsId={this.props.portfolioDetailsId} getSelectedAnnotations={this.props.getSelectedAnnotations}/>},
      {tabClassName: 'tab', panelClassName: 'panel', title:"Library" ,name:"Library" , component:<PortfolioLibrary view={true} client={appClient} key="8" portfolioDetailsId={this.props.portfolioDetailsId}/>},
      {tabClassName: 'tab', panelClassName: 'panel', title:"News" ,  name:"News" , component:<MlFunderNewsView key="9" portfolioDetailsId={this.props.portfolioDetailsId} getSelectedAnnotations={this.props.getSelectedAnnotations}/>},
      {tabClassName: 'tab', panelClassName: 'panel', title:"Looking For" , name:"Looking For" , component:<MlFunderLookingForView key="11" tabName="lookingFor" portfolioDetailsId={this.props.portfolioDetailsId} getSelectedAnnotations={this.props.getSelectedAnnotations}/>},
      {tabClassName: 'tab', panelClassName: 'panel', title:"Services" , name:"Services" ,  component:<MlBeSpokeListView view={true}  myPortfolio={true} key="10" portfolioDetailsId={this.props.portfolioDetailsId}/>} //getFunderServicesDetails={this.getFunderServicesDetails.bind(this)} portfolioDetailsId={this.props.portfolioDetailsId}
    ]
    return tabs;
  }

  componentWillMount()
  {
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
    this.setState({tabs:getTabs() ||[]});
  }
  updateTab(index){
    let tab =  this.state.tabs[index].title;
    FlowRouter.setQueryParams({ tab: tab });
  }
  render(){
    let tabs = this.state.tabs;
    return <MlTabComponent tabs={tabs} selectedTabKey={this.state.activeTab}  onChange={this.updateTab} type="tab" mkey="name"/>
  }
}
