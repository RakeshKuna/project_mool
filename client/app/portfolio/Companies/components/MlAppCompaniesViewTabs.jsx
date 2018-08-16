
/**
 * Import of all the usable components
 * */
import React, {Component, PropTypes} from "react";
import {render} from "react-dom";
import {appClient} from '../../../core/appConnection'
import MlTabComponent from "../../../../commons/components/tabcomponent/MlTabComponent";
import MlCompanyViewManagement from '../../../../admin/transaction/portfolio/component/Company/view/MlCompanyViewManagement';
import MlCompanyViewAwards from '../../../../admin/transaction/portfolio/component/Company/view/MlCompanyViewAwards';
import MlCompanyViewMCL from '../../../../admin/transaction/portfolio/component/Company/view/MlCompanyViewMCL';
import MlCompanyViewChart from '../../../../admin/transaction/portfolio/component/Company/view/MlCompanyViewChart';
import MlCompanyViewLibrary from '../../../../admin/transaction/portfolio/component/Company/view/MlCompanyViewLibrary';
import MlCompanyViewAboutLanding from '../../../../admin/transaction/portfolio/component/Company/view/about/MlCompanyViewAboutLanding';
import MlCompanyViewIntrapreneur from '../../../../admin/transaction/portfolio/component/Company/view/MlCompanyViewIntrapreneur';
import MlCSRViewTabs from '../../../../admin/transaction/portfolio/component/Company/view/CSR/MlCSRViewTabs'
import MlCompanyViewPartners from '../../../../admin/transaction/portfolio/component/Company/view/MlCompanyViewPartners'
import MlCompanyViewRAndD from '../../../../admin/transaction/portfolio/component/Company/view/MlCompanyViewR&D'
import MlCompanyViewLookingFor from '../../../../admin/transaction/portfolio/component/Company/view/MlCompanyViewLookingFor'
import MlCompanyIncubatorsViewTabs from '../../../../admin/transaction/portfolio/component/Company/view/incubators/MlCompanyIncubatorsViewTabs'
import PortfolioLibrary from '../../../../commons/components/portfolioLibrary/PortfolioLibrary'
import MlCompanyData from "../../../../admin/transaction/portfolio/component/Company/edit/MlCompanyData";
import MlBeSpokeListView from '../../../../admin/transaction/portfolio/component/Funders/edit/Services/Container/MlFunderServicesList'

//todo:import the View component of about screen//

export default class MlAppCompaniesViewTabs extends Component {
  constructor(props) {
    super(props)
    this.state = {
      tabs: [],
      activeTab:'About'
    };
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
    }, 300);
  }

  backClickHandler(){
    let tabs = this.state.tabs;
    this.setState({tabs: tabs})
  }

  setBackHandler(backMethod){
    this.props.setBackHandler(backMethod);
    $('.RRT__tabs').removeClass('menunone');
  }

  /**
   * Display of all tabs of service provider and passing the portfolioId
   * */
  getTabComponents() {
    let tabs = [
      {tabClassName: 'tab', panelClassName: 'panel', title:"About" ,name:"About" , component:<MlCompanyViewAboutLanding key="1"  portfolioDetailsId={this.props.portfolioDetailsId} getSelectedAnnotations={this.props.getSelectedAnnotations} backClickHandler={this.setBackHandler.bind(this)} isApp={true}/>},
      {tabClassName: 'tab', panelClassName: 'panel', title:"Management" , name:"Management" , component:<MlCompanyViewManagement key="2" isAdmin={false} client={appClient} portfolioDetailsId={this.props.portfolioDetailsId} getSelectedAnnotations={this.props.getSelectedAnnotations}/>},
      /*{tabClassName: 'tab', panelClassName: 'panel', title:"Data" ,  name:"Data" , component:<MlCompanyViewData key="4"  portfolioDetailsId={this.props.portfolioDetailsId} getSelectedAnnotations={this.props.getSelectedAnnotations}/>},*/
      {tabClassName: 'tab', panelClassName: 'panel', title:"Data" , name:'Data', component:<MlCompanyData key="4"  isAdmin={false} client={appClient} portfolioDetailsId={this.props.portfolioDetailsId}/>},
      {tabClassName: 'tab', panelClassName: 'panel', title:"Chart" , name:"Chart" , component:<MlCompanyViewChart key="5"  portfolioDetailsId={this.props.portfolioDetailsId}/>},
      {tabClassName: 'tab', panelClassName: 'panel', title:"Awards" ,  name:"Awards" , component:<MlCompanyViewAwards key="6"  portfolioDetailsId={this.props.portfolioDetailsId} getSelectedAnnotations={this.props.getSelectedAnnotations}/>},
      {tabClassName: 'tab', panelClassName: 'panel', title:"Library" ,name:"Library" ,  component:<PortfolioLibrary view={true} isAdmin={false} client={appClient}  key="7"  portfolioDetailsId={this.props.portfolioDetailsId} getSelectedAnnotations={this.props.getSelectedAnnotations}/>},
      {tabClassName: 'tab', panelClassName: 'panel', title:"M C & L" , name:"M C And L" , component:<MlCompanyViewMCL isAdmin={false} key="8" portfolioDetailsId={this.props.portfolioDetailsId} getSelectedAnnotations={this.props.getSelectedAnnotations}/>},
      {tabClassName: 'tab', panelClassName: 'panel', title:"Incubators" , name:"Incubators" , component:<MlCompanyIncubatorsViewTabs key="19"  portfolioDetailsId={this.props.portfolioDetailsId} getSelectedAnnotations={this.props.getSelectedAnnotations} backClickHandler={this.setBackHandler.bind(this)} isApp={true}/>},
      {tabClassName: 'tab', panelClassName: 'panel', title:"Partners" , name:"Partners" , component:<MlCompanyViewPartners key="9" portfolioDetailsId={this.props.portfolioDetailsId} getSelectedAnnotations={this.props.getSelectedAnnotations}/>},
      {tabClassName: 'tab', panelClassName: 'panel', title:"CSR" , name:"CSR" , component:<MlCSRViewTabs key="10"  portfolioDetailsId={this.props.portfolioDetailsId} getSelectedAnnotations={this.props.getSelectedAnnotations} backClickHandler={this.setBackHandler.bind(this)} isApp={true}/>},
      {tabClassName: 'tab', panelClassName: 'panel', title:"R&D" , name:"R And D" , component:<MlCompanyViewRAndD key="11" portfolioDetailsId={this.props.portfolioDetailsId} getSelectedAnnotations={this.props.getSelectedAnnotations}/>},
      {tabClassName: 'tab', panelClassName: 'panel', title:"Intrapreneur" ,name:"Intrapreneur" , component:<MlCompanyViewIntrapreneur key="12"  portfolioDetailsId={this.props.portfolioDetailsId} getSelectedAnnotations={this.props.getSelectedAnnotations}/>},
      {tabClassName: 'tab', panelClassName: 'panel', title:"Looking For" ,name:"Looking For" , component:<MlCompanyViewLookingFor key="14"  portfolioDetailsId={this.props.portfolioDetailsId} getSelectedAnnotations={this.props.getSelectedAnnotations}/>},
      {tabClassName: 'tab', panelClassName: 'panel', title:"Services" , name:"Services" ,  component:<MlBeSpokeListView view={true}  myPortfolio={true} key="10" portfolioDetailsId={this.props.portfolioDetailsId}/>} //getFunderServicesDetails={this.getFunderServicesDetails.bind(this)} portfolioDetailsId={this.props.portfolioDetailsId}
    ]
    return tabs;
  }

  /**
   * tab mounting component
   * */
  componentWillMount() {
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

    this.setState({tabs: getTabs() || []});
  }

  updateTab(index){
    let tab =  this.state.tabs[index].title;
    FlowRouter.setQueryParams({ tab: tab });
  }

  render() {
    let tabs = this.state.tabs;
    return <MlTabComponent tabs={tabs} selectedTabKey={this.state.activeTab}  onChange={this.updateTab} type="tab" mkey="title" />
  }
}
