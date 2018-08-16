import gql from 'graphql-tag';
import { client } from '../../../core/apolloConnection';
import _ from 'lodash';
export default function getBreadCrumListBasedOnhierarchy(module, params, callback) {
  params = params || {};
  const requ = _.pick(params, ['clusterId', 'chapterId', 'subChapterId', 'communityId']);
  const breadCrumHierarchyPromise = client.query({
    query: gql`
    query  ($hierarchyContext:BreadCrumHierarchy){
        data:FetchBreadCrumHierarchyDetails(hierarchyContext:$hierarchyContext){
            hierarchyLevel
            hierarchyRefName
            hierarchyRefId
            moduleFieldRef
        }
      }
    `,
    variables: {
      hierarchyContext: requ,
    },
    fetchPolicy: 'network-only',
  });

  breadCrumHierarchyPromise.then((data) => {
    let result = data.data.data;
    let list = [];
    result = _.sortBy(result, ['hierarchyLevel']);

    const path = Object.assign(FlowRouter._current.path);
    let pathHierarchy = (path.split('?')[0]).split('/');

    const routePath = Object.assign(FlowRouter._current.route.path);


    if(module === 'clusterHierarchy'){
      _.forEach(result, (detail, index) => {
        list.push({
          linkId: detail.hierarchyRefId,
          linkName: detail.hierarchyRefName,
          linkUrl : '',
          seq: detail.hierarchyLevel,
        });
      });
      list = list.reverse();

      if(callback){
        return callback(list);
      }
    }

    if (path.includes('dashboard')) {
      _.forEach(result, (detail, index) => {
        list.push({
          linkId: detail.hierarchyRefId,
          linkUrl: generateLinkForDashboardUrl(path, detail.hierarchyRefId, detail.moduleFieldRef, detail.hierarchyRefName),
          linkName: detail.hierarchyRefName,
          seq: detail.hierarchyLevel,
        });
      });
    } else {
      _.forEach(result, (detail, index) => {
        list.push({
          linkId: detail.hierarchyRefId,
          linkUrl: generateLink(path, detail.hierarchyRefId, detail.moduleFieldRef, detail.hierarchyRefName),
          linkName: detail.hierarchyRefName,
          seq: detail.hierarchyLevel,
        });
      });
    }
    var dynamicLink=[];
    if(list && list.length>0){
      let tmp = list[0].linkUrl || list[1].linkUrl || pathHierarchy;
      dynamicLink = tmp.split('/');
    }

    list = list.reverse();

    if (path.includes('clusters') || path.includes('chapters')|| path.includes('communities')) {
      let name = pathHierarchy[pathHierarchy.length - 1];
      if( path.includes('communities') && name !== 'communities'){
        let index = list.length-1;
        let link='';
        let flag = 0;

        for(let i=0;i<dynamicLink.length;i++){
          if(dynamicLink[i].includes('Details')){
            link+='communities';
            flag=1;
            break;
          }
          link+=dynamicLink[i]+'/';
        }
        if(!flag){
          link = path.split('communities')[0]+'communities';
        }
        list.push({
          linkUrl:link,
          linkName: properName(nameFix('communities')),
        });
      }
      if( path.includes('communities') && name ==='assignusers'){
        list.push({
          linkUrl: path.split('/assignusers')[0],
          linkName: properName(nameFix(pathHierarchy[pathHierarchy.length - 2])),
        });
      }
      //if(name!==('clusters') && name!==('chapters')&& name!==('communities'))
      list.push({
        linkUrl: path,
        linkName: properName(nameFix(name)),
      });

      if(routePath){
        let hierarchy = routePath.split('/');
        if(hierarchy[hierarchy.length-1]===':communityId'){
          list.push({
            linkUrl: path,
            linkName: properName(nameFix('Community Details')),
          });
        }
      }
    }

    if (callback) {
      callback(list);
    }
  });
}

function generateLink(path, RefID, moduleType,name) {
  let postfix = '/';

  if (moduleType === 'subChapterId') postfix +=  name + '/'+'subChapterDetails';
  else if (moduleType === 'chapterId') postfix += 'subChapters';
  else if (moduleType === 'clusterId') postfix += 'clusterDetails';

  if (path.includes(RefID) && !(path.includes('/chapters/') && postfix === '/clusterDetails')) {
    const url = path.split(RefID)[0];
    return (url + RefID + postfix);
  } return '';
}

function generateLinkForDashboardUrl(path, RefID, moduleType, index) {
  let postfix = '/';
  let viewMode = FlowRouter.getQueryParam('viewMode') || 'true';
  if (moduleType === 'clusterId') postfix += 'chapters?viewMode='+viewMode;
  else if (moduleType === 'chapterId') postfix += 'subChapters?viewMode='+viewMode;
  else if (moduleType === 'subChapterId') postfix += 'anchorInfoView?viewMode='+viewMode;
  else if (moduleType === 'communityId') postfix += 'communities?viewMode='+viewMode;

  if (path.includes(RefID)) {
    const url = path.split(RefID)[0];
    return (url + RefID + postfix);
  } else if (path.includes('all')) {
    const url = path.split('all')[0];
    return (url + RefID + postfix);
  } return '';
}


function properName(name) {
  if (name) { return (name.charAt(0).toUpperCase() + name.slice(1)).replace(/([A-Z])/g, ' $1').trim(); }
  return name;
}

function nameFix(name) {
  if (name === 'STU') name = 'Startup';
  else if (name === 'FUN') name = 'Investor';
  else if (name === 'IDE') name = 'Ideator';
  else if (name === 'CMP') name = 'Company';
  else if (name === 'INS') name = 'Institute';
  else if (name === 'SPS') name = 'Service Provider';
  else if (name === 'assignusers') name = 'Backend Users';

  return name;
}
