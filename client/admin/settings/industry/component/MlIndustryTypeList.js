import React, { Component, PropTypes } from 'react';
import { render } from 'react-dom';
import MlTableViewContainer from "../../../core/containers/MlTableViewContainer";
import {mlIndustryTypeTableConfig} from "../config/MlIndustryTypeConfig";
export default class MlIndustryTypeList extends Component {

  componentDidMount() {
  }

  render() {
    return (
      <div className="admin_main_wrap">
        <div className="admin_padding_wrap">
          <h2>Industry Types List</h2>
          <MlTableViewContainer {...mlIndustryTypeTableConfig}/>
        </div>
      </div>
    )
  }
}
