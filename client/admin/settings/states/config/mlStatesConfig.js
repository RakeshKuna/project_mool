import {MlViewer,MlViewerTypes} from "../../../../../lib/common/mlViewer/mlViewer";
import React from 'react';
import gql from 'graphql-tag'
import ActiveStateFormatter from "../actions/ActiveStateFormatter"

const mlStatesTableConfig=new MlViewer.View({
  name:"StatesTable",
  module:"states",//Module name for filter.
  viewType:MlViewerTypes.TABLE,
  extraFields:[],
  action:"READ",
  fields:["name","countryName","isActive"],
  searchFields:["name","countryName","isActive"],
  throttleRefresh:false,
  pagination:true,//To display pagination
  selectRow:true,  //Enable checkbox/radio button to select the row.
  columns:[
    {dataField: "id",title:"Id",'isKey':true,isHidden:true},
    {dataField: "name", title: "Name",dataSort:true},
    {dataField: "countryName", title: "Country",dataSort:true},
    {dataField: "isActive", title: "Available in System",dataSort:true, customComponent:ActiveStateFormatter},
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
          FlowRouter.go("/admin/settings/editState/"+data.id);
        } else{
          toastr.error("Please select a State");
        }
      }
    },
    // {
    //   showAction: true,
    //   actionName: 'add',
    //   handler: (data)=>{
    //     FlowRouter.go("/admin/settings/addSubDepartment")
    //   }
    // },
    // {
    //   showAction: true,
    //   actionName: 'logout',
    //   handler: (data)=>{console.log(data);}
    // }
  ],
  sizePerPage:5,
  graphQlQuery:gql`
              query SearchQuery( $offset: Int, $limit: Int, $fieldsData: [GenericFilter], $sortData: [SortFilter]) {
              data:SearchQuery(module:"states",offset: $offset, limit: $limit, fieldsData: $fieldsData, sortData: $sortData){
                    totalRecords
                    data{
                      ...on States{
                              name
                              countryCode
                              countryName
                              countryId
                              isActive
                              id:_id
                          }
                      }
              }
              }
             `
});
const mlStateModuleConfig={
  moduleName:"states",
  actions:{"READ":"read","UPDATE":"update"}
};
export {mlStatesTableConfig,mlStateModuleConfig};
