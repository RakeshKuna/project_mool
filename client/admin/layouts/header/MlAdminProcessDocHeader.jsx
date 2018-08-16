import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import MlAdminProcessDocTabVew from  './MlAdminProcessDocTabVew'
import MlAdminSearch from  './MlAdminSearch'
import  MlAdminProfile from './MlAdminProfile'
import VerticalBreadCrum from "../breadcrum/VerticalBreadCrum";
import {findProcessActionHandler} from './actions/findProcessMappingAction'
export default class MlAdminProcessDocHeader extends Component {
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
    let pid = this.props.processMapConfig
    if(pid){
      const response = await findProcessActionHandler(pid);
      if(response){
        let documents=response.documents

        for(let i=0;i<documents.length;i++){
          if(documents[i].isActive){
            let json={
              "link": "/admin/documents/"+pid+"/"+documents[i].category+"/"+documents[i].type,
              "name":documents[i].categoryName ,
              "uniqueId": "documents_ClusterList",
              "subMenuMappingId":"documents_Clusters",
              "subMenusId":"documents",
              "isLink": true,
              "isMenu": false,
              "image": ""
            }
            documentsList.push(json)
          }

        }
        this.setState({"processMenus":documentsList})
      }
    }

  }
  render(){
    let subMenu = this.context.menu.menu||[];
    let tabsubMenu;
    //let subMenu=localStorage.getItem("leftNavSubMenu")
    if(subMenu){
      //tabsubMenu=JSON.parse(subMenu)
      tabsubMenu=subMenu;
    }

    return (
      <div className="admin_header">
        <MlAdminProfile/>

        <VerticalBreadCrum {...this.props}/>
        <div className="header_bottom">
          <MlAdminProcessDocTabVew  subProcessOPtion={this.state.processMenus} linkField="link" nameField="name"/>
        </div>
      </div>

    )
  }
}

MlAdminProcessDocHeader.contextTypes = {
  menu: React.PropTypes.object
};
