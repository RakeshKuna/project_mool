/**
 * Created by pankaj on 3/6/17.
 */

import gql from 'graphql-tag'
import {client} from '../../admin/core/apolloConnection';

export async function resetPasswordActionHandler(token, password) {
  const result = await client.mutate({
    mutation: gql`
    mutation ($token: String!, $password: String!) {
      resetPasswords(token:$token, password:$password){
        success,
        code,
        result
      }
    }
    `,
    variables: {
      token:token,
      password:password
      // moduleName:"REGISTRATION",
      // actionName:"READ"
    }
  })
  console.log(result);
  const id = result.data.resetPasswords;
  return id
}
