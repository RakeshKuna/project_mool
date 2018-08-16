import {MlViewer,MlViewerTypes} from "../../../../../lib/common/mlViewer/mlViewer";
import React from 'react';
import gql from 'graphql-tag'
import ActiveFormatter from '../actions/ActiveFormatter'
const mlLanguageTableConfig=new MlViewer.View({
  name:"languageTable",
  module:"language",//Module name for filter.
  viewType:MlViewerTypes.TABLE,
  extraFields:[],
  fields:["languageInfo.languageName","languageInfo.languageDisplayName","isActive"],
  searchFields:["languageInfo.languageName","languageInfo.languageDisplayName","isActive"],
  throttleRefresh:false,
  pagination:true,//To display pagination
  selectRow:true,  //Enable checkbox/radio button to select the row.
  columns:[
    {dataField: "_id",title:"Id",'isKey':true,isHidden:true},
    {dataField: "languageInfo.languageName", title: "Name",dataSort:true,customComponent:function(data){ return <div>{data.data.languageInfo.languageName}</div>}},
    {dataField: "languageInfo.languageDisplayName", title: "Display Name",dataSort:true,customComponent:function(data){ return <div>{data.data.languageInfo.languageDisplayName}</div>}},
    {dataField: "languageInfo.aboutLanguage", title: "About",dataSort:true,dataSort:true,customComponent:function(data){ return <div>{data.data.languageInfo.aboutLanguage}</div>}},
    {dataField: "isActive", title: "Active",dataSort:true,customComponent:ActiveFormatter},
    //{dataField: "isActive", title: "Active",customComponent:"ActiveFormatter"}
  ],
  tableHeaderClass:'react_table_head',
  showActionComponent:true,
  actionConfiguration:[
    {
      actionName: 'edit',
      showAction: true,
      handler: (data)=>{
        if(data && data._id){
          FlowRouter.go("/admin/settings/editLanguage/"+data._id);
        } else{
          toastr.error("Please select a Language");
        }
      }
    },
    {
      showAction: true,
      actionName: 'add',
      handler: (data)=>{
        if(data&&data._id)
          toastr.error("Please uncheck the record")
        else {
          FlowRouter.go("/admin/settings/addLanguage")
        }
      }
    },
    // {
    //   showAction: true,
    //   actionName: 'logout',
    //   handler: (data)=>{console.log(data);}
    // }
  ],
  sizePerPage:5,
  queryOptions:true,
  buildQueryOptions:(config)=>{
    return {context:{settingsType:"LANGUAGE"}}
  },
  graphQlQuery:gql`
             query ContextSpecSearch($context:ContextParams,$offset: Int, $limit: Int,$searchSpec:SearchSpec,$fieldsData: [GenericFilter], $sortData: [SortFilter]){
                   data:ContextSpecSearch(module:"MASTERSETTINGS",context:$context,offset:$offset,limit:$limit,searchSpec:$searchSpec,fieldsData: $fieldsData, sortData: $sortData){
                        totalRecords
                           data{
                            ...on MasterSettings{
                                 _id
                                 isActive
                                 languageInfo{
                                    languageName
                                    aboutLanguage
                                    languageDisplayName
                                 }
                                    
                          }
                      }
              }
              }
              `
});

export {mlLanguageTableConfig};
