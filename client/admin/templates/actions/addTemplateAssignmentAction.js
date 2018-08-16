import gql from 'graphql-tag'
import {client} from '../../core/apolloConnection';

export async function addTemplateAssignmentActionHandler(template)
{
  const result = await client.mutate({
    mutation: gql`
    mutation ($template:templateInput){
        createTemplateAssignment(template:$template) {
            success
            code
            result
          }
      }
    `,
    variables: {
      template:template
    }
  })
  const id = result.data.createTemplateAssignment;
  return id
}
