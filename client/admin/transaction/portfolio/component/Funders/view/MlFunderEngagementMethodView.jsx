import React from "react";
import {render} from "react-dom";

export default class MlFunderEngagementMethodView extends React.Component {
  componentDidMount() {
  }

  render() {
    return (
      <div className="admin_main_wrap">
        <div className="admin_padding_wrap">
          <h2>Engagement Methods</h2>
          <div className="main_wrap_scroll">
            <ul className="list-info">
              <li>Phone Calls</li>
              <li>Video Calls</li>
            </ul>
          </div>
        </div>
      </div>
    )
  }
};
