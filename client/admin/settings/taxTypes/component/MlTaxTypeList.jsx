import React, { Component, PropTypes } from 'react';
import { render } from 'react-dom';
import MlTableViewContainer from "../../../core/containers/MlTableViewContainer";
import {mlTaxTypeTableConfig} from "../config/MlTaxTypeConfig";
export default class MlTaxTypeList extends Component {

  render() {
    return (
      <div className="admin_main_wrap">
        <div className="admin_padding_wrap">
          <h2>Tax Types</h2>
          <MlTableViewContainer {...mlTaxTypeTableConfig}/>
        </div>
      </div>
    )
  }
}
