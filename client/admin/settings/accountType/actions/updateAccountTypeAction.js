import gql from 'graphql-tag'
import {client} from '../../../core/apolloConnection';

export async function updateAccountTypeActionHandler(AccountType) {
  let _id=AccountType.id;
  let accountName = AccountType.accountName;
  let accountDisplayName = AccountType.accountDisplayName;
  let accountDescription = AccountType.accountDescription;
  let isActive = AccountType.isActive
  const result = await client.mutate({
    mutation: gql`
    mutation  ($_id:String,$accountName: String, $accountDisplayName: String, $accountDescription: String,$isActive: Boolean, $moduleName:String, $actionName:String){
        UpdateAccount(
          _id:$_id
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
      _id,
      accountName,
      accountDisplayName,
      accountDescription,
      isActive,
      moduleName:"TEMPLATE",
      actionName:"UPDATE"
    }
  })
  const id = result.data.UpdateAccount;
  return id
}
