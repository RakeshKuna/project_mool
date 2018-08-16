import gql from 'graphql-tag'
import {client} from '../../../core/apolloConnection';

export async function addLanguageActionHandler(LangauageDetails)
{
  let languageName = LangauageDetails.languageName||null;
  let languageDisplayName = LangauageDetails.languageDisplayName||null;
  let aboutLanguage = LangauageDetails.aboutLanguage||null;
  let isActive = LangauageDetails.isActive;
  let languageInfo={languageName,languageDisplayName,aboutLanguage};
  const result = await client.mutate({
    mutation: gql`
    mutation ($masterData:MasterSettingsRequest){
        createMasterSetting(moduleName:"MASTER_SETTINGS",actionName:"CREATE",type:LANGUAGE,masterData:$masterData) 
      }
    `,
    variables: {
      masterData:{"languageInfo":languageInfo,"isActive":isActive},
    }
  })
  const id = result.data.createMasterSetting;
  return id
}
