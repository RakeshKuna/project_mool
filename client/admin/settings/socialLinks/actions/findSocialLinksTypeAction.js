import gql from 'graphql-tag'
import {client} from '../../../core/apolloConnection';

export async function findSocialLinksTypeActionHandler(Id)
{
  let did=Id

  const result = await client.query({
    query: gql`
    query  ($id: String){
        findMasterSetting(_id:$id){
         id:_id
        isActive
        socialLinksInfo{
             socialName
             socialDisplayName
             aboutSocial
             socialUploadIcon
        }
      }
      }
    `,
    variables: {
      id:did
    },
    fetchPolicy: 'network-only'
  });
  const masterSetting= result.data.findMasterSetting||{};
  const {socialName,aboutSocial,socialDisplayName,socialUploadIcon}=masterSetting.socialLinksInfo||{};
  if(result){
    return {isActive:masterSetting.isActive,socialName,aboutSocial,socialDisplayName,socialUploadIcon};
  }
  return {};
}
