/**
 * Created by mohammed.mohasin on 29/11/17.
 */

import gql from 'graphql-tag'
import {client} from '../../admin/core/apolloConnection';

export  function logoutActionHandler(token) {
  const logoutAction =  client.mutate({
    mutation: gql`
    mutation ($token: String!) {
      logout(token:$token){
        success,
        code,
        result
      }  
    }
    `,
    variables: {
      token:token
    }
  });
  return logoutAction;
}
