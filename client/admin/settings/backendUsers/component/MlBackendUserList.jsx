import React, { Component, PropTypes } from 'react';
import { render } from 'react-dom';
import MlListViewContainer from "../../../core/containers/MlListViewContainer";
import {mlBackendUserListConfig} from "../config/mlBackendUserListConfig";
export default class MlBackendUserList extends Component {

  componentDidMount() {
  }

  render() {
    return (
      <div className="admin_main_wrap">
         <MlListViewContainer {...mlBackendUserListConfig} />
      </div>
    )
  }
}
