import gql from 'graphql-tag'
import {client} from '../../core/apolloConnection';

export async function findMyProfileActionHandler(userTypeId) {
  let did=userTypeId
  const result = await client.query({
    query: gql`
    
          query($id: String){
            fetchMyProfile(userId:$id){
              _id,
              profile{
                isInternaluser,
                isExternaluser,
                isMoolya
                isActive,
                email,
                profileImage,
          			numericalFormat,
                currencyTypes, 
                languages
                timeZone
                dateOfBirth,
                genderType
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
                      communityName,
                      communityCode,
                      communityHierarchyLevel
                    }
                  }
                    
                  }
                }
                
              }
            }
          }
    `,
    variables: {
      id:did
    },
    fetchPolicy: 'network-only'
  })
  const id = result.data.fetchMyProfile;
  return id
}
