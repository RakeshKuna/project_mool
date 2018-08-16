
import React from 'react';
import formHandler from '../../../../commons/containers/MlFormHandler'
import MlSearchDepartmentContainer from './MlSearchDepartmentContainer';
import {addActionAndStatusActionHandler} from '../actions/addActionAndStatuses'

class MlAddActionsAndStatuses extends React.Component{
  constructor(props){
    super(props);
    this.state={
      subProcessId         : '',
      subProcess      : '',
      clusterId        : '',
      chapterId        : '',
      subChapterId     : '',
      isMoolya        : false,
      departmentsList : []
    }
  }
  async submit(DataToInsert) {
    let response = await addActionAndStatusActionHandler(DataToInsert);
    return response;
  }
  render(){
    const searchData = this.state;
    return (
      <MlSearchDepartmentContainer submit={this.submit} data={searchData} />
    )
  }
};
export default MlAddActionsAndStatuses = formHandler()(MlAddActionsAndStatuses);
