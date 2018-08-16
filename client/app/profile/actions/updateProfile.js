import gql from 'graphql-tag'
import {appClient} from '../../core/appConnection';

export async function updateDataEntry(Details) {
  const result = await appClient.mutate({
    mutation: gql`
    mutation ($attributes: attributesObject) {
    updateDataEntry(attributes: $attributes) {
    success
    code
    result
  }
}
`,
    variables: {
      attributes: Details
    }
  })
  const id = result.data.updateDataEntry;
  return id;
}
