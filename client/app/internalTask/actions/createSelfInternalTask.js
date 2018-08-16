/** ************************************************************
 * Date: 07 Jul, 2017
 * Programmer: Pankaj <pakajkumar.jatav@raksan.in>
 * Description : This will create new self task
 * JavaScript XML file createSelfInternalTask.js
 * *************************************************************** */

import gql from "graphql-tag";
import {appClient} from "../../core/appConnection";

export async function createSelfInternalTask(selfInternalTask) {
  const result = await appClient.mutate({
    mutation: gql`
      mutation($selfInternalTask:selfInternalTask){
        createSelfInternalTask(selfInternalTask: $selfInternalTask) {
          success
          code
          result
        }
      }
    `,
    variables: {
      selfInternalTask:selfInternalTask
    },
    fetchPolicy: 'network-only'
  });
  const id = result.data.createSelfInternalTask;
  return id;
}
