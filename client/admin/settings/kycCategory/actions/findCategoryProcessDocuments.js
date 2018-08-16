import gql from 'graphql-tag'
import {client} from '../../../core/apolloConnection';

export async function findCategoryProcessDocuments(Id)
{
  let did=Id
  const result = await client.query({
    query: gql`
    query  ($id: String){
        findCategoryProcessDocuments(_id:$id){
         _id
        isActive
        }
      }
    `,
    variables: {
      id:did
    },
    fetchPolicy: 'network-only'
  })
  const id = result.data.findCategoryProcessDocuments;
  return id
}
