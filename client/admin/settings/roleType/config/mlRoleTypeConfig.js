import {MlViewer,MlViewerTypes} from "../../../../../lib/common/mlViewer/mlViewer";
import React from 'react';
import gql from 'graphql-tag'
const mlRoleTypeTableConfig=new MlViewer.View({
  name:"roleTypeTable",
  module:"roleType",//Module name for filter.
  viewType:MlViewerTypes.TABLE,
  extraFields:[],
  fields:["roleTypeName","roleTypeDisplayName","isActive"],
  searchFields:["roleTypeName","roleTypeDisplayName","isActive"],
  throttleRefresh:false,
  pagination:true,//To display pagination
  selectRow:true,  //Enable checkbox/radio button to select the row.
  columns:[
    {dataField: "id",title:"Id",'isKey':true,isHidden:true},
    {dataField: "roleTypeName", title: "RoleType Name",dataSort:true},
    {dataField: "roleTypeDisplayName", title: "Display Name",dataSort:true},
    {dataField: "isActive", title: "Active",dataSort:true}
  ],
  tableHeaderClass:'react_table_head',
  showActionComponent:true,
  actionConfiguration:[
    {
      actionName: 'edit',
      showAction: true,
      handler: (data)=>{
        if(data && data.id){
          FlowRouter.go("/admin/settings/editRoleType/"+data.id);
        } else{
          toastr.error("Please select a Role Type");
        }
      }
    },
    // {
    //   showAction: true,
    //   actionName: 'add',
    //   handler: null
    // },
    // {
    //   showAction: true,
    //   actionName: 'logout',
    //   handler: (data)=>{console.log(data);}
    // }
  ],
  graphQlQuery:gql`
              query SearchQuery($offset: Int, $limit: Int, $fieldsData: [GenericFilter], $sortData: [SortFilter]){
              data:SearchQuery(module:"roleType", offset: $offset, limit: $limit, fieldsData: $fieldsData, sortData: $sortData){
                    totalRecords
                    data{
                     ...on RoleTypes{
                              roleTypeName
                              roleTypeDisplayName
                              roleTypeDescription
                              isActive
                              id:_id
                          }
                      }
              }
             }
              `
});

export {mlRoleTypeTableConfig};
