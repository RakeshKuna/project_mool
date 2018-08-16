import SimpleSchema from 'simpl-schema';


MlDefaultMenus = new Mongo.Collection('mlDefaultMenus');

MlDefaultMenuSchema = new SimpleSchema({
  image:{
    type:String,
    optional: false
  },

  link:{
    type:String,
    optional:false
  },

  name:{
    type:String,
    optional:false
  },
  id:{
    type:String,
    optional:false
  },
  isLink:{
    type:Boolean,
    optional:false
  },
  isMenu:{
    type:Boolean,
    optional:false
  }
})



MlDefaultMenus.attachSchema(MlDefaultMenuSchema);
