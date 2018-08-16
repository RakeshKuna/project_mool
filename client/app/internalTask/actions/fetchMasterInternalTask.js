/** ************************************************************
 * Date: 07 Jul, 2017
 * Programmer: Pankaj <pakajkumar.jatav@raksan.in>
 * Description : This will fetch my master task
 * JavaScript XML file fetchMasterInternalTask.js
 * *************************************************************** */

import gql from "graphql-tag";
import {appClient} from "../../core/appConnection";

export async function fetchMasterTasks() {
  const result = await appClient.query({
    query: gql`
      query {
        fetchTasks {
          value : _id
          label : displayName
        }
      }
    `,
    fetchPolicy: 'network-only'
  });
  const id = result.data.fetchTasks;
  return id;
}
