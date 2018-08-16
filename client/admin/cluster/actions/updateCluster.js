import gql from 'graphql-tag'
import {client} from '../../core/apolloConnection';

export async function updateClusterActionHandler(clusterDetails)
{
  let clusterId = clusterDetails._id;
  let cluster = {
    countryName:clusterDetails.countryName,
    displayName: clusterDetails.displayName,
    about: clusterDetails.about,
    email: clusterDetails.email,
    isEmailNotified : clusterDetails.isEmailNotified,
    showOnMap: clusterDetails.showOnMap,
    isActive: clusterDetails.isActive
  }
  const result = await client.mutate({
    mutation: gql`
    mutation  ($clusterId:String!,$clusterDetails:clusterObject, $moduleName:String!, $actionName:String!){
        upsertCluster(
          clusterId:$clusterId,
          cluster:$clusterDetails,
          moduleName:$moduleName,
          actionName:$actionName
        ){
            success,
            code,
            result
        } 
      }
    `,
    variables: {
      clusterId:clusterId,
      clusterDetails:cluster,
      moduleName:"CLUSTER",
      actionName:"UPDATE"
    }
  })
  const id = result.data.upsertCluster;
  return id
}
