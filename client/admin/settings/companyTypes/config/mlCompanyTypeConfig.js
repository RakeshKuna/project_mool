import {MlViewer,MlViewerTypes} from "../../../../../lib/common/mlViewer/mlViewer";
import React from 'react';
import gql from 'graphql-tag'
const mlCompanyTypeTableConfig=new MlViewer.View({
  name:"companyTypeTable",
  module:"CompanyType",//Module name for filter.
  viewType:MlViewerTypes.TABLE,
  extraFields:[],
  fields:["companyTypeInfo.companyName","companyTypeInfo.companyDisplayName","isActive"],
  searchFields:["companyTypeInfo.companyName","companyTypeInfo.companyDisplayName","isActive"],
  throttleRefresh:false,
  pagination:true,//To display pagination
  selectRow:true,  //Enable checkbox/radio button to select the row.
  columns:[
    {dataField: "_id",title:"Id",'isKey':true,isHidden:true},
    {dataField: "companyTypeInfo.companyName", title: "Company Type",dataSort:true,customComponent:function(data){ return <div>{data.data.companyTypeInfo.companyName}</div>}},
    {dataField: "companyTypeInfo.companyDisplayName", title: "Display Name",dataSort:true,customComponent:function(data){ return <div>{data.data.companyTypeInfo.companyDisplayName}</div>}},
    {dataField: "isActive", title: "Active",dataSort:true},
  ],
  tableHeaderClass:'react_table_head',
  showActionComponent:true,
  actionConfiguration:[
    {
      actionName: 'edit',
      showAction: true,
      handler:  (data)=>{
        if(data&&data._id){
          FlowRouter.go("/admin/settings/editCompanyType/"+data._id)
        }
        else{
          toastr.error("Please select a company type ")
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
          FlowRouter.go("/admin/settings/addCompanyType")
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
    return {context:{settingsType:"COMPANYTYPE"}}
  },
  graphQlQuery:gql`
              query ContextSpecSearch($context:ContextParams,$offset: Int, $limit: Int,$searchSpec:SearchSpec,$fieldsData: [GenericFilter], $sortData: [SortFilter]){
                   data:ContextSpecSearch(module:"MASTERSETTINGS",context:$context,offset:$offset,limit:$limit,searchSpec:$searchSpec,fieldsData: $fieldsData, sortData: $sortData){
                        totalRecords
                           data{
                            ...on MasterSettings{
                                 _id
                                 isActive
                                 companyTypeInfo{
                                    companyName
                                    aboutCompany
                                    companyDisplayName
                                 }
                                    
                          }
                      }
              }
              }
            
              `
});

export {mlCompanyTypeTableConfig};
