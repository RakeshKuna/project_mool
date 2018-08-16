import gql from 'graphql-tag'
import {client} from '../../../core/apolloConnection';

export async function updateProfessionTypeActionHandler(ProfessionType) {
  let _id=ProfessionType.id;
  let professionName = ProfessionType.professionName;
  let professionDisplayName = ProfessionType.professionDisplayName;
  let industryId = ProfessionType.industryId;
  let industryName = ProfessionType.industryName;
  let about = ProfessionType.about;
  let isActive = ProfessionType.isActive
  const result = await client.mutate({
    mutation: gql`
    mutation  ($_id:String,$professionName: String, $professionDisplayName: String, $industryId:String, $industryName:String, $about: String,$isActive: Boolean, $moduleName:String, $actionName:String){
        UpdateProfession(
          _id:$_id
          professionName: $professionName,
          professionDisplayName: $professionDisplayName,
          industryId: $industryId,
          industryName : $industryName,
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
      professionName,
      professionDisplayName,
      industryId,
      industryName,
      about,
      isActive,
      moduleName:"PROFESSION",
      actionName:"UPDATE"
    }
  })
  const id = result.data.UpdateProfession;
  return id
}
