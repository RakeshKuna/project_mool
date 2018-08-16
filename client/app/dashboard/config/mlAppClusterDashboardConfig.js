import {MlAppViewer} from "../../../commons/core/MlAppViewer";
import MlAppClusterList from '../components/MlAppClusterList'
import MlAppClusterMapView from '../components/MlAppClusterMapView'
import maphandler from "../actions/fetchDashboardDetails"
import MapDetails from "../../../../client/commons/components/map/mapDetails"
import React from 'react';
import gql from 'graphql-tag'
import {getAdminUserContext} from '../../../commons/getAdminUserContext';
import MlAppClusterMapMarker from '../components/MlAppClusterMapMarker'
import MlAppMapViewContainer from '../../core/containers/MlAppMapViewContainer'


const mlAppClusterDashboardListConfig=new MlAppViewer({
  name:"clusterDashBoardList",
  moduleName:"cluster",
  module:"cluster",
  extraFields:[],
  fields:["displayName"],
  searchFields:["displayName"],
  throttleRefresh:true,
  perPageLimit: 20,
  sort:true,
  viewComponent:<MlAppClusterList />,
  queryOptions:true,
  buildQueryOptions:(config)=>{
    let queryObj = {
      bounds:config.params&&config.params.bounds?config.params.bounds:null,
      viewMode:config.params&&config.params.viewMode?config.params.viewMode:null,
      isListView:true,
    };
    let queryString = JSON.stringify(queryObj);
    return {
      queryProperty:{query:queryString}
    }
  },
  graphQlQuery:gql`
              query ($module: String!, $queryProperty: appGenericSearchQueryProperty) {
                data:AppGenericSearch(module: $module, queryProperty: $queryProperty) {
                  count
                  data{
                   ...on Cluster{
                              countryId
                              displayName
                              about
                              link
                              id:_id
                              email
                              showOnMap
                              countryFlag
                          
                      }
                   }                                                                                                     
                }
              }
              
              `
});

const mlAppClusterDashboardMapConfig=new MlAppViewer({
  name:"clusterDashBoardMap",
  module:"cluster",
  moduleName:"cluster",
  sort:false,
  extraFields:[],
  throttleRefresh:true,
  fetchCenter:true,
  showImage:true,//added for cluster image in map

  fetchCenterHandler:async function(reqParams){
    let mapDetailsQuery = {moduleName: reqParams.module,id: reqParams&&reqParams.params&&reqParams.params.clusterId?reqParams.params.clusterId:null};
    let center=await maphandler.fetchDefaultCenterOfUser(mapDetailsQuery);
    return center;
  },
  fetchZoom:true,
  fetchZoomHandler:async function(reqParams){
    var zoom=4;
    return zoom;
  },
  queryOptions:true,
  buildQueryOptions:(config)=>{
    let queryObj = {
      bounds:config.params&&config.params.bounds?config.params.bounds:null,
    };
    let queryString = JSON.stringify(queryObj);
    return {
      queryProperty:{query:queryString}
    }
  },
  viewComponent:<MlAppMapViewContainer/>,
  mapMarkerComponent:<MlAppClusterMapMarker/>,
  disableHover:true,
  // mapFooterComponent:<MlMapFooter />,
  actionConfiguration:[
    {
      actionName: 'onMouseEnter',
      hoverComponent: <MapDetails />,
      handler:  function (reqParams,mapHoverHandlerCallback) {
        let mapDetailsQuery = {moduleName: reqParams.module,id: reqParams.markerId};
        const mapDataPromise =  maphandler.findMapDetailsTypeActionHandler(mapDetailsQuery);
        mapDataPromise.then(data =>{
             //console.log(data);
              if(mapHoverHandlerCallback){
                     mapHoverHandlerCallback(data);
              };
        });
        return null;
      }
    },
    {
      actionName: 'onMouseLeave',
      // hoverComponent:<MapDetails />,
      handler:  (data)=>{
        if(data&&data.id){
          // console.log('on leave called')
        }
      }
    },
    {
      actionName: 'onMarkerClick',
      // hoverComponent:<MapDetails />,
      handler:  (data)=>{
        if(data.module == 'cluster')
          FlowRouter.go('/app/dashboard/'+data.markerId+'/chapters?viewMode=true');
        if(data.module == 'chapter')
        {
          if(data&&data.params)
          {
            if(data.params.clusterId)
              FlowRouter.go('/app/dashboard/'+data.params.clusterId+'/'+data.markerId+'/subChapters?viewMode=true');
          }
          else
          {
            let loggedInUser = getAdminUserContext();
            FlowRouter.go('/app/dashboard/'+loggedInUser.clusterId+'/'+data.markerId+'/subChapters?viewMode=true');
          }
        }

        if(data.module == 'subChapter')
          FlowRouter.go('/app/dashboard/'+data.params.clusterId+'/'+data.params.chapterId+'/'+data.markerId+'/communities?viewMode=true');
      }
    }
  ],
  // async function (data) {
  //   console.log(data);
    // let mapMarkerData=await findMapDetailsTypeActionHandler(data);
    // return mapMarkerData;
  // },
  graphQlQuery:gql`
               query ($module: String!, $queryProperty: appGenericSearchQueryProperty) {
                data:AppGenericSearch(module: $module, queryProperty: $queryProperty) {
                  count
                  data{
                   ...on Cluster{
                             _id
                             desc:about
                             text:countryFlag                             
                             lat:latitude
                             lng:longitude
                             isActive:isActive
                             showOnMap:showOnMap
                             flag:countryFlag
                             status:status {
                               code
                               description
                             }
                          }
                   }                                                                                                     
                }
              }
              `
});

export {mlAppClusterDashboardListConfig,mlAppClusterDashboardMapConfig};
