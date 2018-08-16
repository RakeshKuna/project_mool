import gql from 'graphql-tag'
import {client} from '../../../core/apolloConnection';

export async function addDocumentMappingActionHandler(Details) {

  const result = await client.mutate({
    mutation: gql`
        mutation ($documentInput:documentInput, $moduleName:String, $actionName:String){
            createDocument(
                document: $documentInput,
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
      documentInput: Details,
      moduleName:"DOCUMENTMAPPING",
      actionName:"CREATE"
    }
  })
  const id = result.data.createDocument;
  return id
}
