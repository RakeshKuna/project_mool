import React, { Component, PropTypes } from 'react';
import { render } from 'react-dom';
import MlTableViewContainer from "../../../core/containers/MlTableViewContainer";
import {mlCitizenshipTableConfig} from "../config/MlCitizenshipTypeConfig";
export default class MlCitizenshipList extends Component {

  componentDidMount() {
  }

  render() {
    return (
      <div className="admin_main_wrap">
        <div className="admin_padding_wrap">
          <h2>Citizenship List</h2>

          <MlTableViewContainer {...mlCitizenshipTableConfig}/>

        </div>
      </div>
    )
  }
}
