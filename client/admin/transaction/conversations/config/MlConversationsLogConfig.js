import {MlViewer,MlViewerTypes} from "../../../../../lib/common/mlViewer/mlViewer";
import React from 'react';
import gql from 'graphql-tag';
import moment from "moment";
import MlConversationDetailsComponent from '../component/MlConversationDetailsComponent'
import MlCustomFilter from '../../../../commons/customFilters/customFilter';
import {client} from '../../../core/apolloConnection';

function dateFormatter(data) {
  let createdDateTime = data && data.data && data.data.createdAt;
  createdDateTime = createdDateTime ? createdDateTime: '';
  return <div>{moment(createdDateTime).format(Meteor.settings.public.dateFormat)}</div>;
}

const mlConversationsLogTableConfig=new MlViewer.View({
  name:"TransactionsLogTable",
  module:"ConversationsLog",//Module name for filter.
  viewType:MlViewerTypes.TABLE,
  extraFields:[],
  fields:["createdAt","activity","transactionTypeName", "userName","clusterName", "chapterName", "subChapterName", "communityId"],
  searchFields:["createdAt","activity" ,"transactionTypeName" ,"userName", "clusterName", "chapterName", "subChapterName", "communityId"],
  throttleRefresh:false,
  pagination:true,//To display pagination
  filter:true,
  filterComponent: <MlCustomFilter module="transactionLog" moduleName="transactionLog" client={client} />,
  columns:[
    {dataField: "_id",title:"Id",'isKey':true,isHidden:true,selectRow:true},
    {dataField: "createdAt", title: "Created At",dataSort:true,selectRow:true, customComponent: dateFormatter},
    {dataField: "userName", title: "User Name",dataSort:true,selectRow:true},
    {dataField: "activity", title: "Activity",dataSort:true,selectRow:true},
    {dataField: "transactionDetails", title: "Details",dataSort:true,selectRow:true},
    {dataField: "transactionTypeName", title: "TransactionTypeName",dataSort:true,selectRow:true},
    {dataField: "clusterName", title: "Cluster",dataSort:true,selectRow:true},
    {dataField: "chapterName", title: "Chapter",dataSort:true,selectRow:true},
    {dataField: "subChapterName", title: "Sub Chapter",dataSort:true,selectRow:true},
    {dataField: "communityName", title: "Community",dataSort:true,selectRow:true},
    {dataField: "userAgent",isHidden:true},{dataField: "userId",isHidden:true},{dataField: "emailId",isHidden:true},{dataField: "transactionTypeId",isHidden:true}

  ],
  tableHeaderClass:'react_table_head',
  isExpandableRow:(row)=>{return true;},
  expandComponent:MlConversationDetailsComponent,
  showActionComponent:false,
  // expandableRow:_id,
  actionConfiguration:[],
  queryOptions:true,
  // buildQueryOptions:()=>{
  //   return {userId:"wJyiTdQandDyhcmKY"}
  buildQueryOptions:(config)=>{
    return {context:{transactionTypeName:"conversations"}}
  },
  // },
  graphQlQuery:
  gql`query ContextSpecSearch($context: ContextParams $offset: Int, $limit: Int,$searchSpec:SearchSpec,$fieldsData:[GenericFilter],$sortData: [SortFilter]){
                    data:ContextSpecSearch(module:"ConversationsLog",offset:$offset,context: $context, limit:$limit,searchSpec:$searchSpec,fieldsData:$fieldsData,sortData:$sortData){
                    totalRecords
                    data{
                      ...on TransactionsLog{
                        _id
                        userId
                        userName
                        createdAt
                        activity
                        emailId
                        userAgent{
                        ipAddress
                        browser
                        }
                        transactionTypeName
                        transactionTypeId
                        transactionDetails
                        clusterName     
                        chapterName         
                        subChapterName           
                        communityId  
                        communityName
                        transactionTypeId
                      }
                    }
              }
              }`
});

export {mlConversationsLogTableConfig};

