import {MlViewer,MlViewerTypes} from "../../../../../lib/common/mlViewer/mlViewer";
import React from 'react';
import gql from 'graphql-tag'
import moment from 'moment'

function createdateFormatter (data){
  let createdDate=data&&data.data&&data.data.createdDate;
  if(createdDate){
    return <div>{moment(createdDate).format(Meteor.settings.public.dateFormat)}</div>;
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
// function dateFormatter (data){
//   let createdDateTime=data&&data.data&&data.data.createdDateTime;
//   return <div>{moment(createdDateTime).format('MM-DD-YYYY, HH:mm:ss')}</div>
// }


const mlDocumentFormatTableConfig=new MlViewer.View({
  name:"documentFormatTable",
  module:"documentFormat",//Module name for filter.
  viewType:MlViewerTypes.TABLE,
  extraFields:[],
  fields:["docFormatName","docFormatDisplayName","isActive","createdDateTime"],
  searchFields:["docFormatName","docFormatDisplayName","isActive","createdDateTime"],
  throttleRefresh:false,
  pagination:true,//To display pagination
  selectRow:true,  //Enable checkbox/radio button to select the row.
  columns:[
    {dataField: "id",title:"Id",'isKey':true,isHidden:true},
    {dataField: "docFormatName", title: "Name",dataSort:true},
    {dataField: "docFormatDisplayName", title: "Display Name",dataSort:true},
    {dataField: "createdBy", title: "Created By",dataSort:true},
    {dataField: "createdDate", title: "CreatedDate And Time",dataSort:true,customComponent:createdateFormatter},
    {dataField: "updatedBy", title: "Updated By",dataSort:true},
    {dataField: "updatedDate", title: "UpdatedDate And Time",dataSort:true,customComponent:updatedateFormatter},
    {dataField: "isActive", title: "Active",dataSort:true},
    // {dataField: "createdDateTime", title: "Created Date And Time",customComponent:dateFormatter},
  ],
  tableHeaderClass:'react_table_head',
  showActionComponent:true,
  actionConfiguration:[
    {
      actionName: 'edit',
      showAction: true,
      handler: (data)=>{
        if(data && data.id){
          FlowRouter.go("/admin/settings/documentProcess/editDocumentFormat/"+data.id);
        } else{
          toastr.error("Please select a document format");
        }
      }
    },
    {
      showAction: true,
      actionName: 'add',
      handler: (data)=>{
        if(data && data.id) {
          toastr.error("Please uncheck the record")
          // FlowRouter.go("/admin/settings/documentFormatList");
        }else{
          FlowRouter.go("/admin/settings/documentProcess/addDocumentFormat")

        }
      }
    },
    // {
    //   showAction: true,
    //   actionName: 'logout',
    //   handler: (data)=>{console.log(data);}
    // }
  ],
  graphQlQuery:gql`
              query SearchQuery($offset: Int, $limit: Int, $fieldsData: [GenericFilter], $sortData: [SortFilter]){
              data:SearchQuery(module:"documentFormat", offset: $offset, limit: $limit, fieldsData: $fieldsData, sortData: $sortData){
                    totalRecords
                    data{
                     ...on DocumentFormats{
                              docFormatName
                              docFormatDisplayName
                              isActive
                              about
                              id:_id
                              createdBy
                              createdDate  
                              updatedBy     
                              updatedDate  
                          }
                      }
              }
              }
              `
});

export {mlDocumentFormatTableConfig};
