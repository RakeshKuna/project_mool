import gql from 'graphql-tag'
import {client} from '../../../core/apolloConnection';

export async function updateProcessActionHandler(pid,process) {
   pid = pid;
   const result = await client.mutate({
   mutation: gql`
   mutation  ($pid:String, $process: processInput, $moduleName:String, $actionName:String){
       updateProcess(
       id: $pid,
       process: $process,
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
     pid,
     process,
     moduleName:"PROCESSMAPPING",
     actionName:"UPDATE"
   }
   })
  const id = result.data.updateProcess;
  return id
}
