import gql from 'graphql-tag'
import {client} from '../../../core/apolloConnection';

export async function findEntityTypeActionHandler(EntityTypeId) {
  let did=EntityTypeId
  const result = await client.query({
    query: gql`
    query  ($id: String){
        FindEntity(_id:$id){
         id:_id
        entityName
        entityDisplayName
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
  const id = result.data.FindEntity;
  return id
}
