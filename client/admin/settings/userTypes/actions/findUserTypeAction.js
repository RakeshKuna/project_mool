import gql from 'graphql-tag'
import {client} from '../../../core/apolloConnection';

export async function findUserTypeActionHandler(userTypeId) {
 let did=userTypeId
  const result = await client.query({
    query: gql`
    query  ($id: String){
        FindUserType(_id:$id){
         id:_id
        userTypeName
        displayName
        communityCode
        communityName
        isActive
        userTypeDesc
      }
      }
    `,
    variables: {
      id:did
    },
    fetchPolicy: 'network-only'
  })
  const id = result.data.FindUserType;
  return id
}
