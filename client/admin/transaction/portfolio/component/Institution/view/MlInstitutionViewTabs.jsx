import React, { Component, PropTypes }  from "react";
import MlInstitutionViewManagement from './MlInstitutionViewManagement';
import MlInstitutionViewInvestor from './MlInstitutionViewInvestor';
import MlInstitutionViewAwards from './MlInstitutionViewAwards';
import MlInstitutionViewMCL from './MlInstitutionViewMCL';
import MlInstitutionViewLookingFor from './MlInstitutionViewLookingFor';
import MlInstitutionViewChart from './MlInstitutionViewChart';
import MlInstitutionViewAboutLanding from './aboutTabs/MlInstitutionViewAboutLanding';
import MlInstitutionViewIntrapreneur from './MlInstitutionViewIntrapreneur';
import MlInstitutionCSRViewTabs from './CSRViewTabs/MlInstitutionCSRViewTabs';
import MlInstitutionViewPartners from './MlInstitutionViewPartners';
import MlInstitutionIncubatorsViewTabs from './incubatorsViewTabs/MlInstitutionIncubatorsViewTabs'

import MlTabComponent from "../../../../../../commons/components/tabcomponent/MlTabComponent";
import {client} from '../../../../../core/apolloConnection'
import MlInstitutionViewRD from "./MlInstitutionViewR&D";
import PortfolioLibrary from '../../../../../../commons/components/portfolioLibrary/PortfolioLibrary'
import MlInstitutionEditData from '../edit/MlInstitutionEditData';

export default class MlViewInstitutionPortfolioTemplate extends Component {
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

  updateTab(index){
    let tab =  this.state.tabs[index].title;
    FlowRouter.setQueryParams({ tab: tab });
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

  backClickHandler(){
    let tabs = this.state.tabs;
    this.setState({tabs: tabs})
  }

  getTabComponents(){
    let tabs = [
      {tabClassName: 'tab', panelClassName: 'panel', title:"About" ,name:"About" , component:<MlInstitutionViewAboutLanding key="1" isAdmin={true} portfolioDetailsId={this.props.portfolioDetailsId} getSelectedAnnotations={this.props.getSelectedAnnotations} backClickHandler={this.backClickHandler.bind(this)}/>},
      {tabClassName: 'tab', panelClassName: 'panel', title:"Management" ,name:"Management" , component:<MlInstitutionViewManagement key="2" tabName="Management" isAdmin={true} client={client} portfolioDetailsId={this.props.portfolioDetailsId} getSelectedAnnotations={this.props.getSelectedAnnotations}/>},
      {tabClassName: 'tab', panelClassName: 'panel', title:"Investor" ,name:"Investor" ,  component:<MlInstitutionViewInvestor key="3"  tabName="Investor" portfolioDetailsId={this.props.portfolioDetailsId} getSelectedAnnotations={this.props.getSelectedAnnotations}/>},
      {tabClassName: 'tab', panelClassName: 'panel', title:"Data" ,name:"Data" , component:<MlInstitutionEditData key="4" isAdmin={true} portfolioDetailsId={this.props.portfolioDetailsId}/>},
      {tabClassName: 'tab', panelClassName: 'panel', title:"Chart" ,name:"Chart" ,  component:<MlInstitutionViewChart key="5" isAdmin={true} portfolioDetailsId={this.props.portfolioDetailsId}/>},
      {tabClassName: 'tab', panelClassName: 'panel', title:"Awards" ,name:"Awards" , component:<MlInstitutionViewAwards key="6" tabName="Awards" portfolioDetailsId={this.props.portfolioDetailsId} getSelectedAnnotations={this.props.getSelectedAnnotations}/>},
      {tabClassName: 'tab', panelClassName: 'panel', title:"Library" ,name:"Library" , component:<PortfolioLibrary view={true} isAdmin={true} client={client}  key="7"  portfolioDetailsId={this.props.portfolioDetailsId} getSelectedAnnotations={this.props.getSelectedAnnotations}/>},
      {tabClassName: 'tab', panelClassName: 'panel', title:"M C & L" ,name:"M C And L" , component:<MlInstitutionViewMCL key="8"  tabName="M C & L" portfolioDetailsId={this.props.portfolioDetailsId} getSelectedAnnotations={this.props.getSelectedAnnotations}/>},
      {tabClassName: 'tab', panelClassName: 'panel', title:"Looking For" ,name:"Looking For" , component:<MlInstitutionViewLookingFor key="9" tabName="Looking For" portfolioDetailsId={this.props.portfolioDetailsId} getSelectedAnnotations={this.props.getSelectedAnnotations}/>},
      {tabClassName: 'tab', panelClassName: 'panel', title:"Partner" ,name:"Partner" , component:<MlInstitutionViewPartners key="10" tabName="Partners" portfolioDetailsId={this.props.portfolioDetailsId} getSelectedAnnotations={this.props.getSelectedAnnotations}/>},
      {tabClassName: 'tab', panelClassName: 'panel', title:"CSR" ,name:"CSR" , component:<MlInstitutionCSRViewTabs key="11"  portfolioDetailsId={this.props.portfolioDetailsId} getSelectedAnnotations={this.props.getSelectedAnnotations} backClickHandler={this.backClickHandler.bind(this)}/>},
      {tabClassName: 'tab', panelClassName: 'panel', title:"R&D" ,name:"R And D" , component:<MlInstitutionViewRD key="12"  portfolioDetailsId={this.props.portfolioDetailsId} getSelectedAnnotations={this.props.getSelectedAnnotations}/>},
      {tabClassName: 'tab', panelClassName: 'panel', title:"Intrapreneur" ,name:"Intrapreneur" ,  component:<MlInstitutionViewIntrapreneur key="14"  portfolioDetailsId={this.props.portfolioDetailsId} getSelectedAnnotations={this.props.getSelectedAnnotations}/>},
      {tabClassName: 'tab', panelClassName: 'panel', title:"Incubators" ,name:"Incubators" , component:<MlInstitutionIncubatorsViewTabs key="13"  portfolioDetailsId={this.props.portfolioDetailsId} getSelectedAnnotations={this.props.getSelectedAnnotations} backClickHandler={this.backClickHandler.bind(this)}/>},
    ]
    return tabs;
  }
  render(){
    let tabs = this.state.tabs;
    return <MlTabComponent tabs={tabs} selectedTabKey={this.state.activeTab}  onChange={this.updateTab} type="tab" mkey="name"/>
  }
}
