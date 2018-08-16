import React, { Component, PropTypes } from 'react';
import { render } from 'react-dom';
import MlTableViewContainer from "../../../core/containers/MlTableViewContainer";
import {mlCountriesTableConfig} from "../config/mlCountriesConfig";
export default class MlCountriesList extends Component {

  componentDidMount() {
  }

  render() {
    return (
      <div className="admin_main_wrap">
        <div className="admin_padding_wrap">
          <h2>Countries List</h2>

          <MlTableViewContainer {...mlCountriesTableConfig}/>

        </div>


      </div>
    )
  }
}
