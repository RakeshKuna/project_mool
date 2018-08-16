import gql from 'graphql-tag'
import {client} from '../../../core/apolloConnection';

export async function findBackendUserActionHandler(userTypeId) {
  let userId=userTypeId
  const result = await client.query({
    query: gql`
    
          query($userId:String){
            fetchUser(userId:$userId){
              _id,
              profile{
                isInternaluser,
                isExternaluser,
                isActive,
                isMoolya
                firstName,
                middleName,
                lastName,
                genderType,
                dateOfBirth,
                email,
                profileImage,
                about
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
                  socialLinksInfo {
                    socialLinkTypeName
                    socialLinkType
                    socialLinkUrl
                  }
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
                      isAnchor
                    }
                  }
                    
                  }
                }
                
              }
            }
          }
    `,
    variables: {
      userId
    },
    fetchPolicy: 'network-only'
  })
  const id = result.data.fetchUser;
  return id
}
