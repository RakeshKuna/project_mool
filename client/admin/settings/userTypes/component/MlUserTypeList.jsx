import React, {Component, PropTypes} from 'react';
import {render} from 'react-dom';
import MlTableViewContainer from "../../../core/containers/MlTableViewContainer";
import {mlUserTypeTableConfig} from "../config/mlUserTypeConfig";
export default class MlUserTypeList extends Component {

  componentDidMount() {
  }

  render() {
    return (
      <div className="admin_main_wrap">
        <div className="admin_padding_wrap">
          <h2>User Category List</h2>

          <MlTableViewContainer {...mlUserTypeTableConfig}/>

        </div>


      </div>
    )
  }
}
