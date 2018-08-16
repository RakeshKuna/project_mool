import {MlViewer, MlViewerTypes} from "../../../../../lib/common/mlViewer/mlViewer";
import React from "react";
import gql from "graphql-tag";
import moment from "moment";
import MlCustomFilter from "../../../../commons/customFilters/customFilter";
import {client} from '../../../core/apolloConnection';
function dateFormatter (data){
  let createdDateTime=data&&data.data&&data.data.registrationDate?data.data.registrationDate:null;
  return <div>{createdDateTime&&moment(createdDateTime).format(Meteor.settings.public.dateFormat)}</div>;
}
function updatedDateFormatter(data){
  let createdDateTime=data&&data.data&&data.data.transactionUpdatedDate?data.data.transactionUpdatedDate:null;
  return <div>{createdDateTime&&moment(createdDateTime).format(Meteor.settings.public.dateFormat)}</div>;
}

const mlUserTypeTableConfig=new MlViewer.View({
  name:"registrationInfoTable",
  module:"registrationInfo",//Module name for filter.
  viewType:MlViewerTypes.TABLE,
  extraFields:[],
  fields:["firstName","lastName"],
  searchFields:["registrationInfo.firstName","status","registrationInfo.lastName"],
  throttleRefresh:false,
  pagination:true,//To display pagination
  selectRow:true,  //Enable checkbox/radio button to select the row.
  filter:true,
  filterComponent: <MlCustomFilter module="registration" moduleName="registration" client={client}/>,
  fieldsMap: {
    'registrationDate': 'registrationInfo.registrationDate',
    'firstName': 'registrationInfo.firstName',
    'contactNumber': 'registrationInfo.contactNumber',
    'communityName': 'registrationInfo.communityName',
    'clusterName': 'registrationInfo.clusterName',
    'chapterName': 'registrationInfo.chapterName',
    'subChapterName': 'registrationInfo.subChapterName',
    'accountType': 'registrationInfo.accountType',
    'assignedUser': 'registrationInfo.assignedUser',
    'email':'registrationInfo.email',
    'registrationId':'registrationInfo.registrationId',
    'allocationStatus':'registrationInfo.allocationStatus'
  },
  columns:[
    {dataField: "id",title:"Id",'isKey':true,isHidden:true},
    {dataField: "registrationId",title:"Transaction ID",dataSort:true},
    {dataField: "createdBy", title: "Created By",dataSort:true},
    {dataField: "email", title: "Email Id",dataSort:true},
    {dataField: "clusterName", title: "Cluster",dataSort:true},
    {dataField: "chapterName", title: "Chapter",dataSort:true},
    {dataField: "subChapterName", title: "SubChapter",dataSort:true},
    {dataField: "communityName", title: "Community",dataSort:true},
    //{dataField: "registrationDate", title: "Date",dataSort:true,customComponent:dateFormatter},
    {dataField: "transactionUpdatedDate", title: "Last UpdatedDate",dataSort:true,customComponent:updatedDateFormatter},
    {dataField: "registrationStatus", title: "Status",dataSort:true},
    {dataField: "allocationStatus", title: "Allocation Status",dataSort:true},
    {dataField: "assignedUser", title: "Assignto",dataSort:true},
  ],
  tableHeaderClass:'react_table_head',
  showActionComponent:true,
  actionConfiguration:[
    {
      actionName: 'edit',
      showAction: true,
      handler: (data)=>{

        if(data && data.id){
          FlowRouter.go("/admin/transactions/editApprovedRequests/"+data.id);
        } else{
          toastr.error("Please select a record");
        }
      }
    },
    {
      showAction: false,
      actionName: 'assign',
      handler: (data)=>{
        if(data && data.id){
          const internalConfig=data;
        } else{
          toastr.error("Please select a record");
        }
      }
    }
  ],
  graphQlQuery:
    gql`query ContextSpecSearch($offset: Int, $limit: Int,$searchSpec:SearchSpec,$fieldsData:[GenericFilter],$sortData: [SortFilter]){
                    data:ContextSpecSearch(module:"registrationApprovedInfo",offset:$offset,limit:$limit,searchSpec:$searchSpec,fieldsData:$fieldsData,sortData:$sortData){
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
                      				chapterName
                              subChapterName
                              accountType
                              email
                      				source
                              assignedUser
              								registrationStatus
                      				registrationDate
                      				allocationStatus
                              createdBy
                              transactionUpdatedDate
                          }
                      }
              }
              }`
});

export {mlUserTypeTableConfig};
