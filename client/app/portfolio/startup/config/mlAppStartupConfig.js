// import {MlViewer,MlViewerTypes} from "../../../../lib/common/mlViewer/mlViewer";
import {MlAppViewer} from "../../../../commons/core/MlAppViewer";
import MlAppStartupListView from "../components/MlAppStartupListView";
import React from "react";
import gql from "graphql-tag";
import MlAppFilterContainer from "../../../commons/filter/MlAppFilterContainer";
import filterData from '../../../commons/config/exploreFilterConfig';

// export const mlAppStartupConfig = new MlViewer.View({
export const mlAppStartupConfig = new MlAppViewer({
  name: "Startup List",
  // viewType:MlViewerTypes.LIST,
  extraFields: [],
  fields: ["firstName", "lastName", "category", "investmentBudget"],
  searchFields: ["firstName", "lastName", "category", "investmentBudget"],
  throttleRefresh: true,
  pagination: true,
  moduleName: "startupPortfolioDetails",
  sort: true,
  perPageLimit: 20,
  viewComponent: <MlAppStartupListView />,
  showActionComponent: true,
  header: true,
  headerComponents:{
    filter: true,
    filterComponent: <MlAppFilterContainer type='STU' />,
    filterData: filterData,
    alphabeticSearch: true,
    alphabeticSearchField: "firstName",
    search: true,
    searchFields: ["aboutUs.startupDescription","chapterName","accountType","communityType","firstName","lastName"]
  },
  /**need to bring with the repo service and passing the context of the community type from the client*/
  graphQlQuery: gql`
              query ($module: String!, $queryProperty: appGenericSearchQueryProperty) {
                data:AppGenericSearch(module: $module, queryProperty: $queryProperty) {
                  count
                  data{
                   ...on startupPortfolioOutput{
                      portfolioDetailsId
                        aboutUs{                                            
                            startupDescription
                            logo{
                               fileUrl
                            }
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
  // graphQlQuery:gql`
  //             query SearchQuery($offset: Int, $limit: Int,$fieldsData:[GenericFilter], $sortData:[SortFilter]) {
  //             data:SearchQuery(module:"startupPortfolioDetails", offset: $offset, limit: $limit,fieldsData:$fieldsData, sortData:$sortData){
  //                   totalRecords
  //                   data{
  //                    ...on startupPortfolioOutput{
  //                             portfolioDetailsId
  //                             aboutUs{
  //                                 description
  //                             }
  //                          }
  //                     }
  //             }
  //             }
  //             `
});
