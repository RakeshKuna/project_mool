import gql from 'graphql-tag'
import {client} from '../../../core/apolloConnection';

export async function findAwardActionHandler(AwardTypeId) {
  let did=AwardTypeId
  const result = await client.query({
    query: gql`
    query  ($id: String){
        FindAward(_id:$id){
         id:_id
        awardName
        awardDisplayName
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
  const id = result.data.FindAward;
  return id
}
