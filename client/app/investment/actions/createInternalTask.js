/**
 * Created by pankaj on 19/6/17.
 */
import gql from "graphql-tag";
import {appClient} from "../../core/appConnection";

export async function createInternalTaskActionHandler(internalTask) {
  const result = await appClient.mutate({
    mutation: gql`
      mutation($internalTask:internalTask){
        createInternalTask(internalTask:$internalTask){
          success
          result
        }
      }
    `,
    variables: {
      internalTask: internalTask
    },
    fetchPolicy: 'network-only'
  });
  const id = result.data.createInternalTask;
  return id
}
