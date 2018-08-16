/**
 * Created by vishwadeep on 14/6/17.
 */

import React, { Component } from "react";
// import MlAppTransaction from '../../../profile/office/components/officeTransaction/MlAppTransaction'
import MlAppRegistrationWizard from '../../../registrations/component/MlAppRegistrationWizard'
import MlConnectionRequest from './MlConnectionRequest';
import MlInvestmentRequest from './MlInvestmentRequest'
import MlShareCalendar from './MlShareCalendar';
import MlAppointmentsDetailsComponent from '../../../myTransaction/component/appointments/component/MlAppointmentsDetailsComponent';

export default function MlGenericTransactionAccordion(props) {
  let data = props.data || {}
  switch (data.transactionType) {
    case 'officeRequest': {
      // return <MlOffice config={data}/>
      return <MlEmptyView config={data} data={data} />
      break;
    }
    case 'appointment': {
      // return (<h1>appointment testing</h1>);
      return (
        <MlAppointmentsDetailsComponent
          transactionType={data.activity}
          appointmentId={data._id}
          docId={data.docId} />
      );
      break;
    }
    case 'manageSchedule': {
      return <MlEmptyView data={data} />
      break;
    }
    case 'office': {
      return getOfficeActivity(data)
      break;
    }
    case 'registration': {
      // return <MlAppTransaction config={data}/>
      return <MlAppRegistrationWizard config={data._id} isAccodion={true} />
      break;
    }
    case 'sharing':
      return <MlShareCalendar data={data} />
      break;
    case 'connectionRequest':
    case 'interaction': {
      return <MlConnectionRequest data={data} />
      break;
    }
    case 'investments': {
      return <MlInvestmentRequest data={data} />
      break;
    }
    default:
      return <MlEmptyView data={data} />
  }
}

function getOfficeActivity(data) {
  switch (data.activity) {
    case 'officeDeactivate': {
      console.log('officeDeactivate')
      return <MlEmptyView data={data} />
      break;
    }
    case 'officeBearerInvitation': {
      console.log('officeBearerInvitation')
      return <MlAppRegistrationWizard config={data.registrationId} isAccodion={true} />
      break;
    }
    case 'officeBearerRetire': {
      console.log('officeBearerRetire')
      return <MlEmptyView data={data} />
      break;
    }
    case 'principal': {
      console.log('principal')
      return <MlEmptyView data={data} />
      break;
    }
    case 'officeBearerGoIndependent': {
      console.log('officeBearerGoIndependent')
      return <MlEmptyView data={data} />
      break;
    }
    default:
      return <MlEmptyView data={data} />
  }
}

export class MlOffice extends Component {
  render() {
    return (
      <div>
        this is a test id : {this.props.config.transactionType}
      </div>
    )
  }
}

export class MlEmptyView extends Component {
  render() {
    let { data } = this.props;
    data = data ? data : {};
    console.log(data);
    return (<div>
      {data.transactionType} {data.status ? '- ' + data.status : ''}
      {/*UI Not available*/}
    </div>)
  }
}
