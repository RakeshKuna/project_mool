import {MlViewer,MlViewerTypes} from "../../../../lib/common/mlViewer/mlViewer";
import MlClusterChapterList from "../components/MlClusterChapterList"
import React from 'react';
import gql from 'graphql-tag'

const mlClusterChapterListConfig=new MlViewer.View({
  name:"clusterChapterList",
  module:"chapter",
  viewType:MlViewerTypes.LIST,
  extraFields:[],
  throttleRefresh:true,
  fields:["displayName"],
  searchFields:["displayName"],
  pagination:true,
  sort:true,
  queryOptions:true,
  buildQueryOptions:(config)=>{
    return {context:{clusterId:config.params&&config.params.clusterId?config.params.clusterId:null}}
  },
  viewComponent:<MlClusterChapterList />,
  graphQlQuery:gql`
              query ContextSpecSearch($context:ContextParams,$offset: Int, $limit: Int,$searchSpec:SearchSpec, $fieldsData:[GenericFilter]){
              data:ContextSpecSearch(module:"chapter",context:$context,offset:$offset,limit:$limit,searchSpec:$searchSpec, fieldsData:$fieldsData){
                    totalRecords
                    data{
                     ...on Chapter{
                              _id
                              clusterId
                              chapterCode
                              chapterName
                              displayName
                              chapterImage
                              stateName
                              stateId
                              cityId
                              cityName
                              latitude
                              longitude
                              showOnMap
                              isActive
                              status{
                                code
                                description
                              }
                          }
                      }
              }
              }
              `
});


export {mlClusterChapterListConfig};
