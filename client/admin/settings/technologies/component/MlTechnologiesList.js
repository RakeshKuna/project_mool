import React, { Component, PropTypes } from 'react';
import { render } from 'react-dom';
import MlTableViewContainer from "../../../core/containers/MlTableViewContainer";
import {mlTechnologiesTableConfig} from "../config/MlTechnologyConfig";
export default class MlTechnologiesList extends Component {

  componentDidMount() {
  }

  render() {
    return (
      <div className="admin_main_wrap">
        <div className="admin_padding_wrap">
            <h2>Technologies List</h2>
            <MlTableViewContainer {...mlTechnologiesTableConfig}/>
        </div>


      </div>
    )
  }
}
