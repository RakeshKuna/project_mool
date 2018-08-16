import React, {Component, PropTypes} from 'react';
import {render} from 'react-dom';
import MlTableViewContainer from "../../../core/containers/MlTableViewContainer";
import {mlShareTableConfig} from "../config/MlShareConfig";
// import CreateRequestComponent from './CreateRequestComponent'
import _ from 'lodash';

export default class MlProcessSetupRequestsList extends Component {
  constructor(props){
    super(props);
    this.state={showCreateRequestComponent:[], time: new Date()};
    // this.refreshList = this.refreshList.bind(this);

  }

  addRequestHandler(){
    this.setState({showCreateRequestComponent:true});
  }

  render() {
    // let actions= mlShareTableConfig.actionConfiguration;
    // actions = [];
    // action.handler=this.addRequestHandler.bind(this);
    // let showCreateRequestComponent=this.state.showCreateRequestComponent;
    // let refreshList = this.refreshList.bind(this);
    return (
      <div className="admin_main_wrap">
        <div className="admin_padding_wrap">
          <h2>Share </h2>
          <MlTableViewContainer {...mlShareTableConfig} forceFetch={false}/>
          {/*{showCreateRequestComponent?<CreateRequestComponent refreshList={refreshList} openPopUp={true}/>:<div></div>}*/}
        </div>
      </div>
    )
  }
}
