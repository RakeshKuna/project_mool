import gql from 'graphql-tag'
import {client} from '../../../core/apolloConnection';

export async function findIndustryActionHandler(IndustryTypeId) {
  let did=IndustryTypeId
  const result = await client.query({
    query: gql`
    query  ($id: String){
        FindIndustry(_id:$id){
         id:_id
        industryName
        industryDisplayName
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
  const id = result.data.FindIndustry;
  return id
}
