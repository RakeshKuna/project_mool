
import gql from 'graphql-tag'
import {appClient} from '../../../app/core/appConnection';
import mlConversationUtils from '../../../commons/conversations/utils/mlconversationUtils'

export async function fetchUserDetailsHandler() {
  const result = await appClient.query({
    query: gql`
         query{
        findRegistrationInfoForUser {
       _id
       status
       isAllowRegisterAs
       firstName
       profileImage
       headerCommunityDisplay
       isCalendar
       pendingRegId
       portfolioStatus
          registrationInfo {
            firstName
            lastName
            contactNumber
            email
            userName
            countryId
            registrationType
            subChapterId
          }
        }
      }
        `,
    fetchPolicy: 'network-only'
  })

  const user = result.data.findRegistrationInfoForUser;
  return user;
}

export async function fetchPortfolioDetails() {
  const result = await appClient.query({
    query: gql`
         query{
        fetchPortfolioDetailsByUserId {
          portfolioId : _id
          communityType
          communityCode
          portfolioImage
          portfolioUserName
          portfolioImage
          transactionCreatedDate
          transactionUpdatedDate
          lastLiveDate
        }
      }
        `,
    fetchPolicy: 'network-only'
  })

  const user = result.data.fetchPortfolioDetailsByUserId;
  return user;
}

export async function requestPortfolioForGoLive(resId) {
  let portfoliodetailsId  = resId
  const result = await appClient.mutate({
    mutation: gql`
            mutation  ($portfoliodetailsId: String, ){
                requestForGoLive(portfoliodetailsId:$portfoliodetailsId){
                    success,
                    code,
                    result
                }
            }
        `,
    variables: {
      portfoliodetailsId
    }
  })
  const response = result.data.requestForGoLive;
  return response
}

export async function findDefaultProfile() {
  const result = await appClient.query({
    query: gql`
      query{
        findDefaultUserProfile{
          profileId,
          countryId,
          clusterId,
          clusterName,
          chapterId,
          chapterName,
          subChapterId,
          subChapterName,
          communityId,
          communityName
        }
      }
    `
  })

  const response = result.data.findDefaultUserProfile;
  return response
}


export function getNotifications(cb) {
  mlConversationUtils.getUnreadNotifications(cb)
  mlConversationUtils.getNotifications(cb)
  //mlConversationUtils.ackNotification(payload, cb)
}

export function getNotificationsCounter(cb) {
  mlConversationUtils.getNotificationsCounter(cb)

}
