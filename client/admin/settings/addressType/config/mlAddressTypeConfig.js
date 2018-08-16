import {MlViewer,MlViewerTypes} from "../../../../../lib/common/mlViewer/mlViewer";
import React from 'react';
import gql from 'graphql-tag'
// import ActiveFormatter from '../actions/ActiveFormatter';
// import FlagFormatter from '../actions/FlagFormatter';

const mlAddressTypeTableConfig=new MlViewer.View({
  name:"AddressTypeTable",
  module:"addressType",//Module name for filter.
  viewType:MlViewerTypes.TABLE,
  extraFields:[],
  fields:["addressTypeInfo.addressName","addressTypeInfo.addressDisplayName","addressTypeInfo.isActive"],
  searchFields:["addressTypeInfo.addressName","addressTypeInfo.addressDisplayName","addressTypeInfo.isActive"],
  throttleRefresh:false,
  pagination:true,//To display pagination
  selectRow:true,  //Enable checkbox/radio button to select the row.
  columns:[
    {dataField: "_id",title:"Id",'isKey':true,isHidden:true},
    {dataField: "addressTypeInfo.addressName", title: "Name",dataSort:true,customComponent:function(data){ return <div>{data.data.addressTypeInfo.addressName}</div>}},
    {dataField: "addressTypeInfo.addressDisplayName", title: "Display Name",dataSort:true,customComponent:function(data){ return <div>{data.data.addressTypeInfo.addressDisplayName}</div>}},
    {dataField: "isActive", title: "Active",dataSort:true}
  ],
  tableHeaderClass:'react_table_head',
  showActionComponent:true,
  actionConfiguration:[
    {
      actionName: 'edit',
      showAction: true,
      handler: (data)=>{
        if(data && data._id){
          FlowRouter.go("/admin/settings/editAddressType/"+data._id);
        } else{
          toastr.error("Please select a Address Type");
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
          FlowRouter.go("/admin/settings/addAddressType")
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
    return {context:{settingsType:"ADDRESSTYPE"}}
  },
  graphQlQuery:gql`
              query ContextSpecSearch($context:ContextParams,$offset: Int, $limit: Int,$searchSpec:SearchSpec,$fieldsData: [GenericFilter], $sortData: [SortFilter]){
                   data:ContextSpecSearch(module:"MASTERSETTINGS",context:$context,offset:$offset,limit:$limit,searchSpec:$searchSpec,fieldsData: $fieldsData, sortData: $sortData){
                        totalRecords
                           data{
                            ...on MasterSettings{
                                 _id
                                 isActive
                                 addressTypeInfo{
                                    addressName
                                    aboutAddress
                                    addressDisplayName
                                 }
                                    
                          }
                      }
              }
              }
              `
});

export {mlAddressTypeTableConfig};
