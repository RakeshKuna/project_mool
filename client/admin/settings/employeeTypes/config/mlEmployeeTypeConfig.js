import {MlViewer,MlViewerTypes} from "../../../../../lib/common/mlViewer/mlViewer";
import React from 'react';
import gql from 'graphql-tag'
const mlEmployeeTypeTableConfig=new MlViewer.View({
  name:"employeeTypeTable",
  module:"EmployeeType",//Module name for filter.
  viewType:MlViewerTypes.TABLE,
  extraFields:[],
  fields:["employmentTypeInfo.employmentName","employmentTypeInfo.employmentDisplayName","employmentTypeInfo.isActive"],
  searchFields:["employmentTypeInfo.employmentName","employmentTypeInfo.employmentDisplayName","employmentTypeInfo.isActive"],
  throttleRefresh:false,
  pagination:true,//To display pagination
  selectRow:true,  //Enable checkbox/radio button to select the row.
  columns:[
    {dataField: "_id",title:"Id",'isKey':true,isHidden:true},
    {dataField: "employmentTypeInfo.employmentName", title: "Employee Type",dataSort:true,customComponent:function(data){ return <div>{data.data.employmentTypeInfo.employmentName}</div>}},
    {dataField: "employmentTypeInfo.employmentDisplayName", title: "Display Name",dataSort:true,customComponent:function(data){ return <div>{data.data.employmentTypeInfo.employmentDisplayName}</div>}},
    {dataField: "isActive", title: "Active",dataSort:true},
    ],
  tableHeaderClass:'react_table_head',
  showActionComponent:true,
  actionConfiguration:[
    {
      actionName: 'edit',
      showAction: true,
      handler:  (data)=>{
        if(data&&data._id){
          FlowRouter.go("/admin/settings/editEmployeeType/"+data._id)
        }
        else{
          toastr.error("Please select a employee type ")
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
          FlowRouter.go("/admin/settings/addEmployeeType")
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
/*  graphQlQuery:gql`
                query SearchQuery( $offset: Int, $limit: Int, $fieldsData: [GenericFilter], $sortData: [SortFilter]) {
              data:SearchQuery(module:"EmployeeType",offset: $offset, limit: $limit, fieldsData: $fieldsData, sortData: $sortData){
                    totalRecords
                    data{
                     ...on EmployeeType{
                              employmentName
                              employmentDisplayName
                              isActive
                              id:_id
                          }
                      }
              }
              }

              `*/
  queryOptions:true,
  buildQueryOptions:(config)=>{
    return {context:{settingsType:"EMPLOYMENTTYPE"}}
  },
  graphQlQuery:gql`
                query ContextSpecSearch($context:ContextParams,$offset: Int, $limit: Int,$searchSpec:SearchSpec,$fieldsData: [GenericFilter], $sortData: [SortFilter]){
                   data:ContextSpecSearch(module:"MASTERSETTINGS",context:$context,offset:$offset,limit:$limit,searchSpec:$searchSpec,fieldsData: $fieldsData, sortData: $sortData){
                        totalRecords
                           data{
                            ...on MasterSettings{
                                 _id
                                 isActive
                                 employmentTypeInfo{
                                    employmentName
                                    aboutEmployment
                                    employmentDisplayName
                                 }
                                    
                          }
                      }
              }
              }
            
              `


});

export {mlEmployeeTypeTableConfig};
