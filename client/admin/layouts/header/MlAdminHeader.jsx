import React, { Component, PropTypes } from 'react';
import MlTabView from  './MlAdminTabView'
import MlAdminSearch from  './MlAdminSearch'
import  MlAdminProfile from './MlAdminProfile'
import VerticalBreadCrum from "../breadcrum/VerticalBreadCrum";
import BugReportWrapper from "../../commons/components/MlAdminBugReportWrapper";

const build_versionToken = localStorage.getItem('build_version');
const buildInstance = Meteor.settings.public.instance;

export default class MlAdminHeader extends Component {
  constructor(props,context){
    super(props,context);
    this.state={
      tabOptions:props.tabOptions,
    };
    return this;
  }

  /**
   * @function to inisilize the tool-tip through out the admin modules
   */
  componentDidMount() {
    $('body').tooltip({
      selector: '[data-toggle="tooltip"], [title]:not([data-toggle="popover"])',
      trigger: 'hover',
      container: 'body'
    }).on('click mousedown mouseup', '[data-toggle="tooltip"], [title]:not([data-toggle="popover"])', () => {
      $('[data-toggle="tooltip"], [title]:not([data-toggle="popover"])').tooltip('destroy');
    });
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
        <div className="overlay"> </div>
        <BugReportWrapper />

        <MlAdminProfile/>
          <span className="version"> {buildInstance} - Ver.&beta;eta {build_versionToken}</span>
        <VerticalBreadCrum {...this.props}/>
        <div className="header_bottom">
          <MlTabView tabOptions={tabsubMenu}  linkField="link" nameField="name"/>
        </div>
      </div>

    )
  }
}

MlAdminHeader.contextTypes = {
  menu: React.PropTypes.object
};
