import gql from 'graphql-tag'
import {client} from '../../../core/apolloConnection';

export async function addGenderActionHandler(Details)
{
  let genderName = Details.genderName||null;
  let genderDisplayName = Details.genderDisplayName||null;
  let aboutGender = Details.aboutGender||null;
  let isActive = Details.isActive;
  let genderUploadIcon=Details.genderUploadIcon||null;
  let genderInfo={genderName,genderDisplayName,aboutGender,genderUploadIcon};
  const result = await client.mutate({
    mutation: gql`
    mutation ($masterData:MasterSettingsRequest){
        createMasterSetting(moduleName:"MASTER_SETTINGS",actionName:"CREATE",type:GENDER,masterData:$masterData) 
      }
    `,
    variables: {
      masterData:{"genderInfo":genderInfo,"isActive":isActive},
    }
  })
  const id = result.data.createMasterSetting;
  return id
}
