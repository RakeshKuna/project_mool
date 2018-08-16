import {MlViewer,MlViewerTypes} from "../../../../../lib/common/mlViewer/mlViewer";
import React from 'react';
import gql from 'graphql-tag'
import moment from 'moment';
function dateFormatter (data){
  let createdDateTime=data&&data.data&&data.data.createdDate?data.data.createdDate:null;
  return <div>{createdDateTime&&moment(createdDateTime).format(Meteor.settings.public.dateFormat)}</div>;
}
const mltemplatesConfig=new MlViewer.View({
  name:"templatesTable",
  module:"templates",//Module name for filter.
  viewType:MlViewerTypes.TABLE,
  extraFields:[],
  fields:["processName","subProcessName","createdBy","createdDate"],
  searchFields:["processName","subProcessName","createdBy","createdDate"],
  throttleRefresh:false,
  pagination:true,//To display pagination
  selectRow:true,  //Enable checkbox/radio button to select the row.
  columns:[
    {dataField: "id",title:"Id",'isKey':true,isHidden:true},
    {dataField: "subProcessId",title:"subProcessId",isHidden:true},
    {dataField: "createdDate", title: "created Date",dataSort:true,customComponent:dateFormatter},
    {dataField: "processName", title: "Process",dataSort:true},
    {dataField: "subProcessName", title: "Sub Process",dataSort:true},
    {dataField: "createdBy", title: "Created By",dataSort:true}

  ],
  tableHeaderClass:'react_table_head',
  showActionComponent:true,
  actionConfiguration:[
    {
      actionName: 'edit',
      showAction: true,
      handler:  (data)=>{
        if(data&&data.id){
          FlowRouter.go("/admin/settings/stepDetails/"+data.subProcessId+"/"+data.id+"/"+data.templates[0].stepCode)
        }
        else{
          toastr.error("Please select a Template Type")
        }
      }
    }
  ],
  sizePerPage:5,
  graphQlQuery:gql`
              query SearchQuery( $offset: Int, $limit: Int, $fieldsData: [GenericFilter], $sortData: [SortFilter]) {
              data:SearchQuery(module:"template",offset: $offset, limit: $limit, fieldsData: $fieldsData, sortData: $sortData){
                    totalRecords
                    data{
                     ...on TemplateDetails{
                              processName
                              createdDate
                              createdBy
                              subProcessName
                              id:_id
                              subProcessId          
                              templates {
                                  stepCode
                                  stepName
                                  templateCode
                                  templateName
                                  isActive
                                  createdDate
                                  templateDescription
                              }                   
                          }
                      }
              }
              }
            
              `
});

export {mltemplatesConfig};
