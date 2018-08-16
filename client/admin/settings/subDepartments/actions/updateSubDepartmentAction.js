import gql from 'graphql-tag'
import {client} from '../../../core/apolloConnection';

export async function updateSubDepartmentActionHandler(SubDepartmentDetails) {

  let subDepartmentId = SubDepartmentDetails.subDepartmentId;
  let subDepartment=SubDepartmentDetails.subDepartment
 /* let details = {
    subDepartmentName: SubDepartmentDetails.subDepartmentName,
    displayName: SubDepartmentDetails.displayName,
    aboutSubDepartment: SubDepartmentDetails.aboutSubDepartment,
    selectCluster: SubDepartmentDetails.selectCluster,
    email: SubDepartmentDetails.email,
    isActive:SubDepartmentDetails.isActive
  }*/

  const result = await client.mutate({
    mutation: gql`
    mutation ($subDepartmentId:String,$subDepartment:subDepartmentObject,$moduleName:String, $actionName:String){
        updateSubDepartment(
          subDepartmentId:$subDepartmentId,
          subDepartment:$subDepartment,
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
      subDepartmentId:subDepartmentId,
      subDepartment:subDepartment,
      moduleName: "SUBDEPARTMENT",
      actionName: "UPDATE"
    }
  })

  const id = result.data.updateSubDepartment;
  return id
}
