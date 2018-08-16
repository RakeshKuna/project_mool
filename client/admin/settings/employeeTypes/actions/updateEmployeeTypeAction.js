import gql from 'graphql-tag'
import {client} from '../../../core/apolloConnection';

export async function updateEmployeeTypeActionHandler(EmpType) {
  let _id=EmpType.id;
  let employmentName = EmpType.employmentName;
  let employmentDisplayName = EmpType.employmentDisplayName;
  let aboutEmployment = EmpType.aboutEmployment;
  let isActive = EmpType.isActive;
  let employmentTypeInfo={employmentName,employmentDisplayName,aboutEmployment};
  const result = await client.mutate({
    mutation: gql`
    mutation ($masterData:MasterSettingsRequest){
        updateMasterSetting(moduleName:"MASTER_SETTINGS",actionName:"UPDATE",type:EMPLOYMENTTYPE,masterData:$masterData) 
      }
    `,
    variables: {
      masterData:{"employmentTypeInfo":employmentTypeInfo,"isActive":isActive,_id:_id}
    }
  })
  const id = result.data.updateMasterSetting;
  return id
}
