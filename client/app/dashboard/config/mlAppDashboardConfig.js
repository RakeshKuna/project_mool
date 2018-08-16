// import {MlViewer,MlViewerTypes} from "../../../../lib/common/mlViewer/mlViewer";
// import MapDetails from "../../../../client/commons/components/map/mapDetails"
import React from 'react';
import gql from 'graphql-tag';
// import MlMapFooter from '../../../admin/dashboard/component/MlMapFooter';
import maphandler from '../actions/fetchDashboardDetails';
import { MlAppViewer } from '../../../commons/core/MlAppViewer';
import MlDashboardMapView from '../components/MlAppDashboardMapView';
import MlAppDashboardListView from '../components/MlAppDashboardListView';
import MlAppMapMarker from '../components/MlAppMapMarker';
import MlMapFooter from '../components/MlMapFooter';
// import {getExternalUserContext} from '../../../commons/getExternalUserContext';

export const mlDashboardMapConfig=new MlAppViewer({
  name:"Dashboard Map",
  moduleName:"externalUsers",
  module:"externalUsers",
  // viewType:MlViewerTypes.MAP,
  extraFields:[],
  throttleRefresh:true,
  pagination:false,
  sort:false,
  fetchCenter:true,
  queryOptions:true,
  buildQueryOptions:(config)=>{
      let queryObj = {
        clusterId:config.params&&config.params.clusterId?config.params.clusterId:null,
        chapterId:config.params&&config.params.chapterId?config.params.chapterId:null,
        subChapterId:config.params&&config.params.subChapterId?config.params.subChapterId:null,
        userType:config.params&&config.params.userType?config.params.userType:"All"
      };

      let queryString = JSON.stringify(queryObj);
      return {
        queryProperty:{query:queryString}
      }
  },
  fetchCenterHandler:async function(reqParams){
    let mapDetailsQuery = {moduleName: reqParams.module,id: reqParams&&reqParams.params&&reqParams.params.chapterId?reqParams.params.chapterId:null};
    let center=await maphandler.fetchDefaultCenterOfUser(mapDetailsQuery);
    return center;
  },
  fetchZoom:true,
  fetchZoomHandler:async function(reqParams){
    var zoom=10;
    return zoom;
  },
  viewComponent:<MlDashboardMapView params={this.params}/>,
    mapMarkerComponent:<MlAppMapMarker/>,
  mapFooterComponent:<MlMapFooter />,

  actionConfiguration:[
  //   {
  //     actionName: 'onMouseEnter',
  //     hoverComponent: <MapDetails />,
  //     handler:  function (config,mapHoverHandlerCallback) {
  //       let mapDetailsQuery = {moduleName: config.module,id: config.markerId};
  //       const mapDataPromise =  maphandler.findMapDetailsTypeActionHandler(mapDetailsQuery);
  //       mapDataPromise.then(data =>{
  //         //console.log(data);
  //         if(mapHoverHandlerCallback){
  //           mapHoverHandlerCallback(data);
  //         };
  //       });
  //       return null;
  //     }
  //   },
  //   {
  //     actionName: 'onMouseLeave',
  //     // hoverComponent:<MapDetails />,
  //     handler:  (data)=>{
  //       if(data&&data.id){
  //         console.log('on leave called')
  //       }
  //     }
  //   },
    {
      actionName: 'onMarkerClick',
      // hoverComponent:<MapDetails />,
      handler:  (data)=>{
        if(data.module == "externalUsers")
          FlowRouter.go('/app/dashboard/'+data.params.clusterId+'/'+data.params.chapterId+'/'+data.params.subChapterId+'/'+data.desc+'/'+data.isActive);
      }
    }
  ],
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

export const mlDashboardListConfig=new MlAppViewer({
  name:"Dashboard List",
  moduleName:"externalUsers",
  module:"externalUsers",
  // viewType:MlViewerTypes.LIST,
  extraFields:[],
  fields:["username",'profile.firstName'],
  searchFields:["username", 'profile.firstName'],
  throttleRefresh:true,
  perPageLimit: 20,
  // pagination:false,
  // sort:true,
  queryOptions:true,
  buildQueryOptions:(config)=>{
      let queryObj = {
        clusterId:config.params&&config.params.clusterId?config.params.clusterId:null,
        chapterId:config.params&&config.params.chapterId?config.params.chapterId:null,
        subChapterId:config.params&&config.params.subChapterId?config.params.subChapterId:null,
        userType:config.params&&config.params.userType?config.params.userType:"All"
      };

      let queryString = JSON.stringify(queryObj);
      return {
        queryProperty:{query:queryString}
      }
  },
  viewComponent: <MlAppDashboardListView params={this.params} />,
  graphQlQuery: gql`
      query ($module: String!, $queryProperty: appGenericSearchQueryProperty) {
                data:AppGenericSearch(module: $module, queryProperty: $queryProperty) {
                  count
                  data{
                   ...on Users{
                          _id,
                          name
                          communityCode
                          communityDefName
                          chapterName
                          profile{
                            isActive,
                            profileImage
                          }
                          portfolioId
                          isActive
                          accountType
                      }
                   }                                                                                                     
                }
              }`,
});
