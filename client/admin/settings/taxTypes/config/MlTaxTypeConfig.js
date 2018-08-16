import {MlViewer,MlViewerTypes} from "../../../../../lib/common/mlViewer/mlViewer";
import React from 'react';
import gql from 'graphql-tag'
const mlTaxTypeTableConfig=new MlViewer.View({
  name:"taxTypeTable",
  module:"tax",//Module name for filter.
  viewType:MlViewerTypes.TABLE,
  extraFields:[],
  fields:["taxTypeInfo.taxName","taxTypeInfo.taxDisplayName","isActive"],
  searchFields:["taxTypeInfo.taxName","taxTypeInfo.taxDisplayName","isActive"],
  throttleRefresh:false,
  pagination:true,//To display pagination
  selectRow:true,  //Enable checkbox/radio button to select the row.
  columns:[
    {dataField: "_id",title:"Id",'isKey':true,isHidden:true},
    {dataField: "taxTypeInfo.taxName", title: "Tax Type",dataSort:true,customComponent:function(data){ return <div>{data.data.taxTypeInfo.taxName}</div>}},
    {dataField: "taxTypeInfo.taxDisplayName", title: "Display Name",dataSort:true,customComponent:function(data){ return <div>{data.data.taxTypeInfo.taxDisplayName}</div>}},
    {dataField: "isActive", title: "Active",dataSort:true}
  ],
  tableHeaderClass:'react_table_head',
  showActionComponent:true,
  actionConfiguration:[
    {
      actionName: 'edit',
      showAction: true,
      handler:  (data)=>{
        if(data&&data._id){
          FlowRouter.go("/admin/settings/editTaxType/"+data._id)
        }
        else{
          toastr.error("Please select a Tax Type")
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
          FlowRouter.go("/admin/settings/addTaxType")
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
    return {context:{settingsType:"TAXTYPE"}}
  },
  sizePerPage:5,
  graphQlQuery:gql`
           query ContextSpecSearch($context:ContextParams,$offset: Int, $limit: Int,$searchSpec:SearchSpec,$fieldsData: [GenericFilter], $sortData: [SortFilter]){
                   data:ContextSpecSearch(module:"MASTERSETTINGS",context:$context,offset:$offset,limit:$limit,searchSpec:$searchSpec,fieldsData: $fieldsData, sortData: $sortData){
                        totalRecords
                           data{
                            ...on MasterSettings{
                                 _id
                                 isActive
                                 taxTypeInfo {
                                   taxName
                                   aboutTax
                                   taxDisplayName
                                 }
                                    
                          }
                      }
              }
              }
            
            
              `
});

export {mlTaxTypeTableConfig};
