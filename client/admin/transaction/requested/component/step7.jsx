import React from 'react';
import MlTableViewContainer from "../../../core/containers/MlTableViewContainer";
import {mlRegistrationTabHistoryTableConfig} from "../registrationAuditLog/config/registrationTabHistoryConfig";

export default class Step7 extends React.Component {
  componentDidMount() {
    var WinHeight = $(window).height();
    $('.step_form_wrap').height(WinHeight - (160 + $('.admin_header').outerHeight(true)));
  }

  render() {
    let params = this.props ? this.props : null;
    return (
      <div className="step_form_wrap step5">
        {/*<h3>Coming Soon....</h3>*/}
        <MlTableViewContainer params={params} {...mlRegistrationTabHistoryTableConfig} forceFetch={false}/>
      </div>
    )
  }
};
