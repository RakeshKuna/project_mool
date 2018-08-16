import React, { Component, PropTypes } from 'react';
import { render } from 'react-dom';
import MlTableViewContainer from "../../../core/containers/MlTableViewContainer";
import {mlAddressTypeTableConfig} from "../config/mlAddressTypeConfig";
export default class MlAddressTypeList extends Component {

  componentDidMount() {
  }

  render() {
    return (
      <div className="admin_main_wrap">
        <div className="admin_padding_wrap">
          <h2>Address Type List</h2>

          <MlTableViewContainer {...mlAddressTypeTableConfig}/>

        </div>


      </div>
    )
  }
}
