/**
 * Created by vishwadeep on 7/6/17.
 */
import gql from "graphql-tag";
import {appClient} from "../../../../app/core/appConnection";

export async function findOfficeAction(officeId) {
  const result = await appClient.query({
    query: gql`
          query($officeId:String){
              findOfficeDetail(officeId:$officeId){
                success
                code
                result
              }  
          }
      `,
    variables: {
      officeId: officeId
    },
    fetchPolicy: 'network-only'
  })
  const id = result.data.findOfficeDetail;
  return id
}

export async function fetchOfficePackages() {
  const result = await appClient.query({
    query: gql `
      query{
            fetchOfficePackages{
              serviceCardName,
              displayName,
              cardType,
              frequencyType,
              accountType,
              isMoolya,
              isOthers,
              isActive,
              applicableCommunity{
                communityName,
                communityId
              },
              availableCommunities{
                communityName,
                communityId,
                userCount
              },
              clusters{
                clusterId,
                clusterName
              },
              chapters{
                chapterId,
                chapterName
              },
              subChapters{
                subChapterId,
                subChapterName
              }
              totalCount,
              principalUserCount,
              teamUserCount
              isBSpoke
            }
          }
          `,
    fetchPolicy: 'network-only'
  })
  const data = result.data.fetchOfficePackages
  return data
}
