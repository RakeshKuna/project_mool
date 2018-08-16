/**
 * Created by mohammed.mohasin on 09/03/2017.
 */

import MlResolver from '../../../commons/mlResolverDef'
import MlAdminUserContext from '../../../mlAuthorization/mlAdminUserContext'
import _ from 'lodash';

MlResolver.MlQueryResolver['FetchBreadCrumHierarchyDetails'] = (obj, args, context, info) =>{
  let details=[];
  let request=args&&args.hierarchyContext?args.hierarchyContext:{};
  /**
   Time-Line for Cluster, Chapter, Subchapter and Community Admins
   **/
  var user = new MlAdminUserContext().userProfileDetails(context.userId)||{};
  if(_.isEmpty(request) && user.hierarchyCode !="PLATFORM"){
    request.clusterId = user.defaultCluster;
  }

  if(request.clusterId&&request.clusterId.trim()!==""){
       // let cluster=MlClusters.findOne(request.clusterId);
    if(request.clusterId=="all")
      request.clusterId = mlDBController.findOne('MlChapters', request.chapterId, context).clusterId

        let cluster= mlDBController.findOne('MlClusters', request.clusterId, context)
       details.push({hierarchyLevel:3,hierarchyRefId:cluster._id,hierarchyRefName:cluster.clusterName,'moduleFieldRef':'clusterId'});
  }
  if(request.chapterId&&request.chapterId.trim()!==""){
    // let chapter=MlChapters.findOne(request.chapterId);
    let chapter= mlDBController.findOne('MlChapters', request.chapterId, context)
    details.push({hierarchyLevel:2,hierarchyRefId:chapter._id,hierarchyRefName:chapter.chapterName,'moduleFieldRef':'chapterId'});
  }
  if(request.subChapterId&&request.subChapterId.trim()!==""){
    // let subChapter=MlSubChapters.findOne(request.subChapterId);
    let subChapter= mlDBController.findOne('MlSubChapters', request.subChapterId, context)
    details.push({hierarchyLevel:1,hierarchyRefId:subChapter._id,hierarchyRefName:subChapter.subChapterName,'moduleFieldRef':'subChapterId'});
  }
  if(request.communityId&&request.communityId.trim()!==""){
    // let community=MlCommunityAccess.findOne({communityDefCode:request.communityId});
    let community= mlDBController.findOne('MlCommunityAccess', {communityDefCode:request.communityId}, context)
    details.push({hierarchyLevel:0,hierarchyRefId:community._id,hierarchyRefName:community.communityName,'moduleFieldRef':'communityId'});
  }
  return details;
}
