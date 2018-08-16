
import {adminSection} from "../admin/adminRoutes";
import React from 'react';
import { render } from 'react-dom';
import {mount} from 'react-mounter';
import AdminLayout from '../../admin/layouts/AdminLayout'
import MlChaptersView from '../../admin/chapter/components/MlChapters'
import MlSubChapterView from '../../admin/chapter/components/MlSubChapterListView'
import {mlChapterMapConfig,mlChapterListConfig} from '../../admin/chapter/config/mlChapterConfig'
import {mlChapterCommunitiesConfig} from '../../admin/chapter/config/mlChapterCommunitiesConfig'
import {mlSubChapterMapConfig,mlSubChapterListConfig} from '../../admin/chapter/config/mlSubChapterConfig'
import MlSubChapterDetails from "../../admin/subChapter/components/MlSubChapterDetails"
import MlAnchorTabsContainer from "../../admin/subChapter/components/anchor/MlAnchorTabsContainer"
import MlAddSubChapter from "../../admin/subChapter/components/MlAddSubChapter"
import MlAssignChapterBackendUsers from '../../admin/chapter/components/MlAssignChapterBackendUsers'
import MlChapterCommunityDetails from '../../admin/chapter/components/MlChapterCommunityDetails'
import MlViews from '../../admin/core/components/MlViews';
import MlAdminHeader from '../../admin/layouts/header/MlAdminHeader';
import MlAssignBackendUsers from '../../admin/cluster/components/MlAssignBackendUsers'
import MlChapterTabHistoryList from '../../admin/chapter/chapterAuditLog/components/MlChapterTabHistoryList'

adminSection.route('/chapters/', {
  name: 'chapter_chapters',
  action(){
    mount(AdminLayout,{adminContent:<MlViews viewMode={false} showInfinity={false}  mapConfig={mlChapterMapConfig} listConfig={mlChapterListConfig}/>})
  }
});

adminSection.route('/chapters/:clusterId/:chapterId/subChapters', {
  name: 'chapter_subChapters',
  action(params){
    mount(AdminLayout,{headerContent:<MlAdminHeader breadcrum={{type:'hierarchy','showBreadCrum':true,'module':'chapter'}} />,adminContent:<MlViews viewMode={false} showInfinity={false} mapConfig={mlSubChapterMapConfig} listConfig={mlSubChapterListConfig} params={params}/>})
  }
});

adminSection.route('/chapters/:clusterId/:chapterId/:subChapterId/:subChapterName/subChapterDetails', {
  name: 'chapter_subChapterDetails',
  action(params){
    mount(AdminLayout,{headerContent:<MlAdminHeader breadcrum={{type:'hierarchy','showBreadCrum':true,'module':'chapter'}} />,adminContent:< MlSubChapterDetails params={params.subChapterId} clusterId={params.clusterId} chapterId={params.chapterId} subChapterName={params.subChapterName}/>})
  }
});

adminSection.route('/chapters/:clusterId/:chapterId/:subChapterId/:subChapterName/anchorDetails', {
  name: 'chapter_anchorDetails',
  action(params){
    mount(AdminLayout, {
      headerContent: <MlAdminHeader breadcrum={{type: 'hierarchy', 'showBreadCrum': true, 'module': 'chapter'}}/>,
      adminContent: <MlAnchorTabsContainer subChapterId={params.subChapterId} clusterId={params.clusterId}
                                           chapterId={params.chapterId}/>
    })
  }
});

adminSection.route('/chapters/:clusterId/:chapterId/createSubChapter', {
  name: 'chapter_AddSubChapter',
  action(params){
    mount(AdminLayout,{headerContent:<MlAdminHeader breadcrum={{type:'hierarchy','showBreadCrum':true,'module':'chapter'}} />,adminContent:<MlAddSubChapter clusterId={params.clusterId} chapterId={params.chapterId} />})
  }
});

adminSection.route('/chapters/:clusterId/:chapterId/:subChapterId/:subChapterName/communities', {
  name: 'chapter_communities',
  action(params){
    mount(AdminLayout,{headerContent:<MlAdminHeader breadcrum={{type:'hierarchy','showBreadCrum':true,'module':'chapter'}} />,adminContent:<MlViews viewMode={false} showInfinity={false} params={params} listConfig={mlChapterCommunitiesConfig}/>})
  }
});

adminSection.route('/chapters/:clusterId/:chapterId/:subChapterId/:subChapterName/assignusers', {
  name: 'chapter_assignusers',
  action(params){
    mount(AdminLayout,{headerContent:<MlAdminHeader breadcrum={{type:'hierarchy','showBreadCrum':true,'module':'chapter'}} />,adminContent:< MlAssignChapterBackendUsers params={params}/>})
  }
});
adminSection.route('/chapters/:clusterId/:chapterId/:subChapterId/communities/:communityId', {
  name: 'chapter_communities_communityDetails',
  action(params){
    mount(AdminLayout,{headerContent:<MlAdminHeader breadcrum={{type:'hierarchy','showBreadCrum':true,'module':'chapter'}} />,adminContent:<MlChapterCommunityDetails params={params} />})
  }
});

adminSection.route('/chapters/:clusterId/:chapterId/:subChapterId/communities/:communityId/assignusers', {
  name: 'chapter_communities_assignusers',
  action(params){
    mount(AdminLayout,{headerContent:<MlAdminHeader breadcrum={{type:'hierarchy','showBreadCrum':true,'module':'chapter'}} />,adminContent:< MlAssignBackendUsers params={params}/>})
  }
});



adminSection.route('/chapters/:clusterId/:chapterId/:subChapterId/:subChapterName/history', {
  name: 'chapter_history',
  action(params){
    mount(AdminLayout,{headerContent:<MlAdminHeader breadcrum={{type:'hierarchy','showBreadCrum':true,'module':'chapter'}} />,adminContent:< MlChapterTabHistoryList params={params}/>})
  }
});
