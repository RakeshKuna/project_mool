import {adminSection} from "../admin/adminRoutes";
import React from 'react';
import {mount} from 'react-mounter';
import AdminLayout from '../../admin/layouts/AdminLayout'
import {mlCommunityMapConfig, mlCommunityListConfig, mlCommunityChaptersConfig, mlCommunitySubChaptersConfig, mlSubChapterCommunitiesListConfig} from '../../admin/community/config/mlCommunityConfig'
import MlViews from '../../admin/core/components/MlViews';
import MlAdminHeader from '../../admin/layouts/header/MlAdminHeader';
import MlChapterCommunityDetails from '../../admin/chapter/components/MlChapterCommunityDetails'
import MlAssignBackendUsers from '../../admin/cluster/components/MlAssignBackendUsers'
import MlCommunityTabHistoryList from '../../admin/community/communityAuditLog/components/MlCommunityTabHistoryList'

adminSection.route('/communities/', {
  name: 'communities_chapters',
  action(){
    mount(AdminLayout,{adminContent:<MlViews viewMode={false} showInfinity={false}  listConfig={mlCommunityChaptersConfig}/>})
  }
});

adminSection.route('/communities/chapters/:clusterId/:chapterId/subChapters', {
  name: 'communities_subChapters',
  action(params){
    mount(AdminLayout,{headerContent:<MlAdminHeader breadcrum={{type:'hierarchy','showBreadCrum':true,'module':'chapter'}} />,adminContent:<MlViews viewMode={false} showInfinity={false} listConfig={mlCommunitySubChaptersConfig} params={params}/>})
  }
});

adminSection.route('/communities/:clusterId/:chapterId/subChapters/:subChapterId/communities', {
  name: 'communities_communities',
  action(params){
    mount(AdminLayout,{headerContent:<MlAdminHeader breadcrum={{type:'hierarchy','showBreadCrum':true,'module':'chapter'}} />,adminContent:<MlViews viewMode={false} showInfinity={false} listConfig={mlSubChapterCommunitiesListConfig} params={params}/>})
  }
});

adminSection.route('/communities/:clusterId/:chapterId/subChapters/:subChapterId/:communityId/communityDetails', {
  name: 'communities_subChapters_communityDetails',
  action(params){
    mount(AdminLayout,{headerContent:<MlAdminHeader breadcrum={{type:'hierarchy','showBreadCrum':true,'module':'chapter'}} />,adminContent:<MlChapterCommunityDetails params={params} />})
  }
});

adminSection.route('/communities/:clusterId/:chapterId/subChapters/:subChapterId/:communityId/assignusers', {
  name: 'communities_subChapters_assignUsers',
  action(params){
    mount(AdminLayout,{headerContent:<MlAdminHeader breadcrum={{type:'hierarchy','showBreadCrum':true,'module':'chapter'}} />,adminContent:<MlAssignBackendUsers params={params} />})
  }
});

adminSection.route('/communities/:clusterId/:chapterId/subChapters/:subChapterId/:communityId/history', {
  name: 'community_subChapter_History_Details',
  action(params) {
    mount(AdminLayout, {
      headerContent: <MlAdminHeader breadcrum={{type: 'hierarchy', 'showBreadCrum': true, 'module': 'chapter'}}/>,
      adminContent: <MlCommunityTabHistoryList params={params.communityId}/>
    })
  }
});
