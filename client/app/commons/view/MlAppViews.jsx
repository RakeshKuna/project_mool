import React from 'react';
import MlInfinity from "../../../commons/components/infinityView/MlInfinityView";
import MlListViewContainer from "../../core/containers/MlAppListViewContainer";
import MlAppMapViewContainer from "../../core/containers/MlAppMapViewContainer"
import MlInfiniteScroll from '../../../commons/core/mlInfiniteScroll/components/MlInfiniteScroll'

/*
 Created by Rajat Shekhar

 Accepts viewMode,showInfinity as props to display the components
 //listConfig,mapConfig is configuration for the component
 */
export default class MlViews extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      viewMode:this.props.viewMode!==undefined?this.props.viewMode:true,
    }
    this.viewModeChange.bind(this);
    this.getBound = this.getBound.bind(this);
  }

  viewModeChange(mode) {
    this.setState({'viewMode': mode});
  }

  getBound(obj){
    if(obj.bounds){
      if(this.props.listConfig && this.props.listConfig.params) {
        this.props.listConfig.params.bounds = obj.bounds;
        this.props.listConfig.params.viewMode = this.props.viewMode;
      }else{
        let newParams = {params:{bounds:obj.bounds,viewMode:this.props.viewMode}}
        this.props.listConfig = _.omit(this.props.listConfig, 'params')
        this.props.listConfig=_.extend(this.props.listConfig,newParams);
      }

      if(this.props.params){
        this.props.params.bounds = obj.bounds;
        this.props.params.viewMode = this.props.viewMode;
      }else{
        let newParams = {params:{bounds:obj.bounds,viewMode:this.props.viewMode}}
        this.props = _.omit(this.props, 'params')
        this.props=_.extend(this.props,newParams);
      }
    }
  }

  render() {
    // var specificViewMode = _.has(this.props, 'viewMode');
    // var viewMode = null;
    // if (specificViewMode) {
    //   if (this.props.viewMode == true && this.state.viewMode == true) {
    //     viewMode = true;
    //   } else if (this.props.viewMode == true && this.state.viewMode == false) {
    //     viewMode = false;
    //   } else if (this.props.viewMode == false && this.state.viewMode == true) {
    //     viewMode = false;
    //   } else if (this.props.viewMode == false && this.state.viewMode == false) {
    //     viewMode = true;
    //   } 
    // } else {
    //   viewMode = this.state.viewMode;
    // }

    var showInfinity = _.has(this.props, 'showInfinity') ? this.props.showInfinity : true;
    var infinityViewProps = {viewMode: this.state.viewMode, viewModeParams: this.props.viewMode, onViewModeChange: this.viewModeChange.bind(this)};
    var config = this.props;
    var listConfig = config.listConfig;
    listConfig.isApp = true
    if(this.props.listConfig.params && this.props.listConfig.params.bounds){
      if(!this.props.params){
        let newParams = {params:{bounds:this.props.listConfig.params.bounds,viewMode:this.state.viewMode}}
        this.props = _.omit(this.props, 'params')
        this.props=_.extend(this.props,newParams);
      }else if(this.props.params && !this.props.params.bounds){
        this.props.params.bounds = this.props.listConfig.params.bounds
        this.props.params.viewMode = this.state.viewMode
      }
    }

    var params = this.props.params ? this.props.params : null;
    return (
      <div className="app_main_wrap">
        {this.state.viewMode ? <MlAppMapViewContainer params={params} bounds={this.getBound.bind(this)} {...config.mapConfig} /> :
          <MlInfiniteScroll params={params} config={listConfig}/> }
        {showInfinity && (<MlInfinity {...infinityViewProps} />)}
      </div>

    )

  }
}
