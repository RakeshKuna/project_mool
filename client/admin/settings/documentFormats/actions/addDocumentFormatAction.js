import gql from 'graphql-tag'
import {client} from '../../../core/apolloConnection';

export async function addDocumentFormatActionHandler(DocFormatDetails)
{
  let docFormatName = DocFormatDetails.docFormatName;
  let docFormatDisplayName = DocFormatDetails.docFormatDisplayName;
  let about = DocFormatDetails.about;
  let isActive = DocFormatDetails.isActive;

  const result = await client.mutate({
    mutation: gql`
        mutation ($documentFormat:documentFormatObject, $moduleName:String, $actionName:String){
            createDocumentFormat(
                documentFormat: $documentFormat,
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
      documentFormat: DocFormatDetails,
      moduleName:"DOCUMENTFORMAT",
      actionName:"CREATE"
    }
  })
  const id = result.data.createDocumentFormat;
  return id
}
