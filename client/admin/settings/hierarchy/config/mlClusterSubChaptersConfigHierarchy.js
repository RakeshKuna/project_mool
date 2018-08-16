import {MlViewer,MlViewerTypes} from "../../../../../lib/common/mlViewer/mlViewer";
import MlClusterSubChaptersListHierarchy from "../component/MlClusterSubChaptersListHierarchy"
import React from 'react';
import gql from 'graphql-tag'

const mlClusterSubChaptersListConfig=new MlViewer.View({
  name:"clusterChapterList",
  module:"hierarchySubChapters",
  viewType:MlViewerTypes.LIST,
  extraFields:[],
  throttleRefresh:true,
  pagination:true,
  sort:true,
  queryOptions:true,
  buildQueryOptions:(config)=>{
    return {context:{clusterId:config.params&&config.params.clusterId?config.params.clusterId:null, chapterId:config.params&&config.params.chapterId?config.params.chapterId:null}}
  },
  viewComponent:<MlClusterSubChaptersListHierarchy />,
  graphQlQuery:gql`
              query ContextSpecSearch($context:ContextParams,$offset: Int, $limit: Int,$searchSpec:SearchSpec){
              data:ContextSpecSearch(module:"hierarchy",context:$context,offset:$offset,limit:$limit,searchSpec:$searchSpec){
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
