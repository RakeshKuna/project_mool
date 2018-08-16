import React, { Component, PropTypes } from 'react';
import { render } from 'react-dom';
import MlTableViewContainer from "../../../core/containers/MlTableViewContainer";
import {mlBusinessTypeTableConfig} from "../config/MlBusinessTypeConfig";
export default class MlBusinessTypeList extends Component {

  componentDidMount() {
  }

  render() {
    return (
      <div className="admin_main_wrap">
        <div className="admin_padding_wrap">
          <h2>Business Type List</h2>

          <MlTableViewContainer {...mlBusinessTypeTableConfig}/>

        </div>
      </div>
    )
  }
}
