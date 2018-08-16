
import {MlViewer,MlViewerTypes} from "../../../../../lib/common/mlViewer/mlViewer";
import React from 'react';
import gql from 'graphql-tag'
import moment from 'moment'
import Preview from '../component/Preview';
import _ from 'underscore';
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

function unescapeContent(data){
  let contentData=data&&data.data&&data.data.content?data.data.content:'';
      contentData=_.unescape(contentData);
    return <div>{contentData}</div>;
}

const mlNotificationTemplateTableConfig=new MlViewer.View({
  name:"notificationTemplate",
  module:"notificationTemplate",//Module name for filter.
  viewType:MlViewerTypes.TABLE,
  extraFields:[],
  fields:["tempCode","tempDesc","type","content","title","isActive"],
  searchFields:["tempCode","tempDesc","type","content","title","isActive"],
  throttleRefresh:false,
  pagination:true,//To display pagination
  selectRow:true,  //Enable checkbox/radio button to select the row.
  columns:[
    {dataField: "id",title:"Id",'isKey':true,isHidden:true},
    {dataField: "tempCode", title: "Code",dataSort:true},
    {dataField: "tempDesc", title: "Description",dataSort:true},
    {dataField: "type", title: "Type",dataSort:true},
    {dataField: "title", title: "Title",dataSort:true},
    {dataField: "isHtmlContent", title: "Html Content",dataSort:true},
    {dataField: "content", title: "Content",dataSort:true,customComponent:unescapeContent},
    {dataField: "updatedBy", title: "Updated By",dataSort:true},
    {dataField: "updatedAt", title: "UpdatedDate And Time",dataSort:true,customComponent:updatedateFormatter},
    {dataField: "dynamicKeys", title: "Dynamic Keys",dataSort:true},
    {dataField: "isActive", title: "Status",dataSort:true}
  ],
  tableHeaderClass:'react_table_head',
  showActionComponent:true,
  actionConfiguration:[
    {
      actionName: 'edit',
      showAction: true,
      handler:  (data)=>{
        if(data&&data.id){
          FlowRouter.go("/admin/settings/editNotificationTemplate/"+data.id)
        }
        else{
          toastr.error("Please select a type to edit")
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
          FlowRouter.go("/admin/settings/addNotificationTemplate")
        }
      }
    },
    {
      showAction: true,
      actionName: 'preview',
      hasPopOver: true,
      popOverTitle: 'Preview',
      placement: 'top',
      target: 'preview',
      popOverComponent: <Preview />,
      actionComponent: function (props) {
        return <div className={props.activeClass} id={props.actionName}>
          <div onClick={props.onClickHandler} className={props.activesubclass} data-toggle="tooltip"
               title={props.actionName} data-placement="top" id={props.target}>
            <span className={props.iconClass}></span>
          </div>
        </div>;
      }
    }
  ],
  sizePerPage:5,
  graphQlQuery:gql`
              query SearchQuery( $offset: Int, $limit: Int, $fieldsData: [GenericFilter], $sortData: [SortFilter]) {
              data:SearchQuery(module:"NotificationTemplate",offset: $offset, limit: $limit, fieldsData: $fieldsData, sortData: $sortData){
                    totalRecords
                    data{
                     ...on NotificationTemplate{
                              id:_id
                              tempCode
                              tempDesc
                              title
                              type
                              isHtmlContent
                              content
                              dynamicKeys
                              isActive
                              createdBy
                              createdAt  
                              updatedBy     
                              updatedAt 
                          }
                      }
              }
              }
              `
});

export {mlNotificationTemplateTableConfig};
