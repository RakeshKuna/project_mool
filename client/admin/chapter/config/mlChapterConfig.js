import {MlViewer,MlViewerTypes} from "../../../../lib/common/mlViewer/mlViewer";
import MlMapViewContainer from "../../core/containers/MlMapViewContainer"
import MlChapterList from "../../chapter/components/MlChapterList"
import {getAdminUserContext} from '../../../commons/getAdminUserContext'

import React from 'react';
import gql from 'graphql-tag'

const mlChapterMapConfig=new MlViewer.View({
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

const mlChapterListConfig=new MlViewer.View({
  name:"chapterList",
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
  viewComponent:<MlChapterList />,
  queryOptions:true,
  buildQueryOptions:(config)=>
  {
    let userDefaultObj = getAdminUserContext()
    if(!config.params && !userDefaultObj.isParent){
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

export {mlChapterMapConfig, mlChapterListConfig};
