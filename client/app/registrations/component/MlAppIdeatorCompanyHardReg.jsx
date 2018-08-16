import React from "react";
import MlAppRegCompany from "./MlAppRegCompany";
import MlAppRegStep3 from "./MlAppRegStep3";
import MlAppRegStep4 from "./MlAppRegStep4";
import MlAppRegStep5 from "./MlAppRegStep5";
import MlAppRegStep6 from "./MlAppRegStep6";
import MlAppRegStep7 from "./MlAppRegStep7";

export default class MlAppIdeatorCompanyHardReg extends React.Component {

  constructor(props) {
    super(props);
    this.getRegistrationSteps.bind(this);
  }

  getRegistrationSteps(props) {
    let hardRegSteps = [
      {
        name: 'Additional Info',
        'icon': <span className="ml ml-additional-Information"></span>,
        component: <MlAppRegCompany {...props} />
      },
      {
        name: 'Contact Details',
        'icon': <span className="ml flaticon-ml-agenda"></span>,
        component: <MlAppRegStep3 {...props} />
      },
      {
        name: 'Social Links',
        'icon': <span className="ml ml-social-Links"></span>,
        component: <MlAppRegStep4 {...props} />
      },
      {
        name: 'KYC\'s Documents',
        'icon': <span className="ml ml-kyc-document"></span>,
        component: <MlAppRegStep5 {...props} />
      },
      {
        name: 'Payment Gateway',
        'icon': <span className="ml ml-payments"></span>,
        component: <MlAppRegStep6 {...props} />
      },
      {
        name: 'History',
        'icon': <span className="ml my-ml-enter_arrow"></span>,
        component: <MlAppRegStep7 {...props} />
      }
      ];
    return hardRegSteps;
  }

  componentWillMount() {
    this.props.setHardRegistrationSteps(this.getRegistrationSteps(this.props));
  }

  compareQueryOptions(a, b) {
    return JSON.stringify(a) === JSON.stringify(b);
  };

  componentWillUpdate(nextProps) {
    if (!this.compareQueryOptions(this.props, nextProps)) {
      this.props.setHardRegistrationSteps(this.getRegistrationSteps(nextProps));
    }
  }

  render() {
    return null;
  }
};
