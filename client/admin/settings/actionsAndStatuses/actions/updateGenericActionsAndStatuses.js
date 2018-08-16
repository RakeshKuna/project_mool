/**
 * Created by pankaj on 25/5/17.
 */

import gql from 'graphql-tag'
import {client} from '../../../core/apolloConnection';

export async function updateGenericActionAndStatusActionHandler(Id, dataToUpdate) {

  const result = await client.mutate({
    mutation: gql`
    mutation ($actionsAndStatusId: String, $departmentInfo: departmentInfo!) {
      updateGenericActionsAndStatuses(actionsAndStatusId: $actionsAndStatusId, departmentInfo: $departmentInfo) {
        success
        code
        result
      }
    }`,
    variables: {
      actionsAndStatusId : Id,
      departmentInfo:dataToUpdate,
      moduleName:"DEPARTMENT",
      actionName:"CREATE"
    }
  });

  const id = result;
  return id
}

