import SimpleSchema from 'simpl-schema';
/**
 * Created by muralidhar on 18/02/17.
 */
import MlSchemas from '../../common/commonSchemas'
import MlCollections from '../../common/commonSchemas'

MlProcessMapping = new Mongo.Collection('mlProcessMapping');

MlProcessMappingSchema = new SimpleSchema({
  createdBy:{
    type:String,
    optional: true
  },
  createdDate:{
    type:Date,
    optional:true
  },
  updatedBy:{
    type:String,
    optional: true
  },
  updatedDate:{
    type:Date,
    optional:true
  },
    processId:{
        type:String,
        optional:false
    },
    process:{
        type:String,
        optional:false
    },
    identity:{
       type:String,
      optional:true
    },
    communities:{
      type:Array,
      optional:true
    },
    'communities.$':{
      type:String,
      optional:true
    },
    userTypes:{
      type:Array,
      optional:true
    },
  'userTypes.$':{
      type:String,
      optional:true
    },
    industries:{
      type:Array,
      optional:true
    },
    'industries.$':{
      type:String,
      optional:true
    },
    professions:{
      type:Array,
      optional:true
    },
    'professions.$':{
      type:String,
      optional:true
    },
    clusters:{
      type:Array,
      optional:true
    },
    'clusters.$':{
      type:String,
      optional:true
    },
    states:{
      type:Array,
      optional:true
    },
    'states.$':{
      type:String,
      optional:true
    },
    chapters:{
      type:Array,
      optional:true
    },
    'chapters.$':{
      type:String,
      optional:true
    },

    subChapters:{
      type:Array,
      optional:true
    },
    'subChapters.$':{
      type:String,
      optional:true
    },
  documents:{
    type:Array,
    optional:true
  },
  'documents.$':{
    type:Object,
    optional:true
  },
  'documents.$.type':{
    type:String,
    optional:true
  },
  'documents.$.category':{
    type:String,
    optional:true
  },
  'documents.$.isActive':{
    type:Boolean,
    optional:true
  },
  processDocuments:{
    type:Array,
    optional:true
  },
  'processDocuments.$':{
    type:Object,
    optional:true
  },
  'processDocuments.$.kycCategoryId':{
    type:String,
    optional:true
  },
  'processDocuments.$.kycCategoryName':{
    type:String,
    optional:true
  },
  'processDocuments.$.docTypeId':{
    type:String,
    optional:true
  },
  'processDocuments.$.docTypeName':{
    type:String,
    optional:true
  },
  'processDocuments.$.documentId':{
    type:String,
    optional:true
  },
  'processDocuments.$.documentDisplayName':{
    type:String,
    optional:true
  },
  'processDocuments.$.documentName':{
    type:String,
    optional:true
  },
  'processDocuments.$.isMandatory':{
    type:Boolean,
    optional:true
  },
  'processDocuments.$.isActive':{
    type:Boolean,
    optional:true
  },
  'processDocuments.$.inputLength':{
    type:String,
    optional:true
  },
  'processDocuments.$.allowableMaxSize':{
    type:String,
    optional:true
  },
  'processDocuments.$.allowableFormat':{
    type:Array,
    optional:true
  },
  'processDocuments.$.allowableFormat.$':{
    type:String,
    optional:true
  },
  'processDocuments.$.validity':{
    type:Date,
    optional:true
  },
  'processDocuments.$.docMappingDef':{
    type:String,
    optional:true,
    blackbox:true
  },
  /*'processDocuments.$.mappedDocuments':{
    type:Array,
    optional:true
  },
  'processDocuments.$.mappedDocuments.$':{
    type:Object,
    optional:true
  },
  'processDocuments.$.mappedDocuments.$.mandatory':{
    type:String,
    optional:true
  },
  'processDocuments.$.mappedDocuments.$.isActive':{
    type:String,
    optional:true
  },
  'processDocuments.$.mappedDocuments.$.documentId':{
    type:String,
    optional:true
  },'processDocuments.$.mappedDocuments.$.documentName':{
    type:String,
    optional:true
  },
  'processDocuments.$.mappedDocuments.$.validity':{
    type:String,
    optional:true
  },

  'processDocuments.$.mappedDocuments.$.inputLength':{
    type:String,
    optional:true
  },
  'processDocuments.$.mappedDocuments.$.remarks':{
    type:String,
    optional:true
  },
  'processDocuments.$.mappedDocuments.$.allowableMaxSize':{
    type:String,
    optional:true
  },
  'processDocuments.$.mappedDocuments.$.issuingAuthority':{
    type:String,
    optional:true
  },
  'processDocuments.$.mappedDocuments.$.allowableFormat':{
    type:Array,
    optional:true
  },
  'processDocuments.$.mappedDocuments.$.allowableFormat.$':{
    type:String,
    optional:true
  },
  'processDocuments.$.mappedDocuments.$.clusters':{
    type:Array,
    optional:true
  },
  'processDocuments.$.mappedDocuments.$.clusters.$':{
    type:String,
    optional:true
  },
  'processDocuments.$.mappedDocuments.$.chapters':{
    type:Array,
    optional:true
  },
  'processDocuments.$.mappedDocuments.$.chapters.$':{
    type:String,
    optional:true
  },
  'processDocuments.$.mappedDocuments.$.subChapters':{
    type:Array,
    optional:true
  },
  'processDocuments.$.mappedDocuments.$.subChapters.$':{
    type:String,
    optional:true
  },
  'processDocuments.$.mappedDocuments.$.kycCategory':{
    type:Array,
    optional:true
  },
  'processDocuments.$.mappedDocuments.$.kycCategory.$':{
    type:String,
    optional:true
  },
  'processDocuments.$.mappedDocuments.$.documentType':{
    type:Array,
    optional:true
  },
  'processDocuments.$.mappedDocuments.$.documentType.$':{
    type:String,
    optional:true
  },*/

  isActive:{
      type:Boolean,
      optional:true
    }
})


MlProcessMapping.attachSchema(MlProcessMappingSchema);
MlSchemas["MlProcessMapping"] = MlProcessMappingSchema;
MlCollections['MlProcessMapping'] = MlProcessMapping;
