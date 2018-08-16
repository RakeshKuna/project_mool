import gql from 'graphql-tag'
import {appClient} from '../../core/appConnection';

export async function fetchInteractionActionAttributesHandler(details) {
  const result = await appClient.query({
    query: gql`
    query($resourceId:String!,$resourceType:String!,$actionNames:[String]){
      fetchInteractionActionAttributes(resourceId:$resourceId,resourceType:$resourceType,actionNames:$actionNames) {
            actionName
            isDisabled
            isHidden
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
  const data = result.data.fetchInteractionActionAttributes?result.data.fetchInteractionActionAttributes:[];
  return data;
}
