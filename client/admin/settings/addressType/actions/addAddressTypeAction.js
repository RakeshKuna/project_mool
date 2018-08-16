import gql from 'graphql-tag'
import {client} from '../../../core/apolloConnection';

export async function addAddressTypeActionHandler(addressDetails)
{
  let addressName = addressDetails.addressName||null;
  let addressDisplayName = addressDetails.addressDisplayName||null;
  let aboutAddress = addressDetails.aboutAddress||null;
  let addressUploadIcon =addressDetails.addressUploadIcon||null;
  let isActive = addressDetails.isActive;
  let addressTypeInfo={addressName,addressDisplayName,aboutAddress,addressUploadIcon};
  const result = await client.mutate({
    mutation: gql`
    mutation ($masterData:MasterSettingsRequest){
        createMasterSetting(moduleName:"MASTERSETTINGS",actionName:"CREATE",type:ADDRESSTYPE,masterData:$masterData) 
      }
    `,
    variables: {
      masterData:{"addressTypeInfo":addressTypeInfo,"isActive":isActive},
    }
  })
  const id = result.data.createMasterSetting;
  return id
}
