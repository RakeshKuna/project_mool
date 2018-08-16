import React, { Component, PropTypes } from 'react';
import { render } from 'react-dom';
import MlTableViewContainer from "../../../core/containers/MlTableViewContainer";
import {mltemplatesConfig} from "../config/MlTemplatesConfig";
export default class MlTemplateTypeList extends Component {

  componentDidMount() {
  }

  render() {
    return (
      <div className="admin_main_wrap">
        <div className="admin_padding_wrap">
          <h2>Template List</h2>
          <MlTableViewContainer {...mltemplatesConfig}/>
        </div>
      </div>
    )
  }
}
