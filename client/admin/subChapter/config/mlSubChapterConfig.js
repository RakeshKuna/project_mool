import {MlViewer,MlViewerTypes} from "../../../../lib/common/mlViewer/mlViewer";
import MlSubChapterList from "../../dashboard/component/MlSubChapterList"

import React from 'react';
import gql from 'graphql-tag'

const mlSubChapterListConfig=new MlViewer.View({
  name:"subChapterList",
  viewType:MlViewerTypes.LIST,
  extraFields:[],
  fields:["userName","mobileNumber","eMail","city","regType"],
  searchFields:["userName","mobileNumber","eMail","city","regType"],
  throttleRefresh:true,
  pagination:true,
  sort:true,
  viewComponent:<MlSubChapterList />,
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
              }`

});

export { mlSubChapterListConfig};
