import React, { Component, PropTypes } from 'react';
import getBreadCrumListBasedOnhierarchy from './actions/dynamicBreadCrumListHandler';
import ScrollArea from 'react-scrollbar'
import { findBackendUserActionHandler } from '../../settings/backendUsers/actions/findBackendUserAction';
import { findUserRegistrationActionHandler } from '../../users/actions/findUsersHandlers';
import { findStepTemplatesAssignmentActionHandler } from '../../templates/actions/findTemplatesAssignmentAction';

export default class VerticalBreadCrum extends Component {
  constructor(props) {
    super(props);
    this.state = { breadCrumList: [] ,
      toggle: 1,};
    this.getHierarchyDetails = this.getHierarchyDetails.bind(this);
    this.setBreadCrumHierarchyCallback.bind(this);
    return this;
  }

  renderBreadcrumb() {
    this.setState({ toggle: !this.state.toggle });
    this.getHierarchyDetails();
  }

  onLinkClicked() {
    this.props.breadcrumbClicked();
  }

  componentDidMount() {
    this._isMounted = true;

    this.context.breadCrum.subscribe(this.renderBreadcrumb.bind(this));

    let porfolioId = FlowRouter.getParam('registrationId');
    let backendUserId= FlowRouter.getParam('backendUserId');
    let processId =FlowRouter.getParam('id');
    if(porfolioId)
      this.getUserName(porfolioId,1);
    else if(backendUserId)
      this.getUserName(backendUserId,0);
    else if(processId){
      this.getProcessId(processId);
    }
    else
      this.getHierarchyDetails();
  }

  componentDidUpdate() {
    var WinHeight = $(window).height();
    $('.main_wrap_scroll').height(WinHeight-(500+$('.admin_header').outerHeight(true)));
  }

  async getProcessId(id){
    var response = await findStepTemplatesAssignmentActionHandler(id);
    if (response && response.templateProcessName && response.templateSubProcessName) {
      this.setState({process : response.templateProcessName + ' / '+response.templateSubProcessName},
        ()=>{
          this.getHierarchyDetails();
        });
    }else  this.getHierarchyDetails();
  }


  async getUserName(porfolioId,isPortfolio){
    var response = null;
    if(isPortfolio) {
      response = await findUserRegistrationActionHandler(porfolioId);
      if (response && response.registrationInfo) {
        this.setState({user:response.registrationInfo.firstName || 'User',cluster:response.registrationInfo.clusterName || 'Cluster'},
          ()=>{
            this.getHierarchyDetails();
          });
      }else  this.getHierarchyDetails();
    }
    else{
      response = await findBackendUserActionHandler(porfolioId);
      if (response && response.profile && response.profile.InternalUprofile && response.profile.InternalUprofile.moolyaProfile
        && response.profile.InternalUprofile.moolyaProfile.firstName) {
        this.setState({user:response.profile.InternalUprofile.moolyaProfile.firstName || 'Backend User'},
          ()=>{
            this.getHierarchyDetails();
          });
      }else  this.getHierarchyDetails();
    }


  }

  componentWillUnmount() {
    this._isMounted = false;

  }

  setBreadCrumHierarchyCallback(list) {
    if (this._isMounted) {
      if (list && _.isArray(list)) {
        this.setState({ breadCrumList: list });
      } else {
        this.setState({ breadCrumList: [] });
      }
    }
  }

  getHierarchyDetails() {
    const menuConfig = this.context.menu && this.context.menu.menu ? this.context.menu.menu : [];
    let breadCrum = null;
    const path = Object.assign(FlowRouter._current.path);
    if (this.props && this.props.breadcrum) {
      breadCrum = this.props.breadcrum;

      if (breadCrum.type === 'hierarchy') {
        const params = FlowRouter.current().params;
        getBreadCrumListBasedOnhierarchy( breadCrum.module, params, this.setBreadCrumHierarchyCallback.bind(this));
      } else if (breadCrum.type) {
        let module = properName(breadCrum.module);

        if (module === 'Roles') module = 'Roles & Permissions';

        if(breadCrum.type === 'documents' && breadCrum.document){
          let breadCrumObject=[];
          breadCrumObject.push({
            linkName: 'Cluster',
            linkUrl :path.split('/documents')[0]+'/documents/clusterList',
          });

          breadCrumObject.push({
            linkName: properName(FlowRouter.getParam('docid')), linkUrl: ''
          });

          this.setBreadCrumHierarchyCallback(
            breadCrumObject
          );
          return;
        }
        let breadCrumObject = [];

        if(breadCrum.type === 'transaction'&&breadCrum.module === 'portfolio' &&(breadCrum.subModule ==='edit'||breadCrum.subModule ==='view')){
          breadCrumObject = [
            { linkName: properName(breadCrum.module), linkId: breadCrum.type , linkUrl:path.split('portfolio')[0]+'portfolio/requestedPortfolioList'}
          ];

          let tab = FlowRouter.getQueryParam('tab');
          let subtab = FlowRouter.getQueryParam('subtab');

          if(!tab && FlowRouter._current.oldRoute && FlowRouter._current.oldRoute.path){
            breadCrumObject.push({
              linkName: properName((FlowRouter._current.oldRoute.path.split('portfolio/')[1]).split('PortfolioList')[0]),linkUrl :FlowRouter._current.oldRoute.path
            });
          }

          breadCrumObject.push({
            linkName:properName(breadCrum.subModule),
            linkUrl:(tab)? path.split('?')[0]:'',
          });


          if(tab){
            breadCrumObject.push({linkName:tab,
              linkUrl:(subtab)? path.split('?')[0]:''
              });
            if(subtab){
              breadCrumObject.push({linkName:subtab});
            }
          }

          this.setBreadCrumHierarchyCallback(
            breadCrumObject
          );
          return;
        }

        if(breadCrum.type === 'users' && breadCrum.module ==='clusters' && breadCrum.subModule){
          breadCrumObject = [
            { linkName: properName(this.state.cluster)||'Cluster',  linkUrl:path.split('users')[0]+'users/clusters'},
            { linkName: properName(this.state.user || 'User'),  linkUrl:path.split(breadCrum.subModule)[0]+'aboutuser'},
            { linkName: properName(fixName(breadCrum.subModule)),  linkUrl:path},
          ];

          this.setBreadCrumHierarchyCallback(
            breadCrumObject
          );
          return;
        }


        breadCrumObject = [
          { linkName: properName(breadCrum.type), linkId: breadCrum.type },
          { linkName: module, linkId: 'module' },
        ];
        if (breadCrum.subModule) {
          if(breadCrum.subModule ==='stepCode'){
            breadCrum.subModule = (FlowRouter.getParam('stepCode')).toLowerCase() || breadCrum.subModule;
          }

          breadCrumObject.push({
            linkName: breadCrum.subModuleName || properName(breadCrum.subModule),
            // linkId: 'subModule',
          });
        }

        if(breadCrum.subSubModule){
          breadCrumObject.push({
            linkName: properName(breadCrum.subSubModule)
          });
        }
        if(breadCrum.subModule !=='stepCode')
          breadCrumObject = StaticBreadCrumListHandler(breadCrumObject, breadCrum, menuConfig,this.state.process);
        else{
          let modulePath = path.split('settings')[0] + 'settings/templatesList';
          breadCrumObject[1].linkUrl = modulePath;
          breadCrumObject[2].linkUrl = path;

          breadCrumObject.slice(0,1);
        }

        if(breadCrum.dynamic){
          const params = FlowRouter.current().params;
          getBreadCrumListBasedOnhierarchy( breadCrum.subModule, params, (list)=>{

            list.map(name=>{
              breadCrumObject.push({linkName : name.linkName});
            });

            breadCrumObject[1].linkUrl = path.split( breadCrum.subModule.toLowerCase())[0] +  breadCrum.subModule.toLowerCase();
            breadCrumObject[2].linkUrl = path.split( breadCrum.subModule.toLowerCase())[0] +  breadCrum.subModule.toLowerCase() + '/' + params['clusterId'] +"/chapters";

            this.setBreadCrumHierarchyCallback(
              breadCrumObject
            );
          });
        }
        else
          this.setBreadCrumHierarchyCallback(
            breadCrumObject
          );
      }
    } else {
      const breadCrumObject = StaticBreadCrumListHandlerWithNoBredcum();
      this.setBreadCrumHierarchyCallback(
        breadCrumObject
      );
    }
  }

  render() {
    let counter = 0;
    const linksLength = this.state.breadCrumList.length;
    const list = this.state.breadCrumList.map((prop, id) => {
      ++counter;
      let lastLinkClass = '';
      const linkUrl = prop.linkUrl;
      let name = prop.linkName;
      if(name === 'Backend User Details'){
        name = this.state.user||'Backend User Details';
      }
      if (counter === linksLength) {
        lastLinkClass = 'current';
      }
      return (<li key={id} className={lastLinkClass} onClick={ this.onLinkClicked.bind(this)}><a href={linkUrl}>{name}</a></li>);
    });
    if (linksLength > 0) { list.push(<li key={'last'} className='timelineLast'></li>); }

    return (

      <div className="vTimeline">
        <ul>
          {list}
        </ul>
      </div>

    );
  }
}

function StaticBreadCrumListHandler(list, breadCrum, menu,process) {
  let currentModule = {};
  const path = Object.assign(FlowRouter._current.path);
  const module = breadCrum.subModule || breadCrum.module;
  const pathHierarchy = path.split('/');

  if (breadCrum.type) {
    if (breadCrum.type === 'templates') { list[1].linkName += ' List'; }
    if (breadCrum.type === 'transaction' && breadCrum.module === 'registrations') {
      list[1].linkUrl = `${path.split('transactions')[0]}transactions/registrationRequested`;
    }

    menu.map((object) => {
      if ((object.uniqueId).includes(breadCrum.type) || (breadCrum.type).includes(object.uniqueId)) {
        // list[0].linkUrl = object.link;
        currentModule = object;
      }
    });
    if (breadCrum.subModule) {
      currentModule.subMenu.map((object) => {
        if ((object.uniqueId).includes(breadCrum.module)&&object.uniqueId !== 'templates_History') {
          list[1].linkUrl = object.link;
        }
      });
    }

    if (breadCrum.type === 'templates' && breadCrum.subModule && breadCrum.subModule==='Edit') {
      list[list.length-1].linkName = process|| list[list.length-1].linkName;
    }


    for (const each of pathHierarchy) {
      if (each.startsWith('edit')) {
        const link = `${path.split('edit')[0] + module}List`;
        list[list.length - 1].linkUrl = link;
        if(breadCrum.transactionsRegistrations)
          list[list.length - 1].linkUrl=  path.split('transactions')[0] +'transactions/'+   breadCrum.transactionsRegistrations;

        list.push({
          linkName: 'Edit',
          linkUrl: '',
        });
      } else if (each.startsWith('add') && !each.startsWith('address')) {
        const link = `${path.split('add')[0] + module}List`;
        list[list.length - 1].linkUrl = link;
        list.push({
          linkName: 'Add',
          linkUrl: '',
        });
      } else if (each.startsWith('create')) {
        const link = `${path.split('create')[0] + module}List`;
        list[list.length - 1].linkUrl = link;
        list.push({
          linkName: 'Create',
          linkUrl: '',
        });
      }
    }
  }
  if (list[0].linkName === 'Packages' && list[1].linkName === 'Office') {   //  for name correction
    list[1].linkName = 'Office Packages';
  }

  list.splice(0, 1);                                         // removing menu level from breadcrumb
  if (!list || !list.length) return [];

  for (let i = 1; i < list.length; i++) {
    if (list[i - 1].linkName === 'Registration') {          //  for name correction
      if (list[i].linkName === 'Stage Of Company') {
        list[i].linkName = 'Company Stages';
      } else if (list[i].linkName === 'Business') {
        list[i].linkName = 'Types Of Business';
      } else if (list[i].linkName === 'Entity') {
        list[i].linkName = 'Entity Types';
      }
    }
    if (list[i].linkName === list[i - 1].linkName) {
      list.splice(i, 1);
      break;
    }
  }
  return list;
}

function StaticBreadCrumListHandlerWithNoBredcum() {
  const list = [];
  const path = Object.assign(FlowRouter._current.path);
  if (path.includes('community')) {
    const pathHierarchy = path.split('/');
    pathHierarchy.map((cname, index) => {
      if (cname && cname !== 'community' && cname !== 'admin') {
        let name = '';
        if (cname === 'STU') name = 'Startup';
        else if (cname === 'FUN') name = 'Investor';
        else if (cname === 'IDE') name = 'Ideator';
        else if (cname === 'CMP') name = 'Company';
        else if (cname === 'INS') name = 'Institute';
        else if (cname === 'SPS') name = 'Service Provider';
        if (name) {
          list.push({
            linkName: name,
            linkUrl: `${path.split(cname)[0] + cname}/communityDetails`,
          });
        } else if (cname) {
          list.push({
            linkName: properName(cname),
            linkUrl: path.split(cname)[0] + cname,
          });
        }
      }
    });
  }

  return list;
}

function properName(name) {
  if (name) { return (name.charAt(0).toUpperCase() + name.slice(1)).replace(/([A-Z])/g, ' $1').trim(); }
  return name;
}

function fixName(name) {
  if(name === 'aboutuser')
    return  'about';
  return name;
}

VerticalBreadCrum.contextTypes = {
  menu: React.PropTypes.object,
  breadCrum: PropTypes.object,
};
