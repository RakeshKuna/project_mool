/**
 * Created by venkatasrinag on 8/3/17.
 */
import {MlViewer,MlViewerTypes} from "../../../../lib/common/mlViewer/mlViewer";
import MlClusterCommunitiesList from "../components/MlClusterCommunitiesList"
import MlClusterChapterCommunitiesList from '../components/MlClusterChapterCommunitiesList'
import React from 'react';
import gql from 'graphql-tag'

const mlClusterCommunityListConfig=new MlViewer.View({
  name:"clusterCommunityList",
  module:"community",
  viewType:MlViewerTypes.LIST,
  extraFields:[],
  throttleRefresh:true,
  pagination:true,
  sort:true,
  search:false,
  queryOptions:true,
  buildQueryOptions:(config)=>{
    return {clusterId:config.params&&config.params.clusterId?config.params.clusterId:null}
  },
  viewComponent:<MlClusterCommunitiesList />,
  graphQlQuery:gql`
              query($clusterId:String){
              data:fetchCommunities(clusterId:$clusterId){
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

const mlClusterChapterCommunityListConfig=new MlViewer.View({
  name:"clusterCommunityList",
  module:"community",
  viewType:MlViewerTypes.LIST,
  extraFields:[],
  throttleRefresh:true,
  pagination:true,
  sort:true,
  queryOptions:true,
  buildQueryOptions:(config)=>{
    return {clusterId:config.params&&config.params.clusterId?config.params.clusterId:null,
      chapterId:config.params&&config.params.chapterId?config.params.chapterId:null,
      subChapterId:config.params&&config.params.subChapterId?config.params.subChapterId:null}
  },
  viewComponent:<MlClusterChapterCommunitiesList />,
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


export {mlClusterCommunityListConfig, mlClusterChapterCommunityListConfig};
