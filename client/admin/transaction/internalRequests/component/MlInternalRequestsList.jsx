import React, {Component, PropTypes} from 'react';
import {render} from 'react-dom';
import MlTableViewContainer from "../../../core/containers/MlTableViewContainer";
import {mlInternalRequestsTableConfig} from "../../internalRequests/config/MlInternalRequestsConfig";
import CreateRequestComponent from './CreateRequestComponent'
import _ from 'lodash';

export default class MlInternalRequestsList extends Component {
  constructor(props){
    super(props);
    this.state={ time: new Date()};
  }

  render() {
    return (
      <div className="admin_main_wrap">
        <div className="admin_padding_wrap">
          <h2>Internal Requests </h2>
          <MlTableViewContainer {...mlInternalRequestsTableConfig} forceFetch={false}/>
        </div>
      </div>
    )
  }
}
