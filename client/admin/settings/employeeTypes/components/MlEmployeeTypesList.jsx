import React, { Component, PropTypes } from 'react';
import { render } from 'react-dom';
import MlTableViewContainer from "../../../core/containers/MlTableViewContainer";
import {mlEmployeeTypeTableConfig} from "../config/mlEmployeeTypeConfig";
export default class MlEmployeeTypesList extends Component {

  componentDidMount() {
  }

  render() {
    return (
      <div className="admin_main_wrap">
        <div className="admin_padding_wrap">
          <h2>Employee Types</h2>

          <MlTableViewContainer {...mlEmployeeTypeTableConfig}/>

        </div>


      </div>
    )
  }
}
