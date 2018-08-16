import gql from 'graphql-tag'
import {client} from '../../../core/apolloConnection';

export async function findBusinessTypeActionHandler(BusinessTypeId) {
  let did=BusinessTypeId
  const result = await client.query({
    query: gql`
    query  ($id: String){
        FindBusinessType(_id:$id){
         id:_id
        businessTypeName
        businessTypeDisplayName
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
  const id = result.data.FindBusinessType;
  return id
}
