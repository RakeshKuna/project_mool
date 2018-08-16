  import MlResolver from "../../../commons/mlResolverDef";
  import getQuery from "../genericSearch/queryConstructor";
  import MlAdminUserContext from "../../../../server/mlAuthorization/mlAdminUserContext";
  import MlUserContext from './../../../MlExternalUsers/mlUserContext';
  import MlSubChapterAccessControl from '../../../../server/mlAuthorization/mlSubChapterAccessControl'
  import _ from "underscore";
  import _lodash from "lodash";

  let mergeQueries=function(userFilter,serverFilter){
  let query=userFilter||{};
  if (_.isEmpty(query)) {
    query = serverFilter||{};
  } else {
    query = {$and: [userFilter,serverFilter]};
  }
  return query;
}

/*Fix for Issue : MOOLYA-2146*/
var setDefaultSort=function(sortObj,sortField,sortVal,moduleName){
    if(_lodash.isEmpty((sortObj||{}).sort)&&sortField){
      //default sort is for specific modules
      var allowedModules=['department','subDepartment','entity','stageOfCompany','businessType','citizenship','lookingFor','roles','REQUESTTYPE','transactionTypes','roleType','ACCOUNTTYPE','kycCategory','documentFormat','specification','industry','profession','documentType','userType','SubDomain','documentMapping','processmapping','awards','Assets','Technologies','FundingType'];
      if(!moduleName||_lodash.indexOf(allowedModules,moduleName)<0){return;};
        sortObj.sort={};
        sortObj.sort[sortField]=sortVal||-1;
    };
  }

MlResolver.MlQueryResolver['SearchQuery'] = (obj, args, context, info) =>{
    let totalRecords=0;
  const findOptions = {
              skip: args.offset,
  };
  // `limit` may be `null`
  if (args.limit > 0) {
    findOptions.limit = args.limit;
  }

  let query={};
  if (args.fieldsData){
    query = getQuery.searchFunction(args);
  }
  if(args.sortData){
    let sortObj = getQuery.sortFunction(args);
    findOptions.sort=sortObj||{};
  }
  //Fix for Issue : MOOLYA-2146
  setDefaultSort(findOptions,'createdDate',-1,args.module);

  let action="READ";

  //to resolve the type in data _resolveType for Union
  context.module=args.module;

  //Authorization layer

  if(args.module=="cluster"){
    data= MlClusters.find({},findOptions).fetch();
    totalRecords=MlClusters.find({},findOptions).count();
  }

  if(args.module=="chapter"){
    data= MlChapters.find({},findOptions).fetch();
    totalRecords=MlChapters.find({},findOptions).count();
  }
  if(args.module=="subChapter"){
    data= MlSubChapters.find({},findOptions).fetch();
    totalRecords=MlSubChapters.find({},findOptions).count();
  }

  if (args.module == "department") {
    var userProfileDep = new MlAdminUserContext().userProfileDetails(context.userId);
    var queryChange;
    if (userProfileDep.defaultSubChapters.indexOf("all") < 0) {
      userProfileDep.defaultSubChapters.push('all')
      // var serverQuery = {$and: [{isMoolya: false}, {isSystemDefined: false}, {depatmentAvailable: {$elemMatch: {subChapter: {$in: userProfileDep.defaultSubChapters}}}}]}
      var serverQuery = {depatmentAvailable: {$elemMatch: {subChapter: {$in: userProfileDep.defaultSubChapters},cluster:{$in:['all', userProfileDep.defaultCluster]}}}}
      queryChange = mergeQueries(query, serverQuery);
    }else {
      queryChange = query
    }
    data = MlDepartments.find(queryChange, findOptions).fetch() || [];
    data.map(function (doc, index) {
      let clusterIds = [];
      let chapterIdsArray = [];
      let subchapterIdsArray = [];

      var departments = doc && doc.depatmentAvailable ? doc.depatmentAvailable : [];
      departments.map(function (department) {
        let currentDepClusterIds = department && department.cluster && department.cluster ? department.cluster : [];
        clusterIds = clusterIds.concat(currentDepClusterIds);

        let chapterId = department && department.chapter && department.chapter ? department.chapter : "";
        if (chapterId != "all") {
          chapterIdsArray.push(chapterId);
        }
        let subchapterId = department && department.subChapter && department.subChapter ? department.subChapter : "";
        if (subchapterId != "all") {
          subchapterIdsArray.push(subchapterId);
        }
      });
      const clusterData = MlClusters.find({_id: {$in: clusterIds}}).fetch() || [];
      const chapterData = MlChapters.find({_id: {$in: chapterIdsArray}}).fetch() || [];
      const subchapterData = MlSubChapters.find({_id: {$in: subchapterIdsArray}}).fetch() || [];

      var clusterNames = _.pluck(clusterData, 'clusterName') || [];
      var chapterNamesArray = _.pluck(chapterData, 'chapterName') || [];
      var subchapterNamesArray = _.pluck(subchapterData, 'subChapterName') || [];

      data[index].clustersList = clusterNames || [];
      data[index].chaptersList = chapterNamesArray || [];
      data[index].subChapterList = subchapterNamesArray || [];
    });

    totalRecords = MlDepartments.find({}, findOptions).count();
  }

  if(args.module=="subDepartment"){
    var userProfileSub = new MlAdminUserContext().userProfileDetails(context.userId);
    var queryChange;
    if (userProfileSub.defaultSubChapters.indexOf("all") < 0) {
      userProfileSub.defaultSubChapters.push('all')
      // var serverQuery ={$and: [{isMoolya: false}, {isSystemDefined: false},  {subDepatmentAvailable: {$elemMatch: {subChapter: {$in:userProfileSub.defaultSubChapters}}}}]}
      var serverQuery ={subDepatmentAvailable: {$elemMatch: {subChapter: {$in:userProfileSub.defaultSubChapters},cluster:{$in:['all', userProfileSub.defaultCluster]}}}}
      queryChange = mergeQueries(query, serverQuery);
    }else {
      queryChange = query
    }
    data = MlSubDepartments.find(queryChange, findOptions).fetch();

    data.map(function (doc,index) {
      let clusterIds = [];
      let chapterIdsArray = [];
      let subchapterIdsArray = [];
      let departments=doc&&doc.subDepatmentAvailable?doc.subDepatmentAvailable:[];
      const departmentDetails =  MlDepartments.findOne({_id : doc.departmentId}).departmentName || "";
      departments.map(function (department) {
        let currentDepClusterIds = department&&department.cluster&&department.cluster?department.cluster:[];
        //let currentDepClusterIds = _.pluck(clustersIds,"clusterId") || [];
        clusterIds = clusterIds.concat(currentDepClusterIds);
        let chapterId =  department&&department.chapter&&department.chapter?department.chapter:"";
        if(chapterId != "all"){
          chapterIdsArray.push(chapterId);
        }
        let subchapterId =  department&&department.subChapter&&department.subChapter?department.subChapter:"";
        if(subchapterId != "all"){
          subchapterIdsArray.push(subchapterId);
        }
      });
      const clusterData =  MlClusters.find( { _id: { $in: clusterIds } } ).fetch() || [];
      const chapterData =  MlChapters.find( { _id: { $in: chapterIdsArray } } ).fetch() || [];
      const subchapterData =  MlSubChapters.find( { _id: { $in: subchapterIdsArray } } ).fetch() || [];

      var clusterNames = _.pluck(clusterData, 'clusterName') || [];
      var chapterNamesArray = _.pluck(chapterData, 'chapterName') || [];
      var subchapterNamesArray = _.pluck(subchapterData, 'subChapterName') || [];

      data[index].departmentAliasName = departmentDetails || "";
      data[index].clustersList = clusterNames || [];
      data[index].chaptersList = chapterNamesArray || [];
      data[index].subChapterList = subchapterNamesArray || [];

    });

    totalRecords=MlSubDepartments.find({},findOptions).count();
  }
  if(args.module=="REQUESTTYPE"){
    data= MlRequestType.find(query,findOptions).fetch();
    totalRecords=MlRequestType.find(query,findOptions).count();
  }
  if(args.module=="countries"){
    data= MlCountries.find(query,findOptions).fetch();
    totalRecords=MlCountries.find(query,findOptions).count();
  }
  if(args.module=="states"){
    let pipeline = [
      {"$match":{"isActive": true}},
      {"$lookup":{from:'mlStates',localField:'countryCode',foreignField:'countryCode',as:'states'}},
      {"$unwind":'$states'},
      {"$project":{ _id:"$states._id",
        "countryName":"$country","name":"$states.name","displayName":"$states.displayName","countryId":"$_id","countryCode":1,"isActive":"$states.isActive" }},
    ];
    if(query && Object.keys(query).length){
      pipeline.push({"$match":query});
    }
    pipeline.push(
      { $group : {
        _id: null,
        count : { $sum : 1 },
        data: {$push: '$$ROOT'}
      }}
    );
    pipeline.push(
      { '$unwind': '$data' }
    )
    pipeline.push({
      "$project":{ count:1,_id:"$data._id", "countryName":"$data.countryName","name":"$data.name","displayName":"$data.displayName","countryId":"$data.countryId","countryCode":"$data.countryCode","isActive":"$data.isActive" }
    });
    if(findOptions.sort){
      pipeline.push({"$sort": findOptions.sort});
    }
    if(findOptions.skip){
      pipeline.push({"$skip": parseInt(findOptions.skip)});
    }
    if(findOptions.limit){
      pipeline.push({"$limit": parseInt(findOptions.limit)});
    }
    data = MlCountries.aggregate(pipeline);
    totalRecords = (data.length ? data[0].count : 0);
    // let countries = MlCountries.find({"isActive": true}).fetch();
    // let allIds=_.pluck(countries,'_id');
    //   let ary = MlStates.find({$and:[{"countryId":{$in:allIds}},query]},findOptions).fetch();
    //
    //   _.each(ary,function (item,key) {
    //     _.each(countries, function (s,v) {
    //       if (item.countryId == s._id)
    //         item.countryName = s.country;
    //     })
    //   })
    //   data=ary;
    //   totalRecords = MlStates.find({$and:[{"countryId":{$in:allIds}},query]},findOptions).count();
  }

  if(args.module=="cities"){
    let countries = MlCountries.find({"isActive": true}).fetch();
    let states = MlStates.find({"isActive": true}).fetch();
    let allIds=_.pluck(states,'_id');
    let cities = MlCities.find({$and:[{"stateId":{$in:allIds}},query]},findOptions).fetch();
    _.each(cities,function (item,key) {
      _.each(states, function (s,v) {
        if (item.stateId == s._id)
          item.stateId = s.name;
      })
      _.each(countries, function (s,v) {
        if (item.countryId == s._id)
          item.countryCode = s.country;
      })
    })
    data=cities;
    totalRecords = MlCities.find({$and:[{"stateId":{$in:allIds}},query]},findOptions).count();
  }

  if(args.module=="userType"){
    data= MlUserTypes.find(query,findOptions).fetch();
    totalRecords=MlUserTypes.find(query,findOptions).count();
  }

  if(args.module=="roleType"){
    data= MlRoleTypes.find(query,findOptions).fetch();
    totalRecords=MlRoleTypes.find(query,findOptions).count();
  }

  if(args.module=="documentType"){
    data= MlDocumentTypes.find(query,findOptions).fetch();
    totalRecords=MlDocumentTypes.find(query,findOptions).count();
  }

  if(args.module=="documentFormat"){
    data= MlDocumentFormats.find(query,findOptions).fetch();
    totalRecords=MlDocumentFormats.find(query,findOptions).count();
  }
  if(args.module=="kycCategory"){
    data= MlDocumentCategories.find(query,findOptions).fetch();
    totalRecords=MlDocumentCategories.find(query,findOptions).count();
  }
  if(args.module=="documentMapping"){
    data= MlDocumentMapping.find(query,findOptions).fetch();
    data.map(function (doc,index) {
      let clusterIds =[];
      let chapterIds=[];
      let subChapterIds=[];
      let kycCategoryIds = [];
      let allowableFormatIds = [];
      doc.clusters.map(function (ids) {
        clusterIds.push(ids)
      });
      doc.chapters.map(function (ids) {
        chapterIds.push(ids)
      });
      const chapterData =  MlChapters.find( { _id: { $in: chapterIds } } ).fetch() || [];
      let chapterNames = [];  //@array of strings
      chapterData.map(function (doc) {
        chapterNames.push(doc.chapterName)
      });
      const clusterData =  MlClusters.find( { _id: { $in: clusterIds } } ).fetch() || [];
      let clusterNames = [];  //@array of strings
      clusterData.map(function (doc) {
        clusterNames.push(doc.clusterName)
      });
      doc.subChapters.map(function (ids) {
        subChapterIds.push(ids)
      });
      const subChapterData =  MlSubChapters.find( { _id: { $in: subChapterIds } } ).fetch() || [];
      let subChapterNames = [];  //@array of strings
      subChapterData.map(function (doc) {
        subChapterNames.push(doc.subChapterName)
      });

      doc.kycCategory.map(function (ids) {
        kycCategoryIds.push(ids)
      });
      const kycCategoryData =  MlDocumentCategories.find( { _id: { $in: kycCategoryIds } } ).fetch() || [];
      let kycCategoryNames = [];  //@array of strings
      kycCategoryData.map(function (doc) {
        kycCategoryNames.push(doc.docCategoryName)
      });

      doc.allowableFormat.map(function (ids) {
        allowableFormatIds.push(ids)
      });
      const allowableFormatData =  MlDocumentFormats.find( { _id: { $in: allowableFormatIds } } ).fetch() || [];
      let allowableFormatNames = [];  //@array of strings
      allowableFormatData.map(function (doc) {
        allowableFormatNames.push(doc.docFormatName)
      });

      data[index].clusters = clusterNames || [];
      data[index].chapters = chapterNames || [];
      data[index].subChapters= subChapterNames || [];
      data[index].kycCategory = kycCategoryNames || [];
      data[index].allowableFormat = allowableFormatNames || [];

    });
    totalRecords=MlDocumentMapping.find(query,findOptions).count();
  }
  if(args.module=="transactionTypes"){
    data= MlTransactionTypes.find(query,findOptions).fetch();
    totalRecords=MlTransactionTypes.find(query,findOptions).count();
  }
  if(args.module=="ACCOUNTTYPE"){
    data= MlAccountTypes.find(query,findOptions).fetch();
    totalRecords=MlAccountTypes.find(query,findOptions).count();
  }

  if(args.module == 'Users'){
    // queryChange = accessControlQuery(context.userId, context) || {}
    // console.log(queryChange)
    var queryChange = {}
    var dataContext = MlSubChapterAccessControl.getAccessControl('SEARCH', context, null)
    if (dataContext && dataContext.hasAccess && dataContext.subChapters && dataContext.subChapters.length > 0) {
      queryChange = {$and: [{'_id':{$ne: context.userId}},{'profile.isMoolya': false}, {'profile.isInternaluser': true}, {'profile.InternalUprofile.moolyaProfile.subChapter': {$in: dataContext.subChapters}}]}
    }else if (dataContext && dataContext.hasAccess){
      queryChange = {'profile.isInternaluser': true}
    }
    var queryList = mergeQueries(query, queryChange);
    data = Meteor.users.find(queryList, findOptions).fetch();

    data.map(function (doc,index) {
      var hirarichyLevel=[]
      var roleNames = []
      let userProfiles=doc&&doc.profile.InternalUprofile.moolyaProfile.userProfiles?doc.profile.InternalUprofile.moolyaProfile.userProfiles:[];
      userProfiles.map(function (doc,index) {
        if(doc.isDefault) {
          let userRoles = doc && doc.userRoles ? doc.userRoles : [];
          hirarichyLevel = _.pluck(userRoles, 'hierarchyLevel') || [];
          hirarichyLevel.sort(function (a, b) {
            return b - a
          });
          for (let i = 0; i < userRoles.length; i++) {
            if (userRoles[i].hierarchyLevel == hirarichyLevel[0]) {
              roleNames.push(userRoles[i].roleName);
              break
            }
          }
        }
      });
      data[index].roleNames = roleNames || [];
    });

    totalRecords=Meteor.users.find(queryList,findOptions).count();
  }
  if(args.module == 'roles'){
    var userProfileMenu = new MlAdminUserContext().userProfileDetails(context.userId);
    var queryChange;
    if (userProfileMenu.defaultSubChapters.indexOf("all") < 0) {
      userProfileMenu.defaultSubChapters.push('all')
      var serverQuery ={assignRoles: {$elemMatch: {cluster:{$in:['all', userProfileMenu.defaultCluster]},subChapter: {$in:userProfileMenu.defaultSubChapters}}}}
      queryChange = mergeQueries(query, serverQuery);
    }else {
      queryChange = query
    }

    data = MlRoles.find(queryChange, findOptions).fetch();
    // data= MlRoles.find(query,findOptions).fetch();
    data.map(function (doc,index) {
      let departmentsIdsArray = [];
      let subdepartmentsIdsArray = [];
      let clusterIdsArray = [];
      let chapterIdsArray = [];
      let subchapterIdsArray = [];

      let assignRolesData=doc&&doc.assignRoles?doc.assignRoles:[];
      assignRolesData.map(function (doc) {
        departmentsIdsArray.push(doc.department);
        subdepartmentsIdsArray.push(doc.subDepartment);
        clusterIdsArray.push(doc.cluster);
        chapterIdsArray.push(doc.chapter);
        subchapterIdsArray.push(doc.subChapter);
      });

      if(doc.createdBy){
        const getCreatedName = mlDBController.findOne('users',{username: doc.createdBy}).profile.firstName;
        doc.createdBy = getCreatedName ||  doc.createdBy;
      }

      if(doc.updatedBy){
        const getUpdatedName = mlDBController.findOne('users',{username: doc.updatedBy}).profile.firstName;
        doc.updatedBy = getUpdatedName ||  doc.updatedBy;
      }


      const departmentData =  MlDepartments.find({ _id: { $in: departmentsIdsArray } } ).fetch() || [];
      const subdepartmentData = MlSubDepartments.find( { _id: { $in: subdepartmentsIdsArray } } ).fetch() || [];
      const clusterData =  MlClusters.find( { _id: { $in: clusterIdsArray } } ).fetch() || [];
      const chapterData =  MlChapters.find( { _id: { $in: chapterIdsArray } } ).fetch() || [];
      const subchapterData =  MlSubChapters.find( { _id: { $in: subchapterIdsArray } } ).fetch() || [];

      let departmentNames = [];  //@array of strings
/*      departmentData.map(function (doc) {
        departmentNames.push(doc.departmentName)
      });*/
      departmentNames = _.pluck(departmentData, 'departmentName') || [];

      let subdepartmentsNames = [];  //@array of strings
      subdepartmentsNames = _.pluck(subdepartmentData, 'subDepartmentName') || [];


      let clusterNames = [];  //@array of strings
      clusterNames = _.pluck(clusterData, 'clusterName') || [];

      let chapterNamesArray = [];
      chapterNamesArray = _.pluck(chapterData, 'chapterName') || [];


      let subchapterNamesArray = [];
      subchapterNamesArray = _.pluck(subchapterData, 'subChapterName') || [];

      data[index].departmentsList = departmentNames || [];
      data[index].subdepartmentsList = subdepartmentsNames || [];
      data[index].clustersList = clusterNames || [];
      data[index].chaptersList = chapterNamesArray || [];
      data[index].subChapterList = subchapterNamesArray || [];
    });
    totalRecords = MlRoles.find(queryChange, findOptions).count();
  }

  if(args.module=="industry"){
    data= MlIndustries.find(query,findOptions).fetch();
    totalRecords=MlIndustries.find(query, findOptions).count();
  }
  if(args.module=="awards"){
    data= MlAwards.find(query,findOptions).fetch();
    totalRecords=MlAwards.find(query, findOptions).count();
  }
  if(args.module=="specification"){
    data= MlSpecifications.find(query,findOptions).fetch();
    totalRecords=MlSpecifications.find(query,findOptions).count();
  }
  if(args.module=="profession"){
    data= MlProfessions.find(query,findOptions).fetch();
    totalRecords=MlProfessions.find(query,findOptions).count();
  }
  if(args.module=="entity"){
    data= MlEntity.find(query,findOptions).fetch();
    totalRecords=MlEntity.find(query,findOptions).count();
  }
  if(args.module=="stageOfCompany"){
    data= MlStageOfCompany.find(query,findOptions).fetch();
    totalRecords=MlStageOfCompany.find(query,findOptions).count();
  }

  //todo: need to include aggreate query in this
  if (args.module == "processmapping") {
    data = MlProcessMapping.find(query, findOptions).fetch();
    data.map(function (doc, index) {

      let processTypes = MlprocessTypes.findOne({_id: doc.process}) || {}

      var communityIds = doc.communities || []
      const communityData = MlCommunityDefinition.find({code: {$in: communityIds}}).fetch() || [];
      let communityNames = _lodash.map(communityData, 'name') || []

      var industryIds = doc.industries || []
      const industryData = MlIndustries.find({_id: {$in: industryIds}}).fetch() || [];
      let industryNames = _lodash.map(industryData, 'industryName') || []

      var professionIds = doc.professions || []
      const professionData = MlProfessions.find({_id: {$in: professionIds}}).fetch() || [];
      let professionNames = _lodash.map(professionData, 'professionName') || []

      var clusterIds = doc.clusters || []
      const clusterData = MlClusters.find({_id: {$in: clusterIds}}).fetch() || [];
      let clusterNames = _lodash.map(clusterData, 'clusterName') || []

      var stateIds = doc.states
      const stateData = MlStates.find({_id: {$in: stateIds}}).fetch() || [];
      let stateNames = _lodash.map(stateData, 'name') || []

      var chapterIds = doc.chapters
      const chapterData = MlChapters.find({_id: {$in: chapterIds}}).fetch() || [];
      let chapterNames = _lodash.map(chapterData, 'chapterName') || []

      var userTypeIds = doc.userTypes
      var userTypeNamesString = ''
      if(userTypeIds.indexOf("all") < 0){
        const userTypeData = MlUserTypes.find({_id: {$in: userTypeIds}}).fetch() || [];
        userTypeNamesString = _lodash.map(userTypeData, 'userTypeName') || []
      }else {
        userTypeNamesString = 'All'
      }

      var subChaptersIds = doc.subChapters
      var subChapterNamesString = ''
      if(subChaptersIds.indexOf("all") < 0){
        const subChaptersData = MlSubChapters.find({_id: {$in: subChaptersIds}}).fetch();
        subChapterNamesString = _lodash.map(subChaptersData, 'subChapterName') || []
      }else {
        subChapterNamesString = 'All'
      }

    if(data && data.length>0) {
      data[index].communities = communityNames || [];
      data[index].professions = professionNames || [];
      data[index].industries = industryNames || [];
      data[index].clusters = clusterNames || [];
      data[index].states = stateNames || [];
      data[index].chapters = chapterNames || [];
      data[index].processName = processTypes.processName;
      data[index].userTypeNamesString = userTypeNamesString == 'All' ? 'All' : userTypeNamesString.join()
      data[index].subChapterNamesString = subChapterNamesString == 'All' ? 'All' : subChapterNamesString.join()

    }
    });
    totalRecords = MlProcessMapping.find(query, findOptions).count();
  }
  if(args.module=="documents"){

    let finalQuery={};
    if(_.isEmpty(query)){
      finalQuery= {isActive:true}
    }else {
      let filterQuery;
      filterQuery = query['$and']?query['$and']:[]
      var seen = false;
      for(var j = 0; j != filterQuery.length; ++j) {
        if(filterQuery[j].isActive){
          seen = true;
        }
      }

      if (!seen) {
        filterQuery.push({isActive:true})
      }
      finalQuery.$and = filterQuery
    }
    data = MlProcessMapping.find(finalQuery, findOptions).fetch();
    data.map(function (doc,index) {
      let industryIds=[];
      let communityIds=[];
      let clusterIds=[];
      let stateIds=[];
      let chapterIds=[];
      let subChapterIds=[];
      let professionIds=[];
      let userTypeIds=[];
      let processTypes=MlprocessTypes.findOne({_id:doc.process});
      doc.communities.map(function (ids) {
        communityIds.push(ids)
      });
      const communityData =  MlCommunityDefinition.find( { code: { $in: communityIds } } ).fetch() || [];
      let communityNames = [];  //@array of strings
      communityData.map(function (doc) {
        communityNames.push(doc.name)
      });
      doc.industries.map(function (ids) {
        industryIds.push(ids)
      });
      const industryData =  MlIndustries.find( { _id: { $in: industryIds } } ).fetch() || [];
      let industryNames = [];  //@array of strings
      industryData.map(function (doc) {
        industryNames.push(doc.industryName)
      });
      doc.professions.map(function (ids) {
        professionIds.push(ids)
      });
      const professionData =  MlProfessions.find( { _id: { $in: professionIds } } ).fetch() || [];
      let professionNames = [];  //@array of strings
      professionData.map(function (doc) {
        professionNames.push(doc.professionName)
      });
      doc.clusters.map(function (ids) {
        clusterIds.push(ids)
      });
      const clusterData =  MlClusters.find( { _id: { $in: clusterIds } } ).fetch() || [];
      let clusterNames = [];  //@array of strings
      clusterData.map(function (doc) {
        clusterNames.push(doc.clusterName)
      });
      doc.states.map(function (ids) {
        stateIds.push(ids)
      });
      const stateData =  MlStates.find( { _id: { $in: stateIds } } ).fetch() || [];
      let stateNames = [];  //@array of strings
      stateData.map(function (doc) {
        stateNames.push(doc.name)
      });
      doc.chapters.map(function (ids) {
        chapterIds.push(ids)
      });
      const chapterData =  MlChapters.find( { _id: { $in: chapterIds } } ).fetch() || [];
      let chapterNames = [];  //@array of strings
      chapterData.map(function (doc) {
        chapterNames.push(doc.chapterName)
      });

      doc.subChapters.map(function (ids) {
        subChapterIds.push(ids)
      });
      const subChapterData =  MlSubChapters.find( { _id: { $in: subChapterIds } } ).fetch() || [];
      let subChapterNames = [];  //@array of strings
      subChapterData.map(function (doc) {
        subChapterNames.push(doc.subChapterName)
      });
      doc.userTypes.map(function (ids) {
        userTypeIds.push(ids)
      });
      const userTypeData =  MlUserTypes.find( { _id: { $in: userTypeIds } } ).fetch() || [];
      let userTypeNames = [];  //@array of strings
      userTypeData.map(function (doc) {
        userTypeNames.push(doc.userTypeName)
      });

      data[index].communityNames= communityNames || [];
      data[index].professionNames= professionNames || [];
      data[index].industryNames= industryNames || [];
      data[index].clusterNames = clusterNames || [];
      data[index].stateNames = stateNames || [];
      data[index].chapterNames = chapterNames || [];
      data[index].subChapterNames = subChapterNames || [];
      data[index].userTypeNames = userTypeNames || [];

      data[index].processName=processTypes.processName;

    });
    totalRecords=MlProcessMapping.find({isActive:true},query,findOptions).count();
  }
  if(args.module=="businessType"){
    data= MlBusinessType.find(query,findOptions).fetch();
    totalRecords=MlBusinessType.find(query,findOptions).count();
  }
  if(args.module=="citizenship"){
    data= MlCitizenship.find(query,findOptions).fetch();
    totalRecords=MlCitizenship.find(query,findOptions).count();
  }
  if(args.module=="lookingFor"){
    data= MlLookingFor.find(query,findOptions).fetch();
    totalRecords=MlLookingFor.find(query,findOptions).count();
  }

  if(args.module=="Assets"){
    data= MlAssets.find(query,findOptions).fetch();
    totalRecords=MlAssets.find(query,findOptions).count();
  }

  if(args.module=="Technologies"){
    data= MlTechnologies.find(query,findOptions).fetch();
    totalRecords=MlTechnologies.find(query,findOptions).count();
  }
  if(args.module=="FundingType"){
    data= MlFundingTypes.find(query,findOptions).fetch();
    totalRecords=MlFundingTypes.find(query,findOptions).count();
  }

  if(args.module=="EmployeeType"){
    data= MlGlobalSettings.find(query,findOptions).fetch();
    totalRecords=MlGlobalSettings.find(query,findOptions).count();
  }
  if(args.module=="tax"){
    data= MlGlobalSettings.find(query,findOptions).fetch();
    totalRecords=MlGlobalSettings.find(query,findOptions).count();
  }
  if(args.module=="taxation"){
    data= MlTaxation.find(query,findOptions).fetch();
    totalRecords=MlTaxation.find(query,findOptions).count();
  }
  if(args.module=="title"){
    data= MlGlobalSettings.find(query,findOptions).fetch();
    totalRecords=MlGlobalSettings.find(query,findOptions).count();
  }
  if(args.module=="regional"){
    data= MlGlobalSettings.find(query,findOptions).fetch();
    totalRecords=MlGlobalSettings.find(query,findOptions).count();
  }
  if(args.module=="language"){
    data= MlGlobalSettings.find(query,findOptions).fetch();
    totalRecords=MlGlobalSettings.find(query,findOptions).count();
  }
  if(args.module=="dateAndTime"){
    data= MlGlobalSettings.find(query,findOptions).fetch();
    totalRecords=MlGlobalSettings.find(query,findOptions).count();
  }
  if(args.module=="numericalFormat"){
    data= MlGlobalSettings.find(query, findOptions).fetch();
    totalRecords=MlGlobalSettings.find(query, findOptions).count();
  }
  if(args.module=="addressType"){
    data= MlGlobalSettings.find(query,findOptions).fetch();
    totalRecords=MlGlobalSettings.find(query,findOptions).count();
  }
  if(args.module=="CompanyType"){
    data= MlGlobalSettings.find(query,findOptions).fetch();
    totalRecords=MlGlobalSettings.find(query,findOptions).count();
  }
  if(args.module=="emailType"){
    data= MlGlobalSettings.find(query,findOptions).fetch();
    totalRecords=MlGlobalSettings.find(query,findOptions).count();
  }
  if(args.module=="contactType"){
    data= MlGlobalSettings.find(query,findOptions).fetch();
    totalRecords=MlGlobalSettings.find(query,findOptions).count();
  }
  if(args.module=="socialLinks"){
    data= MlGlobalSettings.find(query,findOptions).fetch();
    totalRecords=MlGlobalSettings.find(query,findOptions).count();
  }
  if(args.module=="gender"){
    data= MlGlobalSettings.find(query,findOptions).fetch();
    totalRecords=MlGlobalSettings.find(query,findOptions).count();
  }
  if(args.module == "Portfoliodetails"){
      data = MlPortfolioDetails.find(query,findOptions).fetch();
      totalRecords = MlPortfolioDetails.find(query,findOptions).count();
  }
  if(args.module=="template"){
    data= MlTemplates.find(query,findOptions).fetch();
    totalRecords=MlTemplates.find(query,findOptions).count();
  }
  if(args.module=="templateAssignment"){
    data= MlTemplateAssignment.find(query,findOptions).fetch();
    totalRecords=MlTemplateAssignment.find(query,findOptions).count();
  }
  if(args.module=="hierarchy"){
    data= MlHierarchy.find(query,findOptions).fetch();
    let list = []
    data.map(function (doc,index) {
      let entry = {"_id":doc._id,"level":doc.level,"module":doc.module,"role":doc.role}
      list.push(entry)
    })
    data=list
    totalRecords=MlHierarchy.find(query,findOptions).count();
  }
  if(args.module=="filters"){
    data= MlFilters.find(query,findOptions).fetch();
    totalRecords=MlFilters.find(query,findOptions).count();
  }

  /**check its dependency required or not*/
  if (args.module == "FunderPortfolio") {
    let value = mlDBController.find('MlPortfolioDetails', {status: 'PORT_LIVE_NOW', communityCode: "FUN"}, context).fetch()    //making dependency of funders on portfolio status
    let portId = _lodash.map(value, '_id')
    let finalQuery = mergeQueries(query, {portfolioDetailsId: {$in: portId}});
    data = MlFunderPortfolio.find(finalQuery, findOptions).fetch();
    totalRecords = MlFunderPortfolio.find(finalQuery, findOptions).count();
  }

  // if (args.module == "serviceProviderPortfolioDetails") {
  //   let value = mlDBController.find('MlPortfolioDetails', {status: 'gone live', communityCode: "SPS"}, context).fetch()
  //   let portId = _lodash.map(value, '_id')
  //   let finalQuery = mergeQueries(query, {portfolioDetailsId: {$in: portId}});
  //   data = MlServiceProviderPortfolio.find(finalQuery, findOptions).fetch();
  //   totalRecords = MlServiceProviderPortfolio.find(finalQuery, findOptions).count();
  // }
  // if (args.module == "startupPortfolioDetails") {
  //   let value = mlDBController.find('MlPortfolioDetails', {status: 'gone live', communityCode: "STU"}, context).fetch()
  //   let portId = _lodash.map(value, '_id')
  //   let finalQuery = mergeQueries(query, {portfolioDetailsId: {$in: portId}});
  //   data = MlStartupPortfolio.find(finalQuery, findOptions).fetch();
  //   totalRecords = MlStartupPortfolio.find(finalQuery, findOptions).count();
  // }

  if(args.module=="SubDomain"){
    var domain= MlSubDomain.find(query,findOptions).fetch();
    let modArray =[]
    _.each(domain, function(item){
      var industryName = MlIndustries.findOne({_id:item.industryId}).industryName;
      var obj = item;
      obj.industryId = industryName;
      modArray.push(obj)
    })
    data= modArray;
    totalRecords=MlSubDomain.find(query,findOptions).count();
  }
  if(args.module == "actionAndStatus") {
    var pipeline = [
      {
        '$match':{}
      }];

    if(findOptions.skip && findOptions.skip != undefined){
      pipeline.push({
        '$skip':parseInt(findOptions.skip)
      });
    }
    if(findOptions.limit != undefined){
      pipeline.push({
        '$limit': parseInt(findOptions.limit)
      });
    }
    if(findOptions.sort != undefined){
      pipeline.push({
        '$sort':findOptions.sort
      });
    }
    pipeline.push({
      '$lookup':{
        from: 'users',
        localField: 'createdBy',
        foreignField: '_id',
        as: 'createdBy'
      }
    });
    pipeline.push({
      '$lookup': {
        from: 'users',
        localField: 'updatedBy',
        foreignField: '_id',
        as: 'updatedBy'
      }
    });
    data = mlDBController.aggregate('MlActionAndStatus', pipeline, context);
    data = data.map(function (doc) {
      if(doc.createdBy && doc.createdBy[0]){
        doc.createdBy = doc.createdBy[0].profile.InternalUprofile.moolyaProfile.displayName;
      }
      if(doc.updatedBy && doc.updatedBy[0]){
        doc.updatedBy = doc.updatedBy[0].profile.InternalUprofile.moolyaProfile.displayName;
      }
      return doc;
    });
    totalRecords = mlDBController.find('MlActionAndStatus', query, context, findOptions).count();
  }
  //internal user
  if (args.module == "officeTransaction") {

    let pipeline = [
      // { "$match" : {userId: context.userId, officeId: args.customParams.docId} },
      { "$match" : { officeId: args.customParams.docId} },
      { "$group": {
        _id : null,
        officeId: {$first: "$officeId"},
        officeTrans: { $push: "$$ROOT" }
        }
      },
      {'$lookup':{from:'mlTransactionsLog',localField:'officeId',foreignField:'docId', as:'transactionLog'}},
      {"$unwind": "$transactionLog"},
      {
        '$lookup': {
          from: 'mlOfficeMembers',
          localField: 'transactionLog.activityDocId',
          foreignField: '_id',
          as: 'member'
        }
      },
      {"$unwind": "$member"},
      {"$addFields": {"transactionLog.registrationId": "$member.registrationId"}},
      {
        "$lookup": {
          from: "mlRegistration",
          localField: "transactionLog.registrationId",
          foreignField: "_id",
          as: "registration"
        }
      },
      { "$unwind": "$registration" },
      { "$addFields": { "transactionLog.status": "$registration.status" } },
      {
        "$group": {
          _id: null,
          officeId: {"$first": "$officeId"},
          officeTrans: {"$first": "$officeTrans"},
          transactionLog: {$push: "$transactionLog"}
        }
      },
      {'$project': {
        "officeTrans": {
          '$map':
            {
              "input": "$officeTrans",
              "as": "office",
              'in': {
                "_id": "$$office._id",
                "transactionId": "$$office.transactionId",
                "clusterName": "$$office.clusterName",
                "chapterName": "$$office.chapterName",
                "subChapter": "$$office.subChapterName",
                "communityName": "$$office.communityName",
                "transactionType": "$$office.transactionType",
                "createdby": "$$office.createdBy",
                "email": "$$office.email",
                "createdAt": "$$office.registrationDate",
                "status": "$$office.status"
              }
            }
        },
        "transactionLog": {
          '$map':
            {
              "input": "$transactionLog",
              "as": "trans",
              'in': {
                "_id": "$$trans._id",
                "transactionId": "$$trans.transactionId",
                "clusterName": "$$trans.clusterName",
                "chapterName": "$$trans.chapterName",
                "subChapterName": "$$trans.subChapterName",
                "communityName": "$$trans.communityName",
                "transactionType": "$$trans.transactionTypeName",
                "createdby": "$$trans.userName",
                "email": "$$trans.emailId",
                "createdAt": "$$trans.createdAt",
                "userId": '$_id',
                "status": "$$trans.status",
                "activity": "$$trans.activity",
                "activityDocId": "$$trans.activityDocId",
                "registrationId": "$$trans.registrationId",
                "docId": "$$trans.docId"
              }
            }
          }
        }
      },

      {'$project': {data: { "$concatArrays" : ["$officeTrans", "$transactionLog"] } }},
      {'$addFields': { 'data.totalRecords': { $size: "$data" } } },
      {"$unwind" : "$data"},
      {"$replaceRoot": { newRoot: "$data"}}
    ];

    if(Object.keys(query).length) {
      pipeline.push({$match: query});
    }

    if(findOptions.sort) {
      pipeline.push({$sort:findOptions.sort});
    }

    if(findOptions.skip) {
      pipeline.push({$skip:findOptions.skip});
    }

    if(findOptions.limit) {
      pipeline.push({$limit:findOptions.limit});
    }

    data = mlDBController.aggregate('MlOfficeTransaction', pipeline, context);

    totalRecords = data && data[0] && data[0].totalRecords ? data[0].totalRecords : 0;

    // data = mlDBController.find('MlOfficeTransaction', finalQuery, context, findOptions).fetch();
    // totalRecords = mlDBController.find('MlOfficeTransaction', finalQuery, context).count();
  }

  if (args.module == "userTransaction") {
    let pipeline = [
      {'$match': {_id: context.userId}},
      {'$lookup': {from: 'mlRegistration',localField: '_id',foreignField: 'registrationInfo.userId',as: 'registration'}},
      {'$lookup':{from:'mlPortfolioDetails',localField:'_id',foreignField:'userId', as:'portfolio'}},
      {'$lookup':{from:'mlOfficeTransaction',localField:'_id',foreignField:'userId', as:'office'}},
      {'$lookup':{from:'mlTransactionsLog',localField:'_id',foreignField:'userId', as:'transactionLog'}},
      {'$lookup':{from:'mlTransactionsLog',localField:'_id',foreignField:'fromUserId', as:'transactionLogs'}},
      {'$lookup':{from:'mlTransactionsLog',localField:'_id',foreignField:'attendeeDetails.userId', as:'attendeeTransactionLogs'}},

      {'$project':{"registration":{
        '$map':
          { "input":"$registration",
            "as":"reg",
            'in': {
              "_id":"$$reg._id",
              "transactionId": "$$reg.transactionId",
              "cluster": "$$reg.registrationInfo.clusterName",
              "chapter": "$$reg.registrationInfo.chapterName",
              "subChapter": "$$reg.registrationInfo.subChapterName",
              "community" : "$$reg.registrationInfo.communityName",
              "transactionType": "$$reg.registrationInfo.transactionType",
              "createdby": "$$reg.registrationInfo.createdBy",
              "email": "$$reg.registrationInfo.email",
              "createdAt": "$$reg.registrationInfo.registrationDate",
              "userId": '$_id',
              "status": "$$reg.status"
            }
          }
      },
        "portfolio":{
          '$map':
            { "input":"$portfolio", "as":"port", 'in':
              {
                "_id":"$$port._id",
                "transactionId": "$$port.transactionId",
                "cluster": "$$port.clusterName",
                "chapter": "$$port.chapterName",
                "subChapter": "$$port.subChapterName",
                "community" : "$$port.communityName",
                "transactionType": "$$port.transactionType",
                "createdby": "$$port.createdBy",
                "email": "$$port.portfolioUserName",
                "createdAt": "$$port.createdAt",
                "userId": '$_id',
                "status": "$$port.status",
              }
            }
        },
        "office":{
          '$map':
            { "input":"$office",
              "as":"off",
              'in': {
                "_id":"$$off._id",
                "transactionId": "$$off.transactionId",
                "cluster": "$$off.clusterName",
                "chapter": "$$off.chapterName",
                "subChapter": "$$off.subChapterName",
                "community" : "$$off.communityName",
                "transactionType": "$$off.transactionType",
                "createdby": "$profile.displayName",
                "email": "$username",
                "createdAt": "$$off.dateTime",
                "userId": '$_id',
                "status": "$$off.status",
              }
            }
        },
        "transactionLog": {
          '$map':
            {
              "input": "$transactionLog",
              "as": "trans",
              'in': {
                "_id": "$$trans._id",
                "transactionId": "$$trans.transactionId",
                "transactionTypeId": "$$trans.transactionTypeId",
                "cluster": "$$trans.clusterName",
                "chapter": "$$trans.chapterName",
                "subChapter": "$$trans.subChapterName",
                "community": "$$trans.communityName",
                "transactionType": "$$trans.transactionTypeName",
                "createdby": "$$trans.userName",
                "email": "$$trans.emailId",
                "createdAt": "$$trans.createdAt",
                "userId": '$_id',
                "status": "$$trans.status",
                "activity": "$$trans.activity",
                "activityDocId": "$$trans.activityDocId",
                "fromUserId": "$$trans.fromUserId",
                "fromProfileId": "$$trans.fromProfileId",
                "fromUserName": "$$trans.fromUserName",
                "fromUserType": "$$trans.fromUserType",
                "docId": "$$trans.docId"
              }
            }
        },
        "transactionLogs": {
          '$map':
            {
              "input": "$transactionLogs",
              "as": "trans",
              'in': {
                "_id": "$$trans._id",
                "transactionId": "$$trans.transactionId",
                "cluster": "$$trans.clusterName",
                "chapter": "$$trans.chapterName",
                "subChapter": "$$trans.subChapterName",
                "community": "$$trans.communityName",
                "transactionType": "$$trans.transactionTypeName",
                "createdby": "$$trans.userName",
                "email": "$$trans.emailId",
                "createdAt": "$$trans.createdAt",
                "userId": '$_id',
                "status": "$$trans.status",
                "activity": "$$trans.activity",
                "activityDocId": "$$trans.activityDocId",
                "registrationId": "$$trans.registrationId",
                "docId": "$$trans.docId"
              }
            }
          },
          "attendeeTransactionLogs": {
            '$map':
              {
                "input": "$attendeeTransactionLogs",
                "as": "trans",
                'in': {
                  "_id": "$$trans._id",
                  "transactionId": "$$trans.transactionId",
                  "transactionTypeId": "$$trans.transactionTypeId",
                  "cluster": "$$trans.clusterName",
                  "chapter": "$$trans.chapterName",
                  "subChapter": "$$trans.subChapterName",
                  "community": "$$trans.communityName",
                  "transactionType": "$$trans.transactionTypeName",
                  "createdby": "$$trans.userName",
                  "email": "$$trans.emailId",
                  "createdAt": "$$trans.createdAt",
                  "userId": '$_id',
                  "status": "$$trans.status",
                  "activity": "$$trans.activity",
                  "activityDocId": "$$trans.activityDocId",
                  "fromUserId": "$$trans.fromUserId",
                  "fromProfileId": "$$trans.fromProfileId",
                  "fromUserName": "$$trans.fromUserName",
                  "fromUserType": "$$trans.fromUserType",
                  "docId": "$$trans.docId"
                }
              }
            }
      }},

      // {'$lookup':{from:'mlTransactionsLog',localField:'_id',foreignField:'fromUserId', as:'investerTransactionLog'}},

      { '$project':
        {
          '_id':1,
          'registration':1,
          'portfolio':1,
          'office':1,
          // 'investerTransactionLog': {
          //   $filter: {
          //     input: "$transactionLog",
          //     as: "transaction",
          //     cond: { $ne: [ "$$transaction.transactionType", 'investments' ] }
          //   }
          // },
          'transactionLog': {
            $filter: {
              input: "$transactionLog",
              as: "transaction",
              cond: { $ne: [ "$$transaction.transactionType", 'system' ] }
            }
          },
          'transactionLogs': {
            $filter: {
              input: "$transactionLogs",
              as: "transaction",
              cond: {$or:[
                {$eq: [ "$$transaction.activity", 'Session-Appointment' ]},
                { $eq: [ "$$transaction.activity", 'BeSpokeService-Created' ] },
                { $eq: [ "$$transaction.activity", 'Service-Purchased' ] }
              ] }
            }
          },
          'attendeeTransactionLogs': {
            $filter: {
              input: "$attendeeTransactionLogs",
              as: "transaction",
              cond: { $eq: ["$$transaction.activity", 'Session-Appointment'] }
            }
          },
    }
  },
      {'$project': {data: { "$concatArrays" : [ "$registration", "$portfolio", "$office", "$transactionLog", "$transactionLogs","$attendeeTransactionLogs" ] } }},
      // {'$project': {data: { "$concatArrays" : [ "$registration", "$portfolio", "$office", "$transactionLog", "$investerTransactionLog" ] } }},
      {'$addFields': { 'data.totalRecords': { $size: "$data" } } },
      {"$unwind" : "$data"},
      {"$replaceRoot": { newRoot: "$data"}}
    ];

    if(Object.keys(query).length) {
      pipeline.push({$match: query});
    }

    if(findOptions.sort) {
      pipeline.push({$sort:findOptions.sort});
    }else{
      pipeline.push({$sort:{'createdAt': -1}});
    }

    if(findOptions.skip) {
      pipeline.push({$skip:findOptions.skip});
    }

    if(findOptions.limit) {
      pipeline.push({$limit:findOptions.limit});
    }
    data = mlDBController.aggregate('users', pipeline, context);

    data = data.map(function (doc) {

      let transactionType = doc.transactionType;
      let transactionsTypeCheck = [
        'connectionRequest',
        'interaction',
        'investments',
        'appointment',
        'manageSchedule'
      ];
      if( transactionsTypeCheck.indexOf(transactionType) >= 0 ) {
        if(doc.fromUserType === 'user') {
          let fromUserProfile;
          if(doc.fromProfileId) {
            fromUserProfile = new MlUserContext().userProfileDetailsByProfileId(doc.fromProfileId);
          } else {
            fromUserProfile = new MlUserContext().userProfileDetails(doc.fromUserId);
          }
          doc.cluster = fromUserProfile.clusterName;
          doc.chapter = fromUserProfile.chapterName;
          doc.subChapter = fromUserProfile.subChapterName;
          doc.community = fromUserProfile.communityName;
          doc.email = fromUserProfile.email;
          doc.createdby = fromUserProfile.firstName + ' ' + fromUserProfile.lastName;
          doc.mobileNumber = fromUserProfile.mobileNumber;
        }
        if(transactionType === "appointment") {
          let data = mlDBController.findOne('MlAppointments', {"appointmentId":doc.docId});
          if(data && data.status){
            if(data.status ==='Pending'){
              let datafromMembers = mlDBController.findOne('MlAppointmentMembers', {appointmentId:doc.docId,userId:doc.userId});
              if(datafromMembers && datafromMembers.status){
                data.status = datafromMembers.status;
              }
            }
            if(data.status === 'Accepted') {
            if(data.endDate ||  data.startDate){
              let appDate = new Date(data.endDate)
              let isExpired = new Date() > appDate ? true : false;
              let ifEqual =  new Date().setHours(0,0,0,0) === new Date(data.startDate).setHours(0,0,0,0);
              //let currentStatus = data.status === "Accepted" ? true : false;
              if(isExpired) doc.status = "Expired";
              else if (ifEqual && data.status !== "Completed") doc.status = "Today";
             else doc.status = data.status;
            }
            }
          else doc.status = data.status;
          }
        }
        else if(transactionType === 'manageSchedule' && doc.activity == 'BeSpokeService-Created' ){
          doc.status = 'Requested';
        }
        let activity = doc.activity;
        let activityDocId = doc.activityDocId;
        switch (activity){
          case 'connection':
            let status = [ "Pending", "Accepted", "Declined","Blocked"];
            let data = mlDBController.findOne('MlConnections', activityDocId);
            doc.transactionId = data && data.transactionId ? data.transactionId : doc.transactionId;
            doc.status = status[data.status];
            break;
          case 'onBoard':
            let stage = mlDBController.findOne('MlStage', activityDocId);
            if(stage.transactionLogStatus) {
              let _status =  stage.transactionLogStatus;
              let _onBoardStatus = _status.filter(function(data){
                if(data.transactionId === doc._id) return data.status;
              })
              doc.status = _onBoardStatus.length && _onBoardStatus[0].status ? _onBoardStatus[0].status.slice(0,1).toUpperCase()+_onBoardStatus[0].status.slice(1) : "Pending"
            }else doc.status = stage.onBoardStatus ? stage.onBoardStatus.slice(0,1).toUpperCase() + stage.onBoardStatus.slice(1) : 'Pending';
            break;
        }
      }
      return doc;
    });
    // data = _lodash.concat(response[0].R, response[0].P, response[0].O, response[0].T)
    totalRecords = data && data[0] && data[0].totalRecords ? data[0].totalRecords : 0;
  }

  if(args.module=="NotificationTemplate"){
    data= MlNotificationTemplates.find(query,findOptions).fetch();
    totalRecords=MlNotificationTemplates.find(query,findOptions).count();
  }

  /**
   * Fetching only admin created office packages
   * */
  if(args.module == 'OFFICEPACKAGE'){
    var queryChange = {"isBSpoke" : false}
    var queryList = mergeQueries(query, queryChange);
    data= MlOfficeSCDef.find(queryList,findOptions).fetch();
    // data= MlOfficeSCDef.find(query,findOptions).fetch();
    totalRecords = MlOfficeSCDef.find(query,findOptions).count();
  }

  return {'totalRecords':totalRecords,'data':data};
};

MlResolver.MlUnionResolver['SearchResult']= {
  __resolveType(data, context, info){

    var module=context.module||"";
    var resolveType='';
    switch(module) {
      case "cluster":resolveType= 'Cluster';break;
      case "chapter":resolveType= 'Chapter';break;
      case "subChapter":resolveType= 'SubChapter';break;
      case "department":resolveType= 'Department';break;
      case "subDepartment":resolveType= 'SubDepartment';break;
      case "countries":resolveType= 'Countries';break;
      case "states":resolveType= 'States';break;
      case "cities":resolveType= 'Cities';break;
      case "userType":resolveType= 'UserTypes';break;
      case "roleType":resolveType= 'RoleTypes';break;
      case "processmapping":resolveType='ProcessType';break;
      case "documents":resolveType='ProcessType';break;
      case "request":resolveType='Requests';break;
      case "tax":resolveType='Tax';break;
      case "taxation":resolveType='taxation';break;
      case "registrationInfo":resolveType= 'RegistrationInfo';break;
      case "registrationApprovedInfo":resolveType= 'RegistrationInfo';break;
      case "FunderPortfolio":resolveType= 'FunderPortfolio';break;
      // case "serviceProviderPortfolioDetails":resolveType= 'serviceProviderPortfolioDetails';break;
      // case "startupPortfolioDetails":resolveType= 'startupPortfolioOutput';break;
      case "Portfoliodetails":resolveType= 'Portfoliodetails';break;
      case "documentType":resolveType= 'DocumentTypes';break;
      case "documentFormat":resolveType= 'DocumentFormats';break;
      case "kycCategory":resolveType= 'KycCategories';break;
      case "documentMapping":resolveType= 'DocumentMapping';break;
      case "transactionTypes":resolveType= 'Transaction';break;
      case "ACCOUNTTYPE":resolveType= 'Account';break;
      case "template":resolveType= 'TemplateDetails';break;
      case "templateAssignment":resolveType= 'TemplateAssignment';break;
      case "industry":resolveType= 'Industry';break;
      case "roles":resolveType= 'Roles';break;
      case "awards":resolveType= 'Award';break;
      case "specification":resolveType= 'Specification';break;
      case "profession":resolveType= 'Profession';break;
      case "entity":resolveType= 'Entity';break;
      case "stageOfCompany":resolveType= 'StageOfCompany';break;
      case "businessType":resolveType= 'BusinessType';break;
      case "citizenship":resolveType= 'Citizenship';break;
      case "lookingFor":resolveType= 'LookingFor';break;
      case "Assets":resolveType= 'Assets';break;
      case "Technologies":resolveType= 'Technologies';break;
      case "FundingType":resolveType= 'FundingType';break;
      case "EmployeeType":resolveType= 'EmployeeType';break;
      case "hierarchy":resolveType= 'Hierarchy';break;
      case "addressType":resolveType= 'AddressType';break;
      case "numericalFormat":resolveType= 'NumericalFormat';break;
      case "companyType":resolveType= 'CompanyType';break;
      case "emailType":resolveType= 'EmailType';break;
      case "contactType":resolveType= 'ContactType';break;
      case "socialLinks":resolveType= 'SocialLinks';break;
      case "gender":resolveType= 'Gender';break;
      case "filters":resolveType= 'Filters';break;
      case "SubDomain":resolveType= 'SubDomain';break;
      case "dateAndTime":resolveType= 'DateAndTime';break;
      case "language":resolveType= 'Language';break;
      case "Users":resolveType= 'BackendUsers';break;
      case "regional":resolveType= 'Regional';break;
      case "title":resolveType= 'Title';break;
      case "community":resolveType= 'Community';break;
      case "REQUESTTYPE":resolveType= 'Requests';break;
      case 'actionAndStatus':resolveType='ActionAndStatusType';break
      case 'TransactionsLog':resolveType='TransactionsLog';break
      case 'officeTransaction':resolveType='officeTransactionType';break
      case 'userTransaction':resolveType='myTransaction';break
      case 'NotificationTemplate':resolveType='NotificationTemplate';break
      case 'OFFICEPACKAGE':resolveType='OfficePackage';break;
    }

    /**Its a quick fix until a generic solution is coded.
     *  This is to resolve module Name from fetchUsersForDashboard QueryResolver of the userResolver.js file*/
    if(context&&context.userModule==='Users'){
      resolveType='BackendUsers';
    }

    if(resolveType){
      return resolveType;
    }else{
      return 'GenericType';
    }
    /*if(data.registrationType){
     return 'RegistrationInfo';
     }
     if((data.communityType=="Funders") && data.portfolioDetailsId){
     return 'FunderPortfolio';
     }
     if(data.portfolioUserName){
     return 'Portfoliodetails';
     }

     if (data.countryCode && data.country) {
     return 'Countries';
     }
     if(data.name && data.countryId&&!data.stateId){
     return 'States';
     }
     if(data.name && data.stateId){
     return 'Cities';
     }
     if (data.countryId) {
     return 'Cluster';
     }
     if (data.chapterName) {
     return 'Chapter';
     }
     if (data.subChapterName) {
     return 'SubChapter';
     }
     if (data.departmentName) {
     return 'Department';
     }
     if (data.subDepartmentName) {
     return 'SubDepartment';
     }
     if(data.requestName){
     return 'Requests'
     }
     if(data.userTypeName){
     return 'UserTypes'
     }
     if(data.roleTypeName){
     return 'RoleTypes'
     }
     if(data.docTypeName){
     return 'DocumentTypes'
     }
     if(data.docFormatName){
     return 'DocumentFormats'
     }
     if(data.docCategoryName){
     return 'KycCategories'
     }
     if(data.documentDisplayName){
     return 'DocumentMapping'
     }
     if(data.transactionName){
     return 'Transaction'
     }
     if(data.templateName){
     return 'Template'
     }
     if(data.username){
     return 'BackendUsers'
     }
     if(data.roleName){
     return 'Roles'
     }
     if(data.professionName){
     return 'Profession'
     }
     if(data.industryName){
     return 'Industry'
     }
     if(data.awardName){
     return 'Award'
     }
     if(data.specificationName){
     return 'Specification'
     }
     if(data.entityName){
     return 'Entity'
     }
     if(data.stageOfCompanyName){
     return 'StageOfCompany'
     }
     if(data.businessTypeName){
     return 'BusinessType'
     }
     if(data.citizenshipTypeName){
     return 'Citizenship'
     }
     if(data.lookingForName){
     return 'LookingFor'
     }

     if(data.assetName){
     return 'Assets'
     }

     if(data.technologyName){
     return 'Technologies'
     }
     if(data.fundingTypeName){
     return 'FundingType'
     }

     if(data.processId){
     return 'ProcessType'
     }
     if(data.employmentName){
     return 'EmployeeType'
     }
     if(data.taxName){
     return 'Tax'
     }
     if(data.taxationName){
     return 'taxation'
     }
     if(data.titleName){
     return 'Title'
     }
     if(data.regionalCurrencyName){
     return 'Regional'
     }
     if(data.languageName){
     return 'Language'
     }
     if(data.measurementSystem){
     return 'NumericalFormat'
     }
     if(data.addressName){
     return 'AddressType'
     }
     if(data.socialName){
     return 'SocialLinks'
     }
     if(data.genderName){
     return 'Gender'
     }
     if(data.timeFormat){
     return 'DateAndTime'
     }
     if(data.companyName){
     return 'CompanyType'
     }
     if(data.emailName){
     return 'EmailType'
     }
     if(data.contactName){
     return 'ContactType'
     }
     if(data.code&&data.communityName){
     return 'Community'
     }
     if(data.firstName){
     return 'RegistrationInfo'
     }
     if(data.processName){
     return 'TemplateDetails'
     }
     if(data.templateProcessName){
     return 'TemplateAssignment'
     }
     if(data.module){
     return 'Hierarchy'
     }
     if(data.filterName){
     return 'Filters'
     }
     if(data.name){
     return 'SubDomain'
     }*/
    return 'GenericType';
  }
}

  // let accessControlQuery = function (userId, context) {
  //   var curUserProfile = new MlAdminUserContext().userProfileDetails(userId);
  //   var queryReturn;
  //   if (curUserProfile.defaultSubChapters.indexOf("all") < 0) {   //sub-chapter_admin non-moolya
  //     let subChapterId = curUserProfile.defaultSubChapters ? curUserProfile.defaultSubChapters[0] : ''
  //     // let subChapterDetails = MlResolver.MlQueryResolver['fetchSubChapter'](null, {_id: subChapterId}, context, null)
  //     let subChapterDetails = mlDBController.findOne('MlSubChapters', {_id: subChapterId}, context)   /*not getting complete data so changing query*/
  //     if(subChapterDetails && !_.isEmpty(subChapterDetails.internalSubChapterAccess)){
  //       let canSearch = subChapterDetails.internalSubChapterAccess.backendUser?subChapterDetails.internalSubChapterAccess.backendUser.canSearch:false
  //       var associated = subChapterDetails.associatedSubChapters ? subChapterDetails.associatedSubChapters : []
  //       if(canSearch)
  //         curUserProfile.defaultSubChapters = _lodash.concat(curUserProfile.defaultSubChapters, associated)
  //     }
  //     queryReturn = {$and: [{'_id':{$ne: userId}},{'profile.isMoolya': false}, {'profile.InternalUprofile.moolyaProfile.subChapter': {$in: curUserProfile.defaultSubChapters}}, {'profile.isExternaluser': false}]}
  //   } else {
  //     queryReturn = {'profile.isExternaluser': false}   //platform_admin
  //   }
  //   return queryReturn;
  // }
