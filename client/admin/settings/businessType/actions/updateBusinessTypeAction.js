import gql from 'graphql-tag'
import {client} from '../../../core/apolloConnection';

export async function updateBusinessTypeActionHandler(BusinessType) {
  let _id=BusinessType.id;
  let businessTypeName = BusinessType.businessTypeName;
  let businessTypeDisplayName = BusinessType.businessTypeDisplayName;
  let about = BusinessType.about;
  let isActive = BusinessType.isActive
  const result = await client.mutate({
    mutation: gql`
    mutation  ($_id:String,$businessTypeName: String, $businessTypeDisplayName: String, $about: String,$isActive: Boolean, $moduleName:String, $actionName:String){
        UpdateBusinessType(
          _id:$_id
          businessTypeName: $businessTypeName,
          businessTypeDisplayName: $businessTypeDisplayName,
          about: $about,
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
      businessTypeName,
      businessTypeDisplayName,
      about,
      isActive,
      moduleName: "BUSINESSTYPE",
      actionName: "UPDATE"
    }
  })
  const id = result.data.UpdateBusinessType
  return id
}
