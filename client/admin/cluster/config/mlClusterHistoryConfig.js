import {MlViewer,MlViewerTypes} from "../../../../lib/common/mlViewer/mlViewer";
import React from 'react';
import gql from 'graphql-tag'
import moment from "moment";

function ipAddressFormatter(data){

  let ipaddr=data&&data.data&&data.data.userAgent.ipAddress?data.data.userAgent.ipAddress:"";
  return <div>{ipaddr}</div>

}

function dateFormatter (data){
  let createdDateTime=data&&data.data&&data.data.timeStamp?data.data.timeStamp:null;
  return <div>{createdDateTime&&moment(createdDateTime).format(Meteor.settings.public.dateFormat)}</div>;
}



const mlClusterHistoryConfig=new MlViewer.View({
  name:"auditLogTable",
  module:"audit",//Module name for filter.
  viewType:MlViewerTypes.TABLE,
  extraFields:[],
  fields:["moduleName", "fieldName" , "previousValue", "currentValue","userName"],
  searchFields:["moduleName" , "fieldName", "previousValue", "currentValue", "userName"],
  throttleRefresh:false,
  pagination:true,//To display pagination
  selectRow:true,  //Enable checkbox/radio button to select the row.
  columns:[
    {dataField: "_id",title:"Id",'isKey':true,isHidden:true},
    {dataField: "timeStamp", title: "Date&Time",dataSort:true,customComponent:dateFormatter},
    {dataField: "moduleName", title: "Module",dataSort:true},
    {dataField: "fieldName", title: "Field Name",dataSort:true},
    {dataField: "previousValue", title: "Previous Value",dataSort:true},
    {dataField: "currentValue", title: "Current Value",dataSort:true},
    {dataField: "userName", title: "Modified By",dataSort:true},
    {dataField: "userAgent", title: "IP Address",dataSort:true,customComponent:ipAddressFormatter},
    // {dataField: "ip", title: "IP",dataSort:true}
  ],
  tableHeaderClass:'react_table_head',
  showActionComponent:false,
  actionConfiguration:[
    {
      showAction: true,
      actionName: 'logout',
      handler: (data)=>{console.log(data);}
    }
  ],
  queryOptions:true,
  buildQueryOptions:(config)=>{
    return {context:{moduleName:"CITIES,INDUSTRY,AWARDS,COUNTRIES,DEPARTMENT,DOCUMENTMAPPING,GLOBALSETTINGS,MASTERSETTINGS,HIERARCHY,Modules,PROCESSMAPPING,ROLES,ROLETYPE,SERVICES,STATES,Status,SUBDEPARTMENT,TAXATION,ACCOUNTTYPES,BUSINESSTYPE,CITIZENSHIP,DOCUMENTCATEGORIES,DOCUMENTFORMAT,DOCUMENTTYPE,ENTITY,LOOKINGFOR,FUNDINGTYPE,PROFESSION,SPECIFICATION,STAGEOFCOMPANY,IDENTITYTYPES,PROCESSTYPES,SUBPROCESS,HIERARCHY,FILTERS,TEMPLATE"}}
    // return {context:{moduleName:"CLUSTER, SUBCHAPTER",clusterId:config.params&&config.params.clusterId?config.params.clusterId:null}}
  },
  sizePerPage:5,
  graphQlQuery:gql`
              query ContextSpecSearch($context:ContextParams,$offset: Int, $limit: Int,$searchSpec:SearchSpec,$fieldsData: [GenericFilter], $sortData: [SortFilter]){
                   data:ContextSpecSearch(module:"AUDIT_LOG",context:$context,offset:$offset,limit:$limit,searchSpec:$searchSpec,fieldsData: $fieldsData, sortData: $sortData){
                        totalRecords
                           data{
                            ...on AuditLogs{
                                  _id
                                 moduleName
                                 userName
                                 collectionName
                                 previousValue
                                 currentValue
                                 userName
                                 action
                                 field
                                 fieldName
                                 docId
                                 timeStamp
                                 userAgent{
                                  ipAddress
                                 }
                          }
                      }
              }
              }
              `
});

export {mlClusterHistoryConfig};
