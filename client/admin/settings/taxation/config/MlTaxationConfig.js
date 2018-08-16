import {MlViewer,MlViewerTypes} from "../../../../../lib/common/mlViewer/mlViewer";
import React from 'react';
import gql from 'graphql-tag'
const mlTaxationTableConfig=new MlViewer.View({
  name:"taxationTable",
  module:"taxation",//Module name for filter.
  viewType:MlViewerTypes.TABLE,
  extraFields:[],
  fields:["taxationName","aboutTaxation","taxationValidityFrom","taxationValidityTo"],
  searchFields:["taxationName","aboutTaxation","taxationValidityFrom","taxationValidityTo"],
  throttleRefresh:false,
  pagination:true,//To display pagination
  selectRow:true,  //Enable checkbox/radio button to select the row.
  columns:[
    {dataField: "id",title:"Id",'isKey':true,isHidden:true},
    {dataField: "taxationName", title: "Taxation Name",dataSort:true},
    {dataField: "aboutTaxation", title: "About",dataSort:true},
    {dataField: "taxationValidityFrom", title: "Valid from",dataSort:true},
    {dataField: "taxationValidityTo", title: "Valid To",dataSort:true}
  ],
  tableHeaderClass:'react_table_head',
  showActionComponent:true,
  actionConfiguration:[
    {
      actionName: 'edit',
      showAction: true,
      handler:  (data)=>{
        if(data&&data.id){
          FlowRouter.go("/admin/settings/editTaxation/"+data.id)
        }
        else{
          toastr.error("Please select a Taxation")
        }
      }

    },
    {
      showAction: true,
      actionName: 'add',
      handler: (data)=>{
        if(data&&data.id)
          toastr.error("Please uncheck the record")
        else {
          FlowRouter.go("/admin/settings/addTaxation")
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
  graphQlQuery:gql`
                query SearchQuery( $offset: Int, $limit: Int, $fieldsData: [GenericFilter], $sortData: [SortFilter]) {
              data:SearchQuery(module:"taxation",offset: $offset, limit: $limit, fieldsData: $fieldsData, sortData: $sortData){
                    totalRecords
                    data{
                     ...on taxation{
                              taxationName
                              taxationValidityFrom  
                              taxationValidityTo   
                              aboutTaxation        
                              isActive             
                              id:_id
                          }
                      }
              }
              }
            
              `
});

export {mlTaxationTableConfig};
