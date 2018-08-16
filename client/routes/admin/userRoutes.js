/**
 * Created by vishwadeep on 6/7/17.
 */
/**
 * import of all the routes and libs
 * */
import {adminSection} from "../admin/adminRoutes";
import React from "react";
import {mount} from "react-mounter";
import {client} from '../../admin/core/apolloConnection';
import MlViews from "../../admin/core/components/MlViews";
import AdminLayout from "../../admin/layouts/AdminLayout";
import MlAdminHeader from "../../admin/layouts/header/MlAdminHeader";
import {mlUsersClusterListConfig} from "../../admin/users/config/mlUsersClusterConfig";
import MlUsersAbout from "../../admin/users/components/MlUsersAbout";
import MlUsersAddressBook from "../../admin/users/components/addressBook/MlUsersAddressBook";
import MlUsersPortfolioLanding from "../../admin/users/components/MlUsersPortfolioLanding";
import MlUsersConnectionsTabs from "../../admin/users/components/connections/MlUsersConnectionsTabs";
import MlUsersFavouriteTabs from "../../admin/users/components/favourites/MlUsersFavouriteTabs";
import MlUsersTransactions from "../../admin/users/components/MlUsersTransactions";
import MlUsersHistoryList from '../../admin/users/components/MlUsersTabHistoryList';
import Library from '../../commons/components/portfolioLibrary/libraryRoute'

/**
 * routes config for users modules
 * */

adminSection.route('/users/clusters', {
  name: 'users_cluster',
  action(params){
    mount(AdminLayout, {
      headerContent:<MlAdminHeader breadcrum={{type:'users','showBreadCrum':true,'module':'clusters'}} />,
      adminContent: <MlViews viewMode={false} showInfinity={false}
                             listConfig={mlUsersClusterListConfig}/>
    })
  }
});

adminSection.route('/users/:registrationId/:portfolioId/aboutuser', {
  name: 'users_about',
  action(params){
    mount(AdminLayout, {
      headerContent: <MlAdminHeader breadcrum={{type: 'users', 'showBreadCrum': true, 'module': 'clusters', 'subModule': 'aboutuser'}}/>,
      adminContent: <MlUsersAbout config={params}/>
    })
  }
})

adminSection.route('/users/:registrationId/:portfolioId/addressBook', {
  name: 'users_addressBook',
  action(params){
    mount(AdminLayout, {
      headerContent: <MlAdminHeader breadcrum={{type: 'users', 'showBreadCrum': true, 'module': 'clusters', 'subModule':'addressBook'}}/>,
      adminContent: <MlUsersAddressBook config={params}/>
    })
  }
})

adminSection.route('/users/:registrationId/:portfolioId/portfolio', {
  name: 'users_portfolio',
  action(params){
    mount(AdminLayout, {
      headerContent: <MlAdminHeader breadcrum={{type: 'users', 'showBreadCrum': true, 'module':'clusters', 'subModule': 'portfolio'}}/>,
      adminContent: <MlUsersPortfolioLanding config={params}/>
    })
  }
})

adminSection.route('/users/:registrationId/:portfolioId/connections', {
  name: 'users_connections',
  action(params){
    mount(AdminLayout, {
      headerContent: <MlAdminHeader breadcrum={{type: 'users', 'showBreadCrum': true, 'module':'clusters', 'subModule': 'connections'}}/>,
      adminContent: <MlUsersConnectionsTabs config={params}/>
    })
  }
})

adminSection.route('/users/:registrationId/:portfolioId/favourites', {
  name: 'users_favourites',
  action(params){
    mount(AdminLayout, {
      headerContent: <MlAdminHeader breadcrum={{type: 'users', 'showBreadCrum': true, 'module':'clusters', 'subModule': 'favourites'}}/>,
      adminContent: <MlUsersFavouriteTabs config={params}/>
    })
  }
});

adminSection.route('/users/:registrationId/:portfolioId/transactions', {
  name: 'users_transactions',
  action(params){
    mount(AdminLayout, {
      headerContent: <MlAdminHeader breadcrum={{type: 'users', 'showBreadCrum': true, 'module':'clusters', 'subModule': 'transactions'}}/>,
      adminContent: <MlUsersTransactions config={params}/>
    })
  }
});

adminSection.route('/users/:registrationId/:portfolioId/view/library', {
  name: 'users_library',
  action(params) {
    mount(AdminLayout, {
      headerContent: <MlAdminHeader
        breadcrum={{type: 'users', 'showBreadCrum': true, 'module': 'clusters', 'subModule': 'library'}}/>,
      adminContent: <Library isAdmin={true} client={client} portfolioDetailsId={params.portfolioId}/>
    })
  }
});

adminSection.route('/users/history', {
  name: 'users_History',
  action(){
    mount(AdminLayout,{
      headerContent: <MlAdminHeader breadcrum={{type: 'users', 'showBreadCrum': true, 'module': 'History'}}/>,
      adminContent:<MlUsersHistoryList/> })
  }
});
