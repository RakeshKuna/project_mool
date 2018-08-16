import React, { Component, PropTypes } from 'react';
import { render } from 'react-dom';
import MlTableViewContainer from "../../../core/containers/MlTableViewContainer";
import {mlSubDomainTableConfig} from "../config/MlSubDomainConfig";
export default class MlSubDomainList extends Component {

  componentDidMount() {
  }

  render() {
    return (
      <div className="admin_main_wrap">
        <div className="admin_padding_wrap">
          <h2>Sub Domain List</h2>
          <MlTableViewContainer {...mlSubDomainTableConfig}/>
        </div>


      </div>
    )
  }
}
