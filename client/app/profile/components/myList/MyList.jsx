/**
 * Created by viswadeep on 10/5/17.
 */

import React from 'react';
import { render } from 'react-dom';
import 'react-responsive-tabs/styles.css'
import MyConnections from './MyConnections';
import MyFavourites from './MyFavourites';
import MyWishlist from './MyWishlist';
import MyFollowers from './MyFollowers';
import MyFollowings from './MyFollowings';
import MlInfiniteScroll from '../../../../commons/core/mlInfiniteScroll/components/MlInfiniteScroll';
import {mlAppMyConnectionConfig} from '../../config/mlAppMyConnectionsConfig';
import {mlAppMyFavouritesConfig} from '../../config/mlAppMyFavouritesConfig';
import {mlAppMyFollowersConfig} from '../../config/mlAppMyFollowersConfig';
import {mlAppMyFollowingsConfig} from '../../config/mlAppMyFollowingsConfig';
import Tabs from 'react-responsive-tabs';
import MlTabComponent from "../../../../commons/components/tabcomponent/MlTabComponent";
export default class MyList extends React.Component{
  constructor(props){
    super(props)
    this.state =  {
      tabs: [],
      activeTab:'My Connections',
    };
  }

  componentWillMount()
  {
    let tabs = this.getTabComponents();
    function getTabs() {
      return tabs.map(tab => ({
        tabClassName: 'horizon-item '+tab.tabClassName?tab.tabClassName:"", // Optional
        panelClassName: 'panel1',
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

  getTabComponents(){
    let tabs = [
      {
        tabClassName:'ml flaticon-ml-handshake', title: <b>My Connections</b>,
        name:"My Connections",
        component: <MlInfiniteScroll viewMode={false} showInfinity={false} config={mlAppMyConnectionConfig} />
      },
      {
        tabClassName:'ml my-ml-favourites',title: <b>My Favourites</b>,name: "My Favourites",
        component: <MlInfiniteScroll viewMode={false} showInfinity={false} config={mlAppMyFavouritesConfig} />
      },
      {
        tabClassName:'ml my-ml-my_followers',title: <b>My Followers</b>,name: "My Followers",
        component: <MlInfiniteScroll viewMode={false} showInfinity={false} config={mlAppMyFollowersConfig} />
      },
      {
        tabClassName:'ml my-ml-i_follow',title: <b>I Follow</b>,name:"I Follow",
        component: <MlInfiniteScroll viewMode={false} showInfinity={false} config={mlAppMyFollowingsConfig} />
      }
    ]
    return tabs;
  }
  updateTab(index){
    let tab =  this.state.tabs[index].name;
    FlowRouter.setQueryParams({ tab: tab });
  }
  render(){
    let tabs = this.state.tabs;
    return (
      <div className="app_main_wrap">
        <div className="app_padding_wrap">
          <div className="col-md-12">
            <MlTabComponent tabs={tabs} selectedTabKey={this.state.activeTab}  onChange={this.updateTab} type="tab" mkey="name"/>
          </div>
        </div>
      </div>
    )
  }
};

