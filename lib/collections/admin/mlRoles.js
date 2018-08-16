import MlSchemas from '../../common/commonSchemas'
import SimpleSchema from 'simpl-schema';
import MlCollections from '../../common/commonSchemas'
MlRoles = new Mongo.Collection('mlRoles');

MlRolesSchema = new SimpleSchema({

    roleName:{
        type:String,
        optional:false
    },

    displayName:{
        type:String,
        optional:false
    },
    about:{
      type:String,
      optional:true
    },
    roleType : {
        type:String,
        allowedValues: ['moolya', 'non-moolya'],
        optional:true
    },
    subChapter:{
      type:String,
      optional:true
    },
    createdDateTime:{
      type:Date,
      optional:true
    },
    createdBy:{
      type:String,
      optional:true
    },
  updatedDateTime:{
    type:Date,
    optional:true
  },
  updatedBy:{
    type:String,
    optional:true
  },
    userType :{
        type:String,
        optional:true
    },
    description :{
        type:String,
        optional:true
    },
    assignRoles :{
        type:Array,
        optional:true
    },
    'assignRoles.$':{
        type:Object,
        optional:true
    },
    'assignRoles.$.cluster':{
        type:String,
        optional:true
    },

    'assignRoles.$.chapter':{
        type:String,
        optional:true
    },

    'assignRoles.$.subChapter':{
        type:String,
        optional:true
    },

    'assignRoles.$.community':{
      type:String,
      optional:true
    },

    'assignRoles.$.department':{
        type:String,
        optional:true
    },

    'assignRoles.$.subDepartment':{
        type:String,
        optional:true
    },

    'assignRoles.$.isActive':{
        type:Boolean,
        optional:true
    },

    modules :{
        type:Array,
        optional:true
    },

    'modules.$':{
        type:Object,
        optional:true
    },

    'modules.$.moduleId':{
        type:String,
        optional:true
    },

    'modules.$.moduleName':{
      type:String,
      optional:true
    },

    'modules.$.actions':{
      type:Array,
      optional:true
    },

    'modules.$.actions.$':{
      type:Object,
      optional:true
    },

    'modules.$.actions.$.actionId':{
      type:String,
      optional:true
    },

    'modules.$.actions.$.actionCode':{
      type:String,
      optional:true
    },

    'modules.$.fieldRestrictions':{
        type:Array,
        optional:true
    },

    'modules.$.fieldRestrictions.$':{
        type:Object,
        optional:true
    },

    'modules.$.fieldRestrictions.$.fieldName':{
        type:String,
        optional:true
    },

    'modules.$.fieldRestrictions.$.actions':{
      type:Array,
      optional:true
    },

    'modules.$.fieldRestrictions.$.actions.$':{
      type:Object,
      optional:true
    },

    'modules.$.fieldRestrictions.$.actions.$.actionId':{
      type:String,
      optional:true
    },

    'modules.$.validFrom':{
        type : Date,
        optional:true
    },

    'modules.$.validTo':{
        type : Date,
        optional:true
    },

    'modules.$.isActive':{
        type : Boolean,
        optional:true
    },

    isActive :{
        type:Boolean,
        optional:false
    },
    isSystemDefined : {
      type : Boolean,
      optional : true,
      defaultValue : false
    },
    isAnchor : {
      type : Boolean,
      optional : true,
      defaultValue : false
    },
    isHierarchyAssigned:{
      type : Boolean,
      optional : true
    },
    isNonMoolyaAvailable:{
      type : Boolean,
      optional : true
    }
    /*teamStructureAssignment : {
      type:Object,
      optional:true
    },
    'teamStructureAssignment.isAssigned':{
      type:Boolean,
      defaultValue : false,
      optional:true
    },
   'teamStructureAssignment.assignedLevel':{
      type:String,
      optional:true
    },
    'teamStructureAssignment.reportingRole':{
      type:String,
      optional:true
    }*/
})

MlRoles.attachSchema(MlRolesSchema);

MlSchemas["MlRoles"] = MlRolesSchema;
MlCollections['MlRoles'] = MlRoles;
