import React from 'react';
import { render } from 'react-dom';
import {mount} from 'react-mounter';
import {adminSection} from "../admin/adminRoutes";
import AdminLayout from '../../admin/layouts/AdminLayout'

import MlAdminHeader from '../../admin/layouts/header/MlAdminHeader';
import MlOfficePackageList from '../../admin/packages/office/component/MlOfficePackageList'
import MlAddOfficePackage from "../../admin/packages/office/component/MlAddOfficePackage";
import MlEditOfficePackage from "../../admin/packages/office/component/MlEditOfficePackage";

// adminSection.route('/packages', {
//   name: 'packages',
//   action(){
//     mount(AdminLayout,{adminContent:<div>Srinag</div>})
//   }
// });

adminSection.route('/packages/officeList', {
  name:'packages_ListOffice',
  action(params){
    mount(AdminLayout,{headerContent:<MlAdminHeader breadcrum={{type:'packages','showBreadCrum':true,'module':'office'}} />, adminContent:<MlOfficePackageList/>})
  }
});

adminSection.route('/packages/addOffice', {
  name: 'packages_AddOffice',
  action(params){
    mount(AdminLayout,{headerContent:<MlAdminHeader breadcrum={{type:'packages','showBreadCrum':true,'module':'office'}} />,adminContent:<MlAddOfficePackage/>})
  }
});

adminSection.route('/packages/editOffice/:officeId', {
  name: 'packages_EditOffice',
  action(params){
    mount(AdminLayout,{headerContent:<MlAdminHeader breadcrum={{type:'packages','showBreadCrum':true,'module':'office'}} />,adminContent:<MlEditOfficePackage config={params}/>})
  }
});
