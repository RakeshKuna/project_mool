import React, {Component, PropTypes} from 'react';
import {render} from 'react-dom';
import MlTableViewContainer from "../../../core/containers/MlTableViewContainer";
import {mlActionsAndStatueseTableConfig} from "../config/mlActionsAndStatusesTableConfig";
export default class MlActionAndStatusList extends Component {

  render() {
    return (
      <div className="admin_main_wrap">
        <div className="admin_padding_wrap">
          <h2>Actions and Statuses List</h2>

          <MlTableViewContainer {...mlActionsAndStatueseTableConfig}/>

        </div>


      </div>
    )
  }
}
