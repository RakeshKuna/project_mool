import gql from 'graphql-tag'

import {client} from '../../../../../client/admin/core/apolloConnection'
import _ from 'lodash'

export async function fetchFilterCatalogActionHandler(moduleName) {

  const result = await client.query({
    query: gql`
          query ($moduleName: String!) {
              findFilterCatalog(moduleName: $moduleName) {
                _id
                moduleName
                fields{
                  name
                  type
                  resolverName
                  isDynamic
                }
              }
          }
  
      `,
    variables: {
      moduleName: moduleName,
    },
    fetchPolicy: 'network-only'
  })
  const response = result.data.findFilterCatalog;

  let data = _.omit(response,'__typename');
  let fieldsObject = {}
  fieldsObject=_.map(data.fields, function (row) {return _.omit(row, ['__typename'])});

  return fieldsObject
}



