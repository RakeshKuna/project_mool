import gql from 'graphql-tag';
import {client} from '../../core/apolloConnection';

export async function getContactDetails() {
  const result = await client.query({
    query: gql`
    query ($moduleName: String, $actionName: String) {
  fetchAddressBookInfo(moduleName: $moduleName, actionName: $actionName) {
    addressInfo {
      addressType
      addressTypeName
      name
      phoneNumber
      addressFlat
      addressLocality
      addressLandmark
      addressArea
      addressCity
      addressState
      addressCountry
      addressPinCode
      latitude
      longitude
    }
    emailInfo {
      emailIdType
      emailIdTypeName
      emailId
    }
    contactInfo {
      numberType
      numberTypeName
      countryCode
      contactNumber
    }
  }
}`,
    variables: {
      moduleName:"PROFILE",
      actionName:"GET"
    },
    fetchPolicy: 'network-only'
  })

  const id = result.data.fetchAddressBookInfo;

  return id
}
