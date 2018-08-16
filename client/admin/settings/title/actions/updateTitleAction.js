import gql from 'graphql-tag'
import {client} from '../../../core/apolloConnection';

export async function updateTitleActionHandler(TitleDetails) {
  let _id=TitleDetails.id;
  let titleName = TitleDetails.titleName||null;
  let titleDisplayName = TitleDetails.titleDisplayName||null;
  let aboutTitle = TitleDetails.aboutTitle||null;
  let isActive = TitleDetails.isActive;
  let titleInfo={titleName,titleDisplayName,aboutTitle};
  const result = await client.mutate({
    mutation: gql`
    mutation ($masterData:MasterSettingsRequest){
        updateMasterSetting(moduleName:"MASTER_SETTINGS",actionName:"UPDATE",type:TITLE,masterData:$masterData) 
      }
    `,
    variables: {
      masterData:{"titleInfo":titleInfo,"isActive":isActive,_id:_id}
    }
  })
  const id = result.data.updateMasterSetting;
  return id
}
