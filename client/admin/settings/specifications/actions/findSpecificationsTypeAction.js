import gql from 'graphql-tag'
import {client} from '../../../core/apolloConnection';

export async function findSpecificationActionHandler(SpecificationTypeId) {
  let did=SpecificationTypeId
  const result = await client.query({
    query: gql`
    query  ($id: String){
        FindSpecification(_id:$id){
         id:_id
        specificationName
        specificationDisplayName
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
  const id = result.data.FindSpecification;
  return id
}
