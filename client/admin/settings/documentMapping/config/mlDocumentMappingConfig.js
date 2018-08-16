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
function categoriesformatter (data){
    let categories=data&&data.data&&data.data.kycCategory?data.data.kycCategory:[];
  //   let ids =[];
  // categories.map(function (doc) {
  //     ids.push(doc.id)
  //   })
    return <div>{categories.join()}</div>;
}
function allowableFormatformatter (data){

  let allowableFormat=data&&data.data&&data.data.allowableFormat?data.data.allowableFormat:[];
  // let ids =[];
  // allowableFormat.map(function (doc) {
  //   ids.push(doc.id)
  // })
  return <div>{allowableFormat.join()}</div>;

}
function clustersformatter (data){

  let clusters=data&&data.data&&data.data.clusters?data.data.clusters:[];
  if(clusters.length>0){
    return <div>{clusters.join()}</div>;
  }else{
    return <div>All</div>;
  }
}

function chaptersformatter (data){

  let chapters=data&&data.data&&data.data.chapters?data.data.chapters:[];
  if(chapters.length>0){
    return <div>{chapters.join()}</div>;
  }else{
    return <div>All</div>;
  }
}

function subChaptersformatter (data){

  let subChapters=data&&data.data&&data.data.subChapters?data.data.subChapters:[];
  if(subChapters.length>0){
    return <div>{subChapters.join()}</div>;
  }else{
    return <div>All</div>;
  }
}


const mlDocumentMappingTableConfig=new MlViewer.View({
  name:"documentMappingTable",
  module:"documentMapping",//Module name for filter.
  viewType:MlViewerTypes.TABLE,
  extraFields:[],
  fields:["documentName","roleTypeDisplayName","isActive"],
  searchFields:["documentName","roleTypeDisplayName","isActive"],
  throttleRefresh:false,
  pagination:true,//To display pagination
  selectRow:true,  //Enable checkbox/radio button to select the row.
  columns:[
    {dataField: "documentId",title:"Id",'isKey':true},
    {dataField: "documentName", title: "Name",dataSort:true},
    {dataField: "kycCategory", title: "Category",dataSort:true, customComponent:categoriesformatter},
    {dataField: "allowableFormat", title: "Allowable Format",dataSort:true, customComponent:allowableFormatformatter},
    {dataField: "allowableMaxSize", title: "Allowable Size",dataSort:true},
    {dataField: "clusters", title: "Jurisdiction",dataSort:true, customComponent:clustersformatter},
    {dataField: "chapters", title: "Chapter",dataSort:true, customComponent:chaptersformatter},
    {dataField: "subChapters", title: "Sub Chapter",dataSort:true, customComponent:subChaptersformatter},
    {dataField: "createdBy", title: "Created By",dataSort:true},
    {dataField: "createdDate", title: "Created Date",dataSort:true,customComponent:createdateFormatter},
    {dataField: "updatedBy", title: "Updated By",dataSort:true},
    {dataField: "updatedDate", title: "Updated Date",dataSort:true,customComponent:updatedateFormatter},

  ],
  tableHeaderClass:'react_table_head',
  showActionComponent:true,
  actionConfiguration:[
    {
      actionName: 'edit',
      showAction: true,
      handler: (data)=>{
        if(data && data.documentId){
          FlowRouter.go("/admin/settings/documentProcess/editDocumentMapping/"+data.documentId);
        } else{
          toastr.error("Please select a Document");
        }
      }
    },
    {
      showAction: true,
      actionName: 'add',
      handler: (data)=>{
        if(data && data.documentId)
          toastr.error("Please uncheck the record")
        // {FlowRouter.go("/admin/settings/documentMappingList")}
        else {
          FlowRouter.go("/admin/settings/documentProcess/addDocumentMapping")
        }
      }
    },
    // {
    //   showAction: true,
    //   actionName: 'logout',
    //   handler: (data)=>{console.log(data);}
    // }
  ],
  // graphQlQuery:gql`
  //            query {
  //                data: findDocuments{
  //                   documentId
  //                   documentName
  //                 allowableFormat{
  //                   id
  //                 }
  //                 clusters{
  //                   id
  //                 }
  //                 chapters{
  //                   id
  //                 }
  //                 subChapters{
  //                   id
  //                 }
  //                 kycCategory{
  //                   id
  //                 }
  //                 documentType{
  //                   id
  //                 }
  //                 isActive
  //               }
  //         }
  //             `
  graphQlQuery:gql`
             query SearchQuery($offset: Int, $limit: Int, $fieldsData: [GenericFilter], $sortData: [SortFilter]){
              data:SearchQuery(module:"documentMapping", offset: $offset, limit: $limit, fieldsData: $fieldsData, sortData: $sortData){
                    totalRecords
                    data{
                     ...on DocumentMapping{
                              documentId
                              documentName
                              allowableMaxSize
                              allowableFormat
                              clusters
                              chapters
                              subChapters
                              kycCategory
                              isActive
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

export {mlDocumentMappingTableConfig};
