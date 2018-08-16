import {MlAppViewer} from "../../../commons/core/MlAppViewer";
import maphandler from "../actions/fetchDashboardDetails"
import React from 'react';
import gql from 'graphql-tag'
import MlAppMapMarker from '../components/MlAppMapMarker';
import MlAppMapViewContainer from '../../core/containers/MlAppMapViewContainer'
import MlMapFooter from '../components/MlMapFooter';

export const mlAppChapterCommunityDashboardMapConfig=new MlAppViewer({
  name:"ChapterCommunityDashboard",
  moduleName:"externalUsersNew",
  module:"externalUsersNew",
  // viewType:MlViewerTypes.MAP,
  extraFields:[],
  throttleRefresh:true,
  pagination:false,
  sort:false,
  fetchCenter:true,
  queryOptions:true,
  buildQueryOptions:(config)=>{
    let userType = localStorage.getItem('userType');
    // localStorage.removeItem('userType');
    let queryObj = {
      clusterId:config.params&&config.params.clusterId?config.params.clusterId:null,
      userType: userType  || "All"
    };

    let queryString = JSON.stringify(queryObj);
    return {
      queryProperty:{query:queryString}
    }
  },
  fetchCenterHandler:async function(reqParams){
    let mapDetailsQuery = {moduleName: 'chapterUser',id: reqParams&&reqParams.params&&reqParams.params.clusterId?reqParams.params.clusterId:null};
    let center=await maphandler.fetchDefaultCenterOfUser(mapDetailsQuery);
    return center;
  },
  fetchZoom:true,
  fetchZoomHandler:async function(reqParams){
    var zoom=4;
    return zoom;
  },
  viewComponent:<MlAppMapViewContainer params={this.params}/>,
  mapMarkerComponent:<MlAppMapMarker/>,
  mapFooterComponent:<MlMapFooter />,

  actionConfiguration:[
    {
      actionName: 'onMarkerClick',
      handler:  (data)=>{
        if(data.module == "externalUsersNew")
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

