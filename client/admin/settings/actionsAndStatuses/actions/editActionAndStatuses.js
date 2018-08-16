/**
 * Created by pankaj on 23/5/17.
 */

import gql from 'graphql-tag'
import {client} from '../../../core/apolloConnection';

export async function editActionAndStatusActionHandler(Id, dataToInsert) {

  const result = await client.mutate({
    mutation: gql`
    mutation($actionsAndStatusId: String, $actionsAndStatuses: actionAndStatus!){
      updateActionsAndStatuses(actionsAndStatusId:$actionsAndStatusId  ,actionsAndStatuses:$actionsAndStatuses){
        success
        code
        result
      }
    }`,
    variables: {
      actionsAndStatusId : Id,
      actionsAndStatuses:dataToInsert,
      moduleName:"DEPARTMENT",
      actionName:"CREATE"
    }
  });

  const id = result;
  return id
}
