import gql from "graphql-tag";
import {appClient} from "../../core/appConnection";


export async function createKYCDocument(registrationId, documentID, kycDocID, docTypeID) {
  const result = await appClient.mutate({
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
      registrationId: registrationId,
      documentID: documentID,
      kycDocID: kycDocID,
      docTypeID: docTypeID
    }
  })
  const id = result.data.createKYCDocument;
  return id
}
