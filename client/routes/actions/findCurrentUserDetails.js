import gql from 'graphql-tag'
import {client} from '../../../client/admin/core/apolloConnection';

export async function findUserActionHandler(token) {
  let LoginToken=token
  const result = await client.query({
    query: gql`
    query  ($token: String){
        findUserOnToken(token:$token){
            success,
            code,
            result
        } 
      }
    `,
    variables: {
      token:LoginToken
    },
    fetchPolicy: 'network-only'
  })
  const id = result.data.findUserOnToken;
  return id
}
