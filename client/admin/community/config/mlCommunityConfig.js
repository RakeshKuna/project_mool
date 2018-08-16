import {MlViewer,MlViewerTypes} from "../../../../lib/common/mlViewer/mlViewer";
import MlMapViewContainer from "../../core/containers/MlMapViewContainer"
import MlCommunityList from "../components/MlCommunityList"
import MlCommunityChapterList from "../components/MlCommunityChapterList"
import MlCommunitySubChapterList from "../components/MlCommunitySubChapterList"
import MlSubChapterCommunityList from "../components/MlSubChapterCommunityList"


import {getAdminUserContext} from '../../../commons/getAdminUserContext'

import React from 'react';
import gql from 'graphql-tag'

const mlCommunityMapConfig=new MlViewer.View({
  name:"chapterMap",
  viewType:MlViewerTypes.MAP,
  extraFields:[],
  fields:["userName","mobileNumber","eMail","city","regType"],
  searchFields:["userName","mobileNumber","eMail","city","regType"],
  throttleRefresh:true,
  pagination:false,
  viewComponent:<MlMapViewContainer />,
  graphQlQuery:gql`
              query{
                  data:fetchChaptersForMap{
                     _id
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

                  }
              }
              `
});

const mlCommunityListConfig=new MlViewer.View({
  name:"communityList",
  viewType:MlViewerTypes.LIST,
  extraFields:[],
  fields:["name","displayName","communityImageLink","aboutCommunity","isActive"],
  searchFields:["name","displayName","communityImageLink","aboutCommunity","isActive"],
  throttleRefresh:true,
  pagination:true,
  sort:true,
  search:false,
  viewComponent:<MlCommunityList />,
  queryOptions:true,
  buildQueryOptions:(config)=>
  {
    let userDefaultObj = getAdminUserContext()
    return {clusterId:userDefaultObj.clusterId?userDefaultObj.clusterId:null}
  },
  graphQlQuery:gql`
              query{
              data:fetchCommunities{
                    totalRecords
                    data{
                     ...on Community{
                            name,
                            displayName,
                            code,
                            communityImageLink,
                            showOnMap,
                            aboutCommunity,
                            isActive
                          }
                      }
              }
              }
              `
});

const mlCommunityChaptersConfig=new MlViewer.View({
  name:"communityChapterList",
  viewType:MlViewerTypes.LIST,
  extraFields:[],
  throttleRefresh:true,
  fields:["displayName"],
  searchFields:["displayName"],
  pagination:true,
  sort:true,
  viewComponent:<MlCommunityChapterList />,
  queryOptions:true,
  buildQueryOptions:(config)=>
  {
    if(!config.params){
      let userDefaultObj = getAdminUserContext()
      return {context:{clusterId:userDefaultObj.clusterId?userDefaultObj.clusterId:null}}
    }
    else
      return {context:{clusterId:config.params&&config.params.clusterId?config.params.clusterId:null}}
  },
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

const mlCommunitySubChaptersConfig=new MlViewer.View({
  name:"communityChapterList",
  viewType:MlViewerTypes.LIST,
  extraFields:[],
  throttleRefresh:true,
  pagination:true,
  sort:true,
  viewComponent:<MlCommunitySubChapterList />,
  queryOptions:true,
  buildQueryOptions:(config)=>{
    return {context:{clusterId:config.params&&config.params.clusterId?config.params.clusterId:null,chapterId:config.params&&config.params.chapterId?config.params.chapterId:null}}
  },
  graphQlQuery:gql`query ContextSpecSearch($context:ContextParams,$offset: Int, $limit: Int,$searchSpec:SearchSpec){
              data:ContextSpecSearch(module:"subChapter",context:$context,offset:$offset,limit:$limit,searchSpec:$searchSpec){
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

const mlSubChapterCommunitiesListConfig=new MlViewer.View({
  name:"subChapterList",
  viewType:MlViewerTypes.LIST,
  extraFields:[],
  module:"community",
  throttleRefresh:true,
  pagination:true,
  sort:true,
  viewComponent:<MlSubChapterCommunityList />,
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

export {mlCommunityMapConfig, mlCommunityListConfig, mlCommunityChaptersConfig, mlCommunitySubChaptersConfig, mlSubChapterCommunitiesListConfig};
