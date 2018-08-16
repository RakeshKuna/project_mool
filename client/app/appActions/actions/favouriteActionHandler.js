/**
 * Created by mohammed.mohasin on 16/6/17.
 */
import gql from 'graphql-tag'

import {appClient} from '../../core/appConnection';

export async function favouriteActionHandler(details) {
  const result = await appClient.mutate({
    mutation: gql`
          mutation  ($resourceId: String!,$resourceType:String!,$isFavourite:Boolean){
              markFavourite(resourceId:$resourceId,resourceType:$resourceType,isFavourite:$isFavourite){
                  success,
                  code,
                  result
              }  
          }
      `,
    variables: {
      resourceId : details.resourceId,
      resourceType: details.resourceType,
      isFavourite:details.isFavourite
    }
  })
  const resp = result.data.markFavourite;
  if (resp.success) {
    toastr.success(resp.result);
    return resp;
  }else if(!resp.success){
    toastr.error(resp.result);
  }
  return null;
}

export default async function handleFavouriteAction(details){

    var resp = await favouriteActionHandler(details);
    return resp;
}



