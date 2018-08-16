import React, {Component, PropTypes} from 'react';
import {render} from 'react-dom';
import MlTableViewContainer from "../../../core/containers/MlTableViewContainer";
import {mlSystemsLogTableConfig} from "../config/MlSystemsLogConfig";
export default class MlSystemsLogList extends Component {
  constructor(props){
    super(props);
    // this.state={show:false,showCreateComponent:false,requestId:null,transactionId:null,canAssign:false,canUnAssign:false};
  }
  componentDidMount() {
  }
  render() {

    return (
      <div className="admin_main_wrap">
        <div className="admin_padding_wrap">
          <h2>System Logs </h2>
          <MlTableViewContainer {...mlSystemsLogTableConfig} />
        </div>
      </div>
    )
  }
}
