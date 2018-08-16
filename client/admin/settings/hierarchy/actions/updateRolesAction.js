import gql from 'graphql-tag'
import {client} from '../../../core/apolloConnection';

export async function updateRolesActionHandler(roles)
{
  const result = await client.mutate({
    mutation: gql`
   mutation  ($roles:[roleObject]){
        updateHierarchyRoles(
          roles:$roles          
        ){
            success,
            code,
            result
        }  
      }
    `,
    variables: {
      roles:roles
    }
  })
  const id = result.data.updateHierarchyRoles;
  return id
}
