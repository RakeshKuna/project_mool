/**
 * Created by vishwadeep on 18/5/17.
 */
import gql from 'graphql-tag'
import {client} from '../../core/apolloConnection';

export async function addSubChapterActionHandler(ClusterId, ChapterId, subChapterDetails) {
  let clusterId = ClusterId
  let chapterId = ChapterId
  let subChapter = subChapterDetails;
  const result = await client.mutate({
    mutation: gql`
    mutation  ($clusterId:String, $chapterId:String, $subChapter:subChapterObject, $moduleName:String, $actionName:String){
        createSubChapter(
          clusterId:$clusterId,
          chapterId:$chapterId,
          subChapter:$subChapter,
          moduleName:$moduleName,
          actionName:$actionName
        ){
            success,
            code,
            result
        } 
      }
    `,
    variables: {
      clusterId:clusterId,
      chapterId:chapterId,
      subChapter:subChapter,
      moduleName:"SUBCHAPTER",
      actionName:"CREATE"
    }
  })
  const id = result.data.createSubChapter;
  return id
}
