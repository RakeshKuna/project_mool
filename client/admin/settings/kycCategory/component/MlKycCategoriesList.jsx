import React, { Component, PropTypes } from 'react';
import { render } from 'react-dom';
import MlTableViewContainer from "../../../core/containers/MlTableViewContainer";
import {mlKycCategoryTableConfig} from "../config/mlKycCategoryConfig";
export default class MlKycCategoriesList extends Component {

  componentDidMount() {
  }

  render() {
    return (
      <div className="admin_main_wrap">
        <div className="admin_padding_wrap">
          <h2>KYC Categories List</h2>

          <MlTableViewContainer {...mlKycCategoryTableConfig}/>

        </div>


      </div>
    )
  }
}
