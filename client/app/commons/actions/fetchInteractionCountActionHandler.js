import gql from 'graphql-tag'
import {appClient} from '../../core/appConnection';

export async function fetchInteractionsCountActionHandler(details) {
  const result = await appClient.query({
    query: gql`
    query($resourceId:String!,$resourceType:String!,$actionNames:[String]){
      fetchInteractionsCount(resourceId:$resourceId,resourceType:$resourceType,actionNames:$actionNames) {
            actionName
            count
      }
    }
    `,
    variables: {
      actionNames:details.actionNames,
      resourceId : details.resourceId,
      resourceType: details.resourceType
    },
    fetchPolicy: 'network-only'
  });
  const data = result.data.fetchInteractionsCount?result.data.fetchInteractionsCount:[];
  return data;
}
