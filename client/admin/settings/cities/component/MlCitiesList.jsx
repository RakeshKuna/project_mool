import React, { Component, PropTypes } from 'react';
import { render } from 'react-dom';
import MlTableViewContainer from "../../../core/containers/MlTableViewContainer";
import {mlCitiesTableConfig} from "../config/mlCitiesConfig";
export default class MlCitiesList extends Component {

  componentDidMount() {
  }

  render() {
    return (
      <div className="admin_main_wrap">
        <div className="admin_padding_wrap">
          <h2>Cities List</h2>

          <MlTableViewContainer {...mlCitiesTableConfig}/>

        </div>
      </div>
    )
  }
}
