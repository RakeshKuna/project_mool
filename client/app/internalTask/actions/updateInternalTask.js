/**
 * Created by pankaj on 21/6/17.
 */
import gql from "graphql-tag";
import {appClient} from "../../core/appConnection";

export async function updateInternalTaskInfo(taskId, task) {
  const result = await appClient.mutate({
    mutation: gql`
      mutation($internalTaskId:String, $internalTask:internalTask) {
        updateInternalTask(internalTaskId:$internalTaskId, internalTask: $internalTask) {
          success
          result
        }
      }
    `,
    variables:{
      internalTaskId: taskId,
      internalTask: task
    },
    fetchPolicy: 'network-only'
  });
  const id = result.data.updateInternalTask;
  return id
}
