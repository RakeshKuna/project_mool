import {MlViewer, MlViewerTypes} from "../../../../../lib/common/mlViewer/mlViewer";
import React from "react";
import gql from "graphql-tag";
import moment from "moment";
function stateFormatter(data){
  let processmapping = [];
  processmapping=data&&data.data&&data.data.states?data.data.states:[];
  if(processmapping.length>0){
    return <div>{processmapping.join()}</div>;
  }else{
    return <div>All</div>;
  }

}
function chapterFormatter(data){
  let processmapping = [];
  processmapping=data&&data.data&&data.data.chapters?data.data.chapters:[];
  if(processmapping.length>0){
    return <div>{processmapping.join()}</div>;
  }else{
    return <div>All</div>;
  }

}
function clusterFormatter(data){
  let processmapping = [];
  processmapping=data&&data.data&&data.data.clusters?data.data.clusters:[];
  if(processmapping.length>0){
    return <div>{processmapping.join()}</div>;
  }else{
    return <div>All</div>;
  }

}
function professionFormatter(data){
  let processmapping = [];
  processmapping=data&&data.data&&data.data.clusters?data.data.professions:[];
  if(processmapping.length>0){
    return <div>{processmapping.join()}</div>;
  }else{
    return <div>All</div>;
  }

}
function  communityFormatter(data) {
  let processmapping = [];
  processmapping=data&&data.data&&data.data.clusters?data.data.communities:[];
  if(processmapping.length>0){
    return <div>{processmapping.join()}</div>;
  }else{
    return <div>All</div>;
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

function createdateFormatter (data){
  let createdDate=data&&data.data&&data.data.createdDate;
  if(createdDate){
    return <div>{moment(createdDate).format(Meteor.settings.public.dateFormat)}</div>;
  }
  else {
    return <div></div>
  }
}
const mlProcessTableConfig=new MlViewer.View({
  name:"roleTypeTable",
  module:"processmapping",//Module name for filter.
  viewType:MlViewerTypes.TABLE,
  extraFields:[],
  fields:["processId","isActive","process"],
  searchFields:["processId","process","isActive"],
  throttleRefresh:false,
  pagination:true,//To display pagination
  selectRow:true,  //Enable checkbox/radio button to select the row.
  columns:[
    {dataField: "id",title:"Id",'isKey':true,isHidden:true},
    {dataField: "processId", title: "Id",dataSort:true},
    {dataField: "processName", title: "Process",dataSort:true},
     {dataField: "communities", title: "Community",dataSort:true,customComponent:communityFormatter},
    {dataField: "industries", title:"Industry",dataSort:true},
    {dataField: "professions", title:"Profession",dataSort:true,customComponent:professionFormatter},
    {dataField: "identity", title: "Identity", dataSort: true},
    {dataField: "userTypeNamesString", title: "User-Type", dataSort: true},
    {dataField: "clusters", title: "Cluster",dataSort:true,customComponent:clusterFormatter},
    {dataField: "states", title: "State",dataSort:true,customComponent:stateFormatter},
    {dataField:"chapters", title:"Chapter",dataSort:true,customComponent:chapterFormatter},
    {dataField: "subChapterNamesString", title: "Sub-Chapter", dataSort: true},
    {dataField: "createdBy", title: "Created By",dataSort:true},
    {dataField: "createdDate", title: "CreatedDate And Time",dataSort:true,customComponent:createdateFormatter},
    {dataField: "updatedBy", title: "Updated By",dataSort:true},
    {dataField: "updatedDate", title: "Updated Date",dataSort:true,customComponent:updatedateFormatter},
    {dataField: "isActive", title: "Status",dataSort:true}
  ],
  tableHeaderClass:'react_table_head',
  showActionComponent:true,
  actionConfiguration:[
    {
      actionName: 'edit',
      showAction: true,
      handler: (data)=>{
        if(data && data.id){
          FlowRouter.go("/admin/settings/documentProcess/editProcess/"+data.id);
        } else{
          toastr.error("Please select a Process Type");
        }
      }
    },
    {
      showAction: true,
      actionName: 'add',
      handler: (data)=>{
        if(data&&data.id){
          toastr.error("Please uncheck the record")
        }else {
          FlowRouter.go("/admin/settings/documentProcess/addProcess")
        }
      }
    }
  ],
  graphQlQuery:gql`
               query SearchQuery($offset: Int, $limit: Int, $fieldsData: [GenericFilter], $sortData: [SortFilter]) {
                data: SearchQuery(module: "processmapping", offset: $offset, limit: $limit, fieldsData: $fieldsData, sortData: $sortData) {
                  totalRecords
                  data {
                    ... on ProcessType {
                      id: _id
                      processId
                      process
                      processName
                      isActive
                      communities
                      industries
                      professions
                      clusters
                      states
                      chapters
                      createdBy
                      createdDate
                      updatedBy
                      updatedDate
                      identity
                      userTypeNamesString
                      subChapterNamesString
                    }
                  }
                }
              }

              `
});

export {mlProcessTableConfig};
