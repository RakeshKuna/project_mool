
import gql from 'graphql-tag'


export async function findAdminUserDetails(userId,connection) {
  let id=userId
  var connection=connection||{};
  const result = await connection.query({
    query: gql`
        query($id: String){
            data:fetchUserDetails(userId:$id){
                alsoAssignedas,
                displayName,
                userName,
                deActive,
                genderType,
                profileImage
            }
        }
    `,
    variables: {
      id
    },
    fetchPolicy: 'network-only'
  })
  const did = result.data.data;
  return did
}
