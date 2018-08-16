/**
 * Created by venkatsrinag on 21/4/17.
 */
import SimpleSchema from 'simpl-schema';
import MlCollections from '../../../common/commonSchemas'
MlTechnologies = new Mongo.Collection('mlTechnologies');

MlTechnologiesSchema = new SimpleSchema({
  technologyName:{
    type:String,
    optional:false
  },
  displayName:{
    type:String,
    optional:true
  },
  icon:{
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


MlTechnologies.attachSchema(MlTechnologiesSchema);
MlCollections['MlTechnologies'] = MlTechnologies;
