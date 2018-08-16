
import gql from 'graphql-tag'
import {client} from '../../../core/apolloConnection';

export async function updateRoleActionHandler(roleDetails) {
  let id=roleDetails.id;
  let role=roleDetails.roleObject
  const result = await client.mutate({
    mutation: gql`
   mutation  ($id:String!, $role: roleObject!, $moduleName:String, $actionName:String){
       updateRole(
        roleId: $id,
        role: $role,
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
      id,
      role,
      moduleName:"ROLES",
      actionName:"UPDATE"
    }
  })
  const res = result.data.updateRole;
  return res
}

