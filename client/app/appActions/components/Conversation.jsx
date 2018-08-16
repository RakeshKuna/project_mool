/**
 * Created by mohammed.mohasin on 9/6/17.
 */
import React from "react";
import {render} from "react-dom";

export default class Conversation extends React.Component {

  constructor(props) {
    super(props);
    //this.conversationActionHandler.bind(this);
    return this;
  }

  render() {

    return (
      <div>

        <ul className="list_style">
          <li>
            <a href="">
              <FontAwesome name='envelope-o'/><br />
              Mail
            </a>
          </li>
          <li>
            <a href="">
              <FontAwesome name='comment-o'/><br />
              Chat
            </a>
          </li>
          <li>
            <a href="">
              <FontAwesome name='video-camera'/><br />
              Video
            </a>
          </li>
          <li>
            <a href="">
              <FontAwesome name='volume-up'/><br />
              Audio
            </a>
          </li>
          <li>
            <a href="">
              <FontAwesome name='mobile'/><br />
              SMS
            </a>
          </li>
          <li>
            <a href="">
              <FontAwesome name='phone'/><br />
              Call
            </a>
          </li>
        </ul>

      </div>

    );
  }

}
