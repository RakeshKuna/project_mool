/**
 * Created by pankaj on 23/5/17.
 */

import gql from 'graphql-tag'
import {client} from '../../../core/apolloConnection';

export async function findActionAndStatusActionHandler(statusAndStatusId) {
  let did = statusAndStatusId;
  console.log(statusAndStatusId);
  const result = await client.query({
    query: gql`
      query ($_id: String) {
      findActionsAndStatus(_id: $_id) {
        _id
        processId
        processName
        subProcessId
        subProcessName
        clusterId
        clusterName
        isMoolya
        chapterId
        chapterName
        subChapterId
        subChapterName
        departmentInfo {
          departmentId
          departmentName
          subDepartmentId
          subDepartmentName
          operation {
            roleIds
            about
            actionName
            actionDisplayName
            statusName
            statusDisplayName
            status
          }
        }
      }
    }`,
    variables: {
      _id:did
    },
    fetchPolicy: 'network-only'
  });
  const id = result.data.findActionsAndStatus;
  console.log(id);
  return id
}
