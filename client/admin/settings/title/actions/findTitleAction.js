import gql from 'graphql-tag'
import {client} from '../../../core/apolloConnection';

export async function findTitleActionHandler(TitleId) {
  let did=TitleId
  const result = await client.query({
    query: gql`
    query  ($id: String){
        findMasterSetting(_id:$id){
         id:_id
        isActive
        titleInfo{
             titleName
             aboutTitle
             titleDisplayName
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
  const {titleName,aboutTitle,titleDisplayName}=masterSetting.titleInfo||{};
  if(result){
    return {isActive:masterSetting.isActive,titleName,aboutTitle,titleDisplayName};
  }
  return {};
}
