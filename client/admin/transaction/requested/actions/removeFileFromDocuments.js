import gql from 'graphql-tag'
import {client} from '../../../core/apolloConnection';

export async function removeFileFromDocumentsActionHandler(fileId,docTypeId,documentId,registrationId) {
 /* let clusterId = clusterIdInfo
  let userType =userTypeInfo
  let communityType=communityTypeInfo*/
  const result = await client.mutate({
    mutation: gql`
     mutation($fileId: String,$docTypeId: String, $documentId: String, $registrationId: String!, $actionName: String!, $moduleName: String! ){
           RemoveFileFromDocuments(fileId:$fileId,docTypeId:$docTypeId,documentId:$documentId,registrationId:$registrationId,actionName:$actionName,moduleName:$moduleName) {
            success
            code
            result
          }
        }
    `,
    variables: {
      fileId,
      docTypeId,
      documentId,
      registrationId,
      moduleName:"REGISTRATION",
      actionName:"UPDATE",
    },
    fetchPolicy: 'network-only'
  })
  const id = result.data.RemoveFileFromDocuments;
  return id
}
