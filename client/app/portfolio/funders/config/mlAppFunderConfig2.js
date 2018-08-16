
// import {MlViewer,MlViewerTypes} from "../../../../lib/common/mlViewer/mlViewer";
import {MlAppViewer} from '../../../../commons/core/MlAppViewer';
import MlAppFunderListView from '../components/MlAppFunderListView';
import MlAppFilterContainer from "../../../commons/filter/MlAppFilterContainer";
import filterData from '../../../commons/config/exploreFilterConfig';
import React from 'react';
import gql from 'graphql-tag'

export const mlAppFunderConfig2=new MlAppViewer({
  name:"FundersList",
  moduleName:"FunderPortfolio",
  perPageLimit: 20,
  header: true,
  headerComponents:{
    filter: true,
    filterComponent: <MlAppFilterContainer type="FUN"/>,
    filterData: filterData,
    alphabeticSearch: true,
    alphabeticSearchField: "funderAbout.firstName",
    search: true,
    searchFields: ["funderAbout.firstName", "firstName", "lastName", "chapterName", "accountType", "communityType"]
  },
  viewComponent:<MlAppFunderListView />,
  graphQlQuery:gql`
              query ($module: String!, $queryProperty: appGenericSearchQueryProperty) {
                data: AppGenericSearch(module: $module, queryProperty: $queryProperty) {
                  count
                  data {
                    ...on FunderPortfolio {
                      portfolioDetailsId
                      funderAbout {
                        firstName
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
});
