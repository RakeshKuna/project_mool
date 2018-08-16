/**
 * Created by venkatsrinag on 3/5/17.
 */
import gql from 'graphql-tag'
import {appClient} from '../../../core/appConnection';

export async function createIdeaActionHandler(ideaDetails) {
    let idea = ideaDetails
    const result = await appClient.mutate({
        mutation: gql`
            mutation ($idea: idea) {
                createIdea(idea: $idea) {
                    success,
                    result,
                    code
                }
            }
        `,
      fetchPolicy: 'network-only',
      variables:{
          idea
      }
    })
    const id = result.data.createIdea;
    return id
}


export async function fetchIdeaActionHandler(portfolioId) {
    const result = await appClient.query({
        query: gql`
            query($portfolioId:String){
                fetchIdeas(portfolioId:$portfolioId) {
                    _id
                    portfolioId
                    title
                    isIdeaTitlePrivate
                    ideaDescription
                    isIdeaPrivate
                    userId
                    isActive
                    ideaImage {
                      fileUrl
                      fileName
                    }
                    privateFields{
                      keyName
                      booleanKey
                      index
                      tabName
                    }
                    createdAt
                    updatedAt
                }
            }
        `,
      variables:{
        portfolioId:  portfolioId
      },
        fetchPolicy: 'network-only'
    })
    const ideas = result.data.fetchIdeas;
    return ideas
}
export async function fetchIdeators() {
  const result = await appClient.query({
    query: gql`
            query{
                fetchIdeators {
                    ideas {
                      _id
                      isActive
                      isIdeaPrivate
                      isIdeaTitlePrivate
                      title
                      ideaDescription
                      portfolioId
                      ideaImage {
                        fileUrl
                        fileName
                      }
                    }
                    accountType
                    chapterName
                    userId
                    name
                }
            }
        `,
    fetchPolicy: 'network-only'
  })
  const ideas = result.data.fetchIdeators;
  return ideas
}

export async function fetchIdeaByPortfolioId(portfolioId) {
  const result = await appClient.query({
    query: gql`
            query($portfolioId:String){
                fetchIdeaByPortfolioId(portfolioId:$portfolioId) {
                      _id
                      isActive
                      isIdeaPrivate
                      isIdeaTitlePrivate
                      title
                      ideaDescription
                      portfolioId
                      ideaImage {
                        fileUrl
                        fileName
                      }
                }
            }
        `,
    variables:{
      portfolioId:portfolioId
    },
    fetchPolicy: 'network-only'
  })
  const ideas = result.data.fetchIdeaByPortfolioId;
  return ideas
}

/**
 * Note: handler user to get the access of all the portfolio's view access
 * @module [all portfolio action handler]
 * */
export async function fetchPortfolioActionHandler(portfoliodetailsId) {
  const result = await appClient.query({
    query: gql`
          query ($portfoliodetailsId: String!) {
            findPortfolioDetails(portfoliodetailsId: $portfoliodetailsId) {
                  clusterId
                  communityType
                  communityCode
                  canAccess
            }
          }
      `,
    variables: {
      portfoliodetailsId: portfoliodetailsId
    },
    fetchPolicy: 'network-only'
  })
  const id = result.data.findPortfolioDetails;
  return id
}

/**
 * Note: Getting the Image of the portfolio
 * @usage [all six portfolio]
 * */
export async function fetchPortfolioImageHandler(portfoliodetailsId) {
  const result = await appClient.query({
    query: gql`
          query ($portfoliodetailsId: String!) {
            fetchPortfolioImage(portfoliodetailsId: $portfoliodetailsId) {
                  portfolioImage
                  portfolioUserName
                  communityType
            }
          }
      `,
    variables: {
      portfoliodetailsId
    },
    fetchPolicy: 'network-only'
  })
  const id = result.data.fetchPortfolioImage;
  return id
}
