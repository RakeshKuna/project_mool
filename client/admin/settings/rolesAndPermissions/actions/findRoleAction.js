import gql from 'graphql-tag'
import {client} from '../../../core/apolloConnection';

  export async function findRoleActionHandler(roleId) {
  let id=roleId
  const result = await client.query({
    query: gql`
    query  ($id: String){
        findRole(id:$id){
          roleName
          displayName
          roleType
          subChapter
          userType
          about
          isSystemDefined
          assignRoles{
            cluster
            chapter
            community
            subChapter
            department
            subDepartment
            isActive
          }
          modules{
            moduleId
            moduleName
            validFrom
            validTo
            isActive          
            actions{
              actionId
              actionCode
            }
          }
          isActive
          isNonMoolyaAvailable
      }
      }
    `,
    variables: {
      id
    },
    fetchPolicy: 'network-only'
  })
  const did = result.data.findRole;
  return did
}
