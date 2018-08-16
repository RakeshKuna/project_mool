/**
 * Created by Rajat
 */
import gql from 'graphql-tag'
import {client} from '../../core/apolloConnection';

export async function findAddressBookActionHandler(registrationId) {
  const result = await client.query({
    query: gql`
    query($registrationId:String){
      findExternalUserAddressBook(registrationId:$registrationId) {
        clusterId
        registrationId
        profileId
        emailInfo {
          emailId
          emailIdType
          emailIdTypeName
        }
        addressInfo {
          addressType
          addressTypeName
          name
          phoneNumber
          addressFlat
          addressLocality
          addressLandmark
          addressArea
          addressCity
          addressState
          addressStateId
          addressCountry
          addressCountryId
          addressPinCode
          isDefaultAddress
        }
        contactInfo {
          numberType
          numberTypeName
          countryCode
          contactNumber
        }
      }
    }
    `,
    variables: {
      registrationId: registrationId
    },
    fetchPolicy: 'network-only'
  })
  const id = result.data.findExternalUserAddressBook;
  return id
}


// {
//   findAddressBook{
//   success,
//     code,
//     result
// }
// }


export async function fetchUserDetails() {
  const result = await client.query({
    query: gql`
    query{
      fetchExternalUserDetails {
          _id
          username
          profile{
              isInternaluser
              isExternaluser
              isActive
              email
              profileImage
              dateOfBirth
              genderType
              firstName
              middleName
              lastName
              externalUserProfiles{
                  profileId 
                  registrationId
                  countryName
                  countryId  
                  cityName   
                  cityId     
                  mobileNumber
                  clusterId   
                  clusterName 
                  chapterId   
                  chapterName 
                  subChapterId
                  subChapterName
                  communityId  
                  communityName
                  communityType
                  isDefault    
                  isActive     
                  accountType  
                  optional     
                  displayName  
                  profileImage 
              }
              externalUserAdditionalInfo{
                  cluster           
                  registrationId     
                  profileId
                  addressInfo{
                      addressType
                      addressTypeName        
                      name           
                      phoneNumber    
                      addressFlat    
                      addressLocality
                      addressLandmark
                      addressArea    
                      addressCity    
                      addressState   
                      addressCountry 
                      addressPinCode 
                      latitude
                      longitude
                  }
              }
          }
      }
    }
    `,
    fetchPolicy: 'network-only'
  })
  const id = result.data.fetchExternalUserDetails;
  return id
}

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
