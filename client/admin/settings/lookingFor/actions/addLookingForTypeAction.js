import gql from 'graphql-tag'
import {client} from '../../../core/apolloConnection';

export async function addLookingForActionHandler(LookingForDetails) {
  let lookingForName = LookingForDetails.lookingForName;
  let lookingForDisplayName = LookingForDetails.lookingForDisplayName;
  let communityCode = LookingForDetails.communityCode;
  let communityName = LookingForDetails.communityName;
  let about = LookingForDetails.about;
  let isActive = LookingForDetails.isActive;

  const result = await client.mutate({
    mutation: gql`
    mutation  ($lookingForName: String, $lookingForDisplayName: String, $communityCode: String,$communityName:String,$about:String,$isActive: Boolean, $moduleName:String, $actionName:String){
        CreateLookingFor(
          lookingForName: $lookingForName,
          lookingForDisplayName: $lookingForDisplayName,
          communityCode: $communityCode,
          communityName:$communityName,
          about:$about,
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
      lookingForName,
      lookingForDisplayName,
      communityCode,
      communityName,
      about,
      isActive,
      moduleName: "LOOKINGFOR",
      actionName: "CREATE"
    }
  })
  const id = result.data.CreateLookingFor;
  return id
}
