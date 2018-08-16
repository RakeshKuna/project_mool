import {MlViewer,MlViewerTypes} from "/lib/common/mlViewer/mlViewer";
import React from 'react';
import gql from 'graphql-tag'
import moment from 'moment'
import MlCustomFilter from "../../../commons/customFilters/customFilter";
import {client} from '../../core/apolloConnection';
function creatorDateFormatter (data){
  if(data&&data.data&&data.data.createdDate){
    let createdDateTime = data&&data.data&&data.data.createdDate?data.data.createdDate:'';
    return <div>{moment(createdDateTime).format(Meteor.settings.public.dateFormat)}</div>
  }else{
    return <div></div>;
  }
}

function modifiedDateFormatter (data){
  if(data&&data.data&&data.data.modifiedDate){
    let modifiedDateTime = data&&data.data&&data.data.modifiedDate?data.data.modifiedDate:'';
    return <div>{moment(modifiedDateTime).format(Meteor.settings.public.dateFormat)}</div>
  }else{
    return <div></div>;
  }
}

const mltemplatesassignmetConfig=new MlViewer.View({
  name:"templatesTable",
  module:"templateAssignment",//Module name for filter.
  viewType:MlViewerTypes.TABLE,
  extraFields:[],
  fields:["processName","subProcessName","createdBy","createdDate"],
  searchFields:["templateProcessName","templateSubProcessName ","createdBy","createdDate","templatecommunityName"],
  throttleRefresh:false,
  pagination:true,//To display pagination
  selectRow:true,  //Enable checkbox/radio button to select the row.
  filter:true,
  filterComponent: <MlCustomFilter module="templateAssignment" moduleName="templateAssignment" client={client} />,
  columns:[
    {dataField: "id",title:"Id",'isKey':true,isHidden:true},
    {dataField: "createdDate", title: "Created Date", customComponent: creatorDateFormatter,dataSort:true},
    {dataField: "templateProcessName", title: "Process",dataSort:true},
    {dataField: "templateSubProcessName", title: "Sub Process",dataSort:true},
    {dataField: "templateclusterName", title: "Cluster",dataSort:true},
    {dataField: "templatechapterName", title: "Chapter",dataSort:true},
    {dataField: "templatesubChapterName", title: "Sub Chapter",dataSort:true},
    {dataField: "templatecommunityName", title: "Community",dataSort:true},
    {dataField: "templateuserType", title: "User Type",dataSort:true},
    {dataField: "templateidentity", title: "Identity",dataSort:true},
    {dataField: "createdBy", title: "Created By", dataSort:true},
    {dataField: "modifiedBy", title: "Modified By", dataSort:true},
    {dataField: "modifiedDate", title: "Modified Date", customComponent: modifiedDateFormatter},
  ],
  tableHeaderClass:'react_table_head',
  showActionComponent:true,
  actionConfiguration:[
    {
      actionName: 'edit',
      showAction: true,
      handler:  (data)=>{
        if(data&&data.id){
          FlowRouter.go("/admin/templates/assignTemplate/"+data.id)
        }
        else{
          toastr.error("Please Select a Template Type")
        }
      }
    },
    {
      showAction: true,
      actionName: 'add',
      handler: (data)=>{
        if(data&&data.id) {
          toastr.error("Please uncheck the record")
        }else {
          FlowRouter.go("/admin/templates/assignTemplate")
        }
      }
    },
  ],
  sizePerPage:5,
  graphQlQuery:/*gql`
 query SearchQuery( $offset: Int, $limit: Int, $fieldsData: [GenericFilter], $sortData: [SortFilter]) {
              data:SearchQuery(module:"templateAssignment",offset: $offset, limit: $limit, fieldsData: $fieldsData, sortData: $sortData){
                    totalRecords
                    data{
                     ...on TemplateAssignment{
                              templateProcessName
                              templateSubProcessName
                              createdBy
                              createdDate
                              id:_id
                              templateclusterName
                              templatechapterName
                              templatesubChapterName
                              templatecommunityName
                              templateuserType
                              templateidentity
                              modifiedBy
                              modifiedDate
                          }
                      }
              }
              }

              `*/
    gql`query ContextSpecSearch($offset: Int, $limit: Int,$searchSpec:SearchSpec,$fieldsData:[GenericFilter],$sortData: [SortFilter]){
                    data:ContextSpecSearch(module:"templateAssignment",offset:$offset,limit:$limit,searchSpec:$searchSpec,fieldsData:$fieldsData,sortData:$sortData){
                    totalRecords
                    data{
                      ...on TemplateAssignment{
                              templateProcessName
                              templateSubProcessName
                              createdBy
                              createdDate
                              id:_id
                              templateclusterName
                              templatechapterName
                              templatesubChapterName
                              templatecommunityName
                              templateuserType
                              templateidentity
                              modifiedBy
                              modifiedDate
                          }
                      }
              }
              }`
});

export {mltemplatesassignmetConfig};
