/**
 * Created by pankaj on 7/6/17.
 */

import React from 'react';
import Tabs from 'react-responsive-tabs';
import MlAppAddOfficeMember from './MlAppAddOfficeMember';
import MlUpgradeOffice from './MlUpgradeOffice';
import 'react-responsive-tabs/styles.css';
import {findOfficeAction} from "../actions/findOfficeAction";
import {getMyOfficeRoleActionHandler} from "../actions/getMyOfficeRole";
import MlTableViewContainer from "../../../../../client/admin/core/containers/MlTableViewContainer";
import {mlOfficeTransactionConfig} from "../config/MlOfficeTransactionConfig";
import MlTabComponent from "../../../../commons/components/tabcomponent/MlTabComponent";

export default class MlAppEditOffice extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      availableCommunities:[],
      role : '',
      activeTab:'Principals',
    }
  }
  componentWillMount() {

    setTimeout(function () {
      if( !FlowRouter.getQueryParam('tab') ) {
        FlowRouter.setQueryParams({ tab: "Principals" });
      }
    },100);

    setTimeout(function () {
      let params = new URL(window.location.href).searchParams;
      if(!params.get('tab')) {
        FlowRouter.reload();
      }
    },100);


    const resp = this.officeDetails();
    this.getMyOfficeRole();
    let activeTab = FlowRouter.getQueryParam('tab');
    if(activeTab){
      this.setState({activeTab});
    }
    return resp;
  }

  async getMyOfficeRole() {
    let officeId = FlowRouter.getParam('officeId')
    let response = await getMyOfficeRoleActionHandler(officeId);
    if(response.success){
      this.setState({
        role: response.result
      })
    }
  }

  async officeDetails() {
    let officeId = FlowRouter.getParam('officeId')
    let response = await findOfficeAction(officeId);
    if (response && response.success) {
      let data = JSON.parse(response.result)
      let obj = data [0];
      let availableCommunities = obj && obj.office && obj.office.availableCommunities && obj.office.availableCommunities.length ? obj.office.availableCommunities : [];
      // availableCommunities.push({communityId:'officeBairer',communityName:'Office Bairer'});
      // availableCommunities.push({communityId:'consultant',communityName:'Consultant'});
      this.setState({loading: false, office: obj.office, availableCommunities:availableCommunities})
    } else {
      this.setState({loading: false})
    }
  }
  updateTab(index){
    let tab =  this.state.tabs[index].title;
    FlowRouter.setQueryParams({ tab: tab });
  }
  render(){
    const that = this;
    let noAccessMessage = <p className="text-danger">No access for team member. Only principle can have access to this tab.</p>
    const isAddNewMember = that.state.role == "Principal" || that.state.role == "AdminUser";
    let MlTabs = [
      {name: 'Principals', tabContent: <MlAppAddOfficeMember role={this.state.role} isAdd={isAddNewMember} />},
      {name: 'Team Members', tabContent: <MlAppAddOfficeMember role={this.state.role} isAdd={isAddNewMember} availableCommunities={this.state.availableCommunities} />},
      {name: 'Office Transactions',
        tabContent: isAddNewMember ? <MlTableViewContainer role={this.state.role} params={this.props.config} {...mlOfficeTransactionConfig}/> : noAccessMessage },
      {name: 'Upgrade Office',
        tabContent: isAddNewMember ? <MlUpgradeOffice  role={this.state.role} /> : noAccessMessage }
    ];

    function getTabs() {
      return MlTabs.map(MlTab => ({
        tabClassName: 'horizon-item', // Optional
        panelClassName: 'panel1', // Optional
        title: MlTab.name,
        key: MlTab.name,
        getContent: () => MlTab.tabContent,
      }));
    }

    const App = () => <MlTabComponent tabs={getTabs()}  selectedTabKey={this.state.activeTab}  onChange={this.updateTab} type="tab" mkey="name"/>;
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

