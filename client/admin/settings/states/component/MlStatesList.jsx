import React, { Component, PropTypes } from 'react';
import { render } from 'react-dom';
import MlTableViewContainer from "../../../core/containers/MlTableViewContainer";
import {mlStatesTableConfig} from "../config/mlStatesConfig";
export default class MlStatesList extends Component {

  componentDidMount() {
  }

  render() {
    return (
      <div className="admin_main_wrap">
        <div className="admin_padding_wrap">
          <h2>States List</h2>

          <MlTableViewContainer {...mlStatesTableConfig}/>

        </div>
      </div>
    )
  }
}
