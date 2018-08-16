import {MlViewer,MlViewerTypes} from "../../../../../lib/common/mlViewer/mlViewer";
import React from 'react';
import gql from 'graphql-tag'
import ActiveFormatter from '../actions/ActiveFormatter';
// import FlagFormatter from '../actions/FlagFormatter';

const mlSocialLinksTypeTableConfig=new MlViewer.View({
  name:"SocialLinksTypeTable",
  module:"socialLinks",//Module name for filter.
  viewType:MlViewerTypes.TABLE,
  extraFields:[],
  fields:["socialLinksInfo.socialName","socialLinksInfo.socialDisplayName","socialLinksInfo.socialUploadIcon","isActive"],
  searchFields:["socialLinksInfo.socialName","socialLinksInfo.socialDisplayName","socialLinksInfo.socialUploadIcon","isActive"],
  throttleRefresh:false,
  pagination:true,//To display pagination
  selectRow:true,  //Enable checkbox/radio button to select the row.
  columns:[
    {dataField: "_id",title:"Id",'isKey':true,isHidden:true},
    {dataField: "socialLinksInfo.socialName", title: "Name",dataSort:true,customComponent:function(data){ return <div>{data.data.socialLinksInfo.socialName}</div>}},
    {dataField: "socialLinksInfo.socialDisplayName", title: "Display Name",dataSort:true,customComponent:function(data){ return <div>{data.data.socialLinksInfo.socialDisplayName}</div>}},
    {dataField: "socialLinksInfo.aboutSocial", title: "About",dataSort:true,customComponent:function(data){ return <div>{data.data.socialLinksInfo.aboutSocial}</div>}},
    // {dataField: "addressUploadIcon", title: "Icon",dataSort:true,customComponent:FlagFormatter},
    {dataField: "isActive", title: "Status",dataSort:true,customComponent:ActiveFormatter},
    // {dataField: "isActive", title: "Active",customComponent:"ActiveFormatter"}
  ],
  tableHeaderClass:'react_table_head',
  showActionComponent:true,
  actionConfiguration:[
    {
      actionName: 'edit',
      showAction: true,
      handler: (data)=>{
        if(data && data._id){
          FlowRouter.go("/admin/settings/editSocialLinkType/"+data._id);
        } else{
          toastr.error("Please select a Social Link type");
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
          FlowRouter.go("/admin/settings/addSocialLinkType")
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
    return {context:{settingsType:"SOCIALLINKS"}}
  },
/*  graphQlQuery:gql`
              query SearchQuery( $offset: Int, $limit: Int, $fieldsData: [GenericFilter], $sortData: [SortFilter]) {
              data:SearchQuery(module:"socialLinks",offset: $offset, limit: $limit, fieldsData: $fieldsData, sortData: $sortData){
                    totalRecords
                    data{
                      ...on SocialLinks{
                             _id
                            socialName
                            aboutSocial
                            socialDisplayName
                            socialUploadIcon
                            isActive
                          }
                      }
                }
              }
              `*/
  graphQlQuery:gql`
              query ContextSpecSearch($context:ContextParams,$offset: Int, $limit: Int,$searchSpec:SearchSpec,$fieldsData: [GenericFilter], $sortData: [SortFilter]){
                   data:ContextSpecSearch(module:"MASTERSETTINGS",context:$context,offset:$offset,limit:$limit,searchSpec:$searchSpec,fieldsData: $fieldsData, sortData: $sortData){
                        totalRecords
                           data{
                            ...on MasterSettings{
                                 _id
                                 isActive
                                 socialLinksInfo{
                                     socialName
                                    aboutSocial
                                    socialDisplayName
                                    socialUploadIcon
                                 }
                                    
                          }
                      }
              }
              }
              `
});

export {mlSocialLinksTypeTableConfig};
