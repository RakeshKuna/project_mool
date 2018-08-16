import gql from 'graphql-tag'
import {client} from '../../../core/apolloConnection';

export async function rejectStatusForUser(registration,regTyp) {
  let registrationId=registration;
  let regType=regTyp;
  const result = await client.mutate({
    mutation: gql`
     mutation($moduleName:String!,$actionName:String!,$registrationId:String!,$regType:String){
      RejectedStatusForUser(moduleName:$moduleName,actionName:$actionName,registrationId:$registrationId,regType:$regType) {
          success
          code
          result
        }
      }
    `,
    variables: {
      moduleName:"REGISTRATION",
      actionName:"UPDATE",
      regType:regType,
      registrationId:registrationId
    }
  })

  const id = result.data.RejectedStatusForUser;
  return id
}
