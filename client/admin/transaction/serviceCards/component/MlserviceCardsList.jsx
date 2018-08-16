/** ************************************************************
 * Date: 19 Jun, 2017
 * Programmer: Mukhil <mukhil.padnamanabhan@raksan.in>
 * Description : This is the list view
 * JavaScript XML file MlserviceCardsList.jsx
 * *************************************************************** */

/**
 * Imports libs and components
 */

import React, {Component, PropTypes} from 'react';
import MlTableViewContainer from "../../../core/containers/MlTableViewContainer";
import {mlProcessSetupRequestsTableConfig} from "../config/MlserviceCardsConfig";
import _ from 'lodash';

export default class MlserviceCardsList extends Component {

  /**
   * Constructor
   * @param props :: Object - Parents data
   */

  constructor(props){
    super(props);
    this.state={showCreateRequestComponent:false, time: new Date()};
  }

  /**
   * Method :: addRequestHandler
   * Desc   :: showCreateRequestComponent state is set
   */

  addRequestHandler(){
    this.setState({showCreateRequestComponent:true});
  }
  /**
   * Render
   * Desc   :: Render the HTML for this component
   * @returns {HTML}
   */

  render() {
    let actions= mlProcessSetupRequestsTableConfig.actionConfiguration;
    let action = _.find(actions, {"actionName": "add"});
    action.handler=this.addRequestHandler.bind(this);
    return (
      <div className="admin_main_wrap">
        <div className="admin_padding_wrap">
          <h2>Service Cards </h2>
            <MlTableViewContainer {...mlProcessSetupRequestsTableConfig} forceFetch={false}/>
        </div>
      </div>
    )
  }
}
