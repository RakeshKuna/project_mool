import gql from 'graphql-tag'
import {client} from '../../../core/apolloConnection';

export async function fetchMasterNumberType(variables) {
  const result = await client.query({
    query: gql`query($type:String,$hierarchyRefId:String){
     fetchMasterSettingsForPlatFormAdmin(type:$type,hierarchyRefId:$hierarchyRefId) {
        label
        value
      }
     }`,
    variables: variables,
    fetchPolicy: 'network-only'
  });
  const id = result.data.fetchMasterSettingsForPlatFormAdmin;
  return id;

}
