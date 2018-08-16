import gql from 'graphql-tag'
import {client} from '../../../core/apolloConnection';

export async function upsertProcessDocActionHandler(processDocDetails) {
    let id=processDocDetails.id;
    let kycCategoryId=processDocDetails.kycCategoryId;
    let docTypeId=processDocDetails.docTypeId;
    let documentId=processDocDetails.documentId;
    let isMandatory=processDocDetails.isMandatory;
    let isActive=processDocDetails.isActive;
   const result = await client.mutate({
   mutation: gql`
  mutation  ($id:String, $kycCategoryId: String, $docTypeId: String, $documentId: String, $isMandatory: Boolean, $isActive: Boolean,$moduleName:String, $actionName:String){
    upsertProcessDocument(id:$id,kycCategoryId: $kycCategoryId,docTypeId:$docTypeId,documentId:$documentId,isMandatory:$isMandatory,isActive:$isActive,moduleName:$moduleName,
        actionName:$actionName) {
          success
          code
          result
        }
   }
   `,
   variables: {
     id,
     kycCategoryId,
     docTypeId,
     documentId,
     isMandatory,
     isActive,
     moduleName:"PROCESSMAPPING",
     actionName:"UPDATE"
   }
   })
  const resp = result.data.upsertProcessDocument;
  return resp
}
