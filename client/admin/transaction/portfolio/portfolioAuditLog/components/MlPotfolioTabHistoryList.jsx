import React, { Component, PropTypes } from 'react';
import { render } from 'react-dom';
import MlTableViewContainer from "../../../../core/containers/MlTableViewContainer";
import {mlPortfolioTabHistoryTableConfig} from "../config/portfolioTabHistoryConfig";
export default class MlPotfolioTabHistoryList extends Component {

  componentDidMount() {
  }

  render() {
    let params = this.props.params ? this.props.params : null;
    return (
      <div className="admin_main_wrap">
        <div className="admin_padding_wrap">
          <h2>History Details</h2>
          <MlTableViewContainer params={params} {...mlPortfolioTabHistoryTableConfig}/>
        </div>
      </div>
    )
  }
}
