import gql from 'graphql-tag'
import {client} from '../../../core/apolloConnection';

export async function addProfessionActionHandler(ProfessionDetails) {
  let professionName = ProfessionDetails.professionName;
  let professionDisplayName = ProfessionDetails.professionDisplayName;
  let industryId = ProfessionDetails.industryId;
  let industryName = ProfessionDetails.industryName;
  let about = ProfessionDetails.about;
  let isActive = ProfessionDetails.isActive;

  const result = await client.mutate({
    mutation: gql`
    mutation  ($professionName: String, $professionDisplayName: String, $industryId: String,$industryName:String,$about:String,$isActive: Boolean, $moduleName:String, $actionName:String){
        CreateProfession(
          professionName: $professionName,
          professionDisplayName: $professionDisplayName,
          industryId: $industryId,
          industryName:$industryName,
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
      professionName,
      professionDisplayName,
      industryId,
      industryName,
      about,
      isActive,
      moduleName:"PROFESSION",
      actionName:"CREATE"
    }
  })
  const id = result.data.CreateProfession;
  return id
}
