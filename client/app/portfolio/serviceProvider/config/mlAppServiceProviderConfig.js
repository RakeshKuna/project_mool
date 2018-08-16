// import {MlViewer,MlViewerTypes} from "../../../../lib/common/mlViewer/mlViewer";
import {MlAppViewer} from "../../../../commons/core/MlAppViewer";
import MlAppServiceProviderListView from "../components/MlAppServiceProviderListView";
import React from "react";
import gql from "graphql-tag";
import MlAppFilterContainer from "../../../commons/filter/MlAppFilterContainer";
import filterData from '../../../commons/config/exploreFilterConfig';

export const mlAppServiceProviderConfig = new MlAppViewer({
  name: "Service Provider List",
  // viewType:MlViewerTypes.LIST,
  extraFields: [],
  fields: ["firstName", "lastName", "category", "investmentBudget"],
  searchFields: ["firstName", "lastName", "category", "investmentBudget"],
  throttleRefresh: true,
  pagination: true,
  moduleName: "serviceProviderPortfolioDetails",
  sort: true,
  perPageLimit: 20,
  viewComponent: <MlAppServiceProviderListView />,
  showActionComponent: true,
  header: true,
  headerComponents:{
    filter: true,
    filterComponent: <MlAppFilterContainer type="SPS"/>,
    filterData: filterData,
    alphabeticSearch: true,
    alphabeticSearchField: "about.aboutTitle",
    search: true,
    searchFields: ["about.aboutTitle","chapterName","accountType","communityType","firstName","lastName"]
  },
  graphQlQuery: gql`
              query ($module: String!, $queryProperty: appGenericSearchQueryProperty) {
                data: AppGenericSearch(module: $module, queryProperty: $queryProperty) {
                  count
                    data{
                      ...on serviceProviderPortfolioDetails{
                        portfolioDetailsId
                        about{
                          aboutTitle
                        }
                        chapterName
                        accountType
                        communityType
                        firstName
                        lastName
                        profileImage
                        isDefaultSubChapter
                        subChapterName
                      }
                    }
                }
              }
            `
  // graphQlQuery:gql`
  //             query SearchQuery($offset: Int, $limit: Int,$fieldsData:[GenericFilter], $sortData:[SortFilter]) {
  //             data:SearchQuery(module:"serviceProviderPortfolioDetails", offset: $offset, limit: $limit,fieldsData:$fieldsData, sortData:$sortData){
  //                   totalRecords
  //                   data{
  //                    ...on serviceProviderPortfolioDetails{
  //                             portfolioDetailsId
  //                             about{
  //                                 aboutTitle
  //                             }
  //                          }
  //                     }
  //             }
  //             }
  //             `
});
