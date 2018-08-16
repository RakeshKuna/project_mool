import {MlViewer,MlViewerTypes} from "../../../../lib/common/mlViewer/mlViewer";
import MlClustersList from "../components/MlClustersList"
import MlMapViewContainer from "../../core/containers/MlMapViewContainer"

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
  actionConfiguration:[
    // {
    //   actionName: 'edit',
    //   showAction: true,
    //   handler:  (data)=>{
    //     if(data&&data.id){
    //       // FlowRouter.go("/admin/settings/editCitizenship/"+data.id)
    //     }
    //     else{
    //       // alert("Please select a Citizenship to edit")
    //     }
    //   }
    //
    // },
    // {
    //   showAction: true,
    //   actionName: 'add',
    //   handler: (data)=>{
    //     // FlowRouter.go("/admin/settings/addCitizenship")
    //   }
    // },
    {
      showAction: true,
      actionName: 'logout',
      handler: (data)=>{console.log(data);}
    }
  ],
  viewComponent:<MlClustersList />,
  graphQlQuery:gql`
                   query ContextSpecSearch($context:ContextParams,$offset: Int, $limit: Int,$searchSpec:SearchSpec, $fieldsData:[GenericFilter]){
                    data:ContextSpecSearch(module:"cluster",context:$context,offset:$offset,limit:$limit,searchSpec:$searchSpec, fieldsData:$fieldsData){
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

const mlClusterMapConfig=new MlViewer.View({
  name:"clusterMap",
  viewType:MlViewerTypes.MAP,
  extraFields:[],
  fields:["userName","mobileNumber","eMail","city","regType"],
  searchFields:["userName","mobileNumber","eMail","city","regType"],
  throttleRefresh:true,
  pagination:false,
  viewComponent:<MlMapViewContainer />,
  graphQlQuery:gql`
              query ContextSpecSearch($context:ContextParams,$searchSpec:SearchSpec){
                    data:ContextSpecSearch(module:"cluster",context:$context,searchSpec:$searchSpec){
                    totalRecords
                    data{
                     ...on Cluster{
                             _id
                             desc:about
                             text:displayName
                             lat:latitude
                             lng:longitude
                             isActive:isActive
                          }
                      }
              }
              }
              `
});

export {mlClusterListConfig,mlClusterMapConfig};
