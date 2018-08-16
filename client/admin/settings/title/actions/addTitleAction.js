import gql from 'graphql-tag'
import {client} from '../../../core/apolloConnection';

export async function addTitleActionHandler(TitleDetails) {
  let titleName = TitleDetails.titleName||null;
  let titleDisplayName = TitleDetails.titleDisplayName||null;
  let aboutTitle = TitleDetails.aboutTitle||null;
  let isActive = TitleDetails.isActive;
  let titleInfo={titleName,titleDisplayName,aboutTitle};
  const result = await client.mutate({
    mutation: gql`
    mutation ($masterData:MasterSettingsRequest){
        createMasterSetting(moduleName:"MASTER_SETTINGS",actionName:"CREATE",type:TITLE,masterData:$masterData) 
      }
    `,
    variables: {
      masterData:{"titleInfo":titleInfo,"isActive":isActive},
    }
  })
  const id = result.data.createMasterSetting;
  return id
}
