import MlResolver from '../../../../commons/mlResolverDef'
import MlRespPayload from '../../../../commons/mlPayload'
import _ from 'lodash';
import _underscore from 'underscore'

MlResolver.MlMutationResolver['createDocument'] = (obj, args, context, info) => {
  let isValidAuth = mlAuthorization.validteAuthorization(context.userId, args.moduleName, args.actionName, args);
  if (!isValidAuth) {
    let code = 401;
    let response = new MlRespPayload().errorPayload("Not Authorized", code);
    return response;
  }
  let query = {
    "$or": [
      {
        documentName: {
          "$regex": new RegExp('^' + args.document.documentName + '$', 'i')
        }
      },
      {
        documentDisplayName: {
          "$regex": new RegExp("^" + args.document.documentDisplayName + '$', 'i')
        }
      }
    ]
  };
  let isFind = MlDocumentMapping.find(query).fetch();
  if (isFind.length) {
    let code = 409;
    let response = new MlRespPayload().errorPayload("'DocumentMapping' already exists!", code);
    return response;
  }
  var firstName = '';
  var lastName = '';
  // let id = MlDepartments.insert({...args.department});
  if (Meteor.users.findOne({_id: context.userId})) {
    let user = Meteor.users.findOne({_id: context.userId}) || {}
    if (user && user.profile && user.profile.isInternaluser && user.profile.InternalUprofile) {

      firstName = (user.profile.InternalUprofile.moolyaProfile || {}).firstName || '';
      lastName = (user.profile.InternalUprofile.moolyaProfile || {}).lastName || '';
    } else if (user && user.profile && user.profile.isExternaluser) { //resolve external user context based on default profile
      firstName = (user.profile || {}).firstName || '';
      lastName = (user.profile || {}).lastName || '';
    }
  }
  let createdBy = firstName + ' ' + lastName
  args.document.createdBy = createdBy;
  args.document.createdDate = new Date();
  var randomId = Math.floor(Math.random() * 90000) + 10000;
  args.document.documentId = "DOC" + randomId
  args.document.validity = args.document && args.document.validity ? new Date(args.document.validity) : null
  // let id = MlDocumentMapping.insert({...args.document});
  let id = mlDBController.insert('MlDocumentMapping', args.document, context);
  if (id) {
    let code = 200;
    let result = {documentId: id}
    let response = new MlRespPayload().successPayload(result, code);
    return response
  }
}
MlResolver.MlMutationResolver['updateDocument'] = (obj, args, context, info) => {
  let isValidAuth = mlAuthorization.validteAuthorization(context.userId, args.moduleName, args.actionName, args);
  if (!isValidAuth) {
    let code = 401;
    let response = new MlRespPayload().errorPayload("Not Authorized", code);
    return response;
  }

  if (args.documentId) {
    let id = args.documentId;
    let query = {
      "documentId": {
        "$ne": id
      },
      "$or": [
        {
          documentName: {
            "$regex": new RegExp('^' + args.document.documentName + '$', 'i')
          }
        },
        {
          documentDisplayName: {
            "$regex": new RegExp("^" + args.document.documentDisplayName + '$', 'i')
          }
        }
      ]
    };
    let isFind = MlDocumentMapping.find(query).fetch();
    if (isFind.length) {
      let code = 409;
      let response = new MlRespPayload().errorPayload("'DocumentMapping' already exists!", code);
      return response;
    }
    args = _.omit(args, '_id');
    var firstName = '';
    var lastName = '';
    // let id = MlDepartments.insert({...args.department});
    if (Meteor.users.findOne({_id: context.userId})) {
      let user = Meteor.users.findOne({_id: context.userId}) || {}
      if (user && user.profile && user.profile.isInternaluser && user.profile.InternalUprofile) {

        firstName = (user.profile.InternalUprofile.moolyaProfile || {}).firstName || '';
        lastName = (user.profile.InternalUprofile.moolyaProfile || {}).lastName || '';
      } else if (user && user.profile && user.profile.isExternaluser) { //resolve external user context based on default profile
        firstName = (user.profile || {}).firstName || '';
        lastName = (user.profile || {}).lastName || '';
      }
    }
    let createdBy = firstName + ' ' + lastName
    args.document.updatedBy = createdBy;
    args.document.updatedDate = new Date();
    args.document.validity = args.document && args.document.validity ? new Date(args.document.validity) : null
    let existingDoc = MlDocumentMapping.findOne({documentId: args.documentId});

    // let result= MlDocumentMapping.update({documentId:args.documentId}, {$set: args.document});
    let result = mlDBController.update('MlDocumentMapping', args.documentId, args.document, {$set: 1}, context);
    let error = false;
    let manditioryStatusError = false;
    if (result) {

      /**
       * @ if allowableformat is changed when updating Document Mapping
       * @ Allowbale format in process documents need to be updated with reference to document id
       * @ DocumentId-Primary key
       * @ Model-ProcessMapping
       */
      let allowableFormatNewArray = args.document && args.document.allowableFormat ? args.document.allowableFormat : []
      let allowableFormatExistingArray = existingDoc && existingDoc.allowableFormat ? existingDoc.allowableFormat : []
      var isAllowableFormat_same = allowableFormatExistingArray.length == allowableFormatNewArray.length && allowableFormatExistingArray.every(function (element, index) {
        return element === allowableFormatNewArray[index];
      });

      /**
       * @ if current document mapping allowable size is changed
       * @ Allowable size of process documents need to be changed wrt documentid
       * @ DocumentId-Primary key
       * @ Model-ProcessMapping
       */

      let documentSizeNewArray = args.document && args.document.allowableMaxSize || ""
      let documentSizeExistingArray = existingDoc.allowableMaxSize || ""

      /**
       * @ if current document mapping status is changed
       * @ Status of process document need to be changed wrt documentid
       * @ DocumentId-Primary key
       * @ Model-ProcessMapping
       */

      let documentStatusNewArray = args.document && args.document.isActive
      let documentStatusExistingArray = existingDoc.isActive

      /**
       * @ if kyc Category is removed when updating Document Mapping
       * @ Particular kyc category need to be dropped from process documents with reference to document id
       * @ DocumentId-Primary key
       * @ Model-ProcessMapping
       */
      let kycCategoryNewArray = args.document && args.document.kycCategory ? args.document.kycCategory : []
      let kycCategoryExistingArray = existingDoc && existingDoc.kycCategory ? existingDoc.kycCategory : []
      var isKYC_same = kycCategoryExistingArray.length == kycCategoryNewArray.length && kycCategoryExistingArray.every(function (element, index) {
        return element === kycCategoryNewArray[index];
      });


      let updatedAllowableFormat;
      let updatedKYC;
      let updatedDocTypes;
      let updateStatus


      if (!isAllowableFormat_same || (documentSizeNewArray != documentSizeExistingArray) || (documentStatusNewArray != documentStatusExistingArray) || !isKYC_same) {
        var resultData = MlProcessMapping.find({
          'processDocuments': {
            $elemMatch: {
              'documentId': existingDoc._id && existingDoc._id
            }
          }
        }).fetch()


        if (resultData && resultData.length > 0) {
          for (var i = 0; i < resultData.length; i++) {
            let kycDocs = resultData && resultData[i].processDocuments && resultData[i].processDocuments.length > 0 ? resultData[i].processDocuments : []
            if (kycDocs && kycDocs.length > 0) {
              _.each(kycDocs, function (event, index) {
                if (event.documentId == existingDoc._id) {
                  if (!isAllowableFormat_same) {
                    event.allowableFormat = allowableFormatNewArray;
                  }
                  if (documentSizeNewArray != documentSizeExistingArray) {
                    event.allowableMaxSize = args.document && args.document.allowableMaxSize ? args.document.allowableMaxSize : "";
                  }
                  if (documentStatusNewArray != documentStatusExistingArray && event.isMandatory) {
                    let updateFail = MlDocumentMapping.update({documentId: args.documentId}, {$set: existingDoc})
                    if (updateFail) {
                      error = true
                    }
                  }
                  if (documentStatusNewArray != documentStatusExistingArray && !event.isMandatory) {
                    event.isActive = args.document && args.document.isActive ? args.document.isActive : true;
                    error = false
                  }
                  if (!isKYC_same && event.isMandatory) {
                    let updateFail = MlDocumentMapping.update({documentId: args.documentId}, {$set: existingDoc})
                    if (updateFail) {
                      manditioryStatusError = true
                    }
                  }

                }
              });
            }
            updatedAllowableFormat = mlDBController.update('MlProcessMapping', {
              "_id": resultData && resultData[i] && resultData[i]._id
            }, {
              "processDocuments": kycDocs,
            }, {$set: true, multi: true}, context)
          }
        }


      }


      if (!manditioryStatusError) {

        let updatedKYCDocs;

        /* if(kycCategoryNewArray&&kycCategoryExistingArray&&kycCategoryNewArray.length>kycCategoryExistingArray.length){
           updatedKYCDocs = _underscore.difference(kycCategoryNewArray,kycCategoryExistingArray)
         }else */
        if (kycCategoryNewArray && kycCategoryExistingArray && kycCategoryNewArray.length < kycCategoryExistingArray.length) {
          updatedKYCDocs = _underscore.difference(kycCategoryExistingArray, kycCategoryNewArray)
        } else {
          updatedKYCDocs = _underscore.difference(kycCategoryExistingArray, kycCategoryNewArray)
        }
        if (updatedKYCDocs && updatedKYCDocs.length > 0) {
          updatedKYC = mlDBController.update('MlProcessMapping', {
            'processDocuments': {
              $exists: true,
              $elemMatch: {
                'documentId': existingDoc._id && existingDoc._id
              },
            }
          }, {
            'processDocuments': {'kycCategoryId': {$in: updatedKYCDocs}}
          }, {$pull: true, multi: true}, context)
        }


      }

      /**
       * @ if document type is removed when updating Document Mapping
       * @ Particular document type need to be dropped from process documents with reference to document id
       * @ DocumentId-Primary key
       * @ Model-ProcessMapping
       */
      let documentTypeNewArray = args.document && args.document.documentType ? args.document.documentType : []
      let documentTypeExistingArray = existingDoc && existingDoc.documentType ? existingDoc.documentType : []
      var isDocType_same = documentTypeExistingArray.length == documentTypeNewArray.length && documentTypeExistingArray.every(function (element, index) {
        return element === documentTypeNewArray[index];
      });

      if (!isDocType_same) {
        let updatedDocTypes = [];
        if (documentTypeNewArray && documentTypeExistingArray && documentTypeNewArray.length < documentTypeExistingArray.length) {
          updatedDocTypes = _underscore.difference(documentTypeExistingArray, documentTypeNewArray)
        } else if (documentTypeNewArray && documentTypeExistingArray && documentTypeNewArray.length == documentTypeExistingArray.length) {
          updatedDocTypes = _underscore.difference(documentTypeExistingArray, documentTypeNewArray)
        }
        if (updatedDocTypes && updatedDocTypes.length > 0) {
          updatedDocTypes = mlDBController.update('MlProcessMapping', {
            'processDocuments': {
              $exists: true,
              $elemMatch: {
                'documentId': existingDoc._id && existingDoc._id
              }
            }
          }, {
            'processDocuments': {'docTypeId': {$in: updatedDocTypes}}
          }, {$pull: true, multi: true}, context)
        }
      }

      /**
       * @ if jusrisdication cluster is changed when updating Document Mapping
       * @ Particular document  need to be dropped from process documents with reference to document id
       * @ DocumentId-Primary key
       * @ Model-ProcessMapping
       */
      let clustersNewArray = args.document && args.document.clusters ? args.document.clusters : []
      let clustersExistingArray = existingDoc && existingDoc.clusters ? existingDoc.clusters : []
      var iscluster_same = clustersExistingArray.length == clustersNewArray.length && clustersExistingArray.every(function (element, index) {
        return element === clustersNewArray[index];
      });

      /**
       * @ if jusrisdication chapter is changed when updating Document Mapping
       * @ Particular document  need to be dropped from process documents with reference to document id
       * @ DocumentId-Primary key
       * @ Model-ProcessMapping
       */
      let chaptersNewArray = args.document && args.document.chapters ? args.document.chapters : []
      let chaptersExistingArray = existingDoc && existingDoc.chapters ? existingDoc.chapters : []
      var ischapter_same = chaptersExistingArray.length == chaptersNewArray.length && chaptersExistingArray.every(function (element, index) {
        return element === chaptersNewArray[index];
      });

      /**
       * @ if jusrisdication sub chapter is changed when updating Document Mapping
       * @ Particular document  need to be dropped from process documents with reference to document id
       * @ DocumentId-Primary key
       * @ Model-ProcessMapping
       */
      let subChaptersNewArray = args.document && args.document.subChapters ? args.document.subChapters : []
      let subChaptersExistingArray = existingDoc && existingDoc.subChapters ? existingDoc.subChapters : []
      var issubchapter_same = subChaptersExistingArray.length == subChaptersNewArray.length && subChaptersExistingArray.every(function (element, index) {
        return element === subChaptersNewArray[index];
      });

      if (!iscluster_same || !ischapter_same || !issubchapter_same) {
        let updatedClustersTypes = mlDBController.update('MlProcessMapping', {
          'processDocuments': {
            $exists: true,
            $elemMatch: {
              'documentId': existingDoc._id && existingDoc._id
            }
          }
        }, {
          'processDocuments': {'documentId': existingDoc._id && existingDoc._id}
        }, {$pull: true, multi: true}, context)
      }

      /**
       * @ if validity is changed when updating Document Mapping
       * @ Particular document  need to be updated from process documents with reference to document id
       * @ DocumentId-Primary key
       * @ Model-ProcessMapping
       */
      let validityNewValue = args.document && args.document.validity ? args.document.validity : null
      let validityExistingValue = existingDoc && existingDoc.validity ? existingDoc.validity : []
      if ((new Date(validityNewValue).getTime() != new Date(validityExistingValue).getTime())) {

        MlProcessMapping.find().forEach(function (doc) {

          MlProcessMapping.update({
              _id: doc._id,
              processDocuments: {
                $elemMatch: {
                  documentId: existingDoc._id,
                }
              }
            },
            {$set: {"processDocuments.$.validity": validityNewValue}});

        })
      }


    }
    if (error || manditioryStatusError) {
      let code = 401;
      let response = new MlRespPayload().errorPayload("Cannot update as existing process documents are mandatory", code);
      return response;
    } else {
      let code = 200;
      let response = new MlRespPayload().successPayload(result, code);
      return response
    }

  }

}
MlResolver.MlQueryResolver['findDocument'] = (obj, args, context, info) => {
  // TODO : Authorization

  if (args.documentId) {
    var id = args.documentId;
    let response = MlDocumentMapping.findOne({"documentId": id});
    return response;
  }

}
MlResolver.MlQueryResolver['findDocuments'] = (obj, args, context, info) => {
  // TODO : Authorization
  let response = MlDocumentMapping.find({}).fetch();
  return response;

}
MlResolver.MlQueryResolver['findProcessDocuments'] = (obj, args, context, info) => {
  // TODO : Authorization
  if (args.kycId && args.processId) {

    var kycId = args.kycId;
    var processId = args.processId
    let response = MlProcessMapping.findOne({"_id": processId});
    if (response) {
      let documents = response.documents;
      let clusterId = response.clusters;
      let chapterId = response.chapters;
      let subChapterId = response.subChapters;
      let docIds = [], data = [];
      for (let i = 0; i < documents.length; i++) {
        if (documents[i].category == kycId && documents[i].isActive == true) {
          docIds.push(documents[i].type)
        }
      }
      var uniquedocId = docIds.filter(function (elem, index, self) {
        return index == self.indexOf(elem);
      })
      if (uniquedocId.length >= 1) {
        let date = new Date();
        date.setHours(0, 0, 0, 0)
        for (let i = 0; i < uniquedocId.length; i++) {
          let Documentdata = MlDocumentMapping.find({
            "$and": [{
              kycCategory: {$in: [kycId]}, documentType: {$in: [uniquedocId[i]]}, clusters: {$in: clusterId},
              chapters: {$in: chapterId},
              subChapters: {$in: subChapterId},
              $or: [{validity: null}, {validity: {"$gte": date}}],
              //validity : {"$gte": new Date()},
              isActive: true
            }]
          }).fetch();

          if (Documentdata.length >= 1) {
            Documentdata.map(function (doc, index) {
              doc.documentType = [];
              Documentdata[index].documentType[0] = uniquedocId[i]
            });
            for (let j = 0; j < Documentdata.length; j++) {
              data.push(Documentdata[j])
            }
          } else {
            let date = new Date();
            date.setHours(0, 0, 0, 0)
            let DocumentdataDetails = MlDocumentMapping.find({
              "$and": [{
                kycCategory: {$in: [kycId]}, documentType: {$in: [uniquedocId[i]]}, clusters: {$in: ["all"]},
                chapters: {$in: ["all"]},
                subChapters: {$in: ["all"]},
                $or: [{validity: null}, {validity: {"$gte": date}}],
                //validity : {"$gte": new Date()},
                isActive: true
              }]
            }).fetch();
            DocumentdataDetails.map(function (doc, index) {
              doc.documentType = [];
              DocumentdataDetails[index].documentType[0] = uniquedocId[i]
            });
            for (let j = 0; j < DocumentdataDetails.length; j++) {
              data.push(DocumentdataDetails[j])
            }
          }

        }
      }

      data.map(function (doc, index) {
        const allowableFormatData = MlDocumentFormats.find({_id: {$in: doc.allowableFormat}}).fetch() || [];
        let allowableFormatNames = [];  //@array of strings
        allowableFormatData.map(function (doc) {
          allowableFormatNames.push(doc.docFormatName)
        });
        data[index].allowableFormat = allowableFormatNames || [];
      });
      return data;
    }


  }
}


MlResolver.MlQueryResolver['fetchKycDocProcessMapping'] = (obj, args, context, info) => {
  // TODO : Authorization
  if (args.documentTypeId && args.clusterId && args.chapterId && args.subChapterId) {
    let id = args.documentTypeId;
    let clusterId = args.clusterId;
    let chapterId = args.chapterId;
    let subChapterId = args.subChapterId;
    clusterId.push("all");
    chapterId.push("all");
    subChapterId.push("all");
    let data = [];
    if (clusterId.length == 1 && clusterId[0] == "all" && chapterId[0] == "all" && subChapterId[0] == "all") {
      data = MlDocumentMapping.find({documentType: {$in: [id]}, isActive: true}).fetch();
    } else {
      let count = 1
      if (clusterId.length >= 1) {
        for (var i = 0; i < clusterId.length; i++) {
          let docResult = MlDocumentMapping.find({
            clusters: {
              $in: [clusterId[i]]
            },
            isActive: true
          }).fetch();
          if (docResult.length >= 1) {
            count++
          }
        }
      }
      if (clusterId.length == (count - 1)) {
        data = MlDocumentMapping.find({
          documentType: {$in: [id]},
          clusters: {$in: clusterId},
          chapters: {$in: chapterId},
          subChapters: {$in: subChapterId},
          isActive: true
        }).fetch();
        if (data.length < 1) {
          data = MlDocumentMapping.find({
            documentType: {$in: [id]},
            clusters: {$in: ["all"]},
            chapters: {$in: ["all"]},
            subChapters: {$in: ["all"]},
            isActive: true
          }).fetch();
        }
      } else { //temporary code written by sireesha
        data = MlDocumentMapping.find({
          documentType: {$in: [id]},
          clusters: {$in: clusterId},
          chapters: {$in: chapterId},
          subChapters: {$in: subChapterId},
          isActive: true
        }).fetch();
      }

    }
    let kycId = []
    data.map(function (doc, index) {

      let kycCategory = doc.kycCategory
      kycCategory.map(function (kyc) {
        kycId.push(kyc)
      });
      /* const kycCategoryData = MlDocumentCategories.find( { _id: { $in: doc.kycCategory } } ).fetch() || [];
       let allowableFormatNames = [];  //@array of strings
       allowableFormatData.map(function (doc) {
         allowableFormatNames.push(doc.docFormatName)
       });
       data[index].allowableFormat = allowableFormatNames || [];*/
    });
    if (kycId.length >= 1) {
      console.log(kycId)
      let uniqueKyc = _.uniq(kycId, function (item, key, a) {
        return item.a;
      });
      console.log(uniqueKyc)
      data = MlDocumentCategories.find({_id: {$in: uniqueKyc}}).fetch() || [];
    }
    return data;
  }
}

