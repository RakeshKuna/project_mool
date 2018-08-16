import React, { Component, PropTypes }  from "react";
import MlCompanyViewManagement from './MlCompanyViewManagement';
import MlCompanyViewAwards from './MlCompanyViewAwards';
import MlCompanyViewMCL from './MlCompanyViewMCL';
import MlCompanyViewChart from './MlCompanyViewChart';
import MlCompanyViewLibrary from './MlCompanyViewLibrary';
import PortfolioLibrary from '../../../../../../commons/components/portfolioLibrary/PortfolioLibrary'
import MlCompanyViewAboutLanding from './about/MlCompanyViewAboutLanding';
import MlCompanyViewIntrapreneur from './MlCompanyViewIntrapreneur';
import MlCSRViewTabs from './CSR/MlCSRViewTabs'
import MlCompanyViewPartners from './MlCompanyViewPartners'
import MlCompanyViewRAndD from './MlCompanyViewR&D'
import MlCompanyViewLookingFor from './MlCompanyViewLookingFor';
import MlCompanyIncubatorsViewTabs from './incubators/MlCompanyIncubatorsViewTabs'
import MlTabComponent from "../../../../../../commons/components/tabcomponent/MlTabComponent";
import MlCompanyData from "../edit/MlCompanyData"
// import PortfolioLibrary from '../../../../../../commons/components/portfolioLibrary/PortfolioLibrary'
import {client} from '../../../../../core/apolloConnection'

export default class MlCompanyViewTabs extends Component {
  constructor(props){
    super(props);
    this.state =  {tabs: [],activeTab:'About'};
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
        key:tab.name,
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
      {tabClassName: 'tab', panelClassName: 'panel', title:"About" ,name:"About" , component:<MlCompanyViewAboutLanding key="1" isAdmin={true} portfolioDetailsId={this.props.portfolioDetailsId} getSelectedAnnotations={this.props.getSelectedAnnotations} backClickHandler={this.backClickHandler.bind(this)}/>},
      {tabClassName: 'tab', panelClassName: 'panel', title:"Management" , name:"Management" ,component:<MlCompanyViewManagement key="2" isAdmin={true} client={client} portfolioDetailsId={this.props.portfolioDetailsId} getSelectedAnnotations={this.props.getSelectedAnnotations}/>},
      {tabClassName: 'tab', panelClassName: 'panel', title:"Data" , name:"Data" ,component:<MlCompanyData key="4"  isAdmin={true} portfolioDetailsId={this.props.portfolioDetailsId}/>},
      {tabClassName: 'tab', panelClassName: 'panel', title:"Chart" ,name:"Chart" , component:<MlCompanyViewChart key="5" isAdmin={true}  portfolioDetailsId={this.props.portfolioDetailsId}/>},
      {tabClassName: 'tab', panelClassName: 'panel', title:"Awards" ,name:"Awards" , component:<MlCompanyViewAwards key="6"  isAdmin={true} portfolioDetailsId={this.props.portfolioDetailsId} getSelectedAnnotations={this.props.getSelectedAnnotations}/>},
      {tabClassName: 'tab', panelClassName: 'panel', title:"Library" ,name:"Library" , component:<PortfolioLibrary view={true} isAdmin={true} client={client}  key="7"  portfolioDetailsId={this.props.portfolioDetailsId} getSelectedAnnotations={this.props.getSelectedAnnotations}/>},
      {tabClassName: 'tab', panelClassName: 'panel', title:"M C & L" ,name:"M C And L" , component:<MlCompanyViewMCL key="8" isAdmin={true} portfolioDetailsId={this.props.portfolioDetailsId} getSelectedAnnotations={this.props.getSelectedAnnotations}/>},
      {tabClassName: 'tab', panelClassName: 'panel', title:"Incubators" ,name:"Incubators" , component:<MlCompanyIncubatorsViewTabs key="19"  portfolioDetailsId={this.props.portfolioDetailsId} getSelectedAnnotations={this.props.getSelectedAnnotations} backClickHandler={this.backClickHandler.bind(this)}/>},
      {tabClassName: 'tab', panelClassName: 'panel', title:"Partners" , name:"Partners" ,component:<MlCompanyViewPartners key="9" isAdmin={true} portfolioDetailsId={this.props.portfolioDetailsId} getSelectedAnnotations={this.props.getSelectedAnnotations}/>},
      {tabClassName: 'tab', panelClassName: 'panel', title:"CSR" , name:"CSR" , component:<MlCSRViewTabs key="10"  portfolioDetailsId={this.props.portfolioDetailsId} getSelectedAnnotations={this.props.getSelectedAnnotations} backClickHandler={this.backClickHandler.bind(this)}/>},
      {tabClassName: 'tab', panelClassName: 'panel', title:"R&D" , name:"R And D" , component:<MlCompanyViewRAndD key="11" isAdmin={true} portfolioDetailsId={this.props.portfolioDetailsId} getSelectedAnnotations={this.props.getSelectedAnnotations}/>},
      {tabClassName: 'tab', panelClassName: 'panel', title:"Intrapreneur" ,name:"Intrapreneur" ,  component:<MlCompanyViewIntrapreneur key="12" isAdmin={true}  portfolioDetailsId={this.props.portfolioDetailsId} getSelectedAnnotations={this.props.getSelectedAnnotations}/>},
      {tabClassName: 'tab', panelClassName: 'panel', title:"Looking For" , name:"Looking For" ,component:<MlCompanyViewLookingFor key="14"  portfolioDetailsId={this.props.portfolioDetailsId} tabName="Looking For" getSelectedAnnotations={this.props.getSelectedAnnotations}/>},
    ]
    return tabs;
  }
  render(){
    let tabs = this.state.tabs;
    return <MlTabComponent tabs={tabs} selectedTabKey={this.state.activeTab}  onChange={this.updateTab} type="tab" mkey="name"/>
  }
}
