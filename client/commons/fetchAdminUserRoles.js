import gql from "graphql-tag";

export async function fetchAdminUserRoles(userId,connection) {
  var connection = connection ||{};
  const result = await connection.query({
    query: gql`
    query ($userId: String) {
        fetchUserRoles(userId: $userId) {
          roleId
          roleName
          isChapterAdmin
          validFrom
          validTo
          isActive
          clusterId
          chapterId
          subChapterId
          communityId
          departmentId
          hierarchyLevel
          hierarchyCode
          departmentName
          subDepartmentId
          subDepartmentName
        }
      }
    `,
    variables: {
      userId: userId
    },
    fetchPolicy: 'network-only'
  })
  const did = result.data.fetchUserRoles;
  return did
}
