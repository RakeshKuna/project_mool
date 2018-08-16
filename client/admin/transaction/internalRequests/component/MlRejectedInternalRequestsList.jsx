import React, {Component, PropTypes} from 'react';
import {render} from 'react-dom';
import MlTableViewContainer from "../../../core/containers/MlTableViewContainer";
import {mlRejectedInternalRequestsTableConfig} from "../../internalRequests/config/MlRejectedInternalRequestsConfig"
export default class MlRejectedInternalRequestsList extends Component {
  constructor(props){
    super(props);

  }
  componentDidMount() {
  }
  render() {

    return (
      <div className="admin_main_wrap">
        <div className="admin_padding_wrap">
          <h2>Rejected Internal Requests </h2>
          <MlTableViewContainer {...mlRejectedInternalRequestsTableConfig} />
        </div>
      </div>
    )
  }
}
