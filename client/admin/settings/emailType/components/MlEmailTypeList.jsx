import React, { Component, PropTypes } from 'react';
import { render } from 'react-dom';
import MlTableViewContainer from "../../../core/containers/MlTableViewContainer";
import {mlEmailTypeTableConfig} from "../config/mlEmailTypeConfig";
export default class MlEmailTypesList extends Component {

  componentDidMount() {
  }

  render() {
    return (
      <div className="admin_main_wrap">
        <div className="admin_padding_wrap">
          <h2>Email Types</h2>

          <MlTableViewContainer {...mlEmailTypeTableConfig}/>

        </div>


      </div>
    )
  }
}
