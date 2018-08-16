import gql from 'graphql-tag'
import _ from 'lodash';
import {appClient} from '../../../../../core/appConnection';

export async function fetchAllTaskActionHandler(profileId) {
  const result = await appClient.query({
    query: gql`
    query($profileId:String) {
      fetchTasks(profileId: $profileId) {
        taskId: _id
        displayName
        isActive
      }
    }
    `,
    variables: {
      profileId
    },
    fetchPolicy: 'network-only'
  });
  const tasks = result.data.fetchTasks;
  return tasks;
}

export async function fetchTaskActionHandler(taskId) {
  const result = await appClient.query({
    query: gql`
          query  ($taskId: String){
            fetchTaskForApointment(taskId: $taskId) {
              name
              displayName
              isInternal
              isExternal
              note
              noOfSession
              sessionFrequency
              duration {
                hours
                minutes
              }
              session{
                duration {
                  hours
                  minutes
                }
                sessionId
                activities {
                  id: _id
                  mode
                  name
                  displayName
                  deliverable
                  isExternal
                  isInternal
                  isActive
                  isServiceCardEligible
                  payment{
                    derivedAmount
                  }
                  duration {
                    hours
                    minutes
                  }
                }
              }
              attachments{
                name
                info
                isMandatory
              }
              payment{
                amount
                isDiscount
                discountType
                discountValue
                activitiesDerived
                activitiesDiscount
                activitiesAmount
                derivedAmount
              }
              isServiceCardEligible
              sessionFrequency
              isActive
            }
          }
      `,
    variables: {
      taskId
    },
    fetchPolicy: 'network-only'
  })
  var resp = result.data.fetchTaskForApointment;
  let data = _.omit(resp, '__typename')
  data.duration = _.omit(data.duration, '__typename')
  data.payment = _.omit(data.payment, '__typename')
  let sessionArray = []
  _.each(data.session,function (item,say) {
    let value = _.omit(item, '__typename')
    value.duration = _.omit(value.duration, '__typename')
    sessionArray.push(value)
  })
  data.session = sessionArray
  let attachmentArray = []
  _.each(data.attachments,function (item,say) {
    let value = _.omit(item, '__typename')
    attachmentArray.push(value);
  });
  data.attachments = attachmentArray
  return data;
}

export async function fetchActivitiesTeamsActionHandler(taskId, sessionId) {
  const result = await appClient.query({
    query: gql`
    query($taskId: String, $sessionId: String) {
      fetchActivitiesTeams(taskId: $taskId, sessionId: $sessionId) {
        name
        duration {
          hours
          minutes
        }
        teams {
          resourceId
          resourceType
          users{
            userId
            profileId
            isMandatory
          }
        }
      }
    }
    `,
    variables: {
      taskId,
      sessionId
    },
    fetchPolicy: 'network-only'
  });
  const resp = result.data.fetchActivitiesTeams;
  let data = _.omit(resp, '__typename')
  let activities = [];
  _.each(data,(activity) => {
    let activityData = _.omit(activity, '__typename');
    let teamsArray = [];
    if (activity.teams && activity.teams.length > 0) {
      _.each(activity.teams,function (item,say) {
        let value = _.omit(item, '__typename');
        let userArray = [];
        if (item.users && item.users.length > 0) {
          _.each(item.users,function (user,say) {
            let value = _.omit(user, '__typename')
            userArray.push(value)
          });
        }
        value.users = userArray;
        teamsArray.push(value)
      });
      activityData.teams = teamsArray;
    }
    activities.push(activityData);
  });
  return activities;
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

export async function fetchOfficeActionHandler (Details) {
  const result = await appClient.query({
    query: gql`
    query{
      fetchOffice {
        _id
        officeName
        branchType
      }
    }`,
    variables: {
      Details
    },
    fetchPolicy: 'network-only'
  });
  const offices = result.data.fetchOffice;
  return offices
}

export async function bookTaskInternalAppointment(taskInternalAppointmentInfo) {
  const result = await appClient.mutate({
    mutation: gql`
    mutation($taskInternalAppointmentInfo: taskInternalAppointmentInfo){
        bookTaskInternalAppointment(taskInternalAppointmentInfo: $taskInternalAppointmentInfo) {
        success
        code
        result
      }
    }`,
    variables: {
      taskInternalAppointmentInfo
    }
  });
  const task = result.data.bookTaskInternalAppointment;
  return task;
}

export async function createInternalAppointmentInfo(selfInternalAppointmentInfo) {
  const result = await appClient.mutate({
    mutation: gql`
    mutation($selfInternalAppointmentInfo: selfInternalAppointmentInfo){
        bookSelfTaskInternalAppointment(selfInternalAppointmentInfo: $selfInternalAppointmentInfo) {
        success
        code
        result
      }
    }`,
    variables: {
      selfInternalAppointmentInfo
    }
  });
  const task = result.data.bookSelfTaskInternalAppointment;
  return task;
}

export async function fetchMyConnectionActionHandler() {
  const result = await appClient.query({
    query: gql`
    query{
      fetchConnectionByUser {
        userId
        profileId
        name
      }
    }`,
    fetchPolicy: 'network-only'
  });
  const myConnections = result.data.fetchConnectionByUser;
  return myConnections;
}

export async function getMoolyaAdminsActionHandler(userId, profileId) {
  const result = await appClient.query({
    query: gql`
      query ($userId: String, $profileId: String) {
        fetchMoolyaAdmins(userId:$userId,profileId: $profileId) {
          _id
          displayName
          userName
          profileImage
        }
      }
    `,
    fetchPolicy: 'network-only',
    variables: {
      userId: userId,
      profileId: profileId
    }
  });
  const teamMembers = result.data.fetchMoolyaAdmins;
  return teamMembers
}
