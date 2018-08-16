import React, { Component, PropTypes } from 'react';
import MlInfinityView from '../infinityView/MlInfinityView'
//import MoolyaListView from '../list/ListView'
//import MlMapViewContainer from "../../../admin/core/containers/MlMapViewContainer"

export default class MoolyaAdminView extends Component {
  constructor(props){
    super(props);
    this.state={
      viewMode:this.props.viewMode!==undefined?this.props.viewMode:true,
    }
  }

  viewModeChange(mode){
    this.setState({'viewMode':mode});
  }

  render()
    {
      let showInfinity = true;
      // let viewMode = this.props.viewMode;
      let config=this.props;
      let infinityViewProps = {viewMode: this.state.viewMode, onViewModeChange:this.props.onViewModeChange};
      let listViewProps={clusterListOptions:this.props.clusterListOptions,listRouterPath:this.props.listRouterPath,imageLink:this.props.imageLink,nameField:this.props.nameField,statusField:this.props.statusField}
      let footerProps={footerOptions:this.props.footerOptions,routerPath:this.props.routerPath,imagePath:this.props.imagePath}
      return (
        <div>
          <div className="admin_main_wrap">
            {/*{viewMode ? <MoolyaMapView/> : <div><MoolyaListView {...listViewProps}/></div> }*/}
            {/*{viewMode ? <MlMapViewContainer {...config.mapConfig} /> : <div><MoolyaListView {...listViewProps}/></div> }*/}
            {showInfinity && (<MlInfinityView {...infinityViewProps} />)}
          </div>
        </div>

      )
    }

}

