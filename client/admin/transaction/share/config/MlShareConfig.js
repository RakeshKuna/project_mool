import {MlViewer, MlViewerTypes} from "../../../../../lib/common/mlViewer/mlViewer";
import React from 'react';
import gql from 'graphql-tag'
import MlShareDetailsComponent from '../component/MlShareDetailsComponent'
import MlCustomFilter from '../../../../commons/customFilters/customFilter';
import {client} from '../../../core/apolloConnection';
import moment from "moment";

function createdateFormatter(data) {
  let createdAt = data && data.data && data.data.createdAt;
  if (createdAt) {
    return <div>{moment(createdAt).format(Meteor.settings.public.dateFormat)}</div>;
  }
  else {
    return <div></div>
  }
}

const mlShareTableConfig = new MlViewer.View({
  name: "ShareTable",
  module: "share",//Module name for filter.
  viewType: MlViewerTypes.TABLE,
  extraFields: [],
  fields: ["createdBy", "email", "transactionType", "cluster", "chapter", "subChapter", "community", "status"],
  searchFields: ["createdBy", "email", "transactionType", "cluster", "chapter", "subChapter", "community", "status"],
  throttleRefresh: false,
  pagination: true,//To display pagination
  filter: true,
  filterComponent: <MlCustomFilter module="share" moduleName="share" client={client}/>,
  columns: [
    {dataField: "_id", title: "Id", 'isKey': true, selectRow: true},
    {dataField: "createdBy", title: "Created By", dataSort: true, selectRow: true},
    {dataField: "email", title: "Email", dataSort: true, selectRow: true},
    {dataField: "transactionType", title: "Transaction Type", dataSort: true, selectRow: true},
    {dataField: "cluster", title: "Cluster", dataSort: true, selectRow: true},
    {dataField: "chapter", title: "Chapter", dataSort: true, selectRow: true},
    {dataField: "subChapter", title: "Sub Chapter", dataSort: true, selectRow: true},
    {dataField: "community", title: "Community", dataSort: true, selectRow: true},
    {
      dataField: "createdAt",
      title: "Created Date",
      selectRow: true,
      dataSort: true,
      customComponent: createdateFormatter
    },
    // {dataField: "profileId", title: "UserId",dataSort:true,selectRow:true},
    {dataField: "", title: "Status", dataSort: true, selectRow: true}
  ],
  tableHeaderClass: 'react_table_head',
  isExpandableRow: (row) => {
    return true;
  },
  expandComponent: MlShareDetailsComponent,
  showActionComponent: false,
  actionConfiguration: [],
  graphQlQuery:
    gql`query ContextSpecSearch($offset: Int, $limit: Int,$searchSpec:SearchSpec,$fieldsData:[GenericFilter],$sortData: [SortFilter]){
                    data:ContextSpecSearch(module:"share",offset:$offset, limit:$limit,searchSpec:$searchSpec,fieldsData:$fieldsData,sortData:$sortData){
                    totalRecords
                    data{
                      ...on AdminShareList{
                          _id
                          createdAt
                          createdBy
                          userId
                          profileId
                          email
                          mobileNumber
                          cluster
                          chapter
                          subChapter
                          community
                          transactionType
                        }
                     }        
                   }
             }`
});

export {mlShareTableConfig};

// $context:ContextParams
// context:$context,
