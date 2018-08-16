import React, {Component, PropTypes} from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';
import MlActionComponent from "../../../../commons/components/actions/ActionComponent";
import MlListViewContainer from "../../../core/containers/MlListViewContainer";
import {mlOfficePackageListConfig} from "../config/mlOfficePackageConfig";

var FontAwesome = require('react-fontawesome');


export default class MlOfficePackageList extends Component{
  constructor(props){
      super(props)
      this.fetchOfficeCards.bind(this);
  }

  componentDidMount(){
    // this.fetchOfficeCards();
  }

  async createOfficeCard() {

  }

  async fetchOfficeCards(){
  }

  render(){
    let MlActionConfig = [
      {
        showAction: true,
        actionName: 'add',
        handler: async(event) => this.props.handler(this.createOfficeCard.bind(this))
      }
    ]
    return(
      <div className="admin_main_wrap">
        <MlListViewContainer {...mlOfficePackageListConfig} />
      </div>
    )
  }
}
