import gql from 'graphql-tag'

export async function createBugReport(details, connection) {
  var connection=connection||{};
  const result = await connection.mutate({
    mutation: gql`
      mutation($details:bugDetails){
        createBugReport(details:$details) {
          success
          code
          result
        }
      }
    `,
    variables: {
      details
    }
  });
  const resultData = result.data.createBugReport;
  if(resultData&&resultData.success){
    return resultData;
  }

}
