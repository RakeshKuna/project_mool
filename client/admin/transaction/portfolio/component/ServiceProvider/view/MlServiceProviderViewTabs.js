/**
 * Created by vishwadeep on 8/7/17.
 */

/**
 * Import of all the usable components
 * */
import React, {Component, PropTypes} from "react";
import {render} from "react-dom";
import MlTabComponent from "../../../../../../commons/components/tabcomponent/MlTabComponent";
import MlServiceProviderViewAwards from "../view/MlServiceProviderViewAwards";
import MlServiceProviderViewAbout from "../view/MlServiceProviderViewAbout";
import MlServiceProviderViewMCL from "../view/MlServiceProviderViewMCL";
import MlServiceProviderViewServices from "../view/MlServiceProviderViewServices";
import MlServiceProviderViewClients from "../view/MlServiceProviderViewClients";
import MlServiceProviderViewLookingFor from "../view/MlServiceProviderViewLookingFor";
import PortfolioLibrary from "../../../../../../commons/components/portfolioLibrary/PortfolioLibrary";
import {client} from "../../../../../core/apolloConnection";
//todo:import the View components//

export default class MlServiceProviderViewTabs extends Component {
  constructor(props) {
    super(props)
    this.state = {tabs: [], aboutUs: {}, serviceProviderPortfolio: {}};
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

  /**
   * Display of all tabs of service provider and passing the portfolioId
   * */
  getTabComponents() {
    let tabs = [
      {
        tabClassName: 'tab',
        panelClassName: 'panel',
        title: "About",
        component: <MlServiceProviderViewAbout key="1" isAdmin={true}
                                           portfolioDetailsId={this.props.portfolioDetailsId}
                                           getSelectedAnnotations={this.props.getSelectedAnnotations}/>
      },
      {
        tabClassName: 'tab',
        panelClassName: 'panel',
        title: "Awards and Rewards",
        component: <MlServiceProviderViewAwards key="2" isAdmin={true}
                                                portfolioDetailsId={this.props.portfolioDetailsId}
                                                getSelectedAnnotations={this.props.getSelectedAnnotations}/>
      },
      {
        tabClassName: 'tab',
        panelClassName: 'panel',
        title: "Library",
        component: <PortfolioLibrary view={true} isAdmin={true} client={client} key="3"
                                     portfolioDetailsId={this.props.portfolioDetailsId}/>
      },
      {
        tabClassName: 'tab',
        panelClassName: 'panel',
        title: "MCL",
        component: <MlServiceProviderViewMCL key="4" isAdmin={true}
                                             portfolioDetailsId={this.props.portfolioDetailsId}
                                             getSelectedAnnotations={this.props.getSelectedAnnotations}/>
      },
      // {
      //   tabClassName: 'tab',
      //   panelClassName: 'panel',
      //   title: "Services",
      //   component: <MlServiceProviderViewServices key="5"
      //                                             portfolioDetailsId={this.props.portfolioDetailsId}
      //                                             getSelectedAnnotations={this.props.getSelectedAnnotations}/>
      // },
      {
        tabClassName: 'tab',
        panelClassName: 'panel',
        title: "Clients",
        component: <MlServiceProviderViewClients key="5" isAdmin={true}
                                             portfolioDetailsId={this.props.portfolioDetailsId}
                                             getSelectedAnnotations={this.props.getSelectedAnnotations}/>
      },
      {
        tabClassName: 'tab',
        panelClassName: 'panel',
        title: "Looking For",
        component: <MlServiceProviderViewLookingFor key="6" tabName="Looking For"
                                                 portfolioDetailsId={this.props.portfolioDetailsId}
                                                 getSelectedAnnotations={this.props.getSelectedAnnotations}/>
      },
      {
        tabClassName: 'tab',
        panelClassName: 'panel',
        title: "Services",
        component: <MlServiceProviderViewServices key="7" view={true}
                                                  portfolioDetailsId={this.props.portfolioDetailsId}
                                                  getSelectedAnnotations={this.props.getSelectedAnnotations}/>
      }
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
        tabClassName: 'moolya_btn', // Optional
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
    this.setState({tabs: getTabs() || []});
  }

  updateTab(index){
    let tab =  this.state.tabs[index].title;
    FlowRouter.setQueryParams({ tab: tab });
  }

  render() {
    let tabs = this.state.tabs;
    return <MlTabComponent tabs={tabs} selectedTabKey={this.state.activeTab}  onChange={this.updateTab} type="tab" mkey="title"/>
  }
}
