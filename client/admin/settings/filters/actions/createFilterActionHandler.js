import gql from 'graphql-tag'
import {client} from '../../../core/apolloConnection';

export async function updateFilterActionHandler(filterId,filterObject) {


    const result = await client.mutate({
      mutation: gql`
      mutation  ($filterId: String, $filterObject: filter, $moduleName:String, $actionName:String){
          updateFilter(
              filterId:$filterId,
              filterObject: $filterObject,
              moduleName:$moduleName,
              actionName:$actionName
            ) {
            success
            code
            result
          }
        }
      `,
      variables: {
        filterId,
        filterObject,
        moduleName: "FILTER",
        actionName: "UPDATE"
      }
    })
  const id = result.data.updateFilter;
  return id
}
