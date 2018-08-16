import React, { Component, PropTypes } from 'react';
import { render } from 'react-dom';
export default class MlInfinity extends Component {
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
      // let view;
      // if(this.props.viewModeParams == false){
      //   view = this.props.viewModeParams;
      // } else{
      //   view = this.props.viewMode;
      // }
     let viewModeCSS=this.props.viewMode?'view_switch map_view':'view_switch list_view';

    return(

        <div className={viewModeCSS} onClick={this.onClickViewMode.bind(this)} ></div>


    )
  }

}
MlInfinity.propTypes={
 onViewModeChange: React.PropTypes.func,
  viewMode:React.PropTypes.bool
}


