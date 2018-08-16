import React, {Component, PropTypes} from 'react';
import {render} from 'react-dom';
import MlTableViewContainer from "../../../core/containers/MlTableViewContainer";
import {mlApprovedInternalRequestsTableConfig} from "../../internalRequests/config/MlApprovedInternalRequestsConfig"
export default class MlApprovedInternalRequestsList extends Component {
  constructor(props){
    super(props);

  }
  componentDidMount() {
  }
  render() {

    return (
      <div className="admin_main_wrap">
        <div className="admin_padding_wrap">
          <h2>Approved Internal Requests </h2>
          <MlTableViewContainer {...mlApprovedInternalRequestsTableConfig} />
        </div>
      </div>
    )
  }
}
