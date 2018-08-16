
const chapterRoutes={

  subChapterListRoute:(clusterId,chapterId,router) =>{
    return `/admin/chapters/${clusterId}/${chapterId}/subChapters`;
  },
  subChapterDetails:(clusterId,chapterId,subChapterId,subChapterName ,route)=> {
    return `/admin/chapters/${clusterId}/${chapterId}/${subChapterId}/${subChapterName}/subChapterDetails`;
  },
  createSubChapterDetails:(clusterId,chapterId ,route)=> {
    return `/admin/chapters/${clusterId}/${chapterId}/createSubChapter`;
  },
  communityDetailsRoute:(clusterId,chapterId,subChapterId,communityId,router)=>{
    return `/admin/chapters/${clusterId}/${chapterId}/${subChapterId}/communities/${communityId}`;
  }
}

export default chapterRoutes;
