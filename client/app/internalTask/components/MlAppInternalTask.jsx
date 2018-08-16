/**
 * Created by pankaj on 20/6/17.
 */

import React from 'react';
import Tabs from 'react-responsive-tabs';
import MlTabComponent from "../../../commons/components/tabcomponent/MlTabComponent";
import MlAppInternalPendingTask from './MlAppInternalPendingTask';
import MlAppInternalCurrentTask from './MlAppInternalCurrentTask';
import MlAppInternalCompleteTask from './MlAppInternalCompleteTask';
import MlAppInternalRejectTask from './MlAppInternalRejectTask';
import MlAppInternalMyTask from './myTask/MlAppInternalMyTask';
import 'react-responsive-tabs/styles.css';

import MlInfiniteScroll from "../../../commons/core/mlInfiniteScroll/components/MlInfiniteScroll";
import {mlMyAppPendingInternalTaskConfig} from './../config/MlAppPendingTasksConfig';
import {mlMyAppCurrentInternalTaskConfig} from './../config/MlAppCurrentTasksConfig';
import {mlMyAppCompletedInternalTaskConfig} from './../config/mlAppCompletedTasksConfig';
import {mlMyAppRejectedInternalTaskConfig} from './../config/mlAppRejectedTasksConfig';
import {mlMyAppStartedInternalTaskConfig} from './../config/MlAppStartedTasksConfig';
import {mlMyAppSelfInternalTaskConfig} from './../config/MlAppSelfTasksConfig';

export default class MlAppInternalTask extends React.Component{

  constructor(props){
    super(props);
    this.state={
      activeTab:'My Tasks',
      toggle:true,
    }
    this.updateTab=this.updateTab.bind(this);
  }

  componentWillMount(){
    let activeTab = FlowRouter.getQueryParam('tab');
    if(activeTab){
      this.setState({activeTab});
    }
  }
  updateTab(index){
    let tab =  this.state.tabs[index].name;
    FlowRouter.setQueryParams({ tab: tab,add: null });
  }

  changeTab(tab){
    this.setState({toggle:!this.state.toggle});
  }


  render(){
    const _mlMyAppPendingInternalTaskConfig = _.extend(mlMyAppPendingInternalTaskConfig,{changeTab:this.changeTab.bind(this)});
    const _mlMyAppCurrentInternalTaskConfig = _.extend(mlMyAppCurrentInternalTaskConfig,{changeTab:this.changeTab.bind(this)});
    const _mlMyAppStartedInternalTaskConfig = _.extend(mlMyAppStartedInternalTaskConfig,{changeTab:this.changeTab.bind(this)});
    const _mlMyAppCompletedInternalTaskConfig = _.extend(mlMyAppCompletedInternalTaskConfig,{changeTab:this.changeTab.bind(this)});
    const _mlMyAppRejectedInternalTaskConfig = _.extend(mlMyAppRejectedInternalTaskConfig,{changeTab:this.changeTab.bind(this)});
    let MlTabs = [
      {
        name: 'My Tasks',
        tabContent: <MlAppInternalMyTask changeTab={this.changeTab.bind(this)} />
      },
      {
        name: 'Assigned',
        tabContent: <MlInfiniteScroll viewMode={false} showInfinity={false} config={_mlMyAppPendingInternalTaskConfig} />
      },
      {
        name: 'Accepted',
        tabContent: <MlInfiniteScroll viewMode={false} showInfinity={false} config={_mlMyAppCurrentInternalTaskConfig} />
      },
      {
        name: 'Started',
        tabContent: <MlInfiniteScroll viewMode={false} showInfinity={false} config={_mlMyAppStartedInternalTaskConfig} />
      },
      {
        name: 'Completed',
        tabContent: <MlInfiniteScroll viewMode={false} showInfinity={false} config={_mlMyAppCompletedInternalTaskConfig} />
      },
      {
        name: 'Rejected',
        tabContent: <MlInfiniteScroll viewMode={false} showInfinity={false} config={_mlMyAppRejectedInternalTaskConfig} />
      }
    ];

    function getTabs() {
      return MlTabs.map(MlTab => ({
        tabClassName: 'horizon-item', // Optional
        panelClassName: 'panel1', // Optional
        title: MlTab.name,
        key:MlTab.name,
        getContent: () => MlTab.tabContent,
      }));
    }

    return (
      <div className="app_main_wrap">
        <div className="app_padding_wrap">
          <div className="col-md-12">
            <MlTabComponent selectedTabKey={this.state.activeTab} tabs={getTabs()} onChange={this.updateTab} type="tab" mkey="name" />
          </div>
        </div>
      </div>
    )
  }
};

