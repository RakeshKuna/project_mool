import gql from 'graphql-tag'
import {client} from '../../../core/apolloConnection';

export async function findDocumentMappingActionHandler(kycid,processid)
{
  let kycId=kycid
  let processId=processid
  const result = await client.query({
    query: gql`
    query  ($kycId: String,$processId: String){
        findProcessDocuments(kycId:$kycId,processId:$processId) {
              _id
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
          validity
          isActive
        }
      }
    `,
    variables: {
      kycId,
      processId
    },
    fetchPolicy: 'network-only'
  })
  const id = result.data.findProcessDocuments;
  return id
}
