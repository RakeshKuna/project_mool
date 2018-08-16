/**
 * Created by pankaj on 28/8/17.
 */
import React, {Component} from "react";

export default class MlAppEventComponent extends Component {

  constructor(props) {
    super(props);
    this.state ={
      status:''
    };
    // console.log('props', props);
  }

  render(){
    const that = this;
    const {calendar} = that.props;
    const className = calendar && calendar.event ? calendar.event.className : '';
    return (
      <span>
        <span className={className}></span>
        <span>{calendar ? calendar.title : ''}</span>
      </span>
    )
  }
}
