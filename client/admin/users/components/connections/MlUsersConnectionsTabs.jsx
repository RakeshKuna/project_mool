/**
 * Created by vishwadeep on 29/7/17.
 */
/**
 * import of libs and routes
 * */
import React, {Component} from "react";
import {render} from "react-dom";
import MlUsersConnections from "./MlUsersConnections";
import MlTabComponent from "../../../../commons/components/tabcomponent/MlTabComponent";

/**
 * export of default class
 * */
export default class MlUsersConnectionsTabs extends React.Component {
  constructor(props) {
    super(props)
    this.state = {tabs: []};
  }

  /**
   * making the tabs as horizontal swiper
   * */
  componentDidMount() {
    setTimeout(function () {
      $('.swiper-menu').addClass('hide');
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
   * tabs to be displayed
   * */
  getTabComponents() {
    let tabs = [
      {
        tabClassName: 'tab',
        panelClassName: 'panel',
        title: "Ideator",
        component: <MlUsersConnections key="1" communityCode={'IDE'} data={this.props}/>
      },
      {
        tabClassName: 'tab',
        panelClassName: 'panel',
        title: "Investor",
        component: <MlUsersConnections key="2" communityCode={'FUN'} data={this.props}/>
      },
      {
        tabClassName: 'tab',
        panelClassName: 'panel',
        title: "Service Provider",
        component: <MlUsersConnections key="3" communityCode={'SPS'} data={this.props}/>
      },
      {
        tabClassName: 'tab',
        panelClassName: 'panel',
        title: "Startup",
        component: <MlUsersConnections key="4" communityCode={'STU'} data={this.props}/>
      },
      {
        tabClassName: 'tab',
        panelClassName: 'panel',
        title: "Company",
        component: <MlUsersConnections key="5" communityCode={'CMP'} data={this.props}/>
      },
      {
        tabClassName: 'tab',
        panelClassName: 'panel',
        title: "Institutions",
        component: <MlUsersConnections key="6" communityCode={'INS'} data={this.props}/>
      }
    ]
    return tabs;
  }

  componentWillMount() {
    let tabs = this.getTabComponents();

    function getTabs() {
      return tabs.map(tab => ({
        tabClassName: 'moolya_btn', // Optional
        panelClassName: 'panel1', // Optional
        title: tab.title,
        getContent: () => tab.component
      }));
    }

    this.setState({tabs: getTabs() || []});
  }

  render() {
    let tabs = this.state.tabs;
    return <div className="admin_main_wrap">
      <div className="admin_padding_wrap"><MlTabComponent tabs={tabs}/></div>
    </div>
  }
}

