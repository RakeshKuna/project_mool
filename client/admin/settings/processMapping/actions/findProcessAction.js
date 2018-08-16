import gql from 'graphql-tag'
import {client} from '../../../core/apolloConnection';

export async function findProcessActionHandler(processId) {

  const result = await client.query({
    query: gql`
    query  ($id: String){
         findProcess(id:$id)  {
         _id
         processId
        process
        communities
        userTypes
        identity
        industries
        professions
        clusters
        states
        chapters
        subChapters
        isActive
         documents{
          type
          category
          isActive
        }
  }
}
    `,
    variables: {
      id:processId
    },
    fetchPolicy: 'network-only'
  })
  const id = result.data.findProcess;
  return id
}
