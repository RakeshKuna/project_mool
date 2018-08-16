import gql from 'graphql-tag'
import {client} from '../../../core/apolloConnection';

export async function addProcessActionHandler(ProcessInput) {
  const result = await client.mutate({
    mutation: gql`
     mutation ($ProcessInput :processInput, $moduleName:String, $actionName:String){
        createProcess(
          process : $ProcessInput,
          moduleName:$moduleName,
          actionName:$actionName
        ){
            success,
            code,
            result
        }
      } `,
    variables: {
      ProcessInput,
      moduleName:"PROCESSMAPPING",
      actionName:"CREATE"
    }
  })
  const id = result.data.createProcess;
  return id
}
