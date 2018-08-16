import gql from "graphql-tag";
import {appClient} from "../../core/appConnection";
import {createLead} from "../actions/createLead";
import {createleadsquaredActivity} from "../../../commons/leadsquared/createleadsquaredActivity";

//todo:// make the registerAs function from here only remove the dependency from admin
export async function registerAsInfo(registrationDetails, Id) {
  let registration = registrationDetails;
  let registrationId = Id;
  const result = await appClient.mutate({
    mutation: gql`
    mutation  ($registration: registrationInfoInput!, $registrationId: String!,$moduleName:String!, $actionName:String!){
        registerAs(
          registration : $registration,
          registrationId : $registrationId,
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
      registrationId,
      moduleName: "REGISTRATION",
      actionName: "CREATE",
    }
  })
  const id = result.data.registerAs;
  //trigger leadsquared lead and activity
  if (id.success) {
    const lead = await createLead(registrationDetails, Meteor.settings.public.LEADSQUARED_URL)
    const activity = await createleadsquaredActivity(registrationDetails.email, Meteor.settings.public.createNewUser.code, Meteor.settings.public.createNewUser.message, Meteor.settings.public.LEADSQUARED_ACTIVITY_URL)
  }
  return id
}
