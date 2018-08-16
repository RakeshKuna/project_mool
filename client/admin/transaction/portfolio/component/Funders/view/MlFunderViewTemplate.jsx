import React, { Component, PropTypes }  from "react";
import MlTabComponent from "../../../../../../commons/components/tabcomponent/MlTabComponent";
import MlFunderAboutView from './MlFunderAboutView'
import MlFunderInvestmentView from './MlFunderInvestmentView'
import MlFunderEngagementMethodView from './MlFunderEngagementMethodView'
import MlFunderAreaOfInterestView from './MlFunderAreaOfInterestView'
import MlFunderLibraryView from './MlFunderLibraryView'
import MlFunderNewsView from './MlFunderNewsView'
import PortfolioLibrary from '../../../../../../commons/components/portfolioLibrary/PortfolioLibrary'
import MlFunderPrincipalTeamView from './MlFunderPrincipalTeamView'
import MlFunderSuccessStoriesView from './MlFunderSuccessStoriesView'
import MlFunderLookingForView from './MlFunderLookingForView'
import {client} from '../../../../../core/apolloConnection'

export default class MlFunderViewTemplate extends React.Component{
  constructor(props){
    super(props)
    this.state =  {tabs: [],aboutUs: {}, funderPortfolio:{},activeTab:'About'};
    this.getChildContext.bind(this);
  }

  getChildContext(){
    return {
      funderPortfolio: this.state.funderPortfolio
    }
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
    const tabs = [
      { tabClassName: 'tab', panelClassName: 'panel', title: "About", name: "About", component: <MlFunderAboutView client={client} isAdmin={true} key="1" tabName="About" portfolioDetailsId={this.props.portfolioDetailsId} /> },
      { tabClassName: 'tab', panelClassName: 'panel', title: "Investments", name: "Investments", component: <MlFunderInvestmentView client={client} isAdmin={true} key="2" tabName="Investments" portfolioDetailsId={this.props.portfolioDetailsId} getSelectedAnnotations={this.props.getSelectedAnnotations} /> },
      { tabClassName: 'tab', panelClassName: 'panel', title: "Principals & Team", name: "Principals And Team", component: <MlFunderPrincipalTeamView client={client} isAdmin={true} key="3" tabName="Principals & Team" portfolioDetailsId={this.props.portfolioDetailsId} getSelectedAnnotations={this.props.getSelectedAnnotations} /> },
      { tabClassName: 'tab', panelClassName: 'panel', title: "Engagement Methods", name: "Engagement Methods", component: <MlFunderEngagementMethodView client={client} isAdmin={true} key="4" tabName="Engagement Methods" portfolioDetailsId={this.props.portfolioDetailsId} getSelectedAnnotations={this.props.getSelectedAnnotations} /> },
      { tabClassName: 'tab', panelClassName: 'panel', title: "Areas Of Interest", name: "Areas Of Interest", component: <MlFunderAreaOfInterestView client={client} isAdmin={true} key="6" tabName="Areas Of Interest" portfolioDetailsId={this.props.portfolioDetailsId} getSelectedAnnotations={this.props.getSelectedAnnotations} /> },
      { tabClassName: 'tab', panelClassName: 'panel', title: "Success Stories", name: "Success Stories", component: <MlFunderSuccessStoriesView client={client} isAdmin={true} key="7" tabName="Success Stories" portfolioDetailsId={this.props.portfolioDetailsId} getSelectedAnnotations={this.props.getSelectedAnnotations} /> },
      { tabClassName: 'tab', panelClassName: 'panel', title: "Library", name: "Library", component: <PortfolioLibrary view={true} client={client} isAdmin={true} key="8" tabName="Library" portfolioDetailsId={this.props.portfolioDetailsId} getSelectedAnnotations={this.props.getSelectedAnnotations} /> },
      { tabClassName: 'tab', panelClassName: 'panel', title: "News", name: "News", component: <MlFunderNewsView key="9" client={client} isAdmin={true} tabName="News" portfolioDetailsId={this.props.portfolioDetailsId} getSelectedAnnotations={this.props.getSelectedAnnotations} /> },
      { tabClassName: 'tab', panelClassName: 'panel', title: "Looking For", name: "Looking For", component: <MlFunderLookingForView key="7" tabName="lookingFor" portfolioDetailsId={this.props.portfolioDetailsId} getSelectedAnnotations={this.props.getSelectedAnnotations} /> },
    ]
    return tabs;
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

  render(){
    let tabs = this.state.tabs;
    return <MlTabComponent tabs={tabs} selectedTabKey={this.state.activeTab}  onChange={this.updateTab} type="tab" mkey="name"/>
  }
}
MlFunderViewTemplate.childContextTypes = {
  funderPortfolio: PropTypes.object,
};
