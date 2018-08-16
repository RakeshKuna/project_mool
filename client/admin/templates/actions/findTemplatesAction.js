import gql from 'graphql-tag'
import {client} from '../../core/apolloConnection';

export async function findTemplatesActionHandler(templateId,code) {
  let tid       = templateId
  const result  = await client.query({
    query: gql`   
   query  ($id: String,$stepCode:String){
      findTemplates(id:$id,stepCode:$stepCode){
        procesId
        subProcessId
        templates {
          stepCode
          stepName
          templateCode
          templateName
          isActive
          createdDate
          templateImage
        } 
      }
      }
    `,
    variables: {
      id:tid,
      stepCode:code
    },
    fetchPolicy: 'network-only'
  })
  const id = result.data.findTemplates;
  return id
}
