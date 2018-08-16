import gql from 'graphql-tag'
import {client} from '../../../core/apolloConnection';
import _ from 'lodash'

export async function fetchProcessSetupHandler(processTransactionId) {
  const result = await client.query({
    query: gql`
          query ($processTransactionId: String) {
            fetchProcessSetup(processTransactionId: $processTransactionId) {
              processSteps{
                stageId 
                isActive
                stageActions{
                  actionId
                  actionType
                  isActive
                }
              }
              isActive
            }
          }
      `,
    variables: {
      processTransactionId: processTransactionId
    },
    fetchPolicy: 'network-only'
  })
  var stages = result.data.fetchProcessSetup;
  var ary = [];
  _.each(stages.processSteps, function (item, say) {
    let value = _.omit(item, '__typename')
    let minAry = []
    _.each(value.stageActions, function (valueThis, key) {
      let actionRm = _.omit(valueThis, '__typename')
      minAry.push(actionRm)
    })
    value.stageActions= minAry
    ary.push(value)
  })
  var data = {processSteps:ary}
  return data
}
