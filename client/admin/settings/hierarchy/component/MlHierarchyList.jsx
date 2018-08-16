import React, { Component, PropTypes } from 'react';
import { render } from 'react-dom';
import MlTableViewContainer from "../../../core/containers/MlTableViewContainer";
import {mlHierarchyTableConfig} from "../config/mlHierarchyConfig";
export default class MlHierarchyList extends Component {

  componentDidMount() {
  }

  render() {
    return (
      <div className="admin_main_wrap">
        <div className="admin_padding_wrap">
          <h2>Hierarchy List</h2>

          <MlTableViewContainer {...mlHierarchyTableConfig}/>

        </div>


      </div>
    )
  }
}
