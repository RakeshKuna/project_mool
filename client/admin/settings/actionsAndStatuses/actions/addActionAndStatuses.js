/**
 * Created by pankaj on 22/5/17.
 */

import gql from 'graphql-tag'
import {client} from '../../../core/apolloConnection';

export async function addActionAndStatusActionHandler(dataToInsert) {

  const result = await client.mutate({
    mutation: gql`
    mutation($actionsAndStatuses: actionAndStatus!){
      createActionsAndStatuses(actionsAndStatuses:$actionsAndStatuses){
        success
        code
        result
      }
    }`,
    variables: {
      actionsAndStatuses:dataToInsert,
      moduleName:"DEPARTMENT",
      actionName:"CREATE"
    }
  });

  const id = result;
  return id
}
