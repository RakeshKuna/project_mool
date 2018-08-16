import SimpleSchema from 'simpl-schema';
import MlCollections from '../../../common/commonSchemas'

MlProfessions = new Mongo.Collection('mlProfessions');

MlProfessionSchema = new SimpleSchema({
  professionName:{
    type:String,
    optional:false
  },
  professionDisplayName:{
    type:String,
    optional:true
  },
  industryId:{
    type:String,
    optional:true
  },
  industryName:{
    type:String,
    optional:true
  },
  about:{
    type: String,
    optional:true
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
  isActive:{
    type:Boolean,
    optional:true
  }
})

MlProfessions.attachSchema(MlProfessionSchema);
MlCollections['MlProfessions'] = MlProfessions;
