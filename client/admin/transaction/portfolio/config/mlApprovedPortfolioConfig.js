import {MlViewer,MlViewerTypes} from "../../../../../lib/common/mlViewer/mlViewer";
import React from 'react';
import gql from 'graphql-tag'
import MlCustomFilter from '../../../../commons/customFilters/customFilter';
import moment from "moment";
import {client} from '../../../core/apolloConnection';

function dateFormatter (cell,data){
  let createdDateTime=data&&data.transactionUpdatedDate?data.transactionUpdatedDate:null;
  let dateVal=createdDateTime?moment(createdDateTime).format(Meteor.settings.public.dateFormat):'';
  return dateVal;
}

const mlApprovedPortfolioTableConfig=new MlViewer.View({
  name:"portfolioInfoTable",
  module:"portfolioDetails",//Module name for filter.
  viewType:MlViewerTypes.TABLE,
  extraFields:[],
  fields:["firstName","lastName"],
  searchFields:["registrationInfo.firstName","registrationInfo.lastName"],
  throttleRefresh:false,
  pagination:true,//To display pagination
  selectRow:true,  //Enable checkbox/radio button to select the row.
  filter:true,
  filterComponent: <MlCustomFilter module="portfolio" moduleName="portfolio" client={client} />,
  columns:[
    {dataField: "id",title:"Id",'isKey':true,isHidden:true},
   /* {dataField: "firstName", title: "Date & Time",dataSort:true},
    {dataField: "lastName", title: "Requested Id",dataSort:true},
    {dataField: "firstName", title: "Transaction Type",dataSort:true},
    {dataField: "firstName", title: "Name",dataSort:true},
    {dataField: "lastName", title: "Contact No",dataSort:true},
    {dataField: "lastName", title: "Community",dataSort:true},
    {dataField: "firstName", title: "Cluster",dataSort:true},
    {dataField: "lastName", title: "Chapter",dataSort:true},
    {dataField: "lastName", title: "SubChapter",dataSort:true},
    {dataField: "firstName", title: "Subscription Type",dataSort:true},
    {dataField: "lastName", title: "Source",dataSort:true},
    {dataField: "lastName", title: "Created By",dataSort:true},
    {dataField: "lastName", title: "Status",dataSort:true},
    {dataField: "lastName", title: "Assign",dataSort:true},*/
    {dataField: "portfolioId", title: "Portfolio Id",dataSort:true},
    {dataField: "transactionUpdatedDate", title: "Last Updated Date",dataSort:true,useCustomComponent:true,customComponent:dateFormatter},
    {dataField: "transactionType", title: "Transaction Type",dataSort:true},
    {dataField: "portfolioUserName", title: "Name",dataSort:true},
    {dataField: "contactNumber", title: "Contact No",dataSort:true},
    {dataField: "communityType", title: "Community",dataSort:true},
    {dataField: "clusterName", title: "Cluster",dataSort:true},
    {dataField: "chapterName", title: "Chapter",dataSort:true},
    {dataField: "subChapterName", title: "SubChapter",dataSort:true},
    {dataField: "accountType", title: "Account Type",dataSort:true},
    {dataField: "source", title: "Source",dataSort:true},
    {dataField: "createdBy", title: "Created By",dataSort:true},
    {dataField: "status", title: "Status",dataSort:true},
    {dataField: "allocationStatus", title: "Allocation Status",dataSort:true},
    {dataField: "assignedTo", title: "Assign",dataSort:true},
  ],
  tableHeaderClass:'react_table_head',
  showActionComponent:true,
  actionConfiguration:[
    {
      actionName: 'edit',
      showAction: true,
      handler: (data)=>{

        if(data && data.id){
          FlowRouter.go("/admin/transactions/portfolio/editRequests/"+data.id+"/"+data.communityType);
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
          alert("Please select a record");
        }
      }
    }
  ],
  graphQlQuery:/*gql`
              query SearchQuery($offset: Int, $limit: Int, $fieldsData: [GenericFilter], $sortData: [SortFilter]){
              data:SearchQuery(module:"registrationInfo", offset: $offset, limit: $limit, fieldsData: $fieldsData, sortData: $sortData){
                    totalRecords
                    data{
                     ...on RegistrationInfo{
                              firstName
                              lastName
                              id:_id
                          }
                      }
              }
              }
              `*/
    gql`query ContextSpecSearch($offset: Int, $limit: Int,$searchSpec:SearchSpec,$fieldsData:[GenericFilter],$sortData: [SortFilter]){
                    data:ContextSpecSearch(module:"portfolioApproved",offset:$offset,limit:$limit,searchSpec:$searchSpec,fieldsData:$fieldsData,sortData:$sortData){
                    totalRecords
                    data{
                      ...on Portfoliodetails{
                          id:_id
                          portfolioId
                          transactionType,
                          portfolioUserName,
                          contactNumber
                          communityType
                          clusterName
                          chapterName
                          subChapterName
                          accountType
                          source
                          createdBy
                          transactionUpdatedDate
                          status
                          assignedTo
                          allocationStatus
                     }
                      }
              }
              }`
});

export {mlApprovedPortfolioTableConfig};
