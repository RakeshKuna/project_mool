import gql from 'graphql-tag'
import {client} from '../../../core/apolloConnection';

export async function updateContactTypeActionHandler(Details)
{

 /* const result = await client.mutate({
    mutation: gql`
        mutation ($_id:String, $contactType: contactTypeObject){
            updateContactType(
                _id:$_id,
                contactType:$contactType
            )
         }
        `,
    variables: {
      _id:Details._id,
      contactType: Details
    }
  })*/
  let _id=Details._id;
  let contactName = Details.contactName;
  let contactDisplayName = Details.contactDisplayName;
  let aboutContact = Details.aboutContact;
  let contactUploadIcon = Details.contactUploadIcon;
  let isActive = Details.isActive;
  let contactTypeInfo={contactName,contactDisplayName,aboutContact,contactUploadIcon};
  const result = await client.mutate({
    mutation: gql`
    mutation ($masterData:MasterSettingsRequest){
        updateMasterSetting(moduleName:"MASTER_SETTINGS",actionName:"UPDATE",type:CONTACTTYPE,masterData:$masterData) 
      }
    `,
    variables: {
      masterData:{"contactTypeInfo":contactTypeInfo,"isActive":isActive,_id:_id}
    }
  })
  const id = result.data.updateMasterSetting;
  return id
}
