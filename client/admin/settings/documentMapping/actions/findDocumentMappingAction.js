import gql from 'graphql-tag'
import {client} from '../../../core/apolloConnection';

export async function findDocumentMappingActionHandler(Id)
{
  let did=Id
  const result = await client.query({
    query: gql`
    query  ($id: String){
        findDocument(documentId:$id){
          documentId
          documentName
          documentDisplayName
          validity 
          inputLength
          remarks
          allowableMaxSize
          issuingAuthority
        allowableFormat
        clusters
        chapters
        subChapters
        kycCategory
        documentType
        isActive
      }
      }
    `,
    variables: {
      id:did
    },
    fetchPolicy: 'network-only'
  })
  const id = result.data.findDocument;
  return id
}
