import gql from 'graphql-tag'
import {client} from '../../../core/apolloConnection';

export async function updateKycCategoryActionHandler(Details) {
  let _id=Details._id;
  let docCategoryName = Details.docCategoryName;
  let docCategoryDisplayName = Details.docCategoryDisplayName;
  let about = Details.about;
  let isActive = Details.isActive
  const result = await client.mutate({
    mutation: gql`
    mutation  ($_id:String,$docCategoryName: String, $docCategoryDisplayName: String, $about: String,$isActive: Boolean, $moduleName:String, $actionName:String){
        updateKycCategory(
          _id:$_id
          docCategoryName: $docCategoryName,
          docCategoryDisplayName: $docCategoryDisplayName,
          about: $about,
          isActive :$isActive,
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
      _id,
      docCategoryName,
      docCategoryDisplayName,
      about,
      isActive,
      moduleName:"DOCUMENTCATEGORIES",
      actionName:"UPDATE"
    }
  })
  const id = result.data.updateKycCategory;
  return id
}
