import {MlViewer,MlViewerTypes} from "../../../../../../lib/common/mlViewer/mlViewer";
import React from 'react';
import gql from 'graphql-tag'
const mlHierarchyTabHistoryTableConfig=new MlViewer.View({
  name:"auditLogTable",
  module:"audit",//Module name for filter.
  viewType:MlViewerTypes.TABLE,
  extraFields:[],
  fields:["moduleName", "fieldName" , "previousValue", "currentValue", "action"],
  searchFields:["moduleName" , "fieldName", "previousValue", "currentValue", "action"],
  throttleRefresh:false,
  pagination:true,//To display pagination
  selectRow:true,  //Enable checkbox/radio button to select the row.
  columns:[
    {dataField: "_id",title:"Id",'isKey':true,isHidden:true},
    {dataField: "moduleName", title: "Module",dataSort:true},
    {dataField: "fieldName", title: "Field Name",dataSort:true},
    {dataField: "previousValue", title: "Previous Value",dataSort:true},
    {dataField: "currentValue", title: "Current Value",dataSort:true},
    {dataField: "action", title: "Action",dataSort:true},
    // {dataField: "ip", title: "IP",dataSort:true}
  ],
  tableHeaderClass:'react_table_head',
  showActionComponent:false,
  actionConfiguration:[
    {
      showAction: true,
      actionName: 'logout',
      handler: (data)=>{console.log(data);}
    }
  ],
  queryOptions:true,
  buildQueryOptions:(config)=>{
    return {context:{moduleName:"HIERARCHY"}}
    // return {context:{moduleName:"CLUSTER, SUBCHAPTER",clusterId:config.params&&config.params.clusterId?config.params.clusterId:null}}
  },
  sizePerPage:5,
  graphQlQuery:gql`
              query ContextSpecSearch($context:ContextParams,$offset: Int, $limit: Int,$searchSpec:SearchSpec,$fieldsData: [GenericFilter], $sortData: [SortFilter]){
                   data:ContextSpecSearch(module:"AUDIT_LOG",context:$context,offset:$offset,limit:$limit,searchSpec:$searchSpec,fieldsData: $fieldsData, sortData: $sortData){
                        totalRecords
                           data{
                            ...on AuditLogs{
                                  _id
                                 moduleName
                                 collectionName
                                 previousValue
                                 currentValue
                                 action
                                 field
                                 fieldName
                                 docId
                          }
                      }
              }
              }
              `
});

export {mlHierarchyTabHistoryTableConfig};
