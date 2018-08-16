import gql from 'graphql-tag'
import {client} from '../../../core/apolloConnection';

export async function updateSocialListsTypeActionHandler(Details)
{

/*  const result = await client.mutate({
    mutation: gql`
        mutation ($_id:String, $socialLinksType: socialLinksTypeObject){
            updateSocialLinksType(
                _id:$_id,
                socialLinksType: $socialLinksType
            )
         }
        `,
    variables: {
      _id: Details._id,
      socialLinksType: Details
    }
  })
  console.log(result)
  const id = result.data.updateSocialLinksType;
  return id*/

  let _id=Details._id;
  let socialName = Details.socialName;
  let socialDisplayName = Details.socialDisplayName;
  let aboutSocial = Details.aboutSocial;
  let socialUploadIcon = Details.socialUploadIcon;
  let isActive = Details.isActive;
  let socialLinksInfo={socialName,socialDisplayName,aboutSocial,socialUploadIcon};
  const result = await client.mutate({
    mutation: gql`
    mutation ($masterData:MasterSettingsRequest){
        updateMasterSetting(moduleName:"MASTERSETTINGS",actionName:"UPDATE",type:SOCIALLINKS,masterData:$masterData) 
      }
    `,
    variables: {
      masterData:{"socialLinksInfo":socialLinksInfo,"isActive":isActive,_id:_id}
    }
  })
  const id = result.data.updateMasterSetting;
  return id
}
