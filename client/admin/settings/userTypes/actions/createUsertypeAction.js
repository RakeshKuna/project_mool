import gql from 'graphql-tag'
import {client} from '../../../core/apolloConnection';

export async function createUserTypeActionHandler(userType) {
  const result = await client.mutate({
    mutation: gql`
    mutation ($userType:userTypeObject, $moduleName:String, $actionName:String){
          createUserType(
              userType: $userType,
              moduleName:$moduleName,
              actionName:$actionName
          ){
          success,
          code,
          result
          } 
       }
    `,
    variables: {
      userType: userType,
      moduleName:"USERTYPE",
      actionName:"CREATE"
    }
  })
  const id = result.data.createUserType;
  return id
}
