import React from 'react';
import compose from 'recompose/compose';
import lifecycle from 'recompose/lifecycle';
import defaultProps from 'recompose/defaultProps';
import withState from 'recompose/withState';
import withHandlers from 'recompose/withHandlers';
import withPropsOnChange from 'recompose/withPropsOnChange';
import GoogleMap from 'google-map-react';
import ClusterMarker from './ClusterMarker';
import MapMarkers from './mapMarkers'
import supercluster from 'points-cluster';
import { fitBounds } from 'google-map-react/utils';

let MarkerComponent = ({ text, lat, lng }) =>
  (lat&&lng?<a data-toggle="tooltip" title='Your location is approximate' data-placement="bottom"><span className="ml my-ml-pin1"></span></a>
    :
    <div></div>);

export const gMap = ({
  style, hoverDistance, options,
  mapProps: {center, zoom,bounds },clusterRadius,onChildClick,
  onChange, onChildMouseEnter, onChildMouseLeave,
  clusters,mapContext,module,showImage, userType, lat, lng
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
      {
        clusters&&clusters.length>0?clusters
          .map(({...markerProps, id, numPoints}) => (
            numPoints === 1
              ? <MapMarkers  key={id} lat={markerProps.lat} {...mapContext} module={module} hover={mapContext.hoverKey === markerProps.id}
                             lng={markerProps.lng} text={markerProps.desc}
                             desc={markerProps.desc}  markerId={markerProps.recordId} isActive ={markerProps.isActive} status ={markerProps.status} showImage={showImage}/>
              : <ClusterMarker key={id} {...markerProps} userType={userType || ''} />
          )):[]
      }

      {lat!=undefined && lng!=undefined && <MarkerComponent lat={lat} lng={lng}/>}
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
    // console.log(nextProps);
    if(!compareQueryOptions(this.props.data,nextProps.data)){
      this.setState({markers:nextProps.data,mapProps:{center:nextProps.center,zoom:nextProps.zoom}});
    }
  }
});


getZoomFromMarkers= (zoom,mapContext,clickedOn) => {
  try{
    console.log("Deciding zoom based on clicked " + clickedOn);
    let locPoints=[],i=0;

    _.forEach(mapContext.data.data,function (cluster,i) {
      if(cluster.lat && cluster.lng && clickedOn.indexOf(cluster._id)>-1){
        let pointLatLong = {lat:cluster.lat,lng:cluster.lng};
        if(locPoints.length>0){ //Hack to avoid same lat long points
          if(locPoints[0].lat===cluster.lat && locPoints[0].lng === cluster.lng){
            pointLatLong.lat=cluster.lat+(0.0000002*i);
            pointLatLong.lng=cluster.lng+(0.0000001*i);
          }
        }
        locPoints.push(pointLatLong);
      }

    })

    const bounds = getBoundsFromPoints(locPoints);

    const size = {
      width: 1240, // Map width in pixels
      height: 502, // Map height in pixels
    };

    let proposedZoom = fitBounds(bounds, size).zoom;
    return proposedZoom<=zoom?zoom+1:proposedZoom;
  } catch(e){
    return zoom+2
  }


}

var clusterMap;

getBoundsFromPoints= (points) => {
  var boundObj = new google.maps.LatLngBounds();
  for(i=0;i<points.length;i++) {
    boundObj.extend(points[i]);
  }
  let bounds = {
    ne: boundObj.getNorthEast().toJSON(),
    sw: boundObj.getSouthWest().toJSON()
  };

  return bounds;

}


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
      onChange: ({setMapProps, getBounds}) => ({center, zoom, bounds}) => {
        getBounds({ center, zoom, bounds });
        setMapProps({ center, zoom, bounds });
      },
      onChildMouseEnter: ({setHoveredMarkerId}) => (hoverKey, {id}) => {
        setHoveredMarkerId(id);
      },
      onChildClick: ({setMapProps,mapContext}) => (evt, loc, zoom, centerPoint) => {
        let center = {
          lat: loc.lat, lng: loc.lng
        };
        let myzoom={zoom: getZoomFromMarkers(zoom,mapContext,evt)};
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
      ({mapProps, getCluster}) => {
        let mapBounds = [];
        if(mapProps.bounds){
          clusterMap = getCluster(mapProps);
          mapBounds =  clusterMap.map(({wx, wy, numPoints, points}) => {
           let allIds = points.map((point)=>(point._id)).join('_'); // to get zoom on click, this id is used in getZoomFromMarkers
           return {
              lat: parseFloat(wy),
              lng: parseFloat(wx),
              text: numPoints,
              numPoints,
              id: allIds,
              recordId: points[0]._id,
              isActive: points[0].isActive,
              status: points[0].status,
              desc: points[0].text
            }
        })
        }
        return {
          clusters: mapBounds
        }
      }
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
