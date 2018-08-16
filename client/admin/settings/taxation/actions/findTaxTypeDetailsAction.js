import gql from 'graphql-tag'
import {client} from '../../../core/apolloConnection';

export async function findTaxTypeDetailsActionHandler() {
  const result = await client.query({
    query: gql`
     query{
  fetchMasterSettings(type:TAXTYPE) {
    _id
    isActive
    taxTypeInfo{
      taxName,
      taxDisplayName
      aboutTax
    }
  }
}
    `,
    fetchPolicy: 'network-only'
  })
  const id = result.data.fetchMasterSettings;
  return id
}
