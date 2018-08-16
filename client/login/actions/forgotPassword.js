/**
 * Created by pankaj on 3/6/17.
 */

import gql from 'graphql-tag'
import {client} from '../../admin/core/apolloConnection';

export async function forgotPasswordActionHandler(email) {
  console.log(email);
  const result = await client.mutate({
    mutation: gql`
    mutation ($email: String) {
      forgotPassword(email:$email){
        success,
        code,
        result
      }
      
    }
    `,
    variables: {
      email:email,
      // moduleName:"REGISTRATION",
      // actionName:"READ"
    }
  })
  console.log(result);
  const id = result.data.forgotPassword;
  return id
}
