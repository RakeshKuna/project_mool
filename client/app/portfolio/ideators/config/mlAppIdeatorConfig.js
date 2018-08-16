/**created by vishwadeep*/
/**
 * import of the routes to be used
 * */
// import {MlViewer,MlViewerTypes} from "../../../../lib/common/mlViewer/mlViewer";
import {MlAppViewer} from "../../../../commons/core/MlAppViewer";
import MlAppIdeatorListView from "../components/MlAppIdeatorListView";
import React from "react";
import gql from "graphql-tag";
import filterData from '../../../commons/config/exploreFilterConfig';
import MlAppFilterContainer from "../../../commons/filter/MlAppFilterContainer";

/**
 * config file to be used in rendering of the component
 * */
//todo://need to be used repo service on the server and send community code from  client with module name as portfolio
export const
  mlAppIdeatorConfig = new MlAppViewer({
  name: "Ideator List",
  extraFields: [],
  fields: ["firstName", "lastName", "category", "investmentBudget"],
  searchFields: ["firstName", "lastName", "category", "investmentBudget"],
  throttleRefresh: true,
  pagination: true,
  moduleName: "ideatorPortfolioDetails",
  sort: true,
  perPageLimit: 20,
  viewComponent: <MlAppIdeatorListView />,
  showActionComponent: true,
  header: true,
  headerComponents:{
    filter: true,
    filterComponent: <MlAppFilterContainer type='IDE' />,
    filterData: filterData,
    alphabeticSearch: true,
    alphabeticSearchField: "name",
    search: true,
    searchFields: ["ideas.title", "accountType", "name", "accountType"]
  },
  graphQlQuery: gql`
              query ($module: String!, $queryProperty: appGenericSearchQueryProperty) {
                data: AppGenericSearch(module: $module, queryProperty: $queryProperty) {
                  count
                  data{
                    ...on Ideator{
                        ideas {
                          _id
                          isActive
                          isIdeaPrivate
                          isIdeaTitlePrivate
                          title
                          ideaDescription
                          portfolioId
                        }
                        accountType
                        chapterName
                        userId
                        name
                        profileImage
                        isDefaultSubChapter
                        subChapterName
                    }
                  }
                }
              }
            `
});
