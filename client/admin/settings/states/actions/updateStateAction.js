import gql from 'graphql-tag'
import {client} from '../../../core/apolloConnection';

export async function updateStateActionHandler(StateDetails) {
  let stateId = StateDetails.id;

  const result = await client.mutate({
    mutation: gql`
    mutation updateState($stateId:String, $state: stateObject, $moduleName:String, $actionName:String){
      updateState(
        stateId:$stateId,
        state: $state,
        moduleName:$moduleName,
        actionName:$actionName
      ){
            success,
            code,
            result
        }  
      }
    `,
    variables: {
      stateId:stateId,
      state:StateDetails,
      moduleName:"STATES",
      actionName:"UPDATE"
    }
  })
  const id = result.data.updateState;
  return id
}
