import {MlViewer,MlViewerTypes} from "../../../../../lib/common/mlViewer/mlViewer";
import React from 'react';
import gql from 'graphql-tag'
// import ActiveFormatter from '../actions/ActiveFormatter';
// import FlagFormatter from '../actions/FlagFormatter';

const mlContactTypeTableConfig=new MlViewer.View({
  name:"ContactTypeTable",
  module:"contactType",//Module name for filter.
  viewType:MlViewerTypes.TABLE,
  extraFields:[],
  fields:["contactTypeInfo.contactName","contactTypeInfo.contactDisplayName","contactTypeInfo.contactUploadIcon","isActive"],
  searchFields:["contactTypeInfo.contactName","contactTypeInfo.contactDisplayName","contactTypeInfo.contactUploadIcon","isActive"],
  throttleRefresh:false,
  pagination:true,//To display pagination
  selectRow:true,  //Enable checkbox/radio button to select the row.
  columns:[
    {dataField: "_id",title:"Id",'isKey':true,isHidden:true},
    {dataField: "contactTypeInfo.contactName", title: "Name",dataSort:true,customComponent:function(data){ return <div>{data.data.contactTypeInfo.contactName}</div>}},
    {dataField: "contactTypeInfo.contactDisplayName", title: "Display Name",dataSort:true,customComponent:function(data){ return <div>{data.data.contactTypeInfo.contactDisplayName}</div>}},
    {dataField: "contactTypeInfo.aboutContact", title: "About",dataSort:true,customComponent:function(data){ return <div>{data.data.contactTypeInfo.aboutContact}</div>}},
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
          FlowRouter.go("/admin/settings/editContactType/"+data._id);
        } else{
          toastr.error("Please select a Contact Type");
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
          FlowRouter.go("/admin/settings/addContactType")
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
              data:SearchQuery(module:"contactType",offset: $offset, limit: $limit,fieldsData: $fieldsData, sortData: $sortData){
                    totalRecords
                    data{
                      ...on ContactType{
                             _id
                            contactName
                            aboutContact
                            contactDisplayName
                          }
                      }
                }
              }
              `*/
  queryOptions:true,
  buildQueryOptions:(config)=>{
    return {context:{settingsType:"CONTACTTYPE"}}
  },
  graphQlQuery:gql`
               query ContextSpecSearch($context:ContextParams,$offset: Int, $limit: Int,$searchSpec:SearchSpec,$fieldsData: [GenericFilter], $sortData: [SortFilter]){
                   data:ContextSpecSearch(module:"MASTERSETTINGS",context:$context,offset:$offset,limit:$limit,searchSpec:$searchSpec,fieldsData: $fieldsData, sortData: $sortData){
                        totalRecords
                           data{
                            ...on MasterSettings{
                                 _id
                                 isActive
                                 contactTypeInfo{
                                    contactName
                                    aboutContact
                                    contactDisplayName
                                 }
                                    
                          }
                      }
              }
              }
              
              `
});

export {mlContactTypeTableConfig};
