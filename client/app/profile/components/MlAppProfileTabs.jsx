
import React from 'react';
import { render } from 'react-dom';
var FontAwesome = require('react-fontawesome');
import MlTabComponent from "../../../commons/components/tabcomponent/MlTabComponent";
import MyProfileAddressBook from '../../../admin/profile/component/MlMyProfileAddressBook'
import MyProfileSettings from '../../../admin/profile/component/MlMyProfileSettings'
import MlMyProfile from '../../../admin/profile/component/MlMyprofile'
import AppActionButtons from '../../commons/components/appActionButtons'
import 'react-responsive-tabs/styles.css'
import PortfolioLibrary from '../../../commons/components/portfolioLibrary/PortfolioLibrary'
import {appClient} from '../../core/appConnection'

export default class MlAppProfileTabs extends React.Component{
constructor(props){
  super(props)
  this.state =  {
    tabs: [],
  };
}

componentDidMount(){

}

getTabComponents(){
  let tabs = [
    {tabClassName: 'tab', panelClassName: 'panel', title:"Personal Info" , component:<MlMyProfile key="1"/>},    //this.props.portfolioDetailsId}
    {tabClassName: 'tab', panelClassName: 'panel', title:"Address Book" , component:<MyProfileAddressBook key="2"/>},   //id will be dyanmic
    {tabClassName: 'tab', panelClassName: 'panel', title:"Settings" , component:<MyProfileSettings key="3" />},
    {tabClassName: 'tab', panelClassName: 'panel', title:"Library" , component:<PortfolioLibrary key="4" isAdmin={false} client={appClient}/>},     //id will be dyanmic
  ]
  return tabs;
}

componentWillMount()
{
  let tabs = this.getTabComponents();
  function getTabs() {
    return tabs.map(tab => ({
      tabClassName: 'horizon-item', // Optional
      panelClassName: 'panel1', // Optional
      title: tab.title,
      getContent: () => tab.component
    }));
  }
  this.setState({tabs:getTabs() ||[]});
}

render(){
  let tabs = this.state.tabs;
  return (
    <div className="app_main_wrap">
      <div className="app_padding_wrap">
        <div className="col-md-12">
          <MlTabComponent tabs={tabs}/>
        </div>
        <AppActionButtons/>
        <br className="brclear"/>
      </div>
    </div>
  )
}
}
