import gql from 'graphql-tag'
import {client} from '../../core/apolloConnection';

export async function findClusterTypeActionHandler(clusterId) {
  let did = clusterId
  const result = await client.query({
    query: gql`
        query  ($clusterId: String!, $moduleName:String!, $actionName:String!){
        fetchCluster(clusterId:$clusterId, moduleName:$moduleName, actionName:$actionName){
        _id
        countryName
        about
        email
        isEmailNotified
        countryFlag
        displayName
        showOnMap
        isActive
        }
      }
    `,
    variables: {
      clusterId: did,
      moduleName:"CLUSTER",
      actionName:"READ"
    },
    fetchPolicy: 'network-only'
  })
  const id = result.data.fetchCluster;
  return id
}
