import SimpleSchema from 'simpl-schema';


MlMenus = new Mongo.Collection('mlMenus');

MlMenuSchema = new SimpleSchema({
  name:{
        type:String,
        optional:false
    },
  menu:{
    type:Array,
    optional:true,
    blackbox:true
  },
  'menu.$':{
    type:Object,
    optional:true,
    blackbox:true
  }
})



MlMenus.attachSchema(MlMenuSchema);
