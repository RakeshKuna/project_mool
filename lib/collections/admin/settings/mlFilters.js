import SimpleSchema from 'simpl-schema';
/**
 * Created by muralidhar on 14/02/17.
 */
MlFilters = new Mongo.Collection('mlFilters');

fieldListSpecifics=new SimpleSchema({
  departmentId:{
    type:String,
    optional:false
  },
  subDepartmentId:{
    type: String,
    optional:false
  },
  roleId:{
    type: Array,
    optional:true
  },
  "roleId.$":{
    type: String,
    optional:true
  },
  listValueId:{
    type: Array,
    optional:true
  },
  "listValueId.$":{
    type: String,
    optional:true
  }
})

MlFilterSpecifics=new SimpleSchema({
  'fieldName':{
    type:String,
    optional:true
  },

  'displayName':{
    type:String,
    optional:true
  },

  'isActive':{
    type:Boolean,
    optional:true
  },

  /*'isRestrictedFilter':{
    type:Boolean,
    optional:true,
    defaultValue : false
  },*/

  'fieldType':{
    type:String,
    optional:true
  },
  'fieldResolverName' : {
    type:String,
    optional:true
  },
  'isDynamic' : {
    type:Boolean,
    optional:true
  },
  'fieldList' : {
    type: Array,
    optional : true
  },
  'fieldList.$' : {
    type: fieldListSpecifics,
    optional : true
  },
  'isCustom' : {
    type:Boolean,
    optional:true
  },
  'clearFields' : {
    type: Array,
    optional : true
  },
  'clearFields.$' : {
    type: String,
    optional : true
  }
})

MlClusterSpecifics=new SimpleSchema({
  cluster:{
    type:String,
    optional:true
  },

  chapter:{
    type:String,
    optional:true
  },

  subChapter:{
    type:String,
    optional:true
  },

  department:{
    type:String,
    optional:true
  },

  subDepartment:{
    type:String,
    optional:true
  },


  role:{
    type:String,
    optional:true
  }
})

MlFiltersSchema = new SimpleSchema({

    filterName:{
      type:String,
      optional:false
    },
    filterDescription:{
      type:String,
      optional:true
    },
    isActive:{
      type: Boolean,
      optional: true,
      defaultValue: false,
    },
/*
    clusterFields :{
      type:Array,
      optional:true
    },

    "clusterFields.$":{
      type:MlClusterSpecifics,
      optional:true
    },
*/

    moduleName :{
        type:String,
        optional:false
    },

    filterFields :{
      type:Array,
      optional:true
    },

    "filterFields.$":{
      type:MlFilterSpecifics,
      optional:true
    },


})

MlFilters.attachSchema(MlFiltersSchema);
MlCollections['MlFilters'] = MlFilters;

