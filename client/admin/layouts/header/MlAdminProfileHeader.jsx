import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import  MlAdminProfile from './MlAdminProfile'
import VerticalBreadCrum from "../breadcrum/VerticalBreadCrum";
import MlAdminProfileTabView from "./MlAdminProfileTabView";
export default class MlAdminProfileHeader extends Component {
  constructor(props,context){
    super(props,context);
    this.state={
      tabOptions:props.tabOptions,
    }
    return this;
  }
  componentWillMount(){
    const resp=this.findProcess();
    return resp;
  }

  async findProcess() {
    let documentsList=[]
      let response = [{"tabName":"personalInfo","tabCode":"Personal Info"},{"tabName":"AddressBook","tabCode":"Address Book"},{"tabName":"Settings","tabCode":"Settings"}]
      if(response){
        let documents=response
        for(let i=0;i<documents.length;i++){
          let json={
            "link": "/admin/myprofile/"+documents[i].tabName,
            "name":documents[i].tabCode ,
            "uniqueId": this.props.module === documents[i].tabName ? "myprofile" :"myprofile_tabs",
            "isLink": true,
            "isMenu": false,
            "image": ""
          }
          documentsList.push(json)
        }
        this.setState({"processMenus":documentsList})
      }
    //}
  }
  render(){
    let subMenu = this.context.menu.menu||[];
    let tabsubMenu;
    if(subMenu){
      tabsubMenu=subMenu;
    }

    return (
      <div className="admin_header">
        <MlAdminProfile/>

        <VerticalBreadCrum {...this.props}/>
        <div className="header_bottom">
          <MlAdminProfileTabView  hierarchyOption={this.state.processMenus} linkField="link" nameField="name"/>
        </div>
      </div>

    )
  }
}

MlAdminProfileHeader.contextTypes = {
  menu: React.PropTypes.object
};
