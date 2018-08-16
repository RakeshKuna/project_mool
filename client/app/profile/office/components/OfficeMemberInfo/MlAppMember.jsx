/**
 * Created by pankaj on 8/6/17.
 */

import React from 'react';
import Tabs from 'react-responsive-tabs';
import MlAppMemberDetails from './MlAppMemberDetails';
import MlAppMemberSchedule from './MlAppMemberSchedule';
import MlAppMemberTaskInfo from './MlAppMemberTaskInfo';
import MlAppMemberUpcomingTask from './MlAppMemberUpcomingTask';
import MlAppMemberTaskHistory from './MlAppMemberTaskHistory';
import 'react-responsive-tabs/styles.css';
import MlTabComponent from '../../../../../commons/components/tabcomponent/MlTabComponent';

export default class MlAppMember extends React.Component {
  constructor() {
    super();
    this.state = { activeTab: 'Details' };
  }
  componentDidMount() {}

  componentWillMount() {
    const MlTabs = [
      { name: 'Details', title: "Details", tabContent: <MlAppMemberDetails/> },
      { name: 'Schedule', title :"Schedule",tabContent: <MlAppMemberSchedule/> },
      { name: 'Task Info', title: "Task[s] Info",tabContent: <MlAppMemberTaskInfo/> },
      { name: 'Upcoming Task', title : "Upcoming Task[s]", tabContent: <MlAppMemberUpcomingTask/> },
      { name: 'History of Task', title :"History of Tasks", tabContent: <MlAppMemberTaskHistory/> },
    ];

    function getTabs() {
      return MlTabs.map(MlTab => ({
        tabClassName: 'horizon-item', // Optional
        panelClassName: 'panel1', // Optional
        title: MlTab.title,
        key: MlTab.title,
        getContent: () => MlTab.tabContent,
      }));
    }

    let activeTab = FlowRouter.getQueryParam('tab');
    if(activeTab){
      this.setState({activeTab});
    }
    this.setState({ tabs: getTabs() || [] });
  }

  updateTab(index){
    let tab =  this.state.tabs[index].title;
    FlowRouter.setQueryParams({ tab: tab });
  }
  render() {
    const App = () => <MlTabComponent tabs={this.state.tabs} selectedTabKey={this.state.activeTab} onChange={this.updateTab}
                                      type="tab" mkey="title"/>;
    return (
      <div className="app_main_wrap">
        <div className="app_padding_wrap">
          <div className="col-md-12">

            <App/>
          </div>
        </div>
      </div>
    );
  }
}
