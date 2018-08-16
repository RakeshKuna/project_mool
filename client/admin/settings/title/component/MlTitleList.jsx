import React, { Component, PropTypes } from 'react';
import { render } from 'react-dom';
import MlTableViewContainer from "../../../core/containers/MlTableViewContainer";
import {mlTitleTableConfig} from "../config/MlTitleConfig";
export default class MlTitleList extends Component {

  render() {
    return (
      <div className="admin_main_wrap">
        <div className="admin_padding_wrap">
          <h2>Title List</h2>
          <MlTableViewContainer {...mlTitleTableConfig}/>
        </div>
      </div>
    )
  }
}
