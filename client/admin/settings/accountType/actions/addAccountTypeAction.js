import gql from 'graphql-tag'
import {client} from '../../../core/apolloConnection';

export async function addAccountActionHandler(AccountDetails) {
  let accountName = AccountDetails.accountName;
  let accountDisplayName = AccountDetails.accountDisplayName;
  let accountDescription = AccountDetails.accountDescription;
  let isActive = AccountDetails.isActive;
  const result = await client.mutate({
    mutation: gql`
    mutation  ($accountName: String, $accountDisplayName: String, $accountDescription: String,$isActive: Boolean, $moduleName:String, $actionName:String){
        CreateAccount(
          accountName: $accountName,
          accountDisplayName: $accountDisplayName,
          accountDescription: $accountDescription,
          isActive :$isActive,
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
      accountName,
      accountDisplayName,
      accountDescription,
      isActive,
      moduleName:"TEMPLATE",
      actionName:"CREATE"
    }
  })
  const id = result.data.CreateAccount;
  return id
}
