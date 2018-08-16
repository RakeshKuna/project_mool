import React, {Component, PropTypes} from 'react';
import {render} from 'react-dom';
import MlTableViewContainer from "../../../core/containers/MlTableViewContainer";
import {mlRoleTypeTableConfig} from "../config/mlRoleTypeConfig";
export default class MlRoleTypeList extends Component {

  componentDidMount() {
  }

  render() {
    return (
      <div className="admin_main_wrap">
        <div className="admin_padding_wrap">
          <h2>Role Types List</h2>

          <MlTableViewContainer {...mlRoleTypeTableConfig}/>

        </div>
      </div>
    )
  }
}
