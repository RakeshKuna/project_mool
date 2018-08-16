import gql from 'graphql-tag'
import {client} from '../../../core/apolloConnection';

export async function updateEmailTypeActionHandler(Details)
{

 /* const result = await client.mutate({
    mutation: gql`
        mutation ($_id:String, $emailType: emailTypeObject){
            updateEmailType(
                _id:$_id,
                emailType:$emailType
            )
         }
        `,
    variables: {
      _id:Details._id,
      emailType: Details
    }
  })
  console.log(result)
  const id = result.data.updateEmailType;
  return id*/
  let _id=Details._id;
  let emailName = Details.emailName;
  let emailDisplayName = Details.emailDisplayName;
  let aboutEmail = Details.aboutEmail;
  let emailUploadIcon = Details.emailUploadIcon;
  let isActive = Details.isActive;
  let emailTypeInfo={emailName,emailDisplayName,aboutEmail,emailUploadIcon};
  const result = await client.mutate({
    mutation: gql`
    mutation ($masterData:MasterSettingsRequest){
        updateMasterSetting(moduleName:"MASTER_SETTINGS",actionName:"UPDATE",type:EMAILTYPE,masterData:$masterData) 
      }
    `,
    variables: {
      masterData:{"emailTypeInfo":emailTypeInfo,"isActive":isActive,_id:_id}
    }
  })
  const id = result.data.updateMasterSetting;
  return id
}
