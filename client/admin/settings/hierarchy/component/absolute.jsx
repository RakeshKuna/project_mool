import React from "react";
import {render} from "react-dom";
import {BootstrapTable, TableHeaderColumn} from "react-bootstrap-table";
import ScrollArea from "react-scrollbar";
import {findDeptAndsubDeptActionHandler} from "../actions/findDeptAndsubDeptAction";
import {findNonMoolyaDeptAndsubDeptActionHandler} from "../actions/findDeptAndsubDeptAction";
import MlAssignHierarchy from "./MlAssignHierarchy";
import MlActionComponent from "../../../../commons/components/actions/ActionComponent";
import {updateRolesActionHandler} from "../actions/updateRolesAction";
import {updateHierarchyAssignmentsActionHandler} from "../actions/updateFinalApprovalAction";
import {OnToggleSwitch} from "../../../utils/formElemUtil";
import _ from "lodash";
var Select = require('react-select');
var FontAwesome = require('react-fontawesome');

export default class MlHierarchyDetails extends React.Component {

  constructor(props) {
    super(props);
    this.state={
      loading:true,data:{},
      hierarchyInfo:[{departmentId:'',departmentName:'',subDepartmentId:'',subDepartmentName:'',isMoolya:''}],
      unassignedRoles:[],
      assignedRoles:[],
      finalApproval:null,
      isExpanded:false,
      hierarchyId:''
    }
    return this;
  }
  componentDidUpdate(){
    OnToggleSwitch(true,true);
  }
  getAssignRoleDetails(details){
    console.log(details);
    this.setState({'assignedRoles':details})
  }
  getUnAssignRoleDetails(details){
    console.log(details);
    this.setState({'unassignedRoles':details})
  }
  getFinalApprovalRole(details){
    console.log(details);
    this.setState({'finalApproval':details})
  }
  getFinalApprovalDetails(details){
    this.setState({'finalApproval':details})
  }
  getHierarchyId(id){
    this.setState({'hierarchyId':id})
  }
  componentDidMount() {
    $('.switch input').change(function() {
      if ($(this).is(':checked')) {
        $(this).parent('.switch').addClass('on');
      } else {
        $(this).parent('.switch').removeClass('on');
      }
    });
  }

  componentWillMount(){
   const resp=this.findDeptAndsubDept();
    return resp;
  }
  async findDeptAndsubDept(){
    let clusterId = this.props.clusterId;
    let subChapterId = this.props.subChapterId;
    let isDefault=this.props.defaultSubChapter;

    if(isDefault == "true"){
      const response = await findDeptAndsubDeptActionHandler(clusterId);
      if(response){
        let hierarchyInfo=[];
        for (let i = 0; i < response.length; i++) {
          let json = {
            departmentId: response[i].departmentId,
            departmentName:response[i].departmentName,
            subDepartmentId:response[i].subDepartmentId,
            subDepartmentName:response[i].subDepartmentName,
            isMoolya:response[i].isMoolya,
            isActive:response[i].isActive
          }
          hierarchyInfo.push(json)
        }
        this.setState({hierarchyInfo:hierarchyInfo});
      }
    }else if(isDefault == "false"){
      const nonMoolya = await findNonMoolyaDeptAndsubDeptActionHandler(clusterId,subChapterId);
      if(nonMoolya){
        let hierarchyInfo=[];
        for (let i = 0; i < nonMoolya.length; i++) {
          let json = {
            departmentId: nonMoolya[i].departmentId,
            departmentName:nonMoolya[i].departmentName,
            subDepartmentId:nonMoolya[i].subDepartmentId,
            subDepartmentName:nonMoolya[i].subDepartmentName,
            isMoolya:nonMoolya[i].isMoolya,
            isActive:nonMoolya[i].isActive
          }
          hierarchyInfo.push(json)
        }
        this.setState({hierarchyInfo:hierarchyInfo});
      }
    }

  }

  async  updateunassignedRoles() {
    let roles = []
    let hierarchyInfo=this.state.unassignedRoles.teamStructureAssignment;
    if(hierarchyInfo){
      for (let i = 0; i < hierarchyInfo.length; i++) {
        let json = {
          id: hierarchyInfo[i].roleId,
          isHierarchyAssigned:hierarchyInfo[i].isAssigned
        }
        roles.push(json)
      }
      const response = await updateRolesActionHandler(roles);
      return response;
    }

  }
  async  updateassignRoles() {
    let roles = []
    let hierarchyInfo=this.state.assignedRoles.teamStructureAssignment;
    if(hierarchyInfo){
      for (let i = 0; i < hierarchyInfo.length; i++) {
        let json = {
          id: hierarchyInfo[i].roleId,
          isHierarchyAssigned:hierarchyInfo[i].isAssigned
        }
        roles.push(json)
      }
      const response = await updateRolesActionHandler(roles);
      return response;
    }

  }
  async  updatehierarchyAssignments() {
    let finalApproval = null,hierarchyInfo = null;
    let unassignRoles = this.state.unassignedRoles.teamStructureAssignment
    let assignRoles = this.state.assignedRoles.teamStructureAssignment
    let allRoles = []
    if(assignRoles&&assignRoles.length>0){
      allRoles = assignRoles
    }
    if(unassignRoles&&unassignRoles.length>0){
      Array.prototype.push.apply(allRoles, unassignRoles)
    }
    let assignments  = _.map(allRoles, function (row) {
      return _.omit(row, ['__typename']);
    });
    if(this.state.finalApproval&&this.state.finalApproval.isChecked){
      finalApproval = {
        department          : this.state.finalApproval.department,
        subDepartment       : this.state.finalApproval.subDepartment,
        role                : this.state.finalApproval.role,
        isChecked           : this.state.finalApproval.isChecked
      };
      hierarchyInfo={
        id                  : this.state.hierarchyId,//unassignedRoles.id?this.state.unassignedRoles.id:this.state.assignedRoles.id,
        parentDepartment    : this.state.finalApproval.parentDepartment,
        parentSubDepartment : this.state.finalApproval.parentSubDepartment,
        clusterId           : this.props.clusterId,
        teamStructureAssignment :assignments,
        finalApproval         : finalApproval
      }
      console.log(hierarchyInfo);
      const response = await updateHierarchyAssignmentsActionHandler(hierarchyInfo);
      //this.state.isExpanded=true
      /*if (response && response.result){
        toastr.success(response.result);
        return response;
      }*/
      return response;
    }
  }



  isExpandableRow() {
    return true;
  }

  expandComponent(row) {
    let subdepartment,selctedRowDetails=false;
    let selectedRow=this.refs.table
    if(selectedRow){
     let selectedRowValue=selectedRow.state.selectedRowKeys;
     if(selectedRowValue.length==1){
       //department=selectedRowValue[0]
       subdepartment=selectedRowValue[0]
       if(subdepartment){
         if(subdepartment==row.subDepartmentId){
           selctedRowDetails=true
         }
       }
     }
    }
    return (
      <div>
      {selctedRowDetails?
      <MlAssignHierarchy departmentInfo={row} clusterId={this.props.clusterId} getUnAssignRoleDetails={this.getUnAssignRoleDetails.bind(this)} getAssignRoleDetails={this.getAssignRoleDetails.bind(this)} getFinalApprovalRole={this.getFinalApprovalRole.bind(this)} getFinalApprovalDetails={this.getFinalApprovalDetails.bind(this)} getHierarchyId={this.getHierarchyId.bind(this)}/>:
        <div></div>
      }
      </div>
    );
  }
  async updateHierarchy() {
    let response = await this.updatehierarchyAssignments();
    if(response && response.result){

      const assigned = this.updateunassignedRoles();
      const upAssigned = this.updateassignRoles();
      FlowRouter.reload();
      toastr.success(response.result);
    }else{
      toastr.error("'Final Approval' role is mandatory");
    }
    //FlowRouter.go("/admin/settings/hierarchy/clusterhierarchy/"+this.props.clusterId+"/hierarchyDetails");
    return response;
  }
  SwitchBtn(cell,row){
    let activeDetails=false
    if(row.isActive!=null){
      activeDetails=true
    }
    return(
      <div>
    {activeDetails?(<div className="form-group switch_wrap"><label className="switch"><input type="checkbox" disabled="true" ref="status" id="status" checked={row.isActive}/><div className="slider"></div></label></div>):''}
      </div>
    )

  }
  render() {

    let MlActionConfig = [
      /*{
        actionName: 'edit',
        showAction: true,
        handler: null
      },
      {
        actionName: 'add',
        showAction: true,
        handler: null
      },
      {
        actionName: 'logout',
        showAction: true,
        handler: null
      },
      {
        actionName: 'assign',
        showAction: true,
        handler: null
      },*/
      {
        actionName: 'save',
        showAction: true,
        handler: this.updateHierarchy.bind(this)
      }
    ];
    const options = {
      expandRowBgColor: 'rgb(242, 255, 163)'
    };
   const selectRow = {
      mode: 'checkbox',
      bgColor: '#feeebf',
      clickToSelect: true, // click to select, default is false
      clickToExpand: true // click to expand row, default is false
    };
    return (

      <div className="admin_main_wrap">
        <div className="admin_padding_wrap">
          <h2>Hierarchy Assignment</h2>
          <div className="main_wrap_scroll">
            <ScrollArea
              speed={0.8}
              className="main_wrap_scroll"
              smoothScrolling={true}
              default={true}
            >
              <BootstrapTable ref='table' data={ this.state.hierarchyInfo }
                               options={ options }
                               expandableRow={ this.isExpandableRow }
                               expandComponent={ this.expandComponent.bind(this) }
                              selectRow={selectRow}
                              hover={true}
                               pagination
                               search
              >
                <TableHeaderColumn dataField="departmentId"  dataSort={true} hidden={true}></TableHeaderColumn>
                <TableHeaderColumn dataField="subDepartmentId" isKey={true} dataSort={true} hidden={true}></TableHeaderColumn>
                <TableHeaderColumn dataField="isMoolya" hidden={true}>isMoolya</TableHeaderColumn>
                <TableHeaderColumn dataField="departmentName">Department</TableHeaderColumn>
                <TableHeaderColumn dataField="subDepartmentName">Sub-Department</TableHeaderColumn>
                <TableHeaderColumn dataField="isActive" dataFormat={this.SwitchBtn.bind(this)}>Status</TableHeaderColumn>
              </BootstrapTable>

            </ScrollArea>
          </div>
        </div>
        <MlActionComponent ActionOptions={MlActionConfig} showAction='showAction' actionName="actionName"/>
      </div>
    )
  }
}
;
