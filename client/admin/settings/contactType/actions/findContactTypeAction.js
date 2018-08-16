import gql from 'graphql-tag'
import {client} from '../../../core/apolloConnection';

export async function findContactTypeActionHandler(Id)
{
/*  let did=Id;
  const result = await client.query({
    query: gql`
    query  ($id: String){
        findContactType(_id:$id){
              contactName
              aboutContact
              contactDisplayName
              _id
              isActive
        }
      }
    `,
    variables: {
      id:did
    },
    fetchPolicy: 'network-only'
  })
  const id = result.data.findContactType;
  return id*/
  let did=Id;
  const result = await client.query({
    query: gql`
    query  ($id: String){
        findMasterSetting(_id:$id){
         id:_id
        isActive
        contactTypeInfo{
             contactName
             aboutContact
             contactDisplayName
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
  const {contactName,aboutContact,contactDisplayName}=masterSetting.contactTypeInfo||{};
  if(result){
    return {isActive:masterSetting.isActive,contactName,aboutContact,contactDisplayName};
  }
  return {};
}
