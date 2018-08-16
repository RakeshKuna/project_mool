import {MlAppViewer} from "../../../commons/core/MlAppViewer";
import MlAppClusterList from '../components/MlAppClusterList'
import MlAppClusterMapView from '../components/MlAppClusterMapView'
import maphandler from "../actions/fetchDashboardDetails"
import MapDetails from "../../../../client/commons/components/map/mapDetails"
import React from 'react';
import gql from 'graphql-tag'
import {getAdminUserContext} from '../../../commons/getAdminUserContext';
import MlAppClusterMapMarker from '../components/MlAppClusterMapMarker'
import MlAppMapViewContainer from '../../core/containers/MlAppMapViewContainer';
import MlAppMapMarker from '../components/MlAppMapMarker';
import MlMapFooter from '../components/MlMapFooter';


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

const mlAppClusterCommunityDashboardMapConfig=new MlAppViewer({
  name:"clusterCommunityDashBoardMap",
  module:"externalUsersNew",
  moduleName:"externalUsersNew",
  sort:false,
  extraFields:[],
  throttleRefresh:true,
  fetchCenter:true,
  showImage:true,//added for cluster image in map

  fetchCenterHandler:async function(reqParams){
    let mapDetailsQuery = {moduleName: 'clusterUser',id: reqParams&&reqParams.params&&reqParams.params.clusterId?reqParams.params.clusterId:null};
    let center=await maphandler.fetchDefaultCenterOfUser(mapDetailsQuery);
    return center;
  },
  fetchZoom:true,
  fetchZoomHandler:async function(reqParams){
    var zoom=1;
    return zoom;
  },
  queryOptions:true,
  buildQueryOptions:(config)=>{
    let userType = localStorage.getItem('userType');
    // localStorage.removeItem('userType');
    let queryObj = {
      userType: userType  || "All"
    };
    let queryString = JSON.stringify(queryObj);
    return {
      queryProperty:{query:queryString}
    }
  },
  viewComponent:<MlAppMapViewContainer/>,
  mapMarkerComponent:<MlAppMapMarker/>,
  mapFooterComponent:<MlMapFooter />,
  disableHover:true,
  // mapFooterComponent:<MlMapFooter />,
  actionConfiguration:[
    {
      actionName: 'onMarkerClick',
      handler:  (data)=>{
        if(data.module == "externalUsersNew")
          FlowRouter.go('/app/dashboard/'+data.params.clusterId+'/'+data.params.chapterId+'/'+data.params.subChapterId+'/'+data.desc+'/'+data.isActive);
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
                   ...on Users{
                          _id,
                          lat:latitude
                          lng:longitude
                          text:communityCode
                          isActive:portfolioId
                          name:name
                          status:profile{profileImage, firstName, lastName}
                      }
                   }                                                                                                     
                }
              }`
});

export {mlAppClusterDashboardListConfig,mlAppClusterCommunityDashboardMapConfig};
