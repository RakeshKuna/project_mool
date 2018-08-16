import gql from 'graphql-tag'
import {client} from '../../core/apolloConnection';

export async function createChapterActionHandler(chapterDetails) {
  let clusterId = chapterDetails.clusterName;
  let chapterName = chapterDetails.chapterName;
  let diplayName = chapterDetails.displayName;
  let about = chapterDetails.about;
  let link = chapterDetails.chapterImage;
  let state = chapterDetails.state;
  let email = chapterDetails.email;
  let showOnMap = chapterDetails.ismapShow;
  let isActive = chapterDetails.status
  const result = await client.mutate({
    mutation: gql`
    mutation createChapter ($clusterId:String,$chapterName:String,$diplayName:String,$about:String,$link:String,$state: String,$email:String,$showOnMap:Boolean,$isActive:Boolean) {
      createChapter (clusterId: $clusterId,chapterName: $chapterName,diplayName: $diplayName, about: $about,link:$link, state:$state, email: $email,showOnMap: $showOnMap,isActive: $isActive)
          
    }
    `,
    variables: {
      clusterId,
      chapterName,
      diplayName,
      about,
      link,
      state,
      email,
      showOnMap,
      isActive
    }
  })
  const id = result.data.createChapter;
  return id
}
