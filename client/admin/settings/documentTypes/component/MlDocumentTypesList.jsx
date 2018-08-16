import React, { Component, PropTypes } from 'react';
import { render } from 'react-dom';
import MlTableViewContainer from "../../../core/containers/MlTableViewContainer";
import {mlDocumentTypesTableConfig} from "../config/mlDocumentTypeConfig";
export default class MlDocumentTypesList extends Component {

  componentDidMount() {
  }

  render() {
    return (
      <div className="admin_main_wrap">
        <div className="admin_padding_wrap">
          <h2>Document Types List</h2>

          <MlTableViewContainer {...mlDocumentTypesTableConfig}/>

        </div>


      </div>
    )
  }
}
