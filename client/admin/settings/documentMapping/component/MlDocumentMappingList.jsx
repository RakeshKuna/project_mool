import React, {Component, PropTypes} from 'react';
import {render} from 'react-dom';
import MlTableViewContainer from "../../../core/containers/MlTableViewContainer";
import {mlDocumentMappingTableConfig} from "../config/mlDocumentMappingConfig";
export default class MlDocumentMappingList extends Component {

  componentDidMount() {
  }

  render() {
    return (
      <div className="admin_main_wrap">
        <div className="admin_padding_wrap">
          <h2>Document Mapping List</h2>

          <MlTableViewContainer {...mlDocumentMappingTableConfig}/>

        </div>


      </div>
    )
  }
}
