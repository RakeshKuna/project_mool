import gql from 'graphql-tag'
import {client} from '../../../core/apolloConnection';

export async function updateStageOfCompanyTypeActionHandler(StageOfCompanyType) {
  let _id=StageOfCompanyType.id;
  let stageOfCompanyName = StageOfCompanyType.stageOfCompanyName;
  let stageOfCompanyDisplayName = StageOfCompanyType.stageOfCompanyDisplayName;
  let about = StageOfCompanyType.about;
  let isActive = StageOfCompanyType.isActive
  const result = await client.mutate({
    mutation: gql`
    mutation  ($_id:String,$stageOfCompanyName: String, $stageOfCompanyDisplayName: String, $about: String,$isActive: Boolean, $moduleName:String, $actionName:String){
        UpdateStageOfCompany(
          _id:$_id
          stageOfCompanyName: $stageOfCompanyName,
          stageOfCompanyDisplayName: $stageOfCompanyDisplayName,
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
      stageOfCompanyName,
      stageOfCompanyDisplayName,
      about,
      isActive,
      moduleName:"STAGEOFCOMPANY",
      actionName:"UPDATE"
    }
  })
  const id = result.data.UpdateStageOfCompany;
  return id
}
