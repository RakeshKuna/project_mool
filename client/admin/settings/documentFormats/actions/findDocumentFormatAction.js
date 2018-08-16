import gql from 'graphql-tag'
import {client} from '../../../core/apolloConnection';

export async function findDocumentFormatActionHandler(Id)
{
  let did=Id
  const result = await client.query({
    query: gql`
    query  ($id: String){
        findDocumentFormat(_id:$id){
         _id
        docFormatName
        docFormatDisplayName
        isActive
        about
      }
      }
    `,
    variables: {
      id:did
    },
    fetchPolicy: 'network-only'
  })
  const id = result.data.findDocumentFormat;
  console.log("DAta "+id);
  return id
}
