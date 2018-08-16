import gql from 'graphql-tag'
import {client} from '../../../core/apolloConnection';

export async function updateHierarchyAssignmentsActionHandler(hierarchy)
{
  const result = await client.mutate({
    mutation: gql`
   mutation  ($hierarchy:HierarchyAssignmentInput){
        updateHierarchyAssignment(
          hierarchy:$hierarchy         
        ){
            success,
            code,
            result
        }  
      }
    `,
    variables: {
      hierarchy:hierarchy
    }
  })
  const id = result.data.updateHierarchyAssignment;
  return id
}
