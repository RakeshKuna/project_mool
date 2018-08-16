import {MlViewer,MlViewerTypes} from "../../../../../lib/common/mlViewer/mlViewer";
import React from 'react';
import gql from 'graphql-tag'
// import ActiveFormatter from '../actions/ActiveFormatter';
// import FlagFormatter from '../actions/FlagFormatter';

const mlEmailTypeTableConfig=new MlViewer.View({
  name:"EmailTypeTable",
  module:"emailType",//Module name for filter.
  viewType:MlViewerTypes.TABLE,
  extraFields:[],
  fields:["emailTypeInfo.emailName","emailTypeInfo.emailDisplayName","emailTypeInfo.emailUploadIcon","isActive"],
  searchFields:["emailTypeInfo.emailName","emailTypeInfo.emailDisplayName","emailTypeInfo.emailUploadIcon","isActive"],
  throttleRefresh:false,
  pagination:true,//To display pagination
  selectRow:true,  //Enable checkbox/radio button to select the row.
  columns:[
    {dataField: "_id",title:"Id",'isKey':true,isHidden:true},
    {dataField: "emailTypeInfo.emailName", title: "Name",dataSort:true,customComponent:function(data){ return <div>{data.data.emailTypeInfo.emailName}</div>}},
    {dataField: "emailTypeInfo.emailDisplayName", title: "Display Name",dataSort:true,customComponent:function(data){ return <div>{data.data.emailTypeInfo.emailDisplayName}</div>}},
    {dataField: "emailTypeInfo.aboutEmail", title: "About",dataSort:true,customComponent:function(data){ return <div>{data.data.emailTypeInfo.aboutEmail}</div>}},
    // {dataField: "addressUploadIcon", title: "Icon",dataSort:true,customComponent:FlagFormatter},
    // {dataField: "isActive", title: "Available in System",dataSort:true,customComponent:ActiveFormatter},
    //{dataField: "isActive", title: "Active",customComponent:"ActiveFormatter"}
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
          FlowRouter.go("/admin/settings/editEmailType/"+data._id);
        } else{
          toastr.error("Please select a Email Type");
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
          FlowRouter.go("/admin/settings/addEmailType")
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
    return {context:{settingsType:"EMAILTYPE"}}
  },
  graphQlQuery:gql`
              query ContextSpecSearch($context:ContextParams,$offset: Int, $limit: Int,$searchSpec:SearchSpec,$fieldsData: [GenericFilter], $sortData: [SortFilter]){
                   data:ContextSpecSearch(module:"MASTERSETTINGS",context:$context,offset:$offset,limit:$limit,searchSpec:$searchSpec,fieldsData: $fieldsData, sortData: $sortData){
                        totalRecords
                           data{
                            ...on MasterSettings{
                                 _id
                                 isActive
                                 emailTypeInfo{
                                    emailName
                                    aboutEmail
                                    emailDisplayName
                                 }
                                    
                          }
                      }
              }
              }
              `
});

export {mlEmailTypeTableConfig};
