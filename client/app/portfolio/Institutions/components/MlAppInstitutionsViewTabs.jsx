import React, {Component, PropTypes} from "react";
import MlInstitutionViewAboutLanding from "../../../../admin/transaction/portfolio/component/Institution/view/aboutTabs/MlInstitutionViewAboutLanding";
import MlInstitutionViewManagement from "../../../../admin/transaction/portfolio/component/Institution/view/MlInstitutionViewManagement";
import MlInstitutionViewInvestor from "../../../../admin/transaction/portfolio/component/Institution/view/MlInstitutionViewInvestor";
import MlInstitutionViewAwards from "../../../../admin/transaction/portfolio/component/Institution/view/MlInstitutionViewAwards";
import MlInstitutionViewMCL from "../../../../admin/transaction/portfolio/component/Institution/view/MlInstitutionViewMCL";
import MlInstitutionViewLookingFor from "../../../../admin/transaction/portfolio/component/Institution/view/MlInstitutionViewLookingFor";
import MlTabComponent from "../../../../commons/components/tabcomponent/MlTabComponent";
import PortfolioLibrary from "../../../../commons/components/portfolioLibrary/PortfolioLibrary";
import MlInstitutionViewCharts from "../../../../admin/transaction/portfolio/component/Institution/view/MlInstitutionViewChart";
import MlInstitutionIntrapreneur from "../../../../admin/transaction/portfolio/component/Institution/view/MlInstitutionViewIntrapreneur";
import MlInstitutionRAndD from "../../../../admin/transaction/portfolio/component/Institution/view/MlInstitutionViewR&D";
import MlInstitutionCSR from "../../../../admin/transaction/portfolio/component/Institution/view/CSRViewTabs/MlInstitutionCSRViewTabs";
import MlInstitutionViewPartners from "../../../../admin/transaction/portfolio/component/Institution/view/MlInstitutionViewPartners";
import MlInstitutionIncubator from "../../../../admin/transaction/portfolio/component/Institution/view/incubatorsViewTabs/MlInstitutionIncubatorsViewTabs";
import MlInstitutionEditData from "../../../../admin/transaction/portfolio/component/Institution/edit/MlInstitutionEditData";
import {appClient} from "../../../core/appConnection";
import MlBeSpokeListView from '../../../../admin/transaction/portfolio/component/Funders/edit/Services/Container/MlFunderServicesList'


/**
 * Import of all the files from admin need to seperate from app
 * */

//todo://anotations to be includeds
export default class MlAppInstitutionViewTabs extends Component {
  constructor(props) {
    super(props);
    this.state = {tabs: [],activeTab:'About'};
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
   * rendering of all the tabs in UI
   * */
  getTabComponents() {
    let tabs = [
      {
        tabClassName: 'tab',
        panelClassName: 'panel',
        title: "About",
        name: "About",
        component: <MlInstitutionViewAboutLanding key="1" portfolioDetailsId={this.props.portfolioDetailsId}
                                              getSelectedAnnotations={this.props.getSelectedAnnotations}
                                              backClickHandler={this.setBackHandler.bind(this)} isApp={true}/>
      },
      {
        tabClassName: 'tab',
        panelClassName: 'panel',
        title: "Management",
        name: "Management",
        component: <MlInstitutionViewManagement key="2" isAdmin={false} client={appClient}
                                            portfolioDetailsId={this.props.portfolioDetailsId}
                                            getSelectedAnnotations={this.props.getSelectedAnnotations}/>
      },
      {
        tabClassName: 'tab',
        panelClassName: 'panel',
        title: "Investor",
        name: "Investor",
        component: <MlInstitutionViewInvestor key="3" portfolioDetailsId={this.props.portfolioDetailsId}
                                          getSelectedAnnotations={this.props.getSelectedAnnotations}/>
      },
      { tabClassName: 'tab',
        panelClassName: 'panel',
        title:"Data" ,
        name:"Data" ,
        component:<MlInstitutionEditData key="4"  portfolioDetailsId={this.props.portfolioDetailsId}
                                         getSelectedAnnotations={this.props.getSelectedAnnotations}/>
      },
      {tabClassName: 'tab',
        panelClassName: 'panel', title:"Charts" ,name:"Charts" ,
        component:<MlInstitutionViewCharts key="5" portfolioDetailsId={this.props.portfolioDetailsId}/>},
      {
        tabClassName: 'tab',
        panelClassName: 'panel',
        title: "Awards",
        name: "Awards",
        component: <MlInstitutionViewAwards key="6" portfolioDetailsId={this.props.portfolioDetailsId}
                                        getSelectedAnnotations={this.props.getSelectedAnnotations}/>
      },
      {
        tabClassName: 'tab',
        panelClassName: 'panel',
        title: "Library",
        name: "Library",
        component: <PortfolioLibrary isAdmin={false} client={appClient} key="7" view={true}
                                     portfolioDetailsId={this.props.portfolioDetailsId}
                                     getSelectedAnnotations={this.props.getSelectedAnnotations}/>
      },
      {
        tabClassName: 'tab',
        panelClassName: 'panel',
        title: "M C & L",
        name: "M C And L",
        component: <MlInstitutionViewMCL key="8" portfolioDetailsId={this.props.portfolioDetailsId}
                                     getSelectedAnnotations={this.props.getSelectedAnnotations}/>
      },
      {
        tabClassName: 'tab',
        panelClassName: 'panel',
        title: "Looking For",
        name: "Looking For",
        component: <MlInstitutionViewLookingFor key="9" portfolioDetailsId={this.props.portfolioDetailsId}
                                            getSelectedAnnotations={this.props.getSelectedAnnotations}/>
      },
      {
        tabClassName: 'tab',
        panelClassName: 'panel',
        title: "Partner",
        name: "Partner",
        component: <MlInstitutionViewPartners key="10" portfolioDetailsId={this.props.portfolioDetailsId}
                                                getSelectedAnnotations={this.props.getSelectedAnnotations}/>
      },
      {
        tabClassName: 'tab',
        panelClassName: 'panel',
        title: "CSR",
        name: "CSR",
        component: <MlInstitutionCSR key="11" portfolioDetailsId={this.props.portfolioDetailsId}
                                     getSelectedAnnotations={this.props.getSelectedAnnotations}
                                     backClickHandler={this.setBackHandler.bind(this)} isApp={true}/>
      },
      {
        tabClassName: 'tab',
        panelClassName: 'panel',
        title: "R&D",
        name: "R&D",
        component: <MlInstitutionRAndD key="12" portfolioDetailsId={this.props.portfolioDetailsId}
                                              getSelectedAnnotations={this.props.getSelectedAnnotations}/>
      },
      {
        tabClassName: 'tab',
        panelClassName: 'panel',
        title: "Intrapreneur",
        name: "Intrapreneur",
        component: <MlInstitutionIntrapreneur key="14" portfolioDetailsId={this.props.portfolioDetailsId}
                                              getSelectedAnnotations={this.props.getSelectedAnnotations}/>
      },
      {
        tabClassName: 'tab',
        panelClassName: 'panel',
        title: "Incubators",
        name: "Incubators",
        component: <MlInstitutionIncubator key="15" portfolioDetailsId={this.props.portfolioDetailsId}
                                     getSelectedAnnotations={this.props.getSelectedAnnotations}
                                     backClickHandler={this.setBackHandler.bind(this)} isApp={true}/>
      },
      {
        tabClassName: 'tab',
        panelClassName: 'panel',
        title:"Services" ,
        name:"Services" ,
        component:<MlBeSpokeListView view={true} myPortfolio={true} key="10" portfolioDetailsId={this.props.portfolioDetailsId}/>
      } //getFunderServicesDetails={this.getFunderServicesDetails.bind(this)} portfolioDetailsId={this.props.portfolioDetailsId}

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
    return <MlTabComponent tabs={tabs} selectedTabKey={this.state.activeTab}  onChange={this.updateTab} type="tab" mkey="name"/>
  }
}
