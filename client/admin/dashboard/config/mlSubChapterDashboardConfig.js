import {MlViewer,MlViewerTypes} from "../../../../lib/common/mlViewer/mlViewer";
import MlSubChapterList from "../../dashboard/component/MlSubChapterList"
import MlMapViewContainer from "../../core/containers/MlMapViewContainer"
import MapDetails from "../../../../client/commons/components/map/mapDetails"
import maphandler from "../actions/findMapDetailsTypeAction"
import React from 'react';
import gql from 'graphql-tag'
import MlMapFooter from '../component/MlMapFooter';
import {getAdminUserContext} from '../../../commons/getAdminUserContext';
import MlMapMarkerComponent from '../component/MlAdminMapMarker'
const mlSubChapterDashboardMapConfig=new MlViewer.View({
  name:"subChapterDashBoardMap",
  viewType:MlViewerTypes.MAP,
  extraFields:[],
  module:"subChapter",
  throttleRefresh:true,
  pagination:false,
  sort:false,
  fetchCenter:true,
  fetchCenterHandler:async function(reqParams){
    let mapDetailsQuery = {moduleName: reqParams.module,id:reqParams&&reqParams.params&&reqParams.params.chapterId?reqParams.params.chapterId:null};
    let center=await maphandler.fetchDefaultCenterOfUser(mapDetailsQuery);
    return center;
  },
  fetchZoom:true,
  fetchZoomHandler:async function(reqParams){
    var zoom=1;
    let loggedInUser = getAdminUserContext();
    let path = FlowRouter.current().path
    if (path.indexOf("/subChapters") > 0) {
      return 10
    }
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
  queryOptions:true,
  buildQueryOptions:(config)=>{
    return {context:{clusterId:config.params&&config.params.clusterId?config.params.clusterId:null,chapterId:config.params&&config.params.chapterId?config.params.chapterId:null}}
  },
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
          console.log('on leave called')
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
          // FlowRouter.go('/admin/dashboard/'+data.params.clusterId+'/'+data.params.chapterId+'/'+data.markerId+'/communities?viewMode=true');
        FlowRouter.go('/admin/dashboard/'+data.params.clusterId+'/'+data.params.chapterId+'/'+data.markerId+'/anchorInfoView?viewMode=true');
      }
    }
  ],
  graphQlQuery:gql`
              query ContextSpecSearch($context:ContextParams,$searchSpec:SearchSpec){
              data:ContextSpecSearch(module:"subChapter",context:$context,searchSpec:$searchSpec){
                    totalRecords
                    data{
                     ...on SubChapter{
                                   _id
                                   desc:aboutSubChapter
                                   text:subChapterName
                                   lat:latitude
                                   lng:longitude
                                   isActive:isActive
                                   showOnMap:showOnMap
                                   status:showOnMap
                          }
                      }
              }
              }
              `
});

const mlSubChapterDashboardListConfig=new MlViewer.View({
  name:"subChapterList",
  viewType:MlViewerTypes.LIST,
  extraFields:[],
  module:"subChapter",
  throttleRefresh:true,
  fields:["subChapterDisplayName"],
  searchFields:["subChapterDisplayName"],
  pagination:true,
  sort:true,
  viewComponent:<MlSubChapterList />,
  queryOptions:true,
  buildQueryOptions:(config)=>{
    return {context:{clusterId:config.params&&config.params.clusterId?config.params.clusterId:null,chapterId:config.params&&config.params.chapterId?config.params.chapterId:null}}
  },
  graphQlQuery:gql`query ContextSpecSearch($context:ContextParams,$offset: Int, $limit: Int,$searchSpec:SearchSpec,$fieldsData:[GenericFilter]){
              data:ContextSpecSearch(module:"subChapter",context:$context,offset:$offset,limit:$limit,searchSpec:$searchSpec, fieldsData:$fieldsData){
                    totalRecords
                    data{
                     ...on SubChapter{
                               _id
                                   chapterId
                                   clusterId
                                   clusterName
                                   chapterName
                                   subChapterName
                                   subChapterCode
                                   subChapterDisplayName
                                   aboutSubChapter
                                   subChapterImageLink
                                   subChapterEmail
                                   isEmailNotified
                                   showOnMap
                                   isActive
                                   subChapterDisplayName
                                   isDefaultSubChapter
                          }
                      }
              }
              }
   `
});

export { mlSubChapterDashboardListConfig,mlSubChapterDashboardMapConfig};
