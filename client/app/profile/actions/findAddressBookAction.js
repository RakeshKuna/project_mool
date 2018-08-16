/**
 * Created by viswadeep on 2/5/17.
 */
import gql from 'graphql-tag'
import {appClient} from '../../core/appConnection';

export async function findAddressBookActionHandler() {
  const result = await appClient.query({
    query: gql`
    query{
      findAddressBook {
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
        mobileNumbers {
          verified
          countryId
          mobileNumber
          phoneNumberCode
          numberType
        }
      }
    }
    `,
    fetchPolicy: 'network-only'
  })
  const id = result.data.findAddressBook;
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
  const result = await appClient.query({
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
              firebaseInfo{
                frequency
              }
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
          mobileNumbers{
            mobileNumber
            verified
            countryId
          }
      }
    }
    `,
    fetchPolicy: 'network-only'
  })
  const id = result.data.fetchExternalUserDetails;
  return id
}
