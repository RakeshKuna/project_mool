/**
 * Created by pankaj on 24/7/17.
 */
import React from 'react';
import Tabs from 'react-responsive-tabs';
import 'react-responsive-tabs/styles.css';
import MlAppOngoingMyAppointment from './mlAppServiceTaskAppointment/MlAppOngoingMyAppointment';
import MlAppCompletedMyAppointment from './MlAppCompletedMyAppointment';
import MlAppRequestedMyAppointment from './MlAppRequestedMyAppointment';
import MlAppPendingMyAppointment from './MlAppPendingMyAppointment';
import MlAppRejectedMyAppointment from './MlAppRejectedMyAppointment';
import MlAppCurrentMyAppointment from './MlAppCurrentMyAppointment';

import MlInfiniteScroll from "../../../../commons/core/mlInfiniteScroll/components/MlInfiniteScroll";
import {mlAppPendingAppointmentConfig} from "./../config/mlAppPendingAppointmentsConfig";
import {mlAppCurrentAppointmentConfig} from "./../config/mlAppCurrentAppointmentsConfig";
import {mlAppExpiredAppointmentConfig} from "./../config/mlAppExpiredAppointmentsConfig";
import {mlAppTodayAppointmentConfig} from "./../config/mlAppTodayAppointmentsConfig";
import {mlAppRejectedAppointmentConfig} from "./../config/mlAppRejectedAppointmentsConfig";
import {mlAppCompletedAppointmentConfig} from "./../config/mlAppCompletedAppointments";
import {mlAppMyRequestedBespokeServiceConfig} from "./../config/mlAppRequestedAppointmentsConfig";

import MlAppOngoingSelectedMyAppointment from './mlAppServiceTaskAppointment/MlAppOngoingSelectedMyAppointment';
import MlAppSelectedTaskMyAppointment from './mlAppInternalTaskAppointment/MlAppSelectedTaskMyAppointment';
import MlAppSelectedSelfTaskMyAppointment from './mlAppSelfTaskAppointment/MlAppSelectedSelfTaskMyAppointment';
import MlTabComponent from "../../../../commons/components/tabcomponent/MlTabComponent";

// console.log("mlAppPendingAppointmentConfig", mlAppPendingAppointmentConfig);

export default class MlAppMyAppointment extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      activeTab: FlowRouter.getQueryParam('tab')? FlowRouter.getQueryParam('tab') : 'pending',
      selectedAppointment: FlowRouter.getQueryParam('appointment')
    }
  }

  resetSelectedAppointment() {
    FlowRouter.setQueryParams({
      appointment: null
    });
  }

  // onChange(tab) {
  //   FlowRouter.setQueryParams({
  //     tab:tab,
  //     appointment: null
  //   });
  // }
  onChange(index){
    let tab =  this.state.tabs[index].title;
    FlowRouter.setQueryParams({ tab: tab ,  appointment: null});
  }

  getAppointmentComponentToLoad(status) {
    const {selectedAppointment} = this.state;
    switch (selectedAppointment.appointmentType) {
      case 'SERVICE-TASK':
        return (<MlAppOngoingSelectedMyAppointment isCancelled={this.state.selectedAppointment.isCancelled} resetSelectedAppointment={this.resetSelectedAppointment} status={status} appointment={selectedAppointment} />)
        break;
      case 'INTERNAL-TASK':
        return (<MlAppSelectedTaskMyAppointment isCancelled={this.state.selectedAppointment.isCancelled} resetSelectedAppointment={this.resetSelectedAppointment} status={status} appointment={selectedAppointment} />)
        break;
      case 'SELF-TASK':
        return (<MlAppSelectedSelfTaskMyAppointment resetSelectedAppointment={this.resetSelectedAppointment} status={status} appointment={selectedAppointment} />)
        break;
      default:
      // do nothing
    }
  }

  render(){
    const that = this;
    let activeTab = this.state.activeTab;
    let appointment = this.state.selectedAppointment;
    let status = activeTab.substr( 0, 1 ).toUpperCase() + activeTab.substr( 1 );
    let MlTabs = [
      {
        name: 'Pending',
        tabContent: appointment ? that.getAppointmentComponentToLoad(status) : <MlInfiniteScroll viewMode={false} showInfinity={false} config={mlAppPendingAppointmentConfig} />
      },
      {
        name: 'Accepted', //current tab is changed to accepted
        selected: true,
        tabContent: appointment ? that.getAppointmentComponentToLoad(status) : <MlInfiniteScroll viewMode={false} showInfinity={false} config={mlAppCurrentAppointmentConfig} />
      },
      {
        name: 'Today',
        tabContent: appointment ? that.getAppointmentComponentToLoad(status) : <MlInfiniteScroll viewMode={false} showInfinity={false} config={mlAppTodayAppointmentConfig} />
      },
      {
        name: 'Expired',
        tabContent: appointment ? that.getAppointmentComponentToLoad(status) : <MlInfiniteScroll viewMode={false} showInfinity={false} config={mlAppExpiredAppointmentConfig} />
      },
      {
        name: 'Completed',
        tabContent: appointment ? that.getAppointmentComponentToLoad(status) : <MlInfiniteScroll viewMode={false} showInfinity={false} config={mlAppCompletedAppointmentConfig} />
      },
      {
        name: 'Rejected',
        tabContent: appointment ? that.getAppointmentComponentToLoad(status) : <MlInfiniteScroll viewMode={false} showInfinity={false} config={mlAppRejectedAppointmentConfig} />
      },
      {
        name: 'Requested',
        tabContent: appointment ? that.getAppointmentComponentToLoad(status) : <MlInfiniteScroll viewMode={false} showInfinity={false} config={mlAppMyRequestedBespokeServiceConfig} />
      }
    ];

    function getTabs() {
      return MlTabs.map(MlTab => ({
        tabClassName: 'horizon-item', // Optional
        panelClassName: 'panel1', // Optional
        title: MlTab.name,
        key: MlTab.name.toLowerCase(),
        getContent: () => MlTab.tabContent,
      }));
    }

    const App = () => <MlTabComponent tabs={getTabs()} selectedTabKey={ this.state.activeTab || 'Pending'}  onChange={that.onChange}
    type="tab" mkey="name"/>;
    return (
      <div className="app_main_wrap">
        <div className="app_padding_wrap">
          <div className="col-md-12">
            <App/>
          </div>
        </div>
      </div>
    )
  }
};
