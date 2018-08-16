import gql from 'graphql-tag'
import {client} from '../../core/apolloConnection';

export async function updateTemplateAssignmentActionHandler(templateId,templateDetails) {
  let tid=templateId;
  const result = await client.mutate({
    mutation: gql`
    mutation  ($id:String,$template: templateInput){
        updateTemplateAssignment(
          id: $id,
          template: $template,
        ){
            success,
            code,
            result
        }  
      }
    `,
    variables: {
      id : tid,
      template :templateDetails
    }
  })
  const id = result.data.updateTemplateAssignment;
  return id
}
