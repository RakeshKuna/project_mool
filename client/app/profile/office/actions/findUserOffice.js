/**
 * Created by vishwadeep on 6/6/17.
 */
import gql from "graphql-tag";
import {appClient} from "../../../../app/core/appConnection";

export async function findUserOfficeActionHandler() {
  const result = await appClient.query({
    query: gql`
          query{
              fetchOfficeSC{
                userId
                officeId
                totalusercount
                principalcount
                teamMembercount
                isRegistrationApproved
                officeName
              }  
          }
      `,
      fetchPolicy: 'network-only'
  })
  const id = result.data.fetchOfficeSC;
  return id
}

/**
 * @Note: Need to check the usage of this function
 * ifNot need to remove it
 * */
export async function findDefaultUserProfile() {
  const result = await appClient.query({
    query: gql`
          query{
              fetchOfficeSC{
                userId
                officeId
                totalusercount
                principalcount
                teamMembercount
                isRegistrationApproved
              }  
          }
      `,
    fetchPolicy: 'network-only'
  })
  const id = result.data.fetchOfficeSC;
  return id
}
