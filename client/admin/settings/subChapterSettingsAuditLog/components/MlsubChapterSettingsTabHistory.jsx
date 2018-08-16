import React, { Component, PropTypes } from 'react';
import { render } from 'react-dom';
import MlTableViewContainer from "../../../core/containers/MlTableViewContainer";

import {mlsubChapterSettingsTabHistoryTableConfig} from "../config/subChapterSettingsHistoryConfig";
export default class MlsubChapterSettingsTabHistoryList extends Component {

  componentDidMount() {
  }

  render() {
    let params = this.props.params ? this.props.params : null;
    return (
      <div className="admin_main_wrap">
        <div className="admin_padding_wrap">
          <h2>History Details</h2>
          <MlTableViewContainer params={params} {...mlsubChapterSettingsTabHistoryTableConfig}/>
        </div>
      </div>
    )
  }
}
