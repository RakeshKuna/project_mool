import gql from 'graphql-tag'
import {client} from '../../../core/apolloConnection';

export async function updateLanguageActionHandler(LanguageDetails)
{
  let _id=LanguageDetails.id;
  let languageName = LanguageDetails.languageName||null;
  let languageDisplayName = LanguageDetails.languageDisplayName||null;
  let aboutLanguage = LanguageDetails.aboutLanguage||null;
  let isActive = LanguageDetails.isActive;
  let languageInfo={languageName,languageDisplayName,aboutLanguage};
  const result = await client.mutate({
    mutation: gql`
    mutation ($masterData:MasterSettingsRequest){
        updateMasterSetting(moduleName:"MASTER_SETTINGS",actionName:"UPDATE",type:LANGUAGE,masterData:$masterData) 
      }
    `,
    variables: {
      masterData:{"languageInfo":languageInfo,"isActive":isActive,_id:_id}
    }
  })
  const id = result.data.updateMasterSetting;
  return id
}

