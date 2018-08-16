import gql from "graphql-tag";

export default filterData = [
  {
    type: "MULTISELECT",
    field: "clusterId",
    displayName: "Registered Cluster",
    isGraphql: true,
    graphQLQuery: gql`{
                    data:fetchActiveClusters
                      {
                        value:_id
                        label:clusterName
                      }
                    }
                  `,
    graphQLOption:{},
  },
  {
    type: "MULTISELECT",
    field: "chapterId",
    displayName: "Registered Chapter",
    isGraphql: true,
    graphQLQuery: gql`query($id: [String]) {
                  data:fetchActiveClusterChaptersList(id: $id) {
                      value:_id
                      label:chapterName
                    }
                  }
                `,
    graphQLOption: {
      options: {
        variables: {
          id: "$$clusterId"
        }
      }
    },
  },
  {
    type: "MULTISELECT",
    field: "subChapterId",
    displayName: "Registered SubChapter",
    isGraphql: true,
    graphQLQuery: gql`query($id: [String]) {
                  data:fetchActiveSubChapterList(id: $id) {
                      value:_id
                      label:subChapterDisplayName
                    }
                  }
                `,
    graphQLOption: {
      options: {
        variables: {
          id: "$$chapterId"
        }
      }
    },
  },
  // {
  //   type: "SELECT",
  //   field: "communityCode",
  //   displayName: "Community",
  //   isGraphql: true,
  //   graphQLQuery: gql`{
  //                 data:fetchCommunitiesSelect {
  //                     value:code
  //                     label:name
  //                   }
  //                 }
  //               `,
  //   graphQLOption: {},
  // },
  {
    type: "MULTISELECT",
    field: "industryId",
    displayName: "Industry",
    isGraphql: true,
    graphQLQuery: gql`{
                  data:fetchIndustries {
                      value:_id
                      label:industryName
                    }
                  }
                `,
    graphQLOption: {},
  },
  {
    type: "MULTISELECT",
    field: "subDomainId",
    displayName: "SubDomain",
    isGraphql: true,
    graphQLQuery: gql`query($industryId: [String]) {
      data:fetchIndustryBasedSubDomain(industryId: $industryId) {
          value:_id
          label:name
        }
      }
    `,
    graphQLOption: {
      options: {
        variables: {
          industryId: "$$industryId"
          }
        }
    },
  },
  {
    type: "MULTISELECT",
    field: "userType",
    displayName: "User Type",
    isGraphql: true,
    graphQLQuery: gql`query($communityCode: String) {
      data:FetchUserTypeList(communityCode: $communityCode) {
          value:_id
          label:userTypeName
        }
      }
    `,
    graphQLOption: {
      options: {
        variables: {
          communityCode: "$communityCode"
          }
        }
    },
  },
  {
    type: "MULTISELECT",
    field: "businessType",
    displayName: "Type of Business",
    isGraphql: true,
    graphQLQuery: gql`query{
      data:fetchBusinessTypes{label:businessTypeName,value:_id}
    }
    `,
    graphQLOption: {},
  },
  {
    type: "MULTISELECT",
    field: "stageOfCompany",
    displayName: "Startup Stage",
    isGraphql: true,
    graphQLQuery: gql`query{
      data:fetchStageOfCompany{label:stageOfCompanyName,value:_id}
    }
    `,
    graphQLOption: {},
  },
]
