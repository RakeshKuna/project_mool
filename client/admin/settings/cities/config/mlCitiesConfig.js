import {MlViewer,MlViewerTypes} from "../../../../../lib/common/mlViewer/mlViewer";
import React from 'react';
import gql from 'graphql-tag'
import ActiveCityFormatter from "../actions/ActiveCityFormatter"

const mlCitiesTableConfig=new MlViewer.View({
  name:"CitiesTable",
  module:"cities",//Module name for filter.
  viewType:MlViewerTypes.TABLE,
  extraFields:[],
  action:"READ",
  fields:["name","stateId","countryCode","isActive"],
  searchFields:["name","stateId","countryCode","isActive"],
  throttleRefresh:false,
  pagination:true,//To display pagination
  selectRow:true,  //Enable checkbox/radio button to select the row.
  columns:[
    {dataField: "id",title:"Id",'isKey':true,isHidden:true},
    {dataField: "name", title: "Name",dataSort:true},
    {dataField: "countryCode", title: "Country",dataSort:true},
    {dataField: "stateId", title: "State",dataSort:true},
    {dataField: "isActive", title: "Available in System",dataSort:true, customComponent:ActiveCityFormatter},
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
          FlowRouter.go("/admin/settings/editCity/"+data.id);
        } else{
          toastr.error("Please select a City");
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
              data:SearchQuery(module:"cities",offset: $offset, limit: $limit, fieldsData: $fieldsData, sortData: $sortData){
                    totalRecords
                    data{
                      ...on Cities{
                               name
                               countryCode
                               countryId
                               displayName
                               stateId
                               isActive
                               id:_id
                          }
                      }
              }
              }
             `
});
const mlStateModuleConfig={
  moduleName:"cities",
  actions:{"READ":"read","UPDATE":"update"}
};
export {mlCitiesTableConfig,mlStateModuleConfig};
