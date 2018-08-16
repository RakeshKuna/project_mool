
const communityRoutes={
  communityListRoute:(id,router)=>{
    return `/admin/community/${id}/communityDetails`;
  },

  subChaptercommunityDetailsRoute:(clusterId,chapterId,subChapterId, id, router)=>{
    return `/admin/communities/${clusterId}/${chapterId}/subChapters/${subChapterId}/${id}/communityDetails`;
  },

  subChapterListRoute:(clusterId,chapterId,router) =>{
    return `/admin/communities/chapters/${clusterId}/${chapterId}/subChapters`;
  },

  subChapterCommunityListRoute:(clusterId,chapterId,subChapterId, router) =>{
    return `/admin/communities/${clusterId}/${chapterId}/subChapters/${subChapterId}/communities`;
  },
}
export default communityRoutes;
