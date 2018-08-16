import {adminSection} from "../admin/adminRoutes";
import React from 'react';
import { render } from 'react-dom';
import {mount} from 'react-mounter';
import AdminLayout from '../../admin/layouts/AdminLayout'
import MlClusterChapterList from '../../admin/cluster/components/MlClusterChapterList'
import MlClusterDetails from '../../admin/cluster/components/MlClusterDetails'
import MlChapterList from '../../admin/dashboard/component/MlChapterList'
import MlAssignBackendUsers from '../../admin/cluster/components/MlAssignBackendUsers'
import {mlClusterChapterListConfig} from '../../admin/cluster/config/mlClusterChapterConfig'
import {mlClusterCommunityListConfig, mlClusterChapterCommunityListConfig} from '../../admin/cluster/config/mlClusterCommunityConfig'
import {mlClusterSubChaptersListConfig} from '../../admin/cluster/config/mlClusterSubChaptersConfig'
import {mlClusterListConfig,mlClusterMapConfig} from '../../admin/cluster/config/mlClusterConfig'
import MlSubChapterDetails from "../../admin/subChapter/components/MlSubChapterDetails"
import MlAddSubChapter from "../../admin/subChapter/components/MlAddSubChapter"
import MlAssignChapterBackendUsers from '../../admin/chapter/components/MlAssignChapterBackendUsers'
import MlViews from '../../admin/core/components/MlViews';
import MlAdminHeader from '../../admin/layouts/header/MlAdminHeader';
import MlClusterCommunityDetails from '../../admin/cluster/components/MlClusterCommunityDetails'
import MlAuditHistory from '../../admin/auditHistory/components/MlHistoryList'
import MlAnchorTabsContainer from "../../admin/subChapter/components/anchor/MlAnchorTabsContainer"

adminSection.route('/clusters', {
  name: 'cluster',
  action(){
    // To Show map, make showInfinity={true} and remove 'viewMode' parameter from the line.
    mount(AdminLayout,{adminContent:<MlViews viewMode={false} showInfinity={false} mapConfig={mlClusterMapConfig} listConfig={mlClusterListConfig} />})
  }
});

adminSection.route('/clusters/:clusterId/clusterDetails', {
  name: 'cluster_clusterDetails',
  action(params){
    mount(AdminLayout,{headerContent:<MlAdminHeader breadcrum={{type:'hierarchy','showBreadCrum':true,'module':'cluster'}} />,adminContent:< MlClusterDetails params={params.clusterId}/>})
  }
});

adminSection.route('/clusters/:clusterId/chapters', {
  name: 'cluster_chapters',
  action(params){
    mount(AdminLayout,{headerContent:<MlAdminHeader breadcrum={{type:'hierarchy','showBreadCrum':true,'module':'cluster'}} />,adminContent:< MlViews viewMode={false} showInfinity={false} params={params} listConfig={mlClusterChapterListConfig}/>})
  }
});

adminSection.route('/clusters/:clusterId/communities', {
  name: 'cluster_communities',
  action(params){
    mount(AdminLayout,{headerContent:<MlAdminHeader breadcrum={{type:'hierarchy','showBreadCrum':true,'module':'cluster'}} />,adminContent:< MlViews viewMode={false} showInfinity={false} params={params} listConfig={mlClusterCommunityListConfig}/>})
    // mount(AdminLayout,{adminContent:< MlViews viewMode={false} showInfinity={false} params={params} listConfig={mlClusterCommunityListConfig}/>})
  }
});
/*adminSection.route('/clusters/:clusterId/history', {
  name: 'cluster_history',
  action(params){
    mount(AdminLayout,{headerContent:<MlAdminHeader breadcrum={{type:'hierarchy','showBreadCrum':true,'module':'cluster'}} />,adminContent:< MlViews viewMode={false} showInfinity={false} params={params} listConfig={mlClusterHistoryConfig}/>})
    // mount(AdminLayout,{adminContent:< MlViews viewMode={false} showInfinity={false} params={params} listConfig={mlClusterCommunityListConfig}/>})
  }
});*/
adminSection.route('/clusters/:clusterId/communities/:communityId', {
  name: 'cluster_communities_communityDetails',
    action(params){
      mount(AdminLayout,{headerContent:<MlAdminHeader breadcrum={{type:'hierarchy','showBreadCrum':true,'module':'cluster'}} />,adminContent:< MlClusterCommunityDetails params={params}/>})
    }
});
adminSection.route('/clusters/:clusterId/communities/:communityId/assignusers', {
  name: 'cluster_communities_assignusers',
  action(params){
    mount(AdminLayout,{headerContent:<MlAdminHeader breadcrum={{type:'hierarchy','showBreadCrum':true,'module':'cluster'}} />,adminContent:< MlAssignBackendUsers params={params}/>})
  }
});

adminSection.route('/clusters/:clusterId/:chapterId/:subChapterId/communities', {
  name: 'cluster_communities',
  action(params){
    mount(AdminLayout,{headerContent:<MlAdminHeader breadcrum={{type:'hierarchy','showBreadCrum':true,'module':'cluster'}} />,adminContent:< MlViews viewMode={false} showInfinity={false} params={params} />})
  }
});
adminSection.route('/clusters/:clusterId/:chapterId/subChapters', {
  name: 'cluster_chapters',
  action(params){
    mount(AdminLayout,{headerContent:<MlAdminHeader breadcrum={{type:'hierarchy','showBreadCrum':true,'module':'cluster'}} />,adminContent:< MlViews viewMode={false} showInfinity={false} params={params} listConfig={mlClusterSubChaptersListConfig}/>})
  }
});
adminSection.route('/clusters/:clusterId/:chapterId/:subChapterId/:subChapterName/subChapterDetails', {
  name: 'cluster_chapter_subChapterDetails',
  action(params){
    mount(AdminLayout,{headerContent:<MlAdminHeader breadcrum={{type:'hierarchy','showBreadCrum':true,'module':'cluster'}} />, adminContent:< MlSubChapterDetails params={params.subChapterId} clusterId={params.clusterId} chapterId={params.chapterId} subChapterName={params.subChapterName}/>})
  }
});

adminSection.route('/clusters/:clusterId/:chapterId/:subChapterId/:subChapterName/anchorDetails', {
  name: 'cluster_chapter_anchorDetails',
  action(params){
    mount(AdminLayout, {
      headerContent: <MlAdminHeader breadcrum={{type: 'hierarchy', 'showBreadCrum': true, 'module': 'chapter'}}/>,
      adminContent: <MlAnchorTabsContainer subChapterId={params.subChapterId} clusterId={params.clusterId}
                                           chapterId={params.chapterId}/>
    })
  }
});

adminSection.route('/clusters/:clusterId/:chapterId/createSubChapter', {
  name: 'cluster_chapter_AddSubChapter',
  action(params){
    mount(AdminLayout,{headerContent:<MlAdminHeader breadcrum={{type:'hierarchy','showBreadCrum':true,'module':'chapter'}} />,adminContent:<MlAddSubChapter clusterId={params.clusterId} chapterId={params.chapterId} />})
  }
});

adminSection.route('/clusters/:clusterId/:chapterId/:subChapterId/:subChapterName/assignusers', {
  name: 'cluster_chapter_assignusers',
  action(params){
    mount(AdminLayout,{headerContent:<MlAdminHeader breadcrum={{type:'hierarchy','showBreadCrum':true,'module':'cluster'}} />,adminContent:< MlAssignChapterBackendUsers params={params}/>})
  }
});
adminSection.route('/clusters/:clusterId/:chapterId/:subChapterId/:subChapterName/communities', {
  name: 'cluster_chapter_communities',
  action(params){
    mount(AdminLayout,{headerContent:<MlAdminHeader breadcrum={{type:'hierarchy','showBreadCrum':true,'module':'cluster'}} />,adminContent:<MlViews viewMode={false} showInfinity={false} params={params} listConfig={mlClusterChapterCommunityListConfig}/>})
  }
});
adminSection.route('/clusters/:clusterId/:chapterId/:subChapterId/communities/:communityId', {
  name: 'cluster_chapter_communities_communityDetails',
  action(params){
    mount(AdminLayout,{headerContent:<MlAdminHeader breadcrum={{type:'hierarchy','showBreadCrum':true,'module':'chapter'}} />,adminContent:< MlClusterCommunityDetails params={params}/>})
  }
});
adminSection.route('/clusters/:clusterId/:chapterId/:subChapterId/communities/:communityId/assignusers', {
  name: 'cluster_chapter_communities_assignusers',
  action(params){
    mount(AdminLayout,{headerContent:<MlAdminHeader breadcrum={{type:'hierarchy','showBreadCrum':true,'module':'chapter'}} />,adminContent:< MlAssignBackendUsers params={params}/>})
  }
});

adminSection.route('/clusters/:clusterId/assignusers', {
  name: 'cluster_assignusers',
  action(params){
    mount(AdminLayout,{headerContent:<MlAdminHeader breadcrum={{type:'hierarchy','showBreadCrum':true,'module':'cluster'}} />,adminContent:< MlAssignBackendUsers params={params}/>})
  }
});

adminSection.route('/clusters/:clusterId/history', {
  name: 'cluster_history',
  action(params){
    mount(AdminLayout,{headerContent:<MlAdminHeader breadcrum={{type:'hierarchy','showBreadCrum':true,'module':'cluster'}} />,adminContent:< MlAuditHistory params={params}/>})
  }
});
