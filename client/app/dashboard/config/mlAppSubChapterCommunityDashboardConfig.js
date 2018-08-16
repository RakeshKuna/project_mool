import {MlAppViewer} from "../../../commons/core/MlAppViewer";
import maphandler from "../actions/fetchDashboardDetails"
import React from 'react';
import gql from 'graphql-tag'
import MlDashboardListView from '../components/MlAppDashboardListView'
import MlAppMapMarker from '../components/MlAppMapMarker';
import MlAppMapViewContainer from '../../core/containers/MlAppMapViewContainer';
import MlMapFooter from '../components/MlMapFooter';

export const mlAppSubChapterCommunityDashboardMapConfig=new MlAppViewer({
  name:"SubChapterCommunityDashboard",
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

    var userType = localStorage.getItem('userType');

    // localStorage.removeItem('userType');
    let queryObj = {
      clusterId:config.params&&config.params.clusterId?config.params.clusterId:null,
      chapterId:config.params&&config.params.chapterId?config.params.chapterId:null,
      userType: userType || "All"
    };

    let queryString = JSON.stringify(queryObj);
    return {
      queryProperty:{query:queryString}
    }
  },
  fetchCenterHandler:async function(reqParams){
    let mapDetailsQuery = {moduleName: 'subChapterUser',id: reqParams&&reqParams.params&&reqParams.params.chapterId?reqParams.params.chapterId:null};
    let center=await maphandler.fetchDefaultCenterOfUser(mapDetailsQuery);
    return center;
  },
  fetchZoom:true,
  fetchZoomHandler:async function(reqParams){
    var zoom=10;
    return zoom;
  },
  viewComponent:<MlAppMapViewContainer params={this.params}/>,
  mapMarkerComponent:<MlAppMapMarker />,
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

