import gql from 'graphql-tag'
import {client} from '../../../core/apolloConnection';

export async function updateTemplateActionHandler(templateid,templateCodeValue,status) {
let id=templateid,templateCode=templateCodeValue,isActive=status;

  const result = await client.mutate({
    mutation: gql`
   mutation($id:String,$templateCode:String,$isActive:Boolean){
        updateStepAssignedTemplate(id:$id,templateCode:$templateCode,isActive:$isActive) {
          success
          code
          result
        } 
         
      }
    `,
    variables: {
        id,
      templateCode,
      isActive
    }
  })
  let Id = result.data.updateStepAssignedTemplate;
  return Id
}
