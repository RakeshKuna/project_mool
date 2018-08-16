import {MlViewer,MlViewerTypes} from "../../../../../lib/common/mlViewer/mlViewer";
import React from 'react';
import gql from 'graphql-tag'
import MlAssignHierarchy from '../../hierarchy/component/MlAssignHierarchy'


const mlHierarchyDepartmentsTableConfig=new MlViewer.View({
  name:"HierarchyTable",
  module:"hierarchyDepartments",//Module name for filter.
  viewType:MlViewerTypes.TABLE,
  extraFields:[],
  fields:["departmentId","departmentName","subDepartmentId", "subDepartmentName", "isMoolya"],
  searchFields:["departmentId","departmentName","subDepartmentId", "subDepartmentName", "isMoolya"],
  throttleRefresh:false,
  pagination:true,//To display pagination
  filter:false,
  columns:[
    // {dataField: "departmentId",title:"Id",'isKey':true,isHidden:true,selectRow:true},
    {dataField: "subDepartmentId",title:"Id",'isKey':true,isHidden:true,selectRow:true},
    {dataField: "departmentName", title: "Department",dataSort:true,selectRow:true},
    // {dataField: "subDepartmentId", title: "Created By",isHidden:true,dataSort:true,selectRow:true},
    {dataField: "subDepartmentName", title: "Sub-Department",dataSort:true,selectRow:true},
    {dataField: "isMoolya", title: "Sub-Department",isHidden:true,dataSort:true,selectRow:true},
    {dataField: "clusterId", title: "clusterId",isHidden:true,dataSort:true,selectRow:true},
    {dataField: "isActive",title:"Status"}
  ],
  tableHeaderClass:'react_table_head',
  isExpandableRow:(row)=>{return true;},
  expandComponent:MlAssignHierarchy,
  showActionComponent:false,
  actionConfiguration:[],
  queryOptions:true,
  buildQueryOptions:(config)=>{
    return {context:{clusterId:config.params.clusterId,subChapterId:config.params.subChapterId,defaultSubChapter:config.params.defaultSubChapter}}
  },
  graphQlQuery:
  gql`query ContextSpecSearch($context:ContextParams $offset: Int, $limit: Int,$searchSpec:SearchSpec,$fieldsData:[GenericFilter],$sortData: [SortFilter]){
                    data:ContextSpecSearch(module:"hierarchyDepartments",offset:$offset, context:$context, limit:$limit,searchSpec:$searchSpec,fieldsData:$fieldsData,sortData:$sortData){
                    totalRecords
                    data{
                      ...on DepartmentAndSubDepartmentDetails{
                            departmentId       
                            departmentName     
                            subDepartmentId     
                            subDepartmentName   
                            isMoolya           
                            isActive     
                            clusterId,
                            isDefaultSubChapter,
                            subChapterId
                      }
                    }
              }
              }`
});

export {mlHierarchyDepartmentsTableConfig};

