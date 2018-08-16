import React, { Component, PropTypes } from 'react';
import { render } from 'react-dom';
import MlTableViewContainer from "../../../core/containers/MlTableViewContainer";
import {mlCompanyTypeTableConfig} from "../config/mlCompanyTypeConfig";
export default class MlCompanyTypesList extends Component {

  componentDidMount() {
  }

  render() {
    return (
      <div className="admin_main_wrap">
        <div className="admin_padding_wrap">
          <h2>Company Types</h2>

          <MlTableViewContainer {...mlCompanyTypeTableConfig}/>

        </div>


      </div>
    )
  }
}
