import React, { Component } from "react";
import Days from "./Days.js";

export default class Calendar extends Component {

  render() {
    return (
      <div>
        <Days startDate={this.props.startDate}
              width={this.props.width}
              onDateSelect={this.props.handleDateSelect}/>
      </div>
    );
  }
}
