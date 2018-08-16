import {MlViewer,MlViewerTypes} from "../../../../../lib/common/mlViewer/mlViewer";
import React from 'react';
import gql from 'graphql-tag'

/*//@for displaying  list of clusters under dep in departments list
function departmentsFormatter (data){

  let departments=data&&data.data&&data.data.clustersList?data.data.clustersList:[];
  if(departments.length>0){
    return <div>{departments.join()}</div>;
  }else{
    return <div>All</div>;
  }

  //return <div>{departments.join()}</div>;
}

//@for displaying chapters under dep in departments list
function chapterFormatter(data){
  let departments = [];
  departments=data&&data.data&&data.data.chaptersList?data.data.chaptersList:[];
  if(departments.length>0){
    return <div>{departments.join()}</div>;
  }else{
    return <div>All</div>;
  }

}

//@for displaying subchapters under dep in departments list
function subChapterFormatter(data){
  let departments=data&&data.data&&data.data.subChapterList?data.data.subChapterList:[];
  if(departments.length>0){
    return <div>{departments.join()}</div>;
  }else{
    return <div>All</div>;
  }
}*/
function updateStatusFormat (data){
  let status=data&&data.data&&data.data.isActive;
  if(status){
    return <div>Active</div>;
  }
  else {
    return <div>InActive</div>
  }
}

const mlFilterTableConfig=new MlViewer.View({
  name:"filterTable",
  module:"filters",//Module name for filter.
  action:"READ",
  viewType:MlViewerTypes.TABLE,
  extraFields:[],
  fields:["filterName","filterDescription","moduleName","isActive"],
  searchFields:["filterName","filterDescription","moduleName","isActive"],
  throttleRefresh:false,
  pagination:true,//To display pagination
  selectRow:true,  //Enable checkbox/radio button to select the row.
  columns:[
    {dataField: "id",title:"Id",'isKey':true,isHidden:true},
    {dataField: "filterName", title: "Filter Name",dataSort:true},
    {dataField: "filterDescription", title: "Filter Description",dataSort:true},
    {dataField: "moduleName", title: "Module Name",dataSort:true},
    {dataField: "isActive", title: "Active",dataSort:true,customComponent:updateStatusFormat}

  ], //@departmentsFormatter,@chapterFormatter,@subChapterFormatter custom functions for looping an array and displaying data in table
  tableHeaderClass:'react_table_head',
  showActionComponent:true,
  actionConfiguration:[
    {
      actionName: 'edit',
      showAction: true,
      handler:  (data)=>{
        if(data&&data.id){
          FlowRouter.go("/admin/settings/editFilter/"+data.id)
        }
        else{
          toastr.error("Please select a filter");
        }
      }

    },
    /*{
      showAction: true,
      actionName: 'add',
      handler: (data)=>{
        if(data&&data.id){FlowRouter.go("/admin/settings/filtersList")}
        else{
          FlowRouter.go("/admin/settings/addFilter")}
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
              data:SearchQuery(module:"filters",offset: $offset, limit: $limit, fieldsData: $fieldsData, sortData: $sortData){
                    totalRecords
                    data{
                     ...on Filters{
                              filterName
                              filterDescription
                              moduleName
                              isActive
                              id:_id
                          }
                      }
              }
              }
              `
});

const mlFilterModuleConfig={
  moduleName:"filters",
  actions:{"READ":"read","ADD":"add","UPDATE":"update"}
};
export {mlFilterTableConfig,mlFilterModuleConfig};
