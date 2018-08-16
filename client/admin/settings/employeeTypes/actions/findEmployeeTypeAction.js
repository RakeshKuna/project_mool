import gql from 'graphql-tag'
import {client} from '../../../core/apolloConnection';

export async function findEmployeeTypeActionHandler(EmpTypeId) {

  let did=EmpTypeId
  const result = await client.query({
    query: gql`
    query  ($id: String){
        findMasterSetting(_id:$id){
         id:_id
        isActive
        employmentTypeInfo{
             employmentName
             aboutEmployment
             employmentDisplayName
        }
      }
      }
    `,
    variables: {
      id:did
    },
    fetchPolicy: 'network-only'
  });
  const masterSetting= result.data.findMasterSetting||{};
  const {employmentName,aboutEmployment,employmentDisplayName}=masterSetting.employmentTypeInfo||{};
  if(result){
    return {isActive:masterSetting.isActive,employmentName,aboutEmployment,employmentDisplayName};
  }
  return {};
}
