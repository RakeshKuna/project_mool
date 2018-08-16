/**
 * Created by vishwadeep on 6/5/17.
 */

import gql from 'graphql-tag'
import {client} from '../../../core/apolloConnection';
import _ from 'lodash'
export async function fetchfunderPortfolioAbout(portfoliodetailsId)
{
  const result = await client.query({
    query: gql`
          query ($portfoliodetailsId: String!) {
            data:fetchFunderAbout(portfoliodetailsId: $portfoliodetailsId) {
                    firstName
                    isFirstNamePrivate
                    lastName
                    isLastNamePrivate
                    gender
                    isGenderPrivate
                    category
                    isCategoryPrivate
                    qualification
                    isQualificationPrivate
                    employmentStatus
                    isEmploymentStatusPrivate
                    professionalTag
                    isProfessionalTagPrivate
                    yearsOfExperience
                    isYearsOfExperiencePrivate
                    industry
                    isIndustryPrivate
                    profession
                    isProfessionPrivate
                    investmentFrom
                    investmentCount
                    isInvestmentCountPrivate
                    emailId
                    isEmailIdPrivate
                    mobileNumber
                    isMobileNumberPrivate
                    linkedinUrl
                    isLinkedinUrlPrivate
                    facebookUrl
                    isFacebookUrlPrivate
                    profilePic
                    investmentBudget {
                      from
                      isFromPrivate
                      to
                      isToPrivate
                    }
                    privateFields{
                      keyName,
                      booleanKey,
                      index
                      tabName
                    }
            }
          }
      `,
    variables: {
      portfoliodetailsId: portfoliodetailsId
    },
    fetchPolicy: 'network-only'
  })
  const id = result.data.data && result.data.data;
  let data = _.omit(id,'__typename')
  data.investmentBudget =_.omit(data.investmentBudget,'__typename')
  return data
  // return id
}

export async function fetchfunderPortfolioPrincipal(portfoliodetailsId) {
  const result = await client.query({
    query: gql`
          query ($portfoliodetailsId: String!) {
            data:fetchFunderDetails(portfoliodetailsId: $portfoliodetailsId, key:"principal") {
                  principal {
                    title
                    firstName
                    isFirstNamePrivate
                    lastName
                    isLastNamePrivate
                    designation
                    isDesignationPrivate
                    principalcompanyName
                    isCompanyNamePrivate
                    duration
                    isDurationPrivate
                    yearsOfExperience
                    isYearsOfExperiencePrivate
                    qualification
                    aboutPrincipal
                    isQualificationPrivate
                    isAboutPrincipalPrivate
                    socialLinks{
                      socialLinkType
                      userId
                      isUserIdPrivate
                    }
                    linkedinUrl
                    isLinkedinUrlPrivate
                    index
                    makePrivate
                    logo{
                      fileUrl,
                      fileName
                    }
                    privateFields{
                      keyName,
                      booleanKey
                      index
                      tabName
                    }
                  }  
            }
          }
      `,
    variables: {
      portfoliodetailsId: portfoliodetailsId
    },
    fetchPolicy: 'network-only'
  })
  const id = result.data.data && result.data.data.principal;
  return id
}

export async function fetchfunderPortfolioTeam(portfoliodetailsId) {
  const result = await client.query({
    query: gql`
          query ($portfoliodetailsId: String!) {
            data:fetchFunderDetails(portfoliodetailsId: $portfoliodetailsId, key:"team") {
                team{
                  title
                  firstName
                  isFirstNamePrivate
                  lastName
                  isLastNamePrivate
                  designation
                  isDesignationPrivate
                  teamcompanyName
                  isCompanyNamePrivate
                  duration
                  isDurationPrivate
                  yearsOfExperience
                  isYearsOfExperiencePrivate
                  qualification
                  aboutTeam
                  isQualificationPrivate
                  isAboutTeamPrivate
                  socialLinks{
                    socialLinkType
                    userId
                    isUserIdPrivate
                  }
                  linkedinUrl
                  isLinkedinUrlPrivate
                  index
                  makePrivate
                  logo{
                    fileUrl,
                    fileName
                  }
                  privateFields{
                    keyName,
                    booleanKey
                    index
                    tabName
                  }
                }  
            }
          }
      `,
    variables: {
      portfoliodetailsId: portfoliodetailsId
    },
    fetchPolicy: 'network-only'
  })
  const id = result.data.data && result.data.data.team;
  return id
}

export async function fetchfunderPortfolioInvestor(portfoliodetailsId) {
  const result = await client.query({
    query: gql`
          query ($portfoliodetailsId: String!) {
            data:fetchfunderPortfolioInvestor(portfoliodetailsId: $portfoliodetailsId) {
              dateOfInvestment
              isDateOfInvestmentPrivate
              investmentcompanyName
              isCompanyNamePrivate
              typeOfFundingId
              typeOfFundingName
              isTypeOfFundingPrivate
              aboutInvestment
              isAboutInvestmentPrivate
              makePrivate
              investmentAmount 
              isInvestmentAmountPrivate 
              index
              privateFields{
                keyName,
                booleanKey
                index
                tabName
              }
            }
          }
      `,
    variables: {
      portfoliodetailsId: portfoliodetailsId
    },
    fetchPolicy: 'network-only'
  })
  const id = result.data.data && result.data.data;
  // let data = _.omit(id,'__typename')
  // return data
  return id
}

export async function fetchfunderPortfolioSuccess(portfoliodetailsId) {
  const result = await client.query({
    query: gql`
          query ($portfoliodetailsId: String!) {
            data:fetchFunderDetails(portfoliodetailsId: $portfoliodetailsId, key:"successStories") {
              successStories{
                date
                isDatePrivate
                storyImage
                storyTitle
                isStoryTitlePrivate
                description
                isDescPrivate
                isActive
                makePrivate
                index
                logo{
                    fileName
                    fileUrl
                }
                privateFields{
                  keyName,
                  booleanKey,
                  index,
                  tabName
                }
              }    
            }
          }
      `,
    variables: {
      portfoliodetailsId: portfoliodetailsId
    },
    fetchPolicy: 'network-only'
  })
  const id = result.data.data && result.data.data.successStories;
  return id
}

export async function fetchfunderPortfolioAreaInterest(portfoliodetailsId) {
  const result = await client.query({
    query: gql`
          query ($portfoliodetailsId: String!) {
            data:fetchFunderDetails(portfoliodetailsId: $portfoliodetailsId, key:"areaOfInterest") {
              areaOfInterest{
                industryTypeId
                industryTypeName
                domainType
                makePrivate
                subDomainId
                subDomainName
                isActive
                index
                logo{
                    fileName
                    fileUrl
                }
                privateFields{
                  keyName,
                  booleanKey
                  index
                  tabName
                }
              }    
            }
          }
      `,
    variables: {
      portfoliodetailsId: portfoliodetailsId
    },
    fetchPolicy: 'network-only'
  })
  const id = result.data.data && result.data.data.areaOfInterest;
  return id
}

export async function fetchfunderPortfolioService(portfoliodetailsId) {
  const result = await client.query({
    query: gql`
          query ($portfoliodetailsId: String!) {
            fetchfunderPortfolioService(portfoliodetailsId: $portfoliodetailsId) {
                  dateOfService
                  industryType
                  conversationType
                  about
                  expectedInput
                  expectedOutput
                  mode
                  session
                  duration{
                    hours
                    minutes
                  }
                  attachments{
                    documentName
                    images
                  }
                  investmentAmount 
                  isInvestmentAmountPrivate 
                  index
            }
          }
      `,
    variables: {
      portfoliodetailsId: portfoliodetailsId
    },
    fetchPolicy: 'network-only'
  })
  const id = result.data.fetchfunderPortfolioService;
  // let data = _.omit(id,'__typename')
  // return data
  return id
}
export async function findFunderLookingForActionHandler(portfoliodetailsId) {
  const result = await client.query({
    query: gql`
          query ($portfoliodetailsId: String!) {
            data:fetchFunderDetails(portfoliodetailsId: $portfoliodetailsId, key:"lookingFor") {
              lookingFor{
                lookingForName,
                lookingForId,
                lookingDescription,
                index
                privateFields{
                  keyName
                  booleanKey
                  index
                  tabName
                }
                makePrivate
              }
            }
          }
      `,
    variables: {
      portfoliodetailsId: portfoliodetailsId
    },
    fetchPolicy: 'network-only'
  })
  const id = result.data.data && result.data.data.lookingFor;
  return id
}
