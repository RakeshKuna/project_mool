/**
 * Created by pankaj on 19/6/17.
 */
import gql from 'graphql-tag'
import {appClient} from '../../../../core/appConnection';

export async function fetchActivitiesActionHandler (profileId) {
  const result = await appClient.query({
    query: gql`
    query($profileId:String) {
      fetchActivities(profileId: $profileId) {
        displayName
        imageLink
        mode
        _id
        duration {
          hours
          minutes
        }
        teams{
      branch
      communityType
      users
    }
      }
    }
    `,
    variables: {
      profileId:profileId
    },
    fetchPolicy: 'network-only'
  });
  const activities = result.data.fetchActivities;
  return activities
}

export async function fetchCurrencyTypeActionHandler () {
  const result = await appClient.query({
    query: gql`
    query{
      fetchCurrencyType{
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
    fetchPolicy: 'network-only'
  });
  const activities = result.data.fetchCurrencyType;
  return activities
}

