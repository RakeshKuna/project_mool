import {MlViewer,MlViewerTypes} from "../../../../../lib/common/mlViewer/mlViewer";
import React from 'react';
import gql from 'graphql-tag'
const mlDocumentTypesTableConfig=new MlViewer.View({
  name:"documentTypeTable",
  module:"documentType",//Module name for filter.
  viewType:MlViewerTypes.TABLE,
  extraFields:[],
  fields:["docTypeName","displayName","isActive"],
  searchFields:["docTypeName","displayName","isActive"],
  throttleRefresh:false,
  pagination:false,//To display pagination
  selectRow:true,  //Enable checkbox/radio button to select the row.
  columns:[
    {dataField: "id",title:"Id",'isKey':true,isHidden:true},
    {dataField: "docTypeName", title: "Name",dataSort:true},
    {dataField: "docTypeDisplayName", title: "Display Name",dataSort:true},
    {dataField: "isActive", title: "Active",dataSort:true},
    //{dataField: "isActive", title: "Active",customComponent:"ActiveFormatter"}
  ],
  tableHeaderClass:'react_table_head',
  showActionComponent:true,
  actionConfiguration:[
    {
      actionName: 'edit',
      showAction: true,
      handler: (data)=>{
        if(data && data.id){
          FlowRouter.go("/admin/settings/documentProcess/editDocumentType/"+data.id);
        } else{
          toastr.error("Please select a Document Type");
        }
      }
    },
   /* {
      showAction: true,
      actionName: 'add',
      handler: (data)=>{
        FlowRouter.go("/admin/settings/addDocumentType")
      }
    },*/
    // {
    //   showAction: true,
    //   actionName: 'logout',
    //   handler: (data)=>{console.log(data);}
    // }
  ],
  graphQlQuery:gql`
              query SearchQuery($offset: Int, $limit: Int, $fieldsData: [GenericFilter], $sortData: [SortFilter]){
              data:SearchQuery(module:"documentType",offset: $offset, limit: $limit, fieldsData: $fieldsData, sortData: $sortData){
                    totalRecords
                    data{
                     ...on DocumentTypes{
                              docTypeName
                              docTypeDisplayName
                              isActive
                              id:_id
                          }
                      }
              }
              }
              `
});

export {mlDocumentTypesTableConfig};
