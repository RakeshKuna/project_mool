/** ************************************************************
 * Date: 19 Jun, 2017
 * Programmer: Pankaj <pankajkumar.jatav@raksan.in>
 * Description : This is the list view
 * JavaScript file MlAppointmentsConfig.js
 * *************************************************************** */

/**
 * Imports libs and components
 */
import moment from "moment";
import {MlViewer,MlViewerTypes} from "../../../../../lib/common/mlViewer/mlViewer";
import React from 'react';
import gql from 'graphql-tag'
import MlAppointmentsDetailsComponent  from '../component/MlAppointmentsDetailsComponent';
import MlCustomFilter from '../../../../commons/customFilters/customFilter';
import {client} from '../../../core/apolloConnection';


function createdateFormatter (data){
  console.log(data)
  let createdAt=data&&data.data&&data.data.createdAt;
  if(createdAt){
    return <div>{moment(createdAt).format(Meteor.settings.public.dateFormat)}</div>;
  }
  else {
    return <div></div>
  }
}

const mlAppointmentsTableConfig=new MlViewer.View({
  name:"appointmentTable",
  module:"appointment",//Module name for filter.
  viewType:MlViewerTypes.TABLE,
  extraFields:[],
  fields:["createdAt","userId","profileId", "chapterName", "communityId", "status"],
  searchFields:["createdAt","userId" ,"profileId" , "chapterName", "communityId", "status"],
  throttleRefresh:false,
  pagination:true,//To display pagination
  filter:true,
  asyncExpand: true,
  asyncExpandRowKey: '_id',
  filterComponent: <MlCustomFilter module="appointments" moduleName="appointments" client={client}/>,
  columns:[
    {dataField: "_id",title:"Id",'isKey':true,isHidden:true,selectRow:true},
    {dataField: "appointmentId", title: "Id",dataSort:true,selectRow:true},
    {dataField: "createdBy", title: "CreatedBy",dataSort:true,selectRow:true},
    {dataField: "emailId", title: "EmailId",dataSort:true,selectRow:true},
    {dataField: "source", title: "Source",dataSort:true,selectRow:true},
    {dataField: "transactionType", title: "Transaction Type",dataSort:true,selectRow:true},
    {dataField: "cluster", title: "Cluster",dataSort:true,selectRow:true},
    {dataField: "chapter", title: "Chapter",dataSort:true,selectRow:true},
    {dataField: "subChapter", title: "SubChapter",dataSort:true,selectRow:true},
    {dataField: "community", title: "Community",dataSort:true,selectRow:true},
    {dataField: "createdAt", title: "Date & Time",dataSort:true,selectRow:true, customComponent:createdateFormatter},
    {dataField: "status", title: "Status",dataSort:true,selectRow:true}
  ],
  tableHeaderClass:'react_table_head',
    isExpandableRow:(row)=>{return true;},
    expandComponent:MlAppointmentsDetailsComponent,
    showActionComponent:false,
    actionConfiguration:[],
    graphQlQuery:
  gql`query ContextSpecSearch($offset: Int, $limit: Int,$searchSpec:SearchSpec,$fieldsData:[GenericFilter],$sortData: [SortFilter]){
                data:ContextSpecSearch(module:"appointment" ,offset:$offset, limit:$limit,searchSpec:$searchSpec,fieldsData:$fieldsData,sortData:$sortData){
                totalRecords
                data{
                  ...on AppointmentAdmin{
                        _id
                        appointmentId
                        createdBy
                        emailId
                        source
                        transactionType
                        cluster
                        chapter
                        subChapter
                        community
                        createdAt
                        status
                  }
                }
             }
          }`
    });

export {mlAppointmentsTableConfig};

// $context:ContextParams
// context:$context,
