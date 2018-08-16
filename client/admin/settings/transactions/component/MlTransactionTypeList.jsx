import React, { Component, PropTypes } from 'react';
import { render } from 'react-dom';
import MlTableViewContainer from "../../../core/containers/MlTableViewContainer";
import {mlTransactionTypeTableConfig} from "../config/MlTransactionTypeConfig";
export default class MlTransactionTypeList extends Component {

  componentDidMount() {
  }

  render() {
    return (
      <div className="admin_main_wrap">
        <div className="admin_padding_wrap">
          <h2>Transaction Types List</h2>

          <MlTableViewContainer {...mlTransactionTypeTableConfig}/>

        </div>


      </div>
    )
  }
}
