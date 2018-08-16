import {MlViewer,MlViewerTypes} from "../../../../lib/common/mlViewer/mlViewer";
import MlClusterSubChaptersList from "../components/MlClusterSubChaptersList"
import React from 'react';
import gql from 'graphql-tag'

const mlClusterSubChaptersListConfig=new MlViewer.View({
  name:"clusterChapterList",
  module:"chapter",
  viewType:MlViewerTypes.LIST,
  extraFields:[],
  fields:["subChapterDisplayName"],
  searchFields:["subChapterDisplayName"],
  throttleRefresh:true,
  pagination:true,
  sort:true,
  queryOptions:true,
  buildQueryOptions:(config)=>{
    return {context:{clusterId:config.params&&config.params.clusterId?config.params.clusterId:null, chapterId:config.params&&config.params.chapterId?config.params.chapterId:null}}
  },
  viewComponent:<MlClusterSubChaptersList />,
  graphQlQuery:gql`
              query ContextSpecSearch($context:ContextParams,$offset: Int, $limit: Int,$searchSpec:SearchSpec,$fieldsData:[GenericFilter]){
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


export {mlClusterSubChaptersListConfig};
