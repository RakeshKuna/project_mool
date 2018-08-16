import {MlViewer,MlViewerTypes} from "../../../../lib/common/mlViewer/mlViewer";
import MlSubChapterList from "../../chapter/components/MlSubChapterList"
import MlMapViewContainer from "../../core/containers/MlMapViewContainer"
import React from 'react';
import gql from 'graphql-tag'

const mlSubChapterMapConfig=new MlViewer.View({
  name:"subChapterDashBoardMap",
  viewType:MlViewerTypes.MAP,
  extraFields:[],
  module:"subChapter",
  throttleRefresh:true,
  pagination:false,
  sort:false,
  viewComponent:<MlMapViewContainer />,
  queryOptions:true,
  buildQueryOptions:(config)=>{
    return {context:{clusterId:config.params&&config.params.clusterId?config.params.clusterId:null,chapterId:config.params&&config.params.chapterId?config.params.chapterId:null}}
  },
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
                          }
                      }
              }
              }
              `
});

const mlSubChapterListConfig=new MlViewer.View({
  name:"subChapterList",
  viewType:MlViewerTypes.LIST,
  extraFields:[],
  module:"subChapter",
  throttleRefresh:true,
  fields:["subChapterDisplayName","subChapterName"],
  searchFields:["subChapterDisplayName","subChapterName"],
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

export { mlSubChapterListConfig,mlSubChapterMapConfig};
