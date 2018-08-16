import React, { Component, PropTypes } from 'react';
import { render } from 'react-dom';
import MlTableViewContainer from "../../../core/containers/MlTableViewContainer";
import {mlDepartmentTableConfig} from "../config/mlDepartmentConfig";
export default class MlDepartmentsList extends Component {

  componentDidMount() {
  }

  render() {
    return (
      <div className="admin_main_wrap">
        <div className="admin_padding_wrap">
          <h2>Department List</h2>

          <MlTableViewContainer {...mlDepartmentTableConfig}/>

        </div>


      </div>
    )
  }
}
