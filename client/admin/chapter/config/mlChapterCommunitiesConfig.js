/**
 * Created by venkatasrinag on 8/3/17.
 */
import {MlViewer,MlViewerTypes} from "../../../../lib/common/mlViewer/mlViewer";
import MlChapterCommunitiesList from '../components/MlChapterCommunitiesList'

import React from 'react';
import gql from 'graphql-tag'

const mlChapterCommunitiesConfig=new MlViewer.View({
  name:"subChapterList",
  viewType:MlViewerTypes.LIST,
  extraFields:[],
  module:"community",
  throttleRefresh:true,
  pagination:true,
  sort:true,
  search:false,
  viewComponent:<MlChapterCommunitiesList />,
  queryOptions:true,
  buildQueryOptions:(config)=>{
    return {clusterId:config.params&&config.params.clusterId?config.params.clusterId:null,
      chapterId:config.params&&config.params.chapterId?config.params.chapterId:null,
      subChapterId:config.params&&config.params.subChapterId?config.params.subChapterId:null}
  },
  graphQlQuery:gql`
    query($clusterId:String, $chapterId:String, $subChapterId:String){
      data:fetchCommunities(clusterId:$clusterId, chapterId:$chapterId, subChapterId:$subChapterId){
        totalRecords
          data{
            ...on Community{
              name,
              displayName,
              code,
              communityImageLink,
              showOnMap,
              aboutCommunity,
              isActive,
              clusters,
              chapters,
              subchapters
            }
          }
        }
      }
   `
});

export {mlChapterCommunitiesConfig};
