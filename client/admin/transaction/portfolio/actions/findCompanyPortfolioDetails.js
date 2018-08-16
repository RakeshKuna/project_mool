import gql from 'graphql-tag'
import {client} from '../../../core/apolloConnection';
import _ from "underscore";


export async function fetchDetailsCompanyActionHandler(portfoliodetailsId) {
  const result = await client.query({
    query: gql`
          query ($portfoliodetailsId: String!) {
            fetchCompanyPortfolioAboutUs(portfoliodetailsId: $portfoliodetailsId) {
                aboutUs{
                      logo{
                        fileName,
                        fileUrl
                      }
                      companyDescription,
                      annotatorId,
                      isLogoPrivate,
                      isCompanyDescriptionPrivate,
                      privateFields{
                          keyName,
                          booleanKey
                          tabName
                          index
                      }
                  },
                  rating{
                      rating,
                      isRatingPrivate,
                      privateFields{
                          keyName,
                          booleanKey
                          tabName
                          index
                      }
                  },
                  serviceProducts{
                      spDescription,
                      isSPDescriptionPrivate,
                      privateFields{
                          keyName
                          booleanKey
                          index
                          tabName
                      }
                  },
                  information{
                      informationDescription,
                      isInformationDescriptionPrivate,
                      privateFields{
                          keyName,
                          booleanKey
                          tabName
                          index
                      }
                  },
                  clients{
                      clientName,
                      isClientNamePrivate,
                      logo{
                          fileName,
                          fileUrl
                      },
                      clientDescription,
                      isClientDescriptionPrivate,
                      makePrivate,
                      index,
                      privateFields{
                          keyName,
                          booleanKey
                          tabName
                          index
                      }
                  },
            }
          }

      `,
    variables: {
      portfoliodetailsId: portfoliodetailsId
    },
    fetchPolicy: 'network-only'
  })

  const data = result.data.fetchCompanyPortfolioAboutUs;
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


export async function fetchCompanyDetailsHandler(portfoliodetailsId, key) {

  const result = await client.query({
    query: gql`
          query ($portfoliodetailsId: String!, $key:String) {
              fetchCompanyDetails(portfoliodetailsId:$portfoliodetailsId, key:$key){
                  aboutUs{
                      logo{
                        fileName,
                        fileUrl
                      }
                      companyDescription,
                      annotatorId,
                      isLogoPrivate,
                      isCompanyDescriptionPrivate,
                      privateFields{
                        keyName
                        booleanKey
                        tabName
                        index
                      }
                  },
                  rating{
                      rating,
                      isRatingPrivate,
                      privateFields{
                        keyName,
                        booleanKey
                        tabName
                        index
                      }
                  },
                  serviceProducts{
                      spDescription,
                      isSPDescriptionPrivate,
                      privateFields{
                          keyName,
                          booleanKey,
                          tabName
                      }
                  },
                  information{
                      informationDescription,
                      isInformationDescriptionPrivate,
                      privateFields{
                          keyName,
                          booleanKey,
                          tabName
                      }
                  },
                  clients{
                      clientName,
                      isClientNamePrivate,
                      logo{
                          fileName,
                          fileUrl
                      },
                      clientDescription,
                      isClientDescriptionPrivate,
                      makePrivate,
                      index,
                      privateFields{
                          keyName,
                          booleanKey
                          index
                          tabName
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
                     about
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
                          booleanKey
                          index
                          tabName
                      }
                  },
                  memberships{
                    membershipsDescription,
                    isMembershipsDescriptionPrivate,
                    privateFields{
                        keyName,
                        booleanKey
                        tabName
                        index
                    }
                  },
                  
                  compliances{
                     compliancesDescription, 
                     isCompliancesDescriptionPrivate,
                     privateFields{
                        keyName,
                        booleanKey
                        tabName
                        index
                     }
                  },
                  
                  licenses{
                     licensesDescription, 
                     isLicensesDescriptionPrivate,
                     privateFields{
                        keyName,
                        booleanKey,
                        tabName
                        index
                     }
                  }
                  startupIncubators{
                     startupIncubatorsDescription, 
                     isStartupIncubatorsPrivate,
                     privateFields{
                        keyName,
                        booleanKey
                        tabName
                        index
                     }
                  }
                  sectorsAndServices{
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
                        booleanKey,
                        index
                        tabName
                     }
                  }
                  listOfIncubators{
                     listOfIncubatorsDescription, 
                     isListOfIncubatorsPrivate,
                     privateFields{
                        keyName,
                        booleanKey
                        tabName
                        index
                     }
                  }
                  partners {
                    title
                    firstName
                    isFirstNamePrivate
                    lastName
                    isLastNamePrivate
                    designation
                    isDesignationPrivate
                    partnerCompanyName
                    isCompanyNamePrivate
                    duration
                    isDurationPrivate
                    yearsOfExperience
                    isYearsOfExperiencePrivate
                    qualification
                    aboutPartner
                    isQualificationPrivate
                    isAboutPartnerPrivate
                    socialLinks{
                      socialLinkType
                      userId
                      isUserIdPrivate
                    }
                    index
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
                    makePrivate
                  }
                  achievements{
                      achievementName
                      isAchievementNamePrivate
                      achievementDescription
                      isAchievementDescriptionPrivate
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
                      makePrivate
                  }
                  
                  policy{
                      policyDescription,
                      isPolicyDescriptionPrivate,
                      privateFields{
                          keyName,
                          booleanKey
                          tabName
                          index
                      }
                  }
                  evolution{
                      evolutionDescription,
                      isEvolutionDescriptionPrivate,
                      privateFields{
                          keyName,
                          booleanKey
                          tabName
                          index
                      }
                  }
                   researchAndDevelopment{
                      researchAndDevelopmentName
                      isResearchAndDevelopmentNamePrivate
                      researchAndDevelopmentDescription
                      isResearchAndDevelopmentDescriptionPrivate
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
                      makePrivate
                  }
                  intrapreneurRecognition{
                      intrapreneurName
                      year
                      intrapreneurDescription
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
                      makePrivate
                  }
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
      portfoliodetailsId: portfoliodetailsId,
      key: key
    },
    fetchPolicy: 'network-only'
  })

  var response = result.data.fetchCompanyDetails;
  return response;

}



export async function fetchCompanyPortfolioData(portfoliodetailsId, connection) {

  const result = await client.query({
    query: gql`
          query ($portfoliodetailsId: String!) {
            fetchCompanyPortfolioData(portfoliodetailsId: $portfoliodetailsId) {
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
  const id = result.data.fetchCompanyPortfolioData;
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
  // return id
  // return id
}

export async function fetchDetailsCompanyChartsActionHandler(portfoliodetailsId) {
  const result = await client.query({
    query: gql`
          query ($portfoliodetailsId: String!) {
            fetchCompanyPortfolioCharts(portfoliodetailsId: $portfoliodetailsId) {
               
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

  const data = result.data.fetchCompanyPortfolioCharts;
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

export async function fetchCompanyPortfolioReports(portfoliodetailsId, connection) {

  const result = await client.query({
    query: gql`
          query ($portfoliodetailsId: String!) {
            fetchCompanyPortfolioCSRReports(portfoliodetailsId: $portfoliodetailsId) {
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
  const id = result.data.fetchCompanyPortfolioCSRReports;
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
  // return id
}
