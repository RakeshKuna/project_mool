 import React from 'react';
var FontAwesome = require('react-fontawesome');
import MlTabComponent from "../../../../commons/components/tabcomponent/MlTabComponent";
import MlPortfolioIdeatorBasicDetailsView from '../../../../admin/transaction/portfolio/component/IdeatorView/MlPortfolioIdeatorBasicDetailsView'
import MlPortfolioIdeatorProblemsAndSolutionsView from '../../../../admin/transaction/portfolio/component/IdeatorView/MlProblemsAndSolutionsView'
import MlAudienceView from '../../../../admin/transaction/portfolio/component/IdeatorView/MlAudienceView'
import MlPortfolioIdeatorStrategyPlansView from '../../../../admin/transaction/portfolio/component/IdeatorView/MlStartergyAndPlanningView'
import MlIdeatorLookingForView from '../../../../admin/transaction/portfolio/component/IdeatorView/MlIdeatorLookingForView'
import MlPortfolioIdeatorPlanningTrademarkView from '../../../../admin/transaction/portfolio/component/IdeatorView/MlInAndTrademarkView'
import MlIdeaView from '../../../../admin/transaction/portfolio/component/IdeatorView/MlIdeaView'
import PortfolioLibrary from '../../../../commons/components/portfolioLibrary/PortfolioLibrary'
 import {appClient} from '../../../core/appConnection'
 // import MlCustomActionButtons from './MlCustomActionButtons'
// import MlAppIdeatorIdeas from './MlAppIdeatorIdeas'

import 'react-responsive-tabs/styles.css'


export default class MlAppIdeatorTabs extends React.Component{
constructor(props){
  super(props)
  this.state =  {
    tabs: [],
    ideatorPortfolio:{},
    ideatorId:this.props.config,
    activeTab:'The Idea',
  };
  // this.getIdeatorDetails.bind(this);
  // this.getProblemSolution.bind(this)
  // this.getChildContext.bind(this)
  // this.getSelectedAnnotation.bind(this);
}

// getChildContext(){
//   return {
//     ideatorPortfolio: this.state.ideatorPortfolio
//   }
// }

componentDidMount(){
  // setTimeout(function(){
  //   $('div[role="tab"]').each(function( index ) {
  //     var test = $(this).text();
  //     $(this).empty();
  //     $(this).html('<div class="moolya_btn moolya_btn_in">'+test+'</div>');
  //   });
  //   $('.RRT__tabs').addClass('horizon-swiper');
  //   $('.RRT__tab').addClass('horizon-item');
  //   $('.horizon-swiper').horizonSwiper();
  // },300);
}

getTabComponents(){
  let tabs = [
    {tabClassName: 'tab', panelClassName: 'panel', title:"The Idea" , component:<MlIdeaView key="0"  portfolioDetailsId={this.props.portfolioDetailsId} ideaId={this.props.ideaId} getSelectedAnnotations={this.props.getSelectedAnnotations}/>},
    {tabClassName: 'tab', panelClassName: 'panel', title:"About" , component:<MlPortfolioIdeatorBasicDetailsView key="1"  portfolioDetailsId={this.props.portfolioDetailsId}  getSelectedAnnotations={this.props.getSelectedAnnotations}/>},
    {tabClassName: 'tab', panelClassName: 'panel', title:"Problems and Solutions" , component:<MlPortfolioIdeatorProblemsAndSolutionsView key="2"  portfolioDetailsId={this.props.portfolioDetailsId}  getSelectedAnnotations={this.props.getSelectedAnnotations}/>},
    {
      tabClassName: 'tab',
      panelClassName: 'panel',
      title: "Audience",
      component: <MlAudienceView key="3" portfolioDetailsId={this.props.portfolioDetailsId}
                                                 getSelectedAnnotations={this.props.getSelectedAnnotations}/>
    },
    {tabClassName: 'tab', panelClassName: 'panel', title:"Library" , component:<PortfolioLibrary view={true} isAdmin={false} client={appClient} key="4"  portfolioDetailsId={this.props.portfolioDetailsId}  getSelectedAnnotations={this.props.getSelectedAnnotations}/>},
    {tabClassName: 'tab', panelClassName: 'panel', title:"Strategy and Plans" , component:<MlPortfolioIdeatorStrategyPlansView key="5"  portfolioDetailsId={this.props.portfolioDetailsId}  getSelectedAnnotations={this.props.getSelectedAnnotations}/>},
    {tabClassName: 'tab', panelClassName: 'panel', title:"Intellectual Property And Trademarks" , component:<MlPortfolioIdeatorPlanningTrademarkView key="6"  portfolioDetailsId={this.props.portfolioDetailsId}  getSelectedAnnotations={this.props.getSelectedAnnotations}/>},
    {tabClassName: 'tab', panelClassName: 'panel', title:"Looking For" , component:<MlIdeatorLookingForView key="7"  portfolioDetailsId={this.props.portfolioDetailsId}  getSelectedAnnotations={this.props.getSelectedAnnotations}/>},
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
      key: tab.title,
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
  return (
    <div className="col-md-12 nopadding">
      <MlTabComponent tabs={tabs} selectedTabKey={this.state.activeTab}  onChange={this.updateTab} type="tab" mkey="title"/>
    </div>
  )
  // return <MlTabComponent tabs={tabs}/>
}
}
// MlAppIdeatorTabs.childContextTypes = {
//   ideatorPortfolio: PropTypes.object,
// };
