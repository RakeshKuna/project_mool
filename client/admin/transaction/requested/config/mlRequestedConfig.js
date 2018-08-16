import {MlViewer, MlViewerTypes} from "../../../../../lib/common/mlViewer/mlViewer";
import React from "react";
import gql from "graphql-tag";
import MlCustomFilter from "../../../../commons/customFilters/customFilter";
import moment from "moment";
import hierarchyValidations from "../../../../commons/containers/hierarchy/mlHierarchyValidations"
import {validateTransaction} from '../actions/assignUserforTransactionAction'
import MlAssignComponent from '../component/MlAssignComponent'
import {client} from '../../../core/apolloConnection';

function dateFormatter(data) {
  let createdDateTime = data && data.data && data.data.registrationDate ? data.data.registrationDate : null;
  return <div>{createdDateTime && moment(createdDateTime).format(Meteor.settings.public.dateFormat)}</div>;
}

function updatedDateFormatter(data) {
  let createdDateTime = data && data.data && data.data.transactionUpdatedDate ? data.data.transactionUpdatedDate : null;
  return <div>{createdDateTime && moment(createdDateTime).format(Meteor.settings.public.dateFormat)}</div>;
}

export function registrationRowClassNameFormat(row, rowIdx) {
  let status = row.registrationStatus;
  var rowClassName = '';
  switch (status) {
    case 'REG_EMAIL_P':
      rowClassName = 'ml_green';
      break;
    case 'REG_EMAIL_V':
      rowClassName = 'ml_red';
      break;
    case 'REG_KYC_U_PEND':
      rowClassName = 'ml_red';
      break;
    case 'REG_PORT_PEND':
      rowClassName = 'ml_orange';
      break;
  }
  return rowClassName;
}


const mlUserTypeTableConfig = new MlViewer.View({
  name: "registrationInfoTable",
  module: "registrationInfo",//Module name for filter.
  viewType: MlViewerTypes.TABLE,
  extraFields: [],
  fields: ["registrationInfo.clusterName", "registrationInfo.chapterName", "registrationInfo.subChapterName", "status", "registrationInfo.firstName", "registrationInfo.lastName"],
  fields: ["registrationInfo.firstName", "registrationInfo.lastName"],
  searchFields: ["registrationInfo.clusterName", "registrationInfo.chapterName", "registrationInfo.subChapterName", "status", "registrationInfo.firstName", "registrationInfo.lastName"],
  throttleRefresh: false,
  pagination: true,//To display pagination
  selectRow: true,  //Enable checkbox/radio button to select the row.
  filter: true,
  multiSelect: true,
  filterComponent: <MlCustomFilter module="registration" moduleName="registration" client={client}/>,
  fieldsMap: {
    'registrationDate': 'registrationInfo.registrationDate',
    'firstName': 'registrationInfo.firstName',
    'contactNumber': 'registrationInfo.contactNumber',
    'communityName': 'registrationInfo.communityName',
    'clusterName': 'registrationInfo.clusterName',
    'chapterName': 'registrationInfo.chapterName',
    'accountType': 'registrationInfo.accountType',
    'assignedUser': 'registrationInfo.assignedUser',
    'subChapterName': 'registrationInfo.subChapterName',
    'email': 'registrationInfo.email',
    'registrationId': 'registrationInfo.registrationId',
    'allocationStatus': 'registrationInfo.allocationStatus'
  },
  columns: [
    {dataField: "id", title: "Id", 'isKey': true, isHidden: true},
    {dataField: "registrationId", title: "Transaction ID", dataSort: true},
    {dataField: "createdBy", title: "Created By", dataSort: true},
    {dataField: "email", title: "Email Id", dataSort: true},
    {dataField: "clusterName", title: "Cluster", dataSort: true},
    {dataField: "chapterName", title: "Chapter", dataSort: true},
    {dataField: "subChapterName", title: "SubChapter", dataSort: true},
    {dataField: "communityName", title: "Community", dataSort: true},
    //{dataField: "registrationDate", title: "Date",dataSort:true,customComponent:dateFormatter},
    {
      dataField: "transactionUpdatedDate",
      title: "Last UpdatedDate",
      dataSort: true,
      customComponent: updatedDateFormatter
    },
    {dataField: "registrationStatus", title: "Status", dataSort: true},
    {dataField: "allocationStatus", title: "Allocation Status", dataSort: true},
    {dataField: "assignedUser", title: "Assignto", dataSort: true},
  ],
  tableHeaderClass: 'react_table_head',
  trClassName: registrationRowClassNameFormat,
  showActionComponent: true,

  actionConfiguration: [
    {
      actionName: 'edit',
      showAction: true,
      handler: async (data) => {
        let list = data
        if (!list || list.length == 0) {
          toastr.error("Please Select a record");
        } else if (list && list.length > 1) {
          toastr.error("Multiple records cannot be edited, Please select a record");
        } else {
          let response = await validateTransaction(data.registrationId, "MlRegistration", data[0].assignedUserId);
          if (response.success === true) {
            FlowRouter.go("/admin/transactions/editRequests/" + data[0].id);
          } else {
            toastr.error("User does not have access to edit record");
          }
        }
      }
    },
    {
      showAction: true,
      actionName: 'assign',
      hasPopOver: true,
      popOverTitle: 'Assign Registration',
      placement: 'top',
      target: 'registrationAssign',
      popOverComponent: <MlAssignComponent/>,
      actionComponent: function (props) {
        return <div className={props.activeClass} id={props.actionName}>
          <div onClick={props.onClickHandler} className={props.activesubclass} data-toggle="tooltip"
               title={props.actionName} data-placement="top">
            <span className={props.iconClass} id={props.target}></span>
          </div>
        </div>;
      }
    }
  ],
  graphQlQuery:
    gql`query ContextSpecSearch($offset: Int, $limit: Int,$searchSpec:SearchSpec,$fieldsData:[GenericFilter],$sortData: [SortFilter]){
                    data:ContextSpecSearch(module:"registrationInfo",offset:$offset,limit:$limit,searchSpec:$searchSpec,fieldsData:$fieldsData,sortData:$sortData){
                    totalRecords
                    data{
                      ...on RegistrationInfo{
                              registrationId
                              firstName
                              lastName
                              id:_id
                              contactNumber
                              communityName
                      			  clusterName
                      			  clusterId
                      			  chapterId
                      			  subChapterId
                      			  communityId
                      				chapterName
                              subChapterName
                              email
                              accountType
                      				source
                              assignedUser
              								registrationStatus
                      				registrationDate
                              transactionId                              
                              assignedUserId
                              allocationStatus
                              createdBy
                              transactionUpdatedDate
                          }
                      }
              }
              }`
});

export {mlUserTypeTableConfig};
