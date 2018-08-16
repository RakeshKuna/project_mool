import {MlAppViewer} from "../../../../commons/core/MlAppViewer";
import MlAppCompanyListView from "../components/MlAppCompaniesListView";
import React from "react";
import gql from "graphql-tag";
import MlAppFilterContainer from "../../../commons/filter/MlAppFilterContainer";
import filterData from '../../../commons/config/exploreFilterConfig';

export const mlAppCompanyConfig = new MlAppViewer({
  name: "Company List",
  extraFields: [],
  fields: ["firstName", "lastName", "category", "investmentBudget"],
  searchFields: ["firstName", "lastName", "category", "investmentBudget"],
  throttleRefresh: true,
  pagination: true,
  moduleName: "companyPortfolioDetails",
  sort: true,
  perPageLimit: 20,
  viewComponent: <MlAppCompanyListView />,
  showActionComponent: true,
  header: true,
  headerComponents:{
    filter: true,
    filterComponent: <MlAppFilterContainer type="CMP"/>,
    filterData: filterData,
    alphabeticSearch: true,
    alphabeticSearchField: "firstName",
    search: true,
    searchFields: ["aboutUs.companyDescription", "firstName", "lastName", "chapterName", "accountType", "communityType"]
  },
  graphQlQuery: gql`
              query ($module: String!, $queryProperty: appGenericSearchQueryProperty) {
                data: AppGenericSearch(module: $module, queryProperty: $queryProperty) {
                  count
                    data{
                      ...on CompanyPortfolio{
                        portfolioDetailsId
                        aboutUs{
                          companyDescription
                        }
                        chapterName
                        accountType
                        communityType
                        firstName
                        lastName
                        profileImage
                        likes
                        connections
                        views
                        followings
                        isDefaultSubChapter
                        subChapterName
                      }
                    }
                }
              }
            `
});
