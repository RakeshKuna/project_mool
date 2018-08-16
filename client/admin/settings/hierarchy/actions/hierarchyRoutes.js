

const hierarchyRoutes={
  chapterListRoute:(clusterId)=>{
    return `/admin/settings/hierarchy/clusterhierarchy/${clusterId}/chapters`;
  },
  hierarchyDetails:(clusterId,subChapterId,isDefaultSubChapter)=>{
    return `/admin/settings/hierarchy/clusterhierarchy/${clusterId}/${subChapterId}/${isDefaultSubChapter}/hierarchyDetails`;
  },
}

export default hierarchyRoutes;
