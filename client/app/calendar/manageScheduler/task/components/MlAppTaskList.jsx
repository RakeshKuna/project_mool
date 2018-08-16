/**
 * Created by pankaj on 20/6/17.
 */
import React from "react";
import MlAppScheduleHead from "../../commons/components/MlAppScheduleHead";
import {fetchTasksActionHandler} from "../actions/fetchTasks";
import { fetchCurrencyTypeActionHandler } from '../../../../../commons/actions/mlCurrencySymbolHandler'
import {appClient} from '../../../../core/appConnection';

export default class MlAppTaskList extends React.Component{
  constructor(props){
    super(props);
    this.editTask.bind(this)
    this.state = {
      tasks: [], currencySymbol:""
    }
    return this
  }
  componentDidMount() {
    this.fetchTasks();
    this.getCurrencyType();
  }
  async fetchTasks(){
    let profileId = FlowRouter.getParam('profileId');
    let response = await fetchTasksActionHandler(profileId);
    if(response){
      this.setState({
        tasks:response
      });
    }
  }

  editTask(taskId, SelectedprofileId){
    let profileId = this.props.profileId === "all" ? SelectedprofileId : this.props.profileId;
    FlowRouter.go('/app/calendar/manageSchedule/'+profileId+'/editTask/'+taskId)
  }

  onClickAdd(){
    let profileId = FlowRouter.getParam('profileId');
    FlowRouter.go('/app/calendar/manageSchedule/'+profileId+'/createTask');
  }

  async getCurrencyType() {
    let profileId = FlowRouter.getParam('profileId');
    const response = await fetchCurrencyTypeActionHandler(appClient, null, null, profileId);
    this.setState({currencySymbol: response.symbol})
    return response;
  }

  render() {
    let that = this
    return (
      <div className="app_main_wrap" style={{'overflow':'auto'}}>
        <div className="app_padding_wrap">
          <MlAppScheduleHead type="task"/>
          <div className="col-lg-12">
            <div className="row">
              {that.props.profileId !== "all" ?<div className="col-lg-2 col-md-4 col-sm-4">
                <div className="card_block">
                <a href="" onClick={()=>this.onClickAdd()}>
                  <div className="add_task">
                    <div><span className="ml ml-plus "></span></div>
                    <div className="block_footer"><span>Create a task</span></div>
                  </div>
                </a>
                </div>
              </div>: <div></div>}
              { this.state.tasks.map(function (task, index) {
                return (
                <div className="col-lg-2 col-md-4 col-sm-4" key={index}>
                  <div className="card_block"  onClick={()=>that.editTask(task.taskId, task.profileId)}><h3>{task.displayName}</h3>
                    <div className={task.isActive ? 'active' : 'inactive'}></div>
                    <div className="clearfix"></div>
                    <div className="list_icon mart0">
                      <span className="price">{task.payment && task.payment.currencyType ? task.payment.currencyType : that.state.currencySymbol} {(task.payment && task.payment.derivedAmount) ? task.payment.derivedAmount.toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") : '0.00'}</span>
                      <span className="price pull-right">{(task.isExternal && !task.isInternal? 'EXT' : (task.isInternal && !task.isExternal ? 'INT' : (task.isExternal && task.isInternal ? 'INT + EXT' : '')))}</span>
                      <div className="clearfix"></div>
                      <i className="c_image ml my-ml-task"></i>
                      <div className="clearfix"></div>
                      <span className="price">{task.duration ? `${task.duration.hours ? task.duration.hours : 0} Hrs ${task.duration.minutes ? task.duration.minutes : 0} Mins` : ''}</span>
                      <span className="price pull-right">{`${task.noOfSession ? task.noOfSession : '0'} Sessions`}</span>
                    </div><div className="block_footer"><span>{task.isServiceCardEligible ? 'Service Cardeable' : 'Non-Service Cardeable'}</span></div></div>
                </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    )
  }
};
