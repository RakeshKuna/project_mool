import React from 'react';
import compose from 'recompose/compose';
import lifecycle from 'recompose/lifecycle';
import defaultProps from 'recompose/defaultProps';
import withState from 'recompose/withState';
import withHandlers from 'recompose/withHandlers';
import withPropsOnChange from 'recompose/withPropsOnChange';
import GoogleMap from 'google-map-react';
import ClusterMarker from './ClusterMarker';
import CommunityMarkers from './CommunitymapMarkers'
import supercluster from 'points-cluster';
// import MyLocationMarker from './myLocationMarker';


export const gMap = ({
  style, hoverDistance, options,
  mapProps: {center, zoom,bounds },clusterRadius,onChildClick,
  onChange, onChildMouseEnter, onChildMouseLeave,
  clusters,mapContext,module,showImage
}) => {
  return (
    <GoogleMap
      options={options}
      bootstrapURLKeys={{key: Meteor.settings.public.googleApiKey}}
      hoverDistance={hoverDistance}
      center={center}
      zoom={zoom}
      onChange={onChange}
      onChildClick={(evt, loc)=>onChildClick(evt, loc,zoom,center)}
      onChildMouseEnter={onChildMouseEnter}
      onChildMouseLeave={onChildMouseLeave}
    >
      {/*<MyLocationMarker key={9999999} lat={34.0} lng={77.0}/>*/}
      {
        clusters
          .map(({...markerProps, id, numPoints}) => (
             <CommunityMarkers  key={id} lat={markerProps.lat} {...mapContext} module={module} hover={mapContext.hoverKey === markerProps.id}
                             lng={markerProps.lng} text={markerProps.desc} communityCode={markerProps.communityCode}
                             desc={markerProps.desc}  markerId={markerProps.recordId} isActive ={markerProps.isActive} status ={markerProps.status} showImage={showImage}/>

          ))
      }
    </GoogleMap>
  );
}



let compareQueryOptions=function(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
};

const markerDataConfig = lifecycle({
  componentDidMount() {
    this.setState({markers:this.props.data||[],mapProps:{center:this.props.center,zoom:this.props.zoom}});
  },
  componentWillUpdate(nextProps) {
    console.log(nextProps);
    if(!compareQueryOptions(this.props.data,nextProps.data)){
      this.setState({markers:nextProps.data,mapProps:{center:nextProps.center,zoom:nextProps.zoom}});
    }
  }
});


const mapClusterHOC =compose(
    markerDataConfig,
    defaultProps({
      clusterRadius: 60,
      hoverDistance: 30,
      minZoom: 3,
      maxZoom: 15,
      options: {
        styles:[
          {
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#f5f5f5"
              }
            ]
          },
          {
            "elementType": "labels.icon",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          },
          {
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#616161"
              }
            ]
          },
          {
            "elementType": "labels.text.stroke",
            "stylers": [
              {
                "color": "#f5f5f5"
              }
            ]
          },
          {
            "featureType": "administrative.land_parcel",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#bdbdbd"
              }
            ]
          },
          {
            "featureType": "poi",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#eeeeee"
              }
            ]
          },
          {
            "featureType": "poi",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#757575"
              }
            ]
          },
          {
            "featureType": "poi.park",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#e5e5e5"
              }
            ]
          },
          {
            "featureType": "poi.park",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#9e9e9e"
              }
            ]
          },
          {
            "featureType": "road",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#ffffff"
              }
            ]
          },
          {
            "featureType": "road.arterial",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#757575"
              }
            ]
          },
          {
            "featureType": "road.highway",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#dadada"
              }
            ]
          },
          {
            "featureType": "road.highway",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#616161"
              }
            ]
          },
          {
            "featureType": "road.local",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#9e9e9e"
              }
            ]
          },
          {
            "featureType": "transit.line",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#e5e5e5"
              }
            ]
          },
          {
            "featureType": "transit.station",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#eeeeee"
              }
            ]
          },
          {
            "featureType": "water",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#a3ccff"
              }
            ]
          },
          {
            "featureType": "water",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#5387c8"
              }
            ]
          }
        ]
      }
    }),
    // withState so you could change markers if you want
   /* withState(
      'markers',
      'setMarkers',
      markersData
    ),*/
    withState(
      'hoveredMarkerId',
      'setHoveredMarkerId',
      -1
    ),
    withState(
      'mapProps',
      'setMapProps',
     /* {
        center: {lat: 17.1144718, lng: 5.7694891},
        zoom: 1,
      }*/
      (configurations)=>{
        return {center:configurations.center,zoom:configurations.zoom};
      }
    ),
    // describe events
    withHandlers({
      onChange: ({setMapProps}) => ({center, zoom, bounds}) => {
        setMapProps({ center, zoom, bounds });
      },
      onChildMouseEnter: ({setHoveredMarkerId}) => (hoverKey, {id}) => {
        setHoveredMarkerId(id);
      },
      onChildClick: ({setMapProps}) => (evt, loc, zoom, centerPoint) => {
        let center = {
          lat: loc.lat, lng: loc.lng
        };
        let myzoom={zoom:(zoom|| 0)+1};
        if( parseFloat(center.lat).toFixed(4) != parseFloat(centerPoint.lat).toFixed(4) || parseFloat(center.lng).toFixed(4) != parseFloat(centerPoint.lng).toFixed(4)){
          setMapProps({center,zoom}, function () {
            setMapProps(myzoom);
          });
        } else {
          setMapProps(myzoom);
        }
      },
        //console.log(map, location, this);
      onChildMouseLeave: ({setHoveredMarkerId}) => (/* hoverKey, childProps */) => {
        setHoveredMarkerId(-1);
      },
    }),
    // precalculate clusters if markers data has changed
    withPropsOnChange(
      ['markers'],
      ({markers = [], clusterRadius, options: {minZoom=1, maxZoom=15}}) => ({
        getCluster: supercluster(
          markers,
          {
            minZoom, // min zoom to generate clusters on
            maxZoom, // max zoom level to cluster the points on
            radius: clusterRadius, // cluster radius in pixels
          }
        ),
      })
    ),
    // get clusters specific for current bounds and zoom
    withPropsOnChange(
      ['mapProps', 'getCluster'],
      ({mapProps, getCluster}) => ({
        clusters: mapProps.bounds
          ? getCluster(mapProps)
          .map(({wx, wy, numPoints, points}) => ({
            lat: parseFloat(wy),
            lng: parseFloat(wx),
            text: numPoints,
            numPoints,
            id: `${numPoints}_${points[0]._id}`,
            recordId: points[0]._id,
            isActive: points[0].isActive,
            status: points[0].status,
            desc:points[0].text,

          }))
          : [],
      })
    ),
    // set hovered
    withPropsOnChange(
      ['clusters', 'hoveredMarkerId'],
      ({clusters, hoveredMarkerId}) => ({
        clusters: clusters
          .map(({...cluster, id}) => ({
            ...cluster,
            hovered: id === hoveredMarkerId,
          })),
      })
    ),
  );




export default mapClusterHOC(gMap);
