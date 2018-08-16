/**
 * Created by vishwadeep on 18/6/17.
 */
import {MlViewer, MlViewerTypes} from "../../../../lib/common/mlViewer/mlViewer";
import React from "react";
import moment from "moment";
import gql from "graphql-tag";
import MlGenericTransactionAccordion from '../../commons/components/transactionAccordion/MlGenericTransactionAccordion'

function dateFormatter(cell, data) {
  let createdDateTime = data && data.createdAt ? data.createdAt : null;
  return createdDateTime ? moment(createdDateTime).format(Meteor.settings.public.dateFormat) : '';
}

const mlMyTransactionTableConfig = new MlViewer.View({
  name: "MyTransactionTable",
  module: "myTransaction",//Module name for filter.
  viewType: MlViewerTypes.TABLE,
  extraFields: [],
  fields: ['transactionId', 'transactionType', 'clusterName', 'chapterName', 'communityName', 'status'],
  searchFields: ['transactionId', 'transactionType', 'clusterName', 'chapterName', 'communityName', 'status'],
  throttleRefresh: false,
  pagination: true,//To display pagination
  selectRow: false,  //Enable checkbox/radio button to select the row.
  isExpandableRow: (row) => {
    return true;
  },
  asyncExpand: true,
  asyncExpandRowKey: '_id',
  expandComponent: MlGenericTransactionAccordion,
  columns: [
    {dataField: "_id", title: "_id", 'isKey': true, isHidden: true},
    {dataField: "transactionId", title: "Transaction Id", dataSort: true},
    {dataField: "email", title: "Email", dataSort: true},
    {dataField: "transactionType", title: "Transaction Type", dataSort: true},
    {dataField: "activity", title: "Activity Type", dataSort: true},
    {dataField: "cluster", title: "Cluster", dataSort: true},
    {dataField: "chapter", title: "Chapter", dataSort: true},
    {dataField: "subChapter", title: "Sub Chapter", dataSort: true},
    {dataField: "community", title: "Community", dataSort: true},
    {
      dataField: "createdAt",
      title: "Date Time",
      dataSort: true,
      useCustomComponent: true,
      customComponent: dateFormatter
    },
    {dataField: "status", title: "Status", dataSort: true}
  ],
  tableHeaderClass: 'react_table_head',
  showActionComponent: false,
  actionConfiguration: [],
  graphQlQuery: gql` query SearchQuery($offset: Int, $limit: Int, $fieldsData: [GenericFilter], $sortData: [SortFilter]) {
                        data: SearchQuery(module: "userTransaction", offset: $offset, limit: $limit, fieldsData: $fieldsData, sortData: $sortData) {
                          totalRecords
                          data {
                            ... on myTransaction {
                                _id
                                transactionId
                                cluster
                                chapter
                                subChapter
                                community
                                transactionType
                                transactionTypeId
                                createdby
                                email
                                userId
                                createdAt
                                status
                                mobileNumber
                                activity
                                fromProfileId
                                activityDocId
                                docId
                            }
                          }
                        }
                        }`
})

export {mlMyTransactionTableConfig};
