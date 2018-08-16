import React, {Component} from 'react';
import { render } from 'react-dom';
import MlAppStep1ExternalUser from './MlAppStep1ExternalUser';
import {initalizeFloatLabel} from '../../../commons/utils/formElemUtil';
export default class SoftRegistrationForExternalUser extends Component{

  constructor(props){
    super(props);
    this.getRegistrationSteps.bind(this);
  }

  getRegistrationSteps(props){
    let softRegSteps=[{name: 'Basic info','icon':<span className="ml ml-basic-Information"></span>, component: <MlAppStep1ExternalUser {...props}/>}];

    return softRegSteps;
  }
  componentWillMount(){
    this.props.setSoftRegistrationSteps(this.getRegistrationSteps(this.props));
  }

  componentDidMount(){
    initalizeFloatLabel();
  }

  compareQueryOptions(a, b) {
    return JSON.stringify(a) === JSON.stringify(b);
  };

  componentWillUpdate(nextProps){
    if(!this.compareQueryOptions(this.props,nextProps)){
      this.props.setSoftRegistrationSteps(this.getRegistrationSteps(nextProps));
    }
  }

  render(){
    return null;
  }
};
