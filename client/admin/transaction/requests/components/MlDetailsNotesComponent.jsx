import React, {Component, PropTypes} from 'react';
import {render} from 'react-dom';
import {findBackendUserActionHandler} from '../actions/findUserAction'
let Select = require('react-select');
import {initalizeFloatLabel} from "../../../utils/formElemUtil";
import  {updateStusForTransactionActionHandler} from '../actions/updateStatusRequestsAction'
export default class MlDetailsNotesComponent extends React.Component {
  constructor(props){
    super(props);
    this.state={
      role:'',
      departmentName:'',
      subDepartmentName:'',
      profileImage:'',
      firstName: " ",
      status:null,
      dispalyStatus:false
    }
    return this;
  }
  componentDidUpdate()
      {
        initalizeFloatLabel();
      }
  componentWillReceiveProps(newProps){
    let type=newProps.type;
    if(type=="approval"){
      this.setState({"dispalyStatus":true})
    }
    let userId=newProps.transaction.userId
    this.setState({"status":newProps.transaction.status})
    if(userId){
      const resp=this.findBackendUser()
      return resp;
    }

  }

 async  onStatusSelect(val){
    this.setState({"status":val.value})
   let status=val.value
   let requestId=this.props.id
   let response = await updateStusForTransactionActionHandler(requestId,status);
    if(response){
      toastr.success("'Transaction status' updated successfully")
      if(status=="Approved"){
        FlowRouter.go("/admin/transactions/approvedList");
      }
     else{
        FlowRouter.go("/admin/transactions/requestedList");
      }
    }else{
      toastr.error(response.error)
    }
  }
  async findBackendUser() {
    let userTypeId = this.props.transaction.userId
    const response = await findBackendUserActionHandler(userTypeId);
    if(response){
      this.setState({userDetais:response, role:response.profile.InternalUprofile.moolyaProfile.userProfiles[0].userRoles[0].roleName, firstName:response.profile.InternalUprofile.moolyaProfile.firstName})
        let userDetails=this.state.userDetais
      if(userDetails.profile.isInternaluser){
          let userInternalProfile=userDetails.profile.InternalUprofile.moolyaProfile.userProfiles
        if(userInternalProfile){
          let roleIds=[]
          let hirarichyLevel=[]
          userInternalProfile.map(function (doc,index) {
            if(doc.isDefault) {
              let userRoles = doc && doc.userRoles ? doc.userRoles : [];
              userRoles.map(function (doc, index) {
                hirarichyLevel.push(doc.hierarchyLevel)

              });
              hirarichyLevel.sort(function (a, b) {
                return b - a
              });
              for (let i = 0; i < userRoles.length; i++) {
                if (userRoles[i].hierarchyLevel == hirarichyLevel[0]) {
                  roleIds.push(userRoles[i]);
                  break
                }
              }
            }
          });

          if(roleIds.length==1){
            this.setState({"role":roleIds[0].roleName})
            this.setState({"departmentName":roleIds[0].departmentName})
            this.setState({"subDepartmentName":roleIds[0].subDepartmentName})
          }

        }
        this.setState({profileImage:userDetails.profile.profileImage})
      }
    }
  }
  render() {
    let that=this;
    let statusOptions = [
      {value: 'WIP', label: 'WIP' , clearableValue: true},
      {value: 'Approved', label: 'Approved',clearableValue: true}
    ];
    let actionActive='';
    if(this.state.status){
      actionActive='active'
    }
    return (
      <div className="ml_tabs">
        <ul  className="nav nav-pills">
          <li className="active">
            <a  href={`#details${that.props.id}`} data-toggle="tab">Details</a>
          </li>
          <li><a href={`#notes${that.props.id}`} data-toggle="tab">Notes</a>
          </li>
        </ul>

        <div className="tab-content clearfix">
          <div className="tab-pane active" id={`details${that.props.id}`}>
            <div className="row">
              <div className="col-md-9 nopadding">
                <div className="col-md-6">
                  <div className="form-group">
                    <input type="text" placeholder="Approval for" defaultValue={that.props.transaction.requestTypeName} className="form-control float-label" id="" readOnly="true"/>
                  </div>
                  <div className="form-group col-md-6 nopadding-left">
                    <input type="text" placeholder="Department" value={that.state.departmentName} className="form-control float-label" id=""/>
                  </div>
                  <div className="form-group col-md-6 nopadding-right">
                    <input type="text" placeholder="Sub-Department" value={that.state.subDepartmentName} className="form-control float-label" id=""/>
                  </div>
                  <div className="clearfix"></div>
                  <div className="form-group">
                    <input type="text" placeholder="Role" value={that.state.role} className="form-control float-label" id=""/>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <input type="text" placeholder="Device name" defaultValue="" className="form-control float-label" id="" readOnly="true"/>
                  </div>
                  <div className="form-group">
                    <input type="text" placeholder="Device ID" defaultValue="" className="form-control float-label" id="" readOnly="true"/>
                  </div>
                  <div className="form-group">
                    <span className={`placeHolder ${actionActive}`}>Actions</span>
                    <Select name="form-field-name" placeholder="Actions"  className="float-label"  options={statusOptions}  value={that.state.status} disabled={that.state.dispalyStatus} onChange={that.onStatusSelect.bind(that)} />
                  </div>
                  <br className="clearfix" />
                 {/* <div className="ml_btn">
                    /!*<a href="#" className="save_btn">View</a>*!/
                    <a href="#" className="cancel_btn">Actions</a>
                  </div>*/}
                </div>
              </div>
              <div className="col-md-3 text-center">
                <div className="profile_block">
                  <img src={that.state.profileImage} />
                  <span>
                  {that.state.firstName}<br />{that.state.role}
                </span>
                </div>
              </div>

            </div>
          </div>
          <div className="tab-pane" id={`notes${that.props.id}`}>
            <div className="row">
              <div className="col-md-9">
                <div className="form-group">
                  <textarea placeholder="Notes" defaultValue={that.props.transaction.requestDescription} className="form-control float-label" id=""></textarea>
                </div>
              </div>
              <div className="col-md-3 text-center">
                <div className="profile_block">
                  <img src={that.state.profileImage} />
                  <span>
                    {that.state.firstName}<br />{that.state.role}
                </span>
                </div>
              </div>



            </div>
          </div>


        </div>

      </div>

    );
  }
}
