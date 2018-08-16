import {MlViewer,MlViewerTypes} from "../../../../../lib/common/mlViewer/mlViewer";
import React from 'react';
import gql from 'graphql-tag'
const mlTitleTableConfig=new MlViewer.View({
  name:"titleTable",
  module:"title",//Module name for filter.
  viewType:MlViewerTypes.TABLE,
  extraFields:[],
  fields:["titleInfo.titleName","titleInfo.titleDisplayName","titleInfo.isActive"],
  searchFields:["titleInfo.titleName","titleInfo.titleDisplayName","titleInfo.isActive"],
  throttleRefresh:false,
  pagination:true,//To display pagination
  selectRow:true,  //Enable checkbox/radio button to select the row.
  columns:[
    {dataField: "_id",title:"Id",'isKey':true,isHidden:true},
    {dataField: "titleInfo.titleName", title: "Title",dataSort:true,customComponent:function(data){ return <div>{data.data.titleInfo.titleName}</div>}},
    {dataField: "titleInfo.titleDisplayName", title: "Display Name",dataSort:true,customComponent:function(data){ return <div>{data.data.titleInfo.titleDisplayName}</div>}},
    {dataField: "isActive", title: "Active",dataSort:true}
  ],
  tableHeaderClass:'react_table_head',
  showActionComponent:true,
  actionConfiguration:[
    {
      actionName: 'edit',
      showAction: true,
      handler:  (data)=>{
        if(data&&data._id){
          FlowRouter.go("/admin/settings/editTitle/"+data._id)
        }
        else{
          toastr.error("Please select a Title")
        }
      }

    },
    {
      showAction: true,
      actionName: 'add',
      handler: (data)=>{
        if(data&&data._id)
          toastr.error("Please uncheck the record")
        else {
          FlowRouter.go("/admin/settings/addTitle")
        }
      }
    },
    // {
    //   showAction: true,
    //   actionName: 'logout',
    //   handler: (data)=>{console.log(data);}
    // }
  ],
  sizePerPage:5,
  queryOptions:true,
  buildQueryOptions:(config)=>{
    return {context:{settingsType:"TITLE"}}
  },
  graphQlQuery:gql`
                query ContextSpecSearch($context:ContextParams,$offset: Int, $limit: Int,$searchSpec:SearchSpec,$fieldsData: [GenericFilter], $sortData: [SortFilter]){
                   data:ContextSpecSearch(module:"MASTERSETTINGS",context:$context,offset:$offset,limit:$limit,searchSpec:$searchSpec,fieldsData: $fieldsData, sortData: $sortData){
                        totalRecords
                           data{
                            ...on MasterSettings{
                                 _id
                                 isActive
                                 titleInfo{
                                    titleName
                                    aboutTitle
                                    titleDisplayName
                                 }
                                    
                          }
                      }
              }
              }
            
              `
});

export {mlTitleTableConfig};
