/** ************************************************************
 * Date: 17 Julu, 2017
 * Rajat Shekhar Srivastava
 * Dashboard Map View with community filter icon.
 * *************************************************************** */

import React, { Component, PropTypes } from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';
import controllable from 'react-controllables';
// import MapCommunity from '../../../commons/components/map/MapCommunity';
import MapCluster from '../../../commons/components/map/MapCluster';
import MlLoader from '../../../commons/components/loader/loader'
import {getAdminUserContext} from '../../../commons/getAdminUserContext'

let defaultCenter={lat: 17.1144718, lng: 5.7694891};
@controllable(['center', 'zoom', 'hoverKey', 'clickKey'])
export default class MlAppClusterMapView extends Component {

  constructor(props){
    super(props);
    this.state={
      userType : "All",
      configState:{}
    }
  }
  async componentWillMount() {
    let that = this;
    let zoom = 1;
    let hasZoom=that.props.config.fetchZoom||false;
    if(hasZoom){
      zoom= await that.props.config.fetchZoomHandler(that.props)||zoom;
    }
    let hasCenter=that.props.config.fetchCenter||false;
    if(hasCenter){
      let center= await that.props.config.fetchCenterHandler(that.props.config);
      this.setState({center:center||defaultCenter,zoom:zoom});
    }else{
      this.setState({
        center:defaultCenter,
        zoom: zoom,
      });
    }
  }

  componentDidUpdate(){
    /*let loggedInUser = getAdminUserContext();
     if(loggedInUser.hierarchyLevel == 0){
     $('.community_icons a').removeClass('active_community');
     $('.'+communityCode).addClass('active_community');
     }*/

    let loggedInUser = getAdminUserContext();
    if(loggedInUser.hierarchyLevel != 0) {
      $(".community_icons a").click(function () {
        $('.community_icons a').removeClass('active_community');
        $(this).addClass('active_community');
        var value = $(this).attr('data-filter');
        if (value == "all") {
          $('.filter-block').show('1000');
        }
        else {
          $(".filter-block").not('.' + value).hide('3000');
          $('.filter-block').filter('.' + value).show('3000');
        }
      });
    }
    if(loggedInUser.hierarchyLevel == 0){
      $('.community_icons a').removeClass('active_community');
      $('.'+communityCode).addClass('active_community');
    }
  }

  onStatusChange(userType,e) {
    // const data = this.state.data;
    if (userType) {
      //this.setState({userType: userType});
      // console.log(this.props);
      let variables={};
      let hasQueryOptions = this.props.config&&this.props.config.queryOptions ? true : false;
      if (hasQueryOptions) {
        let config = this.props.config
        if(config && config.params){
          let usertype={userType:userType}
          _.extend(config.params,usertype)
        }else{
          let newParams = {params:{userType:userType}}
          data = _.omit(config, 'params')
          config=_.extend(data,newParams);
        }
        let dynamicQueryOption = this.props.config&&this.props.config.buildQueryOptions ? this.props.config.buildQueryOptions(config) : {};
        variables = _.extend(variables,dynamicQueryOption);

      }
      this.props.config.fetchMore(variables);

    }
  }
  getBounds(obj){
    // TODO: Context based List View
  }

  render()
  {
    const hasCenter=this.state&&this.state.center?this.state.center:null;
    if(!hasCenter){
      return <MlLoader />;
    }
    const data=this.props.data?this.props.data:[];
    return (
      <span>
        {/*{communityIconList}*/}
        {/*<MapCommunity data={data} zoom={this.state.zoom} center={this.state.center} mapContext={this.props} module={this.props.module} />*/}
        <MapCluster data={data} zoom={this.state.zoom} center={this.state.center} mapContext={this.props.config} module={this.props.config.module} showImage={this.props.config.showImage} getBounds={this.getBounds.bind(this)}/>
      </span>
    );
  }

}
MlAppClusterMapView.propTypes = {
  center: PropTypes.array,
  zoom: PropTypes.number,
  // greatPlaceCoords: PropTypes.any
};
MlAppClusterMapView.shouldComponentUpdate = shouldPureComponentUpdate;

MlAppClusterMapView._onBoundsChange = (center, zoom) => {
  this.props.onCenterChange(center);
  this.props.onZoomChange(zoom);
}

MlAppClusterMapView._onChildClick = (key, childProps) => {
  this.props.onCenterChange([childProps.latitude, childProps.longitude]);
}

MlAppClusterMapView._onChildMouseEnter = (key) => {
  this.props.onHoverKeyChange(key);
}

MlAppClusterMapView._onChildMouseLeave = () => {
  this.props.onHoverKeyChange(null);
}



