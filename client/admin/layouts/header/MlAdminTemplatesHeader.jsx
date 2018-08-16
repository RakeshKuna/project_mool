import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import MlAdminTemplatesTabView from  './MlAdminTemplatesTabView'
import MlAdminSearch from  './MlAdminSearch'
import  MlAdminProfile from './MlAdminProfile'
import VerticalBreadCrum from "../breadcrum/VerticalBreadCrum";
import {findTemplateStepsActionHandler} from './actions/findTemplateStepsAction'
export default class MlAdminTemplatesHeader extends Component {
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
    let subProcessId = this.props.subProcessConfig
    let templateId=this.props.templateId
    if(subProcessId){
      const response = await findTemplateStepsActionHandler(subProcessId);
      if(response){
        let documents=response.steps
        for(let i=0;i<documents.length;i++){
          let json={
            "link": "/admin/settings/stepDetails/"+subProcessId+"/"+templateId+"/"+documents[i].stepCode,
            "name":documents[i].stepName ,
            "uniqueId": "subProcess_Steps",
            "subMenuMappingId":"subProcess_Steps_subMapping",
            "subMenusId":"subProcess",
            "isLink": true,
            "isMenu": false,
            "image": ""
          }
          documentsList.push(json)
        }
        this.setState({"processMenus":documentsList})
      }
    }
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
          <MlAdminTemplatesTabView  subProcessOPtion={this.state.processMenus} linkField="link" nameField="name"/>
        </div>
      </div>

    )
  }
}

MlAdminTemplatesHeader.contextTypes = {
  menu: React.PropTypes.object
};
