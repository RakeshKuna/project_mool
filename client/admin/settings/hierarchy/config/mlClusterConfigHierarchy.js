import {MlViewer,MlViewerTypes} from "../../../../../lib/common/mlViewer/mlViewer";
import MlClustersListHierarchy from "../component/MlClustersListHierarchy"

import React from 'react';
import gql from 'graphql-tag'
const mlClusterListConfig=new MlViewer.View({
  name:"clusterList",
  viewType:MlViewerTypes.LIST,
  extraFields:[],
  fields:["displayName"],
  searchFields:["displayName"],
  throttleRefresh:true,
  pagination:true,
  sort:true,
  showActionComponent:false,
  viewComponent:<MlClustersListHierarchy />,
  graphQlQuery:gql`
                   query ContextSpecSearch($context:ContextParams,$offset: Int, $limit: Int,$searchSpec:SearchSpec, $fieldsData:[GenericFilter]){
                    data:ContextSpecSearch(module:"clusterHierarchy",context:$context,offset:$offset,limit:$limit,searchSpec:$searchSpec, fieldsData:$fieldsData){
                    totalRecords
                    data{
                     ...on Cluster{
                                 id:_id
                                about
                                displayName
                                latitude
                                longitude
                                countryId
                                countryFlag
                                countryName
                                isActive
                                showOnMap
                                clusterCode
                                about
                                email
                    	
                          }
                      }
              }
              }
              
              `
});


export {mlClusterListConfig};
