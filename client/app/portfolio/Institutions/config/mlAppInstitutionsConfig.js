/**
 * Created by vishwadeep on 19/8/17.
 */
import {MlAppViewer} from "../../../../commons/core/MlAppViewer";
import MlAppInstitutionListView from "../components/MlAppInstitutionsListView";
import React from "react";
import gql from "graphql-tag";
import MlAppFilterContainer from "../../../commons/filter/MlAppFilterContainer";
import filterData from '../../../commons/config/exploreFilterConfig';

export const mlAppInstitutionConfig = new MlAppViewer({
  name: "Instituion List",
  extraFields: [],
  fields: ["firstName", "lastName", "category", "investmentBudget"],
  searchFields: ["firstName", "lastName", "category", "investmentBudget"],
  throttleRefresh: true,
  pagination: true,
  moduleName: "institutionPortfolioDetails",
  sort: true,
  perPageLimit: 20,
  viewComponent: <MlAppInstitutionListView />,
  header: true,
  headerComponents:{
    filter: true,
    filterComponent: <MlAppFilterContainer type='INS'/>,
    filterData: filterData,
    alphabeticSearch: true,
    alphabeticSearchField: "firstName",
    search: true,
    searchFields: ["aboutUs.companyDescription", "firstName", "lastName", "chapterName", "accountType", "communityType"]
  },
  showActionComponent: true,
  graphQlQuery: gql`
              query ($module: String!, $queryProperty: appGenericSearchQueryProperty) {
                data: AppGenericSearch(module: $module, queryProperty: $queryProperty) {
                  count
                    data{
                      ...on InstitutionPortfolio{
                        portfolioDetailsId
                        aboutUs{
                          institutionDescription
                        }
                        chapterName
                        accountType
                        communityType
                        firstName
                        lastName
                        likes
                        connections
                        views
                        followings
                        profileImage
                        isDefaultSubChapter
                        subChapterName
                      }
                    }
                }
              }
            `
});
