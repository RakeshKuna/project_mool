import gql from 'graphql-tag'
import {client} from '../../../core/apolloConnection';
import _ from "underscore";

// export async function findStartupManagementActionHandler(portfoliodetailsId) {
//
//   const result = await client.query({
//     query: gql`
//           query ($portfoliodetailsId: String!) {
//             fetchStartupPortfolioManagement(portfoliodetailsId: $portfoliodetailsId) {
//                title
//                isTitlePrivate
//                firstName
//                isFirstNamePrivate
//                lastName
//                isLastNamePrivate
//                middleName
//                isMiddleNamePrivate
//                qualification
//                isQualificationPrivate
//                certification
//                isCertificationPrivate
//                profilePic
//                isProfilePicPrivate
//                gender
//                isGenderPrivate
//                designation
//                isDesignationPrivate
//                yearsOfExperience
//                isYOEPrivate
//                joiningDate
//                isJoiningDatePrivate
//                firstJobJoiningDate
//                isFJJDPrivate
//                universities
//                isUniversitiesPrivate
//                awards
//                isAwardsPrivate
//                linkedInUrl
//                isLinkedInUrlPrivate
//                about
//                isAboutPrivate
//                 logo{
//                   fileName
//                   fileUrl
//                 }
//                 index
//             }
//           }
//
//       `,
//     variables: {
//       portfoliodetailsId: portfoliodetailsId
//     },
//     fetchPolicy: 'network-only'
//   })
//   console.log(result)
//   const id = result.data.fetchStartupPortfolioManagement;
//   let managementArray = [];
//   managementArray = _.map(id, function (row) {
//     return _.omit(row, ['__typename'])
//   });
//   // let data = _.omit(id,'__typename')
//   // return data
//   return managementArray;
// }

export async function fetchDetailsStartupActionHandler(portfoliodetailsId) {
  const result = await client.query({
    query: gql`
          query ($portfoliodetailsId: String!) {
            fetchStartupPortfolioAboutUs(portfoliodetailsId: $portfoliodetailsId) {
                aboutUs{
                  startupDescription,
                  logo{
                    fileName,
                    fileUrl
                  }
                  privateFields{
                      keyName
                      booleanKey
                      index
                      tabName
                  }
                  isLogoPrivate,
                  isDescriptionPrivate,
                  annotatorId
                }
                rating{
                  rating,
                  isRatingPrivate,
                  privateFields{
                    keyName,
                    booleanKey
                    tabName
                    index
                  }
                }
                clients{
                  companyName
                  isCompanyNamePrivate
                  clientDescription
                  isDescriptionPrivate
                  logo{
                    fileName
                    fileUrl
                  }
                  makePrivate
                  index
                  privateFields{
                    keyName
                    booleanKey
                    index
                    tabName
                  }
                }
                serviceProducts{
                  spDescription
                  isDescriptionPrivate
                  privateFields{
                    keyName,
                    booleanKey
                    tabName
                    index
                  }
                }
                information{
                  informationDescription
                  isDescriptionPrivate
                  privateFields{
                    keyName
                    booleanKey
                    tabName
                    index
                  }
                }
                assets{
                  assetTypeName
                  assetTypeId
                  quantity
                  assetDescription
                  isAssetTypePrivate
                  isQuantityTypePrivate
                  isDescriptionPrivate
                  makePrivate
                  logo{
                    fileName
                    fileUrl
                  }
                  index
                  privateFields{
                    keyName
                    booleanKey
                    tabName
                    index
                  }
                }
                branches{
                  addressTypeId
                  branchName
                  isNamePrivate
                  branchPhoneNumber
                  isPhoneNumberPrivate
                  branchAddress1
                  isAddressOnePrivate
                  branchAddress2
                  isAddressTwoPrivate
                  branchLandmark
                  isLandmarkPrivate
                  branchArea
                  isAreaPrivate
                  branchCity
                  cityId
                  isCityPrivate
                  branchState
                  stateId
                  isStatePrivate
                  branchCountry
                  countryId
                  isCountryPrivate
                  addressImage
                  makePrivate
                  logo{
                    fileName
                    fileUrl
                  }
                  index
                  privateFields{
                    keyName
                    booleanKey
                    index
                    tabName
                  }
                }
                technologies{
                  technologyName
                  technologyId
                  isTechnologyPrivate
                  technologyDescription
                  isDescriptionPrivate
                  makePrivate
                  logo{
                    fileName
                    fileUrl
                  }
                  index
                  privateFields{
                    keyName
                    booleanKey
                    tabName
                    index
                  }
                }
                legalIssue{
                  legalDescription
                  isDescriptionPrivate
                  privateFields{
                    keyName
                    booleanKey
                    tabName
                    index
                  }
                }
                rating{
                  rating
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
  // let data = _.omit(id,'__typename')
  // return data
  return id
}

export async function fetchStartupPortfolioLookingFor(portfoliodetailsId) {

  const result = await client.query({
    query: gql`
          query ($portfoliodetailsId: String!) {
            fetchStartupPortfolioLookingFor(portfoliodetailsId: $portfoliodetailsId) {
                lookingForName,
                typeId,
                isTypePrivate
                description
                isDescriptionPrivate
                logo{
                    fileName
                    fileUrl
                  }
                index
                makePrivate
            }
          }

      `,
    variables: {
      portfoliodetailsId: portfoliodetailsId
    },
    fetchPolicy: 'network-only'
  })
  const id = result.data.fetchStartupPortfolioLookingFor;
  // let data = _.omit(id,'__typename')
  // return data
  return id
}

export async function fetchStartupPortfolioAwards(portfoliodetailsId) {
  const result = await client.query({
    query: gql`
          query ($portfoliodetailsId: String!) {
            fetchStartupPortfolioAwards(portfoliodetailsId: $portfoliodetailsId) {
                  awardId
                  awardName
                  index
                  isAwardPrivate
                  year
                  isYearPrivate
                  description
                  isDescriptionPrivate
                  logo{
                    fileName
                    fileUrl
                  }
                  makePrivate
            }
          }

      `,
    variables: {
      portfoliodetailsId: portfoliodetailsId
    },
    fetchPolicy: 'network-only'
  })
  const id = result.data.fetchStartupPortfolioAwards;
  return id
}
export async function fetchStartupPortfolioMemberships(portfoliodetailsId) {

  const result = await client.query({
    query: gql`
          query ($portfoliodetailsId: String!) {
            fetchStartupPortfolioMemberships(portfoliodetailsId: $portfoliodetailsId) {
                  description
                  isDescriptionPrivate
            }
          }

      `,
    variables: {
      portfoliodetailsId: portfoliodetailsId
    },
    fetchPolicy: 'network-only'
  })
  const id = result.data.fetchStartupPortfolioMemberships;
  let data = _.omit(id, '__typename')
  return data
  // return id
}
export async function fetchStartupPortfolioCompliances(portfoliodetailsId) {

  const result = await client.query({
    query: gql`
          query ($portfoliodetailsId: String!) {
            fetchStartupPortfolioCompliances(portfoliodetailsId: $portfoliodetailsId) {
                  description
                  isDescriptionPrivate
            }
          }

      `,
    variables: {
      portfoliodetailsId: portfoliodetailsId
    },
    fetchPolicy: 'network-only'
  })
  const id = result.data.fetchStartupPortfolioCompliances;
  let data = _.omit(id, '__typename')
  return data
  // return id
}
export async function fetchStartupPortfolioLicenses(portfoliodetailsId) {

  const result = await client.query({
    query: gql`
          query ($portfoliodetailsId: String!) {
            fetchStartupPortfolioLicenses(portfoliodetailsId: $portfoliodetailsId) {
                  description
                  isDescriptionPrivate
            }
          }

      `,
    variables: {
      portfoliodetailsId: portfoliodetailsId
    },
    fetchPolicy: 'network-only'
  })
  const id = result.data.fetchStartupPortfolioLicenses;
  let data = _.omit(id, '__typename')
  return data
  // return id
}

export async function fetchStartupPortfolioData(portfoliodetailsId, connection) {

  const result = await connection.query({
    query: gql`
          query ($portfoliodetailsId: String!) {
            fetchStartupPortfolioData(portfoliodetailsId: $portfoliodetailsId) {
                  balanceSheet{
                    fileUrl
                    fileName
                   } 
                  profitAndLoss{
                    fileUrl
                    fileName
                   } 
                  quaterlyReport{
                    fileUrl
                    fileName
                   } 
                  yearlyReport{
                    fileUrl
                    fileName
                   } 
                  halfYearlyReport{
                    fileUrl
                    fileName
                   } 
                  annualReport{
                    fileUrl
                    fileName
                   } 
                  cashFlow{
                    fileUrl
                    fileName
                   } 
                  shareHoldings{
                    fileUrl
                    fileName
                   } 
                  capitalStructure{
                    fileUrl
                    fileName
                   } 
                  ratio{
                    fileUrl
                    fileName
                   } 
            }
          }

      `,
    variables: {
      portfoliodetailsId: portfoliodetailsId
    },
    fetchPolicy: 'network-only'
  })
  const id = result.data.fetchStartupPortfolioData;
  let reportsArray = {}
  reportsArray["balanceSheet"] = _.map(id.balanceSheet, function (row) {
    return _.omit(row, ['__typename'])
  });
  reportsArray["profitAndLoss"] = _.map(id.profitAndLoss, function (row) {
    return _.omit(row, ['__typename'])
  });
  reportsArray["quaterlyReport"] = _.map(id.quaterlyReport, function (row) {
    return _.omit(row, ['__typename'])
  });
  reportsArray["yearlyReport"] = _.map(id.yearlyReport, function (row) {
    return _.omit(row, ['__typename'])
  });
  reportsArray["halfYearlyReport"] = _.map(id.halfYearlyReport, function (row) {
    return _.omit(row, ['__typename'])
  });
  reportsArray["annualReport"] = _.map(id.annualReport, function (row) {
    return _.omit(row, ['__typename'])
  });
  reportsArray["cashFlow"] = _.map(id.cashFlow, function (row) {
    return _.omit(row, ['__typename'])
  });
  reportsArray["shareHoldings"] = _.map(id.shareHoldings, function (row) {
    return _.omit(row, ['__typename'])
  });
  reportsArray["ratio"] = _.map(id.ratio, function (row) {
    return _.omit(row, ['__typename'])
  });
  reportsArray["capitalStructure"] = _.map(id.capitalStructure, function (row) {
    return _.omit(row, ['__typename'])
  });

  /*return chartsArray
   let data = _.omit(id, '__typename')*/
  return reportsArray
  // return idml
  // return id
}

export async function fetchDetailsStartupChartsActionHandler(portfoliodetailsId) {
  const result = await client.query({
    query: gql`
          query ($portfoliodetailsId: String!) {
            fetchStartupPortfolioCharts(portfoliodetailsId: $portfoliodetailsId) {
               
                employmentOfCompanyChart{
                    eofAbout
                    eofFromMonth
                    eofFromYear
                    eofToMonth
                    eofToYear
                    eofNumberOfEmployment
                    index
                }
                profitRevenueLiabilityChart{
                    prlEntityType
                    prlFromMonth
                    prlFromYear
                    prlToMonth
                    prlToYear
                    pelValueType
                    prlValue
                    prlabout
                    index
                }
                reviewOfCompanyChart{
                    rofYear
                    rofValue
                    rofAbout
                    index
                }
                employeeBreakupDepartmentChart{
                    ebdFromMonth
                    ebdFromYear
                    ebdToMonth
                    ebdToYear
                    ebdDepartment
                    ebdNumberOfEmployment
                    ebdAbout
                    ebdDepartmentName
                    index
                }
            }
          }

      `,
    variables: {
      portfoliodetailsId: portfoliodetailsId
    },
    fetchPolicy: 'network-only'
  })

  const data = result.data.fetchStartupPortfolioCharts;
  /*let data = _.omit(id,'__typename');*/
  let chartsArray = {}
  chartsArray["employmentOfCompanyChart"] = _.map(data.employmentOfCompanyChart, function (row) {
    return _.omit(row, ['__typename'])
  });
  chartsArray["profitRevenueLiabilityChart"] = _.map(data.profitRevenueLiabilityChart, function (row) {
    return _.omit(row, ['__typename'])
  });
  chartsArray["reviewOfCompanyChart"] = _.map(data.reviewOfCompanyChart, function (row) {
    return _.omit(row, ['__typename'])
  });
  chartsArray["employeeBreakupDepartmentChart"] = _.map(data.employeeBreakupDepartmentChart, function (row) {
    return _.omit(row, ['__typename'])
  });

  return chartsArray
}


export async function fetchStartupDetailsHandler(portfoliodetailsId, key) {

  const result = await client.query({
    query: gql`
          query ($portfoliodetailsId: String!, $key:String) {
              fetchStartupDetails(portfoliodetailsId:$portfoliodetailsId, key:$key){
                  aboutUs{
                      logo{
                        fileName,
                        fileUrl
                      }
                      startupDescription,
                      annotatorId,
                      isLogoPrivate,
                      isDescriptionPrivate,
                      privateFields{
                          keyName,
                          booleanKey
                      }
                  },
                  rating{
                      rating,
                      isRatingPrivate,
                      privateFields{
                          keyName,
                          booleanKey
                      }
                  },
                  serviceProducts{
                      spDescription,
                      isDescriptionPrivate,
                      privateFields{
                          keyName,
                          booleanKey
                      }
                  },
                  information{
                      informationDescription,
                      isDescriptionPrivate,
                      privateFields{
                          keyName,
                          booleanKey
                      }
                  },
                  technologies{
                      technologyName,
                      technologyId,
                      technologyDescription,
                      isTechnologyPrivate,
                      isDescriptionPrivate,
                      logo{,
                          fileName,
                          fileUrl
                      }
                      makePrivate,
                      index
                      privateFields{
                          keyName,
                          booleanKey
                      }
                  },
                  branches{
                      addressTypeId,
                      branchName,
                      isNamePrivate,
                      branchPhoneNumber,
                      isPhoneNumberPrivate,
                      branchAddress1,
                      isAddressOnePrivate,
                      branchAddress2,
                      isAddressTwoPrivate,
                      branchLandmark,
                      isLandmarkPrivate,
                      branchArea,
                      isAreaPrivate,
                      branchCity,
                      cityId,
                      isCityPrivate,
                      branchState,
                      stateId,
                      isStatePrivate,
                      branchCountry,
                      countryId,
                      isCountryPrivate,
                      addressImage,
                      isAddressImagePrivate,
                      logo{
                          fileName,
                          fileUrl
                      },
                      makePrivate,
                      index
                      privateFields{
                          keyName,
                          booleanKey
                      }
                  },
                  clients{
                      companyName,
                      isCompanyNamePrivate,
                      logo{
                          fileName,
                          fileUrl
                      },
                      clientDescription,
                      isDescriptionPrivate,
                      makePrivate,
                      index,
                      privateFields{
                          keyName,
                          booleanKey
                      }
                  },
                  legalIssue{
                      legalDescription,
                      isDescriptionPrivate,
                      privateFields{
                          keyName,
                          booleanKey
                      }
                  },
                  assets{
                      assetTypeId,
                      assetTypeName,
                      isAssetTypePrivate,
                      quantity,
                      isQuantityTypePrivate,
                      assetDescription,
                      isDescriptionPrivate,
                      logo{,
                          fileName,
                          fileUrl
                      }
                      makePrivate,
                      index
                      privateFields{
                          keyName,
                          booleanKey
                      }
                  },
                  management{
                     title
                     isTitlePrivate
                     firstName
                     isFirstNamePrivate
                     lastName
                     isLastNamePrivate
                     middleName
                     isMiddleNamePrivate
                     qualification
                     isQualificationPrivate
                     certification 
                     isCertificationPrivate 
                     profilePic 
                     isProfilePicPrivate 
                     gender 
                     isGenderPrivate 
                     designation 
                     isDesignationPrivate
                     yearsOfExperience 
                     isYOEPrivate 
                     joiningDate 
                     isJoiningDatePrivate
                     firstJobJoiningDate 
                     isFJJDPrivate 
                     universities 
                     isUniversitiesPrivate
                     awards 
                     isAwardsPrivate
                     linkedInUrl 
                     isLinkedInUrlPrivate
                     managmentAbout
                     isAboutPrivate
                      logo{
                        fileName
                        fileUrl
                      }
                      index
                      privateFields{
                          keyName,
                          booleanKey
                          tabName
                          index
                      }
                  },
                  investor{
                    investorName,
                    fundingType,
                    fundingTypeId,
                    investmentAmount,
                    investorDescription,
                    isNamePrivate,
                    isInvestmentAmountPrivate,
                    isDescriptionPrivate,
                    logo{
                      fileName,
                      fileUrl
                    },
                    makePrivate,
                    index
                    privateFields{
                        keyName,
                        booleanKey,
                        index
                        tabName
                    }
                  },
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
                      makePrivate,
                      index
                      privateFields{
                          keyName,
                          booleanKey,
                          index
                          tabName
                      }
                  },
                  
                  lookingFor{
                      lookingForName,
                      lookingForId,
                      isTypePrivate,
                      lookingDescription,
                      isDescriptionPrivate,
                      logo{
                        fileName,
                        fileUrl
                      },
                      makePrivate,
                      index
                      privateFields{
                          keyName,
                          booleanKey
                          index
                          tabName
                      }
                  },
                  
                  memberships{
                    membershipDescription,
                    isDescriptionPrivate,
                    privateFields{
                      keyName
                      booleanKey
                      tabName
                    }
                  },
                  
                  compliances{
                    complianceDescription, 
                    isDescriptionPrivate,
                    privateFields{
                      keyName
                      booleanKey
                      tabName
                    }
                  },
                  
                  licenses{
                    licenseDescription, 
                    isDescriptionPrivate,
                    privateFields{
                      keyName
                      booleanKey
                      tabName
                    }
                  }
              }
          }
      `,
    variables: {
      portfoliodetailsId: portfoliodetailsId,
      key: key
    },
    fetchPolicy: 'network-only'
  })

  const response = result.data.fetchStartupDetails;
  return response;

}
