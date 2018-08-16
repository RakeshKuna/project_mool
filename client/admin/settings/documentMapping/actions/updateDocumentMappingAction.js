import gql from 'graphql-tag'
import {client} from '../../../core/apolloConnection';

export async function updateDocumentMappingActionHandler(did,details) {

  const result = await client.mutate({
    mutation: gql`
   mutation  ($documentId:String, $document: documentInput, $moduleName:String, $actionName:String){
       updateDocument(
       documentId: $documentId,
       document: $document,
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
      documentId : did,
      document: details,
      moduleName:"DOCUMENTMAPPING",
      actionName:"UPDATE"
    }
  })
  const id = result.data.updateDocument;
  return id
}
