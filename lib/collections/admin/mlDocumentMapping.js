import SimpleSchema from 'simpl-schema';
/**
 * Created by muralidhar on 18/02/17.
 */
import MlSchemas from '../../common/commonSchemas'
import MlCollections from '../../common/commonSchemas'


MlDocumentMapping = new Mongo.Collection('mlDocumentMapping');

MlDocumentMappingSchema = new SimpleSchema({
  documentId:{
    type:String,
    optional:false
  },

  documentDisplayName:{
    type:String,
    optional:false
  },

  allowableFormat:{
    type:Array,
    optional:true
  },

  'allowableFormat.$':{
    type:String,
    optional:true
  },

 /* 'allowableFormat.$.id':{
    type:String,
    optional:true
  },

  'allowableFormat.$.name':{
    type:String,
    optional:true
  },*/

  documentName:{
    type:String,
    optional:false
  },
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

  kycCategory:{
    type:Array,
    optional:false
  },

  'kycCategory.$':{
    type:String,
    optional:true
  },

 /* 'kycCategory.$.id':{
    type:String,
    optional:true
  },

  'kycCategory.$.name':{
    type:String,
    optional:true
  },
*/
  documentType:{
    type:Array,
    optional:false
  },

  'documentType.$':{
    type:String,
    optional:true
  },

  /*'documentType.$.id':{
    type:String,
    optional:true
  },

  'documentType.$.name':{
    type:String,
    optional:true
  },*/

  allowableMaxSize:{
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
 /* 'clusters.$.id':{
    type:String,
    optional:true
  },
  'clusters.$.name':{
    type:String,
    optional:true
  },*/
  chapters:{
    type:Array,
    optional:true
  },
  'chapters.$':{
    type:String,
    optional:true
  },
 /* 'chapters.$.id':{
    type:String,
    optional:true
  },
  'chapters.$.name':{
    type:String,
    optional:true
  },*/
  subChapters:{
    type:Array,
    optional:true
  },
  'subChapters.$':{
    type:String,
    optional:true
  },
  /*'subChapters.$.id':{
    type:String,
    optional:true
  },
  'subChapters.$.name':{
    type:String,
    optional:true
  },*/
  validity:{
    type:Date,
    optional:true
  },
  inputLength:{
    type:String,
    optional:true
  },
  remarks:{
    type:String,
    optional:true
  },
  issuingAuthority:{
    type:String,
    optional:true
  },
  isActive:{
  type:Boolean,
  optional:true
  }
})


MlDocumentMapping.attachSchema(MlDocumentMappingSchema);
MlSchemas["MlDocumentMapping"] = MlDocumentMappingSchema;
MlCollections['MlDocumentMapping'] = MlDocumentMapping;

