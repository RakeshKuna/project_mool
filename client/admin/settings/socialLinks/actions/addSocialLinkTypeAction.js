import gql from 'graphql-tag'
import {client} from '../../../core/apolloConnection';

export async function addSocialLinkTypeActionHandler(Details)
{
/*  const result = await client.mutate({
    mutation: gql`
        mutation ($socialLinksType:socialLinksTypeObject){
            createSocialLinksType(
                socialLinksType: $socialLinksType
            )
         }
        `,
    variables: {
      socialLinksType: Details
    }
  })
  console.log(result)
  const id = result.data.createSocialLinksType;
  return id*/

  let socialName = Details.socialName;
  let socialDisplayName = Details.socialDisplayName;
  let aboutSocial = Details.aboutSocial;
  let socialUploadIcon = Details.socialUploadIcon;
  let isActive = Details.isActive;
  let socialLinksInfo={socialName,socialDisplayName,aboutSocial,socialUploadIcon};
  const result = await client.mutate({
    mutation: gql`
    mutation  ($masterData:MasterSettingsRequest){
        createMasterSetting(
          moduleName:"MASTER_SETTINGS",
          actionName:"CREATE",
          type:SOCIALLINKS,
          masterData:$masterData
        ) 
      }
    `,
    variables: {
      masterData:{"socialLinksInfo":socialLinksInfo,"isActive":isActive},
    }
  })
  const id = result.data.createMasterSetting;
  return id
}
