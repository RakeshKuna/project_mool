/**
 * Created by venkatasrinag on 21/2/17.
 */

const clusterRoutes={
  clusterDetailsRoute:(clusterId, route)=> {
    return `/admin/clusters/${clusterId}/clusterDetails`;
  },

  chapterListRoute:(clusterId)=>{
    return `/admin/clusters/${clusterId}/chapters`;
  },
  subChapterListRoute:(clusterId,chapterId,router) =>{
    return `/admin/clusters/${clusterId}/${chapterId}/subChapters`;
  },
  subChapterDetails:(clusterId,chapterId,subChapterId,subChapterName ,route)=> {
    return `/admin/clusters/${clusterId}/${chapterId}/${subChapterId}/${subChapterName}/subChapterDetails`;
  },
    createSubChapterDetails:(clusterId,chapterId ,route)=> {
    return `/admin/clusters/${clusterId}/${chapterId}/createSubChapter`;
  },
  communityListRoute:(clusterId,chapterId,subChapterId,router)=>{
    return `/admin/clusters/${clusterId}/${chapterId}/${subChapterId}/communities`;
  },
  communityDetailsRoute:(clusterId,communityId,router)=>{
    return `/admin/clusters/${clusterId}/communities/${communityId}`;
  },
  chapterCommunityDetailsRoute:(clusterId,chapterId,subChapterId,communityId,router)=>{
    return `/admin/clusters/${clusterId}/${chapterId}/${subChapterId}/communities/${communityId}`;
  }
}

export default clusterRoutes;
