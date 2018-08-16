import gql from 'graphql-tag'
import {client} from '../../../core/apolloConnection';

export async function findCountryCode(clusterId) {
  const result = await client.query({
    query: gql`
            query($clusterId: String){  
                fetchCountryCode(clusterId:$clusterId){          
                _id          
                country      
                countryCode
                displayName   
                url        
                about       
                capital     
                isActive     
                lat        
                lng 
                phoneNumberCode
            }
        }`,
    variables: {
      clusterId: clusterId
    },
    fetchPolicy: 'network-only'
  });
  const id = result.data.fetchCountryCode;
  return id
}


export async function findCountryCodeForDisplayName(countryCode) {
  const result = await client.query({
    query: gql`
            query($countryCode: String){  
                findCountryCodeForDisplayName(countryCode:$countryCode){          
                displayName   
                phoneNumberCode
            }
        }`,
    variables: {
      countryCode: countryCode
    },
    fetchPolicy: 'network-only'
  });
  const id = result.data.findCountryCodeForDisplayName;
  return id;
}
