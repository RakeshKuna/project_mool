/**
 * Created by pankaj on 18/6/17.
 */
import gql from "graphql-tag";
import {appClient} from "../../core/appConnection";

export async function createStageActionHandler(stage) {
  const result = await appClient.mutate({
    mutation: gql`
      mutation($stage:stage){
        createStage(stage:$stage){
          success
          result
        }
      }
    `,
    variables: {
      stage: stage
    },
    fetchPolicy: 'network-only'
  })
  const id = result.data.createStage;
  return id
}
