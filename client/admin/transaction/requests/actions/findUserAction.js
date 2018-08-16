import gql from 'graphql-tag'
import {client} from '../../../core/apolloConnection';

export async function findBackendUserActionHandler(userTypeId) {
  let did=userTypeId
  const result = await client.query({
    query: gql`
    
          query{
            fetchUser{
              _id,
              profile{
                isInternaluser,
                isExternaluser,
                isActive,
                email,
                profileImage,
                InternalUprofile{
                  moolyaProfile{
                    firstName,
                  middleName,
                  lastName,
                  userType,
                  subChapter,
                  roleType,
                  assignedDepartment{
                    department,
                    subDepartment
                  },
                  displayName,
                  email,
                  contact{
                    contactNumberType,
                    countryCode,
                    number,
                    isOTPValidated
                  },
                  globalAssignment,
                  isActive,
                  userProfiles{
                    isDefault,
                    clusterId,
                    clusterName,
                    userRoles{
                      roleId,
                      roleName,
                      clusterId,
                      chapterId,
                      validFrom,
                      validTo,
                      subChapterId,
                      communityId,
                      isActive,
                      hierarchyLevel,
                      hierarchyCode,
                      departmentId,
                      departmentName,
                      subDepartmentId,
                      subDepartmentName,
                      chapterName,
                      subChapterName,
                      communityName
                    }
                  }
                    
                  }
                }
                
              }
            }
          }
    `,
    fetchPolicy: 'network-only'
  })
  const id = result.data.fetchUser;
  return id
}
