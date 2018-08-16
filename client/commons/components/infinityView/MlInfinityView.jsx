import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import  $ from 'jquery'
export default class MlInfinityView extends Component {
  constructor(props){
    super(props);

    return this;
  };
  onClickViewMode(e){
    let className=e.target.className;

    if(this.props.viewMode){
     // this.setState({viewModeCSS:"view_switch list_view"});

    this.props.onViewModeChange(false);
    }
    else{
     // this.setState({viewModeCSS:"view_switch map_view"});
      this.props.onViewModeChange(true);
    }

  }

  componentDidMount()
  {

  }

  render(){
     let viewModeCSS=this.props.viewMode?'view_switch map_view':'view_switch list_view';

    return(

        <div className={viewModeCSS} onClick={this.onClickViewMode.bind(this)} ></div>


    )
  }

}
MlInfinityView.propTypes={
 onViewModeChange: React.PropTypes.func,
  viewMode:React.PropTypes.bool
}


