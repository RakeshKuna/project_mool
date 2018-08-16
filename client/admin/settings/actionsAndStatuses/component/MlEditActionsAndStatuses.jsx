/**
 * Created by pankaj on 23/5/17.
 */

import React from 'react';
import formHandler from '../../../../commons/containers/MlFormHandler'
import MlSearchDepartmentContainer from './MlSearchDepartmentContainer';
import {editActionAndStatusActionHandler} from '../actions/editActionAndStatuses'
import {findActionAndStatusActionHandler} from '../actions/findActionsAndStatuses'

class MlEditActionsAndStatuses extends React.Component{
  constructor(props){
    super(props);
    this.state={
      process         : '',
      subProcess      : '',
      clusters        : '',
      chapters        : '',
      subChapters     : '',
      isMoolya        : false,
      departmentsList : []
    }
  }
  async submit(DataToInsert) {
    let Id = FlowRouter.getParam('id');
    const response = await editActionAndStatusActionHandler(Id, DataToInsert);
    return response;
  }

  componentWillMount() {
    const resp=this.findActionAndStatus();
    return resp;
  }

  async  findActionAndStatus() {
    let id = FlowRouter.getParam('id');
    let response = await findActionAndStatusActionHandler(id);
    if (response) {
      this.setState({loading: false, data: response})
    }
  }

  render(){
    const searchData = this.state.data;
    return (
      <div>
        { searchData ? (<MlSearchDepartmentContainer submit={this.submit} data={searchData} />) : ''}
      </div>
    )
  }
};
export default MlEditActionsAndStatuses = formHandler()(MlEditActionsAndStatuses);
