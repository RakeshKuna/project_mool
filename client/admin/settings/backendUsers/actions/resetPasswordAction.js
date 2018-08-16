import gql from 'graphql-tag'
import {client} from '../../../core/apolloConnection';

export async function resetPasswordActionHandler(userDetails) {
  let password=userDetails.password
  const result = await client.mutate({
    mutation: gql`
   mutation  ( $password: String!, $moduleName:String, $actionName:String){
   resetPassword(
   password: $password,
   moduleName:$moduleName,
   actionName:$actionName
   ){
      success,
      code,
      result
      } 
   }
   `,
    variables: {
      password,
      moduleName:"USERS",
      actionName:"UPDATE"
    }
  })
  const id = result.data.resetPassword;
  return id
}
