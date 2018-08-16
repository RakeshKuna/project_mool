import gql from 'graphql-tag'
import {client} from '../../../core/apolloConnection';

export async function updateDepartmentActionHandler(DepartmentDetails) {
  let departmentId=DepartmentDetails.departmentId;
  let department=DepartmentDetails.department;
/*  let departmentName = DepartmentDetails.departmentName;
  let displayName = DepartmentDetails.displayName;
  let departmentDesc = DepartmentDetails.about;
  /!*let selectCluster = DepartmentDetails.selectCluster;
  let email = DepartmentDetails.email;*!/
  let isActive = DepartmentDetails.departmentStatus
  let depatmentAvailable =DepartmentDetails.departmentAvailablity
  let isMoolya = DepartmentDetails.appType*/
  const result = await client.mutate({
    mutation: gql`
    mutation  ($departmentId: String, $department: departmentObject, $moduleName:String, $actionName:String){
        updateDepartment(
          departmentId:$departmentId,
          department: $department,
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
      departmentId,
      department,
      moduleName: "DEPARTMENT",
      actionName: "UPDATE"
    }
  })
  const id = result.data.updateDepartment;
  return id
}
