import gql from 'graphql-tag'
import {client} from '../../core/apolloConnection';


export async function updateDataEntry(Details) {
  const result = await client.mutate({
    mutation: gql`
    mutation ($moduleName: String, $actionName: String, $attributes: attributesObject) {
    updateDataEntry(moduleName: $moduleName, actionName: $actionName, attributes: $attributes) {
    success
    code
    result
  }
}
`,
    variables: {
    "moduleName": "PROFILE",
    "actionName": "UPDATE",
    "attributes": {
      "profileImage": Details.profileImage,
      "firstName": Details.firstName,
      "middleName": Details.middleName,
      "lastName":  Details.lastName,
      "userName": Details.userName,
      "genderType":Details.genderType,
      "dateOfBirth": Details.dateOfBirth
      }
    }
  })
  const id = result.data.updateDataEntry;
  return id;
}

export async function passwordVerification(digest) {
  const result = await client.query({
    query: gql`
    query ($Details: String) {
    passwordVerification(Details:$Details) {
    success
    code
    result
  }
}
`,variables:{
      Details:digest
    }

  })
  const id = result.data.passwordVerification;
  return id;
}

