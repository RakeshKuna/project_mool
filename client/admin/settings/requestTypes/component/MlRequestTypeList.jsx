import React, { Component, PropTypes } from 'react';
import { render } from 'react-dom';
import MlTableViewContainer from "../../../core/containers/MlTableViewContainer";
import {mlRequestTypeTableConfig} from "../config/MlRequestTypeConfig";
export default class MlRequestTypeList extends Component {

  componentDidMount() {
  }

  render() {
    return (
      <div className="admin_main_wrap">
        <div className="admin_padding_wrap">
          <h2>Request Type List</h2>

          <MlTableViewContainer {...mlRequestTypeTableConfig}/>

        </div>


      </div>
    )
  }
}
