import gql from 'graphql-tag'
import {client} from '../../core/apolloConnection';



export async function updateSettings(Details) {
  const result = await client.mutate({
    mutation: gql`
   mutation ($moduleName: String, $actionName: String, $settingsAttributes: settingsAttributesObject) {
  updateSettings( moduleName: $moduleName, actionName: $actionName, settingsAttributes: $settingsAttributes) {
    success
    code
    result
  }
}
`,
    variables: {
      "moduleName": "PROFILE",
      "actionName": "UPDATE",
      "settingsAttributes": {
        "currencyTypes": Details.currencySymbol,
        "numericalFormat": Details.measurementSystem,
        "languages": Details.languages,
        "timeZone": Details.timeZone
    }
  }});
  const id = result.data.updateSettings;
  return id;
}
