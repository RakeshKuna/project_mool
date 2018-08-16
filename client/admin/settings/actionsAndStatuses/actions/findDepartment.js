/**
 * Created by pankaj on 24/5/17.
 */

import gql from 'graphql-tag'
import {client} from '../../../core/apolloConnection';

export async function findDepartmentActionHandler(DepartmentId) {
  let did=DepartmentId
  const result = await client.query({
    query: gql`
    query  ($id: String){
         findDepartment(departmentId:$id)  {
    departmentName
    displayName
    
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

