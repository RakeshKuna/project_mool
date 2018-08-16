import React from 'react';
import { render } from 'react-dom';

import Individual from './IdeatorIndividualComponent'
import Step3 from './step3';
import Step4 from './step4';
import Step5 from './step5';
import MlRegStep6 from './MlRegStep6';
import Step7 from './step7';

export default class IdeatorIndividualHardReg extends React.Component{

  constructor(props){
    super(props);
    this.getRegistrationSteps.bind(this);
  }

  getRegistrationSteps(props){
    let hardRegSteps=[
      {name: 'Additional Info','icon':<span className="ml ml-additional-Information"></span>,  component: <Individual {...props} />},
      {name: 'Contact Details','icon':<span className="ml ml-address-book"></span>, component: <Step3 {...props} />},
      {name: 'Social Links','icon':<span className="ml ml-social-Links"></span>,  component: <Step4 {...props} />},
      {name: 'KYC Documents','icon':<span className="ml ml-kyc-document"></span>,  component: <Step5 {...props} />},
      {name: 'Payment Gateway','icon':<span className="ml ml-payments"></span>, component: <MlRegStep6 {...props} />},
      {name: 'History','icon':<span className="ml my-ml-history"></span>, component: <Step7 {...props} />}];
    return hardRegSteps;
  }
  componentWillMount(){
    this.props.setHardRegistrationSteps(this.getRegistrationSteps(this.props));
  }

  compareQueryOptions(a, b) {
    return JSON.stringify(a) === JSON.stringify(b);
  };

  componentWillUpdate(nextProps){
    if(!this.compareQueryOptions(this.props,nextProps)){
      this.props.setHardRegistrationSteps(this.getRegistrationSteps(nextProps));
    }
  }

  render(){
    return null;
  }
};
