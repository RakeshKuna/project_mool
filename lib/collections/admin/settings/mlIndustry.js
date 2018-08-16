import SimpleSchema from 'simpl-schema';
import MlSchemas from '../../../common/commonSchemas'
import MlCollections from '../../../common/commonSchemas'

MlIndustries = new Mongo.Collection('mlIndustries');

MlIndustriesSchema = new SimpleSchema({
  industryName:{
    type:String,
    optional:false
  },
  industryDisplayName:{
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


MlIndustries.attachSchema(MlIndustriesSchema);

MlSchemas["MlIndustries"] = MlIndustries;
MlCollections['MlIndustries'] = MlIndustries;
