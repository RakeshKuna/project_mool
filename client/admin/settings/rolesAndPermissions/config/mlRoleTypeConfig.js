import {MlViewer,MlViewerTypes} from "../../../../../lib/common/mlViewer/mlViewer";
import React from 'react';
import gql from 'graphql-tag'
import moment from 'moment'
import {stringTitleFormatter,stringTitleAllFormatter,dateTitleFormatter} from '../../../../commons/utils/formatter';
//@for displaying  list of departments under assign roles
function departmentsFormatter (data){

  let departments=data&&data.data&&data.data.departmentsList?data.data.departmentsList: [];
  if(departments.length>0){
    return <div>{departments.join()}</div>;
  }else{
    return <div>All</div>;
  }

}

//@for displaying  list of sub-departments under assign roles
function subdepartmentsFormatter (data){
  let departments=data&&data.data&&data.data.subdepartmentsList?data.data.subdepartmentsList: [];
  if(departments.length>0){
    return <div>{departments.join()}</div>;
  }else{
    return <div>All</div>;
  }

}

//@for displaying  list of clusters under assign roles
function clustersFormatter (data){

  let departments=data&&data.data&&data.data.clustersList?data.data.clustersList:[];
  if(departments.length>0){
    return <div>{departments.join()}</div>;
  }else{
    return <div>All</div>;
  }
}

//@for displaying chapters under assign roles
function chapterFormatter(data){
  let departments = [];
  departments=data&&data.data&&data.data.chaptersList?data.data.chaptersList:[];
  if(departments.length>0){
    return <div>{departments.join()}</div>;
  }else{
    return <div>All</div>;
  }
}

//@for displaying subchapters under assign roles
function subChapterFormatter(data){
  let departments=data&&data.data&&data.data.subChapterList?data.data.subChapterList:[];
  if(departments.length>0){
    return <div>{departments.join()}</div>;
  }else{
    return <div>All</div>;
  }

}
function dateFormatter(data){
  let createdDateTime=data&&data.data&&data.data.createdDateTime;
  if(createdDateTime){
    return <div>{moment(createdDateTime).format(Meteor.settings.public.dateFormat)}</div>;
  } else {
    return <div></div>;
  }
}
function createdByFormatter(data){
  let createdBy=data&&data.data&&data.data.createdBy;
  if(createdBy){
    return <div>{createdBy}</div>;
  } else {
    return <div></div>;
  }
}
function updateddateFormatter(data){
  let updatedDateTime=data&&data.data&&data.data.updatedDateTime;
  if(updatedDateTime){
    return <div>{moment(updatedDateTime).format(Meteor.settings.public.dateFormat)}</div>;
  } else {
    return <div></div>;
  }
}
function updatedByFormatter(data){
  let updatedBy=data&&data.data&&data.data.updatedBy;
  if(updatedBy){
    return <div>{updatedBy}</div>;
  } else {
    return <div></div>;
  }
}
//@for displaying roleTypes as EcoSystem and SubChapter
function roleType(data){
  let roleType = data&&data.data && data.data.roleType;
   if(roleType == "moolya"){
     return <div>EcoSystem</div>
   }
   else if(roleType == "non-moolya"){
       return <div>subChapter</div>
   }else{
     return <div></div>
   }
}
const mlRoleTypeTableConfig=new MlViewer.View({
  name:"roleTypeTable",
  module:"roles",//Module name for filter.
  viewType:MlViewerTypes.TABLE,
  extraFields:[],
  fields:["roleName","displayName","roleType","userType",'createdBy'],
  searchFields:["roleName","displayName","roleType", "userType",'createdBy'],
  throttleRefresh:false,
  pagination:true,//To display pagination
  selectRow:true,  //Enable checkbox/radio button to select the row.
  columns:[
    {dataField: "id",title:"Id",'isKey':true,isHidden:true},
    {dataField: "roleName", title: "Role Name",dataSort:true},
    {dataField: "displayName", title: "Display Name",dataSort:true},
    {dataField: "roleType", title: "Role Type",dataSort:true,customComponent:roleType,customTitleFormatter:stringTitleFormatter},
    {dataField: "departmentsList", title: "Departments",dataSort:true,customComponent:departmentsFormatter,customTitleFormatter:stringTitleFormatter},
    {dataField: "subdepartmentsList", title: "SubDepartments",dataSort:true,customComponent:subdepartmentsFormatter,customTitleFormatter:stringTitleFormatter},
    {dataField: "clustersList", title: "Cluster",dataSort:true,customComponent:clustersFormatter,customTitleFormatter:stringTitleAllFormatter},
    {dataField: "chaptersList", title: "Chapter",dataSort:true,customComponent:chapterFormatter,customTitleFormatter:stringTitleAllFormatter},
    {dataField: "subChapterList", title: "Sub-Chapter",dataSort:true,customComponent:subChapterFormatter,customTitleFormatter:stringTitleAllFormatter},
    {dataField: "createdDateTime", title: "Created Date and Time",dataSort:true,customComponent:dateFormatter,customTitleFormatter:dateTitleFormatter},
    {dataField: "createdBy", title: "Created By",dataSort:true,customComponent:createdByFormatter,customTitleFormatter:stringTitleFormatter},
    {dataField: "updatedDateTime", title: "Updated Date and Time",dataSort:true,customComponent:updateddateFormatter,customTitleFormatter:dateTitleFormatter},
    {dataField: "updatedBy", title: "Updated By",dataSort:true,customComponent: updatedByFormatter,customTitleFormatter:stringTitleFormatter},
  ],
  tableHeaderClass:'react_table_head',
  showActionComponent:true,
  actionConfiguration:[
    {
      actionName: 'edit',
      showAction: true,
      handler: (data)=>{
        if(data && data.id){
          FlowRouter.go("/admin/settings/editRole/"+data.id);
        } else{
          toastr.error("Please select a Role Type");
        }
      }
    },
    {
      showAction: true,
      actionName: 'add',
      handler: (data)=>{
        if(data&&data.id)
        // {FlowRouter.go("/admin/settings/rolesList")}
          toastr.error("Please uncheck the record")
        else {
          FlowRouter.go("/admin/settings/createRole")
        }
      }
    }
  ],
  graphQlQuery:gql`
                query SearchQuery($offset: Int, $limit: Int, $fieldsData: [GenericFilter], $sortData: [SortFilter]){
                data:SearchQuery(module:"roles", offset: $offset, limit: $limit, fieldsData: $fieldsData, sortData: $sortData){
                      totalRecords
                      data{
                       ...on Roles{
                              id:_id,
                              roleName, 
                              displayName, 
                              roleType,
                              createdDateTime,
                              createdBy,
                              updatedDateTime,
                              updatedBy,
                              departmentsList,
                              subdepartmentsList,
                              clustersList,
                              chaptersList,
                              subChapterList,
                              userType,
                              about 
                            }
                        }
                }
               }
              `
});

export {mlRoleTypeTableConfig};
