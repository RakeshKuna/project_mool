import gql from 'graphql-tag'
import {client} from '../../../core/apolloConnection';

export async function findCitizenshipActionHandler(CitizenshipTypeId) {
  let did=CitizenshipTypeId
  const result = await client.query({
    query: gql`
    query  ($id: String){
        FindCitizenship(_id:$id){
         id:_id
        citizenshipTypeName
        citizenshipTypeDisplayName
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
  const id = result.data.FindCitizenship;
  return id
}
