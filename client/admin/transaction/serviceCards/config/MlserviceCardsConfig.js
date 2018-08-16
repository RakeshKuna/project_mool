/** ************************************************************
 * Date: 19 Jun, 2017
 * Programmer: Mukhil <mukhil.padnamanabhan@raksan.in>
 * Description : This is the list view
 * JavaScript XML file MlserviceCardsList.jsx
 * *************************************************************** */

/**
 * Imports libs and components
 */
import moment from "moment";
import {MlViewer,MlViewerTypes} from "../../../../../lib/common/mlViewer/mlViewer";
import React from 'react';
import gql from 'graphql-tag'
import MlServiceCardsDetailsComponent  from '../component/MlserviceCardsDetailsComponent'
import MlCustomFilter from '../../../../commons/customFilters/customFilter';
import {client} from '../../../core/apolloConnection';


function createdateFormatter (data){
  let createdAt=data&&data.data&&data.data.updatedAt;
  if(createdAt){
    return <div>{moment(createdAt).format(Meteor.settings.public.dateFormat)}</div>;
  }
  else {
    return <div></div>
  }
}
function updatedateFormatter (data){
  let updateDate=data&&data.data&&data.data.updatedDate;
  if(updateDate){
    return <div>{moment(updateDate).format(Meteor.settings.public.dateFormat)}</div>;
  }
  else {
    return <div></div>
  }
}

const mlProcessSetupRequestsTableConfig=new MlViewer.View({
  name:"ProcessSetupTable",
  module:"processSetup",//Module name for filter.
  viewType:MlViewerTypes.TABLE,
  extraFields:[],
  fields:["createdAt","userId","profileId", "chapterName", "communityId", "status","transactionId"],
  searchFields:["createdAt","userId" ,"profileId" , "chapterName", "communityId", "status","transactionId"],
  throttleRefresh:false,
  pagination:true,//To display pagination
  filter:true,
  filterComponent: <MlCustomFilter module="serviceCards" moduleName="serviceCards" client={client}/>,
  columns:[
    {dataField: "_id",title:"Id",'isKey':true,isHidden:true,selectRow:true},
    {dataField: "transactionId",title:"Transaction Id",dataSort:true,selectRow:true},
    {dataField: "updatedAt", title: "Date & Time",dataSort:true,selectRow:true, customComponent:createdateFormatter},
    {dataField: "profileId", title: "UserId",dataSort:true,selectRow:true},
    {dataField: "profileId", title: "Profile Id",dataSort:true,selectRow:true},
    //{dataField: "service", title: "Transaction Type",dataSort:true,selectRow:true},
    {dataField: "userDetails.clusterName", title: "Cluster",dataSort:true,selectRow:true,customComponent:function(data){ return <div>{data.data.userDetails.clusterName}</div>}},
    {dataField: "userDetails.chapterName", title: "Scope",dataSort:true,selectRow:true,customComponent:function(data){ return <div>{data.data.userDetails.chapterName}</div>}},
    {dataField: "userDetails.subChapterName", title: "SubChapter",dataSort:true,selectRow:true,customComponent:function(data){ return <div>{data.data.userDetails.subChapterName}</div>}},
    {dataField: "userDetails.communityName", title: "Community",dataSort:true,selectRow:true, customComponent:function(data){ return <div>{data.data.userDetails.communityName}</div>}},
    {dataField: "status", title: "Status",dataSort:true,selectRow:true},
    {dataField: "service", title: "Action",dataSort:true,selectRow:true},
    {dataField: "service", title: "Progress",dataSort:true,selectRow:true},
    {dataField: "service", title: "Assignee",dataSort:true,selectRow:true}
  ],
  tableHeaderClass:'react_table_head',
  isExpandableRow:(row)=>{return true;},
  expandComponent:MlServiceCardsDetailsComponent,
  showActionComponent:false,
  actionConfiguration:[
    {
      actionName: 'add',
      showAction: true,
      handler: (data)=>{

      }
    }
  ],
  graphQlQuery:
    gql`query ContextSpecSearch($offset: Int, $limit: Int,$searchSpec:SearchSpec,$fieldsData:[GenericFilter],$sortData: [SortFilter]){
                    data:ContextSpecSearch(module:"serviceCard",offset:$offset, limit:$limit,searchSpec:$searchSpec,fieldsData:$fieldsData,sortData:$sortData){
                    totalRecords
                    data{
                      ...on AdminService{
                            userId
                            email
                            _id
                            profileId
                            name
                            displayName
                            noOfSession
                            sessionFrequency
                            finalAmount
                            transactionId
                            status
                            tasks{
                              id
                              sequence
                              sessions{
                                id
                                sequence
                              }
                            }
                            facilitationCharge{
                              type
                              amount
                            }
                            termsAndCondition{
                              isCancelable
                              noOfDaysBeforeCancelation
                              isReschedulable
                              noOfReschedulable
                            }
                            attachments{
                              name
                              info
                              isMandatory
                            }
                            payment {
                              isDiscount
                              discountType
                              discountValue
                              isTaxInclusive
                              isPromoCodeApplicable
                              tasksAmount
                              tasksDiscount
                              tasksDerived
                            }
                            createdAt
                            updatedAt
                            validTill
                            isBeSpoke 
                            mode 
                            cluster{
                              id
                              name
                            }
                            state{
                              id
                              name
                            }
                            city{
                              id
                              name
                            }
                            community{
                              id
                              name
                             }
                             duration{
                              hours
                              minutes
                             }
                            userDetails{
                              chapterName
                              clusterName
                              communityName
                              mobileNumber
                              subChapterName
                            }
                            deviceDetails{
                              deviceName
                              ipAddress
                              deviceId
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
