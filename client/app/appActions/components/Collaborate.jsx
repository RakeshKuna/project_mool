/**
 * Created by mohammed.mohasin on 9/6/17.
 */
import React from "react";
import {render} from "react-dom";

export default class Collaborate extends React.Component {

  constructor(props) {
    super(props);
    //this.collaborateActionHandler.bind(this);
    return this;
  }

  render() {

    return (
      <div>
        Do you want to connect ?
        <div className="ml_btn">
          <a href="" className="save_btn" >Connect</a>
          <a href="" className="cancel_btn" onClick={this.props.toggle}>Cancel</a>
        </div>

      </div>

    );
  }

}
