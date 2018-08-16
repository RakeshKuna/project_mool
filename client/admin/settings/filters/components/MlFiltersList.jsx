import React, { Component, PropTypes } from 'react';
import { render } from 'react-dom';
import MlTableViewContainer from "../../../core/containers/MlTableViewContainer";
import {mlFilterTableConfig} from "../config/mlFilterConfig";

export default class MlFiltersList extends Component {

  componentDidMount() {
  }

  render() {
    return (
      <div className="admin_main_wrap">
        <div className="admin_padding_wrap">
          <h2>Filters List</h2>

          <MlTableViewContainer {...mlFilterTableConfig}/>

        </div>
      </div>
    )
  }
}
