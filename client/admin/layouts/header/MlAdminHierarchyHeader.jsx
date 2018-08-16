import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import MlAdminHierarchyTabView from  './MlAdminHierarchyTabView'
import  MlAdminProfile from './MlAdminProfile'
import VerticalBreadCrum from "../breadcrum/VerticalBreadCrum";
export default class MlAdminHierarchyHeader extends Component {
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
      let response = [{"tabName":"platformhierarchy","tabCode":"platform hierarchy"},{"tabName":"clusterhierarchy","tabCode":"cluster hierarchy"},{"tabName":"history","tabCode":"history"}]
      if(response){
        let documents=response
        for(let i=0;i<documents.length;i++){
          let json={
            "link": "/admin/settings/hierarchy/"+documents[i].tabName,
            "name":documents[i].tabCode ,
            "uniqueId": "hierrarchy_Steps",
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
          <MlAdminHierarchyTabView  hierarchyOption={this.state.processMenus} linkField="link" nameField="name"/>
        </div>
      </div>

    )
  }
}

MlAdminHierarchyHeader.contextTypes = {
  menu: React.PropTypes.object
};
