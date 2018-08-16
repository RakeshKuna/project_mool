import {MlViewer,MlViewerTypes} from "../../../../../lib/common/mlViewer/mlViewer";
import React from 'react';
import gql from 'graphql-tag'
import ActiveFormatter from '../actions/ActiveFormatter';
// import FlagFormatter from '../actions/FlagFormatter';

const mlGenderTableConfig=new MlViewer.View({
  name:"GenderTable",
  module:"gender",//Module name for filter.
  viewType:MlViewerTypes.TABLE,
  extraFields:[],
  fields:["genderInfo.genderName","genderInfo.genderDisplayName","genderInfo.aboutGender","isActive"],
  searchFields:["genderInfo.genderName","genderInfo.","genderInfo.genderDisplayName","genderInfo.aboutGender","isActive"],
  throttleRefresh:false,
  pagination:true,//To display pagination
  selectRow:true,  //Enable checkbox/radio button to select the row.
  columns:[
    {dataField: "_id",title:"Id",'isKey':true,isHidden:true},
    {dataField: "genderInfo.genderName", title: "Name",dataSort:true,customComponent:function(data){ return <div>{data.data.genderInfo.genderName}</div>}},
    {dataField: "genderInfo.genderDisplayName", title: "Display Name",dataSort:true,customComponent:function(data){ return <div>{data.data.genderInfo.genderDisplayName}</div>}},
    {dataField: "genderInfo.aboutGender", title: "About",dataSort:true,customComponent:function(data){ return <div>{data.data.genderInfo.aboutGender}</div>}},
    {dataField: "isActive", title: "Active",dataSort:true}
  ],
  tableHeaderClass:'react_table_head',
  showActionComponent:true,
  actionConfiguration:[
    {
      actionName: 'edit',
      showAction: true,
      handler: (data)=>{
        if(data && data._id){
          FlowRouter.go("/admin/settings/editGender/"+data._id);
        } else{
          toastr.error("Please select a Gender");
        }
      }
    },
    {
      showAction: true,
      actionName: 'add',
      handler: (data)=>{
        FlowRouter.go("/admin/settings/addGender")
      }
    }
  ],
  sizePerPage:5,
  queryOptions:true,
  buildQueryOptions:(config)=>{
    return {context:{settingsType:"GENDER"}}
  },
  graphQlQuery:gql`
                query ContextSpecSearch($context:ContextParams,$offset: Int, $limit: Int,$searchSpec:SearchSpec,$fieldsData: [GenericFilter], $sortData: [SortFilter]){
                   data:ContextSpecSearch(module:"MASTERSETTINGS",context:$context,offset:$offset,limit:$limit,searchSpec:$searchSpec,fieldsData: $fieldsData, sortData: $sortData){
                        totalRecords
                           data{
                            ...on MasterSettings{
                                 _id
                                 isActive
                                 genderInfo{
                                    genderName
                                    aboutGender
                                    genderDisplayName
                                 }
                                    
                          }
                      }
              }
              }
            
              `
});

export {mlGenderTableConfig};
