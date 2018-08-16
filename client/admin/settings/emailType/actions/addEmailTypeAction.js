import gql from 'graphql-tag'
import {client} from '../../../core/apolloConnection';

export async function addEmailTypeActionHandler(Details)
{
/*  const result = await client.mutate({
    mutation: gql`
        mutation ($emailType:emailTypeObject){
            createEmailType(
                emailType: $emailType
            )
         }
        `,
    variables: {
      emailType: Details
    }
  })
  console.log(result)
  const id = result.data.createEmailType;
  return id*/
  let emailName = Details.emailName;
  let emailDisplayName = Details.emailDisplayName;
  let aboutEmail = Details.aboutEmail;
  let emailUploadIcon = Details.emailUploadIcon;
  let isActive = Details.isActive;
  let emailTypeInfo={emailName,emailDisplayName,aboutEmail,emailUploadIcon};
  const result = await client.mutate({
    mutation: gql`
    mutation  ($masterData:MasterSettingsRequest){
        createMasterSetting(
          moduleName:"MASTERSETTINGS",
          actionName:"CREATE",
          type:EMAILTYPE,
          masterData:$masterData
        ) 
      }
    `,
    variables: {
      masterData:{"emailTypeInfo":emailTypeInfo,"isActive":isActive},
    }
  })
  const id = result.data.createMasterSetting;
  return id
}
