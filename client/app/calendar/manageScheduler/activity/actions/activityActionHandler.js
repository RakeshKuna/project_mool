/**
 * Created by Mukhil on 19/6/17.
 */
import gql from 'graphql-tag'
import {appClient} from '../../../../core/appConnection';

export async function createActivityActionHandler (Details) {
  const result = await appClient.mutate({
    mutation: gql`
    mutation($Details: activity){
        createActivity(Details:$Details){
        success
        code
        result
      }
      }
    `,
    variables: {
      Details
    }
  });
  const activities = result.data.createActivity;
  return activities
}


export async function updateActivityActionHandler(activityId,Details) {
  const result = await appClient.mutate({
    mutation: gql`
    mutation($activityId:String, $Details:activity){
        updateActivity(activityId:$activityId,Details:$Details){
        success
        code
        result
      }
      }
    `,
    variables: {
      activityId,
      Details
    }
  });
  console.log(result)
  const teamMembers = result.data.updateActivity;
  return teamMembers
}


export async function getTeamUsersActionHandler(officeId) {
  const result = await appClient.query({
    query: gql`
      query ($officeId: String) {
        getTeamUsers(officeId: $officeId) {
          _id
          name
          userId
          profileId
          profileImage
        }
      }
    `,
    fetchPolicy: 'network-only',
    variables: {
      officeId:officeId
    }
  });
  const teamMembers = result.data.getTeamUsers;
  return teamMembers
}

export async function getUserProfileActionHandler() {
  const result = await appClient.query({
    query: gql`
      query  {
        getUserProfiles{
          profileId
          communityName
          displayName
          profileImage
        }
      }
    `,
    fetchPolicy: 'network-only'
  });
  const users = result.data.getUserProfiles;
  return users
}

export async function getUserActiveProfileDetails() {
  const result = await appClient.query({
    query: gql`
      query  {
        getUserActiveProfileDetails{
          userId
          profileId
          profileImage
          displayName
          clusterName
          communityName
          communityDefCode
          subChapterName
          isHasManageSchedule
          isMoolya
        }
      }
    `,
    fetchPolicy: 'network-only'
  });
  const users = result.data.getUserActiveProfileDetails;
  return users
}

export async function getActivityActionHandler(id) {
  const activityId = id;
  const result = await appClient.query({
    query: gql`
      query($activityId: String)  {
        fetchActivity(activityId:$activityId){
          userId
          profileId
          name
          deliverable
          displayName
          isInternal
          isExternal
          mode
          isServiceCardEligible
          industryTypes
          note
          isActive
          imageLink
          duration{
           hours
           minutes
          }
          facilitationCharge{
           amount
           percentage
           derivedAmount
          }
          teams{
            resourceId
            resourceType
            users{
              userId
              profileId
              isMandatory
            }
          }
          conversation
          payment{
            amount
            isDiscount
            discountType
            discountValue
            derivedAmount
            currencyType
          } 
        }
      }
    `,
    variables: {
      activityId
    },
    fetchPolicy: 'network-only'
  });
  const users = result.data.fetchActivity;
  return users
}

export async function fetchActivitiesActionHandler (profileId) {
  const result = await appClient.query({
    query: gql`
    query($profileId:String) {
      fetchActivities(profileId: $profileId) {
        displayName
        profileId
        imageLink
        isInternal
        isExternal
        isServiceCardEligible
        isActive
        mode
        _id
        duration {
          hours
          minutes
        }
        teams {
          resourceType
          resourceId
          users {
            userId
            profileId
          }
        }
        payment{
          derivedAmount
        }
      }
    }
    `,
    variables: {
      profileId:profileId
    },
    fetchPolicy: 'network-only'
  });
  const activities = result.data.fetchActivities;
  return activities
}

export async function fetchActivitiesForTaskActionHandler(taskId){
  const result = await appClient.query({
    query: gql`
    query($taskId:String) {
      fetchActivitiesForTask(taskId: $taskId) {
        displayName
        imageLink
        mode
        _id
        isExternal
        isInternal
        isServiceCardEligible
        payment{
          derivedAmount
        }
        duration {
          hours
          minutes
        }
        teams {
          resourceType
          resourceId
          users {
            userId
            profileId
          }
        }
      }
    }
    `,
    variables: {
      taskId:taskId
    },
    fetchPolicy: 'network-only'
  });
  const activities = result.data.fetchActivitiesForTask;
  return activities
}


// export async function getActivityDataActionHandler() {
//   const result = await appClient.query({
//     query: gql`
// query  {
//   fetchActivityData{
//     profileId
//     communityName
//     displayName
//     profileImage
//   }
// }
//     `
//   });
//   console.log(result)
//   const users = result.data.fetchActivity;
//   return users
// }
