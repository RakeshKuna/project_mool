import React, { Component, PropTypes } from 'react';
import { render } from 'react-dom';
import MlTableViewContainer from "../../../core/containers/MlTableViewContainer";
import {mlAssetsTableConfig} from "../config/MlAssetsConfig";
export default class MlAssetsList extends Component {

  componentDidMount() {
  }

  render() {
    return (
      <div className="admin_main_wrap">
        <div className="admin_padding_wrap">
          <h2>Assets List</h2>

          <MlTableViewContainer {...mlAssetsTableConfig}/>

        </div>


      </div>
    )
  }
}
