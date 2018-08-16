/**
 * Created by Rajat on 4/8/17.
 */
import {MlViewer,MlViewerTypes} from "../../../../lib/common/mlViewer/mlViewer";
import MlUsersTransactionDetails from '../components/MlUsersTransactionDetailsComponent';
import React from 'react';
import gql from 'graphql-tag'
import moment from 'moment'

function dateFormatter (data){
  let createdDateTime=data&&data.data&&data.data.createdAt;
  return <div>{moment(createdDateTime).format(Meteor.settings.public.dateFormat)}</div>;
}

const mlUserTransactions=new MlViewer.View({
  name:"userTransactionList",
  module:"userTransaction",//Module name for filter.
  moduleName:"userTransaction",
  viewType:MlViewerTypes.TABLE,
  extraFields:[],
  fields:['profileId','userName','transactionId','clusterName','chapterName','subChapterName','communityName'],
  searchFields:['profileId','userName','transactionId','clusterName','chapterName','subChapterName','communityName'],
  throttleRefresh:false,
  pagination:true,//To display pagination
  selectRow:true,  //Enable checkbox/radio button to select the row.
  // isExpandableRow:(row)=>{return true;},
  // expandComponent:MlUsersTransactionDetails,
  columns:[
    {dataField: "transactionId",title:"Id",'isKey':true,isHidden:true},
    {dataField: "createdAt", title: "Date & Time",dataSort:true,customComponent:dateFormatter},
    {dataField: "transactionId", title: "Requested Id",dataSort:true},
    {dataField: "transactionType", title: "Requested Type",dataSort:true},
    {dataField: "cluster", title: "Cluster"},
    {dataField:"chapter", title:"Chapter"},
    {dataField:"community", title:"Community"},
    {dataField:"lastActionBy", title:"Last Action By"},
    {dataField:"status", title:"Status"},
  ],
  tableHeaderClass:'react_table_head',
  showActionComponent:false,
  queryOptions:true,
  buildQueryOptions:(config)=>{
    return {context:{registrationId:config&&config.registrationId?config.registrationId:null}}
  },
  actionConfiguration:[],
  graphQlQuery:gql`query ContextSpecSearch($context:ContextParams $offset: Int, $limit: Int,$searchSpec:SearchSpec,$fieldsData:[GenericFilter],$sortData: [SortFilter]){
                    data:ContextSpecSearch(module:"userTransaction", context:$context, offset:$offset,limit:$limit,searchSpec:$searchSpec,fieldsData:$fieldsData,sortData:$sortData){
                    totalRecords
                    data{
                      ... on myTransaction {
                            status          
                            transactionId          
                            transactionType    
                            createdAt
                            cluster               
                            chapter               
                            subChapter            
                            community
                      }
                    }
              }
              }`
});

export {mlUserTransactions};
