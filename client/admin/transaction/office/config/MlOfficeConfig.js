/**
 * Created by pankaj on 6/6/17.
 */
import {MlViewer, MlViewerTypes} from "../../../../../lib/common/mlViewer/mlViewer";
import MlOfficeItem from '../component/MlOfficeItem';
import React from 'react';
import gql from 'graphql-tag'
import moment from 'moment'
import MlCustomFilter from "../../../../commons/customFilters/customFilter";
import {client} from '../../../core/apolloConnection';

function dateFormatter(data) {
  let createdDateTime = data && data.data && data.data.dateTime;
  return <div>{moment(createdDateTime).format(Meteor.settings.public.dateFormat)}</div>;
}

function paymentFormatter(data) {
  let isPaid = data && data.data && data.data.paymentDetails && data.data.paymentDetails && data.data.paymentDetails.isPaid ? true : false;
  if (isPaid) {
    return (<div>Paid</div>);
  } else {
    return (<div>Not Paid</div>);
  }
}

export function registrationRowClassNameFormat(row, rowIdx) {
  let status = row.status;
  let paymentDetails = row.paymentDetails;

  if (paymentDetails && paymentDetails.isPaid) {
    paymentDetails = true;
  } else {
    paymentDetails = false;
  }
  var rowClassName = '';

  if (status === 'Payment Received' && paymentDetails) {
    rowClassName = 'ml_red';
  }
  else if (status === 'Payment Generated' && !paymentDetails) {
    rowClassName = 'ml_orange';
  }
  return rowClassName;
}

const mlOfficeTableConfig = new MlViewer.View({
  name: "officeTable",
  module: "office",//Module name for filter.
  viewType: MlViewerTypes.TABLE,
  extraFields: [],
  // fields:['userId','userName','transactionId','clusterName','chapterName','subChapterName','communityName'],
  // searchFields:['userId','userName','transactionId','clusterName','chapterName','subChapterName','communityName'],
  fields: ['profileId', 'userName', 'transactionId', 'clusterName', 'chapterName', 'subChapterName', 'communityName'],
  searchFields: ['profileId', 'userName', 'transactionId', 'clusterName', 'chapterName', 'subChapterName', 'communityName'],
  throttleRefresh: false,
  pagination: true,//To display pagination
  selectRow: false,  //Enable checkbox/radio button to select the row.
  filter: true,
  filterComponent: <MlCustomFilter module="office" moduleName="office" client={client}/>,
  isExpandableRow: (row) => {
    return true;
  },
  expandComponent: MlOfficeItem,
  asyncExpand: true,
  asyncExpandRowKey: 'id',
  columns: [
    {dataField: "dateTime", title: "Date & Time", dataSort: true, customComponent: dateFormatter},
    {dataField: "id", title: "Id", 'isKey': true, isHidden: true},
    // {dataField: "userId", title: "UserId",dataSort:true},
    {dataField: "profileId", title: "UserId", dataSort: true},
    {dataField: "userName", title: "Name", dataSort: true},
    {dataField: "transactionId", title: "Trans Id"},
    {dataField: "clusterName", title: "Cluster"},
    {dataField: "chapterName", title: "Chapter"},
    {dataField: "subChapterName", title: "Sub Chapter"},
    {dataField: "communityName", title: "Community"},
    {dataField: "status", title: "Status"},
    {dataField: "paymentDetails", title: "Payment", customComponent: paymentFormatter},
    {dataField: "updatedAt", title: "Action"},
  ],
  tableHeaderClass: 'react_table_head',
  trClassName: registrationRowClassNameFormat,
  showActionComponent: false,
  actionConfiguration: [],
  graphQlQuery: gql`query ContextSpecSearch($context:ContextParams $offset: Int, $limit: Int,$searchSpec:SearchSpec,$fieldsData:[GenericFilter],$sortData: [SortFilter]){
                    data:ContextSpecSearch(module:"officeTransaction", context:$context, offset:$offset,limit:$limit,searchSpec:$searchSpec,fieldsData:$fieldsData,sortData:$sortData){
                    totalRecords
                    data{
                      ... on officeTransactionType {
                      id: _id
                      userId
                      clusterName
                      chapterName
                      chapterName
                      subChapterName
                      communityName
                      transactionId
                      status
                      userName
                      dateTime
                      profileId
                      paymentDetails{
                        isPaid
                      }
                    }
                    }
              }
              }`/*gql`
                query SearchQuery($offset: Int, $limit: Int, $fieldsData: [GenericFilter], $sortData: [SortFilter]) {
                data: SearchQuery(module: "officeTransaction", offset: $offset, limit: $limit, fieldsData: $fieldsData, sortData: $sortData) {
                  totalRecords
                  data {
                    ... on officeTransactionType {
                      id: _id
                      userId
                      clusterName
                      chapterName
                      chapterName
                      subChapterName
                      communityName
                      transactionId
                      status
                    }
                  }
                }
              }
              `*/
});

export {mlOfficeTableConfig};
