import gql from 'graphql-tag'
import {client} from '../../core/apolloConnection';

export async function findStepTemplatesAssignmentActionHandler(templateId) {
  let tid       = templateId
  const result  = await client.query({
    query: gql`
   query  ($id: String){
        findAssignedTemplates(id:$id) {
          _id
          templateprocess
          templatesubProcess
          templateProcessName
          templateSubProcessName
          templateGroupName
          createdBy
          createdDate
          templateclusterId
          templateclusterName
          templatechapterId
          templatechapterName
          templatesubChapterId
          templatesubChapterName
          templatecommunityCode
          templatecommunityName
          templateuserType
          templateidentity
          assignedTemplates{
             stepCode
             templateCode
             stepName
             templateName
          }
      }
    }
    `,
    variables: {
      id:tid
    },
    fetchPolicy: 'network-only'
  })
  const id = result.data.findAssignedTemplates;
  return id
}
