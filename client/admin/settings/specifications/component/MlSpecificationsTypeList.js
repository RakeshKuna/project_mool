import React, { Component, PropTypes } from 'react';
import { render } from 'react-dom';
import MlTableViewContainer from "../../../core/containers/MlTableViewContainer";
import {mlSpecificationTypeTableConfig} from "../config/MlSpecificationsTypeConfig";
export default class MlSpecificationTypeList extends Component {

  componentDidMount() {
  }

  render() {
    return (
      <div className="admin_main_wrap">
        <div className="admin_padding_wrap">
          <h2>Specification Types List</h2>
          <MlTableViewContainer {...mlSpecificationTypeTableConfig}/>
        </div>
      </div>
    )
  }
}
