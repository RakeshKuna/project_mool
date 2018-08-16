import React from "react";
import {render} from "react-dom";
import {mount} from "react-mounter";
import AppLayout from "../../app/layouts/appLayout";
import MlAppIdeatorTabs from "../../app/portfolio/ideators/components/MlAppIdeatorTabs";
import MlAppCommunitiesList from "../../../client/app/commons/components/MlAppCommunitiesList";
import MlAdminProfileHeader from "../../admin/layouts/header/MlAdminProfileHeader";
import MlPortfolioLanding from "../../app/portfolio/commons/components/MlPortfolioLanding";
import MlAppIdeatorAddIdea from "../../app/portfolio/ideators/components/MlAppIdeatorAddIdea";
import MlAppPortfolio from "../../app/portfolio/commons/components/MlAppPortfolio";
import Library from '../../commons/components/portfolioLibrary/libraryRoute'
import MlAppMyProfile from "../../app/profile/components/MlAppMyProfile";
import MlProfileSettings from "../../app/profile/components/MlProfileSettings";
import MlAppProfileAddressBook from "../../app/profile/components/MlAppProfileAddressBook";
import MlAppSwitchProfile from "../../app/profile/components/MlAppSwitchProfile";
import MyList from "../../app/profile/components/myList/MyList";
import MlAppMyOffice from "../../../client/app/profile/office/components/MlAppMyOffice";
import MlAppAddOffice from "../../app/profile/office/components/MlAppAddOffice";
import MlAppEditOffice from "../../app/profile/office/components/MlAppEditOffice";
import MlAppTermsAndConditions from "../../app/profile/components/MlAppTermsAndConditions";
import MlAppPrivacy from "../../app/profile/components/MlAppPrivacy";
import MlAppMember from "../../app/profile/office/components/OfficeMemberInfo/MlAppMember";
import MlAppOfficeMembersDetails from "../../app/profile/office/components/MlAppOfficeMembersDetails";
import MlAppPayOfficeSubscription from "../../app/profile/office/components/MlAppPayOfficeSubscription";
import MlAppInvestment from "../../app/investment/components/MlAppInvestment";
import MlAppMyTransaction from "../../app/myTransaction/component/MlAppMyTransaction";
import {appClient} from '../../app/core/appConnection'
import MlViews from '../../app/commons/view/MlAppViews'
import {mlAppClusterDashboardListConfig, mlAppClusterDashboardMapConfig} from '../../app/dashboard/config/mlAppClusterDashboardConfig'
import {mlAppChapterDashboardListConfig, mlAppChapterDashboardMapConfig} from '../../app/dashboard/config/mlAppChapterDashboardConfig'
import {mlAppSubChapterDashboardListConfig, mlAppSubChapterDashboardMapConfig} from '../../app/dashboard/config/mlAppSubChapterDashboardConfig';
import {mlAppSubChapterCommunityDashboardMapConfig} from '../../app/dashboard/config/mlAppSubChapterCommunityDashboardConfig';
import {mlAppClusterCommunityDashboardMapConfig} from '../../app/dashboard/config/mlAppClusterCommunityDashboardConfig';
import {mlAppChapterCommunityDashboardMapConfig} from '../../app/dashboard/config/mlAppChapterCommunityDashboardConfig';
import {mlDashboardListConfig, mlDashboardMapConfig} from '../../app/dashboard/config/mlAppDashboardConfig'
import {mlAppInstitutionConfig} from '../../app/portfolio/Institutions/config/mlAppInstitutionsConfig'
import {mlAppCompanyConfig} from '../../app/portfolio/Companies/config/mlAppCompaniesConfig'
import MlMicroSitePreview from '../../app/microSite/components/mlMicroSitePreview'

import MlAnchorInfoView from '../../admin/subChapter/components/anchor/MlAnchorInfoView'
//todo :// "MlAnchorInfoView" make this component in the commons

// import RegistrationWizard from "../../admin/transaction/requested/component/RegistrationWizard";
import MlAppRegistrationWizard from "../../../client/app/registrations/component/MlAppRegistrationWizard";
import MlAppTempRoute from "../../../client/app/registrations/component/MlAppTempRoute";
import {mlAppFunderConfig} from "../../app/portfolio/funders/config/mlAppFunderConfig";
import MLAppMyCalendar from "../../app/calendar/myCalendar/components/calendarParentComponent";
import ShareCalendar from "../../app/calendar/shareCalendar/components/shareCalendar"

/**
 * Activities Routes
 */
import MlAppActivity from "../../app/calendar/manageScheduler/activity/components/MlAppActivity";
import MlAppScheduleHead from "../../app/calendar/manageScheduler/activity/components/MlAppActivityList";
import MlAppActivityList from "../../app/calendar/manageScheduler/activity/components/MlAppActivityList";
import MlAppCreateTeam from "../../app/calendar/manageScheduler/activity/components/MlAppActivityBasicInfo";

/**
 * Tasks Routes
 */
import MlAppTaskList from "../../app/calendar/manageScheduler/task/components/MlAppTaskList";
import MlAppTaskLanding from "../../app/calendar/manageScheduler/task/components/MlAppTaskLanding";

/**
 * Services Routes
 */
import MlAppServiceList from "../../app/calendar/manageScheduler/service/components/MlAppServiceList";
import MlAppServiceManageSchedule from "../../app/calendar/manageScheduler/service/components/MlAppServiceManageSchedule";

/**
 * Internal Tasks Routes
 */
import MlAppInternalTask from "../../app/internalTask/components/MlAppInternalTask";

/**
 * Set Calendars Routes
 */
import MlAppSetCalendarSettings from '../../app/calendar/manageScheduler/setCalendar/components/MlAppSetCalendarSettings';
import MlAppOfficeCalendar from '../../app/calendar/officeCalendar/components/MlAppOfficeCalendar';
import AppMyProfileMyoffice from '../../app/calendar/notifications/components/calenderNotificationComponent';


import _ from "lodash";
import MlAppExplore from "../../app/explore/components/MlAppExplore";

import {mlAppServiceProviderConfig} from '../../app/portfolio/serviceProvider/config/mlAppServiceProviderConfig'
import  {mlAppStartupConfig} from '../../app/portfolio/startup/config/mlAppStartupConfig'
import  {mlAppIdeatorConfig} from '../../app/portfolio/ideators/config/mlAppIdeatorConfig'

/**
 * Import infinite scroll component
 */
import MlInfiniteScroll from '../../commons/core/mlInfiniteScroll/components/MlInfiniteScroll';
import {mlAppFunderConfig2} from "../../app/portfolio/funders/config/mlAppFunderConfig2";

/**
 * Import My Appointment routes
 */
import MlAppMyAppointment from '../../app/calendar/myAppointments/components/MlAppMyAppointment';
import MlAppMyTaskAppointment from '../../app/calendar/myCalendar/components/myTaskAppointments/containers/MlAppMyTaskAppointments';
import mlConversationUtils from '../../commons/conversations/utils/mlconversationUtils'

export const appSection = FlowRouter.group({
  prefix: "/app",
  name: 'app',
  triggersEnter: [function(context, redirect)
  {
      userId = Meteor.userId();
      if (!userId) {
        redirect('/login')
      }
      mlConversationUtils.init();
  }]
});

appSection.route('/', {
    triggersEnter: [function(context, redirect) {
        console.log('running /app trigger');
        localStorage.setItem('top','');
        localStorage.setItem('transaction','');
        redirect("/app/dashboard/"+ true);
    }]
})

/**if user login first time then passing content from URL*/
appSection.route('/dashboard/:isFirst', {
  name: 'dashboard',
  action(params){
    localStorage.removeItem('userType');
    mount(AppLayout,{appContent:<MlViews showInfinity={true} mapConfig={mlAppClusterDashboardMapConfig} listConfig={mlAppClusterDashboardListConfig}/>, isFirst:(params.isFirst=='true'?true:false)})
    // mount(AppLayout,{appContent:<MlAppDashboard/>, isFirst:(params.isFirst=='true'?true:false) })
  }
});

appSection.route('/dashboard', {
  name: 'dashboard',
  action(){
    localStorage.setItem('top','');
    localStorage.removeItem('userType');
    localStorage.setItem('transaction','');
    mount(AppLayout,{appContent:<MlViews showInfinity={true} mapConfig={mlAppClusterDashboardMapConfig} listConfig={mlAppClusterDashboardListConfig}/>})
    // mount(AppLayout,{appContent:<MlAppDashboard/>})
  }
});

appSection.route('/dashboard/users/communityUsers', {
  name: 'dashboard',
  action(){
    mount(AppLayout,{appContent:<MlViews showInfinity={true} mapConfig={mlAppClusterCommunityDashboardMapConfig} listConfig={mlAppClusterDashboardListConfig}/>})
    // mount(AppLayout,{appContent:<MlAppDashboard/>})
  }
});

appSection.route('/dashboard/:clusterId/chapters', {
  name: 'dashboard',
  action(params, queryParams){
    let viewMode;
    if (queryParams.viewMode == "false") {
      viewMode = false;
    } else if (queryParams.viewMode == "true") {
      viewMode = true
    }
    localStorage.removeItem('userType');
    mount(AppLayout, {
      appContent: <MlViews viewMode={viewMode} showInfinity={true} mapConfig={mlAppChapterDashboardMapConfig}
                           listConfig={mlAppChapterDashboardListConfig} params={params}/>
    })
  }
});
appSection.route('/dashboard/:clusterId/chapters/users', {
  name: 'dashboard',
  action(params, queryParams){
    let viewMode = true;
    if (queryParams.viewMode == "false") {
      viewMode = false;
    } else if (queryParams.viewMode == "true") {
      viewMode = true
    }
    mount(AppLayout, {
      appContent: <MlViews viewMode={viewMode} showInfinity={true} mapConfig={mlAppChapterCommunityDashboardMapConfig}
                           listConfig={mlAppChapterDashboardListConfig} params={params}/>

    })
  }
});
appSection.route('/dashboard/:clusterId/:chapterId/subChapters', {
  name: 'dashboard',
  action(params, queryParams){
    let viewMode;
    if (queryParams.viewMode == "false") {
      viewMode = false;
    } else if (queryParams.viewMode == "true") {
      viewMode = true
    }
    localStorage.removeItem('userType');
    mount(AppLayout, {
      appContent: <MlViews viewMode={viewMode} showInfinity={true} mapConfig={mlAppSubChapterDashboardMapConfig}
                           listConfig={mlAppSubChapterDashboardListConfig} params={params}/>
    })
  }
});
appSection.route('/dashboard/:clusterId/:chapterId/subChapters/users', {
  name: 'dashboard',
  action(params, queryParams){
    let viewMode = true;
    if (queryParams.viewMode == "false") {
      viewMode = false;
    } else if (queryParams.viewMode == "true") {
      viewMode = true
    }
    mount(AppLayout, {
      appContent: <MlViews viewMode={viewMode} showInfinity={true} mapConfig={mlAppSubChapterCommunityDashboardMapConfig}
                           listConfig={mlAppSubChapterDashboardListConfig} params={params}/>

    })
  }
});
appSection.route('/dashboard/:clusterId/:chapterId/:subChapterId/communities', {
  name: 'dashboard',
  action(params, queryParams){
    let viewMode;
    if (queryParams.viewMode == "false") {
      viewMode = false;
    } else if (queryParams.viewMode == "true") {
      viewMode = true
    }
    mount(AppLayout, {
      appContent: <MlViews viewMode={viewMode} showInfinity={true} mapConfig={mlDashboardMapConfig}
                           listConfig={mlDashboardListConfig} params={params}/>
    })
  }
});

appSection.route('/dashboard/:clusterId/:chapterId/:subChapterId/anchorInfoView', {
  name: 'dashboard',
  action(params, queryParams){
    mount(AppLayout, {
      appContent: <MlAnchorInfoView subChapterId={params.subChapterId} clusterId={params.clusterId}
                                      chapterId={params.chapterId} queryParams={queryParams}/>
    })
  }
});

appSection.route('/dashboard/:clusterId/:chapterId/:subChapterId/:communityType/:portfolioId', {
  name: 'dashboard',
  action(params, queryParams){
    mount(AppLayout, {
      appContent: <MlAppPortfolio viewMode={true} config={params.portfolioId} communityType={params.communityType}/>
    })
  }
});

appSection.route('/myProfile', {
  name: 'myProfile',
  action(){
      mount(AppLayout,{appContent:<MlAppMyProfile/>, isProfileMenu:true})
  }
});

appSection.route('/appSwitchProfile', {
  name: 'appSwitchProfile',
  action(){
    mount(AppLayout,{appContent:<MlAppSwitchProfile/>, isProfileMenu:true})
  }
});


appSection.route('/addressBook', {
  name: 'addressBook',
  action(){
    mount(AppLayout,{appContent:<MlAppProfileAddressBook/>, isProfileMenu:true})
  }
});

appSection.route('/myOffice', {
  name: 'myOffice',
  action(){
    mount(AppLayout, {appContent: <MlAppMyOffice />, isProfileMenu: true})
  }
});

appSection.route('/library', {
  name: 'library',
  action(){
    mount(AppLayout, {appContent: <Library client={appClient} />, isProfileMenu: true})
  }
});

appSection.route('/myInvestments', {
  name: 'myInvestments',
  action(){
    mount(AppLayout, {appContent: <MlAppMyOffice />, isProfileMenu: true})
  }
});

appSection.route('/addOffice', {
  name: 'addOffice',
  action(){
    mount(AppLayout, {appContent: <MlAppAddOffice />, isProfileMenu: true})
  }
});

appSection.route('/officeMembersDetails/:officeId', {
  name: 'addOffice',
  action(params){
    mount(AppLayout, {appContent: <MlAppOfficeMembersDetails config={params.officeId}/>, isProfileMenu: true})
  }
});

appSection.route('/payOfficeSubscription/:officeId', {
  name: 'payOfficeSubscription',
  action(params){
    mount(AppLayout, {appContent: <MlAppPayOfficeSubscription config={params.officeId}/>, isProfileMenu: true})
  }
});

appSection.route('/editOffice/:officeId', {
  name: 'addOffice',
  action(params){
    mount(AppLayout, {appContent: <MlAppEditOffice config={params.officeId} />, isProfileMenu: true})
  }
});

appSection.route('/officeMember/:officeId/:memberId', {
  name: 'addOffice',
  action(){
    mount(AppLayout, {appContent: <MlAppMember />, isProfileMenu: true})
  }
});

appSection.route('/myConnections', {
  name: 'myConnections',
  action(){
    mount(AppLayout, {appContent: <MyList />, isProfileMenu: true})
  }
});

appSection.route('/investments', {
  name: 'myInvestments',
  action(){
    mount(AppLayout, {appContent: <MlAppInvestment />, isProfileMenu: false})
  }
});

appSection.route('/portfolio', {
  name: 'portfolio',
  action(){
    mount(AppLayout,{appContent:<MlPortfolioLanding/>, isProfileMenu:true})
  }
});

appSection.route('/transaction', {
  name: 'myTransaction',
  action(){
    mount(AppLayout, {appContent: <MlAppMyTransaction />, isProfileMenu: false})
  }
});

appSection.route('/settings', {
  name: 'settings',
  action(){
    mount(AppLayout,{appContent:<MlProfileSettings/>, isProfileMenu:true})
  }
});

appSection.route('/myProfile/registerAs', {
    name: 'registeras',
    action(){
        mount(AppLayout,{headerContent:<MlAdminProfileHeader />,appContent:< MlAppCommunitiesList/>})
    }
})

// Ideators
appSection.route('/ideator', {
  name: 'ideator',
  action() {
    var listConfig = _.extend(mlAppIdeatorConfig, {isExplore: false});
    mount(AppLayout, {
        appContent:
          (<div className="app_main_wrap">
            <MlInfiniteScroll viewMode={false} showInfinity={false} config={listConfig}/>
          </div>)
      }
    )
  }
});
appSection.route('/portfolio/view/:portfolioId/:communityType', {
  name: 'portfolio',
  action(params){
    mount(AppLayout,{appContent:< MlAppPortfolio viewMode={true} config={params.portfolioId} communityType={params.communityType}/>, isProfileMenu:true})
  }
});
appSection.route('/portfolio/edit/:portfolioId/:communityType', {
  name: 'portfolio',
  action(params){
    mount(AppLayout,{appContent:< MlAppPortfolio viewMode={false} config={params.portfolioId} communityType={params.communityType}/>, isProfileMenu:true})
  }
});
appSection.route('/portfolio/addIdea', {
  name: 'portfolio',
  action(){
    mount(AppLayout,{appContent:< MlAppIdeatorAddIdea/>, isProfileMenu:true})
  }
});

appSection.route('/ideator/:portfolioId', {
  name: 'ideator',
  action(params){
    mount(AppLayout,{appContent:< MlAppPortfolio viewMode={true} config={params.portfolioId} communityType={"ideator"}/>})
  }
});

appSection.route('/ideator/editPortfolio/', {
  appSection: 'ideator_portfolio_edit',
  action(params){
    mount(AppLayout,{appContent:<MlAppIdeatorTabs viewMode={false}/>})
  }
});

/**
 * startup tabs
 * */
appSection.route('/startup', {
  name: 'startup',
  action(){
    // mount(AppLayout, {appContent: <MlViews viewMode={false} showInfinity={false} listConfig={listConfig}/>})
    var listConfig = _.extend(mlAppStartupConfig, {isExplore: false});
    mount(AppLayout,{appContent:
      (<div className="app_main_wrap">
        <MlInfiniteScroll viewMode={false} showInfinity={false} config={listConfig} />
      </div>)

    })
    /**infinite scroll component*/
  }
});
appSection.route('/startup/:portfolioId', {
  name: 'startup',
  action(params){
    // mount(AppLayout,{appContent:< MlAppStartupTabs config={params.id}/>})
    mount(AppLayout,{appContent:< MlAppPortfolio viewMode={true} config={params.portfolioId} communityType={"startup"}/>})
  }
});

appSection.route('/serviceProvider', {
  name: 'provider',
  action(){
    var listConfig = _.extend(mlAppServiceProviderConfig, {isExplore: false});
    mount(AppLayout,{appContent:
      (<div className="app_main_wrap">
        <MlInfiniteScroll viewMode={false} showInfinity={false} config={listConfig} />
      </div>)
      })
    // mount(AppLayout,{appContent:<MlViews viewMode={false} showInfinity={false} listConfig={listConfig} />})
    /**using infinite scroll*/
  }
});

appSection.route('/serviceProvider/:portfolioId', {
  name: 'provider',
  action(params){
    mount(AppLayout,{appContent:< MlAppPortfolio viewMode={true} config={params.portfolioId} communityType={"serviceProvider"}/>, isProfileMenu:false})
  }
});

/********************************************************start of routes for the institution*************************/
appSection.route('/explore/institution', {
  name: 'explore',
  action(){
    var listConfig = _.extend(mlAppInstitutionConfig, {isExplore: true});
    mount(AppLayout,{appContent:
      (<div className="app_main_wrap">
        <MlInfiniteScroll viewMode={false} showInfinity={false} config={listConfig} />
      </div>)
          })
  }
});

appSection.route('/explore/institution/:portfolioId', {
  name: 'explore',
  action(params){
    mount(AppLayout,{appContent:< MlAppPortfolio viewMode={true} config={params.portfolioId} communityType={"institution"}/>})
  }
  /**there is no need to send community type other than ideator*/
});

appSection.route('/institution', {
  name: 'institutions',
  action(){
    var listConfig = _.extend(mlAppInstitutionConfig, {isExplore: false});
    mount(AppLayout,{appContent:
      (<div className="app_main_wrap">
        <MlInfiniteScroll viewMode={false} showInfinity={false} config={listConfig} />
      </div>)
    })
  }
});

appSection.route('/institution/:portfolioId', {
  name: 'institutions',
  action(params){
    mount(AppLayout,{appContent:< MlAppPortfolio viewMode={true} config={params.portfolioId} communityType={"institution"}/>, isProfileMenu:false})
  }
});
/************************************************end of instituion routes**********************************************/

/********************************************************start of routes for the companies *************************/
appSection.route('/explore/company', {
  name: 'explore',
  action(){
    var listConfig = _.extend(mlAppCompanyConfig, {isExplore: true});
    mount(AppLayout,{appContent:
      (<div className="app_main_wrap">
        <MlInfiniteScroll viewMode={false} showInfinity={false} config={listConfig} />
      </div> )
    })
  }
});

appSection.route('/explore/company/:portfolioId', {
  name: 'explore',
  action(params){
    mount(AppLayout,{appContent:< MlAppPortfolio viewMode={true} config={params.portfolioId} communityType={"company"}/>})
  }
  /**there is no need to send community type other than ideator*/
});

appSection.route('/company', {
  name: 'company',
  action(){
    var listConfig = _.extend(mlAppCompanyConfig, {isExplore: false});
    mount(AppLayout,{appContent:
      (<div className="app_main_wrap">
        <MlInfiniteScroll viewMode={false} showInfinity={false} config={listConfig} />
      </div>)
      })
  }
});

appSection.route('/company/:portfolioId', {
  name: 'company',
  action(params){
    mount(AppLayout,{appContent:< MlAppPortfolio viewMode={true} config={params.portfolioId} communityType={"institution"}/>, isProfileMenu:false})
  }
});
/************************************************end of companies routes**********************************************/
appSection.route('/register/:id', {
  name: 'registeras',
  action(params){
    mount(AppLayout,{appContent:<MlAppRegistrationWizard config={params.id}/>}) /*making seperate registration wizard for app and admin*/
  }
});

/**
 * temporary route for registration*/

appSection.route('/register/', {
  name: 'registeras',
  action(params){
    mount(AppLayout,{appContent:< MlAppTempRoute/>})
  }
});

// Funders
appSection.route('/funder', {
  name: 'funder',
  action(){
    var config = _.extend(mlAppFunderConfig2, {isExplore: false});
    mount(AppLayout,{appContent:
      (<div className="app_main_wrap">
        <MlInfiniteScroll viewMode={false} showInfinity={false} config={config} />
      </div>)
    })
    // var listConfig = _.extend(mlAppFunderConfig, {isExplore: false});
    // mount(AppLayout,{appContent:<MlViews viewMode={false} showInfinity={false} listConfig={listConfig} />})
  }
});

appSection.route('/funder/:portfolioId', {
  name: 'funder',
  action(params){
    mount(AppLayout,{appContent:< MlAppPortfolio viewMode={true} config={params.portfolioId} communityType={"funder"}/>, isProfileMenu:false})
  }
});

//Calendar
appSection.route('/calendar', {
  name: 'mycalendar',
  action(){
    mount(AppLayout, {appContent: <MLAppMyCalendar />, isCalenderMenu: true})
  }
});

appSection.route('/calendar/shareCalendar', {
  name: 'calendar_share',
  action(){
    mount(AppLayout,{appContent: <ShareCalendar />, isCalenderMenu: true})
    // mount(AppLayout,{appContent:<MlAppDashboard/>})
  }
});

appSection.route('/calendar/officeCalendar', {
  name: 'calendar_office',
  action(){
    mount(AppLayout, {appContent: <MlAppOfficeCalendar />, isCalenderMenu: true})
  }
});

appSection.route('/calendar/notification', {
  name: 'calendar_notification',
  action(){
    mount(AppLayout, {appContent: <AppMyProfileMyoffice />, isCalenderMenu: true})
  }
});

// appSection.route('/calendar/manageSchedule', {
  // name: 'calendar_manageSchedule',
  // action(){
    // FlowRouter.go("/app/calendar/manageSchedule/all/activityList");
    //mount(AppLayout, {appContent: <MlAppScheduleHead />, isCalenderMenu: true})
  // }
// });

appSection.route('/calendar/manageSchedule/:profileId/createTask', {
  name: 'calendar_manageSchedule',
  action(params){
    mount(AppLayout, {appContent: <MlAppTaskLanding profileId={params.profileId} editMode={false}/>, isCalenderMenu: true})
  }
});

appSection.route('/calendar/manageSchedule/:profileId/activityList', {
  name: 'calendar_manageSchedule',
  action(){
    mount(AppLayout, {appContent: <MlAppActivityList />, isCalenderMenu: true})
  }
});

appSection.route('/calendar/manageSchedule/:profileId/createActivity', {
  name: 'calendar_manageSchedule',
  action(){
    mount(AppLayout, {appContent:<MlAppActivity />, isCalenderMenu: true})
  }
});


appSection.route('/calendar/manageSchedule/:profileId/createService', {
  name: 'calendar_manageSchedule',
  action(){
    mount(AppLayout, {appContent:<MlAppServiceManageSchedule viewMode={false} />, isCalenderMenu: true})
  }
});

appSection.route('/calendar/manageSchedule/:profileId/editService', {
  name: 'calendar_manageSchedule',
  action(){
    mount(AppLayout, {appContent:<MlAppServiceManageSchedule viewMode={false} />, isCalenderMenu: true})
  }
});


appSection.route('/calendar/manageSchedule/:profileId/editActivity', {
  name: 'calendar_manageSchedule',
  action(params){
    mount(AppLayout, {appContent:<MlAppActivity />, isCalenderMenu: true})
  }
});

appSection.route('/calendar/manageSchedule/:profileId/taskList', {
  name: 'calendar_manageSchedule',
  action(params){
    mount(AppLayout, {appContent: <MlAppTaskList profileId={params.profileId}/>, isCalenderMenu: true})
  }
});

appSection.route('/calendar/manageSchedule/:profileId/editTask/:taskId', {
  name: 'calendar_manageSchedule',
  action(params){
    mount(AppLayout, {appContent: <MlAppTaskLanding profileId={params.profileId} taskId={params.taskId} editMode={true}/>, isCalenderMenu: true})
  }
});

appSection.route('/task', {
  name: 'my_task',
  action(){
    mount(AppLayout, {appContent: <MlAppInternalTask />})
  }
});


appSection.route('/calendar/manageSchedule/:profileId/serviceList', {
  name: 'calendar_manageSchedule',
  action(){
    mount(AppLayout, {appContent: <MlAppServiceList />, isCalenderMenu: true})
  }
});

appSection.route('/calendar/manageSchedule/:profileId/setCalendar', {
  name: 'calendar_manageSchedule',
  action(){
    mount(AppLayout, {appContent: <MlAppSetCalendarSettings />, isCalenderMenu: true})
  }
});

/**
 * Explore menus for all communities
 * */

appSection.route('/explore', {
  name: 'explore',
  action(){
    mount(AppLayout,{appContent:< MlAppExplore />})
  }
});

appSection.route('/explore/ideator/', {
  name: 'explore',
  action(params){
    // mount(AppLayout,{appContent:< MlAppIdeatorLanding isExplore={true}/>})
    var listConfig = _.extend(mlAppIdeatorConfig, {isExplore: true});
    mount(AppLayout,{appContent:
      (<div className="app_main_wrap">
        <MlInfiniteScroll viewMode={false} showInfinity={false} config={listConfig} />
      </div>)
    })
  }
});

appSection.route('/explore/ideator/:portfolioId', {
  name: 'explore',
  action(params){
    mount(AppLayout,{appContent:< MlAppPortfolio viewMode={true} config={params.portfolioId} communityType={"ideator"}/>})
  }
});

appSection.route('/explore/investor', {
  name: 'explore',
  action(){
    // var listConfig = _.extend(mlAppFunderConfig, {isExplore: true});
    // mount(AppLayout,{appContent:<MlViews viewMode={false} showInfinity={false} listConfig={listConfig} />})
    let listConfig = _.extend(mlAppFunderConfig2, {isExplore: true});
    mount(AppLayout,{appContent:
      (<div className="app_main_wrap">
        <MlInfiniteScroll viewMode={false} showInfinity={false} config={listConfig} />
      </div>)
    })
  }
  // isExplore={true}
  /**removing explore menu from left nav*/
});

appSection.route('/explore/investor/:portfolioId', {
  name: 'explore',
  action(params){
    mount(AppLayout,{appContent:< MlAppPortfolio viewMode={true} config={params.portfolioId} communityType={"funder"}/>})
  }
  // , isExploreMenu:true
  /**removing explore menu from left nav*/
});

appSection.route('/explore/serviceProvider', {
  name: 'explore',
  action(){
    var listConfig = _.extend(mlAppServiceProviderConfig, {isExplore: true});
    mount(AppLayout,{appContent:
      (<div className="app_main_wrap">
        <MlInfiniteScroll viewMode={false} showInfinity={false} config={listConfig} />
      </div>)
    })
    // mount(AppLayout,{appContent:<MlViews viewMode={false} showInfinity={false} listConfig={listConfig} />})
    /**using infinite scroll*/
  }
});

appSection.route('/explore/serviceProvider/:portfolioId', {
  name: 'explore',
  action(params){
    mount(AppLayout,{appContent:< MlAppPortfolio viewMode={true} config={params.portfolioId} communityType={"serviceProvider"}/>})
  }
  /**there is no need to send community type other than ideator*/
});

appSection.route('/explore/startup', {
  name: 'explore',
  action(){
    var listConfig = _.extend(mlAppStartupConfig, {isExplore: true});
    mount(AppLayout,{appContent:
      (<div className="app_main_wrap">
        <MlInfiniteScroll viewMode={false} showInfinity={false} config={listConfig} />
      </div>)
    })
    // mount(AppLayout,{appContent:<MlViews viewMode={false} showInfinity={false} listConfig={listConfig} />})
    /**import of infinite scroll component*/
  }
});

appSection.route('/explore/startup/:portfolioId', {
  name: 'explore',
  action(params){
    mount(AppLayout,{appContent:< MlAppPortfolio viewMode={true} config={params.portfolioId} communityType={"startup"}/>})
  }
  /**there is no need to send community type other than ideator*/
});

appSection.route('/myAppointment', {
  name: 'myAppointment',
  action(params){
    mount(AppLayout,{appContent:< MlAppMyAppointment />, isProfileMenu: true})
  }
  /**there is no need to send community type other than ideator*/
});

appSection.route('/myTaskAppointment', {
  name: 'myTaskAppointment',
  action(params){
    mount(AppLayout,{appContent:< MlAppMyTaskAppointment />, isProfileMenu: true})
  }
  /**there is no need to send community type other than ideator*/
});

appSection.route('/termsConditions', {
  name: 'termsConditions',
  action(params){
    mount(AppLayout,{appContent:< MlAppTermsAndConditions />, isProfileMenu: true})
  }
  /**there is no need to send community type other than ideator*/
});

appSection.route('/privacy', {
  name: 'privacy',
  action(params){
    mount(AppLayout,{appContent:< MlAppPrivacy />, isProfileMenu: true})
  }
  /**there is no need to send community type other than ideator*/
});

appSection.route('/previewProfile', {
  name: 'myPublicProfile',
  action(params){
    mount(AppLayout,{appContent:< MlMicroSitePreview />, isProfileMenu: true})
  }
});
