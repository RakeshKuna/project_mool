import gql from 'graphql-tag'
import {client} from '../../../core/apolloConnection';

export async function updateAwardTypeActionHandler(AwardType) {
  let _id=AwardType.id;
  let awardName = AwardType.awardName;
  let awardDisplayName = AwardType.awardDisplayName;
  let about = AwardType.about;
  let isActive = AwardType.isActive
  const result = await client.mutate({
    mutation: gql`
    mutation  ($_id:String,$awardName: String, $awardDisplayName: String, $about: String,$isActive: Boolean, $moduleName:String, $actionName:String){
        UpdateAward(
          _id:$_id
          awardName: $awardName,
          awardDisplayName: $awardDisplayName,
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
      awardName,
      awardDisplayName,
      about,
      isActive,
      moduleName: "AWARDS",
      actionName: "UPDATE"
    }
  })
  const id = result.data.UpdateAward;
  return id
}
