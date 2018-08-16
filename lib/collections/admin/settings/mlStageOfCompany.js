import SimpleSchema from 'simpl-schema';
import MlCollections from '../../../common/commonSchemas'

MlStageOfCompany = new Mongo.Collection('mlStageOfCompany');

MlStageOfCompanySchema = new SimpleSchema({
  stageOfCompanyName:{
    type:String,
    optional:false
  },
  stageOfCompanyDisplayName:{
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


MlStageOfCompany.attachSchema(MlStageOfCompanySchema);
MlCollections['MlStageOfCompany'] = MlStageOfCompany;
