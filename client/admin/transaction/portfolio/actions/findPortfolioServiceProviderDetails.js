import gql from "graphql-tag";
import {client} from "../../../core/apolloConnection";
import _ from "underscore";

/**
 * Service providers all action handler
 * */
export async function fetchServiceProviderPortfolioAwards(portfoliodetailsId) {
  const result = await client.query({
    query: gql`
          query ($portfoliodetailsId: String!) {
            data: fetchServiceProviderDetails(portfoliodetailsId: $portfoliodetailsId, key:"awardsRecognition") {
            awardsRecognition{
              awardName
              awardId
              isAwardPrivate
              year
              isYearPrivate
              awardsDescription
              isDescriptionPrivate
              logo{
                fileName,
                fileUrl
              },
              makePrivate
              index
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
  const id = result.data.data && result.data.data.awardsRecognition;
  return id
}

export async function fetchServiceProviderPortfolioClients(portfoliodetailsId) {
  const result = await client.query({
    query: gql`
          query ($portfoliodetailsId: String!) {
            data: fetchServiceProviderDetails(portfoliodetailsId: $portfoliodetailsId, key:"clients") {
            clients{
              companyName
              isCompanyNamePrivate
              clientDescription
              isClientDescriptionPrivate
              index
              logo{
                fileName
                fileUrl
              } 
              makePrivate
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
  const id = result.data.data && result.data.data.clients;
  return id
}

export async function fetchServiceProviderPortfolioAbout(portfoliodetailsId) {
  const result = await client.query({
    query: gql`
          query ($portfoliodetailsId: String!) {
            data: fetchServiceProviderDetails(portfoliodetailsId: $portfoliodetailsId, key:"about") {
            about{
              aboutTitle
              isAboutTitlePrivate
              aboutDescription
              isDescriptionPrivate
              aboutImages{
                fileName
                fileUrl
              } 
              privateFields{
                  keyName,
                  booleanKey
                  tabName
                  index
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
  const id = result.data.data && result.data.data.about;
  return id
}


export async function fetchDetailsStartupActionHandler(portfoliodetailsId) {
  const result = await client.query({
    query: gql`
          query ($portfoliodetailsId: String!) {
            fetchStartupPortfolioAboutUs(portfoliodetailsId: $portfoliodetailsId) {
                aboutUs{
                  description
                  logo{
                    fileName
                    fileUrl
                  }
                  isLogoPrivate
                  isDescriptionPrivate
                  annotatorId
                }
                rating{
                  rating
                  isRatingPrivate
                }
                clients{
                  companyName
                  isCompanyNamePrivate
                  description
                  isDescriptionPrivate
                  logo{
                    fileName
                    fileUrl
                  }
                  makePrivate
                  index
                }
                serviceProducts{
                  description
                  isDescriptionPrivate
                }
                information{
                  description
                  isDescriptionPrivate
                }
                assets{
                  assetTypeName
                  assetTypeId
                  quantity
                  description
                  isAssetTypePrivate
                  isQuantityTypePrivate
                  isDescriptionPrivate
                  makePrivate
                  logo{
                    fileName
                    fileUrl
                  }
                  index
                }
                branches{
                  addressTypeId
                  name
                  isNamePrivate
                  phoneNumber
                  isPhoneNumberPrivate
                  address1
                  isAddressOnePrivate
                  address2
                  isAddressTwoPrivate
                  landmark
                  isLandmarkPrivate
                  area
                  isAreaPrivate
                  city
                  isCityPrivate
                  state
                  isStatePrivate
                  country
                  isCountryPrivate
                  addressImage
                  makePrivate
                  logo{
                    fileName
                    fileUrl
                  }
                  index
                }
                technologies{
                  technologyName
                  technologyId
                  isTechnologyPrivate
                  description
                  isDescriptionPrivate
                  makePrivate
                  logo{
                    fileName
                    fileUrl
                  }
                  index
                }
                legalIssue{
                  description
                  isDescriptionPrivate
                }
                rating{
                  rating
                }
            }
          }

      `,
    variables: {
      portfoliodetailsId: portfoliodetailsId
    },
    fetchPolicy: 'network-only'
  })

  const data = result.data.fetchStartupPortfolioAboutUs;
  /*let data = _.omit(id,'__typename');*/
  let aboutUsArray = {}
  aboutUsArray["aboutUs"] = _.omit(data.aboutUs, '__typename');
  aboutUsArray["clients"] = _.map(data.clients, function (row) {
    return _.omit(row, ['__typename'])
  });
  aboutUsArray["serviceProducts"] = _.omit(data.serviceProducts, '__typename');
  aboutUsArray["information"] = _.omit(data.information, '__typename');
  aboutUsArray["branches"] = _.map(data.branches, function (row) {
    return _.omit(row, ['__typename'])
  });
  aboutUsArray["technologies"] = _.map(data.technologies, function (row) {
    return _.omit(row, ['__typename'])
  });
  aboutUsArray["legalIssue"] = _.omit(data.legalIssue, '__typename');
  aboutUsArray["assets"] = _.map(data.assets, function (row) {
    return _.omit(row, ['__typename'])
  });
  aboutUsArray["rating"] = _.omit(data.rating, '__typename');

  return aboutUsArray
}

export async function findStartupInvestorDetailsActionHandler(portfoliodetailsId) {

  const result = await client.query({
    query: gql`
          query ($portfoliodetailsId: String!) {
            fetchStartupPortfolioInvestor(portfoliodetailsId: $portfoliodetailsId) {
                name
                fundingTypeId
                investmentAmount
                description
                isNamePrivate
                isInvestmentAmountPrivate
                isDescriptionPrivate
                logo{
                    fileName
                    fileUrl
                  }
                makePrivate
                index
            }
          }

      `,
    variables: {
      portfoliodetailsId: portfoliodetailsId
    },
    fetchPolicy: 'network-only'
  })
  const id = result.data.fetchStartupPortfolioInvestor;
  return id
}

export async function fetchServiceProviderMemberships(portfoliodetailsId) {
  const result = await client.query({
    query: gql`
          query ($portfoliodetailsId: String!) {
            data:fetchServiceProviderDetails(portfoliodetailsId: $portfoliodetailsId, key:"memberships") {
              memberships{
                membershipDescription
                isMembershipPrivate
                privateFields{
                  keyName
                  booleanKey
                  tabName
                  index
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
  const id = result.data.data && result.data.data.memberships;
  let data = _.omit(id, '__typename')
  return data
}

export async function fetchServiceProviderCompliances(portfoliodetailsId) {
  const result = await client.query({
    query: gql`
          query ($portfoliodetailsId: String!) {
            data:fetchServiceProviderDetails(portfoliodetailsId: $portfoliodetailsId, key:"compliances") {
              compliances{
                compliancesDescription
                isCompliancesPrivate
                privateFields{
                  keyName,
                  booleanKey
                  tabName
                  index
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
  const id = result.data.data && result.data.data.compliances;
  let data = _.omit(id, '__typename')
  return data
}
export async function fetchServiceProviderLicenses(portfoliodetailsId) {
  const result = await client.query({
    query: gql`
          query ($portfoliodetailsId: String!) {
            data:fetchServiceProviderDetails(portfoliodetailsId: $portfoliodetailsId, key:"licenses") {
              licenses{
                licensesDescription
                isLicensesPrivate
                privateFields{
                  keyName,
                  booleanKey
                  tabName
                  index
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
  const id = result.data.data && result.data.data.licenses;
  let data = _.omit(id, '__typename')
  return data
}

export async function findServiceProviderServicesActionHandler(portfoliodetailsId) {
  const result = await client.query({
    query: gql`
          query ($portfoliodetailsId: String!) {
            data:fetchServiceProviderDetails(portfoliodetailsId: $portfoliodetailsId, key:"services") {
              services{
                servicesDescription
                isServicesPrivate
                privateFields{
                  keyName,
                  booleanKey
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
  const id = result.data.data && result.data.data.services;
  let data = _.omit(id, '__typename')
  return data
}

export async function fetchServiceProviderClients(portfoliodetailsId) {
  const result = await client.query({
    query: gql`
          query ($portfoliodetailsId: String!) {
            data:fetchServiceProviderDetails(portfoliodetailsId: $portfoliodetailsId, key:"clients") {
                clients{
                    companyName
                    isCompanyNamePrivate
                    clientDescription
                    isClientDescriptionPrivate
                    logo{
                      fileName
                      fileUrl
                    }
                    makePrivate
                    index
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
  const id = result.data.data && result.data.data.clients;
  return id
}

export async function findServiceProviderAboutActionHandler(portfoliodetailsId) {
  const result = await client.query({
    query: gql`
          query ($portfoliodetailsId: String!) {
            data:fetchServiceProviderDetails(portfoliodetailsId: $portfoliodetailsId, key:"about") {
                about{
                  aboutTitle
                  isAboutTitlePrivate
                  aboutDescription
                  isDescriptionPrivate
                  aboutImages {
                      fileUrl
                      fileName
                  }
                  privateFields{
                    keyName,
                    booleanKey,
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
  const id = result.data.data && result.data.data.about;
  let data = _.omit(id, '__typename')
  return data
}

export async function findServiceProviderLookingForActionHandler(portfoliodetailsId) {
  const result = await client.query({
    query: gql`
          query ($portfoliodetailsId: String!) {
            data:fetchServiceProviderDetails(portfoliodetailsId: $portfoliodetailsId, key:"lookingFor") {
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
  // let data = _.omit(id, '__typename')
  return id
}

export async function validateUserForAnnotation(portfoliodetailsId) {

  const result = await client.query({
    query: gql`
          query ($portfoliodetailsId: String!) {
            validateUserForAnnotation(portfoliodetailsId: $portfoliodetailsId)
          }

      `,
    variables: {
      portfoliodetailsId: portfoliodetailsId
    },
    fetchPolicy: 'network-only'
  })
  const id = result.data && result.data.validateUserForAnnotation;
  return id
}
