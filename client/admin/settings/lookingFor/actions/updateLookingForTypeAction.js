import gql from 'graphql-tag'
import {client} from '../../../core/apolloConnection';

export async function updateLookingForTypeActionHandler(LookingForType) {
  let _id=LookingForType.id;
  let lookingForName = LookingForType.lookingForName;
  let lookingForDisplayName = LookingForType.lookingForDisplayName;
  let communityCode = LookingForType.communityCode;
  let communityName = LookingForType.communityName;
  let about = LookingForType.about;
  let isActive = LookingForType.isActive
  const result = await client.mutate({
    mutation: gql`
    mutation  ($_id:String,$lookingForName: String, $lookingForDisplayName: String, $communityCode:String, $communityName:String, $about: String,$isActive: Boolean, $moduleName:String, $actionName:String){
        UpdateLookingFor(
          _id:$_id
          lookingForName: $lookingForName,
          lookingForDisplayName: $lookingForDisplayName,
          communityCode: $communityCode,
          communityName : $communityName,
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
      lookingForName,
      lookingForDisplayName,
      communityCode,
      communityName,
      about,
      isActive,
      moduleName: "LOOKINGFOR",
      actionName: "UPDATE"
    }
  })
  const id = result.data.UpdateLookingFor;
  return id
}
