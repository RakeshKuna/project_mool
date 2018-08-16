import gql from 'graphql-tag'
import {client} from '../../../core/apolloConnection';

export async function updateGenderActionHandler(Details)
{
  let _id=Details._id;
  let genderName = Details.genderName||null;
  let genderDisplayName = Details.genderDisplayName||null;
  let aboutGender = Details.aboutGender||null;
  let isActive = Details.isActive;
  let genderUploadIcon=Details.genderUploadIcon||null;
  let genderInfo={genderName,genderDisplayName,aboutGender,genderUploadIcon};
  console.log(_id);
  const result = await client.mutate({
    mutation: gql`
    mutation ($masterData:MasterSettingsRequest){
        updateMasterSetting(moduleName:"MASTER_SETTINGS",actionName:"UPDATE",type:GENDER,masterData:$masterData) 
      }
    `,
    variables: {
      masterData:{"genderInfo":genderInfo,"isActive":isActive,_id:_id}
    }
  })
  const id = result.data.updateMasterSetting;
  return id
}
