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
import  NoMarkerDataMessage  from '../../../commons/components/map/NoMarkerDataMessage';
import MapCommunityFilter from '../../../commons/components/map/MapCommunityFilter';

let defaultCenter={lat: 17.1144718, lng: 5.7694891};
@controllable(['center', 'zoom', 'hoverKey', 'clickKey'])
export default class MlDashboardMapView extends Component {

  constructor(props){
    super(props);
    this.state={
      userType : "All",
      configState:{}
    }
  }
  async componentWillMount() {
    let that = this;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position)=>{
        let lat = position.coords.latitude;
        let lng = position.coords.longitude;
        that.setState({lat,lng});
      });
    }

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
  // componentDidMount() {
  //
  // }
  // componentDidUpdate(){
  //   /*let loggedInUser = getAdminUserContext();
  //    if(loggedInUser.hierarchyLevel == 0){
  //    $('.community_icons a').removeClass('active_community');
  //    $('.'+communityCode).addClass('active_community');
  //    }*/
  //
  //   let loggedInUser = getAdminUserContext();
  //   if(loggedInUser.hierarchyLevel != 0) {
  //     $(".community_icons a").click(function () {
  //       $('.community_icons a').removeClass('active_community');
  //       $(this).addClass('active_community');
  //       var value = $(this).attr('data-filter');
  //       if (value == "all") {
  //         $('.filter-block').show('1000');
  //       }
  //       else {
  //         $(".filter-block").not('.' + value).hide('3000');
  //         $('.filter-block').filter('.' + value).show('3000');
  //       }
  //     });
  //   }
  //   if(loggedInUser.hierarchyLevel == 0){
  //     $('.community_icons a').removeClass('active_community');
  //     $('.'+communityCode).addClass('active_community');
  //   }
  //   if(this.props.config.params.userType != "All"){
  //     $('.community_icons a').removeClass('active_community');
  //     $('.'+(this.props.config.params.userType).replace(/ /g,'')).addClass('active_community');
  //   }
  // }

  componentDidUpdate(){
    if(this.props.config && this.props.config.params && this.props.config.params.userType && this.props.config.params.userType !==this.state.userType){
      // this.setCommunityName(this.props.config.params.userType);
      this.setState({userType : this.props.config.params.userType});
    }
  }

  onStatusChange(userType,e) {
    // const data = this.state.data;
    if (userType) {
      this.setState({userType: userType});
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

  render() {
    const hasCenter=this.state&&this.state.center?this.state.center:null;
    if(!hasCenter){
      return <MlLoader />;
    }
    const data=this.props.data?this.props.data:[];

    let userType  =  this.state.userType || '';

    return (
      <span>
        {this.props.data&& this.props.data.length === 0 && this.state.userType && <NoMarkerDataMessage userType={userType}/>}
        <MapCommunityFilter fixed_icon={false} onStatusChange={this.onStatusChange.bind(this)} userType={this.state.userType}/>
        {/*<MapCommunity data={data} zoom={this.state.zoom} center={this.state.center} mapContext={this.props} module={this.props.module} />*/}
        <MapCluster lat={this.state.lat} lng={this.state.lng} data={data} zoom={this.state.zoom} userType={userType.replace(/\s+/, "")+'HexaMarker'} center={this.state.center} mapContext={this.props.config} module={this.props.config.module} showImage={this.props.config.showImage} getBounds={this.getBounds.bind(this)}/>
      </span>
    );
  }

}
MlDashboardMapView.propTypes = {
  center: PropTypes.array,
  zoom: PropTypes.number,
  // greatPlaceCoords: PropTypes.any
};
MlDashboardMapView.shouldComponentUpdate = shouldPureComponentUpdate;

MlDashboardMapView._onBoundsChange = (center, zoom) => {
  this.props.onCenterChange(center);
  this.props.onZoomChange(zoom);
}

MlDashboardMapView._onChildClick = (key, childProps) => {
  this.props.onCenterChange([childProps.latitude, childProps.longitude]);
}

MlDashboardMapView._onChildMouseEnter = (key) => {
  this.props.onHoverKeyChange(key);
}

MlDashboardMapView._onChildMouseLeave = () => {
  this.props.onHoverKeyChange(null);
}



