import SimpleSchema from 'simpl-schema';
import MlCollections from '../../common/commonSchemas';
/**
 * Created by venkatasrinag on 25/1/17.
 */
MlSubDepartments = new Mongo.Collection('mlSubDepartments');

MlSubDepartmentSchema = new SimpleSchema({

    subDepartmentName:{
        type:String,
        optional:false
    },

    displayName:{
      type:String,
      optional:true
    },

    aboutSubDepartment :{
      type:String,
      optional:true
    },

    isActive:{
      type:Boolean,
      optional:false
    },

    departmentId:{
      type:String,
      optional:false
    },
    isMoolya:{
      type:Boolean,
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

  isSystemDefined : {
      type : Boolean,
      optional : true,
      defaultValue : false
    },

    subDepatmentAvailable:{
      type:Array,
      optional:true
    },

    'subDepatmentAvailable.$':{
      type:Object,
      optional:true
    },

  'subDepatmentAvailable.$.cluster':{
    type:Array,
    optional:true
  },
  'subDepatmentAvailable.$.cluster.$':{
    type:String,
    optional:true
  },
    'subDepatmentAvailable.$.chapter':{
      type:String,
      optional:true
    },
    'subDepatmentAvailable.$.subChapter':{
      type:String,
      optional:true
    },
    'subDepatmentAvailable.$.email':{
      type:String,
      optional:true
    },
    'subDepatmentAvailable.$.isActive':{
      type:Boolean,
      optional:true
    }

})


MlSubDepartments.attachSchema(MlSubDepartmentSchema);
MlCollections['MlSubDepartments'] = MlSubDepartments;
