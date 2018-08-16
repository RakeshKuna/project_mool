import React, { Component, PropTypes } from 'react';
import { render } from 'react-dom';
import MlTableViewContainer from "../../../core/containers/MlTableViewContainer";
import {mlContactTypeTableConfig} from "../config/mlContactTypeConfig";
export default class MlContactTypesList extends Component {

  componentDidMount() {
  }

  render() {
    return (
      <div className="admin_main_wrap">
        <div className="admin_padding_wrap">
          <h2>Contact Types</h2>

          <MlTableViewContainer {...mlContactTypeTableConfig}/>

        </div>


      </div>
    )
  }
}
