/**
 * Created by mohammed.mohasin on 2/5/17.
 */
import gql from 'graphql-tag'
import {appClient} from '../../core/appConnection';

export async function fetchExternalUserProfilesActionHandler() {
  const result = await appClient.query({
    query: gql`
    query{
      fetchUserProfiles {
        registrationId
        countryName
        countryId
        cityName
        cityId
        mobileNumber
        clusterId
        clusterName
        chapterId
        chapterName
        subChapterId
        subChapterName
        communityId
        communityName
        communityType
        communityName
        communityDefCode
        communityDefName
        communityType
        communityImage
              
        isDefault
        isActive
        accountType
        isActive
        optional
        userType
        identityType
        profileId
      }
    }
    `,
    fetchPolicy: 'network-only'
  })
  const data = result.data&&result.data.fetchUserProfiles?result.data.fetchUserProfiles:[];
  return data;
}

export async function setDefaultProfileActionHandler(profileId) {

  const result = await appClient.mutate({
    mutation: gql`
          mutation($profileId:String!){
              setDefaultProfile(profileId:$profileId){
                  success,
                  code,
                  result
              }  
          }
      `,
    variables: {
      profileId:profileId
    }
  })
  const id = result.data.setDefaultProfile;
  return id;
}

export async function switchProfileActionHandler(profileId) {

  const result = await appClient.mutate({
    mutation: gql`
          mutation($profileId:String!){
              switchExternalProfile(profileId:$profileId){
                  success,
                  code,
                  result
              }  
          }
      `,
    variables: {
      profileId:profileId
    }
  })
  const id = result.data.switchExternalProfile;
  return id;
}


export async function deActivateProfileProfileActionHandler(profileId) {

  const result = await appClient.mutate({
    mutation: gql`
          mutation($profileId: String!){
              deActivateUserProfile(profileId:$profileId){
                  success,
                  code,
                  result
              }  
          }
      `,
    variables: {
      profileId:profileId
    }
  })
  const id = result.data.deActivateUserProfile;
  return id;
}

export async function blockProfileActionHandler(profileId) {

  const result = await appClient.mutate({
    mutation: gql`
          mutation($profileId: String!){
              blockUserProfile(profileId:$profileId){
                  success,
                  code,
                  result
              }  
          }
      `,
    variables: {
      profileId:profileId
    }
  })
  const id = result.data.blockUserProfile;
  return id;
}

export function reloadPage(){
  location.reload();
}
