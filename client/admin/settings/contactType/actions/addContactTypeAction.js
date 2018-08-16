import gql from 'graphql-tag'
import {client} from '../../../core/apolloConnection';

export async function addContactTypeActionHandler(Details)
{
  /*const result = await client.mutate({
    mutation: gql`
        mutation ($contactType:contactTypeObject){
            createContactType(
                contactType: $contactType
            )
         }
        `,
    variables: {
      contactType: Details
    }
  })*/

  let contactName = Details.contactName;
  let contactDisplayName = Details.contactDisplayName;
  let aboutContact = Details.aboutContact;
  let contactUploadIcon = Details.contactUploadIcon;
  let isActive = Details.isActive;
  let contactTypeInfo={contactName,contactDisplayName,aboutContact,contactUploadIcon};

  const result = await client.mutate({
    mutation: gql`
    mutation  ($masterData:MasterSettingsRequest){
        createMasterSetting(
          moduleName:"MASTERSETTINGS",
          actionName:"CREATE",
          type:CONTACTTYPE,
          masterData:$masterData
        ) 
      }
    `,
    variables: {
      masterData:{"contactTypeInfo":contactTypeInfo,"isActive":isActive},
    }
  })
  const id = result.data.createMasterSetting;
  return id
}
