/**
 * Created by kanwarjeet on 9/16/17.
 */

import {appClient} from '../../../app/core/appConnection'
import gql from 'graphql-tag'

export async function fetchMicroSiteUrl() {
  const result = await appClient.query({
    query: gql`
        query {
        getMySiteMapUrl {
          url
        }
      }
    `,
    fetchPolicy: 'network-only'
  })
  const id = result.data.getMySiteMapUrl;
  return id
}
