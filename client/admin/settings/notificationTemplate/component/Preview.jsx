import React from "react";
var FontAwesome = require('react-fontawesome');
import _ from 'underscore';
export default class Preview extends React.Component {

  constructor(props) {
    super(props);
    return this;
  }


  render() {
    var src=this.props.data&&this.props.data.content?this.props.data.content:'';
    src=_.unescape(src);
    return (
      <form>
        <iframe srcDoc={src} style={{'height':'350px','width':'700px'}}>
        </iframe>
      </form>
    );
  }

}
