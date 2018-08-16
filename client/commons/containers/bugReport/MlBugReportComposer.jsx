import React, {Component} from 'react';
import BugReportComponent from "../../components/bugReport/BugReport";
import formHandler from "../MlFormHandler";
import {createBugReport} from "../../actions/mlBugReportHandler";

  class BugReport extends Component {
  constructor(props){
    super(props);
    return this;
  }

  /**
   * Method :: createBugReport
   * Desc   :: creates the bug report
   * @param  :: Object ::
   * @param queryCallbackHandler :: Function :: Callback function executed once data is fetched
   * @returns Void
   */
  async createBugHandler(bugDesc,successCallBack){
    var reportedUrl=window.location.pathname;
    this.props.handler(createBugReport.bind(null,{'details':bugDesc,'reportedUrl':reportedUrl},this.props.connection),successCallBack);
  };

  render(){
    /**
     * returning the Generic Select Component
     */
    return(
      <BugReportComponent {...this.props} createBugHandler={this.createBugHandler.bind(this)}></BugReportComponent>
    )
  }
}

export default BugReport = formHandler()(BugReport);
