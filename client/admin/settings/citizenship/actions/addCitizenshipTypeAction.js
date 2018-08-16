import gql from 'graphql-tag'
import {client} from '../../../core/apolloConnection';

export async function addCitizenshipActionHandler(CitizenshipDetails) {
  let citizenshipTypeName = CitizenshipDetails.citizenshipTypeName;
  let citizenshipTypeDisplayName = CitizenshipDetails.citizenshipTypeDisplayName;
  let about = CitizenshipDetails.about;
  let isActive = CitizenshipDetails.isActive;

  const result = await client.mutate({
    mutation: gql`
    mutation  ($citizenshipTypeName: String, $citizenshipTypeDisplayName: String, $about:String, $isActive: Boolean, $moduleName:String, $actionName:String){
        CreateCitizenship(
          citizenshipTypeName: $citizenshipTypeName,
          citizenshipTypeDisplayName: $citizenshipTypeDisplayName,
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
      citizenshipTypeName,
      citizenshipTypeDisplayName,
      about,
      isActive,
      moduleName:"CITIZENSHIP",
      actionName:"CREATE"
    }
  })
  const id = result.data.CreateCitizenship;
  return id
}
