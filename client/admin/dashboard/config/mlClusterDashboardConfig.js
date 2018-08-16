import {MlViewer,MlViewerTypes} from "../../../../lib/common/mlViewer/mlViewer";
import MlClusterList from '../component/MlClusterList'
import MlMapViewContainer from "../../core/containers/MlMapViewContainer"
import MapDetails from "../../../../client/commons/components/map/mapDetails"
import maphandler from "../actions/findMapDetailsTypeAction"
import React from 'react';
import gql from 'graphql-tag'
import MlMapFooter from '../component/MlMapFooter';
import {getAdminUserContext} from '../../../commons/getAdminUserContext';
import MlMapMarkerComponent from '../component/MlAdminMapMarker'
const mlClusterDashboardListConfig=new MlViewer.View({
  name:"clusterDashBoardList",
  viewType:MlViewerTypes.LIST,
  extraFields:[],
  fields:["displayName"],
  searchFields:["displayName"],
  throttleRefresh:true,
  pagination:true,
  sort:true,
  viewComponent:<MlClusterList />,
  graphQlQuery:gql`
              query ContextSpecSearch($context:ContextParams,$offset: Int, $limit: Int,$searchSpec:SearchSpec, $fieldsData:[GenericFilter]){
                    data:ContextSpecSearch(module:"cluster",context:$context,offset:$offset,limit:$limit,searchSpec:$searchSpec, fieldsData:$fieldsData){
                    totalRecords
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

const mlClusterDashboardMapConfig=new MlViewer.View({
  name:"clusterDashBoardMap",
  module:"cluster",
  viewType:MlViewerTypes.MAP,
  extraFields:[],
  fields:["userName","mobileNumber","eMail","city","regType"],
  searchFields:["userName","mobileNumber","eMail","city","regType"],
  throttleRefresh:true,
  pagination:false,
  fetchCenter:true,
  showImage:true,//added for cluster image in map
  fetchCenterHandler:async function(reqParams){
    let mapDetailsQuery = {moduleName: reqParams.module,id: reqParams&&reqParams.params&&reqParams.params.clusterId?reqParams.params.clusterId:null};
    let center=await maphandler.fetchDefaultCenterOfUser(mapDetailsQuery);
    return center;
  },
  fetchZoom:true,
  fetchZoomHandler:async function(reqParams){
    var zoom=1;
    let loggedInUser = getAdminUserContext();
    if(loggedInUser.hierarchyLevel == 4){
      zoom = 0;
    }else if(loggedInUser.hierarchyLevel == 3 || loggedInUser.hierarchyLevel == 2){
      zoom = 4;
    }else{
      zoom = 10;
    }
    return zoom;
  },
  viewComponent:<MlMapViewContainer />,
  mapMarkerComponent:<MlMapMarkerComponent/>,
  mapFooterComponent:<MlMapFooter />,
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
          FlowRouter.go('/admin/dashboard/'+data.markerId+'/chapters?viewMode=true');
        if(data.module == 'chapter')
        {
          if(data&&data.params)
          {
            if(data.params.clusterId)
              FlowRouter.go('/admin/dashboard/'+data.params.clusterId+'/'+data.markerId+'/subChapters?viewMode=true');
          }
          else
          {
            let loggedInUser = getAdminUserContext();
            FlowRouter.go('/admin/dashboard/'+loggedInUser.clusterId+'/'+data.markerId+'/subChapters?viewMode=true');
          }
        }

        if(data.module == 'subChapter')
          FlowRouter.go('/admin/dashboard/'+data.params.clusterId+'/'+data.params.chapterId+'/'+data.markerId+'/communities?viewMode=true');
      }
    }
  ],
  // async function (data) {
  //   console.log(data);
    // let mapMarkerData=await findMapDetailsTypeActionHandler(data);
    // return mapMarkerData;
  // },
  graphQlQuery:gql`
              query ContextSpecSearch($context:ContextParams,$searchSpec:SearchSpec){
                    data:ContextSpecSearch(module:"cluster",context:$context,searchSpec:$searchSpec){
                    totalRecords
                    data{
                     ...on Cluster{
                             _id
                             desc:about
                             text:countryFlag                             
                             lat:latitude
                             lng:longitude
                             isActive:isActive
                             showOnMap:showOnMap
                             status:status {
                               code
                               description
                             }
                             flag:countryFlag
                          }
                      }
              }
              }
              `
});

export {mlClusterDashboardListConfig,mlClusterDashboardMapConfig};
