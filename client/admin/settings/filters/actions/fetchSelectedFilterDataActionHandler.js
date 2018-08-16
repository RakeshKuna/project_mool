import gql from 'graphql-tag'

import {client} from '../../../../../client/admin/core/apolloConnection'
import _ from 'lodash'

export async function fetchSelectedFilterDataActionHandler(id) {
  const result = await client.query({
    query: gql`
        query ($id: String!) {
            fetchSelectedFilterData(id: $id) {
              _id
              filterName
              filterDescription
              isActive
              moduleName
              filterFields{
                fieldName
                displayName
                fieldType
                fieldResolverName
                isDynamic
                isActive
                isCustom
                fieldList{
                  departmentId
                  subDepartmentId
                  roleId
                  listValueId
                }
              }
              }
        }

    `,
    variables: {
      id: id,
    },
    fetchPolicy: 'network-only'
  })
  const data = result.data.fetchSelectedFilterData;
  let resultData = _.omit(data,'__typename');


  let fieldsArray = [];

  fieldsArray=_.map(resultData.filterFields, function (row) {
                      return _.omit(row, ['__typename'])

                    });



  resultData["filterFields"] = fieldsArray
  return resultData
}
