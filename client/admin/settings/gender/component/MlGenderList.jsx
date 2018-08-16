import React, { Component, PropTypes } from 'react';
import { render } from 'react-dom';
import MlTableViewContainer from "../../../core/containers/MlTableViewContainer";
import {mlGenderTableConfig} from "../config/mlGenderConfig";
export default class MlGenderList extends Component {

  componentDidMount() {
  }

  render() {
    return (
      <div className="admin_main_wrap">
        <div className="admin_padding_wrap">
          <h2>Gender List</h2>

          <MlTableViewContainer {...mlGenderTableConfig}/>

        </div>


      </div>
    )
  }
}
