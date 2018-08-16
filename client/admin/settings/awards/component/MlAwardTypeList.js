import React, { Component, PropTypes } from 'react';
import { render } from 'react-dom';
import MlTableViewContainer from "../../../core/containers/MlTableViewContainer";
import {mlAwardTypeTableConfig} from "../config/MlAwardTypeConfig";
export default class MlAwardTypeList extends Component {

  componentDidMount() {
  }

  render() {
    return (
      <div className="admin_main_wrap">
        <div className="admin_padding_wrap">
          <h2>Award Types List</h2>
          <MlTableViewContainer {...mlAwardTypeTableConfig}/>
        </div>
      </div>
    )
  }
}
