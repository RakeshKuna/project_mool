import MlResolver from '../../../commons/mlResolverDef'
import MlRespPayload from '../../../commons/mlPayload'
import MlAuthorization from '../../../mlAuthorization/mlAuthorization'
import geocoder from 'geocoder'
import MlEmailNotification from '../../../mlNotifications/mlEmailNotifications/mlEMailNotification'
import {filter} from 'lodash'


MlResolver.MlMutationResolver['createCluster'] = (obj, args, context, info) => {
    let isValidAuth = mlAuthorization.validteAuthorization(context.userId, args.moduleName, args.actionName, args);
    if (!isValidAuth) {
      let code = 401;
      let response = new MlRespPayload().errorPayload("Not Authorized", code);
      return response;
    }

  let cluster = args.cluster;
    // if(MlClusters.find({countryId:cluster.countryId}).count() > 0){
    if(mlDBController.find('MlClusters', {countryId:cluster.countryId}, context).count() > 0){
        let code = 409;
        return new MlRespPayload().errorPayload("Already Exist", code);
    }else{
        geocoder.geocode(cluster.clusterName, Meteor.bindEnvironment(function ( err, data ) {
            if(err){
                return "Invalid Country Name";
            }
            cluster.latitude = data.results[0].geometry.location.lat;
            cluster.longitude = data.results[0].geometry.location.lng;
          try{
            // let id = MlClusters.insert(cluster);
            let id = mlDBController.insert('MlClusters', cluster, context)
            if(id){
                MlResolver.MlMutationResolver['createCommunityAccess'](obj, {clusterId:id, moduleName:"CLUSTER", actionName:"CREATE"}, context, info)

                let code = 200;
                let result = {clusterid: id}
                let response = JSON.stringify(new MlRespPayload().successPayload(result, code));
                return response
            }
          }catch(e){
            throw new Error("Error while creating Cluster "+e);
          }
        }),{key:Meteor.settings.private.googleApiKey});
    }
}

MlResolver.MlMutationResolver['upsertCluster'] = (obj, args, context, info) => {
  let isValidAuth = mlAuthorization.validteAuthorization(context.userId, args.moduleName, args.actionName, args);
  if (!isValidAuth) {
    let code = 401;
    let response = new MlRespPayload().errorPayload("Not Authorized", code);
    return response;
  }

  // let cluster = MlClusters.findOne({_id: args.clusterId});
  let cluster = mlDBController.findOne('MlClusters', {_id: args.clusterId}, context)
  if(cluster){
        for(key in args.cluster){
            cluster[key] = args.cluster[key]
        }
        if(cluster.isActive && cluster.showOnMap){
          if(cluster.status && cluster.status.code != 111){
            cluster.status= {
              code: 111,
              description :"Active"
            }
          }
        }else if(cluster.isActive){
        if(cluster.status && cluster.status.code != 101){
          cluster.status= {
            code: 101,
            description :"Work In Progress"
          }
        }
      }else{
        if(cluster.status && cluster.status.code != 110){
          cluster.status= {
            code: 110,
            description :"Inactive"
          }
        }
      }
        // let resp = MlClusters.update({_id:args.clusterId}, {$set:cluster}, {upsert:true})
      let resp = mlDBController.update('MlClusters', args.clusterId, cluster, {$set:true}, context)
      if(resp){
          if(cluster && cluster.isEmailNotified){
            if(args.clusterId){
              MlEmailNotification.clusterVerficationEmail(args.clusterId,context);
            }
          }
      }
      if(resp){
            let code = 200;
            let result = {cluster: resp}
            let response = new MlRespPayload().successPayload(result, code);
            return response
        }
    }
}

MlResolver.MlQueryResolver['fetchCluster'] = (obj, args, context, info) => {
  if (args.clusterId) {
    var id= args.clusterId;
    let response = mlDBController.findOne('MlClusters', {"_id":id}, context)
    return response;
  }
}

MlResolver.MlMutationResolver['updateCluster'] = (obj, args, context, info) => {
  if (args.clusterId) {
    var id = args.clusterId;
    // let updatedResponse= MlClusters.update({_id:id}, {$set: args.clusterDetails});
    let updatedResponse=  mlDBController.update('MlClusters', id, args.clusterDetails, {$set:true}, context)
    return updatedResponse
  }
}

/**
 * @Note [condition Extended]
 * for the case of non-moolya subChapters in the registerAs functionality from the app side
 * */
MlResolver.MlQueryResolver['fetchClustersForMap'] = (obj, args, context, info) => {
  let result = mlDBController.find('MlClusters', {isActive: true}, context).fetch() || [];
  if (args && args.subChapterId) {
    var subChapterDetails = mlDBController.findOne('MlSubChapters', {_id: args.subChapterId})
    if (subChapterDetails && !subChapterDetails.isDefaultSubChapter) {
      result = filter(result, {'_id': subChapterDetails.clusterId});
    }
  }
  return result;
}

MlResolver.MlQueryResolver['fetchActiveClusters'] = (obj, args, context, info) => {
  let result = [];
  // let clusterData = MlClusters.find({isActive:true}).fetch()||[];
  let clusterData = mlDBController.find('MlClusters', {isActive:true}, context).fetch()||[];
  if(clusterData.length>0){
    result = clusterData;
    result.push({"countryName" : "All", "_id" : "all"});
  }
    return result;
}

 let createcluster = (cluster) =>{
    // if(MlClusters.find({countryId:cluster.countryId}).count() > 0){
   if(mlDBController.find('MlClusters', {countryId:cluster.countryId}).count() > 0){
        let code = 409;
        return new MlRespPayload().errorPayload("Already Exist", code);
    }else{
        // let id = MlClusters.insert(cluster);
     let id= mlDBController.insert('MlClusters', cluster)
        if(id){
            let code = 200;
            let result = {clusterid: id}
            let response = JSON.stringify(new MlRespPayload().successPayload(result, code));
            return response
        }
    }
}

module.exports = createcluster
