import MlResolver from "../../../../commons/mlResolverDef";
import MlRespPayload from "../../../../commons/mlPayload";
import _ from "lodash";
import _underscore from "underscore"
/*
MlResolver.MlQueryResolver['fetchProcess'] = (obj, args, context, info) =>{
  return MlProcessMapping.findOne({name});
}*/

MlResolver.MlMutationResolver['createProcess'] = (obj, args, context, info) =>{
  let isValidAuth = mlAuthorization.validteAuthorization(context.userId, args.moduleName, args.actionName, args);
  if (!isValidAuth) {
    let code = 401;
    let response = new MlRespPayload().errorPayload("Not Authorized", code);
    return response;
  }

  let process = args.process;
    // if(MlProcessMapping.find({processId:process.processId}).count() > 0){
      if(mlDBController.find('MlProcessMapping', {processId:process.processId}, context).count() > 0){
        let code = 409;
        let response = new MlRespPayload().errorPayload("'Process mapping' already exists!", code);
        return response
    }
    // let id = MlProcessMapping.insert({...args.process});
  var firstName='';var lastName='';
  // let id = MlDepartments.insert({...args.department});
  if(Meteor.users.findOne({_id : context.userId}))
  {
    let user = Meteor.users.findOne({_id: context.userId}) || {}
    if(user&&user.profile&&user.profile.isInternaluser&&user.profile.InternalUprofile) {

      firstName=(user.profile.InternalUprofile.moolyaProfile || {}).firstName||'';
      lastName=(user.profile.InternalUprofile.moolyaProfile || {}).lastName||'';
    }else if(user&&user.profile&&user.profile.isExternaluser) { //resolve external user context based on default profile
      firstName=(user.profile || {}).firstName||'';
      lastName =(user.profile || {}).lastName||'';
    }
  }
  let createdBy = firstName +' '+lastName
  args.process.createdBy = createdBy;
  args.process.createdDate = new Date();
  var randomId = Math.floor(Math.random() * 90000) + 10000;
  args.process.processId = "PRO"+randomId
    let id = mlDBController.insert('MlProcessMapping', args.process, context)
    if(id){
        let code = 200;
        let result = {roleId: id}
        let response = new MlRespPayload().successPayload(result, code);
        return response
    }
}
MlResolver.MlQueryResolver['findProcess'] = (obj, args, context, info) => {
  if (args.id) {
    var id= args.id;
    // let response= MlProcessMapping.findOne({"_id":id});
    let response = mlDBController.findOne('MlProcessMapping', {_id: id}, context)
    let documents=response&&response.documents?response.documents:[];
    documents.map(function (doc, index) {
     let kycCategeotyId=doc.category
     // const kycCategory= MlDocumentCategories.findOne({_id:kycCategeotyId})||'';
      const kycCategory = mlDBController.findOne('MlDocumentCategories', {_id: kycCategeotyId}, context)||'';
        doc.categoryName=kycCategory.docCategoryName;
    });
    return response;
  }
}

MlResolver.MlMutationResolver['updateProcess'] = (obj, args, context, info) => {
  let isValidAuth = mlAuthorization.validteAuthorization(context.userId, args.moduleName, args.actionName, args);
  if (!isValidAuth) {
    let code = 401;
    let response = new MlRespPayload().errorPayload("Not Authorized", code);
    return response;
  }

  if (args.id) {
    var id= args.id;
    args=_.omit(args,'id');
    /*//find the old  details

    let processResult=MlProcessMapping.findOne({"_id":id});
    if(processResult&&processResult.documents){
      let oldDocuments=processResult.documents
      let newDocuments=args.process.documents
      let differedDoc=[]
      oldDocuments.map(function(current){
         newDocuments.map(function(current_new){
             if(current_new.type == current.type&& current_new.category == current.category&&current_new.isActive != current.isActive){
               differedDoc.push(current_new)
             }
          })
      });
      console.log(differedDoc)
      if(differedDoc.length>0){
          for(let i=0;i<differedDoc.length;i++){
            if(differedDoc[i].isActive==false){
              let result = mlDBController.update('MlProcessMapping', {
                _id: id, 'processDocuments': {
                  $elemMatch: {
                    'kycCategoryId': differedDoc[i].category, 'docTypeId': differedDoc[i].type
                  }
                }
              }, {
                "processDocuments.$.isMandatory": false,
                "processDocuments.$.isActive": false
              }, {$set: true}, context)
            }
          }

      }
    }*/
    // let result= MlProcessMapping.update(id, {$set: args.process});
    if(Meteor.users.findOne({_id : context.userId}))
    {
      let user = Meteor.users.findOne({_id: context.userId}) || {}
      if(user&&user.profile&&user.profile.isInternaluser&&user.profile.InternalUprofile) {

        firstName=(user.profile.InternalUprofile.moolyaProfile || {}).firstName||'';
        lastName=(user.profile.InternalUprofile.moolyaProfile || {}).lastName||'';
      }else if(user&&user.profile&&user.profile.isExternaluser) { //resolve external user context based on default profile
        firstName=(user.profile || {}).firstName||'';
        lastName =(user.profile || {}).lastName||'';
      }
    }
    let createdBy = firstName +' '+lastName
    args.process.updatedBy = createdBy;
    args.process.updatedDate = new Date();

    let result = mlDBController.update('MlProcessMapping', id, args.process, {$set:true}, context)
      let code = 200;
    let response = new MlRespPayload().successPayload(result, code);
    return response
  }
}

/**
 * authrization moved to generic layer
 * @func used for both {isMandatory and isActive}
 */
MlResolver.MlMutationResolver['upsertProcessDocument'] = (obj, args, context, info) => {
  if (args.id) {
    var id = args.id;
    args = _.omit(args, '_id');
    if (args.kycCategoryId) {
      let result;
         result = mlDBController.update('MlProcessMapping', {
          _id: id, 'processDocuments': {
            $elemMatch: {
              'kycCategoryId': args.kycCategoryId, 'docTypeId': args.docTypeId, 'documentId': args.documentId
            }
          }
        }, {
          "processDocuments.$.isMandatory": args.isMandatory,
          "processDocuments.$.isActive": args.isActive
        }, {$set: true}, context)

      if(result!=1){
          console.log("insertion opertion");
          let processDocument={};
          let documentMappingDef = mlDBController.findOne('MlDocumentMapping', args.documentId, context);
          let doctypeDetails = mlDBController.findOne('MlDocumentTypes', {_id: args.docTypeId}, context);
          let kycCategories = mlDBController.findOne('MlDocumentCategories', {_id:args.kycCategoryId}, context)
           processDocument=_.pick(documentMappingDef, ['documentDisplayName','allowableFormat','documentName','inputLength','allowableMaxSize'])
           processDocument.kycCategoryId=args.kycCategoryId;
           processDocument.kycCategoryName=kycCategories.docCategoryName
           processDocument.docTypeId=args.docTypeId;
           processDocument.docTypeName=doctypeDetails.docTypeName
           processDocument.documentId=documentMappingDef._id;
           processDocument.isMandatory=args.isMandatory;
           processDocument.isActive=args.isActive;
           processDocument.validity=documentMappingDef&&documentMappingDef.validity?documentMappingDef.validity:null

          result = mlDBController.update('MlProcessMapping', id, { 'processDocuments': processDocument }, { $push: true }, context)
      }
      let code = 200;
      let response = new MlRespPayload().successPayload(result, code);
      return response
    }
  }
}
/*

MlResolver.MlQueryResolver['findProcessDocumentForRegistration'] = (obj, args, context, info) => {
  // TODO : Authorization
  let email=args.email;
  let clusters=args.clusterId;
  let chapters=args.chapterId;
  let subChapters=args.subChapterId;
  let communities=args.communityType;
  let professions=args.profession;
  let userTypes=args.userType;
  let process=null
  let specificQuery=[];
  let kycProcessDoc=null

  function getTheKyc(email){


    //check for specific condition for all criteria fields of processmapping
    if(clusters!=null&&chapters!=null&&subChapters!=null&&communities!=null&&professions!=null&&userTypes!=null){
      let val={clusters,chapters,subChapters,communities,professions,userTypes}
      process=fetchProcessProxy(val);
      if(process){
        return process
      }
    }
    //check for all or specific condition for all criteria fields of processmapping
    let val={clusters,chapters,subChapters,communities,professions,userTypes}
    for (var key in val) {
      let qu={};
      qu[key]={$in:['all',val[key]]};
      specificQuery.push(qu);//console.log(qu);
    }
    let query={$and:specificQuery}
    process=fetchProcessProxy(query);
    if(process){
      return process
    }
    //check for 'all' condition on criteria fields of processmapping
    let allVal={clusters:"all",chapters:"all",subChapters:"all",communities:"all",professions:"all",userTypes:"all"}
    process=fetchProcessProxy(allVal);
    if(process){
      return process
    }


  }
  function fetchProcessProxy(query){
    console.log(query)
    let document= MlProcessMapping.findOne({ $and: [query,{"identity":{ $in: [args.identityType]},"industries":{ $in: [args.industry]},"isActive":true}]})
    if(document!=undefined){
      data=document.processDocuments;
      data.map(function (doc,index) {
        const allowableFormatData =  MlDocumentFormats.find( { _id: { $in: doc.allowableFormat } } ).fetch() || [];
        let allowableFormatNames = [];  //@array of strings
        allowableFormatData.map(function (doc) {
          allowableFormatNames.push(doc.docFormatName)
        });
        data[index].allowableFormat = allowableFormatNames || [];
      });
      return document
    }
  }


  //checking for the email exist or not
   let user=MlRegistration.find({"$and":[{"registrationInfo.email":email},{"status":"Approved"}]}).fetch();
  if(user&&user.length>0){
   let  ApprovedKyc=[];
    let kycDoc=null;
    //if user exist get the KYC of  approved Users
   /!* _.map(user,function(userDetails){
      if(userDetails.kycDocuments){
        let kyc=userDetails.kycDocuments
        for(let i=0;i<kyc.length;i++){
          ApprovedKyc.push(kyc[i])
        }
      }
    })*!/
         for(let j=0;j<user.length;j++){
           if(user[j].kycDocuments){
             let kyc=user[j].kycDocuments
             for(let i=0;i<kyc.length;i++){
               ApprovedKyc.push(kyc[i])
             }
           }
         }
    kycDoc=_.uniqBy(ApprovedKyc, function (kyc) {
      return kyc.documentId&&kyc.docTypeId;
    });


    if(kycDoc){
      //get the kyc for multiple profile createria
      kycProcessDoc=getTheKyc(email)
      if(kycProcessDoc){
        let props=['documentId','docTypeId'];
        let Documents=[],MatchingDocuments=[]
        let latestKyc=kycProcessDoc.processDocuments;
        if(latestKyc.length>0){
          //matching the documents in both latestkyc and alredy approved kyc
                for(var i=0;i<kycDoc.length;i++){
                  for(var j=0;j<latestKyc.length;j++){
                    if((kycDoc[i].documentId==latestKyc[j].documentId)&&(kycDoc[i].docTypeId==latestKyc[j].docTypeId)){
                      console.log(kycDoc[i])
                      MatchingDocuments.push(kycDoc[i])
                    }
                  }
                }
                //if matching documents available
                if(MatchingDocuments&&MatchingDocuments.length>0){
                  //search for unmatched documents in latestkyc
                  for (var i = 0, len = MatchingDocuments.length; i < len; i++) {
                    for (var j = 0, len2 = latestKyc.length; j < len2; j++) {
                      if ((MatchingDocuments[i].documentId === latestKyc[j].documentId)&&(MatchingDocuments[i].docTypeId === latestKyc[j].docTypeId)){
                        latestKyc.splice(j, 1);
                        len2=latestKyc.length;
                      }
                    }
                  }
                  console.log(latestKyc)
                  //if unmatched docs found pushed to matching doc and return the documents
                  if(latestKyc&&latestKyc.length){
                      for(let i=0;i<latestKyc.length;i++){
                        MatchingDocuments.push(latestKyc[i])
                      }
                        let kycProcess={
                          'processDocuments':MatchingDocuments
                        }
                        if(kycProcess){
                          return kycProcess

                        }

                  }else{
                    //if no docs found in latest kyc  return matching docs
                        let kycProcess={
                          'processDocuments':MatchingDocuments
                        }
                        if(kycProcess){
                          return kycProcess

                        }
                  }
                }
                else{
                  //if no matching documents return the latest kyc
                      let kycProcess={
                        'processDocuments':latestKyc
                      }
                      if(kycProcess){
                        return kycProcess

                      }
                }
              }else{
                  return kycProcessDoc
              }
              }

            }

      }else {
      let processDocMap=getTheKyc(email)
      if(processDocMap){
        return processDocMap
      }
    }

}
*/





MlResolver.MlQueryResolver['findProcessDocumentForRegistration'] = (obj, args, context, info) => {
  // TODO : Authorization
  let email = args.email;
  let country = args.countryId;
  let clusters = args.clusterId;
  let chapters = args.chapterId;
  let selectedSubChapters = args.subChapterId;
  let communities = args.communityType;
  let professions = args.profession;
  let userTypes = args.userType;
  let process = null
  let specificQuery = [];
  let kycProcessDoc = null

  function getTheKyc(email, subChapters, nonMoolyaSubChapterId) {
      let allKycDoc=[],allCombinationDoc=[];

    //check for specific condition for all criteria fields of processmapping
   /* if (clusters != null && chapters != null && subChapters != null && communities != null && professions != null && userTypes != null) {
      let val = {clusters, chapters, subChapters, communities, professions, userTypes}
      process = fetchProcessProxy(val);
      if (process) {
        //need to return all the combination as per jiira-2189
        // return process
        process.map(function(doc){
          allKycDoc.push(doc);
        })
      }
    }*/
    //check for all or specific condition for all criteria fields of processmapping
    let val = {clusters, chapters, subChapters, communities, professions, userTypes}
    for (var key in val) {
      let qu = {};
      if(key == "subChapters"){
        let nonMoolyaSubChapId = nonMoolyaSubChapterId?nonMoolyaSubChapterId:"";
        qu[key] = {$in: ['all', val[key],nonMoolyaSubChapId]};
      }else{
        qu[key] = {$in: ['all', val[key]]};
      }

      specificQuery.push(qu);
    }
    let query = {$and: specificQuery}
    process = fetchProcessProxy(query);
    if (process) {
      //need to return all the combination as per jiira-2189
      // return process
      process.map(function(doc){
        allKycDoc.push(doc);
      })

    }
    //check for 'all' condition on criteria fields of processmapping
    let allVal = {
      clusters: "all",
      chapters: "all",
      subChapters: "all",
      communities: "all",
      professions: "all",
      userTypes: "all"
    }
    process = fetchProcessProxy(allVal);
    if (process) {
      //need to return all the combination as per jiira-2189
      // return process
      process.map(function(doc){
        allKycDoc.push(doc);
      })
    }
    if (allKycDoc && allKycDoc.length > 0) {
      //getting uniq documents based on documentId
      allCombinationDoc = _underscore.uniq(allKycDoc, function (kyc) {
        let docId = kyc&&kyc.documentId?kyc.documentId:""
        return docId;
      });
      //allCombinationDoc = _underscore.uniq(allKycDoc, kyc => [kyc.docTypeId, kyc.documentId].join());
      return allCombinationDoc
    }
    return allKycDoc
  }

  function fetchProcessProxy(query) {
    let date = new Date();
    date.setHours(0,0,0,0)
    let document = MlProcessMapping.find({
      $and: [query, {
        "identity": {$in: [args.identityType]},
        "industries": {$in: [args.industry]},
        "isActive": true
      }, { $or : [{"processDocuments.validity" : null},{"processDocuments.validity" : {"$gte": date}}]}]
    }).fetch()
    if (document && document.length > 0) {
      let combinationBasedDoc=[],kycDoc=[]

      document.map(function (processDoc) {
        if (processDoc && processDoc.processDocuments) {
          let combinationDoc = processDoc.processDocuments
          //fetching the self based documents documents from processDocuments
          combinationDoc.map(function (doc, index) {
            const allowableFormatData = MlDocumentFormats.find({_id: {$in: doc.allowableFormat}}).fetch() || [];
            let allowableFormatNames = [];  //@array of strings
            allowableFormatData.map(function (doc) {
              allowableFormatNames.push(doc.docFormatName)
            });
            combinationDoc[index].allowableFormat = allowableFormatNames || []
            if (doc.docTypeId != 'self' && doc.isActive == true) {
              combinationBasedDoc.push(doc)
            }
          })
        }else{
          combinationBasedDoc = combinationBasedDoc
        }
      })
      /*if (combinationBasedDoc && combinationBasedDoc.length > 0) {
        //getting uniq documents based on documentId
        kycDoc = _underscore.uniq(combinationBasedDoc, function (kyc) {
          let docId = kyc&&kyc.documentId?kyc.documentId:""
          let docTypeId = kyc&&kyc.docTypeId?kyc.docTypeId:""
          //let docId = kyc&&kyc.documentId?kyc.documentId:""
          return docId;
        });
         /!*kycDoc = _underscore.uniq(combinationBasedDoc, kyc => [kyc.docTypeId, kyc.documentId].join());
        return kycDoc*!/
      }*/
      return combinationBasedDoc
    }
/*    if (document != undefined) {
      data = document.processDocuments;
      if (data) {
        data.map(function (doc, index) {
          const allowableFormatData = MlDocumentFormats.find({_id: {$in: doc.allowableFormat}}).fetch() || [];
          let allowableFormatNames = [];  //@array of strings
          allowableFormatData.map(function (doc) {
            allowableFormatNames.push(doc.docFormatName)
          });
          data[index].allowableFormat = allowableFormatNames || [];
        });

      }
      return document
    }*/
  }

  function getCountryBasedDocuments(country) {
    let countryBasedDoc = [], kycDoc = []
    let date = new Date();
    date.setHours(0,0,0,0)
    let document = MlProcessMapping.find({$and: [{"clusters": {$in: [country,"all"]}}, { $or : [{"processDocuments.validity" : null},{"processDocuments.validity" : {"$gte": date}}]},{isActive: true}]}).fetch()
    if (document && document.length > 0) {
      document.map(function (processDoc) {
        if (processDoc && processDoc.processDocuments) {
          let countryDoc = processDoc.processDocuments
          //fetching the self based documents documents from processDocuments
          countryDoc.map(function (doc, index) {
            const allowableFormatData = MlDocumentFormats.find({_id: {$in: doc.allowableFormat}}).fetch() || [];
            let allowableFormatNames = [];  //@array of strings
            allowableFormatData.map(function (doc) {
              allowableFormatNames.push(doc.docFormatName)
            });
            countryDoc[index].allowableFormat = allowableFormatNames || []
            let isNonMoolyaSubChapterSpecific;
            if (doc.docTypeId == 'self' && doc.isActive == true) {
              let documentId = doc.documentId?doc.documentId:""
              let documentMappingDef = mlDBController.findOne('MlDocumentMapping', documentId, context)
              let documentMapSubChapters = documentMappingDef&&documentMappingDef.subChapters?documentMappingDef.subChapters:[]
              if(documentMapSubChapters && documentMapSubChapters.length>0 && documentMapSubChapters.length == 1){
                var latestdocs = documentMapSubChapters.join();
                if(latestdocs == "all"){
                  countryBasedDoc.push(doc)
                }else{
                  let selectedSubChapter = [selectedSubChapters]
                  var subChapterSame = documentMapSubChapters.length == selectedSubChapter.length && documentMapSubChapters.every(function(element, index) {
                      return element === selectedSubChapter[index];
                    });
                  isNonMoolyaSubChapterSpecific = mlDBController.findOne('MlSubChapters', {
                    "_id": {$in: documentMapSubChapters},
                    isDefaultSubChapter: false,
                    isActive: true
                  }, context)

                  if(isNonMoolyaSubChapterSpecific && subChapterSame){
                    countryBasedDoc.push(doc)
                  }else{
                    countryBasedDoc.push(doc)
                  }
                }
              }else{
                countryBasedDoc.push(doc)
              }



            }
          })
        }else{
          countryBasedDoc = countryBasedDoc
        }
      })
      if (countryBasedDoc && countryBasedDoc.length > 0) {
        //getting uniq documents based on documentId
        kycDoc = _underscore.uniq(countryBasedDoc, function (kyc) {
          let docId = kyc&&kyc.documentId?kyc.documentId:""
          return docId;
        });
        return kycDoc
      }else{
        return kycDoc
      }
      return kycDoc
    }

  }


  //checking for the email exist or not
  let user = MlRegistration.find({"$and": [{"registrationInfo.email": email}, {"status": "REG_USER_APR"}]}).fetch();
  if (user && user.length > 0) {
    let ApprovedKyc = [];
    let kycDoc = null;
    //if user exist get the KYC of  approved Users
    for (let j = 0; j < user.length; j++) {
      if (user[j].kycDocuments) {
        let kyc = user[j].kycDocuments
        for (let i = 0; i < kyc.length; i++) {
          ApprovedKyc.push(kyc[i])
        }
      }
    }
    kycDoc = _.uniqBy(ApprovedKyc, function (kyc) {
      let docId = kyc&&kyc.documentId?kyc.documentId:""
      //let docTypeId = kyc&&kyc.docTypeId?kyc.docTypeId:""
      return docId;
    });


    if (kycDoc) {
      //get the kyc for multiple profile createria
      //kycProcessDoc = getTheKyc(email)
      kycProcessDoc=getTheUserKYC()
      if (kycProcessDoc) {
        let props = ['documentId', 'docTypeId'];
        let Documents = [], MatchingDocuments = []
       // let latestKyc = kycProcessDoc.processDocuments;
        let latestKyc=kycProcessDoc
        if (latestKyc.length > 0) {
          //matching the documents in both latestkyc and alredy approved kyc
          for (var i = 0; i < kycDoc.length; i++) {
            for (var j = 0; j < latestKyc.length; j++) {
              if ((kycDoc[i]&&kycDoc[i].documentId?kycDoc[i].documentId:"" == latestKyc[j]&&latestKyc[j].documentId?latestKyc[j].documentId:"") && (kycDoc[i]&&kycDoc[i].docTypeId?kycDoc[i].docTypeId:"" == latestKyc[j]&&latestKyc[j].docTypeId?latestKyc[j].docTypeId:"")) {
                MatchingDocuments.push(kycDoc[i])
              }
            }
          }
          //if matching documents available
          MatchingDocuments = _.uniqBy(MatchingDocuments, function(elem) { return [elem.docTypeId, elem.documentId].join(); }); //to remove if there are any duplicate documents
          if (MatchingDocuments && MatchingDocuments.length > 0) {
            //search for unmatched documents in latestkyc
            for (var i = 0, len = MatchingDocuments.length; i < len; i++) {
              for (var j = 0, len2 = latestKyc.length; j < len2; j++) {
                if ((MatchingDocuments[i].documentId === latestKyc[j].documentId) && (MatchingDocuments[i].docTypeId === latestKyc[j].docTypeId)) {
                  latestKyc.splice(j, 1);
                  len2 = latestKyc.length;
                }
              }
            }

            //if unmatched docs found pushed to matching doc and return the documents
            if (latestKyc && latestKyc.length) {
              for (let i = 0; i < latestKyc.length; i++) {
                MatchingDocuments.push(latestKyc[i])
              }
              if (MatchingDocuments&&MatchingDocuments.length>0) {
                return MatchingDocuments

              }

            } else {
              //if no docs found in latest kyc  return matching docs
              if (MatchingDocuments&&MatchingDocuments.length>0) {
                return MatchingDocuments

              }
            }
          }
          else {
            //if no matching documents return the latest kyc
            if (latestKyc&&latestKyc.length>0) {
              return latestKyc

            }

          }
        } else {
          return kycProcessDoc
        }
      }

    }

  } else {

   let  userKYC=getTheUserKYC()
    userKYC = _underscore.uniq(userKYC, function (kyc) {
      let docId = kyc&&kyc.documentId?kyc.documentId:""
      return docId;
    });
    return userKYC&&userKYC.length?userKYC : []
  }
    function getTheUserKYC() {
    let countryBasedDoc=[]
      if (country) {
        //find clusterId of your country code
        let response = mlDBController.findOne('MlClusters', {countryId: country})
        if (response && response._id) {
           countryBasedDoc = getCountryBasedDocuments(response._id);
          if (countryBasedDoc) {
            console.log(countryBasedDoc);
            //return countryBasedDoc
          }
        }
      }
      if (selectedSubChapters) {
        let isNonMoolyaSubChapter = mlDBController.findOne('MlSubChapters', {
          "_id": selectedSubChapters,
          isDefaultSubChapter: false,
          isActive: true
        }, context)
        if (isNonMoolyaSubChapter) {
          let subchapterDocuments = []
          //if nonmooyasubchapter need to show the documents of moolyanad non-moolya subchapter details.
          let moolysSubchapter = mlDBController.findOne('MlSubChapters', {
            "chapterId": chapters,
            isDefaultSubChapter: true,
            isActive: true
          }, context)
          if (moolysSubchapter && moolysSubchapter._id) {
            let processsChapterKYCDoc=[]
            //get the kyc based on moolya-subchapter
            let processschapterDoc = getTheKyc(email, moolysSubchapter._id,isNonMoolyaSubChapter._id)
            if (processschapterDoc&&processschapterDoc.length>0) {
              processschapterDoc.map(function (doc) {
                if (doc.docTypeId != 'self' && doc.isActive == true) {
                  processsChapterKYCDoc.push(doc)
                }
              })
            }
            let finalKYC=[]
            //get the selected subchapter based kyc
            let kyc=selectedSubChapterKYC()
            let subchapterKYC= processsChapterKYCDoc.concat(kyc)
            ///retun the unique docuumnets
            //if country based documents available
            if(countryBasedDoc&&countryBasedDoc.length>0){
               finalKYC= countryBasedDoc.concat(subchapterKYC)
            }else{
              finalKYC=subchapterKYC
            }

            /*finalKYC = _underscore.uniq(finalKYC, function (kyc) {
              let docId = kyc&&kyc.documentId?kyc.documentId:""
              return docId;
            });*/
            finalKYC = _underscore.uniq(finalKYC, kyc => [kyc&&kyc.docTypeId?kyc.docTypeId:"", kyc&&kyc.documentId?kyc.documentId:""].join());
            return finalKYC
          } else {
            let finalKYC=[]
            //get the kyc based on selected subchapter
            let kyc=selectedSubChapterKYC()
            if(kyc){
              //if country based documents available
              if(countryBasedDoc&&countryBasedDoc.length>0){
                 finalKYC= countryBasedDoc.concat(kyc)
              }else{
                finalKYC= kyc
              }
              ///return the unique docuumnets
              /*finalKYC = _underscore.uniq(finalKYC, function (kyc) {
                return kyc.documentId;
              });*/
              finalKYC = _underscore.uniq(finalKYC, kyc => [kyc&&kyc.docTypeId?kyc.docTypeId:"", kyc&&kyc.documentId?kyc.documentId:""].join());
              return finalKYC
            }else{
              return countryBasedDoc
            }

          }
        } else {
          //get the kyc based on selected subchapter
          let kyc=selectedSubChapterKYC()
          if(kyc&&kyc.length>0){
            let finalKYC=[];
            //if country based documents available
            if(countryBasedDoc&&countryBasedDoc.length>0){
               finalKYC= countryBasedDoc.concat(kyc);
            }else {
              finalKYC=kyc
            }
            ///return the unique docuumnets
            /*finalKYC = _underscore.uniq(finalKYC, function (kyc) {
              return kyc.documentId;
            });*/
            finalKYC = _underscore.uniq(finalKYC, kyc => [kyc&&kyc.docTypeId?kyc.docTypeId:"", kyc&&kyc.documentId?kyc.documentId:""].join());
            return finalKYC
          }else{
            return countryBasedDoc
          }


        }
      }else{
        return countryBasedDoc
      }
    }
    function selectedSubChapterKYC(){
      let processsChapterKYCDoc = []
      let processschapterDoc = getTheKyc(email, selectedSubChapters,null)
      if (processschapterDoc && processschapterDoc.length>0) {
        //fetching the chapter and process based documents documents from processDocuments
        processschapterDoc.map(function (doc) {
          if (doc.docTypeId != 'self' && doc.isActive == true) {
            processsChapterKYCDoc.push(doc)
          }
        })
        return processsChapterKYCDoc
      }
    }
    return
  }




MlResolver.MlQueryResolver['fetchKYCDocuments'] = (obj, args, context, info) => {

  let clusters=args.clusters;
  let chapters=args.chapters;
  let subChapters=args.subChapters;
  let communities=args.community;
  let kycCategory=args.kyc;
  let documentTyp=args.documentType;
  let process=null
  let specificQuery=[];

  //check for specific condition for all criteria fields of processmapping
  if((clusters&&clusters.length>0)&&(chapters&&chapters.length>0)&&(subChapters&&subChapters.length>0)&&(communities&&communities.length>0)){
    let val={clusters,chapters,subChapters,communities}
      let result = fetchProcessDocumentProxy(val);
    if(result){
      return result
    }
  }
  //check for all or specific condition for all criteria fields of processmapping
  let val={clusters,chapters,subChapters,communities}
  for (var key in val) {
    let qu={};
    let values =val[key]
    let stringValues =  values.toString();
    qu[key]={$in:['all',stringValues]};
    specificQuery.push(qu);
  }
  let query={$and:specificQuery}
  process=fetchProcessDocumentProxy(query);
  if(process){
    return process
  }
  //check for 'all' condition on criteria fields of processmapping
  let allVal={clusters:"all",chapters:"all",subChapters:"all",communities:"all"}
  process=fetchProcessDocumentProxy(allVal);
  if(process){
    return process
  }



  /*let result;
  if(args.clusters&&args.chapters&&args.subChapters&&args.community&&args.kyc&&args.documentType){
    result = MlProcessMapping.find({"$and":[{ 'documents.category' : args.kyc ,'documents.type': args.documentType, clusters: {$in: args.clusters},
      chapters: {$in: args.chapters},
      subChapters:{$in: args.subChapters},communities:{$in: [args.community]},isActive:true}]}).fetch()
  }
*/

  function fetchProcessDocumentProxy(query){
    let data;
    if(args.kyc && args.documentType){
      let document= MlProcessMapping.findOne({ $and: [query,{'documents.category' : args.kyc ,'documents.type': args.documentType,"isActive":true}]})
      if(document && document.processDocuments){
        data=document.processDocuments;
        data.map(function (doc,index) {
          const allowableFormatData =  MlDocumentFormats.find( { _id: { $in: doc.allowableFormat } } ).fetch() || [];
          let allowableFormatNames = [];  //@array of strings
          allowableFormatData.map(function (doc) {
            allowableFormatNames.push(doc.docFormatName)
          });
          data[index].allowableFormat = allowableFormatNames || [];
        });
        return data
      }
    }

  }
  /*let processDocuments = []
  if(result && result.length>0){
    for(let i=0;i < result.length;i++){
      processDocuments.push(result[i].processDocuments)
    }
    return processDocuments&&processDocuments[0]
  }else{
    return;
  }*/


}
