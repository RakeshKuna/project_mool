import gql from 'graphql-tag'
import {client} from '../../../core/apolloConnection';
import {createLead} from '../actions/createLead'
import {createleadsquaredActivity} from '../../../../commons/leadsquared/createleadsquaredActivity'

export async function createRegistrationInfo(registrationDetails) {

  let LEADSQUARED_ACTIVITY_URL="https://api.leadsquared.com/v2/ProspectActivity.svc/Create?accessKey=u$rf80902d50b1b4a630551bbbfb1c95ef3&secretKey=2dda53b546b6e068978f2c68415b6967ec3331fb";
  let LEADSQUARED_URL="https://api.leadsquared.com/v2/LeadManagement.svc/Lead.Capture?accessKey=u$rf80902d50b1b4a630551bbbfb1c95ef3&secretKey=2dda53b546b6e068978f2c68415b6967ec3331fb";

  let registration = {}
  registration = registrationDetails;
  const result = await client.mutate({
    mutation: gql`
    mutation  ($registration: registrationInfoInput!, $moduleName:String!, $actionName:String!){
        createRegistration(
          registration : $registration,
          moduleName:$moduleName,
          actionName:$actionName,
        ) {
          success
          code
          result
        }
      }
    `,
    variables: {
      registration,
      moduleName:"REGISTRATION",
      actionName:"CREATE",
    }
  })
  const id = result.data.createRegistration;
  //trigger leadsquared lead and activity
  if(id.success) {
    const lead = await createLead(registrationDetails, LEADSQUARED_URL)
    const activity = await createleadsquaredActivity(registrationDetails.email, Meteor.settings.public.createNewUser.code,    Meteor.settings.public.createNewUser.message, LEADSQUARED_ACTIVITY_URL)
  }
  return id
}
