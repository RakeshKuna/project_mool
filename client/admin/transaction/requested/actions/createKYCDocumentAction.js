import gql from 'graphql-tag'
import {client} from '../../../core/apolloConnection';


export async function createKYCDocument(registrationId,documentID,kycDocID,docTypeID) {
  const result = await client.mutate({
    mutation: gql`
     mutation($registrationId:String,$documentID:String,$kycDocID:String,$docTypeID:String){
    createKYCDocument(registrationId:$registrationId,documentID:$documentID,kycDocID:$kycDocID,docTypeID:$docTypeID){
      success
      code
      result
    }
  }
    `,
    variables: {
      registrationId:registrationId,
      documentID:documentID,
      kycDocID:kycDocID,
      docTypeID:docTypeID
    }
  })
  const id = result.data.createKYCDocument;
  return id
}
