import React, {Component, PropTypes} from "react";
import {render} from "react-dom";
import MlStartupViewAboutLanding from "../../../../admin/transaction/portfolio/component/Startup/view/aboutTabs/MlStartupViewAboutLanding";
import MlStartupViewManagement from "../../../../admin/transaction/portfolio/component/Startup/view/MlStartupViewManagement";
import MlStartupViewInvestor from "../../../../admin/transaction/portfolio/component/Startup/view/MlStartupViewInvestor";
import MlStartupViewAwards from "../../../../admin/transaction/portfolio/component/Startup/view/MlStartupViewAwards";
import MlStartupViewMCL from "../../../../admin/transaction/portfolio/component/Startup/view/MlStartupViewMCL";
import MlStartupViewLookingFor from "../../../../admin/transaction/portfolio/component/Startup/view/MlStartupViewLookingFor";
import MlTabComponent from "../../../../commons/components/tabcomponent/MlTabComponent";
import PortfolioLibrary from "../../../../commons/components/portfolioLibrary/PortfolioLibrary";
import MlStartupViewCharts from "../../../../admin/transaction/portfolio/component/Startup/view/MlStartupViewCharts";
import MlFunderServices from "../../../../admin/transaction/portfolio/component/Funders/edit/MlFunderServices"
import {appClient} from "../../../core/appConnection";
// import MlStartupViewAboutUs from "../../../admin/transaction/portfolio/component/StartupView/MlStartupViewAboutUs";
// import MlStartupViewBranches from "../../../admin/transaction/portfolio/component/StartupView/MlStartupViewBranches";
// import MlStartupViewClients from "../../../admin/transaction/portfolio/component/StartupView/MlStartupViewClients";
// import MlStartupViewTechnologies from "../../../admin/transaction/portfolio/component/StartupView/MlStartupViewTechnologies";
// import MlStartupViewAssets from "../../../admin/transaction/portfolio/component/StartupView/MlStartupViewAssets";

/**
 * Import of all the files from admin need to seperate from app
 * */

//todo://anotations to be includeds
export default class MlAppStartupViewTabs extends Component {
  constructor(props) {
    super(props);
    this.state = {tabs: [],
      activeTab:'About'};
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
        component: <MlStartupViewAboutLanding key="1" portfolioDetailsId={this.props.portfolioDetailsId}
                                         getSelectedAnnotations={this.props.getSelectedAnnotations}
                                         backClickHandler={this.setBackHandler.bind(this)} isApp={true}/>
      },
      {
        tabClassName: 'tab',
        panelClassName: 'panel',
        title: "Management",
        name: "Management",
        component: <MlStartupViewManagement key="2" isAdmin={false} client={appClient}
                                            portfolioDetailsId={this.props.portfolioDetailsId}
                                            getSelectedAnnotations={this.props.getSelectedAnnotations}/>
      },
      {
        tabClassName: 'tab',
        panelClassName: 'panel',
        title: "Investor",
        name: "Investor",
        component: <MlStartupViewInvestor key="3" portfolioDetailsId={this.props.portfolioDetailsId}
                                          getSelectedAnnotations={this.props.getSelectedAnnotations}/>
      },
      {tabClassName: 'tab',
        panelClassName: 'panel', title:"Charts" ,name:"Charts" ,
        component:<MlStartupViewCharts key="5" portfolioDetailsId={this.props.portfolioDetailsId}/>},
      {
        tabClassName: 'tab',
        panelClassName: 'panel',
        title: "Awards",
        name: "Awards",
        component: <MlStartupViewAwards key="6" portfolioDetailsId={this.props.portfolioDetailsId}
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
        component: <MlStartupViewMCL  isAdmin={false} key="9" portfolioDetailsId={this.props.portfolioDetailsId}
                                     getSelectedAnnotations={this.props.getSelectedAnnotations}/>
      },
      {
        tabClassName: 'tab',
        panelClassName: 'panel',
        title: "Looking For",
        name: "Looking For",
        component: <MlStartupViewLookingFor key="10" portfolioDetailsId={this.props.portfolioDetailsId}
                                            getSelectedAnnotations={this.props.getSelectedAnnotations}/>
      },
      {
        tabClassName: 'tab',
        panelClassName: 'panel',
        title: "Services",
        name: "Services",
        component: <MlFunderServices key="10" tabName="Services" portfolioDetailsId={this.props.portfolioDetailsId}/>
      }
    ]
    return tabs;title
  }

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
