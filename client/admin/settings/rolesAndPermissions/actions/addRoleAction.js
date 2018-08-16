import gql from 'graphql-tag'
import {client} from '../../../core/apolloConnection';

export async function addRoleActionHandler(roleDetails) {
let role = roleDetails;
  const result = await client.mutate({
    mutation: gql`
    mutation  ($role: roleObject, $moduleName:String, $actionName:String){
        createRole(
          role : $role,
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
      role,
      moduleName:"ROLES",
      actionName:"CREATE"
    }
  })
  const id = result.data.createRole;
  return id
}
