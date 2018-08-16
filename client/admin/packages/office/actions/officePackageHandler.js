/**
 * Created by venkatsrinag on 28/7/17.
 */
import gql from 'graphql-tag'
import {client} from '../../../core/apolloConnection';
import omitDeep from 'omit-deep-lodash';

// export async function fetchCommunitiesHandler() {
//   const result = await client.query({
//     query: gql`
//            query {
//             data: fetchCommunitiesDef {
//                 _id,
//                 name,
//                 communityName,
//                 displayName,
//                 code,
//                 communityImageLink,
//                 aboutCommunity,
//                 isActive,
//             }
//           }
//         `,
//     fetchPolicy: 'network-only'
//   })
//
//   const communities = result.data.data;
//   return communities;
// }

export async function createOfficePackageHandler(officePackage) {
  const result = await client.mutate({
    mutation : gql`
       mutation($package:officePackage)  {
          data: createOfficePackage(package:$package) {
            success,
            code,
            result
          }
       }
    `,
    variables:{
      package:officePackage
    }
  })

  const communities = result.data.data;
  return communities;
}

export async function updateOfficePackageHandler(officePackageId, officePackage) {
  const result = await client.mutate({
    mutation : gql`
       mutation($package:officePackage, $packageId:String)  {
          data: updateOfficePackage(package:$package, packageId:$packageId) {
            success,
            code,
            result
          }
       }
    `,
    variables:{
      packageId:officePackageId,
      package:officePackage
    }
  })

  const communities = result.data.data;
  return communities;
}


export async function fetchOfficePackageHandler(officeId) {
  const result = await client.query({
    query : gql`
       query($officePackageId:String){
          fetchOfficePackageById(officePackageId:$officePackageId){
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
          }
       }
    `,
    variables:{
      officePackageId:officeId
    },
    fetchPolicy: 'network-only'
  })

  var communities = result.data.fetchOfficePackageById;
  communities = omitDeep(communities, '__typename')
  return communities;
}
