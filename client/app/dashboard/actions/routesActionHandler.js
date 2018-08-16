
const dashboardRoutes = {
  chapterListRoute: (clusterId, v, route)=> {
    return `/app/dashboard/${clusterId}/chapters?viewMode=${v}`;
  },
  subChapterListRoute: (clusterId, chapterId, v, router) => {
    return `/app/dashboard/${clusterId}/${chapterId}/subChapters?viewMode=${v}`;
  },
  communityListRoute: (clusterId, chapterId, subChapterId, v, router)=> {
    return `/app/dashboard/${clusterId}/${chapterId}/${subChapterId}/communities?viewMode=${v}`;
  },
  subChapterAnchorRoute: (clusterId, chapterId, subChapterId, v, router)=> {
    return `/app/dashboard/${clusterId}/${chapterId}/${subChapterId}/anchorInfoView?viewMode=${v}`;
  },
  userListRoute: (clusterId, chapterId, subChapterId, portfolioId, communityType, router)=> {
    return `/app/dashboard/${clusterId}/${chapterId}/${subChapterId}/${communityType}/${portfolioId}`;
  },
}

export default dashboardRoutes;
