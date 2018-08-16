import {MlViewer, MlViewerTypes} from "../../../../../lib/common/mlViewer/mlViewer";
import React from 'react';
import gql from 'graphql-tag'
import MlProcessSetupDetailsComponent from '../../processSetup/component/MlProcessSetupDetailsComponent'
import MlCustomFilter from '../../../../commons/customFilters/customFilter';
import {client} from '../../../core/apolloConnection';
import moment from "moment/moment";


function dateFormatter(data) {
  let createdDateTime = data && data.data && data.data.dateTime;
  return <div>{moment(createdDateTime).format(Meteor.settings.public.dateFormat)}</div>;
}

export function registrationRowClassNameFormat(row, rowIdx) {
  let status = row.status;
  var rowClassName = '';
  switch (status) {
    case 'Yet To Start':
      rowClassName = 'ml_orange';
      break;
  }
  return rowClassName;
}


const mlProcessSetupRequestsTableConfig = new MlViewer.View({
  name: "ProcessSetupTable",
  module: "processSetup",//Module name for filter.
  viewType: MlViewerTypes.TABLE,
  extraFields: [],
  fields: ["dateTime", "profileId", "name", "clusterName", "chapterName", "subChapterName", "communityId", "status"],
  searchFields: ["dateTime", "profileId", "name", "clusterName", "chapterName", "subChapterName", "communityId", "status"],
  throttleRefresh: false,
  pagination: true,//To display pagination
  filter: true,
  filterComponent: <MlCustomFilter module="processSetup" moduleName="processSetup" client={client}/>,
  columns: [
    {dataField: "_id", title: "Id", 'isKey': true, isHidden: true, selectRow: true},
    {dataField: "dateTime", title: "Created Date", dataSort: true, selectRow: true, customComponent: dateFormatter},
    {dataField: "profileId", title: "UserId", dataSort: true, selectRow: true},
    {dataField: "name", title: "Name", dataSort: true, selectRow: true},
    {dataField: "transactionId", title: "Transaction Id", dataSort: true, selectRow: true},
    {dataField: "clusterName", title: "Cluster", dataSort: true, selectRow: true},
    {dataField: "chapterName", title: "Chapter", dataSort: true, selectRow: true},
    {dataField: "subChapterName", title: "Sub Chapter", dataSort: true, selectRow: true},
    {dataField: "communityName", title: "Community", dataSort: true, selectRow: true},
    {dataField: "paymentDetails.paymentStatus", title: "Payment", dataSort: true, selectRow: true},
    {dataField: "status", title: "Status", dataSort: true, selectRow: true}
  ],
  tableHeaderClass: 'react_table_head',
  trClassName: registrationRowClassNameFormat,
  isExpandableRow: (row) => {
    return true;
  },
  expandComponent: MlProcessSetupDetailsComponent,
  asyncExpand: true,
  asyncExpandRowKey: '_id',
  showActionComponent: false,
  actionConfiguration: [
    {
      actionName: 'add',
      showAction: true,
      handler: (data) => {

      }
    }
  ],
  graphQlQuery:
    gql`query ContextSpecSearch($offset: Int, $limit: Int,$searchSpec:SearchSpec,$fieldsData:[GenericFilter],$sortData: [SortFilter]){
                    data:ContextSpecSearch(module:"processSetup",offset:$offset, limit:$limit,searchSpec:$searchSpec,fieldsData:$fieldsData,sortData:$sortData){
                    totalRecords
                    data{
                      ...on ProcessTransactions{
                          _id
                          name
                          username
                          userId
                          profileId
                          status
                          transactionId
                          transactionType
                          clusterName
                          chapterName
                          subChapterName
                          communityName
                          dateTime
                          mobileNumber
                          paymentDetails{
                            subscriptionName
                            cost
                            isTaxInclusive
                            about
                            dateTime

                            totalAmountPaid
                            paymentMode
                            cardNumber
                            cardHolderName
                            promotionCode
                            codeAmount
                            promotionStatus
                            voucherCode
                            voucherAmount
                            voucherStatus
                            paymentStatus
                          }
                          deviceDetails{
                            deviceName
                            deviceId
                            ipAddress
                            location
                          }
                      }
                    }
              }
              }`
});

export {mlProcessSetupRequestsTableConfig};

// $context:ContextParams
// context:$context,
