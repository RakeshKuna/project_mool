import SimpleSchema from 'simpl-schema';
/*
* Created by Sireesha on 1/5/2017
*
* */
MlFiltersCatalog = new Mongo.Collection('mlFiltersCatalog');

MlFilterCatalogSpecifics=new SimpleSchema({
  'name':{
    type:String,
    optional:true
  },
  'type':{
    type:String,
    optional:true
  },
  'resolverName' : {
    type:String,
    optional:true
  },
  'isDynamic' : {
    type:Boolean,
    optional:true
  }
})

MlFiltersCatalogSchema = new SimpleSchema({
    _id:{
      type:String,
      optional:true
    },
    moduleName:{
      type:String,
      optional:true
    },
    fields :{
      type:Array,
      optional:true
    },

    "fields.$":{
      type:MlFilterCatalogSpecifics,
      optional:true
    },
    createdDateTime:{
      type : String,
      optional:true
    }
})

MlFiltersCatalog.attachSchema(MlFiltersCatalogSchema);
MlCollections['MlFiltersCatalog'] = MlFiltersCatalog;

