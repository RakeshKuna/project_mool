import React, { Component, PropTypes } from 'react';
import { render } from 'react-dom';
import MlTableViewContainer from "../../../core/containers/MlTableViewContainer";
import {mlLookingForTableConfig} from "../config/MlLookingForTypeConfig";
export default class MlLookingForList extends Component {

  componentDidMount() {
  }

  render() {
    return (
      <div className="admin_main_wrap">
        <div className="admin_padding_wrap">
          <h2>Looking For List</h2>

          <MlTableViewContainer {...mlLookingForTableConfig}/>

        </div>


      </div>
    )
  }
}
