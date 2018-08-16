import React, {Component, PropTypes} from 'react';
import {render} from 'react-dom';
import MlTableViewContainer from "../../../core/containers/MlTableViewContainer";
import {mlHierarchyDepartmentsTableConfig} from "../../hierarchy/config/mlHierarchyDepartments";

import _ from 'lodash';

export default class MlHierarchyDepartmentsList extends Component {
  constructor(props){
    super(props);
    this.state={ time: new Date()};
  }

  render() {
    let config = mlHierarchyDepartmentsTableConfig
    config.params = {clusterId:this.props.clusterId,subChapterId:this.props.subChapterId,defaultSubChapter:this.props.defaultSubChapter}
    return (

      <div className="admin_main_wrap">
        <div className="admin_padding_wrap">
          <h2>Departments & SubDepartments </h2>
          <MlTableViewContainer {...config}  forceFetch={false}/>
        </div>
      </div>
    )
  }
}
