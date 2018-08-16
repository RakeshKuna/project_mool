import React, { Component, PropTypes } from 'react';
import { render } from 'react-dom';
import MlTableViewContainer from "../../../core/containers/MlTableViewContainer";
import {mlTaxationTableConfig} from "../config/MlTaxationConfig";
export default class MlTaxationList extends Component {

  render() {
    return (
      <div className="admin_main_wrap">
        <div className="admin_padding_wrap">
          <h2>Taxations</h2>
          <MlTableViewContainer {...mlTaxationTableConfig}/>
        </div>
      </div>
    )
  }
}
