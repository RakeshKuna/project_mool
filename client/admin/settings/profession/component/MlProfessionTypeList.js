import React, { Component, PropTypes } from 'react';
import { render } from 'react-dom';
import MlTableViewContainer from "../../../core/containers/MlTableViewContainer";
import {mlProfessionTableConfig} from "../config/MlProfessionTypeConfig";
export default class MlProfessionList extends Component {

  componentDidMount() {
  }

  render() {
    return (
      <div className="admin_main_wrap">
        <div className="admin_padding_wrap">
          <h2>Profession List</h2>

          <MlTableViewContainer {...mlProfessionTableConfig}/>

        </div>


      </div>
    )
  }
}
