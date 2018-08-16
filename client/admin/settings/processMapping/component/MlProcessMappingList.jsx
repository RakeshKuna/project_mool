import React, {Component, PropTypes} from 'react';
import {render} from 'react-dom';
import MlTableViewContainer from "../../../core/containers/MlTableViewContainer";
import {mlProcessTableConfig} from "../config/mlProcessTableConfig";
export default class MlProcessMappingList extends Component {

  componentDidMount() {
  }

  render() {
    return (
      <div className="admin_main_wrap">
        <div className="admin_padding_wrap">
          <h2>Process Mapping List</h2>

          <MlTableViewContainer {...mlProcessTableConfig}/>

        </div>


      </div>
    )
  }
}
