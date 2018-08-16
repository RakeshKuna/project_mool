import gql from 'graphql-tag'
import {client} from '../../../core/apolloConnection';

export async function findDepartmentActionHandler(DepartmentId) {
  console.log(DepartmentId)
 let did=DepartmentId
  const result = await client.query({
    query: gql`
    query  ($id: String){
         findDepartment(departmentId:$id)  {
    departmentName
    displayName
    departmentDesc
    isActive
    isMoolya
    isSystemDefined
    depatmentAvailable{
      cluster
      chapter
      subChapter
      email
      isActive
    }
  }
}

    `,
    variables: {
      id:did
    },
    fetchPolicy: 'network-only'
  })
  const id = result.data.findDepartment;
  return id
}
