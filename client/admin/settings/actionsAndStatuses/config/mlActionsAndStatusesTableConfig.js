import {MlViewer,MlViewerTypes} from "../../../../../lib/common/mlViewer/mlViewer";
import React from 'react';
import gql from 'graphql-tag'
import moment from 'moment'
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

function dateFormatter (data){
  let createdDateTime=data&&data.data&&data.data.date;
  return <div>{moment(createdDateTime).format(Meteor.settings.public.dateFormat)}</div>;
}
const mlActionsAndStatueseTableConfig=new MlViewer.View({
  name:"roleTypeTable",
  module:"actionAndStatus",//Module name for filter.
  viewType:MlViewerTypes.TABLE,
  extraFields:[],
  fields:["processId","isActive","process"],
  searchFields:["processId","process","isActive"],
  throttleRefresh:false,
  pagination:true,//To display pagination
  selectRow:true,  //Enable checkbox/radio button to select the row.
  columns:[

    {dataField: "createdAt", title: "Created Date",dataSort:true,customComponent:dateFormatter},
    {dataField: "id",title:"Id",'isKey':true,isHidden:true},
    {dataField: "processName", title: "Process",dataSort:true},
    {dataField: "subProcessName", title: "Sub-Process",dataSort:true},
    {dataField: "clusterName", title: "Cluster"},
    {dataField:"chapterName", title:"Chapter"},
    {dataField:"subChapterName", title:"Sub Chapter"},
    {dataField:"createdBy", title:"Created By"},
    {dataField:"updatedBy", title:"Modified By"},
    {dataField:"updatedAt", title:"Modified Data",dataSort:true,customComponent:dateFormatter},

  ],
  tableHeaderClass:'react_table_head',
  showActionComponent:true,
  actionConfiguration:[
    {
      actionName: 'edit',
      showAction: true,
      handler: (data)=>{
        console.log(data);
        if(data){
          FlowRouter.go("/admin/settings/editActionsAndStatuses/"+data.id);
        }
      }
    },
    {
      showAction: true,
      actionName: 'add',
      handler: (data)=>{
        FlowRouter.go("/admin/settings/addActionsAndStatuses");
      }
    },
    {
      showAction: true,
      actionName: 'logout',
      handler: (data)=>{
        FlowRouter.go("/admin/settings/addActionsAndStatuses");
      }
    },
    {
      showAction: true,
      actionName: 'assign',
      handler: (data)=>{
        FlowRouter.go("/admin/settings/addActionsAndStatuses");
      }
    },
    {
      showAction: true,
      actionName: 'save',
      handler: (data)=>{
        FlowRouter.go("/admin/settings/addActionsAndStatuses");
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
                data:SearchQuery(module:"actionAndStatus", offset: $offset, limit: $limit, fieldsData: $fieldsData, sortData: $sortData){
                      totalRecords
                      data{
                       ...on ActionAndStatusType{
                              id: _id,
                              processName,
                              subProcessName,
                              clusterName,
                              chapterName,
                              subChapterName,
                              createdAt,
                              updatedAt,
                              createdBy,
                              updatedBy
                            }
                        }
                }
               }
              `
});

export {mlActionsAndStatueseTableConfig};
