/**
 * Created by pankaj on 8/6/17.
 */
import gql from "graphql-tag";
import {appClient} from "../../../../app/core/appConnection";

export async function fetchOfficeMemberById(officeId) {
  const result = await appClient.query({
    query: gql`
          query($officeId:String){
              fetchOfficeSCById(officeId:$officeId){
                 _id
                 userId
                 availableCommunities {
                    communityName
                    communityId
                 }
              }
          }
      `,
    variables: {
      officeId: officeId
    },
    fetchPolicy: 'network-only'
  });
  return result.data.fetchOfficeSCById;
}


export async function fetchOfficeById(officeId) {
  const result = await appClient.query({
    query: gql`
          query($officeId:String){
              fetchOfficeById(officeId:$officeId){
                 officeName
              }
          }
      `,
    variables: {
      officeId: officeId
    },
    fetchPolicy: 'network-only'
  });
  return result.data.fetchOfficeById;
}
