/**
 * Created by vishwadeep on 8/7/17.
 */

/**
 * Import of all the usable components
 * */
import React, {Component, PropTypes} from "react";
import {render} from "react-dom";
import _ from "lodash";
import MlTabComponent from "../../../../commons/components/tabcomponent/MlTabComponent";
import MlServiceProviderViewAbout from "../../../../admin/transaction/portfolio/component/ServiceProvider/view/MlServiceProviderViewAbout";
import MlServiceProviderViewAwards from "../../../../admin/transaction/portfolio/component/ServiceProvider/view/MlServiceProviderViewAwards";
import MlServiceProviderViewMCL from "../../../../admin/transaction/portfolio/component/ServiceProvider/view/MlServiceProviderViewMCL";
import MlServiceProviderViewServices from "../../../../admin/transaction/portfolio/component/ServiceProvider/view/MlServiceProviderViewServices";
import MlServiceProviderViewClients from "../../../../admin/transaction/portfolio/component/ServiceProvider/view/MlServiceProviderViewClients";
import MlServiceProviderViewLookingFor from "../../../../admin/transaction/portfolio/component/ServiceProvider/view/MlServiceProviderViewLookingFor";
import PortfolioLibrary from '../../../../commons/components/portfolioLibrary/PortfolioLibrary'
import {appClient} from '../../../core/appConnection'
//todo:import the View component of about screen//

export default class MlAppServiceProviderViewTabs extends Component {
  constructor(props) {
    super(props)
    this.state = {tabs: [], aboutUs: {}, serviceProviderPortfolio: {},
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

  /**
   * Display of all tabs of service provider and passing the portfolioId
   * */
  getTabComponents() {
    let tabs = [
      {
        tabClassName: 'tab',
        panelClassName: 'panel',
        title: "About",
        component: <MlServiceProviderViewAbout key="1" tabName="about"
                                           portfolioDetailsId={this.props.portfolioDetailsId}
                                               getSelectedAnnotations={this.props.getSelectedAnnotations}/>
      },
      {
        tabClassName: 'tab',
        panelClassName: 'panel',
        title: "Awards and Rewards",
        component: <MlServiceProviderViewAwards key="2" isAdmin={false}
                                                portfolioDetailsId={this.props.portfolioDetailsId}
                                                getSelectedAnnotations={this.props.getSelectedAnnotations}/>
      },
      {
        tabClassName: 'tab',
        panelClassName: 'panel',
        title: "Library",
        component: <PortfolioLibrary isAdmin={false} client={appClient} key="3" view={true}
                                     portfolioDetailsId={this.props.portfolioDetailsId}
                                     getSelectedAnnotations={this.props.getSelectedAnnotations}/>
      },
      {
        tabClassName: 'tab',
        panelClassName: 'panel',
        title: "MCL",
        component: <MlServiceProviderViewMCL key="4"
                                             portfolioDetailsId={this.props.portfolioDetailsId}
                                             getSelectedAnnotations={this.props.getSelectedAnnotations}/>
      },
      {
        tabClassName: 'tab',
        panelClassName: 'panel',
        title: "Clients",
        component: <MlServiceProviderViewClients key="5"
                                             portfolioDetailsId={this.props.portfolioDetailsId}
                                             getSelectedAnnotations={this.props.getSelectedAnnotations}/>
      },
      {
        tabClassName: 'tab',
        panelClassName: 'panel',
        title: "Looking For",
        component: <MlServiceProviderViewLookingFor key="6"
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
    this.setState({tabs: getTabs() || []});
  }
  updateTab(index){
    let tab =  this.state.tabs[index].title;
    FlowRouter.setQueryParams({ tab: tab });
  }
  render() {
    let tabs = this.state.tabs;
    return <MlTabComponent tabs={tabs}  selectedTabKey={this.state.activeTab}  onChange={this.updateTab} type="tab" mkey="title"/>
  }
}
