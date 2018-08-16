import React, { Component, PropTypes }  from "react";
import {render} from "react-dom";
import MlTabComponent from "../../../../../../../commons/components/tabcomponent/MlTabComponent";
import {client} from '../../../../../../core/apolloConnection'
import {appClient} from '../../../../../../../app/core/appConnection'
import MlStartupCompanyEmployment from "./subTabs/MlStartupCompanyEmployment";
import MlStartupProfitRevenue from "./subTabs/MlStartupProfitRevenue";
import MlStartupCompanyReview from "./subTabs/MlStartupCompanyReview";
import MlStartupEmployeeBreakup from "./subTabs/MlStartupEmployeeBreakup";

export default class MlStartupChartConfig extends React.Component{
  constructor(props){
    super(props)
    this.state =  {tabs: [],portfolioStartupEmployment:{},getStartupProfitRevenue:{},getStartupReview:{},getStartupEmployeeData:{}}
  }

  getStartupCompanyEmployment(details){
    let data = this.state.portfolioStartupEmployment;
    data=details;
    this.setState({portfolioStartupEmployment : data})
    this.props.getPortfolioStartupChartDetails(data,"employmentOfCompanyChart");

  }
  getStartupProfitRevenue(details){
    let data = this.state.getStartupProfitRevenue;
    data=details;
    this.setState({getStartupProfitRevenue : data})
    this.props.getPortfolioStartupChartDetails(data,"profitRevenueLiabilityChart");
  }
  getStartupCompanyReview(details){
    let data = this.state.getStartupReview;
    data=details;
    this.setState({getStartupReview : data})
    this.props.getPortfolioStartupChartDetails(data,"reviewOfCompanyChart");
  }
  getStartupEmployeeBreakup(details){
    let data = this.state.getStartupEmployeeData;
    data=details;
    this.setState({getStartupEmployeeData : data})
    this.props.getPortfolioStartupChartDetails(data,"employeeBreakupDepartmentChart");
  }

  getTabComponents() {
    let tabs = [
      // {tabClassName: 'tab back_icon fa fa-hand-o-left', panelClassName: 'panel', title:""},
      {
        tabClassName: 'tab',
        panelClassName: 'panel',
        title: "Employment Of Company",
        component: <MlStartupCompanyEmployment client={client} isAdmin={true} key="1"
                                        getStartupCompanyEmployment={this.getStartupCompanyEmployment.bind(this)}
                                        portfolioDetailsId={this.props.portfolioDetailsId}
                                        employmentDetails={this.props.startupChartsDetails&&this.props.startupChartsDetails.employmentOfCompanyChart}/>
      },
      {
        tabClassName: 'tab',
        panelClassName: 'panel',
        title: "Profit, Revenue & Liability",
        component: <MlStartupProfitRevenue key="2" client={client} isAdmin={true}
                                    getStartupProfitRevenue={this.getStartupProfitRevenue.bind(this)}
                                    portfolioDetailsId={this.props.portfolioDetailsId}
                                    revenueDetails={this.props.startupChartsDetails&&this.props.startupChartsDetails.profitRevenueLiabilityChart}/>
      },
      {
        tabClassName: 'tab',
        panelClassName: 'panel',
        title: "Review Of Company",
        component: <MlStartupCompanyReview client={client} isAdmin={true} key="3"
                                    getStartupCompanyReview={this.getStartupCompanyReview.bind(this)}
                                    portfolioDetailsId={this.props.portfolioDetailsId}
                                    reviewDetails={this.props.startupChartsDetails&&this.props.startupChartsDetails.reviewOfCompanyChart}/>
      },
      {
        tabClassName: 'tab',
        panelClassName: 'panel',
        title: "Employee Breakup At Department",
        component: <MlStartupEmployeeBreakup key="4" client={client} isAdmin={true}
                                      getStartupEmployeeBreakup={this.getStartupEmployeeBreakup.bind(this)}
                                      portfolioDetailsId={this.props.portfolioDetailsId}
                                      dataDetails={this.props.startupChartsDetails&&this.props.startupChartsDetails.employeeBreakupDepartmentChart}/>
      },

    ]
    return tabs;
  }

  componentDidMount(){
    var props = this.props
    setTimeout(function(){
      $('.last-item').addClass('menunone');
      if(!props.isApp) {
        $('div[role="tab"]').each(function (index) {
          var test = $(this).text();
          $(this).empty();
          $(this).html('<div class="moolya_btn moolya_btn_in">' + test + '</div>');
        });
        $('.first-item').addClass('menunone');
        $('.RRT__tabs').addClass('horizon-swiper');
        $('.RRT__tab').addClass('horizon-item');
        $('.RRT__panel').addClass('nomargintop');
        $('.RRT__panel .RRT__panel').removeClass('nomargintop');
        $('.horizon-swiper').horizonSwiper();
      }
    },10);
    let path = FlowRouter._current.path;
    if (path.indexOf("app") != -1){
      this.setState({admin: false, client: appClient})
    }
  }


  componentWillMount()
  {
    let tabs = this.getTabComponents();
    function getTabs() {
      return tabs.map(tab => ({
        tabClassName: 'moolya_btn', // Optional
        panelClassName: 'panel1', // Optional
        title: tab.title,
        getContent: () => tab.component
      }));
    }
    this.setState({tabs:getTabs() ||[]});
  }



  render(){
    let tabs = this.state.tabs;
    return <MlTabComponent tabs={tabs} selectedTabKey={this.props.selectedTabKey}/>
  }

}


MlStartupChartConfig.contextTypes = {
  startupPortfolio: PropTypes.object,
};
