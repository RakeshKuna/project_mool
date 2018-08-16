/**
 * Created by venkatsrinag on 1/5/17.
 */
import gql from 'graphql-tag'
import {appClient} from '../../../app/core/appConnection';

//todo://this may be of no use have to remove it
/**
 * used this code two times removed onces
 * */
// export async function fetchCommunitiesHandler() {
//     const result = await appClient.query({
//         query: gql`
//            query {
//             data: getOfficeUserTypes {
//                 _id,
//                 name,
//                 code,
//                 displayName,
//                 isActive,
//             }
//           }
//         `,
//         fetchPolicy: 'network-only'
//     })
//
//     const communities = result.data.data;
//     return communities;
// }

/**
 * fetching office user types for office module
 * */
export async function fetchOfficeUserTypes() {
  const result = await appClient.query({
    query: gql`
           query {
            data: getOfficeUserTypes {
                _id
                name,
                code,
                displayName,
                isActive,
            }
          }
        `,
    fetchPolicy: 'network-only'
  })

  const communities = result.data.data;
  return communities;
}

/**
 * fetching registerAs communityDef
 * */
export async function fetchCommunitiesHandlerReg() {
  const result = await appClient.query({
    query: gql`
           query {
            data: fetchCommunitiesFromDef {
                name,
                communityName,
                displayName,
                code,
                communityImageLink,
                aboutCommunity,
                isActive,
            }
          }
        `,
    fetchPolicy: 'network-only'
  })

  const communities = result.data.data;
  return communities;
}
