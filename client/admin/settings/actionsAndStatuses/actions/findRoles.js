/**
 * Created by pankaj on 24/5/17.
 */

import gql from 'graphql-tag'
import {client} from '../../../core/apolloConnection';

export async function findRolessActionHandler(departmentId, subDepartmentId) {
  const result = await client.query({
    query: gql`
      query ($department: String,$subDepartment: String) {
        data: fetchRolesForRegistration(department: $department,subDepartment: $subDepartment) {
          value: _id
          name:displayName
        }
      }
    `,
    variables: {
      department: departmentId,
      subDepartment: subDepartmentId
    },
    fetchPolicy: 'network-only'
  });
  const id = result.data.data;
  return id
}
