import gql from 'graphql-tag'
import {client} from '../../../core/apolloConnection';
import _ from 'lodash'

export async function updatePortfolioActionHandler(details) {
  let portfoliodetailsId  = details.portfolioId;
  let portfolio = details.portfolio;
  let privateKeys = details.privateKeys
  let removeKeys = details.removeKeys

  const result = await client.mutate({
      mutation: gql`
          mutation($portfoliodetailsId: String, $portfolio:portfolio, $privateKeys:[privateKeys], $removeKeys:[privateKeys]){
              updatePortfolio(portfoliodetailsId:$portfoliodetailsId, portfolio:$portfolio, privateFields:$privateKeys, removeKeys:$removeKeys){
                  success,
                  code,
                  result
              }  
          }
      `,
    variables: {
        portfoliodetailsId,
        portfolio,
        privateKeys,
        removeKeys
    }
  })
  const id = result.data.updatePortfolio;
  return id
}

export async function updateIdeatorIdeaActionHandler(details, loginUserDetails) {
  let ideaId  = details._id;
  let idea = _.omit(details, '_id');
  idea = _.omit(idea, 'portfolioId');
  const {clusterId, chapterId, subChapterId, communityId} = loginUserDetails ? loginUserDetails : {}
  const result = await client.mutate({
    mutation: gql`
          mutation  ($ideaId: String, $idea:idea, $clusterId: String, $chapterId: String, $subChapterId: String, $communityId: String){
              updateIdea(ideaId:$ideaId, idea:$idea, clusterId: $clusterId, chapterId : $chapterId, subChapterId : $subChapterId, communityId : $communityId){
                  success,
                  code,
                  result
              }  
          }
      `,
    variables: {
      ideaId:ideaId,
      idea:idea,
      clusterId,
      chapterId,
      subChapterId,
      communityId
    }
  })
  const id = result.data.updateIdea;
  return id
}


export async function createAnnotationActionHandler(details) {
  let portfoliodetailsId  = details.portfolioId;
  let quote = details.quote
  let docId = details.docId
  const result = await client.mutate({
    mutation: gql`
          mutation  ($portfoliodetailsId: String, $docId:String, $quote:String){
              createAnnotation(portfoliodetailsId:$portfoliodetailsId, docId:$docId, quote:$quote){
                  success,
                  code,
                  result
              }  
          }
      `,
    variables: {
      portfoliodetailsId,
      docId,
      quote
    }
  })
  const id = result.data.createAnnotation;
  return id
}

export async function approvePortfolio(portfolioId, loggedUserDetails) {
  const {clusterId, chapterId, subChapterId, communityId} = loggedUserDetails;
  const result = await client.mutate({
    mutation: gql`
     mutation($portfoliodetailsId:String, $clusterId: String, $chapterId: String, $subChapterId: String, $communityId: String){
      approvePortfolio(portfoliodetailsId:$portfoliodetailsId,
              clusterId: $clusterId,
              chapterId: $chapterId,
              subChapterId: $subChapterId,
              communityId: $communityId) 
              {
                success
                code
                result
              }
      }
    `,
    variables: {
      portfoliodetailsId:portfolioId,
      clusterId,
      chapterId,
      subChapterId,
      communityId
    }
  })

  const id = result.data.approvePortfolio;
  return id
}

export async function rejectPortfolio(portfolioId) {
  const result = await client.mutate({
    mutation: gql`
     mutation($portfoliodetailsId:String){
      rejectPortfolio(portfoliodetailsId:$portfoliodetailsId) {
          success
          code
          result
        }
      }
    `,
    variables: {
      portfoliodetailsId:portfolioId
    }
  })

  const id = result.data.rejectPortfolio;
  return id
}
