import React, { Component, PropTypes } from 'react';
import { render } from 'react-dom';
import MlTableViewContainer from "../../../core/containers/MlTableViewContainer";
import {mlSubDepartmentTableConfig} from "../config/mlSubDepartmentConfig";
export default class MlSubDepartmentsList extends Component {

  componentDidMount() {
  }

  render() {
    return (
      <div className="admin_main_wrap">
        <div className="admin_padding_wrap">
          <h2>Sub Departments List</h2>

          <MlTableViewContainer {...mlSubDepartmentTableConfig}/>

        </div>


      </div>
    )
  }
}
