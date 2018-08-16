/**
 * Created by pankaj on 16/6/17.
 */
import gql from "graphql-tag";
import {appClient} from "../../core/appConnection";

export async function fetchLikePortfolioActionHandler(resourceType) {
  const result = await appClient.query({
    query: gql`
      query($resourceType: String){
        fetchLikes(resourceType: $resourceType) {
          result
          success
        }
      }
    `,
    variables: {
      resourceType: resourceType
    },
    fetchPolicy: 'network-only'
  })
  const id = result.data.fetchLikes;
  return id.result
}
