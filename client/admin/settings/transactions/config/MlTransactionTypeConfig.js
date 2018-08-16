import {MlViewer,MlViewerTypes} from "../../../../../lib/common/mlViewer/mlViewer";
import React from 'react';
import gql from 'graphql-tag'
import moment from 'moment'

function dateFormatter (data){
  let createdDateTime=data&&data.data&&data.data.createdDateTime;
  return <div>{moment(createdDateTime).format(Meteor.settings.public.dateFormat)}</div>;
}

const mlTransactionTypeTableConfig=new MlViewer.View({
  name:"transactionTypeTable",
  module:"transactionTypes",//Module name for filter.
  viewType:MlViewerTypes.TABLE,
  extraFields:[],
  fields:["transactionName","transactionDisplayName","isActive"],
  searchFields:["transactionName","transactionDisplayName","isActive"],
  throttleRefresh:false,
  pagination:true,//To display pagination
  selectRow:true,  //Enable checkbox/radio button to select the row.
  columns:[
    {dataField: "id",title:"Id",'isKey':true,isHidden:true},
    {dataField: "transactionName", title: "Transaction Type",dataSort:true},
    {dataField: "transactionDisplayName", title: "Display Name",dataSort:true},
    {dataField: "createdDateTime", title: "Created Date And Time",customComponent:dateFormatter},
    {dataField: "isActive", title: "Active",dataSort:true},
  ],
  tableHeaderClass:'react_table_head',
  showActionComponent:true,
  actionConfiguration:[
    {
      actionName: 'edit',
      showAction: true,
      handler:  (data)=>{
        if(data&&data.id){
          FlowRouter.go("/admin/settings/editTransactionType/"+data.id)
        }
        else{
          toastr.error("Please select a transaction")
        }
      }

    },
    /*{
      showAction: true,
      actionName: 'add',
      handler: (data)=>{
        FlowRouter.go("/admin/settings/addTransactionType")
      }
    },*/
    // {
    //   showAction: true,
    //   actionName: 'logout',
    //   handler: (data)=>{console.log(data);}
    // }
  ],
  sizePerPage:5,
  graphQlQuery:gql`
                query SearchQuery( $offset: Int, $limit: Int, $fieldsData: [GenericFilter], $sortData: [SortFilter]) {
              data:SearchQuery(module:"transactionTypes",offset: $offset, limit: $limit, fieldsData: $fieldsData, sortData: $sortData){
                    totalRecords
                    data{
                     ...on Transaction{
                              transactionName
                              transactionDisplayName
                              createdDateTime
                              isActive
                              id:_id
                          }
                      }
              }
              }
            
              `
});

export {mlTransactionTypeTableConfig};
