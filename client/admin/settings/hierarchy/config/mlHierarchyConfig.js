import {MlViewer,MlViewerTypes} from "../../../../../lib/common/mlViewer/mlViewer";
import React from 'react';
import gql from 'graphql-tag'
// import FlagFormatter from '../actions/FlagFormatter';

const mlHierarchyTableConfig=new MlViewer.View({
  name:"HierarchyTable",
  module:"hierarchy",//Module name for filter.
  viewType:MlViewerTypes.TABLE,
  extraFields:[],
  fields:["level","module","role"],
  searchFields:["level","module","role"],
  throttleRefresh:false,
  pagination:true,//To display pagination
  selectRow:false,  //Enable checkbox/radio button to select the row.
  columns:[
    {dataField: "_id",title:"Id",'isKey':true,isHidden:true},
    {dataField: "level", title: "Level",dataSort:true},
    {dataField: "module", title: "Layer",dataSort:true},
    {dataField: "role", title: "Role",dataSort:true}
  ],
  tableHeaderClass:'react_table_head',
  showActionComponent:false,
  actionConfiguration:[
    {
      actionName: 'edit',
      showAction: true
    },
    {
      showAction: true,
      actionName: 'add'
    }
  ],
  sizePerPage:5,
  queryOptions:true,
  graphQlQuery:gql`
             query SearchQuery( $offset: Int, $limit: Int, $fieldsData: [GenericFilter], $sortData: [SortFilter]) {
              data:SearchQuery(module:"hierarchy",offset: $offset, limit: $limit, fieldsData: $fieldsData, sortData: $sortData){
                    totalRecords
                    data{
                     ...on Hierarchy{
                              level
                              module
                              role
                              id:_id
                          }
                      }
              }
              }
              `
});

export {mlHierarchyTableConfig};
