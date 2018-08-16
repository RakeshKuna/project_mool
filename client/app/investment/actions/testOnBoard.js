/**
 * Created by pankaj on 18/6/17.
 */
import gql from "graphql-tag";
import {appClient} from "../../core/appConnection";

export async function createOnBoardActionHandler(onBoard) {
  const result = await appClient.mutate({
    mutation: gql`
      mutation($onBoard:onBoard){
        createOnBoard(onBoard:$onBoard){
          success
          result
        }
      }
    `,
    variables: {
      onBoard: onBoard
    },
    fetchPolicy: 'network-only'
  })
  const id = result.data.createOnBoard;
  return id
}
