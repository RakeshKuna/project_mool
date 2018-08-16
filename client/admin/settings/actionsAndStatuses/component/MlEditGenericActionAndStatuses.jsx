/**
 * Created by pankaj on 24/5/17.
 */

import React from 'react';
import formHandler from '../../../../commons/containers/MlFormHandler'
import MlActionComponent from '../../../../commons/components/actions/ActionComponent'
import {OnToggleSwitch,initalizeFloatLabel} from '../../../utils/formElemUtil';
import {findRolessActionHandler} from '../actions/findRoles';
import {findActionAndStatusActionHandler} from '../actions/findActionsAndStatuses';
import {findSubDepartmentActionHandler} from '../actions/findSubDepartment';
import {findDepartmentActionHandler } from '../actions/findDepartment';
import {updateGenericActionAndStatusActionHandler} from '../actions/updateGenericActionsAndStatuses';
import Select from 'react-select';

class MlSearchDepartmentContainer extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      process         : '',
      subProcess      : '',
      clusters        : '',
      chapters        : '',
      subChapters     : '',
      isMoolya        : false,
      department      : '',
      subDepartment   : '',
      operation       : [{}],
      rolesList       : [],
      subDepartmentId : FlowRouter.getParam('Did')
    };
    return this;
  }
  componentDidMount()
  {
    $(function() {
      $('.float-label').jvFloat();
    });

    $('.switch input').change(function() {
      if ($(this).is(':checked')) {
        $(this).parent('.switch').addClass('on');
      }else{
        $(this).parent('.switch').removeClass('on');
      }
    });

  }

  componentWillMount() {
    const departments =this.getSubDepartment();
    return departments;
  }

  async  findActionAndStatus() {
    let id = FlowRouter.getParam('id');
    let response = await findActionAndStatusActionHandler(id);
    if (response) {
      let operation = response.departmentInfo && response.departmentInfo.departmentId == this.state.departmentId && response.departmentInfo.subDepartmentId == this.state.subDepartmentId && response.departmentInfo.operation ?
        response.departmentInfo.operation : [{}];
      operation = operation.map( function(data){
        return {
          roleIds : data.roleIds,
          about : data.about,
          actionName : data.actionName,
          actionDisplayName : data.actionDisplayName,
          statusName : data.statusName,
          statusDisplayName : data.statusDisplayName,
          status : data.status ? data.status : false
        }

      });
      this.setState({
        process         : response.processName,
        subProcess      : response.subProcessName,
        clusters        : response.clusterName,
        chapters        : response.chapterName,
        subChapters     : response.subChapterName,
        isMoolya        : response.isMoolya,
        operation       : operation
      });
    }
  }

  async getRoles(dId, sDId){
    let id = FlowRouter.getParam('id');
    let response = await findRolessActionHandler(dId, sDId);
    if(response){
      this.setState({
        rolesList   : response
      });
    }
  }

  async getSubDepartment(){
    let did = FlowRouter.getParam('Did');
    const that = this;
    let response = await findSubDepartmentActionHandler(did);
    if(response){
      this.setState({
        subDepartment   : response.displayName,
        departmentId    : response.departmentId
      }, function () {
        that.findActionAndStatus();
      });
      this.getDepartment(response.departmentId);
      this.getRoles(response.departmentId, response._id)
    }
  }

  async getDepartment(id){
    let response = await findDepartmentActionHandler(id);
    if(response){
      this.setState({
        department   : response.displayName
      });
    }
  }

  componentDidUpdate()
  {
    OnToggleSwitch(true,true);
    initalizeFloatLabel();
  }
  async addEventHandler() {
    const resp=await this.createBackendUser();
    return resp;
  }

  async handleError(response) {
    alert(response)
  };

  async handleSuccess(response) {
    if (response){
      if(response.success)
        FlowRouter.go("/admin/settings/actionsAndStatusesList");
      else
        toastr.error(response.result);
    }
  };

  addOerations() {
    let operation = this.state.operation;
    operation.push({
    });
    this.setState({
      operation: operation
    });
  };

  removeOerations(evt, index) {
    let operation = this.state.operation;
    operation.splice(index , 1);
    this.setState({
      operation: operation
    });
  };

  updateOperation(evt, index, type){
    let operatios = this.state.operation;
    if(Object.prototype.toString.call(evt) ==  "[object Array]"){
      operatios[index][type] = evt.map((data) => data.value );
    } else if (Object.prototype.toString.call(evt) ==  "[object Object]"){
      operatios[index][type] = evt.target.value;
    }
    this.setState({
      operation : operatios
    });
  }

  updateStatusOperation(evt, index, type){
    console.log(evt.target.checked);
    let operatios = this.state.operation;
    operatios[index][type] = evt.target.checked;
    this.setState({
      operation : operatios
    });
  }

  async updateActionsAndStatuses(){
    console.log(this.state);
    let Id = FlowRouter.getParam('id');
    let dataToUpdate = {
      departmentId    : this.state.departmentId,
      subDepartmentId : this.state.subDepartmentId,
      operation       : this.state.operation
    };
    const response = await updateGenericActionAndStatusActionHandler(Id, dataToUpdate);
    return response;
  };

  render(){
    const that = this;
    let MlActionConfig = [
      {
        showAction: true,
        actionName: 'save',
        handler: async(event) => this.props.handler(this.updateActionsAndStatuses.bind(this), this.handleSuccess.bind(this), this.handleError.bind(this))
      },
      {
        showAction: true,
        actionName: 'cancel',
        handler: async(event) => {
          this.props.handler(" ");
          let Id = FlowRouter.getParam('id');
          FlowRouter.go("/admin/settings/editActionsAndStatuses/"+Id);
        }
      }
    ]
    const options = that.state.rolesList.map(function (data) {
      return {value:data.value,
              label:data.name}
    });
    return (
      <div className="admin_main_wrap">
        <div className="admin_padding_wrap">
          <div className="main_wrap_scroll">
              <div className="col-md-6 nopadding-left">
                <div className="">
                  <div className="form_bg">
                    <form>
                      <div className="form-group">
                        <input type="text" ref="process" placeholder="Process" value={that.state.process} className="form-control float-label" disabled={true} />
                      </div>
                      <div className="form-group">
                        <input type="text" ref="cluster" placeholder="Cluster" value={that.state.clusters} className="form-control float-label" disabled={true} />
                      </div>
                      <div className="form-group">
                        <input type="text" ref="chapter" placeholder="Chapter" value={that.state.chapters} className="form-control float-label" disabled={true} />
                      </div>
                      <div className="form-group">
                        <input type="text" ref="department" placeholder="Department" value={that.state.department} className="form-control float-label" disabled={true} />
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              <div className="col-md-6 nopadding-right"  >
                <div className="form_bg" >
                  <div className="">
                    <form>
                      <div className="form-group">
                        <input type="text" ref="email" placeholder="Sub-Process" value={that.state.subProcess} className="form-control float-label" id="" disabled="disabled"/>
                      </div>
                      <div className="form-group switch_wrap inline_switch">
                        <label className="">Moolya</label>
                        <label className="switch">
                          <input type="checkbox" ref="status" checked={this.state.isMoolya} disabled="disabled" />
                          <div className="slider"></div>
                        </label>
                      </div>
                      <br />
                      <br />
                      <br />
                      <div className="form-group">
                        <input type="text" ref="email" placeholder="Sub-Chapter" value={that.state.subChapters} className="form-control float-label" id="" disabled="disabled"/>
                      </div>
                      <div className="form-group">
                        <input type="text" ref="email" placeholder="Sub-Department" value={that.state.subDepartment} className="form-control float-label" id="" disabled="disabled"/>
                      </div>
                    </form>
                </div>
              </div>
            </div>
          </div>
          <div style={{'clear':'both'}}>
            {that.state.operation.map(function (data, i) {
                return (
                  <div className="panel panel-default" key={i}>
                    <div className="panel-heading">
                      Panel Heading
                      {i==0&&(<div className="pull-right block_action"><img src="/images/add.png" onClick={()=>that.addOerations()} /></div>)}
                      {i>0&&(<div className="pull-right block_action"><img src="/images/remove.png" onClick={(e)=>that.removeOerations(e, i)} /></div>)}
                    </div>
                    <div className="panel-body">
                      <div className="col-md-6 nopadding-left">
                        <div className="form-group">
                          <Select  multi={true} options={options} value={data.roleIds} onChange={(e) => that.updateOperation(e, i, 'roleIds')} />
                        </div>
                        <div className="form-group">
                          <input type="text" ref="actionName" onBlur={(e) => that.updateOperation(e, i, 'actionName')} placeholder="Action Name" value={data.actionName} className="form-control float-label" />
                        </div>
                        <div className="form-group">
                          <input type="text" ref="email" placeholder="Status Name" onBlur={(e) => that.updateOperation(e, i, 'statusName')}  value={data.statusName} className="form-control float-label" />
                        </div>
                        <div className="form-group switch_wrap inline_switch">
                          <label className="">Status</label>
                          <label className="switch">
                            <input type="checkbox" defaultChecked={data.status && data.status == 'true'} ref="status" onClick={(e) => that.updateStatusOperation(e, i, 'status')} />
                            <div className="slider"></div>
                          </label>
                        </div>
                      </div>
                      <div className="col-md-6 nopadding-right"  >
                        <div className="form-group">
                          <input type="text" ref="email" placeholder="About" value={data.about} onBlur={(e) => that.updateOperation(e, i, 'about')} className="form-control float-label" id=""/>
                        </div>
                        <div className="form-group">
                          <input type="text" ref="email" placeholder="Action Display Name" value={data.actionDisplayName} onBlur={(e) => that.updateOperation(e, i, 'actionDisplayName')}  className="form-control float-label" id=""/>
                        </div>
                        <div className="form-group">
                          <input type="text" ref="email" placeholder="Status Display Name" value={data.statusDisplayName} onBlur={(e) => that.updateOperation(e, i, 'statusDisplayName')} className="form-control float-label" id=""/>
                        </div>
                      </div>
                    </div>
                  </div>
                )
            })}
          </div>
          <MlActionComponent ActionOptions={MlActionConfig} showAction='showAction' actionName="actionName"/>
        </div>
      </div>
    )
  }
};
export default MlSearchDepartmentContainer = formHandler()(MlSearchDepartmentContainer);

