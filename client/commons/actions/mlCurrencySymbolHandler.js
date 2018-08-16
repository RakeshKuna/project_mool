import gql from 'graphql-tag';


export async function fetchCurrencyTypeActionHandler (connection, userId, portfolioDetailsId, profileId) {
  const result = await connection.query({
    query: gql`
    query($userId: String, $portfolioDetailsId: String, $profileId: String){
      fetchCurrencyType(userId: $userId, portfolioDetailsId:$portfolioDetailsId, profileId:$profileId){
       countryName        
        currencyName       
        currencyCode       
        isActive           
        symbol             
        symbol_native      
        decimal_digits     
        rounding           
        name_plural        
      }
    }
    `,
    variables : {
      userId,
      portfolioDetailsId,
      profileId
    },
    fetchPolicy: 'network-only'
  });
  const activities = result.data.fetchCurrencyType;
  return activities
}
